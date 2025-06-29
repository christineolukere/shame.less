// ElevenLabs TTS integration for affirmations
interface TTSRequest {
  text: string
  voice_id?: string
  model_id?: string
  voice_settings?: {
    stability: number
    similarity_boost: number
    style?: number
    use_speaker_boost?: boolean
  }
}

interface TTSResponse {
  success: boolean
  audioUrl?: string
  error?: string
  cached?: boolean
}

interface CachedAudio {
  audioUrl: string
  timestamp: number
  text: string
}

class ElevenLabsTTSService {
  private apiKey: string
  private baseUrl = 'https://api.elevenlabs.io/v1'
  private defaultVoiceId: string
  private cache: Map<string, CachedAudio> = new Map()
  private cacheExpiry = 24 * 60 * 60 * 1000 // 24 hours

  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || ''
    this.defaultVoiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL' // Bella - warm feminine voice
    
    // Load cache from localStorage
    this.loadCacheFromStorage()
  }

  private loadCacheFromStorage(): void {
    try {
      const stored = localStorage.getItem('elevenlabs_tts_cache')
      if (stored) {
        const data = JSON.parse(stored)
        Object.entries(data).forEach(([key, value]: [string, any]) => {
          // Check if cache entry is still valid
          if (Date.now() - value.timestamp < this.cacheExpiry) {
            this.cache.set(key, value)
          }
        })
      }
    } catch (error) {
      console.error('Error loading TTS cache:', error)
    }
  }

  private saveCacheToStorage(): void {
    try {
      const cacheObject = Object.fromEntries(this.cache)
      localStorage.setItem('elevenlabs_tts_cache', JSON.stringify(cacheObject))
    } catch (error) {
      console.error('Error saving TTS cache:', error)
    }
  }

  private getCacheKey(text: string, voiceId: string): string {
    return `${voiceId}_${btoa(text).slice(0, 50)}`
  }

  private async generateSpeech(request: TTSRequest): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/text-to-speech/${request.voice_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text: request.text,
        model_id: request.model_id || 'eleven_monolingual_v1',
        voice_settings: request.voice_settings || {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`)
    }

    return await response.blob()
  }

  async synthesizeSpeech(
    text: string, 
    voiceId?: string,
    options?: {
      stability?: number
      similarity_boost?: number
      style?: number
      use_speaker_boost?: boolean
    }
  ): Promise<TTSResponse> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'ElevenLabs API key not configured'
        }
      }

      const finalVoiceId = voiceId || this.defaultVoiceId
      const cacheKey = this.getCacheKey(text, finalVoiceId)

      // Check cache first
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        return {
          success: true,
          audioUrl: cached.audioUrl,
          cached: true
        }
      }

      // Generate new audio
      const request: TTSRequest = {
        text,
        voice_id: finalVoiceId,
        voice_settings: {
          stability: options?.stability ?? 0.5,
          similarity_boost: options?.similarity_boost ?? 0.75,
          style: options?.style ?? 0.0,
          use_speaker_boost: options?.use_speaker_boost ?? true
        }
      }

      const audioBlob = await this.generateSpeech(request)
      const audioUrl = URL.createObjectURL(audioBlob)

      // Cache the result
      const cacheEntry: CachedAudio = {
        audioUrl,
        timestamp: Date.now(),
        text
      }
      
      this.cache.set(cacheKey, cacheEntry)
      this.saveCacheToStorage()

      return {
        success: true,
        audioUrl,
        cached: false
      }
    } catch (error: any) {
      console.error('TTS synthesis error:', error)
      return {
        success: false,
        error: error.message || 'Failed to synthesize speech'
      }
    }
  }

  // Get available voices (for future customization)
  async getVoices(): Promise<any[]> {
    try {
      if (!this.apiKey) return []

      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      })

      if (!response.ok) return []

      const data = await response.json()
      return data.voices || []
    } catch (error) {
      console.error('Error fetching voices:', error)
      return []
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
    localStorage.removeItem('elevenlabs_tts_cache')
  }

  // Get cache stats
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    }
  }
}

export const elevenLabsTTS = new ElevenLabsTTSService()
export type { TTSResponse }