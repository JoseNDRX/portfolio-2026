'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

/* ---------------------------------------------------------------------------
   Hooks compartidos.
   --------------------------------------------------------------------------- */

/** Consulta de pantalla angosta usada por las secciones (Experiencia, Proyectos). */
export const NARROW_QUERY = '(max-width: 760px)';

/** true si la media query coincide. En el servidor siempre es false (sin errores de hidratación). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const noopSubscribe = () => () => {};

/** false en el servidor y en el primer render; true en el navegador. */
export function useMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** La persona pidió reducir el movimiento (sistema operativo / navegador). */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

type SpawnOptions<T> = {
  /** Crea un elemento nuevo; recibe el tamaño del contenedor. */
  create: (size: { width: number; height: number }) => T;
  /** Cuánto vive cada elemento en pantalla (ms); debe coincidir con su animación CSS. */
  lifeMs: number | ((item: T) => number);
  /** Espera entre apariciones: [mínimo, máximo] en ms. */
  every: [number, number];
  /** Espera antes de la primera aparición: [mínimo, máximo] en ms. */
  first: [number, number];
  /** Cuántos pueden estar en pantalla a la vez. */
  max: number;
};

const between = ([min, max]: [number, number]) => min + Math.random() * (max - min);

/**
 * Hace aparecer elementos al azar dentro de un contenedor (onomatopeyas,
 * objetos mágicos, constelaciones, tajos, disparos…). Solo crea elementos
 * mientras el contenedor está en pantalla y la pestaña visible; con
 * "reducir movimiento" no crea ninguno.
 * Devuelve la ref del contenedor y la lista actual (cada elemento con su `id`).
 */
export function useRandomSpawner<T>({ create, lifeMs, every, first, max }: SpawnOptions<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<(T & { id: number })[]>([]);
  // Las funciones pueden cambiar en cada render (p. ej. dependen del idioma): se leen
  // desde una ref para no reiniciar el temporizador.
  const opts = useRef({ create, lifeMs });
  useEffect(() => {
    opts.current = { create, lifeMs };
  });
  const [everyMin, everyMax] = every;
  const [firstMin, firstMax] = first;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let inView = false;
    let timer = 0;
    let nextId = 0;
    const removals = new Set<number>();
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(el);

    const spawn = () => {
      if (inView && !document.hidden) {
        const { width, height } = el.getBoundingClientRect();
        const item = { ...opts.current.create({ width, height }), id: nextId++ };
        setItems((list) => [...list.slice(-(max - 1)), item]);
        const life = typeof opts.current.lifeMs === 'function' ? opts.current.lifeMs(item) : opts.current.lifeMs;
        const r = window.setTimeout(() => {
          removals.delete(r);
          setItems((list) => list.filter((x) => x.id !== item.id));
        }, life);
        removals.add(r);
      }
      timer = window.setTimeout(spawn, between([everyMin, everyMax]));
    };
    timer = window.setTimeout(spawn, between([firstMin, firstMax]));

    return () => {
      window.clearTimeout(timer);
      removals.forEach((r) => window.clearTimeout(r));
      io.disconnect();
    };
  }, [everyMin, everyMax, firstMin, firstMax, max]);

  return { ref, items };
}
