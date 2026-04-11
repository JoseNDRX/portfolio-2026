'use client';

import { useI18n } from '@/lib/i18n-context';
import { FolderOpen, Code2, ExternalLink, Lock } from 'lucide-react';

export default function Projects() {
  const { t } = useI18n();
  const projects = t.projects.items;

  const statusColor = (status: string | null) => {
    if (!status) return null;
    if (status.includes('laboral') || status.includes('Work'))
      return { bg: 'rgba(52,211,153,0.1)', color: '#34d399', border: 'rgba(52,211,153,0.3)' };
    if (status.includes('desarrollo') || status.includes('Development'))
      return { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)' };
    return null;
  };

  return (
    <section
      id="projects"
      className="grid-bg"
      style={{ padding: '6rem 1.5rem', background: 'var(--bg-primary)' }}
    >
      <div className="section-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-tag" style={{ display: 'inline-flex' }}>
            <FolderOpen size={12} />
            {t.projects.title}
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: '0.5rem',
            }}
          >
            {t.projects.subtitle}
          </h2>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
          }}
          className="projects-grid"
        >
          {projects.map((project) => {
            const sc = statusColor(project.status);
            return (
              <div
                key={project.id}
                className="card-gradient-border card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  height: '100%',
                }}
              >
                {/* Top */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '10px',
                      background: 'var(--accent-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                    }}
                  >
                    <FolderOpen size={20} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {project.year}
                    </span>
                    {sc && (
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                        }}
                      >
                        {project.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title + description */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.65,
                    }}
                  >
                    {project.description}
                  </p>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', flex: 1, justifyContent: 'center' }}
                    >
                      <Code2 size={14} />
                      {t.projects.viewCode}
                    </a>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        border: '1.5px solid var(--border)',
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)',
                        flex: 1,
                        justifyContent: 'center',
                      }}
                    >
                      <Lock size={13} />
                      {t.projects.workProject}
                    </div>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      className="btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', flex: 1, justifyContent: 'center' }}
                    >
                      <ExternalLink size={14} />
                      {t.projects.viewDemo}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .projects-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 550px) {
          .projects-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
