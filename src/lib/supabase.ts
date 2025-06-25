import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          languages: string[]
          healing_vision: string | null
          affirmation_style: string | null
          cultural_background: string[]
          spiritual_preference: string | null
          preferred_language: string
          onboarding_complete: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          languages?: string[]
          healing_vision?: string | null
          affirmation_style?: string | null
          cultural_background?: string[]
          spiritual_preference?: string | null
          preferred_language?: string
          onboarding_complete?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          languages?: string[]
          healing_vision?: string | null
          affirmation_style?: string | null
          cultural_background?: string[]
          spiritual_preference?: string | null
          preferred_language?: string
          onboarding_complete?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      check_ins: {
        Row: {
          id: string
          user_id: string | null
          guest_session_id: string | null
          mood: string
          color: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          guest_session_id?: string | null
          mood: string
          color: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          guest_session_id?: string | null
          mood?: string
          color?: string
          notes?: string | null
          created_at?: string
        }
      }
      wins: {
        Row: {
          id: string
          user_id: string | null
          guest_session_id: string | null
          text: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          guest_session_id?: string | null
          text: string
          category?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          guest_session_id?: string | null
          text?: string
          category?: string
          created_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string | null
          guest_session_id: string | null
          content: string
          prompt: string | null
          entry_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          guest_session_id?: string | null
          content: string
          prompt?: string | null
          entry_type?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          guest_session_id?: string | null
          content?: string
          prompt?: string | null
          entry_type?: string
          created_at?: string
        }
      }
    }
  }
}