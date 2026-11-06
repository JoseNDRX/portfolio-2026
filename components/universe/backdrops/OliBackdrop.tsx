'use client';

import { useRef } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { useRandomSpawner } from '@/lib/hooks';
import { CONSTELLATIONS, type Constellation } from '@/lib/constellations';
import { randomSpot } from '../spawn';
import type { BackdropSection } from './types';

/* ------------------------------------------------------------------ OLIMPO
   Cada sección con su lugar real de Grecia (fotos de Wikimedia Commons,
   dominio público / CC0), muy tenue, con zoom lento, polvo dorado, una franja
   de greca arriba y constelaciones que aparecen en los márgenes.
   Estilos en app/universe-olimpo.css. */

/** Partículas de polvo dorado por sección. */
const OLI_MOTES: Record<BackdropSection, number> = {
  about: 4, skills: 0, experience: 4, projects: 3, courses: 4, contact: 5, footer: 0,
};

/** Debe coincidir con la duración de .ub-oli-const (universe-olimpo.css). */
const CONST_LIFE_MS = 7000;

type ConstSpawn = { c: Constellation; x: number; y: number; size: number };

function ConstellationSpawner() {
  const { lang } = useI18n();
  // Nunca la misma constelación dos veces seguidas.
  const last = useRef(-1);
  const { ref, items } = useRandomSpawner<ConstSpawn>({
    create: ({ width, height }) => {
      const side = (width - Math.min(1100, width - 48)) / 2;
      const size = side >= 150 ? Math.min(170, side - 30) : 96;
      const spot = randomSpot(width, height);
      let pick = Math.floor(Math.random() * CONSTELLATIONS.length);
      if (pick === last.current) pick = (pick + 1) % CONSTELLATIONS.length;
      last.current = pick;
      return {
        c: CONSTELLATIONS[pick],
        x: Math.max(10, Math.min(spot.x, width - size - 14)),
        y: Math.max(10, Math.min(spot.y, height - size - 40)),
        size,
      };
    },
    lifeMs: CONST_LIFE_MS,
    every: [3600, 6400],
    first: [700, 1900],
    max: 2,
  });

  return (
    <div ref={ref} className="ub-sfx-area">
      {items.map(({ id, c, x, y, size }) => (
        <div key={id} className="ub-oli-const" style={{ left: x, top: y, width: size }}>
          <svg viewBox="-6 -6 112 112" width={size} height={size}>
            {c.lines.map(([a, b], i) => (
              <line
                key={i}
                x1={c.stars[a][0]} y1={c.stars[a][1]} x2={c.stars[b][0]} y2={c.stars[b][1]}
                pathLength={1}
                style={{ animationDelay: `${0.9 + i * 0.16}s` }}
              />
            ))}
            {c.stars.map(([sx, sy, r], i) => (
              <circle key={i} cx={sx} cy={sy} r={r} style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </svg>
          <span className="ub-oli-const-name">{c.name[lang]}</span>
        </div>
      ))}
    </div>
  );
}

/** Cielo con constelaciones para las secciones propias de Olimpo que no usan
    UniverseBackdrop (el Panteón y el Coro). */
export function OliSky({ className = '' }: { className?: string }) {
  return (
    <div className={`ub ub-oli-sky ${className}`} aria-hidden="true">
      <ConstellationSpawner />
    </div>
  );
}

export default function OliBackdrop({ section }: { section: BackdropSection }) {
  const motes = OLI_MOTES[section];
  return (
    <div className={`ub ub-oli ub-oli-${section}`} aria-hidden="true">
      {section !== 'footer' && <div className="ub-oli-photo" />}
      <div className="ub-oli-veil" />
      {section !== 'projects' && (
        <svg className="ub-oli-band" width="100%" height="14">
          <defs>
            <pattern id={`ub-oli-meander-${section}`} width="22" height="14" patternUnits="userSpaceOnUse">
              <path d="M1 13 V2 H19 V10 H7 V5 H14" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </pattern>
          </defs>
          <rect width="100%" height="14" fill={`url(#ub-oli-meander-${section})`} />
        </svg>
      )}
      {Array.from({ length: motes }, (_, i) => (
        <span
          key={i}
          className="ub-oli-mote"
          style={{ left: `${12 + ((i * 23) % 76)}%`, bottom: `${(i * 17) % 30}%`, animationDelay: `${i * 2.1}s` }}
        />
      ))}
      {section !== 'footer' && <ConstellationSpawner />}
    </div>
  );
}
