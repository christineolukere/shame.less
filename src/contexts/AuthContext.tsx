import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { GuestStorageManager } from '../lib/guestStorage'

interface OnboardingData {
  languages: string[]
  healingVision: string
  affirmationStyle: string
  culturalBackground: string[]
  spiritualPreference: string
  preferredLanguage: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isGuest: boolean
  onboardingComplete: boolean
  visitCount: number
  shouldShowUpsell: boolean
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  continueAsGuest: () => void
  updateProfile: (updates: { display_name?: string; avatar_url?: string }) => Promise<{ error: any }>
  completeOnboarding: (data: OnboardingData) => Promise<{ error: any }>
  setOnboardingComplete: (complete: boolean) => void
  dismissUpsell: () => void
  migrateGuestData: () => Promise<{ success: boolean; migratedCount: number; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [visitCount, setVisitCount] = useState(0)
  const [shouldShowUpsell, setShouldShowUpsell] = useState(false)

  useEffect(() => {
    // Check for guest mode first
    const guestMode = localStorage.getItem('shameless_guest_mode')
    
    if (guestMode === 'true') {
      setIsGuest(true)
      
      // Check guest onboarding status
      const guestOnboardingDone = localStorage.getItem('shameless_onboarding_complete')
      setOnboardingComplete(guestOnboardingDone === 'true')
      
      // Increment visit count and check for upsell
      const newVisitCount = GuestStorageManager.incrementVisitCount()
      setVisitCount(newVisitCount)
      setShouldShowUpsell(GuestStorageManager.shouldShowUpsell())
      
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      // Check onboarding status for authenticated users
      if (session?.user) {
        checkOnboardingStatus(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        // Create or update profile when user signs up or signs in
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (!profile) {
          await supabase.from('profiles').insert({
            id: session.user.id,
            email: session.user.email!,
            display_name: session.user.user_metadata?.display_name || null,
            avatar_url: session.user.user_metadata?.avatar_url || null,
          })
        }

        // Check onboarding status
        await checkOnboardingStatus(session.user.id)
      } else {
        setOnboardingComplete(false)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkOnboardingStatus = async (userId: string) => {
    try {
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('onboarding_complete')
        .eq('user_id', userId)
        .single()

      setOnboardingComplete(preferences?.onboarding_complete || false)
    } catch (error) {
      console.log('No preferences found, onboarding needed')
      setOnboardingComplete(false)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    // Clear guest mode when signing out
    localStorage.removeItem('shameless_guest_mode')
    localStorage.removeItem('shameless_onboarding_complete')
    localStorage.removeItem('shameless_onboarding_data')
    localStorage.removeItem('shameless_upsell_dismissed')
    setIsGuest(false)
    setOnboardingComplete(false)
    setVisitCount(0)
    setShouldShowUpsell(false)
    return { error }
  }

  const continueAsGuest = () => {
    localStorage.setItem('shameless_guest_mode', 'true')
    setIsGuest(true)
    
    // Force onboarding for new guests - don't check existing completion
    setOnboardingComplete(false)
    
    // Initialize guest data and visit tracking
    const newVisitCount = GuestStorageManager.incrementVisitCount()
    setVisitCount(newVisitCount)
    setShouldShowUpsell(GuestStorageManager.shouldShowUpsell())
    
    setLoading(false)
  }

  const updateProfile = async (updates: { display_name?: string; avatar_url?: string }) => {
    if (!user) return { error: new Error('No user logged in') }

    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    return { error }
  }

  const completeOnboarding = async (data: OnboardingData) => {
    if (isGuest) {
      // Store onboarding data locally for guest users
      GuestStorageManager.updatePreferences({ 
        language: data.preferredLanguage,
        onboardingData: data 
      })
      localStorage.setItem('shameless_onboarding_complete', 'true')
      localStorage.setItem('shameless_preferred_language', data.preferredLanguage)
      setOnboardingComplete(true)
      return { error: null }
    }

    if (!user) return { error: new Error('No user logged in') }

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        languages: data.languages,
        healing_vision: data.healingVision,
        affirmation_style: data.affirmationStyle,
        cultural_background: data.culturalBackground,
        spiritual_preference: data.spiritualPreference,
        preferred_language: data.preferredLanguage,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      })

    if (!error) {
      setOnboardingComplete(true)
      // Also save language preference to localStorage for immediate access
      localStorage.setItem('shameless_preferred_language', data.preferredLanguage)
    }

    return { error }
  }

  const dismissUpsell = () => {
    GuestStorageManager.dismissUpsell()
    setShouldShowUpsell(false)
  }

  const migrateGuestData = async (): Promise<{ success: boolean; migratedCount: number; error?: string }> => {
    if (!user) {
      return { success: false, migratedCount: 0, error: 'No user logged in' }
    }

    const guestData = GuestStorageManager.getGuestData()
    const totalEntries = guestData.checkIns.length + guestData.wins.length + guestData.journalEntries.length

    if (totalEntries === 0) {
      return { success: true, migratedCount: 0 }
    }

    const result = await GuestStorageManager.migrateToUser(user.id)
    
    if (result.success) {
      // Clear guest data after successful migration
      GuestStorageManager.clearGuestData()
      setIsGuest(false)
      localStorage.removeItem('shameless_guest_mode')
      return { success: true, migratedCount: totalEntries }
    }

    return { success: false, migratedCount: 0, error: result.error }
  }

  const value = {
    user,
    session,
    loading,
    isGuest,
    onboardingComplete,
    visitCount,
    shouldShowUpsell,
    signUp,
    signIn,
    signOut,
    continueAsGuest,
    updateProfile,
    completeOnboarding,
    setOnboardingComplete,
    dismissUpsell,
    migrateGuestData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export type { OnboardingData }