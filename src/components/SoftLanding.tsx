import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Wind, Shield, Headphones, MessageCircle, ArrowLeft, Play, Pause, Volume2, AlertCircle } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';

interface SoftLandingProps {
  onClose: () => void;
}

interface SoundOption {
  id: string;
  name: string;
  description: string;
  color: string;
}

const SoftLanding: React.FC<SoftLandingProps> = ({ onClose }) => {
  const [activeComfort, setActiveComfort] = useState<string | null>(null);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.3);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { translations: t } = useLocalization();

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const soundOptions: SoundOption[] = [
    {
      id: 'ocean',
      name: '🌊 Ocean Waves',
      description: 'Gentle ocean waves for deep relaxation',
      color: 'blue'
    },
    {
      id: 'rain',
      name: '🌧️ Gentle Rain',
      description: 'Soft rainfall for peaceful moments',
      color: 'gray'
    },
    {
      id: 'piano',
      name: '🎵 Soft Piano',
      description: 'Gentle piano melodies for comfort',
      color: 'purple'
    },
    {
      id: 'forest',
      name: '🌿 Forest Sounds',
      description: 'Birds and nature for grounding',
      color: 'green'
    }
  ];

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setPlayingSound(null);
    setAudioError(null);
  };

  // Generate clean audio data URLs for different sounds
  const generateAudioDataUrl = (soundType: string): string => {
    const sampleRate = 44100;
    const duration = 10; // 10 seconds loop
    const samples = sampleRate * duration;
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * 2, true);
    
    // Generate audio samples
    let offset = 44;
    for (let i = 0; i < samples; i++) {
      let sample = 0;
      const t = i / sampleRate;
      
      switch (soundType) {
        case 'ocean':
          // Ocean waves: Low frequency sine with noise
          sample = Math.sin(2 * Math.PI * 0.5 * t) * 0.3 + 
                  (Math.random() - 0.5) * 0.1;
          break;
        case 'rain':
          // Rain: White noise filtered
          sample = (Math.random() - 0.5) * 0.2;
          break;
        case 'piano':
          // Piano: Clean sine wave at A4 (440Hz)
          sample = Math.sin(2 * Math.PI * 440 * t) * 0.2;
          break;
        case 'forest':
          // Forest: Multiple sine waves for bird sounds
          sample = Math.sin(2 * Math.PI * 800 * t) * 0.1 +
                  Math.sin(2 * Math.PI * 1200 * t) * 0.05;
          break;
        default:
          sample = 0;
      }
      
      // Apply gentle envelope to prevent clicks
      const envelope = Math.min(1, Math.min(t * 10, (duration - t) * 10));
      sample *= envelope;
      
      // Convert to 16-bit PCM
      const pcmSample = Math.max(-32768, Math.min(32767, sample * 32767));
      view.setInt16(offset, pcmSample, true);
      offset += 2;
    }
    
    // Create blob and data URL
    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  const playSound = async (soundId: string) => {
    setAudioError(null);

    try {
      if (playingSound === soundId) {
        // Stop current sound
        stopAllAudio();
        return;
      }

      // Stop any existing audio
      stopAllAudio();

      // Create new audio element
      const audio = new Audio();
      audioRef.current = audio;

      // Set up audio properties
      audio.loop = true;
      audio.volume = volume;
      audio.preload = 'auto';

      // Generate clean audio data
      const audioDataUrl = generateAudioDataUrl(soundId);
      audio.src = audioDataUrl;

      // Set up event listeners
      audio.onloadeddata = () => {
        audio.play().then(() => {
          setPlayingSound(soundId);
        }).catch((error) => {
          console.error('Playback failed:', error);
          setAudioError('Playback failed. Please try again.');
        });
      };

      audio.onerror = () => {
        setAudioError('Audio failed to load. Please try a different sound.');
        setPlayingSound(null);
      };

      audio.onended = () => {
        setPlayingSound(null);
      };

    } catch (error) {
      console.error('Audio creation failed:', error);
      setAudioError('Your gentle audio didn\'t load. Try again or choose a different tone.');
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
      title: t.gentleBreathing || 'Gentle breathing',
      icon: Wind,
      color: 'sage',
      description: t.breathingDescription || 'Slow, mindful breathing',
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
      title: t.grounding || 'Grounding',
      icon: Shield,
      color: 'terracotta',
      description: t.groundingDescription || 'Connect with the present moment',
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
      title: t.emergencyAffirmation || 'Emergency affirmation',
      icon: Heart,
      color: 'lavender',
      description: t.affirmationDescription || 'Words of comfort and safety',
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
      title: t.soothingSounds || 'Soothing sounds',
      icon: Headphones,
      color: 'cream',
      description: t.soundsDescription || 'Calming audio to center yourself',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Headphones className="w-10 h-10 text-cream-600 mx-auto mb-4" />
            <p className="modal-text text-cream-700 mb-4">
              Choose a sound to help you feel centered and calm
            </p>
          </div>

          {/* Audio Error Message */}
          {audioError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 rounded-lg p-3 border border-red-200"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="modal-text text-red-700">{audioError}</p>
              </div>
            </motion.div>
          )}

          {/* Volume Control */}
          {playingSound && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-cream-100 rounded-lg p-4"
            >
              <div className="flex items-center space-x-3">
                <Volume2 className="w-4 h-4 text-cream-600 flex-shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-cream-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-cream-600 min-w-[3rem] text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </motion.div>
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
                    ? 'bg-cream-200 border-2 border-cream-400 shadow-md'
                    : 'bg-cream-100 border border-cream-200 hover:bg-cream-150 hover:border-cream-300'
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="modal-text text-cream-600">
                Playing: {soundOptions.find(s => s.id === playingSound)?.name}
              </p>
              <p className="modal-text text-cream-500 text-xs mt-1">
                Click the same sound again to stop, or choose a different one
              </p>
            </motion.div>
          )}

          {/* Audio Instructions */}
          <div className="bg-cream-50 rounded-lg p-3 border border-cream-200">
            <p className="modal-text text-cream-600 text-xs text-center">
              💡 These are clean, generated audio tones designed for relaxation. 
              Adjust volume to your comfort level.
            </p>
          </div>
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
            <h2 className="modal-title">{t.softLanding || 'Soft Landing'}</h2>
          </div>
          <motion.button
            onClick={() => {
              stopAllAudio();
              onClose();
            }}
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
                  <h3 className="modal-title">{t.youAreSafeHere || 'You are safe here'}</h3>
                  <p className="modal-text text-sage-600">
                    {t.softLandingDescription || 'Take a moment to ground yourself. Choose what feels most supportive right now.'}
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
                    <h4 className="modal-text font-medium text-lavender-800">{t.needMoreSupport || 'Need more support?'}</h4>
                  </div>
                  <p className="modal-text text-lavender-700 mb-3">
                    {t.crisisDescription || 'If you\'re in crisis, please reach out for professional help.'}
                  </p>
                  <div className="space-y-2">
                    <button className="modal-button w-full bg-lavender-100 text-lavender-800 hover:bg-lavender-200">
                      {t.crisisTextLine || 'Crisis Text Line: 741741'}
                    </button>
                    <button className="modal-button w-full bg-lavender-100 text-lavender-800 hover:bg-lavender-200">
                      {t.suicidePrevention || 'Suicide Prevention: 988'}
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
                      stopAllAudio();
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
                    onClick={() => {
                      stopAllAudio();
                      onClose();
                    }}
                    className="modal-button bg-sage-500 text-white hover:bg-sage-600"
                  >
                    {t.imFeelingBetter || 'I\'m feeling better'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Custom CSS for slider styling */}
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
    </motion.div>
  );
};

export default SoftLanding;