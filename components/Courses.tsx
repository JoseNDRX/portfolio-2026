'use client';

import { useI18n } from '@/lib/i18n-context';
import { BookOpen, Calendar, ExternalLink } from 'lucide-react';

const courseColors = [
  { from: '#38bdf8', to: '#818cf8' },
  { from: '#34d399', to: '#38bdf8' },
  { from: '#f472b6', to: '#fb923c' },
  { from: '#a78bfa', to: '#38bdf8' },
  { from: '#38bdf8', to: '#34d399' },
  { from: '#fb923c', to: '#f472b6' },
  { from: '#34d399', to: '#a78bfa' },
];

export default function Courses() {
  const { t } = useI18n();
  const courses = t.courses.items;

  return (
    <section
      id="courses"
      style={{ padding: '6rem 1.5rem', background: 'var(--bg-secondary)' }}
    >
      <div className="section-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-tag" style={{ display: 'inline-flex' }}>
            <BookOpen size={12} />
            {t.courses.title}
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: '0.5rem',
            }}
          >
            {t.courses.subtitle}
          </h2>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
          }}
          className="courses-grid"
        >
          {courses.map((course, i) => {
            const colors = courseColors[i % courseColors.length];
            return (
              <div
                key={course.name}
                className="card"
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                {/* Color accent line */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
                  }}
                />

                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${colors.from}20, ${colors.to}20)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.85rem',
                  }}
                >
                  <BookOpen size={18} style={{ color: colors.from }} />
                </div>

                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: 'var(--text-primary)',
                    marginBottom: '0.4rem',
                    lineHeight: 1.4,
                  }}
                >
                  {course.name}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {course.institution}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      background: `linear-gradient(135deg, ${colors.from}20, ${colors.to}20)`,
                      color: colors.from,
                      fontWeight: 600,
                    }}
                  >
                    <Calendar size={11} />
                    {course.year}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .courses-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 550px) {
          .courses-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
