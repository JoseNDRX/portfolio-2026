'use client';

import { useI18n } from '@/lib/i18n-context';
import { Code2 } from 'lucide-react';

const skillData = {
  languages: ['JavaScript', 'TypeScript', 'PHP', 'HTML5', 'CSS3', 'SQL', 'VBA'],
  frameworks: ['Angular', 'React', 'Next.js', 'NestJS', 'Node.js', 'Express', 'Tailwind', 'Bootstrap', 'jQuery', 'Laravel'],
  databases: ['PostgreSQL', 'SQL Server', 'Supabase'],
  devops: ['Docker', 'PM2', 'XAMPP', 'Git', 'GitHub', 'GitLab'],
  architecture: ['Microservices', 'MVC / MVVC', 'SOLID', 'Scrum', 'ISO 17025', 'LIMS'],
  tools: ['Power BI', 'WordPress', 'Excel Avanzado', 'SAP', 'Microsoft Dynamics', 'n8n'],
};

export default function Skills() {
  const { t } = useI18n();

  const categories = [
    { key: 'languages' as const, label: t.skills.categories.languages, emoji: '📝' },
    { key: 'frameworks' as const, label: t.skills.categories.frameworks, emoji: '⚡' },
    { key: 'databases' as const, label: t.skills.categories.databases, emoji: '🗄️' },
    { key: 'devops' as const, label: t.skills.categories.devops, emoji: '🐳' },
    { key: 'architecture' as const, label: t.skills.categories.architecture, emoji: '🏗️' },
    { key: 'tools' as const, label: t.skills.categories.tools, emoji: '🛠️' },
  ];

  return (
    <section
      id="skills"
      className="grid-bg"
      style={{ padding: '6rem 1.5rem', background: 'var(--bg-primary)' }}
    >
      <div className="section-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-tag" style={{ display: 'inline-flex' }}>
            <Code2 size={12} />
            {t.skills.title}
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
    </section>
  );
}
