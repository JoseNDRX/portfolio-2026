import { useId } from 'react';

/* ---------------------------------------------------------------------------
   Tajo de katana + salpicadura de tinta roja (universo Capítulo final).
   Se usa en los fondos de las secciones (al azar) y en la intro.
   La salpicadura imita tinta / acuarela sobre papel, en 4 capas:
   - lavados: manchas grandes y difusas, de borde irregular (turbulencia SVG),
     en varios rojos y naranjas, que se expanden como tinta en papel mojado;
   - núcleos: tinta densa y oscura, de borde rugoso;
   - rocío: decenas de gotitas finas en abanico a lo largo del corte;
   - chorros: escurren siempre hacia abajo de la pantalla (no se rotan).
   La hoja y la mancha siguen el ángulo del tajo (rotate).
   Estilos y tiempos en app/universe-pulp.css (.ub-pulp-cut).
   --------------------------------------------------------------------------- */

/** Generador pseudoaleatorio fijo (mulberry32): mismo resultado en el servidor
    y en el navegador, así no hay errores de hidratación. */
export function seededRand(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rojos de la tinta: del granate al naranja quemado (como acuarela). */
const INKS = ['#7a0f12', '#a3191b', '#c42a1c', '#d9481f', '#e8733a'];

type Ellipse = { cx: number; cy: number; rx: number; ry: number; rot: number; fill: string; op: number };

export type Splash = {
  /** Semilla de la turbulencia (bordes irregulares distintos en cada mancha). */
  seed: number;
  washes: Ellipse[];
  blobs: Ellipse[];
  specks: { cx: number; cy: number; r: number; fill: string }[];
  drips: { x: number; w: number; len: number; delay: number }[];
};

/** Genera una salpicadura. `rand` permite usar un generador fijo (intro) o Math.random. */
export function makeSplash(rand: () => number = Math.random, scale = 1): Splash {
  const pick = () => INKS[Math.floor(rand() * INKS.length)];

  // Lavados: alargados en la dirección del tajo, claros y difusos.
  const washes: Ellipse[] = Array.from({ length: 6 }, () => {
    const along = (rand() * 1.1 - 0.25) * 150 * scale;
    return {
      cx: along,
      cy: (rand() - 0.5) * 40 * scale,
      rx: (38 + rand() * 46) * scale,
      ry: (16 + rand() * 22) * scale,
      rot: (rand() - 0.5) * 34,
      fill: INKS[2 + Math.floor(rand() * 3)],
      op: 0.18 + rand() * 0.22,
    };
  });

  // Núcleos: tinta densa cerca del punto del corte.
  const blobs: Ellipse[] = Array.from({ length: 5 }, (_, i) => {
    const r = (i === 0 ? 15 : 6 + rand() * 9) * scale;
    return {
      cx: (i === 0 ? 0 : (rand() * 1.4 - 0.3) * 50) * scale,
      cy: (rand() - 0.5) * 16 * scale,
      rx: r * (1.1 + rand() * 0.5),
      ry: r,
      rot: (rand() - 0.5) * 40,
      fill: INKS[Math.floor(rand() * 3)],
      op: 0.85 + rand() * 0.15,
    };
  });

  // Rocío: abanico hacia adelante del tajo + un halo fino alrededor de la mancha.
  const specks: Splash['specks'] = [];
  for (let i = 0; i < 70; i++) {
    const along = (rand() * 1.45 - 0.3) * 250 * scale;
    const dist = Math.abs(along) / scale;
    const across = (rand() - 0.5) * (26 + dist * 0.55) * scale;
    specks.push({ cx: along, cy: across, r: Math.max(0.5, 2.8 - dist / 110) * (0.35 + rand() * 0.9) * scale, fill: pick() });
  }
  for (let i = 0; i < 26; i++) {
    const a = rand() * Math.PI * 2;
    const d = (30 + rand() * 90) * scale;
    specks.push({ cx: Math.cos(a) * d, cy: Math.sin(a) * d * 0.6, r: (0.5 + rand() * 1.6) * scale, fill: pick() });
  }

  const drips: Splash['drips'] = Array.from({ length: 3 + Math.floor(rand() * 2) }, () => ({
    x: (rand() - 0.5) * 22 * scale,
    w: (2 + rand() * 2.5) * scale,
    len: (40 + rand() * 70) * scale,
    delay: 0.35 + rand() * 0.5,
  }));

  return { seed: Math.floor(rand() * 1000), washes, blobs, specks, drips };
}

type Props = {
  splash: Splash;
  /** Ángulo del tajo en grados. */
  rot: number;
  className?: string;
  style?: React.CSSProperties;
  /** Retraso antes del tajo, en segundos (la intro lo espera). */
  delay?: number;
};

const ellipse = (e: Ellipse, key: number) => (
  <ellipse
    key={key}
    cx={e.cx.toFixed(1)}
    cy={e.cy.toFixed(1)}
    rx={e.rx.toFixed(1)}
    ry={e.ry.toFixed(1)}
    fill={e.fill}
    opacity={e.op.toFixed(2)}
    transform={`rotate(${e.rot.toFixed(1)} ${e.cx.toFixed(1)} ${e.cy.toFixed(1)})`}
  />
);

export default function InkSplash({ splash, rot, className = '', style, delay = 0 }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const wait = { animationDelay: `${delay}s` };
  return (
    <div className={`ub-pulp-cut ${className}`} style={style} aria-hidden="true">
      <div className="ub-pulp-slash" style={{ rotate: `${rot}deg` }}>
        <span className="ub-pulp-blade" style={wait} />
        <svg className="ub-pulp-ink" style={wait} viewBox="-160 -90 480 180" width="480" height="180">
          <defs>
            {/* Acuarela: borde ondulado y difuso */}
            <filter id={`wash-${id}`} x="-40%" y="-80%" width="180%" height="260%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed={splash.seed} />
              <feDisplacementMap in="SourceGraphic" scale="26" />
              <feGaussianBlur stdDeviation="2.4" />
            </filter>
            {/* Tinta densa: borde rugoso, sin desenfoque */}
            <filter id={`ink-${id}`} x="-40%" y="-80%" width="180%" height="260%">
              <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed={splash.seed + 7} />
              <feDisplacementMap in="SourceGraphic" scale="9" />
            </filter>
          </defs>
          <g className="ub-pulp-wash" style={wait} filter={`url(#wash-${id})`}>
            {splash.washes.map(ellipse)}
          </g>
          <g filter={`url(#ink-${id})`}>{splash.blobs.map(ellipse)}</g>
          <g>
            {splash.specks.map((s, i) => (
              <circle key={i} cx={s.cx.toFixed(1)} cy={s.cy.toFixed(1)} r={s.r.toFixed(2)} fill={s.fill} />
            ))}
          </g>
        </svg>
      </div>
      <svg className="ub-pulp-drips" style={wait} viewBox="-40 0 80 140" width="80" height="140">
        {splash.drips.map((d, i) => (
          <rect
            key={i}
            x={(d.x - d.w / 2).toFixed(1)}
            y="0"
            width={d.w.toFixed(1)}
            height={d.len.toFixed(1)}
            rx={(d.w / 2).toFixed(1)}
            style={{ animationDelay: `${(delay + d.delay).toFixed(2)}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
