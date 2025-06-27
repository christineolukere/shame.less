import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Heart, Globe, Sparkles, Shield, AlertCircle } from 'lucide-react'
import { useLocalization } from '../../contexts/LocalizationContext'

interface OnboardingData {
  languages: string[]
  healingVision: string
  affirmationStyle: string
  culturalBackground: string[]
  spiritualPreference: string
  preferredLanguage: string
}

interface OnboardingQuizProps {
  onComplete: (data: OnboardingData) => void
}

const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<OnboardingData>>({
    languages: [],
    culturalBackground: [],
    preferredLanguage: 'English'
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const { translations: t, setLanguage, availableLanguages } = useLocalization()

  const questions = [
    {
      id: 'preferredLanguage',
      title: t.languageQuestion,
      subtitle: t.languageSubtitle,
      type: 'language-choice',
      required: true,
      options: availableLanguages.map(lang => lang.name)
    },
    {
      id: 'healingVision',
      title: t.healingVisionQuestion,
      subtitle: t.healingVisionSubtitle,
      type: 'text',
      required: true,
      placeholder: t.healingVisionPlaceholder
    },
    {
      id: 'affirmationStyle',
      title: t.affirmationStyleQuestion,
      subtitle: t.affirmationStyleSubtitle,
      type: 'single-choice',
      required: true,
      options: [
        t.spiritualityFaith,
        t.culturalWisdom,
        t.sciencePsychology,
        t.blendOfAll
      ]
    },
    {
      id: 'culturalBackground',
      title: t.culturalBackgroundQuestion,
      subtitle: t.culturalBackgroundSubtitle,
      type: 'multiple-choice',
      required: true,
      options: [
        t.blackAmerican, t.afroCaribbean, t.african, t.latinaHispanic,
        t.indigenous, t.asian, t.middleEastern, t.mixedMultiracial,
        t.lgbtqia, t.firstGeneration, t.other
      ]
    },
    {
      id: 'spiritualPreference',
      title: t.spiritualPreferenceQuestion,
      subtitle: t.spiritualPreferenceSubtitle,
      type: 'single-choice',
      required: true,
      options: [
        t.christianity, t.islam, t.judaism, t.buddhism, t.hinduism,
        t.indigenousTraditional, t.natureBased, t.secularNonReligious,
        t.stillExploring, t.preferNotToSay
      ]
    }
  ]

  const currentQuestion = questions[currentStep]

  const handleAnswer = (value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
    
    // Clear error for this field
    setErrors(prev => ({
      ...prev,
      [currentQuestion.id]: false
    }))

    // Handle language change immediately
    if (currentQuestion.id === 'preferredLanguage' && typeof value === 'string') {
      const selectedLang = availableLanguages.find(lang => lang.name === value)
      if (selectedLang) {
        setLanguage(selectedLang.code)
      }
    }
  }

  const validateCurrentStep = (): boolean => {
    const currentAnswer = answers[currentQuestion.id as keyof OnboardingData]
    
    if (currentQuestion.required) {
      if (currentQuestion.type === 'text') {
        const isValid = currentAnswer && (currentAnswer as string).trim().length > 0
        if (!isValid) {
          setErrors(prev => ({ ...prev, [currentQuestion.id]: true }))
          return false
        }
      } else if (currentQuestion.type === 'multiple-choice') {
        const isValid = currentAnswer && (currentAnswer as string[]).length > 0
        if (!isValid) {
          setErrors(prev => ({ ...prev, [currentQuestion.id]: true }))
          return false
        }
      } else {
        const isValid = currentAnswer && currentAnswer !== ''
        if (!isValid) {
          setErrors(prev => ({ ...prev, [currentQuestion.id]: true }))
          return false
        }
      }
    }
    
    return true
  }

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      const completeData: OnboardingData = {
        languages: answers.languages || [],
        healingVision: answers.healingVision || '',
        affirmationStyle: answers.affirmationStyle || t.blendOfAll,
        culturalBackground: answers.culturalBackground || [],
        spiritualPreference: answers.spiritualPreference || t.stillExploring,
        preferredLanguage: answers.preferredLanguage || 'English'
      }
      onComplete(completeData)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const renderQuestion = () => {
    const question = currentQuestion
    const currentAnswer = answers[question.id as keyof OnboardingData]
    const hasError = errors[question.id]

    switch (question.type) {
      case 'language-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const langData = availableLanguages.find(lang => lang.name === option)
              return (
                <motion.button
                  key={option}
                  onClick={() => handleAnswer(langData?.code || option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 text-left rounded-xl transition-all modal-text ${
                    currentAnswer === (langData?.code || option)
                      ? 'bg-terracotta-100 border-2 border-terracotta-300 text-terracotta-800'
                      : 'bg-white border border-sage-200 text-sage-700 hover:bg-sage-50'
                  } ${hasError ? 'border-red-300 bg-red-50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-sage-600 flex-shrink-0" />
                    <span>{option}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )

      case 'text':
        return (
          <div className="space-y-2">
            <textarea
              value={currentAnswer as string || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={question.placeholder}
              className={`w-full h-32 p-4 border rounded-xl focus:ring-2 focus:ring-terracotta-300 focus:border-transparent resize-none text-sage-800 placeholder-sage-400 modal-text ${
                hasError ? 'border-red-300 bg-red-50' : 'border-sage-200'
              }`}
            />
            {hasError && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">This field is required</span>
              </div>
            )}
          </div>
        )

      case 'single-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <motion.button
                key={option}
                onClick={() => handleAnswer(option)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 text-left rounded-xl transition-all modal-text ${
                  currentAnswer === option
                    ? 'bg-terracotta-100 border-2 border-terracotta-300 text-terracotta-800'
                    : 'bg-white border border-sage-200 text-sage-700 hover:bg-sage-50'
                } ${hasError ? 'border-red-300' : ''}`}
              >
                {option}
              </motion.button>
            ))}
            {hasError && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Please select an option</span>
              </div>
            )}
          </div>
        )

      case 'multiple-choice':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options?.map((option) => {
                const isSelected = (currentAnswer as string[] || []).includes(option)
                return (
                  <motion.button
                    key={option}
                    onClick={() => {
                      const current = (currentAnswer as string[]) || []
                      const updated = isSelected
                        ? current.filter(item => item !== option)
                        : [...current, option]
                      handleAnswer(updated)
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 text-center rounded-xl transition-all modal-text ${
                      isSelected
                        ? 'bg-lavender-100 border-2 border-lavender-300 text-lavender-800'
                        : 'bg-white border border-sage-200 text-sage-700 hover:bg-sage-50'
                    } ${hasError ? 'border-red-300' : ''}`}
                  >
                    {option}
                  </motion.button>
                )
              })}
            </div>
            {hasError && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Please select at least one option</span>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-sage-50 to-lavender-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modal-content bg-white/90 backdrop-blur-sm shadow-xl"
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center justify-center space-x-2 w-full">
            <Heart className="w-5 h-5 text-terracotta-500 fill-current flex-shrink-0" />
            <h1 className="modal-title text-center">
              {t.appName}
            </h1>
          </div>
        </div>

        <div className="modal-body">
          <div className="text-center space-y-2 mb-6">
            <h2 className="modal-title">{t.onboardingTitle}</h2>
            <p className="modal-text text-sage-600">
              {t.onboardingSubtitle}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between modal-text text-sage-600 mb-2">
              <span>Step {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-sage-100 rounded-full h-2">
              <motion.div
                className="bg-terracotta-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <h3 className="modal-title">
                    {currentQuestion.title}
                  </h3>
                  {currentQuestion.required && (
                    <span className="text-red-500 text-sm">*</span>
                  )}
                </div>
                <p className="modal-text text-sage-600">
                  {currentQuestion.subtitle}
                </p>
              </div>

              {renderQuestion()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <div>
              {currentStep > 0 && (
                <motion.button
                  onClick={prevStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="modal-button flex items-center space-x-2 bg-sage-100 text-sage-700 hover:bg-sage-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.back}</span>
                </motion.button>
              )}
            </div>

            <motion.button
              onClick={nextStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="modal-button flex items-center space-x-2 bg-terracotta-500 text-white hover:bg-terracotta-600"
            >
              <span>{currentStep === questions.length - 1 ? t.complete : t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Required Fields Note */}
          <div className="mt-4 p-4 bg-lavender-50 rounded-xl border border-lavender-100">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-lavender-600 mt-0.5 flex-shrink-0" />
              <p className="modal-text text-lavender-700">
                All questions are required to personalize your experience. 
                Your responses help us create a space that feels right for you.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default OnboardingQuiz