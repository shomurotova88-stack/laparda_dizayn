'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, translations } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: typeof translations['uz'];
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'uz',
  setLocale: () => {},
  t: translations.uz
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('uz');

  useEffect(() => {
    const saved = localStorage.getItem('laparda_locale') as Locale;
    if (saved && (saved === 'uz' || saved === 'ru')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('laparda_locale', l);
  };

  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
