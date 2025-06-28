import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Translations, getTranslationsForLanguage, getAvailableLanguages, getTranslation } from '../lib/translations';

interface LocalizationContextType {
  currentLanguage: string;
  translations: Translations;
  setLanguage: (language: string) => Promise<void>;
  availableLanguages: { code: string; name: string; nativeName: string }[];
  t: (key: string) => string;
  isUpdatingLanguage: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false);

  const availableLanguages = getAvailableLanguages();

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('shameless_preferred_language') || 
                         localStorage.getItem('user_language') || 
                         'English';
    setCurrentLanguage(savedLanguage);
  }, []);

  const setLanguage = async (language: string): Promise<void> => {
    if (language === currentLanguage) return;
    
    setIsUpdatingLanguage(true);
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentLanguage(language);
    localStorage.setItem('shameless_preferred_language', language);
    localStorage.setItem('user_language', language);
    
    setIsUpdatingLanguage(false);
    
    // Show success toast (we'll implement this in the onboarding component)
    const event = new CustomEvent('languageUpdated', { detail: { language } });
    window.dispatchEvent(event);
  };

  // Translation function with fallback
  const t = (key: string): string => {
    try {
      const currentTranslations = getTranslationsForLanguage(currentLanguage);
      return getTranslation(key, currentTranslations);
    } catch (error) {
      console.warn(`Translation missing for key: ${key}, language: ${currentLanguage}`);
      // Fallback to English
      const englishTranslations = getTranslationsForLanguage('English');
      return getTranslation(key, englishTranslations);
    }
  };

  const value = {
    currentLanguage,
    translations: getTranslationsForLanguage(currentLanguage),
    setLanguage,
    availableLanguages,
    t,
    isUpdatingLanguage,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};