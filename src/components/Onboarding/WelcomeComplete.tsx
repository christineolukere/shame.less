import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, ArrowRight } from 'lucide-react'

interface WelcomeCompleteProps {
  onContinue: () => void
  anchorPhrase: string
}

const WelcomeComplete: React.FC<WelcomeCompleteProps> = ({ onContinue, anchorPhrase }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-sage-50 to-lavender-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-lg text-center space-y-8"
      >
        {/* Celebration Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-terracotta-100 to-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-12 h-12 text-terracotta-600 fill-current" />
          </div>
          
          {/* Floating sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, (i % 2 === 0 ? 20 : -20) * (i + 1)],
                y: [0, -30 - i * 10]
              }}
              transition={{ 
                duration: 2,
                delay: 0.5 + i * 0.2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Sparkles className="w-4 h-4 text-lavender-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-serif text-sage-800">Welcome</h1>
          <p className="text-lg text-sage-700 leading-relaxed">
            Your journey is your own—and we're honored to hold space for it.
          </p>
        </motion.div>

        {/* Personalized Anchor Phrase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-cream-50 to-lavender-50 rounded-2xl p-6 border border-cream-200"
        >
          <p className="text-sm text-sage-600 mb-2">Your grounding phrase:</p>
          <blockquote className="text-xl font-serif text-sage-800 italic">
            "{anchorPhrase}"
          </blockquote>
        </motion.div>

        {/* Gentle Promises */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <h3 className="font-serif text-sage-800">What you can expect:</h3>
          <div className="space-y-2 text-left">
            {[
              'A judgment-free space for your thoughts and feelings',
              'Personalized support that honors your unique journey',
              'Tools for gentle self-care and emotional wellness',
              'Complete privacy—your data belongs to you'
            ].map((promise, index) => (
              <motion.div
                key={promise}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex items-start space-x-2"
              >
                <div className="w-2 h-2 bg-sage-400 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sage-700 text-sm">{promise}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.button
          onClick={onContinue}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-sage-500 to-terracotta-500 text-white rounded-xl font-medium hover:from-sage-600 hover:to-terracotta-600 transition-all shadow-lg"
        >
          <span>Begin your journey</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Final Affirmation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-center"
        >
          <p className="text-sage-600 text-sm italic">
            Remember: You are worthy of love, care, and gentleness—especially from yourself. 💛
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default WelcomeComplete