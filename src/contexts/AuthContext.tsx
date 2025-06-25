import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

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
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  continueAsGuest: () => void
  updateProfile: (updates: { display_name?: string; avatar_url?: string }) => Promise<{ error: any }>
  completeOnboarding: (data: OnboardingData) => Promise<{ error: any }>
  setOnboardingComplete: (complete: boolean) => void
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

  useEffect(() => {
    // Check for guest mode
    const guestMode = localStorage.getItem('shameless_guest_mode')
    const onboardingDone = localStorage.getItem('shameless_onboarding_complete')
    
    if (guestMode === 'true') {
      setIsGuest(true)
      setOnboardingComplete(onboardingDone === 'true')
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Create or update profile when user signs up or signs in
      if (event === 'SIGNED_IN' && session?.user) {
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
      }
    })

    return () => subscription.unsubscribe()
  }, [])

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
    setIsGuest(false)
    setOnboardingComplete(false)
    return { error }
  }

  const continueAsGuest = () => {
    localStorage.setItem('shameless_guest_mode', 'true')
    setIsGuest(true)
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
      localStorage.setItem('shameless_onboarding_data', JSON.stringify(data))
      localStorage.setItem('shameless_onboarding_complete', 'true')
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
    }

    return { error }
  }

  const value = {
    user,
    session,
    loading,
    isGuest,
    onboardingComplete,
    signUp,
    signIn,
    signOut,
    continueAsGuest,
    updateProfile,
    completeOnboarding,
    setOnboardingComplete,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export type { OnboardingData }