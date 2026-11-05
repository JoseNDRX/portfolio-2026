'use client';

import {
  Braces, Server, PanelsTopLeft, Smartphone, Database, BrainCircuit, Cable,
  MapPinned, ChartColumn, FlaskConical, Container, Network, Wrench, type LucideIcon,
} from 'lucide-react';
import type { SkillCategory } from '@/lib/skills';

/* Icono de cada categoría de Habilidades. Es el mismo icono en todos los
   universos; el estilo lo pone el CSS (.skill-ico):
   - Profesional: icono de línea en un cuadro con tinte del color de acento.
   - Escuadrón: icono grueso dentro de un estallido de cómic con borde negro.
   Cada categoría tiene un tono (0, 1 o 2) para alternar colores. */
export const SKILL_ICONS: Record<SkillCategory, { icon: LucideIcon; tone: 0 | 1 | 2 }> = {
  languages: { icon: Braces, tone: 0 },
  backend: { icon: Server, tone: 1 },
  frontend: { icon: PanelsTopLeft, tone: 2 },
  databases: { icon: Database, tone: 0 },
  ai: { icon: BrainCircuit, tone: 1 },
  integrations: { icon: Cable, tone: 2 },
  geospatial: { icon: MapPinned, tone: 0 },
  reporting: { icon: ChartColumn, tone: 1 },
  devops: { icon: Container, tone: 2 },
  architecture: { icon: Network, tone: 0 },
  testing: { icon: FlaskConical, tone: 1 },
  mobile: { icon: Smartphone, tone: 2 },
  tools: { icon: Wrench, tone: 0 },
};

export default function SkillIcon({ category }: { category: SkillCategory }) {
  const { icon: Icon, tone } = SKILL_ICONS[category];
  return (
    <span className={`skill-ico skill-ico-t${tone}`} aria-hidden="true">
      <Icon className="skill-ico-svg" size={22} strokeWidth={1.75} />
    </span>
  );
}
