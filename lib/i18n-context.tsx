'use client';

import React, { createContext, useContext, useState } from 'react';
import { translations, Lang } from './translations';

type I18nContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof translations['es'];
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('es');
  const t = translations[lang];
  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be inside I18nProvider');
  return ctx;
}
