'use client';

import { WALL_PATH } from '@/components/heroes/HeroBastion';
import type { BackdropSection } from './types';

/* ---------------------------------------------------------------------------
   BASTIÓN · fondos por sección: fantasía militar (sin personajes ni emblemas
   de ninguna franquicia).
   - Murallas y ruinas reales (fotos de Pixabay) con color de brasa.
   - Fuego cruzado: ráfagas de balas trazadoras que cruzan desde ambos lados.
   - Cohetes que despegan dejando una estela de humo.
   - Cables de maniobra (Habilidades) y bengalas de señales (Carta).
   Estilos en app/universe-bastion.css.
   --------------------------------------------------------------------------- */

/** Ráfagas de trazadoras: cada ráfaga son 3 balas seguidas desde el mismo punto.
    Posiciones y tiempos fijos por índice (no cambian entre renders). */
const BURSTS = [
  { top: 18, from: 'left', angle: -9, delay: 0, dur: 4.2 },
  { top: 62, from: 'right', angle: 12, delay: 1.3, dur: 5.1 },
  { top: 38, from: 'left', angle: 6, delay: 2.6, dur: 4.6 },
  { top: 80, from: 'right', angle: -7, delay: 3.4, dur: 5.6 },
  { top: 50, from: 'left', angle: -15, delay: 4.5, dur: 4.9 },
] as const;

/** Cohetes: despegan desde abajo con una leve inclinación. */
const ROCKETS = [
  { left: 12, tilt: 8, delay: 0, dur: 7.5 },
  { left: 78, tilt: -10, delay: 3.2, dur: 8.5 },
  { left: 46, tilt: 4, delay: 5.8, dur: 9 },
];

/** Fuego cruzado + cohetes (fondos de las secciones; el hero no los lleva). */
export function Crossfire({ rockets = true, bursts = BURSTS.length }: { rockets?: boolean; bursts?: number }) {
  return (
    <div className="ub-bas-fire" aria-hidden="true">
      {BURSTS.slice(0, bursts).map((b, i) => (
        <div
          key={i}
          className={`ub-bas-burst from-${b.from}`}
          style={{ top: `${b.top}%`, rotate: `${b.angle}deg`, '--d': `${b.dur}s`, '--w': `${b.delay}s` } as React.CSSProperties}
        >
          {[0, 1, 2].map((k) => (
            <span key={k} className="ub-bas-tracer" style={{ animationDelay: `calc(var(--w) + ${k * 0.11}s)` }} />
          ))}
        </div>
      ))}
      {rockets &&
        ROCKETS.map((r, i) => (
          // El carril mide todo el alto de la sección (inclinado): el cohete lo recorre
          // de abajo hasta salir por arriba, sin importar qué tan alta sea la sección.
          <span key={i} className="ub-bas-lane" style={{ left: `${r.left}%`, rotate: `${r.tilt}deg` }}>
            <span className="ub-bas-rocket" style={{ animationDelay: `${r.delay}s`, animationDuration: `${r.dur}s` }} />
          </span>
        ))}
    </div>
  );
}

function Wall() {
  return (
    <svg className="ub-bas-wall" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
      <path d={WALL_PATH} />
    </svg>
  );
}

export default function BasBackdrop({ section }: { section: BackdropSection }) {
  const footer = section === 'footer';
  return (
    <div className={`ub ub-bas ub-bas-${section}`} aria-hidden="true">
      {!footer && <div className="ub-bas-photo" />}
      <div className="ub-bas-veil" />

      {section === 'about' && <Wall />}

      {section === 'skills' && (
        <div className="ub-bas-cables">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`ub-bas-cable c${i}`} />
          ))}
        </div>
      )}

      {section === 'contact' && (
        <div className="ub-bas-flares">
          {['red', 'green', 'red'].map((c, i) => (
            <span key={i} className={`ub-bas-flare is-${c} f${i}`} />
          ))}
        </div>
      )}

      {footer && <Wall />}

      {/* En el pie solo unas trazadoras lejanas; en Carta las bengalas ya hacen de cohetes */}
      <Crossfire rockets={!footer && section !== 'contact'} bursts={footer ? 2 : BURSTS.length} />
    </div>
  );
}
