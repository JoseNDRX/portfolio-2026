'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { NARROW_QUERY, prefersReducedMotion, useMediaQuery } from '@/lib/hooks';
import ProjectCard, { type Project } from './ProjectCard';

/* ---------------------------------------------------------------------------
   Galería en profundidad (Bastión): la cámara avanza entre expedientes.
   La sección mide UNA pantalla y el scroll de la página pasa de largo: la
   galería se maneja por separado (avance automático, botones, flechas del
   teclado, deslizar con el dedo y rueda horizontal).
   --------------------------------------------------------------------------- */

/** Distancia (px) entre un expediente y el siguiente en el eje Z. */
const GAP = 1100;
/** Tiempo que se queda cada expediente antes de avanzar solo. */
const AUTO_MS = 4500;
/** Posición lateral de cada tarjeta: -1 izquierda, 1 derecha. Se repite. */
const LANES = [
  { side: -0.9, y: -4 },
  { side: 0.85, y: 6 },
  { side: -0.55, y: 10 },
  { side: 0.95, y: -6 },
  { side: -1, y: 4 },
  { side: 0.6, y: -10 },
];

const copy = {
  es: { prev: 'Expediente anterior', next: 'Siguiente expediente' },
  en: { prev: 'Previous file', next: 'Next file' },
};

type CardProps = {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  narrow: boolean;
  onFocusCard: (index: number) => void;
};

function SpatialCard({ project, index, total, progress, narrow, onFocusCard }: CardProps) {
  const lane = LANES[index % LANES.length];
  const travel = (total - 1) * GAP;
  // Z efectiva de la tarjeta: 0 = plano de enfoque; negativa = al fondo.
  const z = useTransform(progress, (p) => -index * GAP + p * travel);
  // Aparece desde el fondo y se desvanece rápido al pasar junto a la cámara.
  // En pantallas angostas las tarjetas se enciman, así que la ventana es más corta.
  const opacity = useTransform(
    z,
    narrow ? [-2.2 * GAP, -1.2 * GAP, -0.05 * GAP, 0.05 * GAP, 0.12 * GAP] : [-3.2 * GAP, -1.6 * GAP, -0.1 * GAP, 0.14 * GAP, 0.3 * GAP],
    narrow ? [0, 0.3, 1, 0.15, 0] : [0, 0.55, 1, 0.45, 0],
  );
  const rotateY = useTransform(z, [-2 * GAP, 0, 0.6 * GAP], [lane.side * -18, lane.side * -6, lane.side * -2]);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? 'auto' : 'none'));

  return (
    <motion.div
      className="pg-card"
      style={{
        left: `calc(50% + var(--pg-spread) * ${lane.side})`,
        top: `calc(50% + ${lane.y}vh)`,
        x: '-50%',
        y: '-50%',
        z,
        rotateY,
        opacity,
        pointerEvents,
      }}
    >
      <ProjectCard project={project} index={index} total={total} variant="gallery" onFocus={() => onFocusCard(index)} />
    </motion.div>
  );
}

type Props = {
  projects: readonly Project[];
  header: React.ReactNode;
};

export default function ProjectsGallery({ projects, header }: Props) {
  const { lang } = useI18n();
  const c = copy[lang];
  const stageRef = useRef<HTMLDivElement>(null);
  const total = projects.length;
  const last = Math.max(1, total - 1);
  // 0 = primer expediente, 1 = último. Lo mueve solo la galería, nunca el scroll.
  const progress = useMotionValue(0);
  const [active, setActive] = useState(0);
  const narrow = useMediaQuery(NARROW_QUERY);

  const goTo = useCallback(
    (i: number) => {
      const next = ((i % total) + total) % total; // al pasar del último vuelve al primero
      setActive(next);
      animate(progress, next / last, { type: 'spring', stiffness: 60, damping: 18 });
    },
    [progress, total, last],
  );

  // ---- Avance automático: se pausa con el mouse encima, al interactuar o fuera de pantalla.
  const pause = useRef({ hover: false, until: 0, inView: false });
  const hold = () => {
    pause.current.until = performance.now() + AUTO_MS * 1.5;
  };
  useEffect(() => {
    const el = stageRef.current;
    if (!el || prefersReducedMotion()) return;
    const io = new IntersectionObserver(([e]) => {
      pause.current.inView = e.isIntersecting;
    });
    io.observe(el);
    const id = window.setInterval(() => {
      const p = pause.current;
      if (p.inView && !p.hover && !document.hidden && performance.now() > p.until) goTo(active + 1);
    }, AUTO_MS);
    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, [active, goTo]);

  // ---- Rueda horizontal (trackpad o Shift + rueda); la vertical sigue siendo el scroll de la página.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let lock = 0;
    const onWheel = (e: WheelEvent) => {
      const h = e.shiftKey ? e.deltaY : e.deltaX;
      if (Math.abs(h) <= Math.abs(e.shiftKey ? 0 : e.deltaY) || Math.abs(h) < 12) return;
      e.preventDefault();
      const now = performance.now();
      if (now < lock) return;
      lock = now + 450;
      hold();
      goTo(active + (h > 0 ? 1 : -1));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [active, goTo]);

  // ---- Deslizar con el dedo (o arrastrar con el mouse) de lado.
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) {
      hold();
      goTo(active + (dx < 0 ? 1 : -1));
    }
  };

  // ---- Teclado: flechas dentro de la galería; al enfocar una tarjeta lejana, la trae al frente.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      hold();
      goTo(active + (e.key === 'ArrowRight' ? 1 : -1));
    }
  };
  const focusCard = (index: number) => {
    hold();
    if (index !== active) goTo(index);
  };

  // El piso avanza con la cámara para dar sensación de viaje.
  const floorShift = useTransform(progress, (p) => `0px ${p * last * 160}px`);
  const railScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="pg-track">
      <div
        ref={stageRef}
        className="pg-stage"
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') pause.current.hover = true;
        }}
        onPointerLeave={() => {
          pause.current.hover = false;
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <motion.div className="pg-floor" aria-hidden="true" style={{ backgroundPosition: floorShift }} />
        <div className="pg-header">{header}</div>

        <div className="pg-world">
          {projects.map((project, i) => (
            <SpatialCard key={project.id} project={project} index={i} total={total} progress={progress} narrow={narrow} onFocusCard={focusCard} />
          ))}
        </div>

        <div className="pg-hud">
          <span className="pg-hud-count" aria-live="polite">
            {String(active + 1).padStart(2, '0')}
            <span style={{ opacity: 0.45 }}> / {String(total).padStart(2, '0')}</span>
          </span>
          <span className="pg-hud-title">{projects[active]?.title}</span>
          <div className="pg-nav">
            <button type="button" className="pg-nav-btn" aria-label={c.prev} onClick={() => { hold(); goTo(active - 1); }}>
              <ChevronLeft size={20} />
            </button>
            <button type="button" className="pg-nav-btn" aria-label={c.next} onClick={() => { hold(); goTo(active + 1); }}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="pg-rail" aria-hidden="true">
          <motion.div className="pg-rail-fill" style={{ scaleY: railScale }} />
        </div>
      </div>
    </div>
  );
}
