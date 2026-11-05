'use client';

import { useI18n } from '@/lib/i18n-context';
import UniverseBackdrop from '@/components/universe/UniverseBackdrop';
import { useUniverse } from '@/lib/universe-context';
import ScrollCue from '@/components/universe/ScrollCue';
import { Briefcase, MapPin, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Experience() {
  const { t } = useI18n();
  const { sectionLabel } = useUniverse();
  const [activeJob, setActiveJob] = useState(0);
  const jobs = t.experience.jobs;

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
                onClick={() => setActiveJob(i)}
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

            {/* Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
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
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .exp-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <ScrollCue to="projects" />
    </section>
  );
}
