import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Wind, Shield, Phone, ArrowLeft } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';

interface SoftLandingProps {
  onClose: () => void;
}

const SoftLanding: React.FC<SoftLandingProps> = ({ onClose }) => {
  const [activeComfort, setActiveComfort] = useState<string | null>(null);
  const { t } = useLocalization();

  const openCrisisLink = (type: 'text' | 'call' | 'emergency') => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    switch (type) {
      case 'text':
        if (isMobile) {
          window.open('sms:741741?body=HOME', '_blank');
        } else {
          alert('Text HOME to 741741 for crisis support');
        }
        break;
      case 'call':
        if (isMobile) {
          window.open('tel:988', '_blank');
        } else {
          alert('Call or text 988 for suicide prevention support');
        }
        break;
      case 'emergency':
        if (isMobile) {
          window.open('tel:911', '_blank');
        } else {
          alert('Call 911 for emergency services');
        }
        break;
    }
  };

  const comfortOptions = [
    {
      id: 'breathe',
      title: t('gentleBreathing') || 'Gentle breathing',
      icon: Wind,
      color: 'sage',
      description: t('breathingDescription') || 'Slow, mindful breathing',
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
            <p className="text-sage-700">Breathe in for 4 counts</p>
            <p className="text-sage-700">Hold for 4 counts</p>
            <p className="text-sage-700">Breathe out for 6 counts</p>
          </div>
          <p className="text-sage-600">Follow the circle and breathe with it</p>
        </div>
      )
    },
    {
      id: 'grounding',
      title: t('grounding') || 'Grounding',
      icon: Shield,
      color: 'terracotta',
      description: t('groundingDescription') || 'Connect with the present moment',
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
      title: t('emergencyAffirmation') || 'Emergency affirmation',
      icon: Heart,
      color: 'lavender',
      description: t('affirmationDescription') || 'Words of comfort and safety',
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <Heart className="w-10 h-10 text-lavender-600 mx-auto" />
            <blockquote className="text-lg font-serif text-lavender-800">
              "You are safe. You are loved. This feeling will pass. You are not alone."
            </blockquote>
          </motion.div>
          <div className="space-y-2">
            <p className="text-lavender-700">Repeat these words to yourself</p>
            <p className="text-lavender-700">Place your hand on your heart</p>
            <p className="text-lavender-700">Feel your own warmth and presence</p>
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
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage-100 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-sage-600" />
            <h2 className="text-lg font-serif text-sage-800">{t('softLanding') || 'Soft Landing'}</h2>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-sage-100 text-sage-700"
          >
            <X className="w-4 h-4" />
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
                  <h3 className="text-lg font-serif text-sage-800">{t('youAreSafeHere') || 'You are safe here'}</h3>
                  <p className="text-sage-600 text-sm">
                    {t('softLandingDescription') || 'Take a moment to ground yourself. Choose what feels most supportive right now.'}
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
                          <Icon className={`w-5 h-5 text-${option.color}-600`} />
                          <div>
                            <h4 className={`font-medium text-${option.color}-800`}>{option.title}</h4>
                            <p className={`text-sm text-${option.color}-600`}>{option.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Crisis Resources */}
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <Phone className="w-4 h-4 text-red-600" />
                    <h4 className="font-medium text-red-800">{t('needMoreSupport') || 'Need more support?'}</h4>
                  </div>
                  <p className="text-red-700 text-sm mb-3">
                    {t('crisisDescription') || 'If you\'re in crisis, please reach out for professional help.'}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <motion.button
                      onClick={() => openCrisisLink('text')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-center"
                    >
                      <Phone className="w-3 h-3 mx-auto mb-1" />
                      <div className="text-xs font-medium">Crisis Text</div>
                      <div className="text-xs">741741</div>
                    </motion.button>
                    <motion.button
                      onClick={() => openCrisisLink('call')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-center"
                    >
                      <Phone className="w-3 h-3 mx-auto mb-1" />
                      <div className="text-xs font-medium">Suicide Prevention</div>
                      <div className="text-xs">988</div>
                    </motion.button>
                    <motion.button
                      onClick={() => openCrisisLink('emergency')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-center"
                    >
                      <Phone className="w-3 h-3 mx-auto mb-1" />
                      <div className="text-xs font-medium">Emergency</div>
                      <div className="text-xs">911</div>
                    </motion.button>
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
                  <p className="text-sage-600 mb-4 text-sm">
                    Take as much time as you need. You're doing great.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-sage-500 text-white rounded-lg font-medium hover:bg-sage-600 transition-colors"
                  >
                    {t('imFeelingBetter') || 'I\'m feeling better'}
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