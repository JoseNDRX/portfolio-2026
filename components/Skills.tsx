'use client';

import { useI18n } from '@/lib/i18n-context';
import UniverseBackdrop from '@/components/universe/UniverseBackdrop';
import { useUniverse } from '@/lib/universe-context';
import ScrollCue from '@/components/universe/ScrollCue';
import { Code2 } from 'lucide-react';

import { skillData, skillCategoryOrder } from '@/lib/skills';

export default function Skills() {
  const { t } = useI18n();
  const { sectionLabel } = useUniverse();

  const categories = skillCategoryOrder.map((c) => ({ ...c, label: t.skills.categories[c.key] }));

  return (
    <section
      id="skills"
      className="grid-bg"
      style={{ padding: '6rem 1.5rem', background: 'var(--bg-primary)' }}
    >
      <UniverseBackdrop section="skills" />
      <div className="section-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-tag" style={{ display: 'inline-flex' }}>
            <Code2 size={12} />
            {sectionLabel('skills', t.skills.title)}
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: '0.5rem',
            }}
          >
            {t.skills.subtitle}
          </h2>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
          }}
          className="skills-grid"
        >
          {categories.map((cat) => (
            <div key={cat.key} className="card-gradient-border card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '1.1rem',
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{cat.emoji}</span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: 'var(--accent)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {cat.label}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {skillData[cat.key].map((skill) => (
                  <span key={skill} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .skills-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 550px) {
          .skills-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <ScrollCue to="experience" />
    </section>
  );
}
