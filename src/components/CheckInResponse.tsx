import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, BookmarkCheck, ArrowRight, Volume2, VolumeX, Play, Pause, Loader2 } from 'lucide-react';
import { CheckInResponse } from '../lib/checkInResponses';
import { multilingualVoice } from '../lib/multilingualVoice';
import { useLocalization } from '../contexts/LocalizationContext';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState(false);
  
  const { currentLanguage } = useLocalization();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobUrlRef = useRef<string | null>(null);

  // Helper function to clear and revoke audio
  const clearAndRevokeAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioBlobUrlRef.current) {
      URL.revokeObjectURL(audioBlobUrlRef.current);
      audioBlobUrlRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      clearAndRevokeAudio();
    };
  }, []);

  const handleSaveFavorite = () => {
    if (onSaveFavorite) {
      onSaveFavorite(response);
      setIsSaved(true);
    }
  };

  const generateAudio = async (text: string) => {
    if (isMuted || !multilingualVoice.isAvailable()) return;

    setIsLoadingAudio(true);
    setAudioError(false);

    try {
      const ttsResponse = await multilingualVoice.synthesizeSpeech({
        text,
        language: currentLanguage,
        settings: {
          stability: 0.7,
          similarity_boost: 0.8,
          style: 0.1,
          use_speaker_boost: true
        }
      });

      if (ttsResponse.success && ttsResponse.audioUrl) {
        // Clean up previous audio URL
        if (audioBlobUrlRef.current) {
          URL.revokeObjectURL(audioBlobUrlRef.current);
        }
        
        audioBlobUrlRef.current = ttsResponse.audioUrl;
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

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // Generate audio if we don't have it
    if (!audioBlobUrlRef.current) {
      await generateAudio(response.affirmation);
      // Don't return here - let the function continue to attempt playback
    }

    // Play audio
    if (audioBlobUrlRef.current) {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      audioRef.current = new Audio(audioBlobUrlRef.current);
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
          {/* Audio Controls */}
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setIsMuted(!isMuted)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-colors ${
                isMuted ? 'bg-red-100 text-red-600' : 'bg-white/80 text-sage-700 hover:bg-white'
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </motion.button>

            <motion.button
              onClick={togglePlayback}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isMuted || !multilingualVoice.isAvailable()}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isMuted || !multilingualVoice.isAvailable()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white/80 text-sage-700 hover:bg-white'
              }`}
              title={
                !multilingualVoice.isAvailable() ? "Voice unavailable" :
                isMuted ? "Audio is muted" :
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
              <span>{isLoadingAudio ? 'Loading...' : isPlaying ? 'Pause' : 'Listen'}</span>
            </motion.button>
          </div>

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