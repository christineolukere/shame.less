import React, { createContext, useContext } from 'react';
import { useTranslation as useI18nTranslation, type TranslationFunction } from '../lib/i18n';

interface LocalizationContextType {
  t: TranslationFunction;
  currentLanguage: string;
  changeLanguage: (language: string) => void;
  isRTL: boolean;
  isLoading: boolean;
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
  const { t, currentLanguage, changeLanguage, isRTL, isLoading } = useI18nTranslation();

  const value = {
    t,
    currentLanguage,
    changeLanguage,
    isRTL,
    isLoading,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};