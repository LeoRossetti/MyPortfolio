"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";

type DictionaryContextValue = {
  dict: Dictionary;
  locale: Locale;
  setLocale: (next: Locale) => void;
};

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

type ProviderProps = {
  initialLocale: Locale;
  dictionaries: Record<Locale, Dictionary>;
  children: React.ReactNode;
};

export function DictionaryProvider({
  initialLocale,
  dictionaries,
  children,
}: ProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  // Mirror locale into document attributes that the server set on initial load.
  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
    document.title = dictionaries[locale].meta.title;
  }, [locale, dictionaries]);

  return (
    <DictionaryContext.Provider
      value={{ dict: dictionaries[locale], locale, setLocale }}
    >
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary(): Dictionary {
  const ctx = useContext(DictionaryContext);
  if (!ctx) {
    throw new Error("useDictionary must be used inside DictionaryProvider");
  }
  return ctx.dict;
}

export function useLocaleSwitcher() {
  const ctx = useContext(DictionaryContext);
  if (!ctx) {
    throw new Error(
      "useLocaleSwitcher must be used inside DictionaryProvider",
    );
  }
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}
