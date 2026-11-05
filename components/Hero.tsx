'use client';

import { useUniverse } from '@/lib/universe-context';
import HeroPro from './heroes/HeroPro';
import HeroEscuadron from './heroes/HeroEscuadron';
import HeroOlimpo from './heroes/HeroOlimpo';
import HeroGrimorio from './heroes/HeroGrimorio';
import HeroCapitulo from './heroes/HeroCapitulo';
import HeroBastion from './heroes/HeroBastion';

export default function Hero() {
  const { universe } = useUniverse();
  switch (universe) {
    case 'esc':
      return <HeroEscuadron />;
    case 'oli':
      return <HeroOlimpo />;
    case 'gri':
      return <HeroGrimorio />;
    case 'pulp':
      return <HeroCapitulo />;
    case 'bas':
      return <HeroBastion />;
    default:
      return <HeroPro />;
  }
}
