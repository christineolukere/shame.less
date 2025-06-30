import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Video, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Heart, 
  Volume2, 
  VolumeX,
  Loader2,
  Save,
  X
} from 'lucide-react'
import { whisperTranscription } from '../../lib/whisperTranscription'
import { mirrorMirrorAI } from '../../lib/mirrorMirrorAI'
import { multilingualVoice } from '../../lib/multilingualVoice'
import { useLocalization } from '../../contexts/LocalizationContext'
import { useAuth } from '../../contexts/AuthContext'
import { saveJournalEntry } from '../../lib/journalStorage'
import { GuestStorageManager } from '../../lib/guestStorage'

interface MirrorMirrorProps {
  onClose: () => void
  onSave?: (content: string, response: string) => void
}

type RecordingMode = 'video' | 'audio'
type ProcessingStep = 'recording' | 'transcribing' | 'generating' | 'synthesizing' | 'complete'

interface MirrorSession {
  originalAudio?: Blob
  originalVideo?: Blob
  transcription?: string
  aiResponse?: string
  responseAudio?: string
  duration?: number
}

const MirrorMirror: React.FC<MirrorMirrorProps> = ({ onClose, onSave }) => {
  const [mode, setMode] = useState<RecordingMode>('audio')
  const [isRecording, setIsRecording] = useState(false)
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('recording')
  const [session, setSession] = useState<MirrorSession>({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const { currentLanguage } = useLocalization()
  const { user, isGuest } = useAuth()
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const maxRecordingTime = 30 // 30 seconds

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopRecording()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
      if (session.responseAudio) {
        URL.revokeObjectURL(session.responseAudio)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      setError(null)
      setRecordingTime(0)
      chunksRef.current = []

      const constraints = mode === 'video' 
        ? { video: true, audio: true }
        : { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (mode === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Create MediaRecorder
      const mimeType = mode === 'video' ? 'video/webm' : 'audio/webm'
      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        if (mode === 'video') {
          setSession(prev => ({ ...prev, originalVideo: blob }))
        } else {
          setSession(prev => ({ ...prev, originalAudio: blob }))
        }
        
        // Start processing
        processRecording(blob)
      }

      mediaRecorder.start(100)
      setIsRecording(true)

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          if (newTime >= maxRecordingTime) {
            stopRecording()
          }
          return newTime
        })
      }, 1000)

    } catch (error: any) {
      console.error('Recording start error:', error)
      setError('Unable to access camera/microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
  }

  const processRecording = async (recordingBlob: Blob) => {
    try {
      // Step 1: Extract audio for transcription
      setProcessingStep('transcribing')
      let audioBlob = recordingBlob

      // If it's a video, we need to extract audio (simplified approach)
      if (mode === 'video') {
        // For now, we'll use the video blob directly as Whisper can handle video files
        // In a production app, you might want to extract audio on the server
        audioBlob = recordingBlob
      }

      // Step 2: Transcribe audio
      const transcriptionResult = await whisperTranscription.transcribeAudio({
        audioBlob,
        language: currentLanguage
      })

      if (!transcriptionResult.success || !transcriptionResult.text) {
        // Use fallback transcription
        const fallback = whisperTranscription.getFallbackTranscription()
        setSession(prev => ({ ...prev, transcription: fallback.text }))
      } else {
        setSession(prev => ({ ...prev, transcription: transcriptionResult.text }))
      }

      // Step 3: Generate AI response
      setProcessingStep('generating')
      const onboardingData = JSON.parse(localStorage.getItem('onboarding_data') || '{}')
      
      const aiResult = await mirrorMirrorAI.generateResponse({
        transcribedText: transcriptionResult.text || "I hear you sharing something meaningful.",
        userLanguage: currentLanguage,
        culturalBackground: onboardingData.culturalBackground,
        supportStyle: localStorage.getItem('support_style') || undefined
      })

      if (!aiResult.success || !aiResult.response) {
        throw new Error('Failed to generate AI response')
      }

      setSession(prev => ({ ...prev, aiResponse: aiResult.response }))

      // Step 4: Synthesize speech response
      if (!isMuted && multilingualVoice.isAvailable()) {
        setProcessingStep('synthesizing')
        
        const voiceResult = await multilingualVoice.synthesizeSpeech({
          text: aiResult.response,
          language: currentLanguage,
          settings: {
            stability: 0.8,
            similarity_boost: 0.9,
            style: 0.1,
            use_speaker_boost: true
          }
        })

        if (voiceResult.success && voiceResult.audioUrl) {
          setSession(prev => ({ ...prev, responseAudio: voiceResult.audioUrl }))
        }
      }

      setProcessingStep('complete')
    } catch (error: any) {
      console.error('Processing error:', error)
      setError('Something went wrong during processing. Please try again.')
      setProcessingStep('recording')
    }
  }

  const playResponse = async () => {
    if (!session.responseAudio) return

    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    try {
      if (audioRef.current) {
        audioRef.current.pause()
      }

      audioRef.current = new Audio(session.responseAudio)
      audioRef.current.onplay = () => setIsPlaying(true)
      audioRef.current.onpause = () => setIsPlaying(false)
      audioRef.current.onended = () => setIsPlaying(false)
      audioRef.current.onerror = () => {
        setError('Unable to play audio response')
        setIsPlaying(false)
      }

      await audioRef.current.play()
    } catch (error) {
      console.error('Audio playback error:', error)
      setError('Unable to play audio response')
      setIsPlaying(false)
    }
  }

  const saveSession = async () => {
    if (!session.transcription || !session.aiResponse) return

    try {
      const content = `Mirror Mirror Session

Original message: "${session.transcription}"

Response: "${session.aiResponse}"`

      if (onSave) {
        onSave(content, session.aiResponse)
      }

      // Save to database/storage
      if (isGuest) {
        GuestStorageManager.addJournalEntry({
          content,
          entryType: 'mirror-mirror'
        })
      } else if (user) {
        await saveJournalEntry({
          user_id: user.id,
          content,
          entry_type: 'mirror-mirror',
          title: 'Mirror Mirror Session'
        })
      }

      onClose()
    } catch (error) {
      console.error('Save error:', error)
      setError('Failed to save session')
    }
  }

  const resetSession = () => {
    setSession({})
    setProcessingStep('recording')
    setRecordingTime(0)
    setError(null)
    setIsPlaying(false)
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  const getProcessingMessage = () => {
    switch (processingStep) {
      case 'transcribing':
        return 'Listening to your words...'
      case 'generating':
        return 'Reflecting on what you shared...'
      case 'synthesizing':
        return 'Preparing your response...'
      default:
        return 'Processing...'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage-100">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-terracotta-500" />
            <h2 className="text-lg font-serif text-sage-800">Mirror Mirror</h2>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-sage-100 text-sage-700 touch-target"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="p-6 space-y-6">
          {/* Introduction */}
          {processingStep === 'recording' && !session.transcription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-terracotta-100 to-sage-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10 text-terracotta-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-serif text-sage-800 mb-2">Speak to your inner wisdom</h3>
                <p className="text-sage-600 text-sm leading-relaxed">
                  Share what's on your heart for up to 30 seconds. I'll listen and reflect back 
                  something gentle and affirming.
                </p>
              </div>

              {/* Mode Selection */}
              <div className="flex space-x-3 justify-center">
                <motion.button
                  onClick={() => setMode('audio')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    mode === 'audio'
                      ? 'bg-sage-100 text-sage-800 border-2 border-sage-300'
                      : 'bg-white text-sage-600 border border-sage-200 hover:bg-sage-50'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>Audio</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setMode('video')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    mode === 'video'
                      ? 'bg-sage-100 text-sage-800 border-2 border-sage-300'
                      : 'bg-white text-sage-600 border border-sage-200 hover:bg-sage-50'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Video</span>
                </motion.button>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center justify-center space-x-3">
                <motion.button
                  onClick={() => setIsMuted(!isMuted)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-full transition-colors ${
                    isMuted ? 'bg-red-100 text-red-600' : 'bg-sage-100 text-sage-600'
                  }`}
                  title={isMuted ? "Unmute response" : "Mute response"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Recording Interface */}
          {processingStep === 'recording' && !session.transcription && (
            <div className="space-y-4">
              {/* Video Preview */}
              {mode === 'video' && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-48 bg-gray-100 rounded-lg object-cover"
                    muted
                    playsInline
                  />
                  {!isRecording && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                      <span className="text-white text-sm">Camera preview will appear here</span>
                    </div>
                  )}
                </div>
              )}

              {/* Recording Controls */}
              <div className="text-center space-y-4">
                {isRecording && (
                  <div className="space-y-2">
                    <div className="text-2xl font-mono text-sage-800">
                      {formatTime(recordingTime)} / {formatTime(maxRecordingTime)}
                    </div>
                    <div className="w-full bg-sage-100 rounded-full h-2">
                      <div 
                        className="bg-terracotta-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(recordingTime / maxRecordingTime) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <motion.button
                  onClick={isRecording ? stopRecording : startRecording}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                    isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-terracotta-500 text-white hover:bg-terracotta-600'
                  }`}
                >
                  {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </motion.button>

                <p className="text-sm text-sage-600">
                  {isRecording ? 'Recording... Tap to stop' : `Tap to start ${mode} recording`}
                </p>
              </div>
            </div>
          )}

          {/* Processing State */}
          {processingStep !== 'recording' && processingStep !== 'complete' && (
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
                <h3 className="text-lg font-serif text-sage-800 mb-2">{getProcessingMessage()}</h3>
                <p className="text-sage-600 text-sm">
                  This may take a moment as I carefully consider your words...
                </p>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {processingStep === 'complete' && session.transcription && session.aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Original Message */}
              <div className="bg-sage-50 rounded-xl p-4 border border-sage-100">
                <h4 className="font-medium text-sage-800 mb-2 flex items-center space-x-2">
                  <Mic className="w-4 h-4" />
                  <span>What you shared:</span>
                </h4>
                <p className="text-sage-700 italic leading-relaxed">
                  "{session.transcription}"
                </p>
              </div>

              {/* AI Response */}
              <div className="bg-gradient-to-br from-terracotta-50 to-cream-50 rounded-xl p-4 border border-terracotta-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-terracotta-800 flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Your inner wisdom responds:</span>
                  </h4>
                  
                  {session.responseAudio && !isMuted && (
                    <motion.button
                      onClick={playResponse}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full bg-terracotta-100 text-terracotta-700 hover:bg-terracotta-200 transition-colors"
                      title={isPlaying ? "Pause" : "Listen"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </motion.button>
                  )}
                </div>
                
                <p className="text-terracotta-800 leading-relaxed">
                  {session.aiResponse}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <motion.button
                  onClick={saveSession}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-sage-500 text-white rounded-lg font-medium hover:bg-sage-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Session</span>
                </motion.button>
                
                <motion.button
                  onClick={resetSession}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-sage-100 text-sage-700 rounded-lg font-medium hover:bg-sage-200 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </motion.button>
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
                <div className="w-5 h-5 text-red-600 mt-0.5">⚠️</div>
                <div>
                  <h3 className="font-medium text-red-800 mb-1">Something went wrong</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                  <motion.button
                    onClick={() => setError(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                  >
                    Try Again
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Service Status */}
          <div className="text-center text-xs text-sage-500 space-y-1">
            <div>
              Transcription: {whisperTranscription.isAvailable() ? '✅ Available' : '⚠️ Fallback mode'}
            </div>
            <div>
              AI Response: {mirrorMirrorAI.isAvailable() ? '✅ Available' : '⚠️ Fallback mode'}
            </div>
            <div>
              Voice Synthesis: {multilingualVoice.isAvailable() ? '✅ Available' : '⚠️ Text only'}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default MirrorMirror