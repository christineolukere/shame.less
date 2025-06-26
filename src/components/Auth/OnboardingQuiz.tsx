import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Heart, Globe, Sparkles, Shield } from 'lucide-react'
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
  onSkip: () => void
}

const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<OnboardingData>>({
    languages: [],
    culturalBackground: [],
    preferredLanguage: 'English'
  })

  const { t } = useLocalization()

  const questions = [
    {
      id: 'healingVision',
      title: t('onboarding.healingVision.question'),
      subtitle: t('onboarding.healingVision.subtitle'),
      type: 'text',
      placeholder: t('onboarding.healingVision.placeholder')
    },
    {
      id: 'affirmationStyle',
      title: t('onboarding.affirmationStyle.question'),
      subtitle: t('onboarding.affirmationStyle.subtitle'),
      type: 'single-choice',
      options: [
        t('onboarding.affirmationStyle.spiritual'),
        t('onboarding.affirmationStyle.cultural'),
        t('onboarding.affirmationStyle.scientific'),
        t('onboarding.affirmationStyle.blend')
      ]
    },
    {
      id: 'culturalBackground',
      title: t('onboarding.culturalBackground.question'),
      subtitle: t('onboarding.culturalBackground.subtitle'),
      type: 'multiple-choice',
      options: [
        t('onboarding.culturalBackground.blackAmerican'),
        t('onboarding.culturalBackground.afroCaribbean'),
        t('onboarding.culturalBackground.african'),
        t('onboarding.culturalBackground.latina'),
        t('onboarding.culturalBackground.indigenous'),
        t('onboarding.culturalBackground.asian'),
        t('onboarding.culturalBackground.middleEastern'),
        t('onboarding.culturalBackground.mixed'),
        t('onboarding.culturalBackground.lgbtqia'),
        t('onboarding.culturalBackground.firstGen'),
        t('onboarding.culturalBackground.other')
      ]
    },
    {
      id: 'spiritualPreference',
      title: t('onboarding.spiritualPreference.question'),
      subtitle: t('onboarding.spiritualPreference.subtitle'),
      type: 'single-choice',
      options: [
        t('onboarding.spiritualPreference.christianity'),
        t('onboarding.spiritualPreference.islam'),
        t('onboarding.spiritualPreference.judaism'),
        t('onboarding.spiritualPreference.buddhism'),
        t('onboarding.spiritualPreference.hinduism'),
        t('onboarding.spiritualPreference.indigenous'),
        t('onboarding.spiritualPreference.nature'),
        t('onboarding.spiritualPreference.secular'),
        t('onboarding.spiritualPreference.exploring'),
        t('onboarding.spiritualPreference.preferNotToSay')
      ]
    }
  ]

  const currentQuestion = questions[currentStep]

  const handleAnswer = (value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Ensure all required fields have defaults
      const completeData: OnboardingData = {
        languages: answers.languages || [],
        healingVision: answers.healingVision || '',
        affirmationStyle: answers.affirmationStyle || t('onboarding.affirmationStyle.blend'),
        culturalBackground: answers.culturalBackground || [],
        spiritualPreference: answers.spiritualPreference || t('onboarding.spiritualPreference.exploring'),
        preferredLanguage: 'English'
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

    switch (question.type) {
      case 'text':
        return (
          <textarea
            value={currentAnswer as string || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={question.placeholder}
            className="w-full h-32 p-4 border border-sage-200 rounded-xl focus:ring-2 focus:ring-terracotta-300 focus:border-transparent resize-none text-sage-800 placeholder-sage-400"
          />
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
                className={`w-full p-4 text-left rounded-xl transition-all ${
                  currentAnswer === option
                    ? 'bg-terracotta-100 border-2 border-terracotta-300 text-terracotta-800'
                    : 'bg-white border border-sage-200 text-sage-700 hover:bg-sage-50'
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        )

      case 'multiple-choice':
        return (
          <div className="grid grid-cols-2 gap-3">
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
                  className={`p-3 text-center rounded-xl transition-all ${
                    isSelected
                      ? 'bg-lavender-100 border-2 border-lavender-300 text-lavender-800'
                      : 'bg-white border border-sage-200 text-sage-700 hover:bg-sage-50'
                  }`}
                >
                  {option}
                </motion.button>
              )
            })}
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
        className="bg-white/90 backdrop-blur-sm rounded-3xl max-w-lg w-full p-8 shadow-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-6 h-6 text-terracotta-500 fill-current" />
            <h1 className="text-xl font-serif text-sage-800">
              {t('app.name')}
            </h1>
          </div>
          <h2 className="text-2xl font-serif text-sage-800 mb-2">{t('onboarding.title')}</h2>
          <p className="text-sage-600 text-sm">
            {t('onboarding.subtitle')}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-sage-600 mb-2">
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
              <h3 className="text-xl font-serif text-sage-800">
                {currentQuestion.title}
              </h3>
              <p className="text-sage-600 text-sm">
                {currentQuestion.subtitle}
              </p>
            </div>

            {renderQuestion()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <motion.button
                onClick={prevStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('common.back')}</span>
              </motion.button>
            )}
            
            <motion.button
              onClick={onSkip}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sage-600 hover:text-sage-800 transition-colors"
            >
              {t('onboarding.skipForNow')}
            </motion.button>
          </div>

          <motion.button
            onClick={nextStep}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-6 py-3 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors"
          >
            <span>{currentStep === questions.length - 1 ? t('common.complete') : t('common.next')}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Cultural Sensitivity Note */}
        <div className="mt-6 p-4 bg-lavender-50 rounded-xl border border-lavender-100">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-lavender-600 mt-0.5 flex-shrink-0" />
            <p className="text-lavender-700 text-xs leading-relaxed">
              Your responses help us personalize your experience with cultural sensitivity. 
              All information is private and can be updated anytime in your profile.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default OnboardingQuiz