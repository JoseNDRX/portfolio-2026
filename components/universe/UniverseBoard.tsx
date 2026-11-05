'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import type { Lang } from '@/lib/translations';
import { useUniverse } from '@/lib/universe-context';
import { universeCopy } from '@/lib/universe-copy';
import { UNIVERSES, UNIVERSE_IDS, type UniverseId } from '@/lib/universes';
import MagicCircle from './MagicCircle';

/** Mini clip en loop de cada póster (se reproduce al pasar el cursor). */
function Clip({ id, lang }: { id: UniverseId; lang: Lang }) {
  const k = universeCopy[lang];
  switch (id) {
    case 'pro':
      return (
        <div className="u-clip pro-grid-bg">
          <div className="u-orb" style={{ top: 20, right: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(56,189,248,.35) 0%, transparent 70%)' }} />
          <div className="c-slide" style={{ position: 'absolute', left: 18, right: 18, top: 90, font: '800 26px/1.05 var(--font-inter), sans-serif', color: '#f8fafc' }}>
            José Andrés
            <br />
            <span style={{ color: '#38bdf8', fontSize: 15, fontWeight: 600 }}>Software Coordinator</span>
          </div>
          <div style={{ position: 'absolute', left: 18, bottom: 18, display: 'flex', gap: 6 }}>
            <span style={{ width: 44, height: 8, borderRadius: 4, background: '#38bdf8' }} />
            <span style={{ width: 28, height: 8, borderRadius: 4, background: '#334155' }} />
          </div>
        </div>
      );
    case 'esc':
      return (
        <div className="u-clip esc-bg">
          <div className="c-slide esc-font" style={{ position: 'absolute', left: 16, top: 46, width: 150, height: 80, background: '#fff', border: '3px solid #111', boxShadow: '4px 4px 0 #111', fontSize: 22, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', textShadow: '2px 2px 0 #e63946' }}>{lang === 'es' ? '¡HOLA!' : 'HI!'}</div>
          <div className="esc-burst c-burst esc-font" style={{ position: 'absolute', right: 12, bottom: 16, width: 110, height: 110, background: '#c1121f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff' }}>{k.esc.burst}</div>
        </div>
      );
    case 'oli':
      return (
        <div className="u-clip oli-bg">
          {/* El Partenón real del hero, con rayo de luz y estrellas */}
          <div className="c-slide-bg" style={{ position: 'absolute', inset: 0, background: "url('/universes/olimpo/ol-parthenon_w.jpg') center 35% / cover", filter: 'brightness(.45) sepia(.3) saturate(.8)' }} />
          <div className="c-beam" style={{ position: 'absolute', left: '50%', top: 0, width: 70, marginLeft: -35, height: '100%', background: 'linear-gradient(180deg, rgba(243,221,154,.9), rgba(243,221,154,0))' }} />
          <svg viewBox="0 0 220 230" width="100%" height="230" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
            <g fill="#f3dd9a">
              <circle className="u-twinkle" cx="30" cy="60" r="2.4" />
              <circle className="u-twinkle d2" cx="190" cy="50" r="2" />
              <circle className="u-twinkle d3" cx="170" cy="170" r="2.4" />
              <circle className="u-twinkle" cx="40" cy="180" r="2" />
              <circle className="u-twinkle d2" cx="120" cy="30" r="1.6" />
            </g>
          </svg>
          <div className="oli-name" style={{ position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center', fontSize: 22, letterSpacing: '.24em' }}>{UNIVERSES.oli.name[lang].toUpperCase()}</div>
        </div>
      );
    case 'gri':
      return (
        <div className="u-clip gri-bg">
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MagicCircle className="mc-poster" drawClass="c-draw" size={180} />
          </div>
          <div className="u-mote" style={{ left: '30%', bottom: 0 }} />
          <div className="u-mote" style={{ left: '70%', bottom: 0, animationDelay: '3s' }} />
        </div>
      );
    case 'pulp':
      return (
        <div className="u-clip" style={{ background: '#0b0b0b' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#e5383b' }} />
          <div className="c-splitT" style={{ position: 'absolute', inset: 0, background: '#0b0b0b', clipPath: 'polygon(0 0, 100% 0, 100% 42%, 0 62%)', display: 'flex', justifyContent: 'center', paddingTop: 64, zIndex: 2 }}>
            <span className="pulp-name" style={{ fontSize: 18, letterSpacing: '.3em', color: '#e5383b' }}>{k.pulp.chapter.toUpperCase()}</span>
          </div>
          <div className="c-splitB" style={{ position: 'absolute', inset: 0, background: '#0b0b0b', clipPath: 'polygon(0 62%, 100% 42%, 100% 100%, 0 100%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 40, zIndex: 2 }}>
            <span className="pulp-name" style={{ fontSize: 26 }}>{k.pulp.chapterName.toUpperCase()}</span>
          </div>
          <div className="c-slash" style={{ position: 'absolute', left: '-10%', width: '120%', top: '50%', height: 3, background: '#e5383b', zIndex: 3 }} />
        </div>
      );
    case 'bas':
      return (
        <div className="u-clip bas-bg">
          <div className="c-shake" style={{ position: 'absolute', inset: 0 }}>
            <div className="u-focus-lines" aria-hidden="true" style={{ opacity: 0.6 }} />
            <div className="u-ash" style={{ left: '30%' }} />
            <div className="u-ash" style={{ left: '65%', animationDelay: '-4s' }} />
            <div className="u-ash" style={{ left: '88%', animationDelay: '-2s' }} />
            <svg aria-hidden="true" viewBox="0 0 220 80" preserveAspectRatio="none" width="100%" height="80" style={{ position: 'absolute', left: 0, bottom: 0 }}>
              <path d="M0 80 V36 H20 V28 H30 V36 H60 V16 H80 V36 H120 V28 H130 V36 H160 V16 H180 V36 H220 V80 Z" fill="#141618" />
            </svg>
            <div className="c-ep" style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center' }}>
              <div className="bas-jp" lang="ja" style={{ fontSize: 44, color: '#f2ede3', lineHeight: 1 }}>第1話</div>
              <div className="bas-font" style={{ fontSize: 13, letterSpacing: '.3em', color: '#e07a3f', marginTop: 6 }}>{k.bas.introTitle.toUpperCase()}</div>
            </div>
          </div>
        </div>
      );
  }
}

const titleStyle: Record<UniverseId, React.CSSProperties> = {
  pro: { fontFamily: 'var(--font-inter), sans-serif', fontWeight: 800, fontSize: 18 },
  esc: { fontFamily: 'var(--font-bangers), Impact, sans-serif', fontSize: 22, letterSpacing: '.05em' },
  oli: { fontFamily: 'var(--font-cinzel), Georgia, serif', fontSize: 18, fontWeight: 700, letterSpacing: '.08em' },
  gri: { fontFamily: 'var(--font-fell), Georgia, serif', fontSize: 22 },
  pulp: { fontFamily: 'var(--font-anton), Impact, sans-serif', fontSize: 20, letterSpacing: '.04em', textTransform: 'uppercase' },
  bas: { fontFamily: 'var(--font-oswald), Impact, sans-serif', fontSize: 20, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' },
};

export default function UniverseBoard() {
  const { lang } = useI18n();
  const { universe, boardOpen, closeBoard, chooseUniverse } = useUniverse();
  const c = universeCopy[lang].board;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!boardOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBoard();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, [boardOpen, closeBoard]);

  if (!boardOpen) return null;

  return (
    <div className="u-board" role="dialog" aria-modal="true" aria-labelledby="u-board-title" onClick={(e) => e.target === e.currentTarget && closeBoard()}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '2.5rem 1.5rem 3rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p style={{ font: '700 12px var(--font-inter), sans-serif', letterSpacing: '.3em', color: '#e5383b', textTransform: 'uppercase' }}>{c.kicker}</p>
            <h2 id="u-board-title" style={{ marginTop: 8, fontFamily: 'var(--font-anton), Impact, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#f1e9d2', fontWeight: 400, textTransform: 'uppercase' }}>{c.title}</h2>
            <p style={{ marginTop: 6, color: '#a1a1aa', fontSize: 15 }}>{c.hint}</p>
          </div>
          <button ref={closeRef} onClick={closeBoard} aria-label={c.close} style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #3f3f46', background: 'transparent', color: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div className="u-board-grid">
          {UNIVERSE_IDS.map((id) => {
            const u = UNIVERSES[id];
            const active = universe === id;
            return (
              <button key={id} className="u-poster" aria-pressed={active} onClick={() => chooseUniverse(id)}>
                <div style={{ position: 'relative' }}>
                  <div className="u-clip-label" aria-hidden="true">
                    <span className="u-rec" />
                    {c.preview}
                  </div>
                  <Clip id={id} lang={lang} />
                </div>
                <div style={{ padding: '14px 16px 16px', color: '#f4f4f5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <span style={titleStyle[id]}>{u.name[lang]}</span>
                    {active && <span style={{ font: '700 10px var(--font-inter), sans-serif', letterSpacing: '.1em', whiteSpace: 'nowrap', color: '#34d399', textTransform: 'uppercase' }}>{c.onScreen}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: '#a1a1aa', marginTop: 4, fontFamily: 'var(--font-inter), sans-serif' }}>{u.tagline[lang]}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
