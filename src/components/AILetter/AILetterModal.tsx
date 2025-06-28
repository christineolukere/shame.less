import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Sparkles, BookOpen, AlertTriangle, Copy, Check } from 'lucide-react'
import { generateAILetter, isContentSafe } from '../../lib/openai'
import { getStoredSupportStyle, getStoredAnchorPhrase } from '../../hooks/useOnboarding'

interface AILetterModalProps {
  isOpen: boolean
  onClose: () => void
  content: string
  emotion?: string
  onSaveLetter?: (letter: string) => void
}

const AILetterModal: React.FC<AILetterModalProps> = ({ 
  isOpen, 
  onClose, 
  content, 
  emotion,
  onSaveLetter 
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [letter, setLetter] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [copied, setCopied] = useState(false)

  const generateLetter = async () => {
    if (!isContentSafe(content)) {
      setError('For your safety, we cannot generate a letter based on this content. Please reach out to a mental health professional if you need immediate support.')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Get user preferences for personalization
      const supportStyle = getStoredSupportStyle()
      const culturalBackground = JSON.parse(localStorage.getItem('onboarding_data') || '{}').culturalBackground || []
      const spiritualPreference = JSON.parse(localStorage.getItem('onboarding_data') || '{}').spiritualPreference

      const response = await generateAILetter({
        content,
        emotion,
        supportStyle,
        culturalBackground,
        spiritualPreference
      })

      if (response.success && response.letter) {
        setLetter(response.letter)
        setShowDisclaimer(false)
      } else {
        setError(response.error || 'Failed to generate letter. Please try again.')
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again later.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (letter) {
      try {
        await navigator.clipboard.writeText(letter)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const saveLetter = () => {
    if (letter && onSaveLetter) {
      onSaveLetter(letter)
      onClose()
    }
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="modal-header">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-terracotta-500 flex-shrink-0" />
              <h2 className="modal-title">AI Letter to Self</h2>
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
            {/* Disclaimer */}
            {showDisclaimer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-lavender-50 rounded-xl p-4 border border-lavender-100 mb-6"
              >
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-lavender-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="modal-text font-medium text-lavender-800 mb-2">
                      About AI Letters
                    </h3>
                    <p className="modal-text text-lavender-700 mb-3">
                      This letter is AI-generated and designed for emotional support and reflection. 
                      It's not a replacement for licensed therapy or professional mental health care.
                    </p>
                    <p className="modal-text text-lavender-700">
                      The AI will create a personalized, gentle response based on what you've shared, 
                      using your preferences to make it feel more authentic to your journey.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Generate Letter Section */}
            {!letter && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-terracotta-100 to-sage-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-10 h-10 text-terracotta-600" />
                </div>
                
                <div>
                  <h3 className="modal-title mb-2">Ready for your letter?</h3>
                  <p className="modal-text text-sage-600">
                    Based on what you've shared, I'll write you a gentle, personalized letter 
                    that honors your experience and offers comfort.
                  </p>
                </div>

                <motion.button
                  onClick={generateLetter}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="modal-button bg-terracotta-500 text-white hover:bg-terracotta-600 flex items-center space-x-2 mx-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate my letter</span>
                </motion.button>
              </motion.div>
            )}

            {/* Loading State */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6 py-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-gradient-to-br from-sage-100 to-terracotta-100 rounded-full flex items-center justify-center mx-auto"
                >
                  <Sparkles className="w-8 h-8 text-sage-600" />
                </motion.div>
                
                <div>
                  <h3 className="modal-title mb-2">Writing your letter...</h3>
                  <p className="modal-text text-sage-600">
                    Taking a moment to craft something gentle and meaningful for you.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 rounded-xl p-4 border border-red-100"
              >
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="modal-text font-medium text-red-800 mb-1">
                      Unable to generate letter
                    </h3>
                    <p className="modal-text text-red-700">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Generated Letter */}
            {letter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-cream-50 to-sage-50 rounded-2xl p-6 border border-cream-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-sage-600" />
                      <h3 className="modal-title text-sage-800">Your Letter</h3>
                    </div>
                    <motion.button
                      onClick={copyToClipboard}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg bg-sage-100 text-sage-600 hover:bg-sage-200 transition-colors"
                      title="Copy letter"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-line modal-text text-sage-800 leading-relaxed">
                      {letter}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {onSaveLetter && (
                    <motion.button
                      onClick={saveLetter}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="modal-button flex-1 bg-sage-500 text-white hover:bg-sage-600 flex items-center justify-center space-x-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Save to journal</span>
                    </motion.button>
                  )}
                  
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="modal-button flex-1 bg-sage-100 text-sage-700 hover:bg-sage-200"
                  >
                    Close
                  </motion.button>
                </div>

                {/* Gentle Reminder */}
                <div className="bg-lavender-50 rounded-xl p-4 border border-lavender-100">
                  <p className="modal-text text-lavender-700 text-center">
                    💜 Remember, this letter is a reflection tool. Trust your own wisdom 
                    and seek professional support when you need it.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AILetterModal