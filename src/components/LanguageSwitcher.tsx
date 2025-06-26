import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslation, LANGUAGES, type Language } from '../lib/i18n';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, changeLanguage, isRTL } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center space-x-2 p-2 rounded-lg bg-sage-100 text-sage-700 hover:bg-sage-200 transition-colors ${
          isRTL ? 'flex-row-reverse space-x-reverse' : ''
        }`}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {LANGUAGES[currentLanguage].flag} {LANGUAGES[currentLanguage].nativeName}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`absolute top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-sage-100 z-20 ${
                isRTL ? 'left-0' : 'right-0'
              }`}
            >
              <div className="p-2">
                {Object.entries(LANGUAGES).map(([code, lang]) => (
                  <motion.button
                    key={code}
                    onClick={() => handleLanguageChange(code as Language)}
                    whileHover={{ backgroundColor: 'rgba(95, 122, 95, 0.05)' }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      currentLanguage === code ? 'bg-sage-50 text-sage-800' : 'text-sage-700'
                    } ${isRTL ? 'flex-row-reverse space-x-reverse text-right' : ''}`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <div className={isRTL ? 'text-right' : ''}>
                      <div className="font-medium">{lang.nativeName}</div>
                      <div className="text-xs text-sage-500">{lang.name}</div>
                    </div>
                    {currentLanguage === code && (
                      <div className={`w-2 h-2 bg-sage-500 rounded-full ${isRTL ? 'mr-auto' : 'ml-auto'}`} />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;