'use client';

import { useI18n } from '@/lib/i18n-context';
import { useRandomSpawner } from '@/lib/hooks';
import { randomSpot } from '../spawn';
import InkSplash, { makeSplash, type Splash } from '../InkSplash';
import GunshotSplash, { makeShot, type Shot } from '../GunshotSplash';
import type { BackdropSection } from './types';

/* ---------------------------------------------------------- CAPÍTULO FINAL
   Cine noir de venganza: blanco y negro de alto contraste con un solo color
   (rojo), lluvia, persianas, neón, sol rojo tras una celosía shoji y kanji de
   capítulo. Al azar, tajos de katana y (menos seguido) disparos dejan
   manchas de tinta roja en los márgenes.
   Estilos en app/universe-pulp.css. */

/** Duraciones: deben coincidir con .ub-pulp-ink y .ub-pulp-shot (universe-pulp.css). */
const CUT_LIFE_MS = 4400;
const SHOT_LIFE_MS = 7000;

type Cut = { x: number; y: number; rot: number; splash: Splash };
type Hit = { x: number; y: number; shot: Shot };

function KatanaCuts() {
  const { ref, items } = useRandomSpawner<Cut>({
    create: ({ width, height }) => {
      const spot = randomSpot(width, height);
      return {
        x: Math.max(70, Math.min(spot.x + 60, width - 90)),
        y: Math.max(40, Math.min(spot.y + 30, height - 140)),
        rot: -(18 + Math.random() * 26) * (Math.random() < 0.5 ? 1 : -1),
        splash: makeSplash(),
      };
    },
    lifeMs: CUT_LIFE_MS,
    every: [3800, 6500],
    first: [900, 2400],
    max: 2,
  });

  return (
    <div ref={ref} className="ub-sfx-area">
      {items.map((c) => (
        <InkSplash key={c.id} splash={c.splash} rot={c.rot} style={{ left: c.x, top: c.y }} />
      ))}
    </div>
  );
}

/** Disparos: menos frecuentes que los tajos; el primero llega después del primer tajo. */
function Gunshots() {
  const { ref, items } = useRandomSpawner<Hit>({
    create: ({ width, height }) => {
      const spot = randomSpot(width, height);
      return {
        x: Math.max(60, Math.min(spot.x + 50, width - 60)),
        // Deja espacio debajo para que los chorros escurran.
        y: Math.max(60, Math.min(spot.y, height - 300)),
        shot: makeShot(),
      };
    },
    lifeMs: SHOT_LIFE_MS,
    every: [9000, 15000],
    first: [5000, 9000],
    max: 2,
  });

  return (
    <div ref={ref} className="ub-sfx-area">
      {items.map((s) => (
        <GunshotSplash key={s.id} shot={s.shot} style={{ left: s.x, top: s.y }} />
      ))}
    </div>
  );
}

/** Ciudad de noche: azoteas, tanques de agua y escaleras de incendio. */
function NoirSkyline() {
  return (
    <svg className="ub-pulp-city" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 260 V170 H70 V120 H90 V100 H120 V120 H150 V170 H190 V70 H250 V170 H290 V140 H340 V90 H360 V60 H372 V90 H400 V140 H450 V170 H500 V110 H520 V96 H545 V110 H570 V170 H620 V40 H700 V170 H760 V130 H810 V150 H860 V80 H880 V62 H905 V80 H930 V150 H980 V170 H1020 V100 H1090 V170 H1130 V120 H1150 V30 H1158 V120 H1190 V170 H1240 V90 H1300 V170 H1350 V130 H1440 V260 Z" />
      <g className="ub-pulp-lit">
        {[[205, 95], [225, 125], [640, 70], [668, 110], [680, 140], [1040, 120], [1060, 150], [1255, 110], [1280, 140], [515, 130]].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="9" height="12" />
        ))}
      </g>
    </svg>
  );
}

/** Luces de autos bajo la lluvia (Viajes): faros claros y calaveras rojas. */
const PULP_STREAKS = Array.from({ length: 9 }, (_, i) => ({
  top: `${54 + ((i * 11) % 40)}%`,
  delay: `${-(i * 0.83).toFixed(2)}s`,
  dur: `${2.6 + (i % 4) * 0.7}s`,
  red: i % 3 === 1,
  rev: i % 2 === 1,
}));

const RAIN_SECTIONS: BackdropSection[] = ['about', 'skills', 'experience', 'contact'];

export default function PulpBackdrop({ section }: { section: BackdropSection }) {
  const { lang } = useI18n();
  const rain = RAIN_SECTIONS.includes(section);
  const splatter = section !== 'footer' && section !== 'projects';
  return (
    <div className={`ub ub-pulp ub-pulp-${section}`} aria-hidden="true">
      {section === 'about' && (
        <>
          <div className="ub-pulp-moon" />
          <NoirSkyline />
        </>
      )}
      {section === 'skills' && <div className="ub-pulp-blinds" />}
      {section === 'experience' &&
        PULP_STREAKS.map((s, i) => (
          <span
            key={i}
            className={`ub-pulp-streak${s.red ? ' is-red' : ''}${s.rev ? ' is-rev' : ''}`}
            style={{ top: s.top, animationDelay: s.delay, animationDuration: s.dur }}
          />
        ))}
      {section === 'projects' && (
        <>
          <div className="ub-pulp-sun" />
          <div className="ub-pulp-shoji" />
          <div className="ub-pulp-snow" />
          <div className="ub-pulp-snow is-far" />
        </>
      )}
      {section === 'courses' && (
        <>
          <div className="ub-pulp-smoke" />
          {/* Letrero de neón con fallas: cada carácter parpadea por su cuenta */}
          <span className="ub-pulp-kanji" lang="ja">
            <span className="ub-pulp-tube">修</span>
            <span className="ub-pulp-tube is-faulty">行</span>
          </span>
          <svg className="ub-pulp-brush" viewBox="0 0 600 60" preserveAspectRatio="none">
            <path d="M8 38 C120 18 260 44 380 26 S540 22 592 30" />
          </svg>
        </>
      )}
      {section === 'contact' && <span className="ub-pulp-neon">{lang === 'es' ? 'ÚLTIMA LLAMADA' : 'LAST CALL'}</span>}
      {rain && <div className="ub-pulp-rain" />}
      {rain && <div className="ub-pulp-rain is-near" />}
      {(section === 'about' || section === 'contact') && <div className="ub-pulp-flash" />}
      <div className="ub-pulp-grain" />
      {section !== 'footer' && <div className="ub-pulp-scratch" />}
      {splatter && <KatanaCuts />}
      {splatter && <Gunshots />}
    </div>
  );
}
