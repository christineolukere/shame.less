import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, RefreshCw, Heart, AlertCircle } from 'lucide-react';
import { pixabaySoundsAPI, ProcessedSound } from '../../lib/pixabaySoundsApi';
import { audioEngine } from '../../lib/audioEngine';

interface EmotionAudioPlayerProps {
  emotion?: string;
  color?: string;
  className?: string;
  autoLoad?: boolean;
}

const EmotionAudioPlayer: React.FC<EmotionAudioPlayerProps> = ({
  emotion,
  color,
  className = '',
  autoLoad = true
}) => {
  const [sounds, setSounds] = useState<ProcessedSound[]>([]);
  const [currentSound, setCurrentSound] = useState<ProcessedSound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoLoad) {
      loadSounds();
    }
  }, [emotion, color, autoLoad]);

  const loadSounds = async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await pixabaySoundsAPI.searchEmotionAlignedSounds({
        emotion,
        color
      });
      
      setSounds(results);
      if (results.length > 0 && !currentSound) {
        setCurrentSound(results[0]);
      }
    } catch (err: any) {
      setError('Unable to load calming sounds. Please try again.');
      console.error('Sound loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const tryNewSound = async () => {
    setLoading(true);
    try {
      const newSounds = await pixabaySoundsAPI.getRandomizedSounds(emotion);
      setSounds(newSounds);
      if (newSounds.length > 0) {
        const randomSound = newSounds[Math.floor(Math.random() * newSounds.length)];
        setCurrentSound(randomSound);
        // Auto-play the new sound
        playSound(randomSound);
      }
    } catch (err) {
      console.error('Error getting new sound:', err);
    } finally {
      setLoading(false);
    }
  };

  const playSound = async (sound: ProcessedSound) => {
    try {
      // Stop any currently playing audio
      stopCurrentAudio();

      if (sound.url.startsWith('generated://')) {
        // Use our audio engine for generated sounds
        const soundType = sound.url.replace('generated://', '') as 'ocean' | 'rain' | 'piano' | 'forest';
        let buffer: AudioBuffer | null = null;

        if (soundType === 'piano') {
          buffer = audioEngine.generateCleanTone(440, 10, 'sine');
        } else {
          buffer = audioEngine.generateNaturalSound(soundType, 10);
        }

        if (buffer) {
          await audioEngine.playBuffer(buffer, true);
          setIsPlaying(true);
        }
      } else {
        // Use HTML5 audio for Pixabay sounds
        if (audioRef.current) {
          audioRef.current.src = sound.previewUrl || sound.url;
          audioRef.current.volume = isMuted ? 0 : volume;
          audioRef.current.loop = true;
          await audioRef.current.play();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
      setError('Audio playback failed. Please try a different sound.');
    }
  };

  const stopCurrentAudio = () => {
    // Stop audio engine
    audioEngine.stopCurrent();
    
    // Stop HTML5 audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopCurrentAudio();
    } else if (currentSound) {
      playSound(currentSound);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    audioEngine.setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    audioEngine.setVolume(newMuted ? 0 : volume);
    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : volume;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCurrentAudio();
    };
  }, []);

  return (
    <div className={`bg-gradient-to-r from-cream-50 to-sage-50 rounded-2xl p-6 border border-cream-200 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Heart className="w-5 h-5 text-sage-600" />
        <h3 className="font-serif text-sage-800">
          Gentle Audio for {emotion ? `${emotion} moments` : 'your mood'}
        </h3>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-50 rounded-lg p-3 border border-red-200 mb-4"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Current Sound Display */}
      {currentSound && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 rounded-xl p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-medium text-sage-800 mb-1">{currentSound.title}</h4>
              <div className="flex items-center space-x-3 text-sm text-sage-600">
                <span>by {currentSound.author}</span>
                {currentSound.duration > 0 && (
                  <span>{formatDuration(currentSound.duration)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={togglePlayback}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="w-12 h-12 bg-sage-500 text-white rounded-full flex items-center justify-center hover:bg-sage-600 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </motion.button>

            {/* Volume Control */}
            <div className="flex items-center space-x-2 flex-1">
              <motion.button
                onClick={toggleMute}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-sage-100 text-sage-600 hover:bg-sage-200 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </motion.button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-sage-200 rounded-lg appearance-none cursor-pointer slider"
              />
              
              <span className="text-xs text-sage-600 min-w-[3rem] text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Try New Sound Button */}
            <motion.button
              onClick={tryNewSound}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="p-2 rounded-lg bg-terracotta-100 text-terracotta-600 hover:bg-terracotta-200 transition-colors disabled:opacity-50"
              title="Try a new sound"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Sound Selection */}
      {sounds.length > 1 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-sage-700 mb-2">Choose a different sound:</h4>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
            {sounds.slice(0, 5).map((sound) => (
              <motion.button
                key={sound.id}
                onClick={() => {
                  setCurrentSound(sound);
                  if (isPlaying) {
                    playSound(sound);
                  }
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`p-3 text-left rounded-lg transition-colors ${
                  currentSound?.id === sound.id
                    ? 'bg-sage-100 border border-sage-300'
                    : 'bg-white/40 hover:bg-white/60 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sage-800 truncate">{sound.title}</p>
                    <p className="text-xs text-sage-600 truncate">by {sound.author}</p>
                  </div>
                  {sound.duration > 0 && (
                    <span className="text-xs text-sage-500 ml-2">
                      {formatDuration(sound.duration)}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Load Sounds Button (if not auto-loaded) */}
      {!autoLoad && sounds.length === 0 && (
        <motion.button
          onClick={loadSounds}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="w-full py-3 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading sounds...' : 'Load calming sounds'}
        </motion.button>
      )}

      {/* Audio Element for Pixabay sounds */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setError('Audio playback failed. Please try a different sound.');
          setIsPlaying(false);
        }}
        style={{ display: 'none' }}
      />

      {/* Custom CSS for slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #5f7a5f;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #5f7a5f;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default EmotionAudioPlayer;