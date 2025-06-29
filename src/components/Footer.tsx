import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Heart, Shield, Phone, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import DisclaimerModal from './Auth/DisclaimerModal'
import { useLocalization } from '../contexts/LocalizationContext'

const Footer: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [showCrisisSupport, setShowCrisisSupport] = useState(false)
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
      <footer className="bg-sage-50 border-t border-sage-100 px-4 py-3 text-center">
        <div className="w-full max-w-sm mx-auto space-y-3">
          {/* Compact Crisis Support Toggle */}
          <motion.button
            onClick={() => setShowCrisisSupport(!showCrisisSupport)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between px-3 py-2 bg-lavender-50 border border-lavender-200 rounded-lg hover:bg-lavender-100 transition-colors touch-target"
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-lavender-600 flex-shrink-0" />
              <span className="text-lavender-800 text-sm font-medium">
                Crisis support available
              </span>
            </div>
            {showCrisisSupport ? (
              <ChevronUp className="w-4 h-4 text-lavender-600 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-lavender-600 flex-shrink-0" />
            )}
          </motion.button>

          {/* Expandable Crisis Support */}
          <AnimatePresence>
            {showCrisisSupport && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-lavender-50 border border-lavender-200 rounded-lg p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <motion.button
                      onClick={openCrisisTextLine}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-2 bg-lavender-100 text-lavender-700 rounded-lg hover:bg-lavender-200 transition-colors text-xs font-medium flex flex-col items-center space-y-1 touch-target"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Crisis Text</span>
                      <span className="text-xs opacity-75">741741</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={openSuicidePrevention}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-2 bg-lavender-100 text-lavender-700 rounded-lg hover:bg-lavender-200 transition-colors text-xs font-medium flex flex-col items-center space-y-1 touch-target"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Suicide Prevention</span>
                      <span className="text-xs opacity-75">988</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={openEmergency}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs font-medium flex flex-col items-center space-y-1 touch-target"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Emergency</span>
                      <span className="text-xs opacity-75">911</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Disclaimer */}
          <motion.button
            onClick={() => setShowDisclaimer(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-terracotta-50 border border-terracotta-200 rounded-lg hover:bg-terracotta-100 transition-colors touch-target"
          >
            <AlertTriangle className="w-4 h-4 text-terracotta-600 flex-shrink-0" />
            <span className="text-terracotta-700 text-sm font-medium">
              {t.importantNotice}
            </span>
            <ExternalLink className="w-3 h-3 text-terracotta-600 flex-shrink-0" />
          </motion.button>

          {/* App Info */}
          <div className="flex items-center justify-center space-x-2">
            <Heart className="w-4 h-4 text-sage-500 fill-current flex-shrink-0" />
            <span className="text-sage-600 text-xs">
              {t.appName} • Made with love for healing
            </span>
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