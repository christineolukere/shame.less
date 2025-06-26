import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, LogOut, Heart } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocalization } from '../../contexts/LocalizationContext'

const ProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { translations: t } = useLocalization()

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  if (!user) return null

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || t.friend

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 p-2 rounded-full bg-sage-100 text-sage-700 hover:bg-sage-200 transition-colors touch-target"
      >
        <div className="w-8 h-8 bg-terracotta-200 rounded-full flex items-center justify-center">
          <span className="text-terracotta-800 font-medium text-sm">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-lg border border-sage-100 z-20"
              style={{ maxWidth: '90vw' }}
            >
              {/* Header */}
              <div className="p-4 border-b border-sage-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-terracotta-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-terracotta-800 font-medium">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="modal-text font-serif text-sage-800 truncate">Hello, {displayName}</h3>
                    <p className="modal-text text-sage-600 truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(95, 122, 95, 0.05)' }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-left touch-target"
                >
                  <User className="w-4 h-4 text-sage-600 flex-shrink-0" />
                  <span className="modal-text text-sage-700">Profile Settings</span>
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: 'rgba(95, 122, 95, 0.05)' }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-left touch-target"
                >
                  <Settings className="w-4 h-4 text-sage-600 flex-shrink-0" />
                  <span className="modal-text text-sage-700">App Preferences</span>
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: 'rgba(95, 122, 95, 0.05)' }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-left touch-target"
                >
                  <Heart className="w-4 h-4 text-sage-600 flex-shrink-0" />
                  <span className="modal-text text-sage-700">Support & Feedback</span>
                </motion.button>

                <div className="border-t border-sage-100 mt-2 pt-2">
                  <motion.button
                    onClick={handleSignOut}
                    whileHover={{ backgroundColor: 'rgba(222, 107, 71, 0.05)' }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-left touch-target"
                  >
                    <LogOut className="w-4 h-4 text-terracotta-600 flex-shrink-0" />
                    <span className="modal-text text-terracotta-700">{t.signOut}</span>
                  </motion.button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-cream-50 rounded-b-2xl border-t border-cream-100">
                <p className="modal-text text-cream-700 text-center">
                  Remember: You are worthy of love and gentleness, always. 💛
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileMenu