import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Mail, Lock, User, Eye, EyeOff, UserCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocalization } from '../../contexts/LocalizationContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onGuestContinue?: () => void
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onGuestContinue }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signIn, signUp, user } = useAuth()
  const { translations: t } = useLocalization()

  // Auto-close modal when user successfully authenticates
  useEffect(() => {
    if (user && isOpen) {
      onClose()
    }
  }, [user, isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else {
        const { error } = await signUp(email, password, displayName)
        if (error) throw error
      }
      // Don't manually close here - let the useEffect handle it when user state changes
    } catch (err: any) {
      setError(err.message)
      setLoading(false) // Only set loading to false on error
    }
  }

  const handleGuestContinue = () => {
    if (onGuestContinue) {
      onGuestContinue()
      onClose() // Close modal immediately for guest users
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setDisplayName('')
    setError(null)
    setShowPassword(false)
    setLoading(false)
  }

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    resetForm()
  }

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-sm my-8 p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-terracotta-500 fill-current" />
              <h2 className="text-lg font-serif text-sage-800">
                {mode === 'signin' ? t.welcomeBack : t.joinUs}
              </h2>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-full bg-sage-100 text-sage-700"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Welcome Message */}
          <div className="mb-6 text-center">
            <p className="text-sage-600 text-sm leading-relaxed">
              {mode === 'signin' 
                ? "We're glad you're here."
                : "You deserve a space for gentle self-care."
              }
            </p>
          </div>

          {/* Guest Option */}
          {onGuestContinue && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <motion.button
                onClick={handleGuestContinue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-cream-50 border-2 border-cream-200 rounded-xl hover:bg-cream-100 transition-colors group"
              >
                <div className="flex items-center justify-center space-x-3">
                  <UserCheck className="w-5 h-5 text-cream-600 group-hover:text-cream-700" />
                  <div className="text-center">
                    <h3 className="font-medium text-cream-800 group-hover:text-cream-900">
                      {t.continueAsGuest}
                    </h3>
                    <p className="text-cream-600 text-sm group-hover:text-cream-700">
                      Start your healing journey now
                    </p>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* Divider */}
          {onGuestContinue && (
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sage-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-sage-500 text-xs">or create account</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label htmlFor="displayName" className="block text-xs font-medium text-sage-700">
                  {t.name}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sage-400" />
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-transparent text-sm"
                    placeholder="Your name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-medium text-sage-700">
                {t.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sage-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-transparent text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-medium text-sage-700">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sage-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-10 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-transparent text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-400 hover:text-sage-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-700 text-xs">{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 bg-terracotta-500 text-white rounded-lg font-medium hover:bg-terracotta-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Please wait...' : (mode === 'signin' ? t.signIn : t.createAccount)}
            </motion.button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-sage-600 text-xs">
              {mode === 'signin' ? t.dontHaveAccount + ' ' : t.alreadyHaveAccount + ' '}
              <button
                onClick={switchMode}
                className="text-terracotta-600 hover:text-terracotta-700 font-medium"
              >
                {mode === 'signin' ? t.signUp : t.signIn}
              </button>
            </p>
          </div>

          {/* Privacy Note */}
          <div className="mt-4 p-3 bg-lavender-50 rounded-lg border border-lavender-100">
            <p className="text-lavender-700 text-xs leading-relaxed">
              {t.privacyNote}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthModal