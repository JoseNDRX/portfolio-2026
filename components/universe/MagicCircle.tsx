import { useId } from 'react';
import { TRIQUETRA, TRIQUETRA_TRANSFORM, TRIQUETRA_VIEWBOX } from '@/lib/celtic-knot';

/* ---------------------------------------------------------------------------
   Círculo mágico del universo Grimorio: mezcla de nudo celta y círculo de
   conjuro (anillos concéntricos con banda de runas y círculos satélite).
   Se usa en el hero, en la intro y en el póster de la cartelera.

   Capas (cada una se anima por separado en app/universes.css):
   - .mc-outer  banda de runas entre dos anillos        → gira en sentido horario
   - .mc-astro  anillo de escala y círculos satélite     → gira en sentido contrario (spin-counter)
   - .mc-core   triquetra entrelazada con círculo (cinta) → pulsa
   Todo usa currentColor y stroke-width 1.5, así hereda el color y el resplandor
   turquesa (drop-shadow) que define .magic-circle.
   La triquetra es geometría de dominio público (lib/celtic-knot.ts) usada como
   máscara, para conservar los cruces de la cinta por arriba y por abajo.
   --------------------------------------------------------------------------- */

const C = 150; // centro del viewBox 300 × 300
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/** Punto en coordenadas polares (grados, 0° = arriba, sentido horario). */
function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
}

/** Runas del futhark antiguo, trazadas en una caja de 6 × 10 (y hacia abajo). */
const RUNES = [
  'M1 0L1 10M1 2L5 0M1 5L5 3', // fehu
  'M1 10L1 0L5 4L5 10', // uruz
  'M1 0L1 10M1 3L4 5L1 7', // thurisaz
  'M1 0L1 10M1 0L5 2M1 4L5 6', // ansuz
  'M1 10L1 0L5 2.5L1 5L5 10', // raidho
  'M5 1L1 5L5 9', // kaunan
  'M1 1L5 9M5 1L1 9', // gebo
  'M1 0L1 10M1 0L5 2.5L1 5', // wunjo
  'M1 0L1 10M5 0L5 10M1 3L5 6', // hagalaz
  'M3 0L3 10M1 3L5 6', // naudiz
  'M2 1L0.5 4L2 7M4 3L5.5 6L4 9', // jera
  'M3 0L3 10M3 0L5 2M3 10L1 8', // eihwaz
  'M1 0L1 10M1 0L5 2M1 10L5 8', // perth
  'M3 0L3 10M3 4L0.5 1M3 4L5.5 1', // algiz
  'M5 0L1 4L5 6L1 10', // sowilo
  'M3 0L3 10M3 0L0.5 3M3 0L5.5 3', // tiwaz
  'M1 0L1 10L5 7.5L1 5L5 2.5L1 0', // berkanan
  'M1 10L1 0L3 3L5 0L5 10', // ehwaz
  'M1 10L1 0L5 4M5 10L5 0L1 4', // mannaz
  'M1 10L1 0L5 3', // laguz
  'M3 0L5.5 5L3 10L0.5 5Z', // ingwaz
  'M1 1L1 9L5 1L5 9L1 1', // dagaz
  'M3 0L5 3L1 7L0 10M3 0L1 3L5 7L6 10', // othala
];

/** Convierte una runa a coordenadas del círculo: centrada en (r, ángulo), "arriba" hacia afuera. */
function placeRune(d: string, r: number, deg: number, s: number) {
  const a = (deg * Math.PI) / 180;
  const ux = Math.sin(a), uy = -Math.cos(a); // radial (hacia afuera)
  const tx = Math.cos(a), ty = Math.sin(a); // tangente (sentido horario)
  const cx = C + r * ux, cy = C + r * uy;
  return d.replace(/([ML])\s*([\d.]+)\s+([\d.]+)/g, (_, cmd: string, xs: string, ys: string) => {
    const x = (parseFloat(xs) - 3) * s;
    const y = (5 - parseFloat(ys)) * s;
    return `${cmd}${(cx + x * tx + y * ux).toFixed(2)} ${(cy + x * ty + y * uy).toFixed(2)}`;
  });
}

// Banda de runas: 40 glifos alrededor de r = 141.
const RUNE_BAND = range(40).map((i) => placeRune(RUNES[(i * 7) % RUNES.length], 141, i * 9, 0.82)).join('');
// Escala fina sobre el anillo de 104.
const SCALE = range(60)
  .map((i) => {
    const [x1, y1] = polar(104, i * 6);
    const [x2, y2] = polar(i % 5 === 0 ? 112 : 108, i * 6);
    return `M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`;
  })
  .join('');
// Seis círculos satélite sobre el anillo de 122.
const SATELLITES = range(6).map((i) => polar(122, i * 60));

type Props = {
  /** Clase extra para la animación de dibujo (intro / póster). */
  drawClass?: string;
  /** Contenido opcional encima (p. ej. un resplandor en la intro). */
  children?: React.ReactNode;
  className?: string;
  size?: number;
};

export default function MagicCircle({ drawClass = '', children, className = '', size = 290 }: Props) {
  const maskId = `mc-knot-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const d = (delay: number) => (drawClass ? { className: drawClass, style: { animationDelay: `${delay}s` } } : {});
  const knot = 150; // tamaño de la triquetra dentro del viewBox de 300 (deja libre la escala de r = 104)

  return (
    <svg
      className={`magic-circle ${className}`}
      viewBox="0 0 300 300"
      width={size}
      height={size}
      style={{ maxWidth: '100%', height: 'auto' }}
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Banda de runas entre dos anillos, sentido horario */}
        <g className="mc-outer">
          <circle cx={C} cy={C} r="148" {...d(0)} />
          <circle cx={C} cy={C} r="134" {...d(0.15)} />
          <path d={RUNE_BAND} strokeWidth="1.2" {...d(0.3)} />
        </g>

        {/* Escala y círculos satélite, sentido contrario */}
        <g className="mc-astro">
          <circle cx={C} cy={C} r="122" strokeWidth="1" opacity=".7" {...d(0.5)} />
          <circle cx={C} cy={C} r="104" {...d(0.6)} />
          <path d={SCALE} strokeWidth="1" opacity=".8" {...d(0.7)} />
          {SATELLITES.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="9" fill="var(--mc-fill, transparent)" {...d(0.8)} />
              <circle cx={x} cy={y} r="4" {...d(0.9)} />
              <circle cx={x} cy={y} r="1.4" fill="currentColor" stroke="none" />
            </g>
          ))}
        </g>
      </g>

      {/* Triquetra entrelazada con círculo: cinta celta en el centro */}
      <g className={`mc-core ${drawClass ? 'mc-core-in' : ''}`}>
        <svg x={C - knot / 2} y={C - (knot * TRIQUETRA_VIEWBOX.h) / TRIQUETRA_VIEWBOX.w / 2} width={knot} height={(knot * TRIQUETRA_VIEWBOX.h) / TRIQUETRA_VIEWBOX.w} viewBox={`0 0 ${TRIQUETRA_VIEWBOX.w} ${TRIQUETRA_VIEWBOX.h}`}>
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={TRIQUETRA_VIEWBOX.w} height={TRIQUETRA_VIEWBOX.h}>
              <rect width={TRIQUETRA_VIEWBOX.w} height={TRIQUETRA_VIEWBOX.h} fill="#000" />
              <g transform={TRIQUETRA_TRANSFORM} fill="none">
                {TRIQUETRA.map((el, i) => {
                  const stroke = el.mode === 'keep' ? '#fff' : '#000';
                  return el.kind === 'circle' ? (
                    <circle key={i} cx={el.cx} cy={el.cy} r={el.r} stroke={stroke} strokeWidth={el.w} />
                  ) : (
                    <path key={i} d={el.d} stroke={stroke} strokeWidth={el.w} />
                  );
                })}
              </g>
            </mask>
          </defs>
          <rect width={TRIQUETRA_VIEWBOX.w} height={TRIQUETRA_VIEWBOX.h} fill="currentColor" mask={`url(#${maskId})`} />
        </svg>
      </g>
      {children}
    </svg>
  );
}
