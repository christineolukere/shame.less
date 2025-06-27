import React, { createContext, useContext, useState } from 'react';
import { translations, type Translations, getTranslationsForLanguage } from '../lib/translations';

interface LocalizationContextType {
  currentLanguage: string;
  translations: Translations;
  setLanguage: (language: string) => void;
  availableLanguages: { code: string; name: string }[];
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

  const availableLanguages = [
    { code: 'English', name: 'English' },
    { code: 'Spanish', name: 'Español' },
    { code: 'French', name: 'Français' },
    { code: 'Arabic', name: 'العربية' }
  ];

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    // Store language preference
    localStorage.setItem('shameless_preferred_language', language);
  };

  const value = {
    currentLanguage,
    translations: getTranslationsForLanguage(currentLanguage),
    setLanguage,
    availableLanguages,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};