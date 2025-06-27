export interface AudioRecorderState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  audioBlob: Blob | null
  audioUrl: string | null
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private startTime: number = 0
  private pausedDuration: number = 0
  private animationFrame: number | null = null
  private onStateChange: (state: AudioRecorderState) => void
  private maxDuration: number = 180 // 3 minutes in seconds

  constructor(onStateChange: (state: AudioRecorderState) => void) {
    this.onStateChange = onStateChange
  }

  async startRecording(): Promise<{ success: boolean; error?: string }> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })

      // Check for supported MIME types
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/mpeg'
      ]

      let selectedMimeType = 'audio/webm'
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType
          break
        }
      }

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        audioBitsPerSecond: 128000
      })

      this.audioChunks = []
      this.startTime = Date.now()
      this.pausedDuration = 0

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: selectedMimeType })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        this.updateState({
          isRecording: false,
          isPaused: false,
          duration: this.getCurrentDuration(),
          audioBlob,
          audioUrl
        })

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }

      this.mediaRecorder.start(100) // Collect data every 100ms
      this.startDurationTracking()

      this.updateState({
        isRecording: true,
        isPaused: false,
        duration: 0,
        audioBlob: null,
        audioUrl: null
      })

      return { success: true }
    } catch (error: any) {
      console.error('Recording start error:', error)
      return { 
        success: false, 
        error: error.name === 'NotAllowedError' 
          ? 'Microphone access denied. Please allow microphone access and try again.'
          : 'Failed to start recording. Please check your microphone.'
      }
    }
  }

  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause()
      this.pausedDuration += Date.now() - this.startTime
      this.stopDurationTracking()
      
      this.updateState({
        isRecording: true,
        isPaused: true,
        duration: this.getCurrentDuration(),
        audioBlob: null,
        audioUrl: null
      })
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume()
      this.startTime = Date.now()
      this.startDurationTracking()
      
      this.updateState({
        isRecording: true,
        isPaused: false,
        duration: this.getCurrentDuration(),
        audioBlob: null,
        audioUrl: null
      })
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
      this.stopDurationTracking()
    }
  }

  discardRecording(): void {
    if (this.mediaRecorder) {
      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop()
      }
      this.stopDurationTracking()
    }

    this.updateState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null,
      audioUrl: null
    })
  }

  private getCurrentDuration(): number {
    if (!this.startTime) return 0
    
    const currentTime = this.mediaRecorder?.state === 'recording' 
      ? Date.now() 
      : this.startTime
    
    return Math.floor((this.pausedDuration + (currentTime - this.startTime)) / 1000)
  }

  private startDurationTracking(): void {
    const updateDuration = () => {
      const duration = this.getCurrentDuration()
      
      // Auto-stop at max duration
      if (duration >= this.maxDuration) {
        this.stopRecording()
        return
      }

      this.updateState({
        isRecording: true,
        isPaused: false,
        duration,
        audioBlob: null,
        audioUrl: null
      })

      this.animationFrame = requestAnimationFrame(updateDuration)
    }
    
    this.animationFrame = requestAnimationFrame(updateDuration)
  }

  private stopDurationTracking(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
  }

  private updateState(state: AudioRecorderState): void {
    this.onStateChange(state)
  }

  // Convert blob to File for upload
  createAudioFile(filename: string = 'recording.webm'): File | null {
    const state = this.getCurrentState()
    if (!state.audioBlob) return null

    return new File([state.audioBlob], filename, {
      type: state.audioBlob.type,
      lastModified: Date.now()
    })
  }

  getCurrentState(): AudioRecorderState {
    return {
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null,
      audioUrl: null
    }
  }

  // Format duration for display
  static formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
}