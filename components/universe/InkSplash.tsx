/* ---------------------------------------------------------------------------
   Tajo de katana + salpicadura de tinta roja (universo Capítulo final).
   Se usa en los fondos de las secciones (al azar) y en la intro.
   - La hoja y las gotas siguen el ángulo del tajo (rotate).
   - Los chorros escurren siempre hacia abajo de la pantalla (no se rotan).
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

export type Splash = {
  drops: { cx: number; cy: number; rx: number; ry: number }[];
  drips: { x: number; w: number; len: number; delay: number }[];
};

/** Genera una salpicadura. `rand` permite usar un generador fijo (intro) o Math.random. */
export function makeSplash(rand: () => number = Math.random, scale = 1): Splash {
  const drops: Splash['drops'] = [];
  // Mancha principal: varias gotas grandes encimadas para que no sea un círculo perfecto.
  for (let i = 0; i < 4; i++) {
    const r = (10 + rand() * 8) * scale;
    drops.push({ cx: (rand() - 0.5) * 16 * scale, cy: (rand() - 0.5) * 10 * scale, rx: r * 1.15, ry: r });
  }
  // Salpicaduras: más y más lejos hacia adelante del tajo; las lejanas se estiran (velocidad).
  for (let i = 0; i < 34; i++) {
    const along = (rand() * 1.25 - 0.25) * 230 * scale;
    const dist = Math.abs(along) / scale;
    const across = (rand() - 0.5) * (14 + dist * 0.35) * scale;
    const r = Math.max(0.9, 6.5 - dist / 34) * (0.45 + rand() * 0.8) * scale;
    drops.push({ cx: along, cy: across, rx: r * (1 + dist / 70), ry: r });
  }
  const drips: Splash['drips'] = Array.from({ length: 3 + Math.floor(rand() * 2) }, () => ({
    x: (rand() - 0.5) * 22 * scale,
    w: (2 + rand() * 2.5) * scale,
    len: (40 + rand() * 70) * scale,
    delay: 0.35 + rand() * 0.5,
  }));
  return { drops, drips };
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

export default function InkSplash({ splash, rot, className = '', style, delay = 0 }: Props) {
  const wait = { animationDelay: `${delay}s` };
  return (
    <div className={`ub-pulp-cut ${className}`} style={style} aria-hidden="true">
      <div className="ub-pulp-slash" style={{ rotate: `${rot}deg` }}>
        <span className="ub-pulp-blade" style={wait} />
        <svg className="ub-pulp-ink" style={wait} viewBox="-160 -90 480 180" width="480" height="180">
          {splash.drops.map((d, i) => (
            <ellipse key={i} cx={d.cx.toFixed(1)} cy={d.cy.toFixed(1)} rx={d.rx.toFixed(1)} ry={d.ry.toFixed(1)} />
          ))}
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
