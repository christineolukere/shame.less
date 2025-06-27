import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, CheckCircle, Sparkles } from 'lucide-react'
import { useLocalization } from '../../contexts/LocalizationContext'

interface MigrationSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  migratedCount: number
}

const MigrationSuccessModal: React.FC<MigrationSuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  migratedCount 
}) => {
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
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="modal-content"
        >
          <div className="modal-body text-center space-y-6">
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-10 h-10 text-sage-600" />
            </motion.div>

            {/* Main Message */}
            <div className="space-y-3">
              <h2 className="modal-title">Welcome to your saved journey! 💌</h2>
              <p className="modal-text text-sage-600">
                We've safely moved all your entries to your account. Your healing journey 
                is now protected and will be here whenever you return.
              </p>
            </div>

            {/* Migration Summary */}
            <div className="bg-gradient-to-r from-terracotta-50 to-cream-50 rounded-2xl p-4 border border-terracotta-100">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Heart className="w-4 h-4 text-terracotta-600 fill-current flex-shrink-0" />
                <span className="modal-text font-medium text-terracotta-800">
                  {migratedCount} entries saved
                </span>
              </div>
              <p className="modal-text text-terracotta-600">
                Your check-ins, wins, and journal entries are now secure
              </p>
            </div>

            {/* Celebration */}
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Sparkles className="w-4 h-4 text-lavender-500" />
                  </motion.div>
                ))}
              </div>
              <p className="modal-text text-sage-600">
                Thank you for trusting us with your healing journey. 
                You're exactly where you need to be.
              </p>
            </div>

            {/* Continue Button */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="modal-button bg-sage-500 text-white hover:bg-sage-600 w-full"
            >
              Continue to my dashboard
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MigrationSuccessModal