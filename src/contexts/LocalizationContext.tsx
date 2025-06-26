import React, { createContext, useContext } from 'react';
import { translations, type Translations } from '../lib/translations';

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
  const value = {
    currentLanguage: 'English',
    translations,
    setLanguage: () => {}, // No-op since we only support English now
    availableLanguages: ['English'],
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};