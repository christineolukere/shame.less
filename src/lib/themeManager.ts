// Theme management system for shame.less app
export interface ThemeConfig {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
  }
  affirmationTone: 'spiritual' | 'secular' | 'ancestral' | 'gentle'
  journalPrompts: string[]
  culturalElements?: {
    greetings: string[]
    wisdom: string[]
    celebrations: string[]
  }
}

export const themes: Record<string, ThemeConfig> = {
  spiritual: {
    id: 'spiritual',
    name: 'Spiritual',
    description: 'Warm purples, sacred tones, divine connection',
    colors: {
      primary: 'purple-500',
      secondary: 'lavender-400',
      accent: 'violet-600',
      background: 'purple-50',
      surface: 'lavender-100',
      text: 'purple-900'
    },
    affirmationTone: 'spiritual',
    journalPrompts: [
      'What sacred wisdom is my soul calling me to remember today?',
      'How did the divine show up for me in unexpected ways?',
      'What spiritual practice brought me closest to my true self?',
      'Where did I feel most connected to something greater than myself?',
      'What prayer or intention wants to emerge from my heart?',
      'How can I honor the sacred within me today?',
      'What spiritual lesson is this challenge offering me?',
      'Where did I witness miracles, big or small, today?'
    ],
    culturalElements: {
      greetings: ['Blessed soul', 'Divine one', 'Sacred sister', 'Beautiful spirit'],
      wisdom: [
        'You are a divine being having a human experience',
        'Your soul chose this journey for your highest growth',
        'The universe conspires to support your healing',
        'You are held by love that transcends understanding'
      ],
      celebrations: ['Your spirit shines brightly', 'The divine celebrates with you', 'Your soul is dancing']
    }
  },

  secular: {
    id: 'secular',
    name: 'Secular',
    description: 'Clean greens, earth tones, neutral language',
    colors: {
      primary: 'sage-500',
      secondary: 'green-400',
      accent: 'emerald-600',
      background: 'sage-50',
      surface: 'green-100',
      text: 'sage-900'
    },
    affirmationTone: 'secular',
    journalPrompts: [
      'What am I most grateful for in this moment?',
      'How did I show myself compassion today?',
      'What boundary did I honor that made me feel stronger?',
      'Where did I notice growth in my thinking patterns?',
      'What small act of self-care felt most nourishing?',
      'How did I practice mindfulness in my daily routine?',
      'What challenge helped me develop resilience today?',
      'Where did I find peace in the midst of chaos?'
    ],
    culturalElements: {
      greetings: ['Friend', 'Beautiful human', 'Gentle soul', 'Dear one'],
      wisdom: [
        'You have everything within you to heal and grow',
        'Progress is not always linear, and that\'s perfectly okay',
        'Your feelings are valid and deserve acknowledgment',
        'Small steps forward are still meaningful progress'
      ],
      celebrations: ['You\'re doing amazing', 'Your growth is inspiring', 'You should be proud']
    }
  },

  ancestral: {
    id: 'ancestral',
    name: 'Ancestral',
    description: 'Rich golds, warm reds, Afrocentric wisdom',
    colors: {
      primary: 'amber-500',
      secondary: 'orange-400',
      accent: 'red-600',
      background: 'amber-50',
      surface: 'orange-100',
      text: 'amber-900'
    },
    affirmationTone: 'ancestral',
    journalPrompts: [
      'What ancestral wisdom am I being called to remember?',
      'How did I honor my heritage and cultural identity today?',
      'What strength from my lineage supported me through challenges?',
      'Where did I feel the presence of those who came before me?',
      'How can I be an ancestor future generations will be proud of?',
      'What cultural practices brought me joy and connection?',
      'How did I resist systems that don\'t serve my community?',
      'What story from my people\'s journey inspires me today?'
    ],
    culturalElements: {
      greetings: ['Sister', 'Queen', 'Beloved daughter', 'Child of the diaspora'],
      wisdom: [
        'Your ancestors\' dreams live on in your courage to heal',
        'You carry the strength of generations who survived so you could thrive',
        'Your healing heals the lineage both forward and backward',
        'You are the manifestation of your ancestors\' wildest dreams'
      ],
      celebrations: ['Your ancestors are smiling', 'You honor the lineage', 'The elders are proud']
    }
  },

  gentle: {
    id: 'gentle',
    name: 'Gentle',
    description: 'Soft pastels, universal comfort, inclusive warmth',
    colors: {
      primary: 'rose-400',
      secondary: 'cream-300',
      accent: 'sage-500',
      background: 'rose-50',
      surface: 'cream-100',
      text: 'rose-900'
    },
    affirmationTone: 'gentle',
    journalPrompts: [
      'What brought a smile to my face today?',
      'How did I practice gentleness with myself?',
      'What moment of beauty did I notice and appreciate?',
      'Where did I feel most at peace today?',
      'How did I nurture my inner child?',
      'What act of kindness touched my heart?',
      'Where did I find comfort when I needed it most?',
      'What made me feel loved and supported today?'
    ],
    culturalElements: {
      greetings: ['Sweet soul', 'Gentle heart', 'Precious one', 'Tender spirit'],
      wisdom: [
        'You deserve the same kindness you give to others',
        'Healing happens in the quiet, gentle moments',
        'Your sensitivity is a gift to the world',
        'There is strength in softness and power in vulnerability'
      ],
      celebrations: ['You\'re blooming beautifully', 'Your gentleness is a gift', 'You bring light to the world']
    }
  }
}

// Get current theme from localStorage
export function getCurrentTheme(): ThemeConfig {
  const savedTheme = localStorage.getItem('theme_preference') || 'secular'
  return themes[savedTheme] || themes.secular
}

// Apply theme to document body
export function applyTheme(themeId: string): void {
  const theme = themes[themeId]
  if (!theme) return

  // Apply theme class to body
  document.body.className = `theme-${themeId}`
  
  // Store theme preference
  localStorage.setItem('theme_preference', themeId)
  
  // Apply CSS custom properties for dynamic theming
  const root = document.documentElement
  root.style.setProperty('--theme-primary', `var(--color-${theme.colors.primary})`)
  root.style.setProperty('--theme-secondary', `var(--color-${theme.colors.secondary})`)
  root.style.setProperty('--theme-accent', `var(--color-${theme.colors.accent})`)
  root.style.setProperty('--theme-background', `var(--color-${theme.colors.background})`)
  root.style.setProperty('--theme-surface', `var(--color-${theme.colors.surface})`)
  root.style.setProperty('--theme-text', `var(--color-${theme.colors.text})`)
}

// Get theme-specific affirmations
export function getThemedAffirmations(baseAffirmations: any[], theme: ThemeConfig): any[] {
  const themedAffirmations = [...baseAffirmations]
  
  // Replace the last affirmation with theme-specific content
  switch (theme.affirmationTone) {
    case 'spiritual':
      themedAffirmations[6] = {
        text: "I am divinely guided and protected on this journey of healing.",
        category: "Divine Connection",
        color: "purple"
      }
      break
    case 'ancestral':
      themedAffirmations[6] = {
        text: "My ancestors' strength flows through me, and I am never truly alone.",
        category: "Ancestral Wisdom",
        color: "amber"
      }
      break
    case 'secular':
      themedAffirmations[6] = {
        text: "My brain is capable of forming new, healthier patterns with each kind choice I make.",
        category: "Neuroplasticity",
        color: "sage"
      }
      break
    case 'gentle':
      themedAffirmations[6] = {
        text: "I release the need to be perfect and embrace my beautifully human experience.",
        category: "Self-Acceptance",
        color: "rose"
      }
      break
  }
  
  return themedAffirmations
}

// Get theme-specific journal prompts
export function getThemedJournalPrompts(theme: ThemeConfig, language: string = 'English'): string[] {
  // For now, return English prompts. In a full implementation, you would
  // have language-specific prompts in the theme configuration
  return theme.journalPrompts
}

// Get theme-specific greeting
export function getThemedGreeting(theme: ThemeConfig): string {
  const greetings = theme.culturalElements?.greetings || ['beautiful']
  return greetings[Math.floor(Math.random() * greetings.length)]
}

// Get theme-specific wisdom
export function getThemedWisdom(theme: ThemeConfig): string {
  const wisdom = theme.culturalElements?.wisdom || ['You are worthy of love and care.']
  return wisdom[Math.floor(Math.random() * wisdom.length)]
}

// Get theme-specific celebration message
export function getThemedCelebration(theme: ThemeConfig): string {
  const celebrations = theme.culturalElements?.celebrations || ['You\'re doing great!']
  return celebrations[Math.floor(Math.random() * celebrations.length)]
}

// Initialize theme on app load
export function initializeTheme(): void {
  const currentTheme = getCurrentTheme()
  applyTheme(currentTheme.id)
}