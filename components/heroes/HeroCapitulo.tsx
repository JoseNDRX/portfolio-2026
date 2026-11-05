'use client';

import { useI18n } from '@/lib/i18n-context';
import ScrollCue from '@/components/universe/ScrollCue';
import { useUniverse } from '@/lib/universe-context';
import { universeCopy } from '@/lib/universe-copy';
import type { SectionKey } from '@/lib/universes';

const chapters: { key: SectionKey; href: string }[] = [
  { key: 'skills', href: '#skills' },
  { key: 'experience', href: '#experience' },
  { key: 'projects', href: '#projects' },
  { key: 'contact', href: '#contact' },
];

export default function HeroCapitulo() {
  const { lang, t } = useI18n();
  const { sectionLabel } = useUniverse();
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
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10%', right: '-10%', top: '52%', height: 120, background: 'var(--p-red)', transform: 'rotate(-11deg)', opacity: 0.9, zIndex: 1 }} />
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
