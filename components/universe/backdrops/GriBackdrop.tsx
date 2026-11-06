'use client';

import { useRandomSpawner } from '@/lib/hooks';
import { randomSpot } from '../spawn';
import type { BackdropSection } from './types';

/* ---------------------------------------------------------------- GRIMORIO
   Paisajes élficos por sección (Pixabay) con velo, rayos de luz, luciérnagas
   y objetos mágicos (pociones, gemas, pergaminos) que aparecen y desaparecen
   en los márgenes. En Proyectos: un portal que deja ver otro mundo.
   Estilos en app/universe-grimorio.css. */

const GRI_FLOATERS = ['cristal', 'elixir-astral', 'elixir-rojo', 'elixir-dorado', 'elixir-turquesa', 'frasco'];
/** Pergaminos (fotos de Pixabay con fondo transparente), un poco más grandes. */
const GRI_SCROLLS = ['pergamino-sellado', 'pergamino'];
/** Debe coincidir con la duración de .ub-gri-ghost (universe-grimorio.css). */
const GHOST_LIFE_MS = 5200;

type Ghost = { src: string; x: number; y: number; size: number; rot: number };

/** Pociones, gemas y pergaminos que aparecen y desaparecen en los márgenes.
    También se usa en el hero de Grimorio. */
export function GhostSpawner() {
  const { ref, items } = useRandomSpawner<Ghost>({
    create: ({ width, height }) => {
      const wide = (width - Math.min(1100, width - 48)) / 2 >= 150;
      // 1 de cada 4 apariciones es un pergamino; el resto, pociones y gemas.
      const isScroll = Math.random() < 0.25;
      const pool = isScroll ? GRI_SCROLLS : GRI_FLOATERS;
      const size = (wide ? 70 + Math.random() * 50 : 46 + Math.random() * 18) * (isScroll ? 1.25 : 1);
      const spot = randomSpot(width, height);
      return {
        src: pool[Math.floor(Math.random() * pool.length)],
        x: Math.max(8, Math.min(spot.x, width - size - 16)),
        y: Math.max(8, Math.min(spot.y, height - size * 1.5 - 8)),
        size,
        rot: Math.round(Math.random() * 24 - 12),
      };
    },
    lifeMs: GHOST_LIFE_MS,
    every: [2200, 4400],
    first: [800, 2000],
    max: 3,
  });

  return (
    <div ref={ref} className="ub-sfx-area">
      {items.map((g) => (
        // eslint-disable-next-line @next/next/no-img-element -- decorativo, tamaño variable y efímero
        <img
          key={g.id}
          className="ub-gri-ghost"
          src={`/universes/grimorio/float/${g.src}.png`}
          alt=""
          style={{ left: g.x, top: g.y, width: g.size, '--rot': `${g.rot}deg` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function GriPortal() {
  return (
    <div className="ub-gri-portal-wrap">
      <div className="ub-gri-portal">
        <div className="ub-gri-portal-world" />
        <div className="ub-gri-portal-swirl" />
      </div>
      <div className="ub-gri-portal-ring" />
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className="ub-gri-spark" style={{ '--a': `${i * 36}deg`, animationDelay: `${i * 0.45}s` } as React.CSSProperties} />
      ))}
    </div>
  );
}

/** Luciérnagas por sección: posición y ritmo fijos por índice (no cambian entre renders). */
const GRI_FIREFLIES = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 37 + 7) % 96}%`,
  bottom: `${(i * 23) % 70}%`,
  delay: `${-(i * 1.7)}s`,
  dur: `${8 + (i % 4) * 1.6}s`,
  tone: i % 3 === 0 ? 't' : 'g',
}));

export default function GriBackdrop({ section }: { section: BackdropSection }) {
  return (
    <div className={`ub ub-gri ub-gri-${section}`} aria-hidden="true">
      {section !== 'footer' && <div className="ub-gri-photo" />}
      <div className="ub-gri-veil" />
      {section !== 'footer' && <div className="ub-gri-rays" />}
      {GRI_FIREFLIES.slice(0, section === 'footer' ? 5 : 12).map((f, i) => (
        <span
          key={i}
          className={`gr-firefly gr-firefly-${f.tone}`}
          style={{ left: f.left, bottom: f.bottom, animationDelay: f.delay, animationDuration: f.dur }}
        />
      ))}
      {section === 'projects' && <GriPortal />}
      {section !== 'footer' && section !== 'projects' && <GhostSpawner />}
    </div>
  );
}
