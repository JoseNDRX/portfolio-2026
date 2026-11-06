'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useI18n } from './i18n-context';
import {
  UNIVERSES,
  UNIVERSE_STORAGE_KEY,
  isUniverseId,
  universeFromSlug,
  type SectionKey,
  type UniverseId,
} from './universes';

type UniverseContextType = {
  universe: UniverseId;
  /** Universo cuya intro se está reproduciendo (null = ninguna). */
  intro: UniverseId | null;
  boardOpen: boolean;
  openBoard: () => void;
  closeBoard: () => void;
  chooseUniverse: (id: UniverseId) => void;
  skipIntro: () => void;
  /**
   * Nombre de una sección en el universo y el idioma actuales.
   * En "Profesional" devuelve `fallback` (o el nombre del menú).
   */
  sectionLabel: (key: SectionKey, fallback?: string) => string;
};

const UniverseContext = createContext<UniverseContextType | null>(null);

const DEFAULT_INTRO_MS = 6000; // toda intro dura al menos 6 s

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function applyToDocument(id: UniverseId) {
  document.documentElement.dataset.universe = id;
}

function syncUrl(id: UniverseId) {
  const url = new URL(window.location.href);
  if (id === 'pro') url.searchParams.delete('universo');
  else url.searchParams.set('universo', UNIVERSES[id].slug);
  window.history.replaceState(window.history.state, '', url);
}

export function UniverseProvider({ children }: { children: React.ReactNode }) {
  const { lang, t } = useI18n();
  const [universe, setUniverse] = useState<UniverseId>('pro');
  const [intro, setIntro] = useState<UniverseId | null>(null);
  const [boardOpen, setBoardOpen] = useState(false);

  const startIntro = useCallback((id: UniverseId) => {
    if (!UNIVERSES[id].hasIntro || prefersReducedMotion()) return;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setIntro(id);
  }, []);

  // Al cargar: ?universo= en la URL (con intro) o el último elegido (sin intro).
  useEffect(() => {
    const fromUrl = universeFromSlug(new URLSearchParams(window.location.search).get('universo'));
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(UNIVERSE_STORAGE_KEY);
    } catch {
      /* almacenamiento bloqueado */
    }
    const initial = fromUrl ?? (isUniverseId(saved) ? saved : 'pro');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- se lee del navegador tras montar
    setUniverse(initial);
    applyToDocument(initial);
    if (fromUrl) startIntro(fromUrl);
  }, [startIntro]);

  // Fin automático de la intro.
  useEffect(() => {
    if (!intro) return;
    const timer = window.setTimeout(() => setIntro(null), UNIVERSES[intro].introMs ?? DEFAULT_INTRO_MS);
    return () => window.clearTimeout(timer);
  }, [intro]);

  // Bloquea el scroll mientras hay cartelera o intro.
  useEffect(() => {
    const locked = boardOpen || intro !== null;
    document.documentElement.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [boardOpen, intro]);

  const chooseUniverse = useCallback(
    (id: UniverseId) => {
      setBoardOpen(false);
      setUniverse(id);
      applyToDocument(id);
      syncUrl(id);
      try {
        localStorage.setItem(UNIVERSE_STORAGE_KEY, id);
      } catch {
        /* almacenamiento bloqueado */
      }
      startIntro(id);
    },
    [startIntro],
  );

  const sectionLabel = useCallback(
    (key: SectionKey, fallback?: string) => UNIVERSES[universe].sections?.[lang][key] ?? fallback ?? t.nav[key],
    [universe, lang, t],
  );

  const value = useMemo<UniverseContextType>(
    () => ({
      universe,
      intro,
      boardOpen,
      openBoard: () => setBoardOpen(true),
      closeBoard: () => setBoardOpen(false),
      chooseUniverse,
      skipIntro: () => setIntro(null),
      sectionLabel,
    }),
    [universe, intro, boardOpen, chooseUniverse, sectionLabel],
  );

  return <UniverseContext.Provider value={value}>{children}</UniverseContext.Provider>;
}

export function useUniverse() {
  const ctx = useContext(UniverseContext);
  if (!ctx) throw new Error('useUniverse must be inside UniverseProvider');
  return ctx;
}
