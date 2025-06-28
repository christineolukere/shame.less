import { useState, useEffect } from 'react'

interface OnboardingData {
  language: string
  supportStyle: string | null
  themePreference: string
  anchorPhrase: string
}

interface UseOnboardingReturn {
  isOnboardingComplete: boolean
  onboardingData: OnboardingData | null
  completeOnboarding: (data: OnboardingData) => void
  resetOnboarding: () => void
}

export const useOnboarding = (): UseOnboardingReturn => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)

  useEffect(() => {
    // Check if onboarding is complete
    const isComplete = localStorage.getItem('onboarding_complete') === 'true'
    setIsOnboardingComplete(isComplete)

    // Load onboarding data if it exists
    const savedData = localStorage.getItem('onboarding_data')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setOnboardingData(parsedData)
      } catch (error) {
        console.error('Error parsing onboarding data:', error)
        // Reset if data is corrupted
        resetOnboarding()
      }
    }
  }, [])

  const completeOnboarding = (data: OnboardingData) => {
    // Save to localStorage
    localStorage.setItem('onboarding_complete', 'true')
    localStorage.setItem('onboarding_data', JSON.stringify(data))
    localStorage.setItem('user_language', data.language)
    localStorage.setItem('support_style', data.supportStyle || 'null')
    localStorage.setItem('theme_preference', data.themePreference)
    localStorage.setItem('anchor_phrase', data.anchorPhrase)

    // Update state
    setIsOnboardingComplete(true)
    setOnboardingData(data)
  }

  const resetOnboarding = () => {
    // Clear localStorage
    localStorage.removeItem('onboarding_complete')
    localStorage.removeItem('onboarding_data')
    localStorage.removeItem('user_language')
    localStorage.removeItem('support_style')
    localStorage.removeItem('theme_preference')
    localStorage.removeItem('anchor_phrase')

    // Reset state
    setIsOnboardingComplete(false)
    setOnboardingData(null)
  }

  return {
    isOnboardingComplete,
    onboardingData,
    completeOnboarding,
    resetOnboarding
  }
}

// Utility functions for accessing individual preferences
export const getStoredLanguage = (): string => {
  return localStorage.getItem('user_language') || 'English'
}

export const getStoredSupportStyle = (): string | null => {
  const style = localStorage.getItem('support_style')
  return style === 'null' ? null : style
}

export const getStoredThemePreference = (): string => {
  return localStorage.getItem('theme_preference') || 'warm_sage'
}

export const getStoredAnchorPhrase = (): string => {
  return localStorage.getItem('anchor_phrase') || 'Softness is sacred'
}