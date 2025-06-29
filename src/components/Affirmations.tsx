import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shuffle, Heart, Volume2, VolumeX, Bookmark, Play, Pause, RotateCcw } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';
import { getCurrentTheme, getThemedAffirmations } from '../lib/themeManager';

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

  const currentTheme = getCurrentTheme();

  const getAffirmationsForTheme = () => {
    // Base set of 7 affirmations that work for all themes
    const baseAffirmations = [
      {
        text: "I am worthy of love and kindness, especially from myself.",
        category: "Self-Love",
        color: currentTheme.colors.primary.split('-')[0]
      },
      {
        text: "My feelings are valid and deserve to be acknowledged with compassion.",
        category: "Emotional Validation",
        color: currentTheme.colors.secondary.split('-')[0]
      },
      {
        text: "I choose to speak to myself with the same gentleness I would offer a dear friend.",
        category: "Inner Voice",
        color: currentTheme.colors.accent.split('-')[0]
      },
      {
        text: "My healing journey is unique and unfolds at exactly the right pace for me.",
        category: "Healing",
        color: currentTheme.colors.primary.split('-')[0]
      },
      {
        text: "I am allowed to take up space and honor my needs without apology.",
        category: "Boundaries",
        color: currentTheme.colors.secondary.split('-')[0]
      },
      {
        text: "Every small step I take toward caring for myself is an act of courage.",
        category: "Self-Care",
        color: currentTheme.colors.accent.split('-')[0]
      },
      {
        text: "I release the need to be perfect and embrace my beautifully human experience.",
        category: "Self-Acceptance",
        color: currentTheme.colors.primary.split('-')[0]
      }
    ];

    return getThemedAffirmations(baseAffirmations, currentTheme);
  };

  const affirmations = getAffirmationsForTheme();

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
      
      // Normalize audio settings based on theme
      utterance.rate = currentTheme.affirmationTone === 'spiritual' ? 0.7 : 0.75; // Slower for spiritual
      utterance.pitch = currentTheme.affirmationTone === 'ancestral' ? 1.1 : 1.0; // Slightly higher for ancestral
      utterance.volume = 0.8;

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
            className={`p-2 rounded-full bg-${currentTheme.colors.surface} text-${currentTheme.colors.text} touch-target`}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className={`text-2xl font-serif text-${currentTheme.colors.text}`}>{t('dailyAffirmations')}</h1>
        </div>
        <motion.button
          onClick={randomAffirmation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-full bg-${currentTheme.colors.primary.replace('-500', '-100')} text-${currentTheme.colors.primary.replace('-500', '-700')} touch-target`}
        >
          <Shuffle className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Audio Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-${currentTheme.colors.surface} rounded-xl p-3 border border-${currentTheme.colors.secondary.replace('-400', '-200')}`}
      >
        <div className="flex items-center justify-between">
          <h3 className={`font-serif text-${currentTheme.colors.text} text-sm`}>Audio Playback</h3>
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
                isMuted ? 'bg-red-100 text-red-600' : `bg-${currentTheme.colors.secondary.replace('-400', '-100')} text-${currentTheme.colors.secondary.replace('-400', '-600')}`
              }`}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </motion.button>
          </div>
        </div>
        
        <p className={`text-xs text-${currentTheme.colors.text.replace('-900', '-600')} mt-1`}>
          {audioError ? 'Audio unavailable - text fallback active' : 
           isMuted ? 'Audio is muted' : 
           'Click the play button to hear affirmations read aloud'}
        </p>
      </motion.div>

      {/* Gentle Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-${currentTheme.colors.background} rounded-xl p-4 border border-${currentTheme.colors.secondary.replace('-400', '-200')}`}
      >
        <div className="flex items-center space-x-2 mb-2">
          <Heart className={`w-4 h-4 text-${currentTheme.colors.accent.replace('-600', '-600')}`} />
          <h3 className={`font-serif text-${currentTheme.colors.text} text-sm`}>{t('wordsOfLove')}</h3>
        </div>
        <p className={`text-${currentTheme.colors.text.replace('-900', '-700')} text-xs leading-relaxed`}>
          {currentTheme.affirmationTone === 'spiritual' && "These affirmations are infused with spiritual wisdom to nurture your soul."}
          {currentTheme.affirmationTone === 'ancestral' && "These affirmations honor the strength and wisdom of your cultural heritage."}
          {currentTheme.affirmationTone === 'secular' && "These affirmations are grounded in psychological research and evidence-based practices."}
          {currentTheme.affirmationTone === 'gentle' && "These gentle affirmations are crafted to nurture your heart and mind with love."}
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
          className={`bg-${current.color}-50 rounded-2xl p-6 border border-${current.color}-100 text-center space-y-4`}
        >
          <div className={`inline-block px-2 py-1 bg-${current.color}-100 text-${current.color}-700 text-xs font-medium rounded-full`}>
            {current.category}
          </div>
          
          <blockquote className={`text-lg font-serif text-${current.color}-800 leading-relaxed`}>
            "{current.text}"
          </blockquote>

          {/* Action Buttons */}
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

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className={`text-xs text-${currentTheme.colors.text.replace('-900', '-600')}`}>
          {currentAffirmation + 1} of {affirmations.length}
        </div>
        
        <motion.button
          onClick={nextAffirmation}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-4 py-2 bg-${currentTheme.colors.primary} text-white rounded-lg text-sm font-medium hover:bg-${currentTheme.colors.primary.replace('-500', '-600')} transition-colors touch-target`}
        >
          {t('nextAffirmation')}
        </motion.button>
      </div>

      {/* Progress Dots */}
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
                : `bg-${currentTheme.colors.text.replace('-900', '-200')} hover:bg-${currentTheme.colors.text.replace('-900', '-300')}`
            }`}
            whileHover={{ scale: 1.3 }}
          />
        ))}
      </div>

      {/* Reflection Prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className={`bg-${currentTheme.colors.surface} rounded-xl p-4 border border-${currentTheme.colors.secondary.replace('-400', '-200')}`}
      >
        <h3 className={`font-serif text-${currentTheme.colors.text} mb-2 text-sm`}>{t('gentleReflection')}</h3>
        <p className={`text-${currentTheme.colors.text.replace('-900', '-700')} text-xs leading-relaxed`}>
          {t('reflectionPrompt')}
        </p>
      </motion.div>
    </div>
  );
};

export default Affirmations;