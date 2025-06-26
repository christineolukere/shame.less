import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation, getAvailableLanguages, type Translations } from '../lib/translations';

interface LocalizationContextType {
  currentLanguage: string;
  translations: Translations;
  setLanguage: (language: string) => void;
  availableLanguages: string[];
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
  const [translations, setTranslations] = useState(getTranslation('English'));

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('shameless_language');
    if (savedLanguage && getAvailableLanguages().includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      setTranslations(getTranslation(savedLanguage));
    }
  }, []);

  const setLanguage = (language: string) => {
    if (getAvailableLanguages().includes(language)) {
      setCurrentLanguage(language);
      setTranslations(getTranslation(language));
      localStorage.setItem('shameless_language', language);
    }
  };

  const value = {
    currentLanguage,
    translations,
    setLanguage,
    availableLanguages: getAvailableLanguages(),
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};