'use client';

import { useI18n } from '@/lib/i18n-context';
import UniverseBackdrop from '@/components/universe/UniverseBackdrop';
import { useUniverse } from '@/lib/universe-context';
import ScrollCue from '@/components/universe/ScrollCue';
import { Briefcase, MapPin, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

/** Logros visibles sin scroll (ordenados del más al menos impactante); el resto
    se ve con scroll dentro del contenedor. En móvil se muestran menos. */
const VISIBLE_DESKTOP = 7;
const VISIBLE_MOBILE = 5;
const MOBILE_QUERY = '(max-width: 760px)';

function useMobile() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(MOBILE_QUERY);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

export default function Experience() {
  const { t, lang } = useI18n();
  const { universe, sectionLabel } = useUniverse();
  const [activeJob, setActiveJob] = useState(0);
  const jobs = t.experience.jobs;
  const visible = useMobile() ? VISIBLE_MOBILE : VISIBLE_DESKTOP;
  const hidden = Math.max(0, jobs[activeJob].highlights.length - visible);

  // Alto del contenedor = hasta el final del último logro visible (se mide porque el alto
  // de cada logro depende del texto y del ancho de pantalla).
  const listRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState<number | null>(null);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = 0;
    const measure = () => {
      const items = el.children;
      if (items.length <= visible) {
        setMaxH(null);
        return;
      }
      const last = items[visible - 1] as HTMLElement;
      setMaxH(last.offsetTop - el.offsetTop + last.offsetHeight + 4);
    };
    // El ResizeObserver mide al empezar a observar y cada vez que cambia el ancho.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [activeJob, lang, universe, visible]);

  return (
    <section
      id="experience"
      style={{ padding: '6rem 1.5rem', background: 'var(--bg-secondary)' }}
    >
      <UniverseBackdrop section="experience" />
      <div className="section-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-tag" style={{ display: 'inline-flex' }}>
            <Briefcase size={12} />
            {sectionLabel('experience', t.experience.title)}
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: '0.5rem',
            }}
          >
            {t.experience.subtitle}
          </h2>
        </div>

        {/* Tabs + Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '2rem',
            alignItems: 'start',
          }}
          className="exp-grid"
        >
          {/* Company tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {jobs.map((job, i) => (
              <button
                key={job.company}
                onClick={() => {
                  setActiveJob(i);
                  setAtEnd(false);
                }}
                style={{
                  textAlign: 'left',
                  padding: '1rem 1.1rem',
                  borderRadius: '12px',
                  border: activeJob === i ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                  background: activeJob === i ? 'var(--accent-light)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: activeJob === i ? 'var(--accent)' : 'var(--text-primary)',
                    marginBottom: '0.2rem',
                  }}
                >
                  {job.company}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{job.period}</div>
              </button>
            ))}
          </div>

          {/* Job detail */}
          <div className="card" key={activeJob}>
            {/* Role + period */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h3
                className="gradient-text"
                style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}
              >
                {jobs[activeJob].role}
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Briefcase size={14} style={{ color: 'var(--accent)' }} />
                  {jobs[activeJob].company}
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <MapPin size={14} style={{ color: 'var(--accent-2)' }} />
                  {jobs[activeJob].location}
                </span>
                <span
                  className="skill-badge"
                  style={{ fontSize: '0.78rem' }}
                >
                  {jobs[activeJob].period}
                </span>
              </div>
            </div>

            {/* Highlights: se ven los 7 principales; el resto con scroll interno */}
            <div style={{ position: 'relative' }}>
            <div
              ref={listRef}
              className="exp-highlights"
              onScroll={(e) => setAtEnd(e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight - 4)}
              {...(hidden > 0 ? { tabIndex: 0, role: 'region', 'aria-label': t.experience.highlightsLabel } : {})}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem',
                maxHeight: maxH ?? undefined,
                overflowY: maxH ? 'auto' : undefined,
                paddingRight: maxH ? '0.4rem' : undefined,
              }}
            >
              {jobs[activeJob].highlights.map((hl, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '0.6rem',
                    alignItems: 'flex-start',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  <ChevronRight
                    size={16}
                    style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }}
                  />
                  {hl}
                </div>
              ))}
            </div>
            {/* Aviso de que hay más logros con scroll */}
            {hidden > 0 && !atEnd && (
              <div className="exp-more" aria-hidden="true">
                <span>{t.experience.moreHighlights.replace('{n}', String(hidden))}</span>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .exp-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .exp-highlights { scrollbar-width: thin; scrollbar-color: var(--accent) transparent; overscroll-behavior: contain; }
        .exp-highlights:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
        .exp-more {
          position: absolute; left: 0; right: 0.4rem; bottom: 0; height: 72px;
          display: flex; align-items: flex-end; justify-content: center; padding-bottom: 6px;
          background: linear-gradient(180deg, transparent, var(--bg-card) 85%);
          pointer-events: none;
        }
        .exp-more span {
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.06em; color: var(--accent);
          padding: 0.25rem 0.75rem; border: 1px solid var(--accent-soft); border-radius: 999px; background: var(--bg-card);
        }
      `}</style>
      <ScrollCue to="projects" />
    </section>
  );
}
