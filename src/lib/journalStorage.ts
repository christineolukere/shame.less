import { supabase } from './supabase'

export interface JournalMedia {
  id: string
  journal_entry_id: string
  user_id: string
  media_type: 'audio' | 'photo'
  file_path: string
  file_name: string
  file_size: number
  mime_type: string
  duration?: number
  created_at: string
  signed_url?: string
}

export interface EnhancedJournalEntry {
  id: string
  user_id?: string
  guest_session_id?: string
  title?: string
  content: string
  prompt?: string
  entry_type: string
  mood_rating?: number
  is_flagged: boolean
  created_at: string
  media: JournalMedia[]
}

// Content safety keywords to flag
const SAFETY_KEYWORDS = [
  'kill myself', 'suicide', 'end my life', 'hurt myself', 'self harm',
  'cut myself', 'overdose', 'jump off', 'hang myself', 'want to die',
  'better off dead', 'no point living', 'harm others', 'hurt someone',
  'kill them', 'violence', 'weapon'
]

// Check content for safety concerns
export function checkContentSafety(content: string): { isSafe: boolean; flaggedWords: string[] } {
  const lowerContent = content.toLowerCase()
  const flaggedWords = SAFETY_KEYWORDS.filter(keyword => 
    lowerContent.includes(keyword.toLowerCase())
  )
  
  return {
    isSafe: flaggedWords.length === 0,
    flaggedWords
  }
}

// Validate file type and size
export function validateFile(file: File, type: 'audio' | 'photo'): { isValid: boolean; error?: string } {
  const maxSizes = {
    audio: 10 * 1024 * 1024, // 10MB for audio
    photo: 2 * 1024 * 1024   // 2MB for photos
  }

  const allowedTypes = {
    audio: ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg'],
    photo: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  }

  if (file.size > maxSizes[type]) {
    return {
      isValid: false,
      error: `File too large. Maximum size for ${type} is ${maxSizes[type] / (1024 * 1024)}MB`
    }
  }

  if (!allowedTypes[type].includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types for ${type}: ${allowedTypes[type].join(', ')}`
    }
  }

  return { isValid: true }
}

// Upload file to Supabase Storage
export async function uploadJournalFile(
  file: File, 
  userId: string, 
  type: 'audio' | 'photo'
): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    // Validate file
    const validation = validateFile(file, type)
    if (!validation.isValid) {
      return { success: false, error: validation.error }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const fileName = `${userId}/${type}/${timestamp}_${randomString}.${extension}`

    // Upload to appropriate bucket
    const bucketName = type === 'audio' ? 'journal-audio' : 'journal-photos'
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, filePath: data.path }
  } catch (error: any) {
    console.error('Upload error:', error)
    return { success: false, error: error.message }
  }
}

// Get signed URL for file access
export async function getSignedUrl(filePath: string, type: 'audio' | 'photo'): Promise<string | null> {
  try {
    const bucketName = type === 'audio' ? 'journal-audio' : 'journal-photos'
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (error) {
      console.error('Signed URL error:', error)
      return null
    }

    return data.signedUrl
  } catch (error) {
    console.error('Signed URL error:', error)
    return null
  }
}

// Save journal entry with media
export async function saveJournalEntry(
  entry: Omit<EnhancedJournalEntry, 'id' | 'created_at' | 'media'>,
  mediaFiles: { file: File; type: 'audio' | 'photo'; duration?: number }[] = []
): Promise<{ success: boolean; entryId?: string; error?: string }> {
  try {
    // Check content safety
    const safetyCheck = checkContentSafety(entry.content)
    
    // Save journal entry
    const { data: journalData, error: journalError } = await supabase
      .from('journal_entries')
      .insert({
        user_id: entry.user_id,
        guest_session_id: entry.guest_session_id,
        title: entry.title,
        content: entry.content,
        prompt: entry.prompt,
        entry_type: entry.entry_type,
        mood_rating: entry.mood_rating,
        is_flagged: !safetyCheck.isSafe
      })
      .select()
      .single()

    if (journalError) {
      return { success: false, error: journalError.message }
    }

    const entryId = journalData.id

    // Upload and save media files
    if (mediaFiles.length > 0 && entry.user_id) {
      for (const mediaFile of mediaFiles) {
        const uploadResult = await uploadJournalFile(mediaFile.file, entry.user_id, mediaFile.type)
        
        if (uploadResult.success && uploadResult.filePath) {
          // Save media record
          await supabase
            .from('journal_media')
            .insert({
              journal_entry_id: entryId,
              user_id: entry.user_id,
              media_type: mediaFile.type,
              file_path: uploadResult.filePath,
              file_name: mediaFile.file.name,
              file_size: mediaFile.file.size,
              mime_type: mediaFile.file.type,
              duration: mediaFile.duration
            })
        }
      }
    }

    return { success: true, entryId }
  } catch (error: any) {
    console.error('Save journal entry error:', error)
    return { success: false, error: error.message }
  }
}

// Load journal entries with media
export async function loadJournalEntries(
  userId: string,
  limit: number = 10
): Promise<{ success: boolean; entries?: EnhancedJournalEntry[]; error?: string }> {
  try {
    // Load journal entries
    const { data: entries, error: entriesError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (entriesError) {
      return { success: false, error: entriesError.message }
    }

    // Load media for each entry
    const entriesWithMedia: EnhancedJournalEntry[] = []
    
    for (const entry of entries || []) {
      const { data: media, error: mediaError } = await supabase
        .from('journal_media')
        .select('*')
        .eq('journal_entry_id', entry.id)
        .order('created_at', { ascending: true })

      if (mediaError) {
        console.error('Media load error:', mediaError)
      }

      // Get signed URLs for media
      const mediaWithUrls: JournalMedia[] = []
      for (const mediaItem of media || []) {
        const signedUrl = await getSignedUrl(mediaItem.file_path, mediaItem.media_type)
        mediaWithUrls.push({
          ...mediaItem,
          signed_url: signedUrl || undefined
        })
      }

      entriesWithMedia.push({
        ...entry,
        media: mediaWithUrls
      })
    }

    return { success: true, entries: entriesWithMedia }
  } catch (error: any) {
    console.error('Load journal entries error:', error)
    return { success: false, error: error.message }
  }
}