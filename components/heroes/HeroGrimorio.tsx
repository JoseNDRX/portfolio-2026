'use client';

import { useRef } from 'react';
import { useI18n } from '@/lib/i18n-context';
import ScrollCue from '@/components/universe/ScrollCue';
import MagicCircle from '@/components/universe/MagicCircle';
import { universeCopy, heroSkills } from '@/lib/universe-copy';

/** Luciérnagas: doradas y turquesa. */
const FIREFLIES = [
  { left: '10%', bottom: '12%', delay: '0s', tone: 'g' },
  { left: '28%', bottom: '4%', delay: '2s', tone: 't' },
  { left: '46%', bottom: '18%', delay: '4.5s', tone: 'g' },
  { left: '62%', bottom: '6%', delay: '1s', tone: 't' },
  { left: '78%', bottom: '14%', delay: '3.2s', tone: 'g' },
  { left: '90%', bottom: '3%', delay: '5.5s', tone: 't' },
  { left: '54%', bottom: '30%', delay: '6.5s', tone: 't' },
];

export default function HeroGrimorio() {
  const { lang, t } = useI18n();
  const c = universeCopy[lang].gri;
  const words = t.hero.name.split(' ');
  const ref = useRef<HTMLElement>(null);

  // Parallax con el mouse en variables CSS (sin re-render en cada movimiento).
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty('--gy', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };

  return (
    <section id="hero" ref={ref} className="u-hero gri-hero gr-hero" onMouseMove={onMove}>
      <div className="gr-photo" aria-hidden="true" />
      <div className="gr-veil" aria-hidden="true" />
      {FIREFLIES.map((f) => (
        <span key={f.left + f.bottom} className={`gr-firefly gr-firefly-${f.tone}`} style={{ left: f.left, bottom: f.bottom, animationDelay: f.delay }} />
      ))}

      <div className="u-wrap">
        {/* Página del grimorio */}
        <div className="gri-page gr-page u-main">
          <p className="gri-title" style={{ fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--g-muted)' }}>{c.kicker}</p>
          <h1 className="gri-title" style={{ marginTop: '0.5rem', fontSize: 'clamp(2.6rem, 5.5vw, 4.25rem)', lineHeight: 1.02 }}>
            {words.slice(0, 2).join(' ')}
            <br />
            {words.slice(2).join(' ')}
          </h1>
          <p className="gri-serif" style={{ marginTop: '0.9rem', fontSize: '1.5rem', fontWeight: 600, color: 'var(--g-sage)' }}>{t.hero.title}</p>
          <p className="gri-serif" style={{ marginTop: '1.4rem', fontSize: '1.25rem', lineHeight: 1.6, color: 'var(--g-text)', maxWidth: 520 }}>
            <span className="gri-title" aria-hidden="true" style={{ float: 'left', fontSize: '4rem', lineHeight: 0.8, padding: '6px 8px 0 0', color: 'var(--g-brown)' }}>{c.dropCap}</span>
            <span className="sr-only">{c.dropCap}</span>
            {c.subtitle}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.9rem' }}>
            <a href="#projects" className="u-btn gri-serif" style={{ borderRadius: 999, background: 'var(--g-sage)', color: 'var(--g-btn-text)', fontSize: '1.2rem', fontWeight: 600 }}>{c.cta}</a>
            <a href="#contact" className="u-btn gri-serif" style={{ borderRadius: 999, border: '1px solid var(--g-brown)', color: 'var(--g-outline-text)', fontSize: '1.2rem', fontWeight: 600 }}>{c.contact}</a>
          </div>
          <div className="gri-serif" style={{ marginTop: '2rem', paddingTop: '1.2rem', borderTop: '1px solid var(--g-page-edge)', color: 'var(--g-text)' }}>
            <h2 className="gri-title" style={{ fontSize: '1.3rem' }}>{c.spells}</h2>
            <div style={{ marginTop: '0.35rem', fontSize: '1.05rem' }}>{heroSkills[lang].join(' · ')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.4rem', marginTop: '0.9rem', fontSize: '1rem' }}>
              {['25+', '30+', '60+'].map((v, i) => (
                <span key={v}>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--g-brown)' }}>{v}</strong> {c.stats[i]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Altar: solo el círculo mágico (los objetos flotantes aparecen en las demás secciones) */}
        <div className="gr-stage u-side" aria-hidden="true">
          <div className="gr-circle">
            <MagicCircle className="mc-hero" size={460} />
          </div>
        </div>
      </div>
      <ScrollCue />
    </section>
  );
}
