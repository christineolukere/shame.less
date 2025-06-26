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
              <AlertTriangle className="w-5 h-5 text-terracotta-500 flex-shrink-0" />
              <h2 className="modal-title">Important Notice</h2>
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

          {/* Main Content */}
          <div className="modal-body">
            <div className="bg-terracotta-50 rounded-2xl p-4 border border-terracotta-100">
              <h3 className="modal-title text-terracotta-800 mb-3">{t.aboutShameless}</h3>
              <p className="modal-text text-terracotta-700">
                <strong>{t.notReplacementTherapy}</strong>
                {' '}If you are in crisis, please seek licensed mental health support. This app is for 
                emotional grounding, reflection, and peer-inspired healing only.
              </p>
            </div>

            {/* Crisis Resources */}
            <div className="bg-lavender-50 rounded-2xl p-4 border border-lavender-100">
              <div className="flex items-center space-x-2 mb-3">
                <Phone className="w-4 h-4 text-lavender-600 flex-shrink-0" />
                <h3 className="modal-title text-lavender-800">{t.crisisSupport}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-lavender-100 rounded-lg gap-2">
                  <span className="modal-text text-lavender-800 font-medium">Crisis Text Line</span>
                  <span className="modal-text text-lavender-700">{t.textHome}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-lavender-100 rounded-lg gap-2">
                  <span className="modal-text text-lavender-800 font-medium">Suicide Prevention</span>
                  <span className="modal-text text-lavender-700">{t.callText988}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-lavender-100 rounded-lg gap-2">
                  <span className="modal-text text-lavender-800 font-medium">{t.emergency}</span>
                  <span className="modal-text text-lavender-700">{t.call911}</span>
                </div>
              </div>
            </div>

            {/* Affirmation */}
            <div className="bg-sage-50 rounded-2xl p-4 border border-sage-100 text-center">
              <Heart className="w-6 h-6 text-sage-600 mx-auto mb-3 flex-shrink-0" />
              <p className="modal-text text-sage-700">
                {t.disclaimerAffirmation}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="modal-button flex-1 bg-sage-100 text-sage-700 hover:bg-sage-200"
              >
                {t.notNow}
              </motion.button>
              <motion.button
                onClick={onAccept}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="modal-button flex-1 bg-terracotta-500 text-white hover:bg-terracotta-600"
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