// AI response generation for Mirror Mirror feature
interface MirrorRequest {
  transcribedText: string
  userLanguage?: string
  culturalBackground?: string[]
  supportStyle?: string
}

interface MirrorResponse {
  success: boolean
  response?: string
  error?: string
}

class MirrorMirrorAI {
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

  private buildSystemPrompt(request: MirrorRequest): string {
    let prompt = `You are a gentle, emotionally intelligent voice that responds like a wise friend or inner guide. You are speaking to someone who just shared something personal with you.

Your role is to reflect back to the speaker something kind, affirming, and thoughtful. You should:
- Acknowledge what they've shared with empathy
- Offer gentle validation of their feelings
- Provide a compassionate perspective or insight
- Use warm, nurturing language
- Keep responses under 75 words
- Speak as if you're their wisest, most loving inner voice`

    // Add cultural context if available
    if (request.culturalBackground && request.culturalBackground.length > 0) {
      prompt += `\n\nThe person identifies with these communities: ${request.culturalBackground.join(', ')}. Honor their cultural identity in your response.`
    }

    // Add support style context
    if (request.supportStyle) {
      switch (request.supportStyle) {
        case 'spirituality':
          prompt += '\n\nUse gentle spiritual language and concepts of divine love and guidance.'
          break
        case 'science':
          prompt += '\n\nUse evidence-based, psychological insights while maintaining warmth.'
          break
        case 'culture':
          prompt += '\n\nDraw from cultural wisdom and ancestral strength.'
          break
        default:
          prompt += '\n\nUse universal, gentle language that feels inclusive and warm.'
      }
    }

    // Add language context
    if (request.userLanguage && request.userLanguage !== 'English') {
      prompt += `\n\nRespond in ${request.userLanguage} if possible, or use simple English that translates well.`
    }

    return prompt
  }

  async generateResponse(request: MirrorRequest): Promise<MirrorResponse> {
    try {
      if (!this.isValidApiKey(this.apiKey)) {
        return this.getFallbackResponse(request)
      }

      const systemPrompt = this.buildSystemPrompt(request)

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: request.transcribedText
            }
          ],
          max_tokens: 100,
          temperature: 0.7,
          presence_penalty: 0.1
        })
      })

      if (!response.ok) {
        console.warn(`OpenAI API error: ${response.status}. Using fallback response.`)
        return this.getFallbackResponse(request)
      }

      const data = await response.json()
      const aiResponse = data.choices?.[0]?.message?.content?.trim()

      if (!aiResponse) {
        throw new Error('No response generated')
      }

      return {
        success: true,
        response: aiResponse
      }
    } catch (error: any) {
      console.warn('AI response generation error, using fallback:', error.message)
      return this.getFallbackResponse(request)
    }
  }

  private getFallbackResponse(request: MirrorRequest): MirrorResponse {
    // Curated fallback responses based on language and support style
    const fallbacks: Record<string, string[]> = {
      'English': [
        "I hear the courage in your voice as you share this with me. Your willingness to be honest about your experience shows such strength.",
        "Thank you for trusting me with what's in your heart. Your feelings are completely valid, and you deserve gentleness as you navigate this.",
        "There's something beautiful about the way you're showing up for yourself right now. You're exactly where you need to be in this moment.",
        "I can feel the depth of what you're experiencing. Remember that you don't have to carry this alone - you are worthy of support and care.",
        "Your voice matters, and what you've shared matters. You're being so brave by acknowledging these feelings and speaking them aloud."
      ],
      'Spanish': [
        "Escucho el valor en tu voz al compartir esto conmigo. Tu disposición a ser honesta muestra tanta fortaleza.",
        "Gracias por confiar en mí con lo que está en tu corazón. Tus sentimientos son completamente válidos.",
        "Hay algo hermoso en la forma en que te estás cuidando ahora mismo. Estás exactamente donde necesitas estar.",
        "Puedo sentir la profundidad de lo que estás experimentando. No tienes que cargar esto sola.",
        "Tu voz importa, y lo que has compartido importa. Eres muy valiente al reconocer estos sentimientos."
      ],
      'French': [
        "J'entends le courage dans ta voix en partageant cela avec moi. Ta volonté d'être honnête montre tant de force.",
        "Merci de me faire confiance avec ce qui est dans ton cœur. Tes sentiments sont complètement valides.",
        "Il y a quelque chose de beau dans la façon dont tu prends soin de toi maintenant. Tu es exactement où tu dois être.",
        "Je peux sentir la profondeur de ce que tu vis. Tu n'as pas à porter cela seule.",
        "Ta voix compte, et ce que tu as partagé compte. Tu es si courageuse de reconnaître ces sentiments."
      ],
      'Swahili': [
        "Ninasikia ujasiri katika sauti yako unaposhiriki hili nami. Utayari wako wa kuwa mkweli unaonyesha nguvu nyingi.",
        "Asante kwa kuniamini na kile kilicho moyoni mwako. Hisia zako ni halali kabisa.",
        "Kuna kitu kizuri kuhusu jinsi unavyojitunza sasa hivi. Uko mahali ambapo unahitaji kuwa.",
        "Ninaweza kuhisi kina cha unachokipitia. Huna haja ya kubeba hili peke yako.",
        "Sauti yako ni muhimu, na kile ulichoshiriki ni muhimu. Una ujasiri mkubwa wa kutambua hisia hizi."
      ]
    }

    const language = request.userLanguage || 'English'
    const responses = fallbacks[language] || fallbacks['English']
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    return {
      success: true,
      response: randomResponse
    }
  }

  isAvailable(): boolean {
    return this.isValidApiKey(this.apiKey)
  }
}

export const mirrorMirrorAI = new MirrorMirrorAI()
export type { MirrorRequest, MirrorResponse }