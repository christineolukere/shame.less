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

  private isValidApiKey(key: string): boolean {
    // Check if API key exists and is not a placeholder
    return key && 
           key.length > 0 && 
           key !== 'your_openai_api_key' && 
           key.startsWith('sk-')
  }

  async generateAffirmation(request: AffirmationRequest): Promise<AffirmationResponse> {
    try {
      if (!this.isValidApiKey(this.apiKey)) {
        // Fallback to static affirmations if no valid API key
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
        // If it's a 401 error or any API error, fall back to static affirmations
        console.warn(`OpenAI API error: ${response.status}. Using fallback affirmations.`)
        return this.getFallbackAffirmation(request)
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
      console.warn('Affirmation generation error, using fallback:', error.message)
      
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
      },
      anxious: {
        'Soft Pink': [
          'I breathe deeply and trust in my ability to handle this moment.',
          'My anxiety is temporary, but my strength is lasting.',
          'I am safe in this moment and worthy of peace.'
        ],
        'Gentle Lavender': [
          'I release what I cannot control and embrace what I can.',
          'My nervous system is learning to trust and relax.',
          'I am held by love even in moments of uncertainty.'
        ],
        'Warm Sage': [
          'I ground myself in the present moment with compassion.',
          'My worries do not define me; my resilience does.',
          'I trust my inner wisdom to guide me through this.'
        ]
      },
      joyful: {
        'Sunset Orange': [
          'I celebrate my joy as a gift to myself and the world.',
          'My happiness is valid and deserves to be honored.',
          'I radiate warmth and light from my authentic self.'
        ],
        'Soft Pink': [
          'I embrace this beautiful moment with my whole heart.',
          'My joy is a reflection of my inner light shining bright.',
          'I deserve all the happiness flowing through me now.'
        ],
        'Gentle Lavender': [
          'I am grateful for this feeling of lightness and peace.',
          'My joy connects me to the beauty in all things.',
          'I trust in the abundance of good things in my life.'
        ]
      },
      overwhelmed: {
        'Warm Sage': [
          'I take one breath, one step, one moment at a time.',
          'I am stronger than any challenge before me.',
          'I give myself permission to rest and reset.'
        ],
        'Soft Pink': [
          'I wrap myself in gentleness during this difficult time.',
          'I am doing the best I can with what I have right now.',
          'I deserve compassion, especially from myself.'
        ],
        'Gentle Lavender': [
          'I trust that this feeling will pass and peace will return.',
          'I am held and supported even when I feel alone.',
          'I release the need to have everything figured out.'
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
      // Try to find any affirmations for this mood with any color
      if (moodAffirmations) {
        const allMoodAffirmations = Object.values(moodAffirmations).flat()
        if (allMoodAffirmations.length > 0) {
          affirmation = allMoodAffirmations[Math.floor(Math.random() * allMoodAffirmations.length)]
        } else {
          affirmation = 'I am worthy of love, care, and gentleness, especially from myself.'
        }
      } else {
        // Ultimate fallback
        affirmation = 'I am worthy of love, care, and gentleness, especially from myself.'
      }
    }

    return {
      success: true,
      affirmation
    }
  }
}

export const openaiAffirmations = new OpenAIAffirmationService()
export type { AffirmationRequest, AffirmationResponse }