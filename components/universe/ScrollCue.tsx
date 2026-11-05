'use client';

import { ArrowDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { useUniverse } from '@/lib/universe-context';
import type { UniverseId } from '@/lib/universes';

/** Indicador "sigue bajando" al pie del hero y de cada sección, con el lenguaje de cada universo. */
const LABELS: Record<UniverseId, { es: string; en: string }> = {
  pro: { es: 'scroll', en: 'scroll' },
  esc: { es: '¡Sigue leyendo!', en: 'Keep reading!' },
  oli: { es: 'Desciende', en: 'Descend' },
  gri: { es: 'Pasa la página', en: 'Turn the page' },
  pulp: { es: 'Siguiente escena', en: 'Next scene' },
  bas: { es: 'Avanza', en: 'Advance' },
};

type Props = {
  /** id de la sección a la que lleva. */
  to?: string;
};

export default function ScrollCue({ to = 'about' }: Props) {
  const { lang } = useI18n();
  const { universe } = useUniverse();
  return (
    <a href={`#${to}`} className="scroll-cue">
      <span>{LABELS[universe][lang]}</span>
      <ArrowDown size={16} aria-hidden="true" />
    </a>
  );
}
