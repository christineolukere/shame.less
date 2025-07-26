import React from 'react'
import OnboardingQuiz from './OnboardingQuiz'

interface OnboardingData {
  language: string
  supportStyle: string | null
  themePreference: string
  anchorPhrase: string
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
  onSkip?: () => void
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  return (
    <OnboardingQuiz onComplete={onComplete} onSkip={onSkip} />
  )
}

export default OnboardingFlow