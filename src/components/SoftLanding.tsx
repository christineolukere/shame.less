import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Wind, Shield, Headphones, MessageCircle, ArrowLeft, Play, Pause, Volume2 } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';

interface SoftLandingProps {
  onClose: () => void;
}

const SoftLanding: React.FC<SoftLandingProps> = ({ onClose }) => {
  const [activeComfort, setActiveComfort] = useState<string | null>(null);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { translations: t } = useLocalization();

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const soundOptions = [
    {
      id: 'ocean',
      name: '🌊 Ocean Waves',
      description: 'Gentle ocean waves for deep relaxation',
      // Using a royalty-free ocean waves sound from a reliable source
      url: 'https://www.soundjay.com/misc/sounds/ocean-wave-1.mp3',
      fallbackUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
    },
    {
      id: 'rain',
      name: '🌧️ Gentle Rain',
      description: 'Soft rainfall for peaceful moments',
      url: 'https://www.soundjay.com/misc/sounds/rain-01.mp3',
      fallbackUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
    },
    {
      id: 'piano',
      name: '🎵 Soft Piano',
      description: 'Gentle piano melodies for comfort',
      url: 'https://www.soundjay.com/misc/sounds/piano-melody.mp3',
      fallbackUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
    },
    {
      id: 'forest',
      name: '🌿 Forest Sounds',
      description: 'Birds and nature for grounding',
      url: 'https://www.soundjay.com/misc/sounds/forest-birds.mp3',
      fallbackUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
    }
  ];

  const playSound = async (soundId: string) => {
    const sound = soundOptions.find(s => s.id === soundId);
    if (!sound) return;

    try {
      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (playingSound === soundId) {
        // If clicking the same sound, stop it
        setPlayingSound(null);
        return;
      }

      // Create new audio element
      const audio = new Audio();
      
      // Try primary URL first, fallback to generated tone if needed
      audio.src = sound.url;
      audio.volume = volume;
      audio.loop = true;
      
      // Handle audio loading errors
      audio.onerror = () => {
        console.log('Primary audio source failed, using fallback');
        // Create a simple tone as fallback
        createFallbackAudio(soundId);
      };

      audio.onloadstart = () => {
        setPlayingSound(soundId);
        audioRef.current = audio;
      };

      audio.onended = () => {
        setPlayingSound(null);
      };

      await audio.play();
    } catch (error) {
      console.log('Audio playback failed, using fallback tone');
      createFallbackAudio(soundId);
    }
  };

  const createFallbackAudio = (soundId: string) => {
    // Create a simple audio context for fallback sounds
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different sounds
      const frequencies: { [key: string]: number } = {
        ocean: 80,
        rain: 200,
        piano: 440,
        forest: 300
      };

      oscillator.frequency.setValueAtTime(frequencies[soundId] || 200, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume * 0.1, audioContext.currentTime); // Very quiet
      
      oscillator.start();
      setPlayingSound(soundId);

      // Stop after 30 seconds or when user stops
      setTimeout(() => {
        if (playingSound === soundId) {
          oscillator.stop();
          setPlayingSound(null);
        }
      }, 30000);

    } catch (error) {
      console.error('Fallback audio creation failed:', error);
      setPlayingSound(null);
    }
  };

  const adjustVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const comfortOptions = [
    {
      id: 'breathe',
      title: t.gentleBreathing,
      icon: Wind,
      color: 'sage',
      description: t.breathingDescription,
      content: (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-sage-100 rounded-full flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-12 h-12 bg-sage-300 rounded-full"
            />
          </div>
          <div className="space-y-2">
            <p className="modal-text text-sage-700">Breathe in for 4 counts</p>
            <p className="modal-text text-sage-700">Hold for 4 counts</p>
            <p className="modal-text text-sage-700">Breathe out for 6 counts</p>
          </div>
          <p className="modal-text text-sage-600">Follow the circle and breathe with it</p>
        </div>
      )
    },
    {
      id: 'grounding',
      title: t.grounding,
      icon: Shield,
      color: 'terracotta',
      description: t.groundingDescription,
      content: (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h4 className="modal-title text-terracotta-800 mb-2">Notice around you:</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-terracotta-100 rounded-lg">
              <span className="modal-text font-medium text-terracotta-800">5 things you can see</span>
            </div>
            <div className="p-3 bg-terracotta-100 rounded-lg">
              <span className="modal-text font-medium text-terracotta-800">4 things you can touch</span>
            </div>
            <div className="p-3 bg-terracotta-100 rounded-lg">
              <span className="modal-text font-medium text-terracotta-800">3 things you can hear</span>
            </div>
            <div className="p-3 bg-terracotta-100 rounded-lg">
              <span className="modal-text font-medium text-terracotta-800">2 things you can smell</span>
            </div>
            <div className="p-3 bg-terracotta-100 rounded-lg">
              <span className="modal-text font-medium text-terracotta-800">1 thing you can taste</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'affirmation',
      title: t.emergencyAffirmation,
      icon: Heart,
      color: 'lavender',
      description: t.affirmationDescription,
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <Heart className="w-10 h-10 text-lavender-600 mx-auto" />
            <blockquote className="modal-title text-lavender-800">
              "You are safe. You are loved. This feeling will pass. You are not alone."
            </blockquote>
          </motion.div>
          <div className="space-y-2">
            <p className="modal-text text-lavender-700">Repeat these words to yourself</p>
            <p className="modal-text text-lavender-700">Place your hand on your heart</p>
            <p className="modal-text text-lavender-700">Feel your own warmth and presence</p>
          </div>
        </div>
      )
    },
    {
      id: 'sounds',
      title: t.soothingSounds,
      icon: Headphones,
      color: 'cream',
      description: t.soundsDescription,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Headphones className="w-10 h-10 text-cream-600 mx-auto mb-4" />
            <p className="modal-text text-cream-700 mb-4">
              Choose a sound to help you feel centered and calm
            </p>
          </div>

          {/* Volume Control */}
          {playingSound && (
            <div className="bg-cream-100 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-4 h-4 text-cream-600" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-cream-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-cream-600">{Math.round(volume * 100)}%</span>
              </div>
            </div>
          )}

          {/* Sound Options */}
          <div className="space-y-3">
            {soundOptions.map((sound) => (
              <motion.button
                key={sound.id}
                onClick={() => playSound(sound.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 text-left rounded-xl transition-all ${
                  playingSound === sound.id
                    ? 'bg-cream-200 border-2 border-cream-400'
                    : 'bg-cream-100 border border-cream-200 hover:bg-cream-150'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="modal-text font-medium text-cream-800">
                        {sound.name}
                      </span>
                      {playingSound === sound.id && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 bg-cream-600 rounded-full"
                        />
                      )}
                    </div>
                    <p className="modal-text text-cream-600 text-xs">
                      {sound.description}
                    </p>
                  </div>
                  <div className="ml-3">
                    {playingSound === sound.id ? (
                      <Pause className="w-5 h-5 text-cream-600" />
                    ) : (
                      <Play className="w-5 h-5 text-cream-600" />
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Audio Status */}
          {playingSound && (
            <div className="text-center">
              <p className="modal-text text-cream-600">
                Playing: {soundOptions.find(s => s.id === playingSound)?.name}
              </p>
              <p className="modal-text text-cream-500 text-xs mt-1">
                Click the same sound again to stop, or choose a different one
              </p>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-container"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="modal-content"
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-sage-600 flex-shrink-0" />
            <h2 className="modal-title">{t.softLanding}</h2>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-sage-100 text-sage-700 touch-target flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="modal-body">
          <AnimatePresence mode="wait">
            {!activeComfort ? (
              <motion.div
                key="options"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="modal-title">{t.youAreSafeHere}</h3>
                  <p className="modal-text text-sage-600">
                    {t.softLandingDescription}
                  </p>
                </div>

                <div className="space-y-3">
                  {comfortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => setActiveComfort(option.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-4 rounded-xl text-left transition-all bg-${option.color}-50 border border-${option.color}-100 hover:bg-${option.color}-100`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 text-${option.color}-600 flex-shrink-0`} />
                          <div>
                            <h4 className={`modal-text font-medium text-${option.color}-800`}>{option.title}</h4>
                            <p className={`modal-text text-${option.color}-600`}>{option.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Crisis Resources */}
                <div className="bg-lavender-50 rounded-xl p-4 border border-lavender-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-lavender-600 flex-shrink-0" />
                    <h4 className="modal-text font-medium text-lavender-800">{t.needMoreSupport}</h4>
                  </div>
                  <p className="modal-text text-lavender-700 mb-3">
                    {t.crisisDescription}
                  </p>
                  <div className="space-y-2">
                    <button className="modal-button w-full bg-lavender-100 text-lavender-800 hover:bg-lavender-200">
                      {t.crisisTextLine}
                    </button>
                    <button className="modal-button w-full bg-lavender-100 text-lavender-800 hover:bg-lavender-200">
                      {t.suicidePrevention}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="comfort-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3">
                  <motion.button
                    onClick={() => {
                      setActiveComfort(null);
                      // Stop any playing audio when going back
                      if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current = null;
                      }
                      setPlayingSound(null);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-sage-100 text-sage-700 touch-target flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>
                  <h3 className="modal-title">
                    {comfortOptions.find(o => o.id === activeComfort)?.title}
                  </h3>
                </div>

                {comfortOptions.find(o => o.id === activeComfort)?.content}

                <div className="text-center">
                  <p className="modal-text text-sage-600 mb-4">
                    Take as much time as you need. You're doing great.
                  </p>
                  <button
                    onClick={onClose}
                    className="modal-button bg-sage-500 text-white hover:bg-sage-600"
                  >
                    {t.imFeelingBetter}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SoftLanding;