import React from 'react'
import { motion } from 'framer-motion'
import { Globe, CheckCircle } from 'lucide-react'

interface LanguageSelectorProps {
  selectedLanguage: string
  onLanguageSelect: (languageCode: string) => void
  disabled?: boolean
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguage, 
  onLanguageSelect, 
  disabled = false 
}) => {
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' }
  ]

  return (
    <div className="space-y-4">
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          onClick={() => onLanguageSelect(lang.code)}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          disabled={disabled}
          className={`w-full p-4 text-left rounded-xl transition-all touch-target ${
            selectedLanguage === lang.code
              ? 'bg-terracotta-100 border-2 border-terracotta-300 text-terracotta-800'
              : 'bg-white border border-sage-200 text-sage-700 hover:bg-sage-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-sage-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium">{lang.nativeName}</div>
              {lang.nativeName !== lang.name && (
                <div className="text-sm opacity-75">{lang.name}</div>
              )}
            </div>
            {selectedLanguage === lang.code && (
              <CheckCircle className="w-5 h-5 text-terracotta-600 flex-shrink-0" />
            )}
          </div>
        </motion.button>
      ))}
    </div>
  )
}

export default LanguageSelector