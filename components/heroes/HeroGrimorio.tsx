'use client';

import { useI18n } from '@/lib/i18n-context';
import ScrollCue from '@/components/universe/ScrollCue';
import { universeCopy, heroSkills } from '@/lib/universe-copy';

const motes = [
  { left: '12%', bottom: '8%', delay: '0s' },
  { left: '32%', bottom: '2%', delay: '2s' },
  { left: '58%', bottom: '6%', delay: '4s' },
  { left: '78%', bottom: '3%', delay: '1s' },
  { left: '90%', bottom: '10%', delay: '5s' },
];

export default function HeroGrimorio() {
  const { lang, t } = useI18n();
  const c = universeCopy[lang].gri;
  const words = t.hero.name.split(' ');

  return (
    <section id="hero" className="u-hero gri-bg gri-hero">
      {motes.map((m) => (
        <div key={m.left} className="u-mote" style={{ left: m.left, bottom: m.bottom, animationDelay: m.delay }} />
      ))}
      <div className="u-wrap">
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', borderRadius: 6, overflow: 'hidden' }}>
          <div className="gri-page" style={{ flex: '1 1 480px', minWidth: 0, padding: 'clamp(1.75rem, 4vw, 3.25rem)', background: 'linear-gradient(90deg, var(--g-page) 85%, var(--g-page-edge) 100%)' }}>
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
          </div>
          <div className="gri-page" style={{ flex: '1 1 420px', minWidth: 0, padding: '2.5rem', background: 'linear-gradient(90deg, var(--g-page-edge) 0%, var(--g-page) 15%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
            <svg viewBox="0 0 300 300" width="290" height="290" style={{ maxWidth: '100%', height: 'auto' }} aria-hidden="true">
              <g fill="none" stroke="var(--g-brown)" strokeWidth="1.4">
                <g className="u-spin">
                  <circle cx="150" cy="150" r="138" />
                  <circle cx="150" cy="150" r="126" strokeDasharray="2 9" strokeWidth="5" stroke="var(--g-brown-2)" />
                </g>
                <g className="u-spin-rev">
                  <polygon points="150,30 254,210 46,210" />
                  <polygon points="150,270 46,90 254,90" />
                  <circle cx="150" cy="150" r="104" />
                </g>
                <circle cx="150" cy="150" r="56" stroke="var(--g-sage)" />
              </g>
              <g fontFamily="var(--font-fell), Georgia, serif" fontSize="13" fill="var(--g-sage)" textAnchor="middle">
                <text x="150" y="146">LIMS · CRM</text>
                <text x="150" y="164">NestJS · {lang === 'en' ? 'AI' : 'IA'}</text>
              </g>
            </svg>
            <div className="gri-serif" style={{ textAlign: 'center', color: 'var(--g-text)' }}>
              <h2 className="gri-title" style={{ fontSize: '1.4rem' }}>{c.spells}</h2>
              <div style={{ marginTop: '0.4rem', fontSize: '1.1rem' }}>{heroSkills[lang].join(' · ')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginTop: '1.1rem', fontSize: '1rem' }}>
                {['25+', '30+', '15+'].map((v, i) => (
                  <span key={v}>
                    <strong style={{ fontSize: '1.4rem', color: 'var(--g-brown)' }}>{v}</strong> {c.stats[i]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollCue />
    </section>
  );
}
