import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shuffle, Heart, Volume2, VolumeX, Bookmark, Play, Pause, RotateCcw } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';
import { getStoredSupportStyle } from '../hooks/useOnboarding';

interface AffirmationsProps {
  onBack: () => void;
}

const Affirmations: React.FC<AffirmationsProps> = ({ onBack }) => {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const { t } = useLocalization();
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const supportStyle = getStoredSupportStyle();

  const getAffirmationsForStyle = () => {
    // Base set of 7 affirmations that work for all support styles
    const baseAffirmations = [
      {
        text: "I am worthy of love and kindness, especially from myself.",
        category: "Self-Love",
        color: "terracotta"
      },
      {
        text: "My feelings are valid and deserve to be acknowledged with compassion.",
        category: "Emotional Validation",
        color: "lavender"
      },
      {
        text: "I choose to speak to myself with the same gentleness I would offer a dear friend.",
        category: "Inner Voice",
        color: "sage"
      },
      {
        text: "My healing journey is unique and unfolds at exactly the right pace for me.",
        category: "Healing",
        color: "cream"
      },
      {
        text: "I am allowed to take up space and honor my needs without apology.",
        category: "Boundaries",
        color: "terracotta"
      },
      {
        text: "Every small step I take toward caring for myself is an act of courage.",
        category: "Self-Care",
        color: "sage"
      },
      {
        text: "I release the need to be perfect and embrace my beautifully human experience.",
        category: "Self-Acceptance",
        color: "lavender"
      }
    ];

    // Replace the last affirmation based on support style to keep exactly 7
    if (supportStyle === 'spirituality') {
      baseAffirmations[6] = {
        text: "I am divinely guided and protected on this journey of healing.",
        category: "Divine Connection",
        color: "lavender"
      };
    } else if (supportStyle === 'culture') {
      baseAffirmations[6] = {
        text: "My ancestors' strength flows through me, and I am never truly alone.",
        category: "Ancestral Wisdom",
        color: "cream"
      };
    } else if (supportStyle === 'science') {
      baseAffirmations[6] = {
        text: "My brain is capable of forming new, healthier patterns with each kind choice I make.",
        category: "Neuroplasticity",
        color: "sage"
      };
    }

    return baseAffirmations;
  };

  const affirmations = getAffirmationsForStyle();

  useEffect(() => {
    // Initialize audio context for better audio control
    if (!audioContextRef.current && window.AudioContext) {
      audioContextRef.current = new AudioContext();
    }

    // Cleanup speech synthesis on unmount
    return () => {
      if (speechRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const speakAffirmation = (text: string) => {
    if (isMuted || audioError) return;

    try {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Normalize audio settings
      utterance.rate = 0.75; // Slower, more meditative pace
      utterance.pitch = 1.0; // Natural pitch
      utterance.volume = 0.8; // Slightly softer volume

      // Try to find a suitable voice with fallback
      const voices = speechSynthesis.getVoices();
      const preferredVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.lang.startsWith('en')
      );
      
      if (preferredVoices.length > 0) {
        utterance.voice = preferredVoices[0];
      } else if (voices.length > 0) {
        utterance.voice = voices[0];
      }

      // Audio fade in effect
      utterance.onstart = () => {
        setIsPlaying(true);
        setAudioError(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        setAudioError(true);
      };

      speechRef.current = utterance;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error with speech synthesis:', error);
      setAudioError(true);
      setIsPlaying(false);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      speakAffirmation(affirmations[currentAffirmation].text);
    }
  };

  const nextAffirmation = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
    setIsSaved(false);
  };

  const randomAffirmation = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setCurrentAffirmation(randomIndex);
    setIsSaved(false);
  };

  const resetAudio = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setAudioError(false);
    setIsMuted(false);
  };

  const current = affirmations[currentAffirmation];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-sage-100 text-sage-700 touch-target"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-2xl font-serif text-sage-800">{t('dailyAffirmations')}</h1>
        </div>
        <motion.button
          onClick={randomAffirmation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-terracotta-100 text-terracotta-700 touch-target"
        >
          <Shuffle className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Audio Controls - Smaller */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-lavender-50 rounded-xl p-3 border border-lavender-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lavender-800 text-sm">Audio Playback</h3>
          <div className="flex items-center space-x-2">
            {audioError && (
              <motion.button
                onClick={resetAudio}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors touch-target"
                title="Reset audio"
              >
                <RotateCcw className="w-3 h-3" />
              </motion.button>
            )}
            <motion.button
              onClick={() => setIsMuted(!isMuted)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1.5 rounded-full transition-colors touch-target ${
                isMuted ? 'bg-red-100 text-red-600' : 'bg-lavender-100 text-lavender-600'
              }`}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </motion.button>
          </div>
        </div>
        
        <p className="text-xs text-lavender-600 mt-1">
          {audioError ? 'Audio unavailable - text fallback active' : 
           isMuted ? 'Audio is muted' : 
           'Click the play button to hear affirmations read aloud'}
        </p>
      </motion.div>

      {/* Gentle Introduction - Smaller */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cream-50 rounded-xl p-4 border border-cream-100"
      >
        <div className="flex items-center space-x-2 mb-2">
          <Heart className="w-4 h-4 text-cream-600" />
          <h3 className="font-serif text-cream-800 text-sm">{t('wordsOfLove')}</h3>
        </div>
        <p className="text-cream-700 text-xs leading-relaxed">
          {supportStyle === 'spirituality' && "These affirmations are infused with spiritual wisdom to nurture your soul."}
          {supportStyle === 'culture' && "These affirmations honor the strength and wisdom of your cultural heritage."}
          {supportStyle === 'science' && "These affirmations are grounded in psychological research and evidence-based practices."}
          {!supportStyle && "These gentle affirmations are crafted to nurture your heart and mind with love."}
        </p>
      </motion.div>

      {/* Main Affirmation Card - Smaller */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAffirmation}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.4 }}
          className={`bg-${current.color}-50 rounded-2xl p-6 border border-${current.color}-100 text-center space-y-4`}
        >
          <div className={`inline-block px-2 py-1 bg-${current.color}-100 text-${current.color}-700 text-xs font-medium rounded-full`}>
            {current.category}
          </div>
          
          <blockquote className={`text-lg font-serif text-${current.color}-800 leading-relaxed`}>
            "{current.text}"
          </blockquote>

          {/* Action Buttons - Smaller */}
          <div className="flex items-center justify-center space-x-3">
            <motion.button
              onClick={togglePlayback}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isMuted || audioError}
              className={`p-2.5 rounded-full transition-colors touch-target ${
                isMuted || audioError
                  ? `bg-gray-100 text-gray-400 cursor-not-allowed`
                  : isPlaying
                    ? `bg-${current.color}-200 text-${current.color}-800`
                    : `bg-${current.color}-100 text-${current.color}-700 hover:bg-${current.color}-200`
              }`}
              title={audioError ? "Audio unavailable" : isMuted ? "Audio is muted" : isPlaying ? "Pause affirmation" : "Listen to affirmation"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </motion.button>
            
            <motion.button
              onClick={() => setIsSaved(!isSaved)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 rounded-full transition-colors touch-target ${
                isSaved 
                  ? `bg-${current.color}-200 text-${current.color}-800` 
                  : `bg-${current.color}-100 text-${current.color}-700 hover:bg-${current.color}-200`
              }`}
              title="Save affirmation"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation - Smaller */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-sage-600">
          {currentAffirmation + 1} of {affirmations.length}
        </div>
        
        <motion.button
          onClick={nextAffirmation}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-sage-500 text-white rounded-lg text-sm font-medium hover:bg-sage-600 transition-colors touch-target"
        >
          {t('nextAffirmation')}
        </motion.button>
      </div>

      {/* Progress Dots - Smaller */}
      <div className="flex items-center justify-center space-x-1.5">
        {affirmations.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              speechSynthesis.cancel();
              setIsPlaying(false);
              setCurrentAffirmation(index);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-colors touch-target ${
              index === currentAffirmation 
                ? `bg-${current.color}-500` 
                : 'bg-sage-200 hover:bg-sage-300'
            }`}
            whileHover={{ scale: 1.3 }}
          />
        ))}
      </div>

      {/* Reflection Prompt - Smaller */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-lavender-50 rounded-xl p-4 border border-lavender-100"
      >
        <h3 className="font-serif text-lavender-800 mb-2 text-sm">{t('gentleReflection')}</h3>
        <p className="text-lavender-700 text-xs leading-relaxed">
          {t('reflectionPrompt')}
        </p>
      </motion.div>
    </div>
  );
};

export default Affirmations;