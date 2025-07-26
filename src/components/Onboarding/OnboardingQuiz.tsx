import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Heart, Globe, Palette, Sparkles, CheckCircle, X, Sun, Moon, Crown } from 'lucide-react'
import { quizContent, getQuizText } from '../../lib/onboardingTranslations'
import LanguageSelector from './LanguageSelector'

interface OnboardingData {
  language: string
  supportStyle: string | null
  themePreference: string
  anchorPhrase: string
}

interface OnboardingQuizProps {
  onComplete: (data: OnboardingData) => void
  onSkip?: () => void
}

const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentLanguage, setCurrentLanguage] = useState('en') // Use language codes
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [answers, setAnswers] = useState<Partial<OnboardingData>>({
    language: 'English', // Store full language name for compatibility
    supportStyle: null,
    themePreference: 'secular',
    anchorPhrase: ''
  })

  const steps = [
    {
      id: 'language',
      icon: Globe,
      color: 'terracotta'
    },
    {
      id: 'support',
      icon: Heart,
      color: 'sage'
    },
    {
      id: 'theme',
      icon: Palette,
      color: 'lavender'
    },
    {
      id: 'phrase',
      icon: Sparkles,
      color: 'cream'
    }
  ]

  const supportOptions = [
    {
      id: 'spirituality',
      emoji: '🙏🏽'
    },
    {
      id: 'science',
      emoji: '🧠'
    },
    {
      id: 'culture',
      emoji: '🌍'
    },
    {
      id: 'silence',
      emoji: '🌙'
    }
  ]

  const themeOptions = [
    {
      id: 'spiritual',
      icon: Sun,
      gradient: 'from-purple-100 via-lavender-100 to-purple-200',
      preview: 'bg-gradient-to-br from-purple-200 to-lavender-300'
    },
    {
      id: 'secular',
      icon: Palette,
      gradient: 'from-sage-100 via-green-100 to-emerald-200',
      preview: 'bg-gradient-to-br from-sage-200 to-green-300'
    },
    {
      id: 'ancestral',
      icon: Crown,
      gradient: 'from-amber-100 via-orange-100 to-red-200',
      preview: 'bg-gradient-to-br from-amber-300 to-red-400'
    },
    {
      id: 'gentle',
      icon: Moon,
      gradient: 'from-rose-100 via-cream-100 to-sage-100',
      preview: 'bg-gradient-to-br from-rose-200 to-cream-300'
    }
  ]

  // Get text helper function
  const t = (key: string, placeholders?: Record<string, string | number>) => {
    return getQuizText(currentLanguage, key, placeholders)
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleLanguageSelect = (languageCode: string) => {
    setCurrentLanguage(languageCode)
    
    // Map language codes to full names for compatibility
    const languageMap = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'sw': 'Swahili'
    }
    
    const fullLanguageName = languageMap[languageCode as keyof typeof languageMap] || 'English'
    setAnswers(prev => ({ ...prev, language: fullLanguageName }))
    localStorage.setItem('user_language', fullLanguageName)
    
    const languageNames = {
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'sw': 'Kiswahili'
    }
    
    showToastMessage(`Language set to ${languageNames[languageCode as keyof typeof languageNames]}`)
  }

  const handleSupportSelect = (supportStyle: string) => {
    setAnswers(prev => ({ ...prev, supportStyle }))
    localStorage.setItem('support_style', supportStyle)
  }

  const handleThemeSelect = (theme: string) => {
    setAnswers(prev => ({ ...prev, themePreference: theme }))
    localStorage.setItem('theme_preference', theme)
    
    // Apply theme immediately to body for preview
    document.body.className = `theme-${theme}`
    showToastMessage(`Theme set to ${t(`${theme}Theme`)}`)
  }

  const handlePhraseSelect = (phrase: string) => {
    setAnswers(prev => ({ ...prev, anchorPhrase: phrase }))
    localStorage.setItem('anchor_phrase', phrase)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const skipStep = () => {
    const step = steps[currentStep]
    
    // Set defaults for skipped steps
    if (step.id === 'language') {
      handleLanguageSelect('en')
    } else if (step.id === 'support') {
      localStorage.setItem('support_style', 'null')
    } else if (step.id === 'theme') {
      handleThemeSelect('secular')
    } else if (step.id === 'phrase') {
      const phrases = ['phrase1', 'phrase2', 'phrase3', 'phrase4']
      const randomPhrase = t(phrases[Math.floor(Math.random() * phrases.length)])
      handlePhraseSelect(randomPhrase)
    }
    
    nextStep()
  }

  const handleSkipOnboarding = () => {
    if (onSkip) {
      onSkip()
    }
  }

  const completeOnboarding = () => {
    const finalData: OnboardingData = {
      language: answers.language || 'English',
      supportStyle: answers.supportStyle,
      themePreference: answers.themePreference || 'secular',
      anchorPhrase: answers.anchorPhrase || t('phrase1')
    }
    
    // Save completion flag
    localStorage.setItem('onboarding_complete', 'true')
    localStorage.setItem('onboarding_data', JSON.stringify(finalData))
    
    // Apply final theme
    document.body.className = `theme-${finalData.themePreference}`
    
    onComplete(finalData)
  }

  const renderStep = () => {
    const step = steps[currentStep]
    
    switch (step.id) {
      case 'language':
        return (
          <LanguageSelector
            selectedLanguage={currentLanguage}
            onLanguageSelect={handleLanguageSelect}
          />
        )

      case 'support':
        return (
          <div className="space-y-4">
            {supportOptions.map((option) => (
              <motion.button
                key={option.id}
                onClick={() => handleSupportSelect(option.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 text-left rounded-xl transition-all touch-target ${
                  answers.supportStyle === option.id
                    ? 'bg-sage-100 border-2 border-sage-300 text-sage-800'
                    : 'bg-white border border-sage-200 text-sage-700 hover:bg-sage-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl flex-shrink-0">{option.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{t(`${option.id}Support`)}</h3>
                    <p className="text-sm opacity-75">{t(`${option.id}Desc`)}</p>
                  </div>
                  {answers.supportStyle === option.id && (
                    <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-1" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )

      case 'theme':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {themeOptions.map((theme) => {
                const Icon = theme.icon
                return (
                  <motion.button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl transition-all touch-target ${
                      answers.themePreference === theme.id
                        ? 'ring-2 ring-lavender-400 ring-offset-2 bg-lavender-50'
                        : 'bg-white border border-sage-200 hover:bg-sage-50'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Theme Preview */}
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${theme.gradient} border-2 border-white shadow-sm flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-gray-700" />
                        </div>
                      </div>
                      
                      {/* Theme Info */}
                      <div className="flex-1 text-left">
                        <h3 className="font-serif text-lg text-sage-800 mb-1">{t(`${theme.id}Theme`)}</h3>
                        <p className="text-sm text-sage-600 mb-2">{t(`${theme.id}ThemeDesc`)}</p>
                        <p className="text-xs text-sage-500 italic">{t(`${theme.id}Vibe`)}</p>
                      </div>
                      
                      {/* Selection Indicator */}
                      {answers.themePreference === theme.id && (
                        <div className="flex-shrink-0">
                          <CheckCircle className="w-6 h-6 text-lavender-600" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
            
            {/* Theme Preview Note */}
            <div className="bg-cream-50 rounded-xl p-4 border border-cream-100">
              <p className="text-cream-700 text-sm text-center">
                ✨ {t('themeNote')}
              </p>
            </div>
          </div>
        )

      case 'phrase':
        return (
          <div className="space-y-4">
            {['phrase1', 'phrase2', 'phrase3', 'phrase4'].map((phraseKey) => {
              const phrase = t(phraseKey)
              return (
                <motion.button
                  key={phraseKey}
                  onClick={() => handlePhraseSelect(phrase)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 text-center rounded-xl transition-all touch-target ${
                    answers.anchorPhrase === phrase
                      ? 'bg-cream-100 border-2 border-cream-300 text-cream-800'
                      : 'bg-white border border-sage-200 text-sage-700 hover:bg-sage-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-serif text-lg">"{phrase}"</span>
                    {answers.anchorPhrase === phrase && (
                      <CheckCircle className="w-5 h-5 text-cream-600 flex-shrink-0" />
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        )

      default:
        return null
    }
  }

  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-sage-50 to-lavender-50 flex items-center justify-center p-4">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-sage-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-lg relative"
      >
        {/* Skip Button */}
        {onSkip && (
          <motion.button
            onClick={handleSkipOnboarding}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-4 right-4 p-2 rounded-full bg-sage-100 text-sage-600 hover:bg-sage-200 transition-colors touch-target"
            title="Skip onboarding"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-6 h-6 text-terracotta-500 fill-current flex-shrink-0" />
            <h1 className="text-2xl font-serif text-sage-800">shame.less</h1>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-sage-600 mb-2">
              <span>{t('stepOf', { current: currentStep + 1, total: steps.length })}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-sage-100 rounded-full h-2">
              <motion.div
                className={`bg-${currentStepData.color}-400 h-2 rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Step Header */}
            <div className="text-center space-y-3">
              <div className={`w-16 h-16 bg-${currentStepData.color}-100 rounded-full flex items-center justify-center mx-auto`}>
                <Icon className={`w-8 h-8 text-${currentStepData.color}-600`} />
              </div>
              <h2 className="text-xl font-serif text-sage-800 leading-tight">
                {t(`${currentStepData.id}Question`)}
              </h2>
              <p className="text-sage-600 text-sm leading-relaxed">
                {t(`${currentStepData.id}Subtitle`)}
              </p>
            </div>

            {/* Step Content */}
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <div>
            {currentStep > 0 && (
              <motion.button
                onClick={prevStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors touch-target"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('back')}</span>
              </motion.button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              onClick={skipStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sage-600 hover:text-sage-800 transition-colors touch-target"
            >
              {t('skip')}
            </motion.button>
            
            <motion.button
              onClick={nextStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-6 py-2 bg-${currentStepData.color}-500 text-white rounded-lg hover:bg-${currentStepData.color}-600 transition-colors touch-target`}
            >
              <span>{currentStep === steps.length - 1 ? t('complete') : t('continue')}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Gentle Message */}
        <div className="mt-6 p-4 bg-lavender-50 rounded-xl border border-lavender-100">
          <p className="text-lavender-700 text-sm text-center leading-relaxed">
            💜 {t('changeNote')}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default OnboardingQuiz