import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, LogOut, Heart } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocalization } from '../../contexts/LocalizationContext'

const ProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { t } = useLocalization()

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  if (!user) return null

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || t('common.friend')

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 p-2 rounded-full bg-sage-100 text-sage-700 hover:bg-sage-200 transition-colors"
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
            >
              {/* Header */}
              <div className="p-4 border-b border-sage-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-terracotta-200 rounded-full flex items-center justify-center">
                    <span className="text-terracotta-800 font-medium">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-sage-800">Hello, {displayName}</h3>
                    <p className="text-sage-600 text-sm">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(95, 122, 95, 0.05)' }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-left"
                >
                  <User className="w-5 h-5 text-sage-600" />
                  <span className="text-sage-700">Profile Settings</span>
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: 'rgba(95, 122, 95, 0.05)' }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-left"
                >
                  <Settings className="w-5 h-5 text-sage-600" />
                  <span className="text-sage-700">App Preferences</span>
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: 'rgba(95, 122, 95, 0.05)' }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-left"
                >
                  <Heart className="w-5 h-5 text-sage-600" />
                  <span className="text-sage-700">Support & Feedback</span>
                </motion.button>

                <div className="border-t border-sage-100 mt-2 pt-2">
                  <motion.button
                    onClick={handleSignOut}
                    whileHover={{ backgroundColor: 'rgba(222, 107, 71, 0.05)' }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-left"
                  >
                    <LogOut className="w-5 h-5 text-terracotta-600" />
                    <span className="text-terracotta-700">{t('auth.signOut')}</span>
                  </motion.button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-cream-50 rounded-b-2xl border-t border-cream-100">
                <p className="text-cream-700 text-xs text-center leading-relaxed">
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