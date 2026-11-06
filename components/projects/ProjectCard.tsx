'use client';

import { FolderOpen, Code2, ExternalLink, Lock } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: readonly string[];
  github: string | null;
  demo: string | null;
  status: string | null;
  year: string;
};

function statusColor(status: string | null) {
  if (!status) return null;
  if (status.includes('producción') || status.includes('Production'))
    return { bg: 'rgba(34,197,94,0.12)', color: '#16a34a', border: 'rgba(34,197,94,0.4)' };
  if (status.includes('laboral') || status.includes('Work'))
    return { bg: 'rgba(52,211,153,0.1)', color: '#0d9488', border: 'rgba(52,211,153,0.35)' };
  if (status.includes('desarrollo') || status.includes('Development'))
    return { bg: 'rgba(251,191,36,0.1)', color: '#d97706', border: 'rgba(251,191,36,0.4)' };
  if (status.includes('actualización') || status.includes('Updating'))
    return { bg: 'rgba(56,189,248,0.1)', color: '#0284c7', border: 'rgba(56,189,248,0.4)' };
  if (status.includes('curso') || status.includes('Course'))
    return { bg: 'rgba(148,163,184,0.12)', color: 'var(--text-muted)', border: 'rgba(148,163,184,0.4)' };
  return null;
}

type Props = {
  project: Project;
  index: number;
  total: number;
  /** "gallery" agrega la portada con el número del expediente. */
  variant?: 'grid' | 'gallery';
  onFocus?: () => void;
};

export default function ProjectCard({ project, index, total, variant = 'grid', onFocus }: Props) {
  const { t } = useI18n();
  const sc = statusColor(project.status);
  const num = String(index + 1).padStart(2, '0');

  return (
    <article
      className="card-gradient-border card"
      onFocus={onFocus}
      aria-label={`${num} / ${String(total).padStart(2, '0')} · ${project.title}`}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', borderRadius: 'var(--radius)' }}
    >
      {variant === 'gallery' && (
        <div className="pg-cover" aria-hidden="true">
          <span className="pg-cover-num">{num}</span>
          <span className="pg-cover-tags">{project.tags.slice(0, 3).join(' · ')}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 'min(var(--radius), 10px)',
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
          {project.year && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{project.year}</span>}
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

      <div style={{ flex: 1 }}>
        <h3 style={{ fontWeight: 700, fontSize: variant === 'gallery' ? '1.25rem' : '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {project.title}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{project.description}</p>
      </div>

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
          <a href={project.demo} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', flex: 1, justifyContent: 'center' }}>
            <ExternalLink size={14} />
            {t.projects.viewDemo}
          </a>
        )}
      </div>
    </article>
  );
}
