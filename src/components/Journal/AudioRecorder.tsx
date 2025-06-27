import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Play, Pause, Trash2, Check, AlertCircle } from 'lucide-react'
import { AudioRecorder as AudioRecorderClass, AudioRecorderState } from '../../lib/audioRecorder'

interface AudioRecorderProps {
  onRecordingComplete: (audioFile: File, duration: number) => void
  onCancel: () => void
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, onCancel }) => {
  const [recorderState, setRecorderState] = useState<AudioRecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null
  })
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const recorderRef = useRef<AudioRecorderClass | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    recorderRef.current = new AudioRecorderClass(setRecorderState)
    
    return () => {
      if (recorderRef.current) {
        recorderRef.current.discardRecording()
      }
    }
  }, [])

  const startRecording = async () => {
    if (!recorderRef.current) return
    
    setError(null)
    const result = await recorderRef.current.startRecording()
    
    if (!result.success) {
      setError(result.error || 'Failed to start recording')
    }
  }

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording()
    }
  }

  const pauseRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.pauseRecording()
    }
  }

  const resumeRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.resumeRecording()
    }
  }

  const discardRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.discardRecording()
    }
    setIsPlaying(false)
    setError(null)
  }

  const playRecording = () => {
    if (recorderState.audioUrl && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const saveRecording = () => {
    if (recorderRef.current && recorderState.audioBlob) {
      const audioFile = recorderRef.current.createAudioFile(`voice-note-${Date.now()}.webm`)
      if (audioFile) {
        onRecordingComplete(audioFile, recorderState.duration)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getWaveformBars = () => {
    const bars = []
    for (let i = 0; i < 20; i++) {
      bars.push(
        <motion.div
          key={i}
          className="w-1 bg-terracotta-400 rounded-full"
          animate={{
            height: recorderState.isRecording && !recorderState.isPaused 
              ? [4, Math.random() * 20 + 8, 4]
              : 4
          }}
          transition={{
            duration: 0.5,
            repeat: recorderState.isRecording && !recorderState.isPaused ? Infinity : 0,
            delay: i * 0.1
          }}
        />
      )
    }
    return bars
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl p-6 border border-sage-100 space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-serif text-sage-800 mb-2">Voice Note</h3>
        <p className="text-sm text-sage-600">Record up to 3 minutes</p>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Interface */}
      <div className="space-y-4">
        {/* Waveform Visualization */}
        <div className="flex items-end justify-center space-x-1 h-16">
          {getWaveformBars()}
        </div>

        {/* Duration Display */}
        <div className="text-center">
          <div className="text-2xl font-mono text-sage-800">
            {formatTime(recorderState.duration)}
          </div>
          <div className="text-xs text-sage-500 mt-1">
            {recorderState.duration >= 180 ? 'Maximum duration reached' : ''}
          </div>
        </div>

        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!recorderState.isRecording && !recorderState.audioBlob && (
            <motion.button
              onClick={startRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 bg-terracotta-500 text-white rounded-full flex items-center justify-center hover:bg-terracotta-600 transition-colors"
            >
              <Mic className="w-6 h-6" />
            </motion.button>
          )}

          {recorderState.isRecording && (
            <>
              <motion.button
                onClick={recorderState.isPaused ? resumeRecording : pauseRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-sage-500 text-white rounded-full flex items-center justify-center hover:bg-sage-600 transition-colors"
              >
                {recorderState.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </motion.button>

              <motion.button
                onClick={stopRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Square className="w-5 h-5" />
              </motion.button>
            </>
          )}

          {recorderState.audioBlob && (
            <>
              <motion.button
                onClick={isPlaying ? pausePlayback : playRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-sage-500 text-white rounded-full flex items-center justify-center hover:bg-sage-600 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </motion.button>

              <motion.button
                onClick={discardRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </>
          )}
        </div>

        {/* Action Buttons */}
        {recorderState.audioBlob && (
          <div className="flex space-x-3">
            <motion.button
              onClick={saveRecording}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-terracotta-500 text-white rounded-lg font-medium hover:bg-terracotta-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Use This Recording</span>
            </motion.button>
            
            <motion.button
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-sage-100 text-sage-700 rounded-lg font-medium hover:bg-sage-200 transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        )}

        {!recorderState.audioBlob && !recorderState.isRecording && (
          <div className="flex justify-center">
            <motion.button
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-sage-100 text-sage-700 rounded-lg font-medium hover:bg-sage-200 transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        )}
      </div>

      {/* Hidden audio element for playback */}
      {recorderState.audioUrl && (
        <audio
          ref={audioRef}
          src={recorderState.audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
        />
      )}
    </motion.div>
  )
}

export default AudioRecorder