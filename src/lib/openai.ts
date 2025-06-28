// OpenAI integration for AI Letter to Self feature
interface AILetterRequest {
  content: string
  emotion?: string
  supportStyle?: string | null
  culturalBackground?: string[]
  spiritualPreference?: string
}

interface AILetterResponse {
  success: boolean
  letter?: string
  error?: string
}

// Mock OpenAI integration (replace with actual API key when ready)
export async function generateAILetter(request: AILetterRequest): Promise<AILetterResponse> {
  try {
    // For now, we'll use a mock response with personalized templates
    // In production, this would call OpenAI's API
    const letter = await generateMockLetter(request)
    
    return {
      success: true,
      letter
    }
  } catch (error: any) {
    console.error('Error generating AI letter:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Mock letter generation with personalized templates
async function generateMockLetter(request: AILetterRequest): Promise<string> {
  const { content, emotion, supportStyle, culturalBackground, spiritualPreference } = request
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Personalized greeting based on cultural background and spiritual preference
  const getPersonalizedGreeting = () => {
    if (spiritualPreference === 'spirituality') {
      return "Beloved soul,"
    } else if (culturalBackground?.includes('african') || culturalBackground?.includes('blackAmerican')) {
      return "Beautiful sister,"
    } else if (culturalBackground?.includes('latinaHispanic')) {
      return "Querida,"
    } else {
      return "Dear one,"
    }
  }

  // Supportive language based on support style
  const getSupportiveLanguage = () => {
    switch (supportStyle) {
      case 'spirituality':
        return {
          strength: "divine strength within you",
          wisdom: "sacred wisdom",
          closing: "You are held by love that transcends understanding."
        }
      case 'science':
        return {
          strength: "resilience you've built",
          wisdom: "emotional intelligence",
          closing: "Your brain is literally rewiring itself for healing with each gentle choice you make."
        }
      case 'culture':
        return {
          strength: "ancestral strength flowing through you",
          wisdom: "inherited wisdom",
          closing: "Your ancestors' dreams live on in your courage to heal."
        }
      default:
        return {
          strength: "inner strength",
          wisdom: "intuitive wisdom",
          closing: "You are exactly where you need to be."
        }
    }
  }

  const greeting = getPersonalizedGreeting()
  const language = getSupportiveLanguage()

  // Generate contextual response based on emotion and content
  const getContextualResponse = () => {
    if (emotion === 'heavy' || content.toLowerCase().includes('difficult') || content.toLowerCase().includes('hard')) {
      return `I see you carrying something heavy today, and I want you to know that your feelings are completely valid. The ${language.strength} has carried you through difficult moments before, and it's still there, even when you can't feel it.

What you've shared shows such courage. It takes tremendous bravery to acknowledge our struggles and sit with difficult emotions. This isn't weakness—this is the kind of ${language.wisdom} that leads to real healing.`
    } else if (emotion === 'peaceful' || emotion === 'content') {
      return `There's something beautiful about the peace you're experiencing right now. I hope you can pause and really feel it—let it settle into your bones and remind you that you deserve these moments of calm.

Your journey toward this peace hasn't been easy, and yet here you are. The ${language.strength} that brought you here is the same strength that will carry you forward.`
    } else if (emotion === 'growing' || content.toLowerCase().includes('progress') || content.toLowerCase().includes('better')) {
      return `I can feel the growth in your words, and it's truly beautiful to witness. Every small step you're taking is rewiring your relationship with yourself in the most profound ways.

The ${language.wisdom} you're developing isn't just changing you—it's creating ripples that will touch every relationship and experience in your life.`
    } else {
      return `Thank you for sharing what's in your heart. Your willingness to be honest about your experience, even when it's complicated, shows such ${language.strength}.

Whatever you're feeling right now is valid and deserving of compassion. You don't have to have it all figured out—you just have to keep showing up for yourself with the same gentleness you'd offer a dear friend.`
    }
  }

  const contextualResponse = getContextualResponse()

  return `${greeting}

${contextualResponse}

${language.closing}

With love and deep respect for your journey,
Your AI companion 💛

P.S. Remember, this letter is generated to offer comfort and reflection, but your healing journey is uniquely yours. Trust your own wisdom above all else.`
}

// Content safety filter
export function isContentSafe(content: string): boolean {
  const unsafeKeywords = [
    'kill myself', 'suicide', 'end my life', 'hurt myself', 'self harm',
    'cut myself', 'overdose', 'jump off', 'hang myself', 'want to die',
    'better off dead', 'no point living', 'harm others', 'hurt someone'
  ]
  
  const lowerContent = content.toLowerCase()
  return !unsafeKeywords.some(keyword => lowerContent.includes(keyword))
}