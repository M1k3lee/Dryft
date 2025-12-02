import { FrequencySignalGenerator } from './FrequencySignalGenerator';
import { WhiteNoiseGenerator } from './WhiteNoiseGenerator';
import { CosmicAmbienceGenerator } from './CosmicAmbienceGenerator';
import { SoundConfig, ActiveSound, FrequencySignalConfig } from '../types/audio';

interface AudioSource {
  id: string;
  sound: SoundConfig;
  volume: number;
  audioBuffer?: AudioBufferSourceNode;
  frequencyGenerator?: FrequencySignalGenerator;
  whiteNoiseGenerator?: WhiteNoiseGenerator;
  cosmicAmbienceGenerator?: CosmicAmbienceGenerator;
  audioGainNode?: GainNode;
  frequencyGainNode?: GainNode;
  masterGainNode?: GainNode; // Combined gain for audio + frequency
}

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private activeSources: Map<string, AudioSource> = new Map();
  private masterGain: GainNode | null = null;
  private isInitialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      // Ensure context is running for background playback
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      return;
    }

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context if suspended (required for autoplay policy)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create master gain node
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 1.0;
      this.masterGain.connect(this.audioContext.destination);

      // Keep context alive for background playback
      this.setupBackgroundPlayback();

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      throw error;
    }
  }

  private setupBackgroundPlayback(): void {
    if (!this.audioContext) return;

    // Monitor context state and resume if suspended
    this.audioContext.addEventListener('statechange', () => {
      if (this.audioContext && this.audioContext.state === 'suspended' && this.activeSources.size > 0) {
        this.audioContext.resume().catch(console.error);
      }
    });

    // Create a silent oscillator to keep context alive during background playback
    // This is important for mobile browsers that may suspend audio contexts
    const keepAliveOsc = this.audioContext.createOscillator();
    const keepAliveGain = this.audioContext.createGain();
    keepAliveOsc.frequency.value = 0.001; // Inaudible frequency
    keepAliveGain.gain.value = 0; // Silent
    keepAliveOsc.connect(keepAliveGain);
    keepAliveGain.connect(this.audioContext.destination);
    keepAliveOsc.start();

    // Store reference to prevent garbage collection
    (this as any).keepAliveOsc = keepAliveOsc;
    (this as any).keepAliveGain = keepAliveGain;
  }

  async playSound(sound: SoundConfig, volume: number = 0.7): Promise<string> {
    if (!this.isInitialized || !this.audioContext) {
      await this.initialize();
    }

    // Ensure context is running
    await this.ensureContextRunning();

    const sourceId = `${sound.id}-${Date.now()}`;
    
    // Stop existing sound with same id
    if (this.activeSources.has(sound.id)) {
      await this.stopSound(sound.id);
    }

    const source: AudioSource = {
      id: sourceId,
      sound,
      volume,
    };

    // Check what type of sound this is
    if (sound.id === 'cosmic-ambience') {
      // Cosmic ambience uses special generator
      await this.playCosmicAmbience(source);
    } else if (sound.id === 'white-noise') {
      // White noise is generated programmatically, may have frequencies
      if (sound.frequencyConfig) {
        await this.playWhiteNoiseWithFrequencies(source);
      } else {
        await this.playWhiteNoise(source);
      }
    } else if (sound.frequencyConfig && sound.audioUrl) {
      // Sound has both audio file and frequency layers
      await this.playAudioWithFrequencies(source);
    } else if (sound.frequencyConfig) {
      // Frequency-only sound
      await this.playFrequencySound(source);
    } else if (sound.audioUrl) {
      // Audio file only
      await this.playAudioFile(source);
    }

    this.activeSources.set(sound.id, source);
    return sourceId;
  }

  private async playFrequencySound(source: AudioSource): Promise<void> {
    if (!this.audioContext || !this.masterGain || !source.sound.frequencyConfig) {
      return;
    }

    // Resume context if needed
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Create frequency generator
    const generator = new FrequencySignalGenerator(this.audioContext);
    generator.initialize(source.sound.frequencyConfig);

    // Create gain node for this source
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = source.volume;

    // Connect: Generator → Gain → Master Gain
    const output = generator.getOutput();
    if (output) {
      output.connect(gainNode);
      gainNode.connect(this.masterGain);
    }

    // Start playback
    generator.start();

    source.frequencyGenerator = generator;
    source.frequencyGainNode = gainNode;
  }

  private async playWhiteNoise(source: AudioSource): Promise<void> {
    if (!this.audioContext || !this.masterGain) {
      return;
    }

    // Resume context if needed
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Create white noise generator
    const whiteNoise = new WhiteNoiseGenerator(this.audioContext);

    // Create gain node for this source
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = source.volume;

    // Connect: White Noise → Gain → Master Gain
    const output = whiteNoise.getOutput();
    if (output) {
      output.connect(gainNode);
      gainNode.connect(this.masterGain);
    }

    // Start playback
    whiteNoise.start();

    source.whiteNoiseGenerator = whiteNoise;
    source.audioGainNode = gainNode;
  }

  private async playCosmicAmbience(source: AudioSource): Promise<void> {
    if (!this.audioContext || !this.masterGain) {
      return;
    }

    // Resume context if needed
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Create cosmic ambience generator
    const cosmicGenerator = new CosmicAmbienceGenerator(this.audioContext);

    // Create gain node for this source
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = source.volume;

    // Connect: Cosmic Generator → Gain → Master Gain
    const output = cosmicGenerator.getOutput();
    if (output) {
      output.connect(gainNode);
      gainNode.connect(this.masterGain);
    }

    // Start playback
    cosmicGenerator.start();

    source.cosmicAmbienceGenerator = cosmicGenerator;
    source.audioGainNode = gainNode;
  }

  private async playWhiteNoiseWithFrequencies(source: AudioSource): Promise<void> {
    if (!this.audioContext || !this.masterGain || !source.sound.frequencyConfig) {
      return;
    }

    // Resume context if needed
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Create master gain node for this sound (combines white noise + frequency)
    const masterGainNode = this.audioContext.createGain();
    masterGainNode.gain.value = 1.0;
    masterGainNode.connect(this.masterGain);
    source.masterGainNode = masterGainNode;

    // Create white noise generator
    const whiteNoise = new WhiteNoiseGenerator(this.audioContext);
    const whiteNoiseGain = this.audioContext.createGain();
    whiteNoiseGain.gain.value = source.volume; // Full volume for white noise

    const whiteNoiseOutput = whiteNoise.getOutput();
    if (whiteNoiseOutput) {
      whiteNoiseOutput.connect(whiteNoiseGain);
      whiteNoiseGain.connect(masterGainNode);
    }

    whiteNoise.start();
    source.whiteNoiseGenerator = whiteNoise;
    source.audioGainNode = whiteNoiseGain;

    // Create frequency generator
    const frequencyGenerator = new FrequencySignalGenerator(this.audioContext);
    frequencyGenerator.initialize(source.sound.frequencyConfig);

    const frequencyGainNode = this.audioContext.createGain();
    frequencyGainNode.gain.value = source.volume * 0.25; // 25% of white noise volume

    const freqOutput = frequencyGenerator.getOutput();
    if (freqOutput) {
      freqOutput.connect(frequencyGainNode);
      frequencyGainNode.connect(masterGainNode);
    }

    frequencyGenerator.start();
    source.frequencyGenerator = frequencyGenerator;
    source.frequencyGainNode = frequencyGainNode;
  }

  private async playAudioWithFrequencies(source: AudioSource): Promise<void> {
    if (!this.audioContext || !this.masterGain || !source.sound.audioUrl || !source.sound.frequencyConfig) {
      return;
    }

    try {
      // Resume context if needed
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create master gain node for this sound (combines audio + frequency)
      const masterGainNode = this.audioContext.createGain();
      masterGainNode.gain.value = 1.0;
      masterGainNode.connect(this.masterGain);
      source.masterGainNode = masterGainNode;

      // Play audio file at full volume (relative to master gain)
      const response = await fetch(source.sound.audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      const bufferSource = this.audioContext.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.loop = true;

      const audioGainNode = this.audioContext.createGain();
      const now = this.audioContext.currentTime;
      
      // Subtle fade-in for seamless looping (helps mask any loop transitions)
      audioGainNode.gain.setValueAtTime(0, now);
      audioGainNode.gain.linearRampToValueAtTime(source.volume, now + 0.1); // 100ms fade-in
      audioGainNode.gain.setValueAtTime(source.volume, now + 0.1);

      bufferSource.connect(audioGainNode);
      audioGainNode.connect(masterGainNode);

      bufferSource.start(0);
      source.audioBuffer = bufferSource;
      source.audioGainNode = audioGainNode;

      // Play frequency layers at 25% volume (subtle enhancement)
      const frequencyGenerator = new FrequencySignalGenerator(this.audioContext);
      frequencyGenerator.initialize(source.sound.frequencyConfig);

      const frequencyGainNode = this.audioContext.createGain();
      frequencyGainNode.gain.value = source.volume * 0.25; // 25% of audio volume

      const freqOutput = frequencyGenerator.getOutput();
      if (freqOutput) {
        freqOutput.connect(frequencyGainNode);
        frequencyGainNode.connect(masterGainNode);
      }

      frequencyGenerator.start();
      source.frequencyGenerator = frequencyGenerator;
      source.frequencyGainNode = frequencyGainNode;

      bufferSource.onended = () => {
        this.activeSources.delete(source.sound.id);
      };
    } catch (error) {
      console.error('Failed to play audio with frequencies:', error);
    }
  }

  private async playAudioFile(source: AudioSource): Promise<void> {
    if (!this.audioContext || !this.masterGain || !source.sound.audioUrl) {
      return;
    }

    try {
      // Resume context if needed
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Fetch and decode audio
      const response = await fetch(source.sound.audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      // Create buffer source
      const bufferSource = this.audioContext.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.loop = true;

      // Create gain node
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = source.volume;

      // Connect: Source → Gain → Master Gain
      bufferSource.connect(gainNode);
      gainNode.connect(this.masterGain);

      // Start playback
      bufferSource.start(0);

      source.audioBuffer = bufferSource;
      source.audioGainNode = gainNode;

      // Handle end of playback (for non-looping sounds)
      bufferSource.onended = () => {
        this.activeSources.delete(source.sound.id);
      };
    } catch (error) {
      console.error('Failed to play audio file:', error);
    }
  }

  async stopSound(soundId: string): Promise<void> {
    const source = this.activeSources.get(soundId);
    if (!source) {
      return;
    }

    try {
      // Stop frequency generator first (this stops all oscillators in layers)
      if (source.frequencyGenerator) {
        source.frequencyGenerator.stop();
        // Wait a bit for oscillators to actually stop (they have fade-out delays)
        await new Promise(resolve => setTimeout(resolve, 150));
        // Now dispose to clean up
        source.frequencyGenerator.dispose();
        source.frequencyGenerator = undefined;
      }

      // Disconnect frequency gain node after generator is stopped
      if (source.frequencyGainNode) {
        try {
          source.frequencyGainNode.disconnect();
        } catch (e) {
          // Ignore if already disconnected
        }
        source.frequencyGainNode = undefined;
      }

      // Disconnect frequency generator output if it exists
      const frequencyOutput = (source as any).frequencyOutput;
      if (frequencyOutput) {
        try {
          frequencyOutput.disconnect();
        } catch (e) {
          // Ignore if already disconnected
        }
        (source as any).frequencyOutput = undefined;
      }

      if (source.whiteNoiseGenerator) {
        source.whiteNoiseGenerator.stop();
        source.whiteNoiseGenerator.dispose();
        source.whiteNoiseGenerator = undefined;
      }

      if (source.cosmicAmbienceGenerator) {
        source.cosmicAmbienceGenerator.stop();
        source.cosmicAmbienceGenerator.dispose();
        source.cosmicAmbienceGenerator = undefined;
      }

      if (source.audioBuffer) {
        try {
          source.audioBuffer.stop();
        } catch (e) {
          // Ignore if already stopped
        }
        source.audioBuffer.disconnect();
        source.audioBuffer = undefined;
      }

      if (source.audioGainNode) {
        source.audioGainNode.disconnect();
        source.audioGainNode = undefined;
      }

      if (source.frequencyGainNode) {
        source.frequencyGainNode.disconnect();
        source.frequencyGainNode = undefined;
      }

      if (source.masterGainNode) {
        source.masterGainNode.disconnect();
        source.masterGainNode = undefined;
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }

    this.activeSources.delete(soundId);
  }

  async stopAll(): Promise<void> {
    const stopPromises = Array.from(this.activeSources.keys()).map(id => this.stopSound(id));
    await Promise.all(stopPromises);
    this.activeSources.clear();
  }

  setSoundVolume(soundId: string, volume: number): void {
    const source = this.activeSources.get(soundId);
    if (!source) return;

    const now = this.audioContext!.currentTime;

    // If sound has both audio/white noise and frequency layers
    if ((source.audioGainNode || source.whiteNoiseGenerator) && source.frequencyGainNode) {
      // Update audio/white noise at full volume
      if (source.audioGainNode) {
        source.audioGainNode.gain.cancelScheduledValues(now);
        source.audioGainNode.gain.setValueAtTime(volume, now);
      }
      if (source.whiteNoiseGenerator) {
        source.whiteNoiseGenerator.setVolume(volume);
      }
      
      // Update frequency at 25% of audio volume (subtle enhancement)
      source.frequencyGainNode.gain.cancelScheduledValues(now);
      source.frequencyGainNode.gain.setValueAtTime(volume * 0.25, now);
    }
    // Audio-only sound
    else if (source.audioGainNode && !source.frequencyGainNode) {
      source.audioGainNode.gain.cancelScheduledValues(now);
      source.audioGainNode.gain.setValueAtTime(volume, now);
    }
    // Frequency-only sound
    else if (source.frequencyGainNode && !source.audioGainNode && !source.whiteNoiseGenerator) {
      source.frequencyGainNode.gain.cancelScheduledValues(now);
      source.frequencyGainNode.gain.setValueAtTime(volume, now);
    }
    // White noise only (no frequencies)
    else if (source.whiteNoiseGenerator && !source.frequencyGainNode) {
      source.whiteNoiseGenerator.setVolume(volume);
    }

    // Cosmic ambience
    if (source.cosmicAmbienceGenerator) {
      source.cosmicAmbienceGenerator.setVolume(volume);
    }

    source.volume = volume;
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      const now = this.audioContext!.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(volume, now);
    }
  }

  isSoundPlaying(soundId: string): boolean {
    return this.activeSources.has(soundId);
  }

  getActiveSounds(): string[] {
    return Array.from(this.activeSources.keys());
  }

  getFrequencyGenerator(soundId: string): FrequencySignalGenerator | null {
    const source = this.activeSources.get(soundId);
    return source?.frequencyGenerator || null;
  }

  setCarrierLayerVolume(soundId: string, layerIndex: number, volume: number): void {
    const source = this.activeSources.get(soundId);
    if (source?.frequencyGenerator) {
      source.frequencyGenerator.setCarrierLayerVolume(layerIndex, volume);
    }
  }

  setIsochronicLayerVolume(soundId: string, layerIndex: number, volume: number): void {
    const source = this.activeSources.get(soundId);
    if (source?.frequencyGenerator) {
      source.frequencyGenerator.setIsochronicLayerVolume(layerIndex, volume);
    }
  }

  resetFrequencyLayersToDefaults(soundId: string, originalConfig: FrequencySignalConfig): void {
    const source = this.activeSources.get(soundId);
    if (source?.frequencyGenerator) {
      source.frequencyGenerator.resetToDefaults(originalConfig);
    }
  }

  dispose(): void {
    this.stopAll();
    
    // Clean up keep-alive oscillator
    const keepAliveOsc = (this as any).keepAliveOsc;
    const keepAliveGain = (this as any).keepAliveGain;
    if (keepAliveOsc) {
      keepAliveOsc.stop();
      keepAliveOsc.disconnect();
    }
    if (keepAliveGain) {
      keepAliveGain.disconnect();
    }
    
    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isInitialized = false;
  }

  async ensureContextRunning(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}

export const audioEngine = new AudioEngine();
