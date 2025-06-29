import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shuffle, Heart, Volume2, VolumeX, Bookmark, Play, Pause, RotateCcw, Loader2, Sparkles, Globe } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';
import { getCurrentTheme } from '../lib/themeManager';
import { openaiAffirmations } from '../lib/openaiAffirmations';
import { multilingualVoice } from '../lib/multilingualVoice';
import { getStoredSupportStyle } from '../hooks/useOnboarding';
import { createMultilingualAffirmations, getLocalizedCategories } from '../lib/multilingualAffirmations';

interface AffirmationsProps {
  onBack: () => void;
}

const Affirmations: React.FC<AffirmationsProps> = ({ onBack }) => {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [customAffirmation, setCustomAffirmation] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { t, currentLanguage } = useLocalization();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTheme = getCurrentTheme();
  const currentVoice = multilingualVoice.getCurrentVoiceInfo();

  // Base colors for affirmations
  const baseColors = [
    currentTheme.colors.primary.split('-')[0],
    currentTheme.colors.secondary.split('-')[0],
    currentTheme.colors.accent.split('-')[0],
    currentTheme.colors.primary.split('-')[0],
    currentTheme.colors.secondary.split('-')[0],
    currentTheme.colors.accent.split('-')[0],
    currentTheme.colors.primary.split('-')[0]
  ];

  // Get localized categories
  const localizedCategories = getLocalizedCategories(currentLanguage);
  
  // Get multilingual affirmations
  const affirmations = createMultilingualAffirmations(
    currentLanguage,
    localizedCategories,
    baseColors
  );

  useEffect(() => {
    // Pre-cache affirmations for current language
    if (multilingualVoice.isAvailable()) {
      multilingualVoice.preCacheAffirmations(currentLanguage);
    }

    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [currentLanguage, audioUrl]);

  const generatePersonalizedAffirmation = async () => {
    setIsGenerating(true);
    setAudioError(false);

    try {
      // Get user preferences
      const supportStyle = getStoredSupportStyle();
      const onboardingData = JSON.parse(localStorage.getItem('onboarding_data') || '{}');
      
      // Use a default mood/color combination for generation
      const request = {
        mood: 'peaceful',
        color: 'Warm Sage',
        culturalBackground: onboardingData.culturalBackground || [],
        spiritualPreference: onboardingData.spiritualPreference,
        supportStyle: supportStyle || 'gentle'
      };

      const response = await openaiAffirmations.generateAffirmation(request);
      
      if (response.success && response.affirmation) {
        setCustomAffirmation(response.affirmation);
        
        // Generate audio for the new affirmation
        await generateAudio(response.affirmation);
      } else {
        setAudioError(true);
      }
    } catch (error) {
      console.error('Error generating personalized affirmation:', error);
      setAudioError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAudio = async (text: string) => {
    if (isMuted || !multilingualVoice.isAvailable()) return;

    setIsLoadingAudio(true);
    setAudioError(false);

    try {
      const response = await multilingualVoice.synthesizeSpeech({
        text,
        language: currentLanguage,
        settings: {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true
        }
      });

      if (response.success && response.audioUrl) {
        // Clean up previous audio
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        
        setAudioUrl(response.audioUrl);
        setAudioError(false);
      } else {
        setAudioError(true);
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      setAudioError(true);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const togglePlayback = async () => {
    if (isLoadingAudio) return;

    const currentText = customAffirmation || affirmations[currentAffirmation].text;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // Generate audio if we don't have it
    if (!audioUrl) {
      await generateAudio(currentText);
      return;
    }

    // Play audio
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      audioRef.current = new Audio(audioUrl);
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        setAudioError(true);
        setIsPlaying(false);
      };

      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Audio playback error:', error);
        setAudioError(true);
        setIsPlaying(false);
      }
    }
  };

  const nextAffirmation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setCustomAffirmation(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
    setIsSaved(false);
  };

  const randomAffirmation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setCustomAffirmation(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setCurrentAffirmation(randomIndex);
    setIsSaved(false);
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setAudioError(false);
    setIsMuted(false);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  const current = affirmations[currentAffirmation];
  const displayText = customAffirmation || current.text;
  const displayCategory = customAffirmation ? "Personalized" : current.category;

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

      {/* Voice Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-${currentTheme.colors.surface} rounded-xl p-4 border border-${currentTheme.colors.secondary.replace('-400', '-200')}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className={`w-5 h-5 text-${currentTheme.colors.primary.replace('-500', '-600')}`} />
            <div>
              <h3 className={`font-serif text-${currentTheme.colors.text} text-sm`}>
                Voice: {currentVoice.name}
              </h3>
              <p className={`text-${currentTheme.colors.text.replace('-900', '-600')} text-xs`}>
                {currentVoice.description} • {currentLanguage}
              </p>
            </div>
          </div>
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
        
        <p className={`text-xs text-${currentTheme.colors.text.replace('-900', '-600')} mt-2`}>
          {!multilingualVoice.isAvailable() ? 'Voice synthesis unavailable - text only mode' :
           audioError ? 'Audio unavailable - try regenerating' : 
           isMuted ? 'Audio is muted' : 
           isLoadingAudio ? 'Generating audio...' :
           'Multilingual AI voice synthesis with warm, feminine tone'}
        </p>
      </motion.div>

      {/* AI Generation Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r from-${currentTheme.colors.primary.replace('-500', '-50')} to-${currentTheme.colors.secondary.replace('-400', '-50')} rounded-xl p-4 border border-${currentTheme.colors.primary.replace('-500', '-100')}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className={`font-serif text-${currentTheme.colors.text} mb-1`}>Personalized Affirmation</h3>
            <p className={`text-${currentTheme.colors.text.replace('-900', '-600')} text-sm`}>
              Generate a custom affirmation just for you with AI
            </p>
          </div>
          <motion.button
            onClick={generatePersonalizedAffirmation}
            disabled={isGenerating}
            whileHover={{ scale: isGenerating ? 1 : 1.05 }}
            whileTap={{ scale: isGenerating ? 1 : 0.95 }}
            className={`ml-4 px-4 py-2 bg-${currentTheme.colors.primary} text-white rounded-lg hover:bg-${currentTheme.colors.primary.replace('-500', '-600')} transition-colors disabled:opacity-50 flex items-center space-x-2 touch-target`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Main Affirmation Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={customAffirmation ? 'custom' : currentAffirmation}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.4 }}
          className={`bg-${current.color}-50 rounded-2xl p-6 border border-${current.color}-100 text-center space-y-4`}
        >
          <div className={`inline-flex items-center space-x-2 px-3 py-1 bg-${current.color}-100 text-${current.color}-700 text-xs font-medium rounded-full`}>
            {customAffirmation && <Sparkles className="w-3 h-3" />}
            <span>{displayCategory}</span>
          </div>
          
          <blockquote className={`text-lg font-serif text-${current.color}-800 leading-relaxed`}>
            "{displayText}"
          </blockquote>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-3">
            <motion.button
              onClick={togglePlayback}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isMuted || (isLoadingAudio && !audioUrl) || !multilingualVoice.isAvailable()}
              className={`p-2.5 rounded-full transition-colors touch-target ${
                isMuted || audioError || !multilingualVoice.isAvailable()
                  ? `bg-gray-100 text-gray-400 cursor-not-allowed`
                  : isLoadingAudio
                    ? `bg-${current.color}-100 text-${current.color}-600`
                    : isPlaying
                      ? `bg-${current.color}-200 text-${current.color}-800`
                      : `bg-${current.color}-100 text-${current.color}-700 hover:bg-${current.color}-200`
              }`}
              title={
                !multilingualVoice.isAvailable() ? "Voice synthesis unavailable" :
                audioError ? "Audio unavailable" : 
                isMuted ? "Audio is muted" : 
                isLoadingAudio ? "Generating audio..." :
                isPlaying ? "Pause affirmation" : "Listen to affirmation"
              }
            >
              {isLoadingAudio ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
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
          {customAffirmation ? 'Custom' : `${currentAffirmation + 1} of ${affirmations.length}`}
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
      {!customAffirmation && (
        <div className="flex items-center justify-center space-x-1.5">
          {affirmations.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                }
                setIsPlaying(false);
                setCurrentAffirmation(index);
                if (audioUrl) {
                  URL.revokeObjectURL(audioUrl);
                  setAudioUrl(null);
                }
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
      )}

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