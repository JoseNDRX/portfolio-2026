'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion';
import ProjectCard, { type Project } from './ProjectCard';

/** Distancia (px) entre un expediente y el siguiente en el eje Z. */
const GAP = 1100;
const NARROW_QUERY = '(max-width: 760px)';
/** Scroll (vh) que consume cada expediente. */
const VH_PER_ITEM = 75;
/** Posición lateral de cada tarjeta: -1 izquierda, 1 derecha. Se repite. */
const LANES = [
  { side: -0.9, y: -4 },
  { side: 0.85, y: 6 },
  { side: -0.55, y: 10 },
  { side: 0.95, y: -6 },
  { side: -1, y: 4 },
  { side: 0.6, y: -10 },
];

type CardProps = {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  narrow: boolean;
  onFocusCard: (index: number) => void;
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const total = projects.length;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  const narrow = useNarrow();

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const i = Math.min(total - 1, Math.max(0, Math.round(p * (total - 1))));
    setActive((prev) => (prev === i ? prev : i));
  });

  // El piso avanza con la cámara para dar sensación de viaje.
  const floorShift = useTransform(scrollYProgress, (p) => `0px ${p * (total - 1) * 160}px`);
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Con teclado: al enfocar una tarjeta lejana, lleva el scroll hasta ella.
  const focusCard = (index: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const scrollable = el.offsetHeight - window.innerHeight;
    const target = top + (total > 1 ? (index / (total - 1)) * scrollable : 0);
    if (Math.abs(window.scrollY - target) > 8) window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <div ref={sectionRef} className="pg-track" style={{ position: 'relative', height: `${total * VH_PER_ITEM + 100}vh` }}>
      <div className="pg-stage">
        <motion.div className="pg-floor" aria-hidden="true" style={{ backgroundPosition: floorShift }} />
        <div className="pg-header">{header}</div>

        <div className="pg-world">
          {projects.map((project, i) => (
            <SpatialCard key={project.id} project={project} index={i} total={total} progress={scrollYProgress} narrow={narrow} onFocusCard={focusCard} />
          ))}
        </div>

        <div className="pg-hud" aria-hidden="true">
          <span className="pg-hud-count">
            {String(active + 1).padStart(2, '0')}
            <span style={{ opacity: 0.45 }}> / {String(total).padStart(2, '0')}</span>
          </span>
          <span className="pg-hud-title">{projects[active]?.title}</span>
        </div>
        <div className="pg-rail" aria-hidden="true">
          <motion.div className="pg-rail-fill" style={{ scaleY: railScale }} />
        </div>
      </div>
    </div>
  );
}
