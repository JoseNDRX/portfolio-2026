'use client';

import { useI18n } from '@/lib/i18n-context';
import ScrollCue from '@/components/universe/ScrollCue';
import { universeCopy, heroSkills } from '@/lib/universe-copy';

// Colores en app/universe-themes.css (--e-*), según el modo claro / oscuro.
const chipColors = ['var(--e-chip-1)', 'var(--e-chip-2)', 'var(--e-chip-3)', 'var(--e-chip-4)', 'var(--e-chip-2)', 'var(--e-chip-1)', 'var(--e-chip-2)'];
const line = 'var(--e-line)';

export default function HeroEscuadron() {
  const { lang, t } = useI18n();
  const c = universeCopy[lang].esc;
  const [first, ...rest] = t.hero.name.split(' ');

  return (
    <section id="hero" className="u-hero esc-bg esc-hero">
      <div className="u-wrap" style={{ alignItems: 'stretch' }}>
        <div className="esc-panel u-main" style={{ padding: '2.5rem 2.5rem 2.25rem', position: 'relative', transform: 'rotate(-0.6deg)' }}>
          <div className="esc-font" style={{ display: 'inline-block', background: '#ffd23f', color: '#111', border: `3px solid ${line}`, padding: '0.35rem 0.75rem', fontSize: '1.25rem', textTransform: 'uppercase' }}>
            {c.caption}
          </div>
          <h1 className="esc-name" style={{ marginTop: '1.5rem', textTransform: 'uppercase' }}>
            {first} {rest.slice(0, 1).join(' ')}
            <br />
            {rest.slice(1).join(' ')}
          </h1>
          <p className="esc-font" style={{ marginTop: '0.9rem', fontSize: '1.8rem', color: 'var(--e-blue)', textTransform: 'uppercase' }}>
            {t.hero.title}
          </p>
          <div style={{ position: 'relative', marginTop: '1.6rem', maxWidth: 560, background: 'var(--e-panel)', color: 'var(--e-text)', border: `3px solid ${line}`, borderRadius: 28, padding: '1.1rem 1.4rem', fontSize: '1.05rem', lineHeight: 1.55, fontWeight: 600 }}>
            {c.bubble}
            <div aria-hidden="true" style={{ position: 'absolute', left: 46, bottom: -22, width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: `22px solid ${line}` }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.1rem', marginTop: '2.75rem' }}>
            <a href="#projects" className="u-btn esc-font" style={{ background: '#c1121f', color: '#fff', border: `4px solid ${line}`, boxShadow: `5px 5px 0 ${line}`, fontSize: '1.5rem', textTransform: 'uppercase' }}>
              {c.cta}
            </a>
            <a href="#contact" className="u-btn esc-font" style={{ background: 'var(--e-panel)', color: 'var(--e-text)', border: `4px solid ${line}`, fontSize: '1.4rem', textTransform: 'uppercase' }}>
              {c.contact}
            </a>
          </div>
          <div className="esc-burst esc-pop esc-font" aria-hidden="true" style={{ position: 'absolute', top: -34, right: -26, width: 170, height: 170, background: 'var(--e-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.1rem', color: '#fff', textShadow: '2px 2px 0 #111' }}>
            {c.burst}
          </div>
        </div>

        <div className="u-side" style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          <div className="esc-panel" style={{ padding: '1.4rem 1.5rem', transform: 'rotate(1deg)' }}>
            <h2 className="esc-font" style={{ fontSize: '1.75rem', borderBottom: `3px solid ${line}`, paddingBottom: '0.5rem', textTransform: 'uppercase', color: 'var(--e-text)' }}>{c.card}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.6rem', marginTop: '0.9rem', textAlign: 'center' }}>
              {['25+', '30+', '60+'].map((v, i) => (
                <div key={v}>
                  <div className="esc-font" style={{ fontSize: '2.5rem', color: ['var(--e-red)', 'var(--e-blue)', 'var(--e-text)'][i] }}>{v}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>{c.stats[i]}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="esc-panel" style={{ padding: '1.4rem 1.5rem', flexGrow: 1, transform: 'rotate(-1deg)' }}>
            <h2 className="esc-font" style={{ fontSize: '1.75rem', textTransform: 'uppercase', color: 'var(--e-text)' }}>{c.powers}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
              {heroSkills[lang].map((s, i) => (
                <span key={s} className="esc-chip" style={{ background: chipColors[i % chipColors.length] }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ScrollCue />
    </section>
  );
}
