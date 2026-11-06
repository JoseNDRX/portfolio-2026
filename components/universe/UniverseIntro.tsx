'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n-context';
import { useUniverse } from '@/lib/universe-context';
import { universeCopy } from '@/lib/universe-copy';
import { WALL_PATH } from '@/components/heroes/HeroBastion';
import MagicCircle from './MagicCircle';
import InkSplash, { makeSplash, seededRand } from './InkSplash';

/** La salpicadura de la intro es siempre la misma (generador fijo). */
const INTRO_SPLASH = makeSplash(seededRand(1977));

function Letterbox() {
  return (
    <>
      <div className="u-lb-top" />
      <div className="u-lb-bot" />
    </>
  );
}

export default function UniverseIntro() {
  const { lang } = useI18n();
  const { intro, skipIntro } = useUniverse();
  const copy = universeCopy[lang];

  useEffect(() => {
    if (!intro) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skipIntro();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [intro, skipIntro]);

  if (!intro) return null;

  const skip = (
    <button className="u-skip" onClick={skipIntro} autoFocus>
      {copy.skip}
    </button>
  );

  if (intro === 'esc') {
    const c = copy.esc;
    const colors = ['#111', '#1d4ed8', '#c1121f'];
    return (
      // Intro más larga para alcanzar a leer las tres viñetas (introMs = 6000 en universes.ts).
      <div key="esc" className="u-intro esc-bg" role="presentation" style={{ '--intro-out': '5.55s' } as React.CSSProperties}>
        <Letterbox />
        <div className="u-intro-panels" style={{ position: 'absolute', inset: '14% 6%', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18 }}>
          {c.intro.map((line, i) => (
            <div key={line} className={`esc-panel esc-font ie-p${i + 1}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.6rem, 3.4vw, 2.75rem)', color: colors[i], textAlign: 'center', padding: 10, textTransform: 'uppercase' }}>
              {line}
            </div>
          ))}
        </div>
        <div className="ie-title" style={{ position: 'absolute', left: 0, right: 0, bottom: '14%', textAlign: 'center', zIndex: 5 }}>
          <span className="esc-font" style={{ display: 'inline-block', background: '#111', color: '#ffd23f', fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', letterSpacing: '.1em', padding: '8px 18px', textTransform: 'uppercase' }}>{c.introTitle}</span>
        </div>
        {skip}
      </div>
    );
  }

  if (intro === 'oli') {
    const c = copy.oli;
    return (
      // 6 s (introMs = 6000 en universes.ts): humo → Perseo → la Musa → relámpago → título.
      <div key="oli" className="u-intro" style={{ background: '#050505', '--intro-out': '5.5s' } as React.CSSProperties} role="presentation">
        <Letterbox />
        <div className="io2-smoke" style={{ left: '4%' }} />
        <div className="io2-smoke" style={{ left: '34%', animationDelay: '.5s' }} />
        <div className="io2-smoke" style={{ left: '64%', animationDelay: '1s' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 20px', textAlign: 'center' }}>
          <div className="io2-hero">
            <Image src="/universes/olimpo/concept/coro-perseo.jpg" alt="" fill sizes="260px" priority />
          </div>
          <div className="io2-musa">{c.introMusa}</div>
          <div className="io2-title">{c.introTitle}</div>
          <div className="io2-sub">{c.introSub}</div>
        </div>
        <div className="io2-flash" />
        {skip}
      </div>
    );
  }

  if (intro === 'gri') {
    const c = copy.gri;
    return (
      <div key="gri" className="u-intro" style={{ background: 'radial-gradient(ellipse at center, #3b3322 0%, #17140d 75%)' }} role="presentation">
        <Letterbox />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '0 20px' }}>
          <MagicCircle className="mc-intro" drawClass="ig-draw" size={340}>
            <circle className="ig-glow" cx="150" cy="150" r="30" fill="#b8fff4" opacity=".85" />
          </MagicCircle>
          <div className="ig-title gri-title" style={{ fontSize: 'clamp(2rem, 5vw, 2.9rem)', color: '#f6eedb', textAlign: 'center' }}>{c.introTitle}</div>
        </div>
        {skip}
      </div>
    );
  }

  if (intro === 'pulp') {
    const c = copy.pulp;
    const top = 'polygon(0 0, 100% 0, 100% 40%, 0 60%)';
    const bottom = 'polygon(0 60%, 100% 40%, 100% 100%, 0 100%)';
    return (
      <div key="pulp" className="u-intro" role="presentation">
        <div className="ip-top" style={{ position: 'absolute', inset: 0, background: '#0b0b0b', clipPath: top, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '12%' }}>
          <div className="ip-c1 pulp-name" style={{ fontSize: 'clamp(1.3rem, 3vw, 2.1rem)', letterSpacing: '.5em', color: '#e5383b' }}>{c.introChapter}</div>
        </div>
        <div className="ip-bot" style={{ position: 'absolute', inset: 0, background: '#0b0b0b', clipPath: bottom, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '16%' }}>
          <div className="ip-c2 pulp-name" style={{ fontSize: 'clamp(3rem, 9vw, 6rem)', textAlign: 'center' }}>{c.introTitle}</div>
        </div>
        <div className="ip-line" style={{ position: 'absolute', left: '-5%', top: '59%', width: '115%', height: 4, background: '#e5383b', boxShadow: '0 0 18px #e5383b', zIndex: 4 }} />
        {/* El tajo de katana corta la pantalla y salpica tinta justo antes de que se abra */}
        <InkSplash splash={INTRO_SPLASH} rot={-11} delay={3.4} className="ip-splash" />
        {skip}
      </div>
    );
  }

  // Bastión
  const c = copy.bas;
  return (
    <div key="bas" className="u-intro" style={{ background: '#0e0f10' }} role="presentation">
      <Letterbox />
      <div className="u-shake" style={{ position: 'absolute', inset: 0 }}>
        <div className="u-focus-lines" aria-hidden="true" style={{ opacity: 0.9 }} />
        {['15%', '35%', '55%', '75%', '90%'].map((l, i) => (
          <div key={l} className="u-ash" style={{ left: l, animationDelay: `${-i * 1.7}s` }} />
        ))}
        <svg aria-hidden="true" viewBox="0 0 1440 260" preserveAspectRatio="none" width="100%" height="34%" style={{ position: 'absolute', left: 0, bottom: 0 }}>
          <path d={WALL_PATH} fill="#1d2023" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
          <div className="ib-jp bas-jp" lang="ja" style={{ fontSize: 'clamp(4.5rem, 12vw, 7.5rem)', color: '#f2ede3', lineHeight: 1 }}>第1話</div>
          <div className="ib-ep bas-font" style={{ fontSize: 20, letterSpacing: '.5em', color: '#d8cfc0', marginTop: 14, textTransform: 'uppercase' }}>{c.introEpisode}</div>
          <div className="ib-title bas-name" style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', color: '#e07a3f', marginTop: 18 }}>{c.introTitle}</div>
        </div>
      </div>
      <div className="ib-flash" aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#f7d9b8', zIndex: 8, pointerEvents: 'none' }} />
      {skip}
    </div>
  );
}
