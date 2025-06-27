import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, X, ArrowRight } from 'lucide-react'
import { GuestStorageManager } from '../../lib/guestStorage'
import { useLocalization } from '../../contexts/LocalizationContext'

interface UpsellModalProps {
  isOpen: boolean
  onClose: () => void
  onSignUp: () => void
}

const UpsellModal: React.FC<UpsellModalProps> = ({ isOpen, onClose, onSignUp }) => {
  const { translations: t } = useLocalization()
  const { totalEntries, daysSinceFirst } = GuestStorageManager.getDataSummary()

  const handleNotNow = () => {
    GuestStorageManager.dismissUpsell()
    onClose()
  }

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
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="modal-content"
        >
          {/* Header */}
          <div className="modal-header">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-terracotta-500 flex-shrink-0" />
              <h2 className="modal-title">You've been showing up beautifully</h2>
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
            {/* Personal Stats */}
            <div className="bg-gradient-to-r from-terracotta-50 to-cream-50 rounded-2xl p-4 border border-terracotta-100">
              <div className="flex items-center space-x-2 mb-3">
                <Heart className="w-5 h-5 text-terracotta-600 fill-current flex-shrink-0" />
                <h3 className="modal-title text-terracotta-800">Your journey so far</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-serif text-terracotta-800">{totalEntries}</div>
                  <div className="modal-text text-terracotta-600">entries created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-serif text-terracotta-800">{daysSinceFirst || 1}</div>
                  <div className="modal-text text-terracotta-600">days of self-care</div>
                </div>
              </div>
            </div>

            {/* Main Message */}
            <div className="text-center space-y-3">
              <h3 className="modal-title">Want to save your journey?</h3>
              <p className="modal-text text-sage-600 leading-relaxed">
                Creating an account means your reflections, wins, and growth will be safely stored. 
                You can access them anytime, anywhere, and never lose your progress.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <h4 className="modal-text font-medium text-sage-800">With an account, you get:</h4>
              <div className="space-y-2">
                {[
                  'Your data saved securely in the cloud',
                  'Access from any device, anywhere',
                  'Personalized insights and progress tracking',
                  'Never lose your healing journey'
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-2 h-2 bg-sage-400 rounded-full flex-shrink-0" />
                    <span className="modal-text text-sage-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={onSignUp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="modal-button flex-1 bg-terracotta-500 text-white hover:bg-terracotta-600 flex items-center justify-center space-x-2"
              >
                <span>Save my journey</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={handleNotNow}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="modal-button flex-1 bg-sage-100 text-sage-700 hover:bg-sage-200"
              >
                Not now
              </motion.button>
            </div>

            {/* Gentle Note */}
            <div className="bg-lavender-50 rounded-xl p-4 border border-lavender-100">
              <p className="modal-text text-lavender-700 text-center">
                💜 No pressure at all. You can continue as a guest and we'll keep asking gently. 
                Your healing journey is yours to choose.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default UpsellModal