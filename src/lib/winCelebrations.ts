import confetti from 'canvas-confetti';

export interface CelebrationConfig {
  confetti?: {
    particleCount: number;
    spread: number;
    origin: { x: number; y: number };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
  };
  emoji?: {
    emoji: string;
    count: number;
    duration: number;
  };
  haptic?: {
    pattern: number[];
  };
  message: string;
  sound?: string;
}

// Category-based celebration configurations
export const celebrationConfigs: Record<string, CelebrationConfig[]> = {
  'self-care': [
    {
      confetti: {
        particleCount: 25,
        spread: 50,
        origin: { x: 0.5, y: 0.7 },
        colors: ['#f6d2c2', '#e9e5f1', '#c7d0c7'],
        scalar: 0.8
      },
      emoji: {
        emoji: '🌸',
        count: 3,
        duration: 2000
      },
      haptic: { pattern: [50, 100, 50] },
      message: "That matters. Keep nurturing yourself, love. 💕"
    },
    {
      confetti: {
        particleCount: 20,
        spread: 40,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#faf1e4', '#f6d2c2', '#e9e5f1'],
        scalar: 0.7
      },
      emoji: {
        emoji: '✨',
        count: 4,
        duration: 2500
      },
      haptic: { pattern: [30, 80, 30] },
      message: "You're taking such beautiful care of yourself. ✨"
    },
    {
      emoji: {
        emoji: '🌿',
        count: 3,
        duration: 2000
      },
      haptic: { pattern: [40] },
      message: "Every act of self-care is an act of love. 🌿"
    }
  ],
  
  'boundaries': [
    {
      confetti: {
        particleCount: 30,
        spread: 60,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#a892c4', '#de6b47', '#5f7a5f'],
        shapes: ['square']
      },
      emoji: {
        emoji: '💪🏽',
        count: 2,
        duration: 2000
      },
      haptic: { pattern: [100, 50, 100] },
      message: "You honored yourself. That takes courage. 💪🏽"
    },
    {
      confetti: {
        particleCount: 25,
        spread: 45,
        origin: { x: 0.5, y: 0.7 },
        colors: ['#e9e5f1', '#c7d0c7', '#f6d2c2']
      },
      emoji: {
        emoji: '🛡️',
        count: 2,
        duration: 1800
      },
      haptic: { pattern: [80, 40, 80] },
      message: "Your boundaries are sacred. Well done. 🛡️"
    },
    {
      emoji: {
        emoji: '👑',
        count: 3,
        duration: 2200
      },
      haptic: { pattern: [60, 100, 60] },
      message: "You chose yourself. That's royal behavior. 👑"
    }
  ],
  
  'growth': [
    {
      confetti: {
        particleCount: 35,
        spread: 70,
        origin: { x: 0.5, y: 0.8 },
        colors: ['#c7d0c7', '#faf1e4', '#e9e5f1'],
        scalar: 0.9
      },
      emoji: {
        emoji: '🌱',
        count: 4,
        duration: 2500
      },
      haptic: { pattern: [50, 100, 150] },
      message: "Look at you growing! Every step counts. 🌱"
    },
    {
      confetti: {
        particleCount: 28,
        spread: 55,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#5f7a5f', '#a892c4', '#e4c078']
      },
      emoji: {
        emoji: '🦋',
        count: 3,
        duration: 3000
      },
      haptic: { pattern: [40, 80, 120] },
      message: "Your transformation is beautiful to witness. 🦋"
    },
    {
      emoji: {
        emoji: '🌟',
        count: 5,
        duration: 2000
      },
      haptic: { pattern: [70, 50, 70] },
      message: "You're becoming more yourself every day. 🌟"
    }
  ],
  
  'joy': [
    {
      confetti: {
        particleCount: 40,
        spread: 80,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#faf1e4', '#f6d2c2', '#e9e5f1', '#c7d0c7'],
        scalar: 1.0
      },
      emoji: {
        emoji: '🎉',
        count: 5,
        duration: 2500
      },
      haptic: { pattern: [100, 50, 100, 50, 100] },
      message: "Joy looks so beautiful on you! 🎉"
    },
    {
      confetti: {
        particleCount: 35,
        spread: 75,
        origin: { x: 0.5, y: 0.7 },
        colors: ['#e4c078', '#de6b47', '#a892c4']
      },
      emoji: {
        emoji: '☀️',
        count: 3,
        duration: 2000
      },
      haptic: { pattern: [80, 100, 80] },
      message: "Your joy is contagious. Keep shining! ☀️"
    },
    {
      emoji: {
        emoji: '💖',
        count: 4,
        duration: 2200
      },
      haptic: { pattern: [60, 120, 60] },
      message: "This moment of joy is a gift. 💖"
    }
  ]
};

// Fallback celebrations for any category
export const fallbackCelebrations: CelebrationConfig[] = [
  {
    confetti: {
      particleCount: 25,
      spread: 50,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#c7d0c7', '#e9e5f1', '#f6d2c2'],
      scalar: 0.8
    },
    emoji: {
      emoji: '💛',
      count: 3,
      duration: 2000
    },
    haptic: { pattern: [50] },
    message: "Every step forward matters. You're doing great! 💛"
  },
  {
    emoji: {
      emoji: '🌈',
      count: 3,
      duration: 2000
    },
    haptic: { pattern: [40, 80, 40] },
    message: "You're creating beautiful moments. 🌈"
  },
  {
    confetti: {
      particleCount: 20,
      spread: 40,
      origin: { x: 0.5, y: 0.7 },
      colors: ['#faf1e4', '#c7d0c7', '#e9e5f1']
    },
    emoji: {
      emoji: '✨',
      count: 2,
      duration: 1800
    },
    haptic: { pattern: [60] },
    message: "This win is worth celebrating. ✨"
  }
];

// Trigger haptic feedback if supported
export function triggerHaptic(pattern: number[]): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

// Trigger confetti animation
export function triggerConfetti(config: CelebrationConfig['confetti']): void {
  if (!config) return;
  
  confetti({
    particleCount: config.particleCount,
    spread: config.spread,
    origin: config.origin,
    colors: config.colors,
    shapes: config.shapes,
    scalar: config.scalar || 1,
    gravity: 0.6,
    drift: 0,
    ticks: 200
  });
}

// Get random celebration for a category
export function getCelebrationForCategory(category: string): CelebrationConfig {
  const categoryConfigs = celebrationConfigs[category] || fallbackCelebrations;
  const randomIndex = Math.floor(Math.random() * categoryConfigs.length);
  return categoryConfigs[randomIndex];
}

// Main celebration trigger function
export function celebrateWin(category: string, winText: string): CelebrationConfig {
  const celebration = getCelebrationForCategory(category);
  
  // Trigger confetti if configured
  if (celebration.confetti) {
    triggerConfetti(celebration.confetti);
  }
  
  // Trigger haptic if configured
  if (celebration.haptic) {
    triggerHaptic(celebration.haptic.pattern);
  }
  
  return celebration;
}