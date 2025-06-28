// Lightweight audio engine using only Web Audio API - no external libraries
export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      // Create audio context with proper browser compatibility
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      
      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.3; // Default volume
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  async resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  generateCleanTone(frequency: number, duration: number, type: 'sine' | 'triangle' | 'sawtooth' = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const samples = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, samples, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'triangle':
          sample = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t));
          break;
        case 'sawtooth':
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
      }

      // Apply envelope to prevent clicks
      const envelope = Math.min(1, Math.min(t * 10, (duration - t) * 10));
      data[i] = sample * envelope * 0.3; // Reduced amplitude
    }

    return buffer;
  }

  generateNaturalSound(soundType: 'ocean' | 'rain' | 'forest', duration: number): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const samples = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(2, samples, sampleRate); // Stereo
    const leftData = buffer.getChannelData(0);
    const rightData = buffer.getChannelData(1);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      let leftSample = 0;
      let rightSample = 0;

      switch (soundType) {
        case 'ocean':
          // Ocean waves: Low frequency sine with filtered noise
          leftSample = Math.sin(2 * Math.PI * 0.3 * t) * 0.4 + 
                      (Math.random() - 0.5) * 0.1 * Math.sin(2 * Math.PI * 2 * t);
          rightSample = Math.sin(2 * Math.PI * 0.35 * t) * 0.4 + 
                       (Math.random() - 0.5) * 0.1 * Math.sin(2 * Math.PI * 1.8 * t);
          break;
        case 'rain':
          // Rain: Filtered white noise with gentle modulation
          leftSample = (Math.random() - 0.5) * 0.3 * (1 + 0.3 * Math.sin(2 * Math.PI * 0.1 * t));
          rightSample = (Math.random() - 0.5) * 0.3 * (1 + 0.3 * Math.sin(2 * Math.PI * 0.12 * t));
          break;
        case 'forest':
          // Forest: Bird sounds with ambient noise
          const birdFreq1 = 800 + 200 * Math.sin(2 * Math.PI * 0.05 * t);
          const birdFreq2 = 1200 + 300 * Math.sin(2 * Math.PI * 0.07 * t);
          leftSample = Math.sin(2 * Math.PI * birdFreq1 * t) * 0.1 * 
                      (Math.random() > 0.95 ? 1 : 0) + (Math.random() - 0.5) * 0.05;
          rightSample = Math.sin(2 * Math.PI * birdFreq2 * t) * 0.1 * 
                       (Math.random() > 0.97 ? 1 : 0) + (Math.random() - 0.5) * 0.05;
          break;
      }

      // Apply gentle envelope
      const envelope = Math.min(1, Math.min(t * 5, (duration - t) * 5));
      leftData[i] = leftSample * envelope;
      rightData[i] = rightSample * envelope;
    }

    return buffer;
  }

  async playBuffer(buffer: AudioBuffer, loop: boolean = false): Promise<void> {
    if (!this.audioContext || !this.gainNode || !buffer) return;

    await this.resumeContext();
    this.stopCurrent();

    this.currentSource = this.audioContext.createBufferSource();
    this.currentSource.buffer = buffer;
    this.currentSource.loop = loop;
    this.currentSource.connect(this.gainNode);
    this.currentSource.start();
  }

  stopCurrent() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (error) {
        // Source might already be stopped
      }
      this.currentSource = null;
    }
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      // Smooth volume changes to prevent clicks
      this.gainNode.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), 
                                        this.audioContext?.currentTime || 0, 0.1);
    }
  }

  getVolume(): number {
    return this.gainNode?.gain.value || 0;
  }

  isPlaying(): boolean {
    return this.currentSource !== null;
  }

  destroy() {
    this.stopCurrent();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.gainNode = null;
    this.isInitialized = false;
  }
}

// Singleton instance
export const audioEngine = new AudioEngine();