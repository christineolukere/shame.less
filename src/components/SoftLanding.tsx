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
  frequency: number;
  waveType: OscillatorType;
  color: string;
}

const SoftLanding: React.FC<SoftLandingProps> = ({ onClose }) => {
  const [activeComfort, setActiveComfort] = useState<string | null>(null);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
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
      frequency: 80,
      waveType: 'sine',
      color: 'blue'
    },
    {
      id: 'rain',
      name: '🌧️ Gentle Rain',
      description: 'Soft rainfall for peaceful moments',
      frequency: 200,
      waveType: 'triangle',
      color: 'gray'
    },
    {
      id: 'piano',
      name: '🎵 Soft Piano',
      description: 'Gentle piano melodies for comfort',
      frequency: 440,
      waveType: 'sine',
      color: 'purple'
    },
    {
      id: 'forest',
      name: '🌿 Forest Sounds',
      description: 'Birds and nature for grounding',
      frequency: 300,
      waveType: 'sawtooth',
      color: 'green'
    }
  ];

  const stopAllAudio = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch (error) {
      console.log('Audio cleanup completed');
    }
    setPlayingSound(null);
    setAudioError(null);
  };

  const createAudioContext = async (): Promise<AudioContext | null> => {
    try {
      // Use modern AudioContext or fallback to webkit
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      
      if (!AudioContextClass) {
        throw new Error('Web Audio API not supported');
      }

      const context = new AudioContextClass({
        sampleRate: 44100,
        latencyHint: 'interactive'
      });

      // Resume context if suspended (required for mobile)
      if (context.state === 'suspended') {
        await context.resume();
      }

      return context;
    } catch (error) {
      console.error('Failed to create audio context:', error);
      return null;
    }
  };

  const createSootingTone = async (soundOption: SoundOption): Promise<boolean> => {
    try {
      // Stop any existing audio
      stopAllAudio();

      // Create new audio context
      const audioContext = await createAudioContext();
      if (!audioContext) {
        throw new Error('Could not create audio context');
      }

      audioContextRef.current = audioContext;

      // Create oscillator for base tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Configure oscillator
      oscillator.type = soundOption.waveType;
      oscillator.frequency.setValueAtTime(soundOption.frequency, audioContext.currentTime);

      // Add subtle frequency modulation for more natural sound
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.5, audioContext.currentTime); // Slow modulation
      lfoGain.gain.setValueAtTime(2, audioContext.currentTime); // Subtle depth

      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);

      // Configure gain with fade-in to prevent clicks
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.1); // Gentle fade-in

      // Connect audio graph
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Store references
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      // Start oscillators
      lfo.start();
      oscillator.start();

      // Handle oscillator end
      oscillator.onended = () => {
        setPlayingSound(null);
      };

      return true;
    } catch (error) {
      console.error('Failed to create audio:', error);
      return false;
    }
  };

  const playSound = async (soundId: string) => {
    const soundOption = soundOptions.find(s => s.id === soundId);
    if (!soundOption) return;

    setAudioError(null);

    try {
      if (playingSound === soundId) {
        // Stop current sound
        stopAllAudio();
        return;
      }

      // Create and play new sound
      const success = await createSootingTone(soundOption);
      
      if (success) {
        setPlayingSound(soundId);
      } else {
        throw new Error('Failed to create audio tone');
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
      setAudioError('Your gentle audio didn\'t load. Try again or choose a different tone.');
      setPlayingSound(null);
    }
  };

  const adjustVolume = (newVolume: number) => {
    setVolume(newVolume);
    
    if (gainNodeRef.current && audioContextRef.current) {
      try {
        // Smooth volume transition to prevent clicks
        gainNodeRef.current.gain.cancelScheduledValues(audioContextRef.current.currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(
          newVolume * 0.3, 
          audioContextRef.current.currentTime + 0.05
        );
      } catch (error) {
        console.log('Volume adjustment completed');
      }
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
                  step="0.1"
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
              💡 These are gentle, synthesized tones designed for relaxation. 
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