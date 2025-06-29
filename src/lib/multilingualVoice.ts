// Multilingual voice system using ElevenLabs TTS
interface VoiceConfig {
  id: string
  name: string
  language: string
  description: string
  gender: 'female' | 'male'
  accent?: string
}

interface VoiceSettings {
  stability: number
  similarity_boost: number
  style?: number
  use_speaker_boost?: boolean
}

interface CachedAudio {
  audioUrl: string
  timestamp: number
  text: string
  language: string
  voiceId: string
}

interface TTSRequest {
  text: string
  language?: string
  voiceId?: string
  settings?: Partial<VoiceSettings>
}

interface TTSResponse {
  success: boolean
  audioUrl?: string
  error?: string
  cached?: boolean
  voiceUsed?: string
}

class MultilingualVoiceService {
  private apiKey: string
  private baseUrl = 'https://api.elevenlabs.io/v1'
  private cache: Map<string, CachedAudio> = new Map()
  private cacheExpiry = 7 * 24 * 60 * 60 * 1000 // 7 days
  private maxCacheSize = 100 // Maximum cached items

  // Voice configurations for each language
  private voices: Record<string, VoiceConfig> = {
    'English': {
      id: '21m00Tcm4TlvDq8ikWAM', // Bella
      name: 'Bella',
      language: 'English',
      description: 'Warm, nurturing feminine voice',
      gender: 'female'
    },
    'Spanish': {
      id: 'AZnzlk1XvdvUeBnXmlld', // Dora
      name: 'Dora',
      language: 'Spanish',
      description: 'Gentle, caring Spanish voice',
      gender: 'female'
    },
    'French': {
      id: 'EXAVITQu4vr4xnSDxMaL', // Léa
      name: 'Léa',
      language: 'French',
      description: 'Soft, compassionate French voice',
      gender: 'female'
    },
    'Swahili': {
      id: '21m00Tcm4TlvDq8ikWAM', // Fallback to Bella
      name: 'Bella',
      language: 'Swahili',
      description: 'Warm voice (English fallback)',
      gender: 'female'
    }
  }

  // Default voice settings optimized for affirmations
  private defaultSettings: VoiceSettings = {
    stability: 0.6,
    similarity_boost: 0.8,
    style: 0.2,
    use_speaker_boost: true
  }

  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || ''
    this.loadCacheFromStorage()
    this.cleanupOldCache()
  }

  private loadCacheFromStorage(): void {
    try {
      const stored = localStorage.getItem('multilingual_voice_cache')
      if (stored) {
        const data = JSON.parse(stored)
        Object.entries(data).forEach(([key, value]: [string, any]) => {
          if (Date.now() - value.timestamp < this.cacheExpiry) {
            this.cache.set(key, value)
          }
        })
      }
    } catch (error) {
      console.error('Error loading voice cache:', error)
    }
  }

  private saveCacheToStorage(): void {
    try {
      // Limit cache size
      if (this.cache.size > this.maxCacheSize) {
        const entries = Array.from(this.cache.entries())
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
        
        // Remove oldest entries
        const toRemove = entries.slice(0, this.cache.size - this.maxCacheSize)
        toRemove.forEach(([key]) => {
          const cached = this.cache.get(key)
          if (cached?.audioUrl) {
            URL.revokeObjectURL(cached.audioUrl)
          }
          this.cache.delete(key)
        })
      }

      const cacheObject = Object.fromEntries(this.cache)
      localStorage.setItem('multilingual_voice_cache', JSON.stringify(cacheObject))
    } catch (error) {
      console.error('Error saving voice cache:', error)
    }
  }

  private cleanupOldCache(): void {
    const now = Date.now()
    const toDelete: string[] = []

    this.cache.forEach((value, key) => {
      if (now - value.timestamp > this.cacheExpiry) {
        if (value.audioUrl) {
          URL.revokeObjectURL(value.audioUrl)
        }
        toDelete.push(key)
      }
    })

    toDelete.forEach(key => this.cache.delete(key))
    
    if (toDelete.length > 0) {
      this.saveCacheToStorage()
    }
  }

  private getCacheKey(text: string, language: string, voiceId: string): string {
    const textHash = btoa(encodeURIComponent(text)).slice(0, 32)
    return `${language}_${voiceId}_${textHash}`
  }

  private getUserLanguage(): string {
    return localStorage.getItem('shameless_preferred_language') || 
           localStorage.getItem('user_language') || 
           'English'
  }

  private getVoiceForLanguage(language: string): VoiceConfig {
    return this.voices[language] || this.voices['English']
  }

  async synthesizeSpeech(request: TTSRequest): Promise<TTSResponse> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'ElevenLabs API key not configured'
        }
      }

      const language = request.language || this.getUserLanguage()
      const voice = this.getVoiceForLanguage(language)
      const voiceId = request.voiceId || voice.id
      const settings = { ...this.defaultSettings, ...request.settings }

      const cacheKey = this.getCacheKey(request.text, language, voiceId)

      // Check cache first
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        return {
          success: true,
          audioUrl: cached.audioUrl,
          cached: true,
          voiceUsed: cached.voiceId
        }
      }

      // Generate new audio
      const audioBlob = await this.generateSpeech(request.text, voiceId, settings)
      const audioUrl = URL.createObjectURL(audioBlob)

      // Cache the result
      const cacheEntry: CachedAudio = {
        audioUrl,
        timestamp: Date.now(),
        text: request.text,
        language,
        voiceId
      }
      
      this.cache.set(cacheKey, cacheEntry)
      this.saveCacheToStorage()

      return {
        success: true,
        audioUrl,
        cached: false,
        voiceUsed: voiceId
      }
    } catch (error: any) {
      console.error('Multilingual TTS error:', error)
      return {
        success: false,
        error: error.message || 'Failed to synthesize speech'
      }
    }
  }

  private async generateSpeech(text: string, voiceId: string, settings: VoiceSettings): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: settings
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`)
    }

    return await response.blob()
  }

  // Pre-cache common affirmations for quick access
  async preCacheAffirmations(language?: string): Promise<void> {
    const targetLanguage = language || this.getUserLanguage()
    const voice = this.getVoiceForLanguage(targetLanguage)

    // Common affirmations to pre-cache
    const commonAffirmations = [
      'You are worthy of love and kindness.',
      'Your feelings are valid and important.',
      'You are exactly where you need to be.',
      'You deserve gentleness, especially from yourself.',
      'Every step forward is progress worth celebrating.'
    ]

    // Cache in background without blocking
    setTimeout(async () => {
      for (const affirmation of commonAffirmations) {
        try {
          await this.synthesizeSpeech({
            text: affirmation,
            language: targetLanguage,
            voiceId: voice.id
          })
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 200))
        } catch (error) {
          console.warn('Pre-cache failed for:', affirmation, error)
        }
      }
    }, 1000)
  }

  // Get voice information for current language
  getCurrentVoiceInfo(): VoiceConfig {
    const language = this.getUserLanguage()
    return this.getVoiceForLanguage(language)
  }

  // Get all available voices
  getAvailableVoices(): VoiceConfig[] {
    return Object.values(this.voices)
  }

  // Update voice for language (for future customization)
  updateVoiceForLanguage(language: string, voiceId: string): void {
    if (this.voices[language]) {
      this.voices[language].id = voiceId
      // Clear cache for this language to force regeneration
      this.clearCacheForLanguage(language)
    }
  }

  // Clear cache for specific language
  clearCacheForLanguage(language: string): void {
    const toDelete: string[] = []
    
    this.cache.forEach((value, key) => {
      if (value.language === language) {
        if (value.audioUrl) {
          URL.revokeObjectURL(value.audioUrl)
        }
        toDelete.push(key)
      }
    })

    toDelete.forEach(key => this.cache.delete(key))
    this.saveCacheToStorage()
  }

  // Clear all cache
  clearAllCache(): void {
    this.cache.forEach(value => {
      if (value.audioUrl) {
        URL.revokeObjectURL(value.audioUrl)
      }
    })
    this.cache.clear()
    localStorage.removeItem('multilingual_voice_cache')
  }

  // Get cache statistics
  getCacheStats(): { 
    size: number
    languages: string[]
    totalSize: string
    oldestEntry: Date | null
  } {
    const languages = new Set<string>()
    let oldestTimestamp = Date.now()

    this.cache.forEach(value => {
      languages.add(value.language)
      if (value.timestamp < oldestTimestamp) {
        oldestTimestamp = value.timestamp
      }
    })

    return {
      size: this.cache.size,
      languages: Array.from(languages),
      totalSize: `${(this.cache.size * 0.5).toFixed(1)}MB (estimated)`,
      oldestEntry: this.cache.size > 0 ? new Date(oldestTimestamp) : null
    }
  }

  // Check if service is available
  isAvailable(): boolean {
    return !!this.apiKey
  }

  // Test voice synthesis
  async testVoice(language?: string): Promise<TTSResponse> {
    const testText = language === 'Spanish' ? 'Hola, soy tu compañera de bienestar.' :
                    language === 'French' ? 'Bonjour, je suis votre compagne de bien-être.' :
                    language === 'Swahili' ? 'Hujambo, mimi ni mwenzako wa ustawi.' :
                    'Hello, I am your wellness companion.'

    return await this.synthesizeSpeech({
      text: testText,
      language: language || this.getUserLanguage()
    })
  }
}

export const multilingualVoice = new MultilingualVoiceService()
export type { TTSRequest, TTSResponse, VoiceConfig }