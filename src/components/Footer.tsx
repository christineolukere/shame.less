import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, Heart, Trophy, BookOpen, Sparkles, Leaf, Bookmark,
  ChevronUp, ChevronDown, AlertTriangle, Phone, Shield, ExternalLink
} from 'lucide-react'
import { useLocalization } from '../contexts/LocalizationContext'
import { getFavoriteResponses } from '../lib/checkInResponses'
import DisclaimerModal from './Auth/DisclaimerModal'

type View = 'dashboard' | 'checkin' | 'wins' | 'journal' | 'affirmations' | 'resources' | 'favorites'

interface FooterProps {
  currentView: View
  onNavigate: (view: View) => void
}

const Footer: React.FC<FooterProps> = ({ currentView, onNavigate }) => {
  const [showInfoSection, setShowInfoSection] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const { t } = useLocalization()
  const favoriteCount = getFavoriteResponses().length

  const navItems = [
    { id: 'dashboard', icon: Home, label: t('home'), emoji: '🏠' },
    { id: 'checkin', icon: Heart, label: t('checkIn'), emoji: '❤️' },
    { id: 'wins', icon: Trophy, label: t('wins'), emoji: '🏆' },
    { id: 'journal', icon: BookOpen, label: t('journal'), emoji: '📖' },
    { id: 'affirmations', icon: Sparkles, label: t('affirm'), emoji: '✨' },
    { id: 'resources', icon: Leaf, label: t('garden'), emoji: '🌿' },
  ] as const

  // Add favorites to nav if user has any saved
  const allNavItems = favoriteCount > 0 
    ? [...navItems, { id: 'favorites' as const, icon: Bookmark, label: 'Saved', emoji: '🔖' }]
    : navItems

  const openCrisisLink = (type: 'text' | 'call' | 'emergency') => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    switch (type) {
      case 'text':
        if (isMobile) {
          window.open('sms:741741?body=HOME', '_blank')
        } else {
          alert('Text HOME to 741741 for crisis support')
        }
        break
      case 'call':
        if (isMobile) {
          window.open('tel:988', '_blank')
        } else {
          alert('Call or text 988 for suicide prevention support')
        }
        break
      case 'emergency':
        if (isMobile) {
          window.open('tel:911', '_blank')
        } else {
          alert('Call 911 for emergency services')
        }
        break
    }
  }

  return (
    <>
      <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-sm border-t border-sage-100 shadow-lg">
        {/* Info Section Toggle */}
        <div className="flex justify-center border-b border-sage-100">
          <motion.button
            onClick={() => setShowInfoSection(!showInfoSection)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-sage-600 hover:text-terracotta-500 transition-colors"
            title={showInfoSection ? "Hide info" : "Show app info & crisis support"}
          >
            {showInfoSection ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        {/* Expandable Info Section */}
        <AnimatePresence>
          {showInfoSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
                {/* Important Notice Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rose-50 rounded-xl p-4 border border-rose-100"
                >
                  <div className="flex items-start space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                    <h3 className="font-serif text-rose-800 text-sm font-medium">About shame.less</h3>
                  </div>
                  <p className="text-rose-700 text-xs leading-relaxed">
                    This app is not a replacement for professional therapy. It offers emotional grounding 
                    and peer-inspired healing only. If you are in crisis, please seek licensed mental health support.
                  </p>
                </motion.div>

                {/* Crisis Support Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="w-4 h-4 text-lavender-600" />
                    <h3 className="font-serif text-lavender-800 text-sm font-medium">Crisis Support</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <motion.button
                      onClick={() => openCrisisLink('text')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-between p-3 bg-lavender-50 rounded-lg hover:bg-lavender-100 transition-colors border border-lavender-100"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">📱</span>
                        <span className="text-lavender-800 text-xs font-medium">Crisis Text Line</span>
                      </div>
                      <span className="text-lavender-700 text-xs">Text HOME to 741741</span>
                    </motion.button>

                    <motion.button
                      onClick={() => openCrisisLink('call')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">☎️</span>
                        <span className="text-blue-800 text-xs font-medium">Suicide Prevention</span>
                      </div>
                      <span className="text-blue-700 text-xs">Call or text 988</span>
                    </motion.button>

                    <motion.button
                      onClick={() => openCrisisLink('emergency')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🚨</span>
                        <span className="text-red-800 text-xs font-medium">Emergency</span>
                      </div>
                      <span className="text-red-700 text-xs">Call 911</span>
                    </motion.button>
                  </div>
                </motion.div>

                {/* App Info Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-sage-50 rounded-xl p-4 border border-sage-100 text-center"
                >
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-lg">❤️</span>
                    <span className="font-serif text-sage-800 text-sm">shame.less</span>
                  </div>
                  <p className="text-sage-700 text-xs leading-relaxed mb-3">
                    You deserve support, care, and healing. You are not alone in this journey.
                  </p>
                  
                  {/* Privacy & Terms */}
                  <div className="flex items-center justify-center space-x-4 mb-3">
                    <motion.button
                      onClick={() => setShowDisclaimer(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sage-600 text-xs hover:text-sage-800 transition-colors underline"
                    >
                      Privacy
                    </motion.button>
                    <motion.button
                      onClick={() => setShowDisclaimer(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sage-600 text-xs hover:text-sage-800 transition-colors underline"
                    >
                      Terms
                    </motion.button>
                  </div>

                  {/* Built with Bolt Badge */}
                  <motion.a
                    href="https://bolt.new"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium rounded-full hover:from-purple-600 hover:to-blue-600 transition-all shadow-sm"
                  >
                    <span>⚡</span>
                    <span>Built with Bolt</span>
                    <ExternalLink className="w-3 h-3" />
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Bar */}
        <div className="flex items-center justify-around py-2 px-2 safe-area-pb">
          {allNavItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`footer-nav-item ${isActive ? 'active' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Use emoji for a softer, more friendly look */}
                <span className="text-lg mb-1">{item.emoji}</span>
                <span className="nav-label">
                  {item.label}
                </span>
                
                {/* Badge for favorites count */}
                {item.id === 'favorites' && favoriteCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-terracotta-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {favoriteCount > 9 ? '9+' : favoriteCount}
                  </motion.div>
                )}

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-terracotta-100 rounded-xl -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </footer>

      {/* Disclaimer Modal */}
      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        onAccept={() => setShowDisclaimer(false)}
      />
    </>
  )
}

export default Footer