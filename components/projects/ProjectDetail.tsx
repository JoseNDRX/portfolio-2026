'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Code2, ExternalLink, Lock, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import type { Project } from './ProjectCard';

const copy = {
  es: { back: 'Volver al archivo', prev: 'Proyecto anterior', next: 'Proyecto siguiente' },
  en: { back: 'Back to archive', prev: 'Previous project', next: 'Next project' },
};

/** Título que se arma letra por letra ("kinetic text"). */
function KineticTitle({ text }: { text: string }) {
  return (
    <h3 className="pd-title" aria-label={text}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="pd-word" aria-hidden="true">
          {[...word].map((ch, ci) => (
            <motion.span
              key={ci}
              className="pd-char"
              initial={{ y: '110%', opacity: 0, rotateX: -80 }}
              animate={{ y: '0%', opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.15 + (wi * 4 + ci) * 0.022, type: 'spring', stiffness: 260, damping: 22 }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </h3>
  );
}

type Props = {
  projects: readonly Project[];
  index: number;
  image: string;
  category: string;
  onChange: (index: number) => void;
  onClose: () => void;
};

export default function ProjectDetail({ projects, index, image, category, onChange, onClose }: Props) {
  const { lang, t } = useI18n();
  const c = copy[lang];
  const project = projects[index];
  const total = projects.length;
  const closeRef = useRef<HTMLButtonElement>(null);

  const prev = () => onChange((index - 1 + total) % total);
  const next = () => onChange((index + 1) % total);

  // Foco, Esc / flechas y bloqueo del scroll mientras está abierto.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onChange((index - 1 + total) % total);
      if (e.key === 'ArrowRight') onChange((index + 1) % total);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, total, onChange, onClose]);

  const num = (n: number) => String(n).padStart(2, '0');

  return (
    <motion.div
      className="pd-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="pd-panel"
        initial={{ scale: 0.86, y: 40, rotateX: 8 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.92, y: 30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      >
        <div className="pd-media">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={project.id}
              className="pd-media-inner"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Image src={image} alt="" fill sizes="(max-width: 860px) 100vw, 55vw" priority />
            </motion.div>
          </AnimatePresence>
          <span className="pd-counter">
            {num(index + 1)} <span style={{ opacity: 0.55 }}>/ {num(total)}</span>
          </span>
        </div>

        <div className="pd-info" key={project.id}>
          <div className="pd-meta">
            <span>{category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
            {project.status && <span className="pd-status">{project.status}</span>}
          </div>
          <KineticTitle text={project.title} />
          <motion.p className="pd-desc" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            {project.description}
          </motion.p>
          <motion.div className="pd-tags" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
            {project.tags.map((tag) => (
              <span key={tag} className="skill-badge">
                {tag}
              </span>
            ))}
          </motion.div>
          <motion.div className="pd-links" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            {project.github ? (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <Code2 size={16} />
                {t.projects.viewCode}
              </a>
            ) : (
              <span className="pd-private">
                <Lock size={14} />
                {t.projects.workProject}
              </span>
            )}
            {project.demo && (
              <a href={project.demo} className="btn-primary">
                <ExternalLink size={16} />
                {t.projects.viewDemo}
              </a>
            )}
          </motion.div>

          <div className="pd-nav">
            <button type="button" className="pd-nav-btn" onClick={prev} aria-label={c.prev}>
              <ArrowLeft size={18} />
            </button>
            <button type="button" className="pd-nav-btn" onClick={next} aria-label={c.next}>
              <ArrowRight size={18} />
            </button>
            <button ref={closeRef} type="button" className="pd-back" onClick={onClose}>
              <X size={16} />
              {c.back}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
