import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CelebrationConfig } from '../lib/winCelebrations';

interface WinCelebrationProps {
  celebration: CelebrationConfig | null;
  onComplete: () => void;
}

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
  y: number;
  delay: number;
}

const WinCelebration: React.FC<WinCelebrationProps> = ({ celebration, onComplete }) => {
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!celebration) return;

    // Generate floating emojis if configured
    if (celebration.emoji) {
      const emojis: FloatingEmoji[] = [];
      for (let i = 0; i < celebration.emoji.count; i++) {
        emojis.push({
          id: `emoji-${i}`,
          emoji: celebration.emoji.emoji,
          x: Math.random() * 80 + 10, // 10% to 90% of screen width
          y: Math.random() * 20 + 70, // Start from bottom area
          delay: i * 200 // Stagger the animations
        });
      }
      setFloatingEmojis(emojis);
    }

    // Show message after a brief delay
    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, 300);

    // Auto-complete after duration
    const duration = celebration.emoji?.duration || 2000;
    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration + 500);

    return () => {
      clearTimeout(messageTimer);
      clearTimeout(completeTimer);
    };
  }, [celebration, onComplete]);

  if (!celebration) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Floating Emojis */}
      <AnimatePresence>
        {floatingEmojis.map((emojiData) => (
          <motion.div
            key={emojiData.id}
            initial={{ 
              x: `${emojiData.x}vw`, 
              y: `${emojiData.y}vh`,
              opacity: 0,
              scale: 0.5
            }}
            animate={{ 
              x: `${emojiData.x + (Math.random() - 0.5) * 20}vw`,
              y: `${emojiData.y - 40}vh`,
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1, 0.8],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: (celebration.emoji?.duration || 2000) / 1000,
              delay: emojiData.delay / 1000,
              ease: "easeOut"
            }}
            className="absolute text-4xl"
            style={{ 
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            {emojiData.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Celebration Message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-sage-100 max-w-sm mx-4">
              <motion.p 
                className="text-center text-sage-800 font-medium leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {celebration.message}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle background pulse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-sage-100 via-cream-100 to-lavender-100"
      />
    </div>
  );
};

export default WinCelebration;