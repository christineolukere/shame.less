import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Wind, Shield, Headphones, MessageCircle, ArrowLeft } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';

interface SoftLandingProps {
  onClose: () => void;
}

const SoftLanding: React.FC<SoftLandingProps> = ({ onClose }) => {
  const [activeComfort, setActiveComfort] = useState<string | null>(null);
  const { t } = useLocalization();

  const comfortOptions = [
    {
      id: 'breathe',
      title: t('softLanding.breathing.title'),
      icon: Wind,
      color: 'sage',
      description: t('softLanding.breathing.description'),
      content: (
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-sage-100 rounded-full flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-16 h-16 bg-sage-300 rounded-full"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sage-700">Breathe in for 4 counts</p>
            <p className="text-sage-700">Hold for 4 counts</p>
            <p className="text-sage-700">Breathe out for 6 counts</p>
          </div>
          <p className="text-sage-600 text-sm">Follow the circle and breathe with it</p>
        </div>
      )
    },
    {
      id: 'grounding',
      title: t('softLanding.grounding.title'),
      icon: Shield,
      color: 'terracotta',
      description: t('softLanding.grounding.description'),
      content: (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h4 className="font-serif text-terracotta-800 mb-2">Notice around you:</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-terracotta-100 rounded-lg">
              <span className="font-medium text-terracotta-800">5 things you can see</span>
            </div>
            <div className="p-3 bg-terracotta-100 rounded-lg">
              <span className="font-medium text-terracotta-800">4 things you can touch</span>
            </div>
            <div className="p-3 bg-terracotta-100 rounded-lg">
              <span className="font-medium text-terracotta-800">3 things you can hear</span>
            </div>
            <div className="p-3 bg-terracotta-100 rounded-lg">
              <span className="font-medium text-terracotta-800">2 things you can smell</span>
            </div>
            <div className="p-3 bg-terracotta-100 rounded-lg">
              <span className="font-medium text-terracotta-800">1 thing you can taste</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'affirmation',
      title: t('softLanding.affirmation.title'),
      icon: Heart,
      color: 'lavender',
      description: t('softLanding.affirmation.description'),
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <Heart className="w-12 h-12 text-lavender-600 mx-auto" />
            <blockquote className="text-xl font-serif text-lavender-800 leading-relaxed">
              "You are safe. You are loved. This feeling will pass. You are not alone."
            </blockquote>
          </motion.div>
          <div className="space-y-2">
            <p className="text-lavender-700 text-sm">Repeat these words to yourself</p>
            <p className="text-lavender-700 text-sm">Place your hand on your heart</p>
            <p className="text-lavender-700 text-sm">Feel your own warmth and presence</p>
          </div>
        </div>
      )
    },
    {
      id: 'sounds',
      title: t('softLanding.sounds.title'),
      icon: Headphones,
      color: 'cream',
      description: t('softLanding.sounds.description'),
      content: (
        <div className="text-center space-y-4">
          <Headphones className="w-12 h-12 text-cream-600 mx-auto" />
          <div className="space-y-3">
            <button className="w-full p-3 bg-cream-100 rounded-lg text-cream-800 hover:bg-cream-200 transition-colors">
              🌊 Ocean Waves
            </button>
            <button className="w-full p-3 bg-cream-100 rounded-lg text-cream-800 hover:bg-cream-200 transition-colors">
              🌧️ Gentle Rain
            </button>
            <button className="w-full p-3 bg-cream-100 rounded-lg text-cream-800 hover:bg-cream-200 transition-colors">
              🎵 Soft Piano
            </button>
            <button className="w-full p-3 bg-cream-100 rounded-lg text-cream-800 hover:bg-cream-200 transition-colors">
              🌿 Forest Sounds
            </button>
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage-100">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-sage-600" />
            <h2 className="text-xl font-serif text-sage-800">{t('softLanding.title')}</h2>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-sage-100 text-sage-700"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6">
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
                  <h3 className="text-lg font-serif text-sage-800">{t('softLanding.youAreSafe')}</h3>
                  <p className="text-sage-600 text-sm">
                    {t('softLanding.description')}
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
                          <Icon className={`w-6 h-6 text-${option.color}-600`} />
                          <div>
                            <h4 className={`font-medium text-${option.color}-800`}>{option.title}</h4>
                            <p className={`text-${option.color}-600 text-sm`}>{option.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Crisis Resources */}
                <div className="bg-lavender-50 rounded-xl p-4 border border-lavender-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-lavender-600" />
                    <h4 className="font-medium text-lavender-800">{t('softLanding.needMoreSupport')}</h4>
                  </div>
                  <p className="text-lavender-700 text-sm mb-3">
                    {t('softLanding.crisisDescription')}
                  </p>
                  <div className="space-y-2">
                    <button className="w-full p-2 bg-lavender-100 text-lavender-800 rounded-lg text-sm hover:bg-lavender-200 transition-colors">
                      {t('softLanding.crisisTextLine')}
                    </button>
                    <button className="w-full p-2 bg-lavender-100 text-lavender-800 rounded-lg text-sm hover:bg-lavender-200 transition-colors">
                      {t('softLanding.suicidePrevention')}
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
                    onClick={() => setActiveComfort(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-sage-100 text-sage-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>
                  <h3 className="text-lg font-serif text-sage-800">
                    {comfortOptions.find(o => o.id === activeComfort)?.title}
                  </h3>
                </div>

                {comfortOptions.find(o => o.id === activeComfort)?.content}

                <div className="text-center">
                  <p className="text-sage-600 text-sm mb-4">
                    Take as much time as you need. You're doing great.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-sage-500 text-white rounded-lg font-medium hover:bg-sage-600 transition-colors"
                  >
                    {t('softLanding.feelingBetter')}
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