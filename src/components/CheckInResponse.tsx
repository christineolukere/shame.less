import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';
import { CheckInResponse } from '../lib/checkInResponses';
import GentleSoundPlayer from './GentleSoundPlayer';

interface CheckInResponseProps {
  response: CheckInResponse;
  emotion: string;
  color: string;
  onContinue: () => void;
  onSaveFavorite?: (response: CheckInResponse) => void;
}

const CheckInResponseComponent: React.FC<CheckInResponseProps> = ({
  response,
  emotion,
  color,
  onContinue,
  onSaveFavorite
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  const handleSaveFavorite = () => {
    if (onSaveFavorite) {
      onSaveFavorite(response);
      setIsSaved(true);
    }
  };

  const getAnimationClass = () => {
    switch (response.animation) {
      case 'gentleBreeze':
        return 'animate-pulse';
      case 'petalFall':
        return 'animate-bounce';
      case 'heartPulse':
        return 'animate-pulse';
      case 'breathingCircle':
        return 'animate-ping';
      case 'gentleGlow':
        return 'animate-pulse';
      default:
        return 'animate-pulse';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Background with dynamic gradient */}
      <div className={`bg-gradient-to-br ${response.backgroundColor} rounded-3xl p-8 relative overflow-hidden`}>
        {/* Animated background element */}
        <motion.div
          className={`absolute inset-0 opacity-20 ${getAnimationClass()}`}
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)`
          }}
        />
        
        {/* Emoji decoration */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-4xl text-center mb-4"
        >
          {response.emoji}
        </motion.div>

        {/* Affirmation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-4"
        >
          <h3 className="text-lg font-serif text-sage-800 mb-4">For you, right now</h3>
          <blockquote className="text-xl font-serif text-sage-800 leading-relaxed">
            "{response.affirmation}"
          </blockquote>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center space-x-4 mt-6"
        >
          <motion.button
            onClick={() => setShowReflection(!showReflection)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white/80 text-sage-700 rounded-lg font-medium hover:bg-white transition-colors"
          >
            {showReflection ? 'Hide reflection' : 'Reflect deeper'}
          </motion.button>
          
          {onSaveFavorite && (
            <motion.button
              onClick={handleSaveFavorite}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/80 text-sage-700 rounded-lg hover:bg-white transition-colors"
              title="Save this combination"
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Gentle Sound Player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <GentleSoundPlayer />
      </motion.div>

      {/* Reflection Question */}
      <AnimatePresence>
        {showReflection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-lavender-50 rounded-2xl p-6 border border-lavender-100"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Heart className="w-5 h-5 text-lavender-600" />
              <h4 className="font-serif text-lavender-800">Gentle reflection</h4>
            </div>
            <p className="text-lavender-700 leading-relaxed mb-4">
              {response.reflection}
            </p>
            <textarea
              placeholder="Let your thoughts flow here... (optional)"
              className="w-full h-24 p-3 border border-lavender-200 rounded-lg focus:ring-2 focus:ring-lavender-300 focus:border-transparent resize-none text-lavender-800 placeholder-lavender-400"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Combination info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center space-y-3"
      >
        <div className="text-sm text-sage-600">
          Your combination: <span className="font-medium">{emotion}</span> + <span className="font-medium">{color}</span>
        </div>
        
        <motion.button
          onClick={onContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-sage-500 text-white rounded-lg font-medium hover:bg-sage-600 transition-colors"
        >
          <span>Continue to dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CheckInResponseComponent;