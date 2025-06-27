import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Mail, Lock, User, Eye, EyeOff, UserCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocalization } from '../../contexts/LocalizationContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onGuestContinue?: () => void
  showMigrationMessage?: boolean
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onGuestContinue,
  showMigrationMessage = false 
}) => {
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
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleGuestContinue = () => {
    if (onGuestContinue) {
      onGuestContinue()
      onClose()
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
        className="modal-container"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-terracotta-500 fill-current flex-shrink-0" />
              <h2 className="modal-title">
                {mode === 'signin' ? t.welcomeBack : t.joinUs}
              </h2>
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

          <div className="modal-body">
            {/* Migration Message */}
            {showMigrationMessage && (
              <div className="bg-terracotta-50 rounded-xl p-4 border border-terracotta-100 mb-4">
                <p className="modal-text text-terracotta-700 text-center">
                  💌 Sign up to save your journey and access it from anywhere!
                </p>
              </div>
            )}

            {/* Welcome Message */}
            <div className="text-center">
              <p className="modal-text text-sage-600">
                {mode === 'signin' 
                  ? "We're glad you're here."
                  : "You deserve a space for gentle self-care."
                }
              </p>
            </div>

            {/* Guest Option */}
            {onGuestContinue && !showMigrationMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.button
                  onClick={handleGuestContinue}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 bg-cream-50 border-2 border-cream-200 rounded-xl hover:bg-cream-100 transition-colors group"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <UserCheck className="w-4 h-4 text-cream-600 group-hover:text-cream-700 flex-shrink-0" />
                    <div className="text-center">
                      <h3 className="modal-text font-medium text-cream-800 group-hover:text-cream-900">
                        {t.continueAsGuest}
                      </h3>
                      <p className="modal-text text-cream-600 group-hover:text-cream-700">
                        Start your healing journey now
                      </p>
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            )}

            {/* Divider */}
            {onGuestContinue && !showMigrationMessage && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sage-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-sage-500 modal-text">or create account</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label htmlFor="displayName" className="block modal-text font-medium text-sage-700">
                    {t.name}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sage-400" />
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-transparent modal-text"
                      placeholder="Your name"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="email" className="block modal-text font-medium text-sage-700">
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
                    className="w-full pl-9 pr-3 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-transparent modal-text"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block modal-text font-medium text-sage-700">
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
                    className="w-full pl-9 pr-10 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-transparent modal-text"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-400 hover:text-sage-600 touch-target"
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
                  <p className="text-red-700 modal-text">{error}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="modal-button w-full bg-terracotta-500 text-white hover:bg-terracotta-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (mode === 'signin' ? t.signIn : t.createAccount)}
              </motion.button>
            </form>

            {/* Switch Mode */}
            <div className="text-center">
              <p className="modal-text text-sage-600">
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
            <div className="p-3 bg-lavender-50 rounded-lg border border-lavender-100">
              <p className="modal-text text-lavender-700">
                {t.privacyNote}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthModal