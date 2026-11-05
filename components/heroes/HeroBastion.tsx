'use client';

import { useI18n } from '@/lib/i18n-context';
import ScrollCue from '@/components/universe/ScrollCue';
import { universeCopy, heroSkills } from '@/lib/universe-copy';

const ash = [
  { left: '20%', delay: '0s' },
  { left: '42%', delay: '-3s' },
  { left: '63%', delay: '-6s' },
  { left: '81%', delay: '-1.5s' },
  { left: '95%', delay: '-4.5s' },
];

export const WALL_PATH =
  'M0 260 V120 H60 V95 H90 V120 H180 V95 H210 V120 H300 V60 H340 V40 H380 V60 H420 V120 H520 V95 H550 V120 H640 V95 H670 V120 H860 V95 H890 V120 H980 V60 H1020 V40 H1060 V60 H1100 V120 H1200 V95 H1230 V120 H1320 V95 H1350 V120 H1440 V260 Z';

export default function HeroBastion() {
  const { lang, t } = useI18n();
  const c = universeCopy[lang].bas;
  const words = t.hero.name.split(' ');

  return (
    <section id="hero" className="u-hero bas-bg bas-hero">
      <div className="u-focus-lines" aria-hidden="true" style={{ opacity: 0.5 }} />
      {ash.map((a) => (
        <div key={a.left} className="u-ash" style={{ left: a.left, animationDelay: a.delay }} />
      ))}
      <svg aria-hidden="true" viewBox="0 0 1440 260" preserveAspectRatio="none" width="100%" height="260" style={{ position: 'absolute', left: 0, bottom: 0, zIndex: 1 }}>
        <path d={WALL_PATH} fill="var(--b-wall)" />
        <path d="M0 260 V190 H1440 V260 Z" fill="var(--b-ground)" />
      </svg>
      <div className="u-wrap" style={{ paddingBottom: '13rem' }}>
        <div className="u-main" style={{ flexBasis: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap' }}>
            <span className="bas-jp" lang="ja" style={{ fontSize: '2.5rem', color: 'var(--b-ember)', lineHeight: 1 }}>第1話</span>
            <span className="bas-font" style={{ fontSize: '1rem', letterSpacing: '0.3em', color: 'var(--b-text-2)', textTransform: 'uppercase' }}>{c.episode}</span>
          </div>
          <h1 className="bas-name" style={{ marginTop: '1.4rem', fontSize: 'clamp(3.2rem, 8.5vw, 7.4rem)' }}>
            {words.slice(0, 2).join(' ')}
            <br />
            {words.slice(2).join(' ')}
          </h1>
          <p className="bas-jp" lang="ja" style={{ marginTop: '0.75rem', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--b-text-2)' }}>ソフトウェア開発コーディネーター</p>
          <p className="bas-font" style={{ marginTop: '0.4rem', fontSize: '1.4rem', letterSpacing: '0.14em', color: 'var(--b-ember)', textTransform: 'uppercase' }}>{t.hero.title}</p>
          <p style={{ marginTop: '1.4rem', maxWidth: 600, fontSize: '1.1rem', lineHeight: 1.6 }}>{c.quote}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', marginTop: '1.9rem' }}>
            <a href="#projects" className="u-btn bas-font" style={{ background: 'var(--b-ember)', color: 'var(--b-on-ember)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{c.cta}</a>
            <a href="#contact" className="u-btn bas-font" style={{ border: '2px solid var(--b-text)', color: 'var(--b-text)', fontWeight: 500, fontSize: '1.1rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{c.contact}</a>
          </div>
        </div>
        <div className="u-side">
          <div className="u-cape" style={{ background: 'var(--b-card)', border: '1px solid var(--b-line)', backdropFilter: 'blur(4px)', padding: '1.4rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--b-line)', paddingBottom: '0.75rem' }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--b-ember)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2 L20 5 V11 C20 16 16.5 20 12 22 C7.5 20 4 16 4 11 V5 Z" />
                <circle cx="12" cy="11" r="3" />
                <path d="M12 6 V8 M12 14 V16 M7 11 H9 M15 11 H17" />
              </svg>
              <div>
                <h2 className="bas-font" style={{ fontSize: '1.1rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>{c.file}</h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--b-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.division}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.6rem', marginTop: '1rem' }}>
              {['25+', '30+', '15+'].map((v, i) => (
                <div key={v}>
                  <div className="bas-font" style={{ fontSize: '2.1rem', fontWeight: 700, color: i ? 'var(--b-name)' : 'var(--b-ember)' }}>{v}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--b-text-2)' }}>{c.stats[i]}</div>
                </div>
              ))}
            </div>
            <div className="bas-font" style={{ marginTop: '1rem', fontSize: '0.8rem', letterSpacing: '0.2em', color: 'var(--b-muted)', textTransform: 'uppercase' }}>{c.gear}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
              {heroSkills[lang].map((s) => (
                <span key={s} style={{ border: '1px solid var(--b-line)', padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ScrollCue />
    </section>
  );
}
