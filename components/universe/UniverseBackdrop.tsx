'use client';

import { useUniverse } from '@/lib/universe-context';
import EscBackdrop from './backdrops/EscBackdrop';
import OliBackdrop from './backdrops/OliBackdrop';
import GriBackdrop from './backdrops/GriBackdrop';
import PulpBackdrop from './backdrops/PulpBackdrop';
import BasBackdrop from './backdrops/BasBackdrop';
import type { BackdropSection } from './backdrops/types';

/* ---------------------------------------------------------------------------
   Fondo temático de una sección según el universo activo. Cada universo tiene
   su propio archivo en ./backdrops; Profesional no lleva fondo.
   --------------------------------------------------------------------------- */

const BACKDROPS = {
  esc: EscBackdrop,
  oli: OliBackdrop,
  gri: GriBackdrop,
  pulp: PulpBackdrop,
  bas: BasBackdrop,
} as const;

export default function UniverseBackdrop({ section }: { section: BackdropSection }) {
  const { universe } = useUniverse();
  if (universe === 'pro') return null;
  const Backdrop = BACKDROPS[universe];
  return <Backdrop section={section} />;
}
