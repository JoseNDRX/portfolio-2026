'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'framer-motion';
import { useI18n } from '@/lib/i18n-context';
import { mediaFor } from '@/lib/project-media';
import type { Project } from './ProjectCard';
import ProjectDetail from './ProjectDetail';

/* ---------------------------------------------------------------------------
   Archivo inmersivo: un lienzo infinito de tarjetas a distintas profundidades.
   - Arrastrar (mouse / dedo) mueve el archivo en cualquier dirección, con inercia.
   - El scroll de la página también lo recorre (hacia abajo), así nunca atrapa.
   - Rueda horizontal o Shift + rueda lo mueve de lado.
   - Clic en una tarjeta → vista de detalle.
   --------------------------------------------------------------------------- */

const LAYOUT = {
  wide: { cols: 6, rows: 4, cellW: 380, cellH: 330, tileW: 260 },
  narrow: { cols: 4, rows: 5, cellW: 250, cellH: 250, tileW: 180 },
};
/** Profundidades: <1 = más al fondo (más chica y lenta), >1 = más cerca. */
const DEPTHS = [0.72, 0.86, 1, 1.14];
const NARROW_QUERY = '(max-width: 760px)';
const noopSubscribe = () => () => {};
/** Velocidad del movimiento propio (px/s) y espera tras la última interacción. */
const DRIFT = { x: 26, y: 12 };
const IDLE_DELAY_MS = 1800;

const copy = {
  es: { hint: 'Arrastra para explorar · Clic para abrir', open: 'Abrir proyecto' },
  en: { hint: 'Drag to explore · Click to open', open: 'Open project' },
};

function useNarrow() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(NARROW_QUERY);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(NARROW_QUERY).matches,
    () => false,
  );
}

/** Número pseudoaleatorio estable (0..1) para que el mosaico no cambie entre renders. */
function seeded(n: number) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const wrap = (v: number, size: number) => ((((v + size / 2) % size) + size) % size) - size / 2;

type Tile = {
  key: number;
  projectIndex: number;
  baseX: number;
  baseY: number;
  depth: number;
  primary: boolean;
};

type TileProps = {
  tile: Tile;
  project: Project;
  image: string;
  category: string;
  total: number;
  panX: MotionValue<number>;
  panY: MotionValue<number>;
  boardW: number;
  boardH: number;
  tileW: number;
  openLabel: string;
  onOpen: (projectIndex: number) => void;
  onFocusTile: (x: number, y: number, depth: number) => void;
  wasDragged: () => boolean;
};

function ArchiveTile({ tile, project, image, category, total, panX, panY, boardW, boardH, tileW, openLabel, onOpen, onFocusTile, wasDragged }: TileProps) {
  const x = useTransform(panX, (p) => wrap(tile.baseX + p * tile.depth, boardW));
  const y = useTransform(panY, (p) => wrap(tile.baseY + p * tile.depth, boardH));
  const num = String(tile.projectIndex + 1).padStart(2, '0');
  const width = Math.round(tileW * tile.depth);

  return (
    <motion.button
      type="button"
      className="pa-tile"
      style={{ x, y, z: (tile.depth - 1) * 500, width, zIndex: Math.round(tile.depth * 10) }}
      tabIndex={tile.primary ? 0 : -1}
      aria-hidden={tile.primary ? undefined : true}
      // Las copias repetidas no deben tomar el foco (están ocultas para lectores de pantalla).
      onMouseDown={tile.primary ? undefined : (e) => e.preventDefault()}
      aria-label={`${openLabel}: ${project.title} (${num} / ${String(total).padStart(2, '0')})`}
      onClick={() => {
        if (!wasDragged()) onOpen(tile.projectIndex);
      }}
      onFocus={(e) => {
        // Solo con teclado: con el mouse el clic ya basta.
        if (e.currentTarget.matches(':focus-visible')) onFocusTile(x.get(), y.get(), tile.depth);
      }}
    >
      <span className="pa-media">
        <Image src={image} alt="" fill sizes={`${width}px`} draggable={false} />
        <span className="pa-num">{num}</span>
      </span>
      <span className="pa-caption">
        <span className="pa-meta">
          {category} · {project.year}
        </span>
        <span className="pa-title">{project.title}</span>
      </span>
    </motion.button>
  );
}

type Props = {
  projects: readonly Project[];
  header: React.ReactNode;
  /** Fondo temático del universo, detrás de las tarjetas. */
  backdrop?: React.ReactNode;
};

export default function ProjectsArchive({ projects, header, backdrop }: Props) {
  const { lang } = useI18n();
  const narrow = useNarrow();
  // Las tarjetas dependen del scroll y del ancho de pantalla, que no existen en
  // el servidor: se dibujan solo en el navegador para evitar errores de hidratación.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const L = narrow ? LAYOUT.narrow : LAYOUT.wide;
  const boardW = L.cols * L.cellW;
  const boardH = L.rows * L.cellH;
  const total = projects.length;

  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);

  // Desplazamiento por arrastre (dragX/Y) + recorrido por scroll de página (scrollY).
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const panX = dragX;
  const panY = useTransform([dragY, scrollYProgress], ([d, p]: number[]) => d - p * boardH * 0.85);

  // Inclinación 3D según la velocidad del arrastre.
  const vx = useVelocity(dragX);
  const vy = useVelocity(dragY);
  const tiltY = useSpring(useTransform(vx, [-2500, 2500], [9, -9], { clamp: true }), { stiffness: 120, damping: 20 });
  const tiltX = useSpring(useTransform(vy, [-2500, 2500], [-7, 7], { clamp: true }), { stiffness: 120, damping: 20 });

  // Mosaico: cada celda lleva un proyecto (repetidos), con desfase y profundidad estables.
  const tiles = useMemo<Tile[]>(() => {
    const out: Tile[] = [];
    const seen = new Set<number>();
    for (let i = 0; i < L.cols * L.rows; i++) {
      const col = i % L.cols;
      const row = Math.floor(i / L.cols);
      const projectIndex = (col + row * 2) % total;
      const primary = !seen.has(projectIndex);
      seen.add(projectIndex);
      out.push({
        key: i,
        projectIndex,
        baseX: col * L.cellW + (seeded(i) - 0.5) * L.cellW * 0.35 + (row % 2) * L.cellW * 0.5,
        baseY: row * L.cellH + (seeded(i + 99) - 0.5) * L.cellH * 0.3,
        depth: DEPTHS[Math.floor(seeded(i + 7) * DEPTHS.length)],
        primary,
      });
    }
    return out;
  }, [L, total]);

  // ---- Arrastre con inercia ----
  const drag = useRef({ active: false, moved: 0, lastX: 0, lastY: 0, lastT: 0, vx: 0, vy: 0, raf: 0 });

  const stopInertia = () => cancelAnimationFrame(drag.current.raf);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    stopInertia();
    const d = drag.current;
    d.active = true;
    d.moved = 0;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.lastT = performance.now();
    d.vx = 0;
    d.vy = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.lastX;
    const dy = e.clientY - d.lastY;
    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    d.moved += Math.abs(dx) + Math.abs(dy);
    if (d.moved > 6 && !stageRef.current?.hasPointerCapture(e.pointerId)) {
      stageRef.current?.setPointerCapture(e.pointerId);
    }
    dragX.set(dragX.get() + dx);
    // En táctil el gesto vertical lo maneja el scroll de la página (touch-action: pan-y).
    if (e.pointerType !== 'touch') dragY.set(dragY.get() + dy);
    d.vx = (dx / dt) * 16;
    d.vy = e.pointerType !== 'touch' ? (dy / dt) * 16 : 0;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.lastT = now;
  };

  const onPointerUp = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    const step = () => {
      d.vx *= 0.94;
      d.vy *= 0.94;
      dragX.set(dragX.get() + d.vx);
      dragY.set(dragY.get() + d.vy);
      if (Math.abs(d.vx) > 0.2 || Math.abs(d.vy) > 0.2) d.raf = requestAnimationFrame(step);
    };
    d.raf = requestAnimationFrame(step);
  };

  // Rueda horizontal (trackpad o Shift + rueda) mueve el archivo de lado.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const horizontal = e.shiftKey ? e.deltaY : e.deltaX;
      if (Math.abs(horizontal) > Math.abs(e.shiftKey ? 0 : e.deltaY)) {
        e.preventDefault();
        stopInertia();
        dragX.set(dragX.get() - horizontal);
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [dragX]);

  useEffect(() => () => stopInertia(), []);

  // ---- Movimiento propio ----
  // Mientras nadie interactúa, el archivo deriva solo. Se detiene al pasar el
  // mouse, arrastrar, usar el teclado o abrir un proyecto, y vuelve a arrancar
  // (con aceleración suave) un momento después.
  const idle = useRef({ hovering: false, lastInteraction: 0, speed: 0, inView: false });
  const selectedRef = useRef<number | null>(null);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const markInteraction = () => {
    idle.current.lastInteraction = performance.now();
  };

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      idle.current.inView = entry.isIntersecting;
    });
    io.observe(el);

    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - prev) / 1000;
      prev = now;
      const s = idle.current;
      const busy =
        s.hovering || drag.current.active || selectedRef.current !== null || now - s.lastInteraction < IDLE_DELAY_MS;
      // Acelera / frena con suavidad hacia la velocidad objetivo.
      const target = busy || !s.inView || document.hidden ? 0 : 1;
      // Arranca despacio (≈1 s) y frena rápido (≈0.3 s) al detectar interacción.
      s.speed += (target - s.speed) * Math.min(1, dt * (target ? 2.2 : 9));
      if (!target && s.speed < 0.02) s.speed = 0;
      if (s.speed > 0.001) {
        dragX.set(dragX.get() - DRIFT.x * s.speed * dt);
        dragY.set(dragY.get() - DRIFT.y * s.speed * dt);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [dragX, dragY]);

  // Teclado: al enfocar una tarjeta, el archivo se mueve para centrarla.
  const focusTile = (x: number, y: number, depth: number) => {
    stopInertia();
    animate(dragX, dragX.get() - x / depth, { type: 'spring', stiffness: 160, damping: 26 });
    animate(dragY, dragY.get() - y / depth, { type: 'spring', stiffness: 160, damping: 26 });
  };

  const media = projects.map((p, i) => mediaFor(p.id, i, lang));
  const c = copy[lang];

  return (
    <div ref={trackRef} className="pa-track" style={{ position: 'relative' }}>
      <div
        ref={stageRef}
        className="pa-stage"
        onPointerDown={(e) => {
          markInteraction();
          onPointerDown(e);
        }}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => {
          markInteraction();
          onPointerUp();
          // En táctil no hay "hover": se cuenta como interacción y vuelve a derivar después.
          if (e.pointerType !== 'mouse') idle.current.hovering = false;
        }}
        onPointerCancel={() => {
          markInteraction();
          onPointerUp();
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') idle.current.hovering = true;
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') {
            idle.current.hovering = false;
            markInteraction();
          }
        }}
        onFocusCapture={markInteraction}
        onWheelCapture={markInteraction}
      >
        {backdrop}
        <motion.div className="pa-world" style={{ rotateX: tiltX, rotateY: tiltY }}>
          {mounted && tiles.map((tile) => (
            <ArchiveTile
              key={tile.key}
              tile={tile}
              project={projects[tile.projectIndex]}
              image={media[tile.projectIndex].image}
              category={media[tile.projectIndex].category}
              total={total}
              panX={panX}
              panY={panY}
              boardW={boardW}
              boardH={boardH}
              tileW={L.tileW}
              openLabel={c.open}
              onOpen={setSelected}
              onFocusTile={focusTile}
              wasDragged={() => drag.current.moved > 6}
            />
          ))}
        </motion.div>

        <div className="pa-vignette" aria-hidden="true" />
        <div className="pa-header">{header}</div>
        <div className="pa-hint" aria-hidden="true">
          <span className="pa-hint-dot" />
          {c.hint}
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <ProjectDetail
            key="detail"
            projects={projects}
            index={selected}
            image={media[selected].image}
            category={media[selected].category}
            onChange={setSelected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
