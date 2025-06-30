// Whisper transcription service for Mirror Mirror feature
interface TranscriptionRequest {
  audioBlob: Blob
  language?: string
}

interface TranscriptionResponse {
  success: boolean
  text?: string
  error?: string
}

class WhisperTranscriptionService {
  private apiKey: string
  private baseUrl = 'https://api.openai.com/v1'

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || ''
  }

  private isValidApiKey(key: string): boolean {
    return key && 
           key.length > 0 && 
           key !== 'your_openai_api_key' && 
           key.startsWith('sk-')
  }

  async transcribeAudio(request: TranscriptionRequest): Promise<TranscriptionResponse> {
    try {
      if (!this.isValidApiKey(this.apiKey)) {
        return {
          success: false,
          error: 'OpenAI API key not configured'
        }
      }

      // Create form data for the API request
      const formData = new FormData()
      formData.append('file', request.audioBlob, 'audio.webm')
      formData.append('model', 'whisper-1')
      
      if (request.language) {
        // Map language names to ISO codes
        const languageMap: Record<string, string> = {
          'English': 'en',
          'Spanish': 'es',
          'French': 'fr',
          'Swahili': 'sw'
        }
        const languageCode = languageMap[request.language] || 'en'
        formData.append('language', languageCode)
      }

      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Whisper API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      
      if (!data.text) {
        throw new Error('No transcription text received')
      }

      return {
        success: true,
        text: data.text.trim()
      }
    } catch (error: any) {
      console.error('Transcription error:', error)
      return {
        success: false,
        error: error.message || 'Failed to transcribe audio'
      }
    }
  }

  // Fallback transcription for when API is not available
  getFallbackTranscription(): TranscriptionResponse {
    return {
      success: true,
      text: "I hear you sharing something meaningful. Your voice and your words matter."
    }
  }

  isAvailable(): boolean {
    return this.isValidApiKey(this.apiKey)
  }
}

export const whisperTranscription = new WhisperTranscriptionService()
export type { TranscriptionRequest, TranscriptionResponse }