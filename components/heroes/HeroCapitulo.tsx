'use client';

import { useI18n } from '@/lib/i18n-context';
import ScrollCue from '@/components/universe/ScrollCue';
import { useUniverse } from '@/lib/universe-context';
import { universeCopy } from '@/lib/universe-copy';
import type { SectionKey } from '@/lib/universes';
import { seededRand } from '@/components/universe/InkSplash';

const chapters: { key: SectionKey; href: string }[] = [
  { key: 'skills', href: '#skills' },
  { key: 'experience', href: '#experience' },
  { key: 'projects', href: '#projects' },
  { key: 'contact', href: '#contact' },
];

/** Tajo afilado: delgado en las puntas y ancho al centro, trazado en horizontal desde x0. */
function gash(len: number, w: number, x0 = 0) {
  const a = x0, b = x0 + len;
  return `M${a} 0Q${(a + len * 0.42).toFixed(1)} ${(-w).toFixed(1)} ${b} 0Q${(a + len * 0.58).toFixed(1)} ${w.toFixed(1)} ${a} 0Z`;
}

// Pared: los tajos rojos se concentran en una diagonal (donde antes iba la franja),
// cruzándose a veces; los rayones finos de tinta se reparten por toda la pared.
const rand = seededRand(1973);
const GASHES = Array.from({ length: 24 }, (_, i) => {
  const t = rand();
  const cross = rand() < 0.28;
  return {
    x: Math.round(t * 1700 - 120),
    y: Math.round(650 - t * 430 + (rand() - 0.5) * 300),
    rot: cross ? Math.round(14 + rand() * 30) : -Math.round(6 + rand() * 26),
    len: Math.round(160 + rand() * 380),
    w: +(4 + rand() * 12).toFixed(1),
    op: +(0.6 + rand() * 0.35).toFixed(2),
    delay: +(0.1 + i * 0.07 + rand() * 0.1).toFixed(2),
  };
});
const SCRATCHES = Array.from({ length: 22 }, () => ({
  x: Math.round(rand() * 1600),
  y: Math.round(rand() * 900),
  rot: Math.round((rand() - 0.5) * 120),
  len: Math.round(50 + rand() * 190),
  w: +(0.8 + rand() * 1.6).toFixed(1),
  op: +(0.14 + rand() * 0.16).toFixed(2),
}));

export default function HeroCapitulo() {
  const { lang, t } = useI18n();
  const { sectionLabel, intro } = useUniverse();
  const c = universeCopy[lang].pulp;
  const words = t.hero.name.split(' ');

  return (
    <section id="hero" className="u-hero pulp-bg pulp-hero u-flicker">
      <svg className="u-grain" aria-hidden="true">
        <filter id="pulp-noise">
          <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#pulp-noise)" />
      </svg>
      {/* Lluvia y relámpago, como en los fondos de las secciones (app/universe-pulp.css) */}
      <div className="ub-pulp-rain" aria-hidden="true" style={{ inset: 0 }} />
      <div className="ub-pulp-rain is-near" aria-hidden="true" style={{ inset: 0 }} />
      <div className="ub-pulp-flash" aria-hidden="true" style={{ inset: 0 }} />
      {/* Pared marcada por tajos de espada (antes era una franja roja) */}
      <svg className={`pulp-wall${intro === 'pulp' ? ' is-waiting' : ''}`} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {SCRATCHES.map((s, i) => (
          <g key={`s${i}`} transform={`translate(${s.x} ${s.y}) rotate(${s.rot})`}>
            <path className="pulp-scratch" d={gash(s.len, s.w)} style={{ opacity: s.op }} />
          </g>
        ))}
        {GASHES.map((g, i) => (
          <g key={i} transform={`translate(${g.x} ${g.y}) rotate(${g.rot})`}>
            <g className="pulp-gash" style={{ animationDelay: `${g.delay}s` }}>
              <path d={gash(g.len, g.w)} style={{ opacity: g.op }} />
              <path className="pulp-gash-core" d={gash(g.len * 0.86, g.w * 0.32, g.len * 0.07)} />
            </g>
          </g>
        ))}
      </svg>
      <div className="u-wrap">
        <div className="u-main" style={{ flexBasis: 640 }}>
          <p className="pulp-name" style={{ fontSize: '1.4rem', letterSpacing: '0.4em', color: 'var(--p-red)' }}>{c.chapter}</p>
          <p className="pulp-serif" style={{ marginTop: '0.5rem', fontStyle: 'italic', fontSize: '1.5rem', color: 'var(--p-text-2)' }}>{c.chapterName}</p>
          <h1 className="pulp-name" style={{ marginTop: '1.25rem', fontSize: 'clamp(3.4rem, 10vw, 9.4rem)' }}>
            {words.slice(0, 2).join(' ')}
            <br />
            {words.slice(2).join(' ')}
          </h1>
          <p className="pulp-serif" style={{ marginTop: '1.75rem', maxWidth: 620, fontSize: '1.3rem', lineHeight: 1.55, background: 'var(--p-bg)', padding: '0.25rem 0', position: 'relative', zIndex: 2 }}>{c.tagline}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', marginTop: '1.9rem', position: 'relative', zIndex: 2 }}>
            <a href="#about" className="u-btn pulp-name" style={{ background: 'var(--p-red)', color: 'var(--p-on-red)', fontSize: '1.25rem', letterSpacing: '0.08em' }}>{c.cta}</a>
            <a href="#contact" className="u-btn pulp-name" style={{ border: '2px solid var(--p-text)', background: 'var(--p-bg)', fontSize: '1.25rem', letterSpacing: '0.08em' }}>{c.contact}</a>
          </div>
        </div>
        <nav aria-label={c.index} className="u-side" style={{ background: 'var(--p-bg)', borderLeft: '3px solid var(--p-red)', padding: '0.9rem 0 0.9rem 1.4rem', position: 'relative', zIndex: 2 }}>
          <div className="pulp-name" style={{ letterSpacing: '0.3em', fontSize: '0.9rem', color: 'var(--p-muted)' }}>{c.index}</div>
          {chapters.map((ch, i) => (
            <a key={ch.key} href={ch.href} className="pulp-serif" style={{ display: 'block', marginTop: i ? '0.75rem' : '0.9rem', color: 'var(--p-text)', textDecoration: 'none', fontSize: '1.15rem' }}>
              <span className="pulp-name" style={{ color: 'var(--p-red)', marginRight: '0.6rem' }}>{sectionLabel(ch.key)}</span>
              {t.nav[ch.key]}
            </a>
          ))}
        </nav>
      </div>
      <ScrollCue />
    </section>
  );
}
