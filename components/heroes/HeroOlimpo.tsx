'use client';

import { useI18n } from '@/lib/i18n-context';
import ScrollCue from '@/components/universe/ScrollCue';
import { universeCopy } from '@/lib/universe-copy';

const stars = [
  { x: 70, y: 90, label: 'LIMS', lx: 40, ly: 74 },
  { x: 190, y: 60, label: 'CRM', lx: 168, ly: 42 },
  { x: 300, y: 120, label: 'NESTJS', lx: 310, ly: 112 },
  { x: 350, y: 240, label: 'ANGULAR', lx: 300, ly: 272 },
  { x: 250, y: 330, label: 'DOCKER', lx: 236, ly: 360 },
  { x: 120, y: 300, label: 'IA', lx: 100, ly: 330 },
];

export default function HeroOlimpo() {
  const { lang, t } = useI18n();
  const c = universeCopy[lang].oli;
  const words = t.hero.name.split(' ');

  return (
    <section id="hero" className="u-hero oli-bg oli-hero">
      <svg aria-hidden="true" width="100%" height="34" style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}>
        <defs>
          <pattern id="oli-meander" width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M2 32 V2 H30 V26 H10 V10 H22 V18" fill="none" stroke="var(--o-gold-2)" strokeWidth="2.4" />
          </pattern>
        </defs>
        <rect width="100%" height="34" fill="url(#oli-meander)" opacity=".55" />
      </svg>
      <div className="u-wrap">
        <div className="u-main">
          <p className="oli-serif" style={{ fontSize: '1.1rem', letterSpacing: '0.4em', color: 'var(--o-gold-2)', textTransform: 'uppercase' }}>{c.kicker}</p>
          <h1 className="oli-name" style={{ marginTop: '1.5rem', fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', textTransform: 'uppercase' }}>
            {words.slice(0, 2).join(' ')}
            <br />
            {words.slice(2).join(' ')}
          </h1>
          <p className="oli-serif" style={{ marginTop: '1rem', fontSize: '1.9rem', fontStyle: 'italic', color: 'var(--o-text)' }}>{t.hero.title}</p>
          <div aria-hidden="true" style={{ width: 180, height: 1, background: 'linear-gradient(90deg, var(--o-gold-2), transparent)', margin: '1.6rem 0' }} />
          <p className="oli-serif" style={{ maxWidth: 600, fontSize: '1.3rem', lineHeight: 1.6, color: 'var(--o-text-2)' }}>{c.subtitle}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', marginTop: '2.1rem' }}>
            <a href="#projects" className="u-btn" style={{ border: '1px solid var(--o-gold-2)', color: 'var(--o-btn-text)', background: 'var(--o-btn-bg)', fontFamily: 'var(--font-cinzel), Georgia, serif', fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.9rem', textTransform: 'uppercase' }}>{c.cta}</a>
            <a href="#contact" className="u-btn" style={{ border: '1px solid var(--o-gold-2)', color: 'var(--o-gold)', fontFamily: 'var(--font-cinzel), Georgia, serif', fontWeight: 600, letterSpacing: '0.12em', fontSize: '0.9rem', textTransform: 'uppercase' }}>{c.contact}</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', marginTop: '2.9rem', maxWidth: 560, borderTop: '1px solid var(--o-rule)' }}>
            {['XXV+', 'XXX+', 'XV+'].map((v, i) => (
              <div key={v} style={{ padding: i === 0 ? '1rem 0.75rem 0 0' : '1rem 0.75rem 0', borderLeft: i ? '1px solid var(--o-rule)' : 'none' }}>
                <div className="oli-name" style={{ fontSize: '1.9rem' }}>{v}</div>
                <div className="oli-serif" style={{ fontSize: '1rem', color: 'var(--o-text-2)' }}>{c.stats[i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="u-side" style={{ flexBasis: 360 }}>
          <svg viewBox="0 0 420 420" width="100%" style={{ maxWidth: 440, display: 'block', margin: '0 auto' }} role="img" aria-label={`${c.constellation}: ${stars.map((s) => s.label).join(', ')}`}>
            <g stroke="var(--o-gold-2)" strokeWidth="1.2" fill="none" opacity=".7">
              <path className="oli-line" d="M70 90 L190 60 L300 120 L350 240 L250 330 L120 300 L70 90" />
              <path className="oli-line" d="M190 60 L210 200 L350 240 M210 200 L120 300" style={{ animationDelay: '.8s' }} />
            </g>
            <g fill="var(--o-star)">
              {stars.map((s, i) => (
                <circle key={s.label} className={`u-twinkle ${['', 'd2', 'd3'][i % 3]}`} cx={s.x} cy={s.y} r={i % 2 ? 6 : 5} />
              ))}
              <circle cx="210" cy="200" r="9" fill="var(--o-star-core)" />
              <circle className="u-twinkle d2" cx="30" cy="200" r="1.6" />
              <circle className="u-twinkle" cx="390" cy="60" r="1.6" />
              <circle className="u-twinkle d3" cx="380" cy="380" r="1.6" />
              <circle className="u-twinkle" cx="160" cy="390" r="1.4" />
            </g>
            <g fontFamily="var(--font-cinzel), Georgia, serif" fontSize="14" fill="var(--o-gold)" letterSpacing="2">
              {stars.map((s) => (
                <text key={s.label} x={s.lx} y={s.ly}>{lang === 'en' && s.label === 'IA' ? 'AI' : s.label}</text>
              ))}
            </g>
          </svg>
        </div>
      </div>
      <ScrollCue />
    </section>
  );
}
