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

export default function UniverseBackdrop({ section }: { section: BackdropSection }) {
  const { universe } = useUniverse();
  if (universe === 'esc') return <EscBackdrop section={section} />;
  return null;
}
