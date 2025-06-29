import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Heart, Shield, Phone, ExternalLink } from 'lucide-react'
import DisclaimerModal from './Auth/DisclaimerModal'
import { useLocalization } from '../contexts/LocalizationContext'

const Footer: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const { translations: t } = useLocalization()

  const openCrisisTextLine = () => {
    // For mobile devices, try to open SMS app
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.open('sms:741741?body=HOME', '_blank')
    } else {
      // For desktop, show instructions
      alert('Text HOME to 741741 for crisis support')
    }
  }

  const openSuicidePrevention = () => {
    // For mobile devices, try to open phone app
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.open('tel:988', '_blank')
    } else {
      // For desktop, show instructions
      alert('Call or text 988 for suicide prevention support')
    }
  }

  const openEmergency = () => {
    // For mobile devices, try to open phone app
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.open('tel:911', '_blank')
    } else {
      // For desktop, show instructions
      alert('Call 911 for emergency services')
    }
  }

  return (
    <>
      <footer className="bg-sage-50 border-t border-sage-100 p-3">
        <div className="max-w-md mx-auto space-y-2">
          {/* Crisis Support - Compact Row */}
          <div className="flex items-center justify-between bg-lavender-50 border border-lavender-200 rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-lavender-600 flex-shrink-0" />
              <span className="text-lavender-800 text-xs font-medium">
                Crisis support
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <motion.button
                onClick={openCrisisTextLine}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-1 bg-lavender-100 text-lavender-700 rounded text-xs hover:bg-lavender-200 transition-colors touch-target"
                title="Crisis Text Line"
              >
                741741
              </motion.button>
              <motion.button
                onClick={openSuicidePrevention}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-1 bg-lavender-100 text-lavender-700 rounded text-xs hover:bg-lavender-200 transition-colors touch-target"
                title="Suicide Prevention"
              >
                988
              </motion.button>
              <motion.button
                onClick={openEmergency}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors touch-target"
                title="Emergency"
              >
                911
              </motion.button>
            </div>
          </div>

          {/* Bottom Row - Disclaimer and App Info */}
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setShowDisclaimer(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-1 px-2 py-1 bg-terracotta-50 border border-terracotta-200 rounded hover:bg-terracotta-100 transition-colors touch-target"
            >
              <AlertTriangle className="w-3 h-3 text-terracotta-600 flex-shrink-0" />
              <span className="text-terracotta-700 text-xs font-medium">
                Important notice
              </span>
            </motion.button>

            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3 text-sage-500 fill-current flex-shrink-0" />
              <span className="text-sage-600 text-xs">
                Made with love
              </span>
            </div>
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