'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { useUniverse } from '@/lib/universe-context';
import type { Lang } from '@/lib/translations';

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
    </div>
  );
}

/* ---------------------------------------------------------------- GRIMORIO
   Paisajes élficos por sección (Pixabay) con velo, y los objetos mágicos del
   hero apareciendo y desapareciendo semitransparentes en los márgenes.
   En Proyectos: un portal que deja ver otro mundo a través de él. */
const GRI_FLOATERS = ['cristal', 'elixir-astral', 'elixir-rojo', 'elixir-dorado', 'elixir-turquesa', 'frasco'];

type Ghost = { id: number; src: string; x: number; y: number; size: number; rot: number };

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
        const size = wide ? 70 + Math.random() * 50 : 46 + Math.random() * 18;
        const spot = randomSpot(width, height);
        const g: Ghost = {
          id: nextId++,
          src: GRI_FLOATERS[Math.floor(Math.random() * GRI_FLOATERS.length)],
          x: Math.max(8, Math.min(spot.x, width - size - 16)),
          y: spot.y,
          size,
          rot: Math.round(Math.random() * 24 - 12),
        };
        setGhosts((list) => [...list.slice(-2), g]);
        window.setTimeout(() => setGhosts((list) => list.filter((x) => x.id !== g.id)), GHOST_LIFE_MS);
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
      {ghosts.map((g) => (
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

export default function UniverseBackdrop({ section }: { section: BackdropSection }) {
  const { universe } = useUniverse();
  if (universe === 'esc') return <EscBackdrop section={section} />;
  if (universe === 'oli') return <OliBackdrop section={section} />;
  if (universe === 'gri') return <GriBackdrop section={section} />;
  return null;
}
