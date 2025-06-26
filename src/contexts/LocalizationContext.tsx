import React, { createContext, useContext, useState, useEffect } from 'react'
import { getTranslation, getAvailableLanguages, type Translations } from '../lib/translations'

interface LocalizationContextType {
  currentLanguage: string
  translations: Translations
  setLanguage: (language: string) => void
  availableLanguages: string[]
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined)

export const useLocalization = () => {
  const context = useContext(LocalizationContext)
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider')
  }
  return context
}

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize language from localStorage or default to English
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    const savedLanguage = localStorage.getItem('shameless_preferred_language')
    return savedLanguage || 'English'
  })

  // Update translations when language changes
  const [translations, setTranslations] = useState<Translations>(() => 
    getTranslation(currentLanguage)
  )

  const setLanguage = (language: string) => {
    setCurrentLanguage(language)
    setTranslations(getTranslation(language))
    localStorage.setItem('shameless_preferred_language', language)
  }

  // Update translations when currentLanguage changes
  useEffect(() => {
    setTranslations(getTranslation(currentLanguage))
  }, [currentLanguage])

  const value = {
    currentLanguage,
    translations,
    setLanguage,
    availableLanguages: getAvailableLanguages(),
  }

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  )
}