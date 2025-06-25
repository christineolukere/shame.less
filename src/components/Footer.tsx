import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Heart, Shield } from 'lucide-react'
import DisclaimerModal from './Auth/DisclaimerModal'

const Footer: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  return (
    <>
      <footer className="bg-sage-50 border-t border-sage-100 p-4 text-center">
        <div className="max-w-md mx-auto space-y-3">
          {/* Main Disclaimer */}
          <motion.button
            onClick={() => setShowDisclaimer(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center space-x-2 w-full p-3 bg-terracotta-50 border border-terracotta-200 rounded-xl hover:bg-terracotta-100 transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-terracotta-600" />
            <span className="text-terracotta-700 text-sm font-medium">
              Important: Not a replacement for therapy
            </span>
          </motion.button>

          {/* App Info */}
          <div className="flex items-center justify-center space-x-2">
            <Heart className="w-4 h-4 text-sage-500 fill-current" />
            <span className="text-sage-600 text-xs">
              shame.<span className="text-terracotta-500">less</span> • Made with love for healing
            </span>
          </div>

          {/* Crisis Resources Quick Access */}
          <div className="flex items-center justify-center space-x-4 text-xs">
            <button className="text-lavender-600 hover:text-lavender-800 transition-colors">
              Crisis Text: 741741
            </button>
            <span className="text-sage-300">•</span>
            <button className="text-lavender-600 hover:text-lavender-800 transition-colors">
              Suicide Prevention: 988
            </button>
          </div>
        </div>
      </footer>

      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        onAccept={() => setShowDisclaimer(false)}
      />
    </>
  )
}

export default Footer