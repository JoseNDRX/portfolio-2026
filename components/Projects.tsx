'use client';

import { useReducedMotion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { useUniverse } from '@/lib/universe-context';
import ScrollCue from '@/components/universe/ScrollCue';
import ProjectCard from './projects/ProjectCard';
import ProjectsArchive from './projects/ProjectsArchive';
import ProjectsGallery from './projects/ProjectsGallery';
import UniverseBackdrop from './universe/UniverseBackdrop';

export default function Projects() {
  const { t } = useI18n();
  const { universe, sectionLabel } = useUniverse();
  const reduceMotion = useReducedMotion();
  const projects = t.projects.items;

  const header = (
    <div style={{ textAlign: 'center' }}>
      <div className="section-tag" style={{ display: 'inline-flex' }}>
        <FolderOpen size={12} />
        {sectionLabel('projects', t.projects.title)}
      </div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
        {t.projects.subtitle}
      </h2>
    </div>
  );

  // Con "reducir movimiento" se muestra la cuadrícula sin animaciones.
  if (reduceMotion) {
    return (
      <section id="projects" className="grid-bg" style={{ padding: '6rem 1.5rem', background: 'var(--bg-primary)' }}>
        <div className="section-container">
          <div style={{ marginBottom: '3.5rem' }}>{header}</div>
          <div className="projects-grid">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} total={projects.length} />
            ))}
          </div>
        </div>
        <ScrollCue to="courses" />
      </section>
    );
  }

  return (
    // paddingBottom: espacio para el indicador de scroll, debajo del archivo.
    <section id="projects" style={{ background: 'var(--bg-primary)', paddingBottom: '5.5rem' }}>
      {/* Bastión usa el "vuelo en profundidad" (la cámara avanza hacia adentro);
          los demás universos, el archivo inmersivo que se explora arrastrando. */}
      {universe === 'bas' ? (
        <ProjectsGallery projects={projects} header={header} />
      ) : (
        <ProjectsArchive projects={projects} header={header} backdrop={<UniverseBackdrop section="projects" />} vortex={universe === 'gri'} />
      )}
      <ScrollCue to="courses" />
    </section>
  );
}
