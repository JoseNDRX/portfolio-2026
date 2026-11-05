'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { useUniverse } from '@/lib/universe-context';
import type { Lang } from '@/lib/translations';
import InkSplash, { makeSplash, type Splash } from './InkSplash';
import { RUNES } from './MagicCircle';

/* ---------------------------------------------------------------------------
   Fondos temáticos por sección. Cada universo puede tener los suyos; si no,
   no se pinta nada y la sección queda con su color normal.
   Los estilos están en app/universe-backdrops.css.
   --------------------------------------------------------------------------- */

export type BackdropSection = 'about' | 'skills' | 'experience' | 'projects' | 'courses' | 'contact' | 'footer';

/** Onomatopeyas de cada sección (Escuadrón). Aparecen al azar, no son fijas. */
const ESC_SFX: Partial<Record<BackdropSection, string[]>> = {
  about: ['¡BAM!', '¡KRAK!', '¡BOOM!'],
  skills: ['¡POW!', '¡ZAP!', '¡KAPOW!'],
  experience: ['¡ZOOM!', '¡WHAM!', '¡SWOOSH!'],
  courses: ['¡CLICK!', '¡BLAM!', '¡THWIP!'],
  contact: ['¡BZZT!', '¡RING!', '¡ZING!'],
};

const TONES = ['yellow', 'red', 'blue'] as const;
/** Cada cuánto aparece una (ms) y cuánto dura en pantalla (debe coincidir con el CSS). */
const SPAWN_MIN = 1600;
const SPAWN_MAX = 3200;
const LIFE_MS = 1900;
const MAX_VISIBLE = 2;

/** En inglés las onomatopeyas no llevan el signo de apertura. */
const sfxText = (text: string, lang: Lang) => (lang === 'en' ? text.replace('¡', '') : text);

type Burst = { id: number; text: string; x: number; y: number; rot: number; size: number; tone: (typeof TONES)[number] };

/** Elige un punto al azar fuera de la columna de contenido (px dentro de la sección). */
function randomSpot(w: number, h: number): { x: number; y: number } {
  const content = Math.min(1100, w - 48); // ancho de .section-container
  const side = (w - content) / 2;
  if (side >= 150) {
    // Pantallas anchas: márgenes laterales.
    const left = Math.random() < 0.5;
    const x = left ? 20 + Math.random() * (side - 130) : w - side + 20 + Math.random() * (side - 150);
    return { x, y: 60 + Math.random() * Math.max(40, h - 160) };
  }
  // Pantallas chicas: franjas de arriba y abajo (el padding de la sección).
  const top = Math.random() < 0.5;
  return { x: 16 + Math.random() * Math.max(20, w - 180), y: top ? 10 + Math.random() * 40 : h - 80 + Math.random() * 30 };
}

function SfxSpawner({ words }: { words: string[] }) {
  const { lang } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let inView = false;
    let timer = 0;
    let nextId = 0;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(el);

    const spawn = () => {
      if (inView && !document.hidden) {
        const { width, height } = el.getBoundingClientRect();
        const spot = randomSpot(width, height);
        const text = words[Math.floor(Math.random() * words.length)];
        const size = 2.2 + Math.random() * 1.6;
        // Ancho aproximado de la palabra (Bangers ≈ 0.55 em por letra) para no salirse del borde.
        const textW = text.length * size * 16 * 0.55;
        const burst: Burst = {
          id: nextId++,
          text,
          x: Math.max(12, Math.min(spot.x, width - textW - 24)),
          y: spot.y,
          rot: Math.round(Math.random() * 30 - 15),
          size,
          tone: TONES[Math.floor(Math.random() * TONES.length)],
        };
        setBursts((list) => [...list.slice(-(MAX_VISIBLE - 1)), burst]);
        window.setTimeout(() => setBursts((list) => list.filter((b) => b.id !== burst.id)), LIFE_MS);
      }
      timer = window.setTimeout(spawn, SPAWN_MIN + Math.random() * (SPAWN_MAX - SPAWN_MIN));
    };
    timer = window.setTimeout(spawn, 600 + Math.random() * 1200);

    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [words]);

  return (
    <div ref={ref} className="ub-sfx-area">
      {bursts.map((b) => (
        <span
          key={b.id}
          className={`ub-sfx ub-sfx-${b.tone}`}
          style={{ left: b.x, top: b.y, fontSize: `${b.size}rem`, '--rot': `${b.rot}deg` } as React.CSSProperties}
        >
          {sfxText(b.text, lang)}
        </span>
      ))}
    </div>
  );
}

function Skyline() {
  return (
    <svg className="ub-skyline" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 220 V150 H60 V110 H110 V150 H150 V80 H200 V40 H230 V80 H260 V150 H320 V120 H380 V150 H420 V95 H470 V60 H490 V95 H530 V150 H600 V130 H650 V70 H700 V130 H760 V150 H800 V100 H860 V150 H920 V115 H970 V50 H990 V30 H1010 V50 H1030 V115 H1080 V150 H1130 V90 H1190 V150 H1250 V125 H1300 V75 H1350 V125 H1400 V150 H1440 V220 Z" />
      <g className="ub-windows">
        {[[170, 95], [215, 60], [480, 75], [665, 85], [690, 100], [985, 70], [1000, 95], [1145, 110], [1315, 95]].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="8" height="10" />
        ))}
      </g>
    </svg>
  );
}

function PanelGrid() {
  return (
    <svg className="ub-panels" width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id="ub-esc-panels" width="420" height="360" patternUnits="userSpaceOnUse">
          <rect x="8" y="8" width="250" height="160" />
          <rect x="270" y="8" width="142" height="160" />
          <rect x="8" y="180" width="130" height="172" />
          <rect x="150" y="180" width="262" height="172" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ub-esc-panels)" />
    </svg>
  );
}

function EscBackdrop({ section }: { section: BackdropSection }) {
  const words = ESC_SFX[section];
  return (
    <div className={`ub ub-esc ub-esc-${section}`} aria-hidden="true">
      <div className="ub-layer" />
      {section === 'about' && <Skyline />}
      {section === 'projects' && <PanelGrid />}
      {words && <SfxSpawner words={words} />}
    </div>
  );
}

/* ------------------------------------------------------------------ OLIMPO
   Cada sección con su lugar real de Grecia (fotos de Wikimedia Commons,
   dominio público / CC0), muy tenue, con zoom lento, polvo dorado y una
   franja de greca arriba. Sin onomatopeyas. */
const OLI_MOTES: Record<BackdropSection, number> = {
  about: 4, skills: 0, experience: 4, projects: 3, courses: 4, contact: 5, footer: 0,
};

/* Constelaciones de la mitología griega, con la forma aproximada de sus
   estrellas principales (caja de 100 × 100). Aparecen en los márgenes: se
   encienden las estrellas, se trazan las líneas, se lee el nombre y se apagan. */
type Constellation = { name: { es: string; en: string }; stars: [number, number, number][]; lines: [number, number][] };

const CONSTELLATIONS: Constellation[] = [
  {
    name: { es: 'Perseo', en: 'Perseus' },
    stars: [[56, 2, 2.4], [50, 22, 3], [44, 42, 3.4], [28, 56, 2.4], [16, 78, 2.6], [52, 62, 2.4], [70, 80, 2.6], [82, 98, 2.2], [72, 30, 2.2]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [6, 7], [1, 8]],
  },
  {
    name: { es: 'Orión', en: 'Orion' },
    stars: [[48, 0, 2], [16, 10, 3.6], [80, 15, 2.8], [38, 48, 2.6], [50, 51, 2.6], [62, 54, 2.6], [22, 94, 2.6], [86, 90, 3.6]],
    lines: [[0, 1], [0, 2], [1, 3], [2, 5], [3, 4], [4, 5], [3, 6], [5, 7]],
  },
  {
    name: { es: 'Andrómeda', en: 'Andromeda' },
    stars: [[2, 88, 3.2], [30, 66, 3], [56, 46, 3], [86, 22, 2.6], [62, 16, 2.2], [42, 96, 2.2]],
    lines: [[0, 1], [1, 2], [2, 3], [2, 4], [1, 5]],
  },
  {
    name: { es: 'Pegaso', en: 'Pegasus' },
    stars: [[18, 24, 3], [60, 18, 3], [64, 58, 3], [22, 62, 3], [84, 72, 2.4], [100, 64, 2.6], [82, 0, 2.2]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4], [4, 5], [1, 6]],
  },
  {
    name: { es: 'Casiopea', en: 'Cassiopeia' },
    stars: [[0, 34, 3], [24, 66, 3.2], [46, 38, 3], [70, 60, 3], [98, 24, 2.8]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    name: { es: 'Lira', en: 'Lyra' },
    stars: [[50, 0, 4], [36, 40, 2.4], [66, 40, 2.4], [30, 88, 2.6], [60, 94, 2.6]],
    lines: [[0, 1], [0, 2], [1, 2], [2, 4], [4, 3], [3, 1]],
  },
  {
    name: { es: 'Hércules', en: 'Hercules' },
    stars: [[34, 36, 2.6], [64, 30, 2.6], [70, 60, 2.6], [30, 64, 2.6], [18, 2, 2.2], [88, 6, 2.2], [92, 96, 2.2], [8, 98, 2.2]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 5], [2, 6], [3, 7]],
  },
  {
    name: { es: 'Cisne', en: 'Cygnus' },
    stars: [[50, 0, 3.6], [50, 38, 3], [50, 100, 2.8], [10, 26, 2.6], [90, 52, 2.6]],
    lines: [[0, 1], [1, 2], [3, 1], [1, 4]],
  },
];

/** Debe coincidir con la duración de .ub-oli-const (universe-olimpo.css). */
const CONST_LIFE_MS = 7000;

type ConstSpawn = { id: number; c: Constellation; x: number; y: number; size: number };

function ConstellationSpawner() {
  const { lang } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<ConstSpawn[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let inView = false;
    let timer = 0;
    let nextId = 0;
    let last = -1;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(el);
    const spawn = () => {
      if (inView && !document.hidden) {
        const { width, height } = el.getBoundingClientRect();
        const side = (width - Math.min(1100, width - 48)) / 2;
        const size = side >= 150 ? Math.min(170, side - 30) : 96;
        const spot = randomSpot(width, height);
        // Nunca la misma constelación dos veces seguidas.
        let pick = Math.floor(Math.random() * CONSTELLATIONS.length);
        if (pick === last) pick = (pick + 1) % CONSTELLATIONS.length;
        last = pick;
        const item: ConstSpawn = {
          id: nextId++,
          c: CONSTELLATIONS[pick],
          x: Math.max(10, Math.min(spot.x, width - size - 14)),
          y: Math.max(10, Math.min(spot.y, height - size - 40)),
          size,
        };
        setItems((list) => [...list.slice(-1), item]);
        window.setTimeout(() => setItems((list) => list.filter((x) => x.id !== item.id)), CONST_LIFE_MS);
      }
      timer = window.setTimeout(spawn, 3600 + Math.random() * 2800);
    };
    timer = window.setTimeout(spawn, 700 + Math.random() * 1200);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, []);

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

function OliBackdrop({ section }: { section: BackdropSection }) {
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
      {section !== 'footer' && section !== 'projects' && <ConstellationSpawner />}
    </div>
  );
}

/* ---------------------------------------------------------------- GRIMORIO
   Paisajes élficos por sección (Pixabay) con velo, y los objetos mágicos del
   hero apareciendo y desapareciendo semitransparentes en los márgenes.
   En Proyectos: un portal que deja ver otro mundo a través de él. */
const GRI_FLOATERS = ['cristal', 'elixir-astral', 'elixir-rojo', 'elixir-dorado', 'elixir-turquesa', 'frasco'];

/** Un objeto flotante (poción / cristal) o un pergamino con renglones de runas. */
type Ghost = { id: number; x: number; y: number; size: number; rot: number } & (
  | { kind: 'img'; src: string }
  | { kind: 'scroll'; rows: number[][]; seal: boolean }
);

/** Renglones de runas al azar (índices de RUNES) para un pergamino. */
function scrollRows() {
  return Array.from({ length: 5 }, (_, r) =>
    Array.from({ length: r === 4 ? 3 + Math.floor(Math.random() * 3) : 6 + Math.floor(Math.random() * 3) }, () =>
      Math.floor(Math.random() * RUNES.length),
    ),
  );
}

/** Pergamino que se desenrolla: dos rodillos, papel con runas y sello de cera. */
function GriScroll({ g }: { g: Extract<Ghost, { kind: 'scroll' }> }) {
  const h = Math.round(g.size * 1.25);
  return (
    <div
      className="ub-gri-scroll"
      style={{ left: g.x, top: g.y, width: g.size, '--rot': `${g.rot}deg`, '--h': `${h}px` } as React.CSSProperties}
    >
      <span className="ub-gri-rod" />
      <div className="ub-gri-paper" style={{ height: h }}>
        <svg viewBox="0 0 100 125" width="100%" height="100%" preserveAspectRatio="none">
          <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
            {g.rows.map((row, r) =>
              row.map((rune, i) => (
                <path key={`${r}-${i}`} d={RUNES[rune]} transform={`translate(${12 + i * 10} ${18 + r * 19}) scale(0.95)`} />
              )),
            )}
          </g>
          {g.seal && <circle className="ub-gri-seal" cx="78" cy="108" r="8" />}
        </svg>
      </div>
      <span className="ub-gri-rod is-bottom" />
    </div>
  );
}

function GhostSpawner() {
  const ref = useRef<HTMLDivElement>(null);
  const [ghosts, setGhosts] = useState<Ghost[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let inView = false;
    let timer = 0;
    let nextId = 0;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(el);
    const spawn = () => {
      if (inView && !document.hidden) {
        const { width, height } = el.getBoundingClientRect();
        const wide = (width - Math.min(1100, width - 48)) / 2 >= 150;
        // Cada tanto, en lugar de una poción, se desenrolla un pergamino.
        const isScroll = Math.random() < 0.4;
        const size = isScroll
          ? wide ? 96 + Math.random() * 30 : 64 + Math.random() * 12
          : wide ? 70 + Math.random() * 50 : 46 + Math.random() * 18;
        const spot = randomSpot(width, height);
        const base = {
          id: nextId++,
          x: Math.max(8, Math.min(spot.x, width - size - 16)),
          y: Math.max(8, Math.min(spot.y, height - size * 1.5 - 8)),
          size,
          rot: Math.round(Math.random() * (isScroll ? 12 : 24) - (isScroll ? 6 : 12)),
        };
        const g: Ghost = isScroll
          ? { ...base, kind: 'scroll', rows: scrollRows(), seal: Math.random() < 0.7 }
          : { ...base, kind: 'img', src: GRI_FLOATERS[Math.floor(Math.random() * GRI_FLOATERS.length)] };
        setGhosts((list) => [...list.slice(-2), g]);
        window.setTimeout(() => setGhosts((list) => list.filter((x) => x.id !== g.id)), isScroll ? SCROLL_LIFE_MS : GHOST_LIFE_MS);
      }
      timer = window.setTimeout(spawn, 2200 + Math.random() * 2200);
    };
    timer = window.setTimeout(spawn, 800 + Math.random() * 1200);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="ub-sfx-area">
      {ghosts.map((g) => g.kind === 'scroll' ? (
        <GriScroll key={g.id} g={g} />
      ) : (
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

/** Debe coincidir con la duración de la animación .ub-gri-ghost (universe-grimorio.css). */
const GHOST_LIFE_MS = 5200;
/** Debe coincidir con la duración de .ub-gri-scroll (universe-grimorio.css). */
const SCROLL_LIFE_MS = 6800;

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

/** Luciérnagas por sección: posición y ritmo fijos por índice (sin aleatorio, así no cambian entre renders). */
const GRI_FIREFLIES = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 37 + 7) % 96}%`,
  bottom: `${(i * 23) % 70}%`,
  delay: `${-(i * 1.7)}s`,
  dur: `${8 + (i % 4) * 1.6}s`,
  tone: i % 3 === 0 ? 't' : 'g',
}));

function GriBackdrop({ section }: { section: BackdropSection }) {
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

/* ---------------------------------------------------------- CAPÍTULO FINAL
   Cine noir de venganza: blanco y negro de alto contraste con un solo color
   (rojo), lluvia, persianas, neón, sol rojo tras una celosía shoji y kanji de
   capítulo. Sin tramas ni onomatopeyas: es película, no cómic.
   Al azar, un tajo de katana cruza los márgenes y deja una mancha de tinta roja.
   Estilos en app/universe-pulp.css. */

/** Duración del tajo + mancha (ms). Debe coincidir con .ub-pulp-ink en app/universe-pulp.css. */
const CUT_LIFE_MS = 4400;
const CUT_MIN = 3800;
const CUT_MAX = 6500;

type Cut = { id: number; x: number; y: number; rot: number; splash: Splash };

function KatanaCuts() {
  const ref = useRef<HTMLDivElement>(null);
  const [cuts, setCuts] = useState<Cut[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let inView = false;
    let timer = 0;
    let nextId = 0;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(el);

    const spawn = () => {
      if (inView && !document.hidden) {
        const { width, height } = el.getBoundingClientRect();
        const spot = randomSpot(width, height);
        const cut: Cut = {
          id: nextId++,
          x: Math.max(70, Math.min(spot.x + 60, width - 90)),
          y: Math.max(40, Math.min(spot.y + 30, height - 140)),
          rot: -(18 + Math.random() * 26) * (Math.random() < 0.5 ? 1 : -1),
          splash: makeSplash(),
        };
        setCuts((list) => [...list.slice(-1), cut]);
        window.setTimeout(() => setCuts((list) => list.filter((c) => c.id !== cut.id)), CUT_LIFE_MS);
      }
      timer = window.setTimeout(spawn, CUT_MIN + Math.random() * (CUT_MAX - CUT_MIN));
    };
    timer = window.setTimeout(spawn, 900 + Math.random() * 1500);

    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="ub-sfx-area">
      {cuts.map((c) => (
        <InkSplash key={c.id} splash={c.splash} rot={c.rot} style={{ left: c.x, top: c.y }} />
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

function PulpBackdrop({ section }: { section: BackdropSection }) {
  const { lang } = useI18n();
  const rain = section === 'about' || section === 'contact' || section === 'experience' || section === 'skills';
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
      {section === 'contact' && (
        <span className="ub-pulp-neon">{lang === 'es' ? 'ÚLTIMA LLAMADA' : 'LAST CALL'}</span>
      )}
      {rain && <div className="ub-pulp-rain" />}
      {rain && <div className="ub-pulp-rain is-near" />}
      {(section === 'about' || section === 'contact') && <div className="ub-pulp-flash" />}
      <div className="ub-pulp-grain" />
      {section !== 'footer' && <div className="ub-pulp-scratch" />}
      {section !== 'footer' && section !== 'projects' && <KatanaCuts />}
    </div>
  );
}

export default function UniverseBackdrop({ section }: { section: BackdropSection }) {
  const { universe } = useUniverse();
  if (universe === 'pulp') return <PulpBackdrop section={section} />;
  if (universe === 'esc') return <EscBackdrop section={section} />;
  if (universe === 'oli') return <OliBackdrop section={section} />;
  if (universe === 'gri') return <GriBackdrop section={section} />;
  return null;
}
