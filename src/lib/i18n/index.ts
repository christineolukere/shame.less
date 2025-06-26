import { useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'ar';

export interface TranslationFunction {
  (key: string, params?: Record<string, string | number>): string;
}

// Simple interpolation function
function interpolate(template: string, params: Record<string, string | number> = {}): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}

// Language detection and persistence
export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const stored = localStorage.getItem('shameless_language') as Language;
  if (stored && ['en', 'es', 'fr', 'ar'].includes(stored)) {
    return stored;
  }
  
  // Detect browser language
  const browserLang = navigator.language.split('-')[0];
  if (['es', 'fr', 'ar'].includes(browserLang)) {
    return browserLang as Language;
  }
  
  return 'en';
}

export function setStoredLanguage(language: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('shameless_language', language);
    
    // Update document attributes for RTL support
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Update CSS custom property for text alignment
    document.documentElement.style.setProperty(
      '--text-align-start', 
      language === 'ar' ? 'right' : 'left'
    );
    document.documentElement.style.setProperty(
      '--text-align-end', 
      language === 'ar' ? 'left' : 'right'
    );
  }
}

// Translation hook
export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => getStoredLanguage());
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const module = await import(`./locales/${currentLanguage}.json`);
        setTranslations(module.default);
      } catch (error) {
        console.warn(`Failed to load translations for ${currentLanguage}, falling back to English`);
        const fallback = await import('./locales/en.json');
        setTranslations(fallback.default);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  // Translation function
  const t: TranslationFunction = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    if (typeof value === 'string') {
      return interpolate(value, params);
    }
    
    // Fallback to key if translation not found
    console.warn(`Translation missing for key: ${key} in language: ${currentLanguage}`);
    return key;
  };

  // Change language function
  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
    setStoredLanguage(language);
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    isLoading,
    isRTL: currentLanguage === 'ar'
  };
}

// Language metadata
export const LANGUAGES = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
} as const;