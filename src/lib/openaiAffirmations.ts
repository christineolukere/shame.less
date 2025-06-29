// OpenAI integration for generating personalized affirmations
interface AffirmationRequest {
  mood: string
  color: string
  culturalBackground?: string[]
  spiritualPreference?: string
  supportStyle?: string
  userName?: string
}

interface AffirmationResponse {
  success: boolean
  affirmation?: string
  error?: string
}

class OpenAIAffirmationService {
  private apiKey: string
  private baseUrl = 'https://api.openai.com/v1'

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || ''
  }

  async generateAffirmation(request: AffirmationRequest): Promise<AffirmationResponse> {
    try {
      if (!this.apiKey) {
        // Fallback to static affirmations if no API key
        return this.getFallbackAffirmation(request)
      }

      const prompt = this.buildPrompt(request)

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a compassionate, culturally-aware wellness companion specializing in creating personalized affirmations for young women of color. Your responses should be warm, healing, and culturally sensitive.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
          presence_penalty: 0.1
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const affirmation = data.choices?.[0]?.message?.content?.trim()

      if (!affirmation) {
        throw new Error('No affirmation generated')
      }

      return {
        success: true,
        affirmation: this.cleanAffirmation(affirmation)
      }
    } catch (error: any) {
      console.error('Affirmation generation error:', error)
      
      // Fallback to static affirmations
      return this.getFallbackAffirmation(request)
    }
  }

  private buildPrompt(request: AffirmationRequest): string {
    const { mood, color, culturalBackground, spiritualPreference, supportStyle, userName } = request

    let prompt = `Create a personalized, healing affirmation for someone feeling "${mood}" with energy that matches "${color}".`

    // Add cultural context
    if (culturalBackground && culturalBackground.length > 0) {
      prompt += ` This person identifies with: ${culturalBackground.join(', ')}.`
    }

    // Add spiritual context
    if (spiritualPreference && spiritualPreference !== 'preferNotToSay') {
      prompt += ` Their spiritual approach is: ${spiritualPreference}.`
    }

    // Add support style
    if (supportStyle) {
      switch (supportStyle) {
        case 'spirituality':
          prompt += ' Use spiritual and faith-based language.'
          break
        case 'science':
          prompt += ' Use evidence-based, psychological language.'
          break
        case 'culture':
          prompt += ' Honor cultural wisdom and ancestral strength.'
          break
        default:
          prompt += ' Use gentle, universal language.'
      }
    }

    prompt += `

Requirements:
- Keep it under 25 words
- Make it personal and specific to their current emotional state
- Use "I" statements for self-affirmation
- Be culturally sensitive and inclusive
- Focus on strength, healing, and self-compassion
- Avoid clichés or generic phrases
- Make it feel like a warm hug in words

Return only the affirmation, no quotes or extra text.`

    return prompt
  }

  private cleanAffirmation(affirmation: string): string {
    // Remove quotes and clean up the affirmation
    return affirmation
      .replace(/^["']|["']$/g, '')
      .replace(/^I am that I am\.|^I am\.|^You are/, 'I am')
      .trim()
  }

  private getFallbackAffirmation(request: AffirmationRequest): AffirmationResponse {
    const { mood, color } = request

    // Curated fallback affirmations based on mood and color
    const fallbacks: Record<string, Record<string, string[]>> = {
      peaceful: {
        'Warm Sage': [
          'I am grounded in my own inner wisdom and peace.',
          'My calm energy is a gift I give to myself and others.',
          'I trust the gentle rhythm of my healing journey.'
        ],
        'Soft Pink': [
          'I wrap myself in tenderness and self-compassion.',
          'My gentle heart is both soft and incredibly strong.',
          'I am worthy of the love I so freely give others.'
        ],
        'Gentle Lavender': [
          'I am held by forces of love greater than I can imagine.',
          'My peace flows from a deep well of inner knowing.',
          'I trust in the sacred timing of my life.'
        ]
      },
      frustrated: {
        'Sunset Orange': [
          'I channel my fire into positive change and growth.',
          'My frustration is information guiding me toward my truth.',
          'I am powerful enough to transform this energy into wisdom.'
        ],
        'Warm Sage': [
          'I breathe through this moment with grace and patience.',
          'My strength grows through every challenge I face.',
          'I am learning to be gentle with myself in difficult times.'
        ]
      },
      tender: {
        'Soft Pink': [
          'My vulnerability is a bridge to deeper connection.',
          'I honor my tender heart as a source of strength.',
          'I am safe to feel deeply and love myself through it.'
        ],
        'Gentle Lavender': [
          'My sensitivity is a gift that makes the world more beautiful.',
          'I hold space for all my feelings with loving kindness.',
          'I am worthy of gentleness, especially from myself.'
        ]
      }
    }

    // Get fallback affirmation
    const moodAffirmations = fallbacks[mood.toLowerCase()]
    const colorAffirmations = moodAffirmations?.[color]
    
    let affirmation: string
    if (colorAffirmations && colorAffirmations.length > 0) {
      affirmation = colorAffirmations[Math.floor(Math.random() * colorAffirmations.length)]
    } else {
      // Ultimate fallback
      affirmation = 'I am worthy of love, care, and gentleness, especially from myself.'
    }

    return {
      success: true,
      affirmation
    }
  }
}

export const openaiAffirmations = new OpenAIAffirmationService()
export type { AffirmationRequest, AffirmationResponse }