import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Heart, Phone } from 'lucide-react'

interface SafetyModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  flaggedWords: string[]
}

const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose, onContinue, flaggedWords }) => {
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
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <h2 className="modal-title">We're here for you</h2>
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
            <div className="bg-red-50 rounded-2xl p-4 border border-red-100 mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <Heart className="w-5 h-5 text-red-600 flex-shrink-0" />
                <h3 className="modal-title text-red-800">Your safety matters</h3>
              </div>
              <p className="modal-text text-red-700">
                We noticed your journal entry contains words that suggest you might be going through 
                a difficult time. You don't have to face this alone.
              </p>
            </div>

            {/* Crisis Resources */}
            <div className="bg-lavender-50 rounded-2xl p-4 border border-lavender-100 mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <Phone className="w-4 h-4 text-lavender-600 flex-shrink-0" />
                <h3 className="modal-title text-lavender-800">Immediate support</h3>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-lavender-100 rounded-lg gap-2">
                  <span className="modal-text text-lavender-800 font-medium">Crisis Text Line</span>
                  <span className="modal-text text-lavender-700">Text HOME to 741741</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-lavender-100 rounded-lg gap-2">
                  <span className="modal-text text-lavender-800 font-medium">Suicide Prevention</span>
                  <span className="modal-text text-lavender-700">Call or text 988</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-lavender-100 rounded-lg gap-2">
                  <span className="modal-text text-lavender-800 font-medium">Emergency</span>
                  <span className="modal-text text-lavender-700">Call 911</span>
                </div>
              </div>
            </div>

            {/* Gentle message */}
            <div className="bg-sage-50 rounded-2xl p-4 border border-sage-100 text-center mb-4">
              <p className="modal-text text-sage-700">
                Your feelings are valid, and reaching out for help is a sign of strength. 
                This journal is here to support you, but professional help can provide the care you deserve.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={onContinue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="modal-button flex-1 bg-sage-500 text-white hover:bg-sage-600"
              >
                Continue with journal entry
              </motion.button>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="modal-button flex-1 bg-sage-100 text-sage-700 hover:bg-sage-200"
              >
                Edit my entry
              </motion.button>
            </div>

            {/* Disclaimer */}
            <div className="text-center text-xs text-sage-500 mt-4">
              This app is not a replacement for professional mental health care. 
              If you're in immediate danger, please contact emergency services.
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SafetyModal