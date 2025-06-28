import { supabase } from './supabase'

export interface AILetter {
  id: string
  user_id?: string
  guest_session_id?: string
  letter_content: string
  source_content: string
  source_type: 'journal' | 'checkin' | 'win'
  emotion?: string
  created_at: string
}

// Save AI letter to database or local storage
export async function saveAILetter(
  letterContent: string,
  sourceContent: string,
  sourceType: 'journal' | 'checkin' | 'win',
  emotion?: string,
  userId?: string,
  guestSessionId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (userId) {
      // Save to Supabase for authenticated users
      const { error } = await supabase
        .from('ai_letters')
        .insert({
          user_id: userId,
          letter_content: letterContent,
          source_content: sourceContent,
          source_type: sourceType,
          emotion: emotion
        })

      if (error) throw error
    } else if (guestSessionId) {
      // Save to local storage for guest users
      const existingLetters = getGuestAILetters()
      const newLetter: AILetter = {
        id: Date.now().toString(),
        guest_session_id: guestSessionId,
        letter_content: letterContent,
        source_content: sourceContent,
        source_type: sourceType,
        emotion: emotion,
        created_at: new Date().toISOString()
      }
      
      existingLetters.unshift(newLetter)
      localStorage.setItem('shameless_ai_letters', JSON.stringify(existingLetters))
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error saving AI letter:', error)
    return { success: false, error: error.message }
  }
}

// Get AI letters for guest users from local storage
export function getGuestAILetters(): AILetter[] {
  try {
    const letters = localStorage.getItem('shameless_ai_letters')
    return letters ? JSON.parse(letters) : []
  } catch (error) {
    console.error('Error loading guest AI letters:', error)
    return []
  }
}

// Load AI letters for authenticated users
export async function loadAILetters(userId: string, limit: number = 10): Promise<{ success: boolean; letters?: AILetter[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('ai_letters')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { success: true, letters: data || [] }
  } catch (error: any) {
    console.error('Error loading AI letters:', error)
    return { success: false, error: error.message }
  }
}

// Delete AI letter
export async function deleteAILetter(letterId: string, userId?: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (userId) {
      // Delete from Supabase
      const { error } = await supabase
        .from('ai_letters')
        .delete()
        .eq('id', letterId)
        .eq('user_id', userId)

      if (error) throw error
    } else {
      // Delete from local storage
      const letters = getGuestAILetters()
      const updatedLetters = letters.filter(letter => letter.id !== letterId)
      localStorage.setItem('shameless_ai_letters', JSON.stringify(updatedLetters))
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting AI letter:', error)
    return { success: false, error: error.message }
  }
}