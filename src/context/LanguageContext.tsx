import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en.ts';
import { fr } from '../locales/fr.ts';
import { Language, Currency } from '../types.ts';

type TranslationType = typeof en;

interface LanguageContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationType;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInUSD: number | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Conversion rates against base USD
const EXCHANGE_RATES: Record<Currency, { rate: number; symbol: string; position: 'before' | 'after' }> = {
  USD: { rate: 1.0, symbol: '$', position: 'before' },
  EUR: { rate: 0.92, symbol: '€', position: 'after' },
  GBP: { rate: 0.78, symbol: '£', position: 'before' },
  XOF: { rate: 605.0, symbol: 'FCFA', position: 'after' },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('j_online_lang');
    if (saved === 'fr' || saved === 'en') return saved;
    // Auto-detect browser language if french
    if (typeof navigator !== 'undefined' && navigator.language?.startsWith('fr')) {
      return 'fr';
    }
    return 'en';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('j_online_currency');
    if (saved && (saved === 'USD' || saved === 'EUR' || saved === 'XOF' || saved === 'GBP')) {
      return saved as Currency;
    }
    return 'USD';
  });

  useEffect(() => {
    localStorage.setItem('j_online_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('j_online_currency', currency);
  }, [currency]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const t = lang === 'fr' ? (fr as TranslationType) : (en as TranslationType);

  const formatPrice = (amountInUSD: number | null | undefined): string => {
    if (amountInUSD === null || amountInUSD === undefined || isNaN(amountInUSD)) {
      return lang === 'fr' ? 'Sur Devis' : 'Quote on Request';
    }
    const info = EXCHANGE_RATES[currency] || EXCHANGE_RATES.USD;
    const converted = amountInUSD * info.rate;

    if (currency === 'XOF') {
      const rounded = Math.round(converted).toLocaleString();
      return `${rounded} ${info.symbol}`;
    }

    const formatted = converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return info.position === 'before' ? `${info.symbol}${formatted}` : `${formatted} ${info.symbol}`;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, currency, setCurrency, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
