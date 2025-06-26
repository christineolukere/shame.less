import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Heart, Phone } from 'lucide-react'
import { useLocalization } from '../../contexts/LocalizationContext'

interface DisclaimerModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose, onAccept }) => {
  const { translations: t } = useLocalization()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 safe-top safe-bottom"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-terracotta-500" />
              <h2 className="text-lg sm:text-xl font-serif text-sage-800">Important Notice</h2>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-sage-100 text-sage-700 touch-target"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>

          {/* Main Content */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-terracotta-50 rounded-2xl p-4 sm:p-6 border border-terracotta-100">
              <h3 className="font-serif text-terracotta-800 mb-3 text-sm sm:text-base">{t.aboutShameless}</h3>
              <p className="text-terracotta-700 text-xs sm:text-sm leading-relaxed">
                <strong>{t.notReplacementTherapy}</strong>
                {' '}If you are in crisis, please seek licensed mental health support. This app is for 
                emotional grounding, reflection, and peer-inspired healing only.
              </p>
            </div>

            {/* Crisis Resources */}
            <div className="bg-lavender-50 rounded-2xl p-4 sm:p-6 border border-lavender-100">
              <div className="flex items-center space-x-2 mb-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-lavender-600" />
                <h3 className="font-serif text-lavender-800 text-sm sm:text-base">{t.crisisSupport}</h3>
              </div>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center p-2 sm:p-3 bg-lavender-100 rounded-lg">
                  <span className="text-lavender-800 font-medium">Crisis Text Line</span>
                  <span className="text-lavender-700">{t.textHome}</span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-lavender-100 rounded-lg">
                  <span className="text-lavender-800 font-medium">Suicide Prevention</span>
                  <span className="text-lavender-700">{t.callText988}</span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-lavender-100 rounded-lg">
                  <span className="text-lavender-800 font-medium">{t.emergency}</span>
                  <span className="text-lavender-700">{t.call911}</span>
                </div>
              </div>
            </div>

            {/* Affirmation */}
            <div className="bg-sage-50 rounded-2xl p-4 sm:p-6 border border-sage-100 text-center">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-sage-600 mx-auto mb-3" />
              <p className="text-sage-700 text-xs sm:text-sm leading-relaxed">
                {t.disclaimerAffirmation}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 sm:py-3 bg-sage-100 text-sage-700 rounded-lg font-medium hover:bg-sage-200 transition-colors touch-target text-sm sm:text-base"
              >
                {t.notNow}
              </motion.button>
              <motion.button
                onClick={onAccept}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 sm:py-3 bg-terracotta-500 text-white rounded-lg font-medium hover:bg-terracotta-600 transition-colors touch-target text-sm sm:text-base"
              >
                {t.iUnderstand}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DisclaimerModal