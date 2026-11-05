'use client';

import { useEffect } from 'react';
import { useUniverse } from '@/lib/universe-context';

/* ---------------------------------------------------------------------------
   Animaciones de entrada de los elementos, según el universo.
   Marca los elementos de cada sección con [data-reveal] y les pone la clase
   .is-in cuando entran en pantalla. La animación concreta (golpe de cómic,
   destello dorado, tinta, corte de película…) está en app/universe-motion.css.
   Al cambiar de universo se vuelven a reproducir.
   --------------------------------------------------------------------------- */

const TARGETS = [
  '.section-tag',
  'h2',
  '.card',
  '.skill-badge',
].map((s) => `main section:not(#hero):not(#projects) ${s}`).join(', ');

/** Retraso entre elementos hermanos (ms) y máximo acumulado. */
const STAGGER_MS = 70;
const MAX_DELAY_MS = 560;

export default function UniverseMotion() {
  const { universe } = useUniverse();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
    // Escalonado: cada elemento espera según su posición entre hermanos del mismo tipo.
    const counters = new Map<Element, number>();
    for (const el of els) {
      const parent = el.parentElement ?? document.body;
      const i = counters.get(parent) ?? 0;
      counters.set(parent, i + 1);
      el.style.setProperty('--reveal-delay', `${Math.min(i * STAGGER_MS, MAX_DELAY_MS)}ms`);
      el.classList.remove('is-in');
      el.dataset.reveal = '';
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    // Un cuadro después, para que el estado oculto se aplique antes de animar.
    const raf = requestAnimationFrame(() => els.forEach((el) => io.observe(el)));

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [universe]);

  return null;
}
