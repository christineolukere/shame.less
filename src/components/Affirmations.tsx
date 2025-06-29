import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shuffle, Heart, Volume2, VolumeX, Bookmark, Play, Pause } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';
import { getStoredSupportStyle } from '../hooks/useOnboarding';
import GentleSoundPlayer from './GentleSoundPlayer';

interface AffirmationsProps {
  onBack: () => void;
}

const Affirmations: React.FC<AffirmationsProps> = ({ onBack }) => {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { translations: t } = useLocalization();
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const supportStyle = getStoredSupportStyle();

  const getAffirmationsForStyle = () => {
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

    // Add culturally-specific affirmations based on support style
    if (supportStyle === 'spirituality') {
      return [
        ...baseAffirmations,
        {
          text: "I am divinely guided and protected on this journey of healing.",
          category: "Divine Connection",
          color: "lavender"
        },
        {
          text: "The Creator's love flows through me, healing every wounded part.",
          category: "Spiritual Healing",
          color: "sage"
        }
      ];
    } else if (supportStyle === 'culture') {
      return [
        ...baseAffirmations,
        {
          text: "My ancestors' strength flows through me, and I am never truly alone.",
          category: "Ancestral Wisdom",
          color: "cream"
        },
        {
          text: "I carry the resilience of generations who survived so I could thrive.",
          category: "Cultural Strength",
          color: "terracotta"
        }
      ];
    } else if (supportStyle === 'science') {
      return [
        ...baseAffirmations,
        {
          text: "My brain is capable of forming new, healthier patterns with each kind choice I make.",
          category: "Neuroplasticity",
          color: "sage"
        },
        {
          text: "Research shows that self-compassion leads to greater resilience and well-being.",
          category: "Evidence-Based",
          color: "lavender"
        }
      ];
    }

    return baseAffirmations;
  };

  const affirmations = getAffirmationsForStyle();

  useEffect(() => {
    // Cleanup speech synthesis on unmount
    return () => {
      if (speechRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const speakAffirmation = (text: string) => {
    if (isMuted) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    // Try to find a suitable voice
    const voices = speechSynthesis.getVoices();
    const femaleVoices = voices.filter(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('karen')
    );
    
    if (femaleVoices.length > 0) {
      utterance.voice = femaleVoices[0];
    } else if (voices.length > 0) {
      utterance.voice = voices[0];
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
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
            className="p-2 rounded-full bg-sage-100 text-sage-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-2xl font-serif text-sage-800">{t.dailyAffirmations}</h1>
        </div>
        <motion.button
          onClick={randomAffirmation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-terracotta-100 text-terracotta-700"
        >
          <Shuffle className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Audio Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-lavender-50 rounded-2xl p-4 border border-lavender-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lavender-800">Audio Playback</h3>
          <motion.button
            onClick={() => setIsMuted(!isMuted)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full transition-colors ${
              isMuted ? 'bg-red-100 text-red-600' : 'bg-lavender-100 text-lavender-600'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </motion.button>
        </div>
        
        <p className="text-sm text-lavender-600 mt-2">
          {isMuted ? 'Audio is muted' : 'Click the play button to hear affirmations read aloud'}
        </p>
      </motion.div>

      {/* Gentle Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cream-50 rounded-2xl p-6 border border-cream-100"
      >
        <div className="flex items-center space-x-2 mb-3">
          <Heart className="w-5 h-5 text-cream-600" />
          <h3 className="font-serif text-cream-800">{t.wordsOfLove}</h3>
        </div>
        <p className="text-cream-700 text-sm leading-relaxed">
          {supportStyle === 'spirituality' && "These affirmations are infused with spiritual wisdom to nurture your soul."}
          {supportStyle === 'culture' && "These affirmations honor the strength and wisdom of your cultural heritage."}
          {supportStyle === 'science' && "These affirmations are grounded in psychological research and evidence-based practices."}
          {!supportStyle && "These gentle affirmations are crafted to nurture your heart and mind with love."}
        </p>
      </motion.div>

      {/* Main Affirmation Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAffirmation}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.4 }}
          className={`bg-${current.color}-50 rounded-3xl p-8 border border-${current.color}-100 text-center space-y-6`}
        >
          <div className={`inline-block px-3 py-1 bg-${current.color}-100 text-${current.color}-700 text-xs font-medium rounded-full`}>
            {current.category}
          </div>
          
          <blockquote className={`text-xl font-serif text-${current.color}-800 leading-relaxed`}>
            "{current.text}"
          </blockquote>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <motion.button
              onClick={togglePlayback}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isMuted}
              className={`p-3 rounded-full transition-colors ${
                isMuted 
                  ? `bg-gray-100 text-gray-400 cursor-not-allowed`
                  : isPlaying
                    ? `bg-${current.color}-200 text-${current.color}-800`
                    : `bg-${current.color}-100 text-${current.color}-700 hover:bg-${current.color}-200`
              }`}
              title={isMuted ? "Audio is muted" : isPlaying ? "Pause affirmation" : "Listen to affirmation"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </motion.button>
            
            <motion.button
              onClick={() => setIsSaved(!isSaved)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full transition-colors ${
                isSaved 
                  ? `bg-${current.color}-200 text-${current.color}-800` 
                  : `bg-${current.color}-100 text-${current.color}-700 hover:bg-${current.color}-200`
              }`}
              title="Save affirmation"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Ambient Sound Player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GentleSoundPlayer />
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-sage-600">
          {currentAffirmation + 1} of {affirmations.length}
        </div>
        
        <motion.button
          onClick={nextAffirmation}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-sage-500 text-white rounded-lg font-medium hover:bg-sage-600 transition-colors"
        >
          {t.nextAffirmation}
        </motion.button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center space-x-2">
        {affirmations.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              speechSynthesis.cancel();
              setIsPlaying(false);
              setCurrentAffirmation(index);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentAffirmation 
                ? `bg-${current.color}-500` 
                : 'bg-sage-200 hover:bg-sage-300'
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>

      {/* Reflection Prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-lavender-50 rounded-2xl p-6 border border-lavender-100"
      >
        <h3 className="font-serif text-lavender-800 mb-2">{t.gentleReflection}</h3>
        <p className="text-lavender-700 text-sm leading-relaxed">
          {t.reflectionPrompt}
        </p>
      </motion.div>
    </div>
  );
};

export default Affirmations;