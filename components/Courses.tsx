'use client';

import { useI18n } from '@/lib/i18n-context';
import UniverseBackdrop from '@/components/universe/UniverseBackdrop';
import { useUniverse } from '@/lib/universe-context';
import ScrollCue from '@/components/universe/ScrollCue';
import { BookOpen, Calendar } from 'lucide-react';
import BrandIcon from '@/components/BrandIcon';
import { courseIcon } from '@/lib/course-icons';

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
  const { sectionLabel } = useUniverse();
  const courses = t.courses.items;

  return (
    <section
      id="courses"
      style={{ padding: '6rem 1.5rem', background: 'var(--bg-secondary)' }}
    >
      <UniverseBackdrop section="courses" />
      <div className="section-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-tag" style={{ display: 'inline-flex' }}>
            <BookOpen size={12} />
            {sectionLabel('courses', t.courses.title)}
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
            const icon = courseIcon(course.name);
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

                {/* Icono de la tecnología o del tema del curso */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 'min(var(--radius), 12px)',
                    background: `color-mix(in srgb, ${icon.color} 14%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${icon.color} 30%, transparent)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  {icon.kind === 'brand' ? (
                    <BrandIcon icon={icon.icon} size={28} color={icon.color} />
                  ) : (
                    <icon.icon size={26} style={{ color: icon.color }} aria-hidden="true" />
                  )}
                </div>

                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: '1.08rem',
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem',
                    lineHeight: 1.35,
                  }}
                >
                  {course.name}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.6rem',
                  }}
                >
                  <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                    {course.institution}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.85rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      background: `color-mix(in srgb, ${icon.color} 14%, transparent)`,
                      color: icon.color,
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Calendar size={13} aria-hidden="true" />
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
      <ScrollCue to="contact" />
    </section>
  );
}
