// Dynamic response system for emotion + color combinations
export interface CheckInResponse {
  affirmation: string;
  reflection: string;
  visual?: string;
  animation?: string;
  backgroundColor?: string;
  emoji?: string;
}

export interface EmotionColorMapping {
  [emotion: string]: {
    [color: string]: CheckInResponse[];
  };
}

// Comprehensive mapping of emotion + color combinations
export const checkInResponses: EmotionColorMapping = {
  peaceful: {
    "Warm Sage": [
      {
        affirmation: "Your inner calm is a sanctuary that travels with you.",
        reflection: "What small ritual helps you return to this peaceful feeling?",
        visual: "sageGlow",
        backgroundColor: "from-sage-100 to-sage-200",
        emoji: "🌿",
        animation: "gentleBreeze"
      },
      {
        affirmation: "In stillness, you find your truest wisdom.",
        reflection: "How can you honor this peaceful energy throughout your day?",
        visual: "sageGlow",
        backgroundColor: "from-sage-100 to-sage-200",
        emoji: "🕊️",
        animation: "gentleBreeze"
      }
    ],
    "Soft Pink": [
      {
        affirmation: "Your gentle heart is both tender and incredibly strong.",
        reflection: "What would it feel like to wrap yourself in this softness?",
        visual: "roseBloom",
        backgroundColor: "from-rose-100 to-pink-200",
        emoji: "🌸",
        animation: "petalFall"
      },
      {
        affirmation: "Peace flows through you like a gentle river of love.",
        reflection: "Where in your body do you feel this peaceful energy most?",
        visual: "roseBloom",
        backgroundColor: "from-rose-100 to-pink-200",
        emoji: "💗",
        animation: "petalFall"
      }
    ],
    "Gentle Lavender": [
      {
        affirmation: "You are held by the universe's infinite tenderness.",
        reflection: "What does this peaceful moment want to teach you?",
        visual: "lavenderMist",
        backgroundColor: "from-lavender-100 to-purple-200",
        emoji: "🔮",
        animation: "mistFlow"
      },
      {
        affirmation: "Your peace is a gift to everyone around you.",
        reflection: "How can you carry this serenity into your next interaction?",
        visual: "lavenderMist",
        backgroundColor: "from-lavender-100 to-purple-200",
        emoji: "✨",
        animation: "mistFlow"
      }
    ],
    "Golden Cream": [
      {
        affirmation: "You radiate warmth and tranquility like golden sunlight.",
        reflection: "What are you most grateful for in this peaceful moment?",
        visual: "goldenGlow",
        backgroundColor: "from-yellow-100 to-amber-200",
        emoji: "☀️",
        animation: "sunRays"
      }
    ],
    "Sunset Orange": [
      {
        affirmation: "Your peace burns bright and steady, like a sacred flame.",
        reflection: "How does this inner fire of peace want to guide you?",
        visual: "sunsetGlow",
        backgroundColor: "from-orange-100 to-red-200",
        emoji: "🔥",
        animation: "warmGlow"
      }
    ],
    "Ocean Blue": [
      {
        affirmation: "You flow with the rhythm of your own deep wisdom.",
        reflection: "What depths of peace are you discovering within yourself?",
        visual: "oceanWaves",
        backgroundColor: "from-blue-100 to-cyan-200",
        emoji: "🌊",
        animation: "waveFlow"
      }
    ]
  },
  
  tender: {
    "Warm Sage": [
      {
        affirmation: "Your tenderness is not weakness—it's your superpower.",
        reflection: "Where can you offer yourself the same gentleness you give others?",
        visual: "sageEmbrace",
        backgroundColor: "from-sage-100 to-green-200",
        emoji: "🤗",
        animation: "gentleHug"
      },
      {
        affirmation: "You are allowed to feel deeply and love yourself through it.",
        reflection: "What does your tender heart need most right now?",
        visual: "sageEmbrace",
        backgroundColor: "from-sage-100 to-green-200",
        emoji: "💚",
        animation: "gentleHug"
      }
    ],
    "Soft Pink": [
      {
        affirmation: "You are held, even when you feel unsure.",
        reflection: "What helps you feel safe when you're feeling tender?",
        visual: "roseEmbrace",
        backgroundColor: "from-rose-100 to-pink-200",
        emoji: "🌹",
        animation: "heartPulse"
      },
      {
        affirmation: "Your vulnerability is a bridge to deeper connection.",
        reflection: "Who in your life sees and honors your tender heart?",
        visual: "roseEmbrace",
        backgroundColor: "from-rose-100 to-pink-200",
        emoji: "💕",
        animation: "heartPulse"
      }
    ],
    "Gentle Lavender": [
      {
        affirmation: "Your sensitivity is a gift that makes the world more beautiful.",
        reflection: "How can you honor your tender feelings without judgment?",
        visual: "lavenderComfort",
        backgroundColor: "from-lavender-100 to-purple-200",
        emoji: "🦋",
        animation: "butterflyFloat"
      }
    ],
    "Golden Cream": [
      {
        affirmation: "You deserve the same warmth and care you give to others.",
        reflection: "What would unconditional self-love look like today?",
        visual: "goldenWarmth",
        backgroundColor: "from-yellow-100 to-amber-200",
        emoji: "🌻",
        animation: "sunflowerTurn"
      }
    ]
  },

  frustrated: {
    "Gentle Lavender": [
      {
        affirmation: "You are allowed to pause and breathe through this feeling.",
        reflection: "What's beneath the frustration? What do you really need?",
        visual: "lavenderCalm",
        backgroundColor: "from-lavender-100 to-purple-200",
        emoji: "🌙",
        animation: "breathingCircle"
      },
      {
        affirmation: "Your frustration is information—listen to what it's telling you.",
        reflection: "What boundary might need to be set or honored?",
        visual: "lavenderCalm",
        backgroundColor: "from-lavender-100 to-purple-200",
        emoji: "🔮",
        animation: "breathingCircle"
      }
    ],
    "Soft Pink": [
      {
        affirmation: "Even in frustration, you can choose gentleness with yourself.",
        reflection: "How can you show yourself compassion in this moment?",
        visual: "pinkSoothe",
        backgroundColor: "from-rose-100 to-pink-200",
        emoji: "🌸",
        animation: "gentlePulse"
      }
    ],
    "Warm Sage": [
      {
        affirmation: "You have the strength to move through this with grace.",
        reflection: "What would help you feel more grounded right now?",
        visual: "sageStability",
        backgroundColor: "from-sage-100 to-green-200",
        emoji: "🌳",
        animation: "rootGrowth"
      }
    ],
    "Sunset Orange": [
      {
        affirmation: "Your fire can transform frustration into positive action.",
        reflection: "What change is this frustration calling you to make?",
        visual: "transformFire",
        backgroundColor: "from-orange-100 to-red-200",
        emoji: "🔥",
        animation: "flameTransform"
      }
    ],
    "Ocean Blue": [
      {
        affirmation: "Like the ocean, you can be both powerful and peaceful.",
        reflection: "How can you channel this energy into something healing?",
        visual: "oceanPower",
        backgroundColor: "from-blue-100 to-cyan-200",
        emoji: "🌊",
        animation: "waveTransform"
      }
    ]
  },

  heavy: {
    "Warm Sage": [
      {
        affirmation: "You don't have to carry this weight alone.",
        reflection: "What support do you need to ask for today?",
        visual: "sageSupport",
        backgroundColor: "from-sage-100 to-green-200",
        emoji: "🤝",
        animation: "supportingHands"
      },
      {
        affirmation: "Even in heaviness, you are worthy of love and care.",
        reflection: "What small act of self-care feels possible right now?",
        visual: "sageSupport",
        backgroundColor: "from-sage-100 to-green-200",
        emoji: "💚",
        animation: "supportingHands"
      }
    ],
    "Gentle Lavender": [
      {
        affirmation: "This feeling is temporary, even when it doesn't feel that way.",
        reflection: "What has helped you through heavy times before?",
        visual: "lavenderLift",
        backgroundColor: "from-lavender-100 to-purple-200",
        emoji: "🌙",
        animation: "gentleLift"
      }
    ],
    "Ocean Blue": [
      {
        affirmation: "Like the ocean's depths, you contain both darkness and light.",
        reflection: "What wisdom might this heavy feeling be offering you?",
        visual: "oceanDepths",
        backgroundColor: "from-blue-100 to-indigo-200",
        emoji: "🌊",
        animation: "deepWaves"
      }
    ]
  },

  content: {
    "Golden Cream": [
      {
        affirmation: "Your contentment is a form of gratitude in action.",
        reflection: "What simple pleasure brought you joy today?",
        visual: "goldenContent",
        backgroundColor: "from-yellow-100 to-amber-200",
        emoji: "😊",
        animation: "gentleGlow"
      },
      {
        affirmation: "You are exactly where you need to be in this moment.",
        reflection: "How can you savor this feeling of contentment?",
        visual: "goldenContent",
        backgroundColor: "from-yellow-100 to-amber-200",
        emoji: "☀️",
        animation: "gentleGlow"
      }
    ],
    "Warm Sage": [
      {
        affirmation: "Your inner peace creates ripples of calm around you.",
        reflection: "What aspects of your life feel most aligned right now?",
        visual: "sageBalance",
        backgroundColor: "from-sage-100 to-green-200",
        emoji: "⚖️",
        animation: "balanceFlow"
      }
    ],
    "Soft Pink": [
      {
        affirmation: "You are blooming beautifully in your own time.",
        reflection: "What growth are you most proud of lately?",
        visual: "pinkBloom",
        backgroundColor: "from-rose-100 to-pink-200",
        emoji: "🌺",
        animation: "flowerBloom"
      }
    ]
  },

  growing: {
    "Warm Sage": [
      {
        affirmation: "Every day, you're becoming more of who you're meant to be.",
        reflection: "What new part of yourself are you discovering?",
        visual: "sageGrowth",
        backgroundColor: "from-sage-100 to-green-200",
        emoji: "🌱",
        animation: "plantGrowth"
      },
      {
        affirmation: "Your growth happens in both the light and the shadows.",
        reflection: "What challenge has taught you something valuable recently?",
        visual: "sageGrowth",
        backgroundColor: "from-sage-100 to-green-200",
        emoji: "🌿",
        animation: "plantGrowth"
      }
    ],
    "Golden Cream": [
      {
        affirmation: "You are expanding into your fullest, brightest self.",
        reflection: "What dreams are calling to you more strongly now?",
        visual: "goldenExpansion",
        backgroundColor: "from-yellow-100 to-amber-200",
        emoji: "🌟",
        animation: "starExpansion"
      }
    ],
    "Gentle Lavender": [
      {
        affirmation: "Your transformation is as natural as the changing seasons.",
        reflection: "What old patterns are you ready to release?",
        visual: "lavenderTransform",
        backgroundColor: "from-lavender-100 to-purple-200",
        emoji: "🦋",
        animation: "butterflyTransform"
      }
    ]
  },

  hopeful: {
    "Golden Cream": [
      {
        affirmation: "Your hope is a light that can never be extinguished.",
        reflection: "What possibility excites you most about the future?",
        visual: "goldenHope",
        backgroundColor: "from-yellow-100 to-amber-200",
        emoji: "✨",
        animation: "sparkleRise"
      },
      {
        affirmation: "You are planting seeds of beautiful tomorrows.",
        reflection: "What small step toward your dreams feels possible today?",
        visual: "goldenHope",
        backgroundColor: "from-yellow-100 to-amber-200",
        emoji: "🌅",
        animation: "sparkleRise"
      }
    ],
    "Gentle Lavender": [
      {
        affirmation: "Your hope is a bridge between who you are and who you're becoming.",
        reflection: "What vision of your future fills you with the most joy?",
        visual: "lavenderHope",
        backgroundColor: "from-lavender-100 to-purple-200",
        emoji: "🌙",
        animation: "moonRise"
      }
    ],
    "Soft Pink": [
      {
        affirmation: "Love and hope are growing stronger within you each day.",
        reflection: "How has hope shown up for you when you needed it most?",
        visual: "pinkHope",
        backgroundColor: "from-rose-100 to-pink-200",
        emoji: "💖",
        animation: "heartGrow"
      }
    ]
  },

  tired: {
    "Gentle Lavender": [
      {
        affirmation: "Rest is not giving up—it's giving yourself what you need.",
        reflection: "What would true rest look like for you right now?",
        visual: "lavenderRest",
        backgroundColor: "from-lavender-100 to-purple-200",
        emoji: "🌙",
        animation: "gentleRock"
      },
      {
        affirmation: "Your tiredness is your body's wisdom asking for care.",
        reflection: "How can you honor your need for rest without guilt?",
        visual: "lavenderRest",
        backgroundColor: "from-lavender-100 to-purple-200",
        emoji: "😴",
        animation: "gentleRock"
      }
    ],
    "Ocean Blue": [
      {
        affirmation: "Like the tide, you can ebb and flow with your energy.",
        reflection: "What would help you feel more restored?",
        visual: "oceanRest",
        backgroundColor: "from-blue-100 to-cyan-200",
        emoji: "🌊",
        animation: "gentleWaves"
      }
    ],
    "Warm Sage": [
      {
        affirmation: "You are allowed to move at your own gentle pace.",
        reflection: "What can you release or delegate to create more space for rest?",
        visual: "sageRest",
        backgroundColor: "from-sage-100 to-green-200",
        emoji: "🍃",
        animation: "leafFloat"
      }
    ]
  }
};

// Fallback responses for undefined combinations
export const fallbackResponses: CheckInResponse[] = [
  {
    affirmation: "Your feelings are valid and deserve to be honored with compassion.",
    reflection: "What does your heart need most in this moment?",
    visual: "gentleGlow",
    backgroundColor: "from-sage-100 to-lavender-100",
    emoji: "💛",
    animation: "gentlePulse"
  },
  {
    affirmation: "You are exactly where you need to be in your healing journey.",
    reflection: "How can you show yourself extra kindness today?",
    visual: "gentleGlow",
    backgroundColor: "from-cream-100 to-terracotta-100",
    emoji: "🌸",
    animation: "gentlePulse"
  },
  {
    affirmation: "Every feeling you have is a messenger bringing you wisdom.",
    reflection: "What is this feeling trying to tell you?",
    visual: "gentleGlow",
    backgroundColor: "from-lavender-100 to-sage-100",
    emoji: "✨",
    animation: "gentlePulse"
  }
];

// Function to get response for emotion + color combination
export function getCheckInResponse(emotion: string, color: string): CheckInResponse {
  const emotionResponses = checkInResponses[emotion.toLowerCase()];
  
  if (emotionResponses) {
    const colorResponses = emotionResponses[color];
    if (colorResponses && colorResponses.length > 0) {
      // Return a random response from the available options
      const randomIndex = Math.floor(Math.random() * colorResponses.length);
      return colorResponses[randomIndex];
    }
  }
  
  // Return a random fallback response
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
}

// Function to get all saved favorite combinations (for future feature)
export function getFavoriteResponses(): CheckInResponse[] {
  const favorites = localStorage.getItem('shameless_favorite_responses');
  return favorites ? JSON.parse(favorites) : [];
}

// Function to save a response as favorite (for future feature)
export function saveFavoriteResponse(response: CheckInResponse): void {
  const favorites = getFavoriteResponses();
  const updatedFavorites = [...favorites, { ...response, savedAt: new Date().toISOString() }];
  localStorage.setItem('shameless_favorite_responses', JSON.stringify(updatedFavorites));
}