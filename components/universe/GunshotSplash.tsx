import { useId } from 'react';

/* ---------------------------------------------------------------------------
   Disparo al fondo (universo Capítulo final): fogonazo, orificio de bala y
   salpicadura radial de tinta roja con chorros largos que escurren por la
   pared, como sangre en un muro. Aparece con menos frecuencia que los tajos.
   Estilos y tiempos en app/universe-pulp.css (.ub-pulp-shot).
   --------------------------------------------------------------------------- */

const REDS = ['#8e1014', '#b3161b', '#cf2420', '#e0391f'];

export type Shot = {
  seed: number;
  blobs: { cx: number; cy: number; r: number; fill: string }[];
  /** Gotas proyectadas hacia afuera, estiradas en la dirección del impacto. */
  spray: { cx: number; cy: number; rx: number; ry: number; rot: number; fill: string }[];
  /** Chorros que escurren hacia abajo desde la mancha. */
  drips: { x: number; y: number; w: number; len: number; delay: number; fill: string }[];
};

export function makeShot(rand: () => number = Math.random): Shot {
  const pick = () => REDS[Math.floor(rand() * REDS.length)];

  // Núcleo: varias gotas encimadas alrededor del impacto.
  const blobs = Array.from({ length: 9 }, (_, i) => {
    const a = rand() * Math.PI * 2;
    const d = i === 0 ? 0 : 4 + rand() * 18;
    return { cx: Math.cos(a) * d, cy: Math.sin(a) * d * 0.8, r: i === 0 ? 14 : 4 + rand() * 9, fill: pick() };
  });

  // Rocío radial: más denso cerca, gotas alargadas que se alejan del centro.
  const spray: Shot['spray'] = [];
  for (let i = 0; i < 80; i++) {
    const a = rand() * Math.PI * 2;
    const d = 18 + Math.pow(rand(), 1.6) * 120;
    const r = Math.max(0.6, 3.6 - d / 40) * (0.5 + rand() * 0.8);
    spray.push({
      cx: Math.cos(a) * d,
      cy: Math.sin(a) * d * 0.85,
      rx: r * (1 + d / 45),
      ry: r,
      rot: (a * 180) / Math.PI,
      fill: pick(),
    });
  }

  // Chorros: nacen dentro de la mancha y bajan distancias muy distintas.
  const drips: Shot['drips'] = Array.from({ length: 10 + Math.floor(rand() * 5) }, () => ({
    x: (rand() - 0.5) * 70,
    y: (rand() - 0.3) * 24,
    w: 1.4 + rand() * 3,
    len: 40 + Math.pow(rand(), 0.8) * 230,
    delay: 0.25 + rand() * 0.9,
    fill: pick(),
  }));

  return { seed: Math.floor(rand() * 1000), blobs, spray, drips };
}

export default function GunshotSplash({ shot, style }: { shot: Shot; style?: React.CSSProperties }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <div className="ub-pulp-shot" style={style} aria-hidden="true">
      <span className="ub-pulp-flash-hit" />
      <svg className="ub-pulp-shot-ink" viewBox="-160 -160 320 460" width="320" height="460">
        <defs>
          <filter id={`shot-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed={shot.seed} />
            <feDisplacementMap in="SourceGraphic" scale="12" />
          </filter>
        </defs>
        {/* Chorros (debajo de la mancha): crecen hacia abajo con una gota en la punta */}
        <g className="ub-pulp-shot-drips">
          {shot.drips.map((d, i) => (
            <g key={i} style={{ animationDelay: `${d.delay.toFixed(2)}s` }}>
              <rect x={(d.x - d.w / 2).toFixed(1)} y={d.y.toFixed(1)} width={d.w.toFixed(1)} height={d.len.toFixed(1)} rx={(d.w / 2).toFixed(1)} fill={d.fill} />
              <circle cx={d.x.toFixed(1)} cy={(d.y + d.len).toFixed(1)} r={(d.w * 0.9).toFixed(1)} fill={d.fill} />
            </g>
          ))}
        </g>
        <g className="ub-pulp-shot-splat">
          <g filter={`url(#shot-${id})`}>
            {shot.blobs.map((b, i) => (
              <circle key={i} cx={b.cx.toFixed(1)} cy={b.cy.toFixed(1)} r={b.r.toFixed(1)} fill={b.fill} />
            ))}
          </g>
          {shot.spray.map((s, i) => (
            <ellipse
              key={i}
              cx={s.cx.toFixed(1)}
              cy={s.cy.toFixed(1)}
              rx={s.rx.toFixed(1)}
              ry={s.ry.toFixed(1)}
              fill={s.fill}
              transform={`rotate(${s.rot.toFixed(0)} ${s.cx.toFixed(1)} ${s.cy.toFixed(1)})`}
            />
          ))}
          {/* Orificio de bala */}
          <circle r="3.2" fill="#0b0b0b" />
        </g>
      </svg>
    </div>
  );
}
