export interface CarrierLayerConfig {
  leftFreq: number;
  rightFreq: number;
  beatFreq: number;
  volume: number;
  phaseOffset: number;
}

export class CarrierLayerNode {
  private audioContext: AudioContext;
  private config: CarrierLayerConfig;
  private leftOsc: OscillatorNode | null = null;
  private rightOsc: OscillatorNode | null = null;
  private leftGain: GainNode | null = null;
  private rightGain: GainNode | null = null;
  private merger: ChannelMergerNode | null = null;
  private output: AudioNode | null = null;
  private isPlaying: boolean = false;

  constructor(audioContext: AudioContext, config: CarrierLayerConfig) {
    this.audioContext = audioContext;
    this.config = config;
    this.createNodes();
  }

  private createNodes(): void {
    // Create oscillators
    this.leftOsc = this.audioContext.createOscillator();
    this.rightOsc = this.audioContext.createOscillator();

    // Set oscillator type and frequencies
    this.leftOsc.type = 'sine';
    this.rightOsc.type = 'sine';
    this.leftOsc.frequency.value = this.config.leftFreq;
    this.rightOsc.frequency.value = this.config.rightFreq;

    // Create gain nodes for volume control
    this.leftGain = this.audioContext.createGain();
    this.rightGain = this.audioContext.createGain();

    // Initialize gains to 0 for smooth start
    this.leftGain.gain.value = 0;
    this.rightGain.gain.value = 0;

    // Create channel merger for stereo output
    this.merger = this.audioContext.createChannelMerger(2);

    // Connect: Osc → Gain → Merger
    this.leftOsc.connect(this.leftGain);
    this.rightOsc.connect(this.rightGain);
    this.leftGain.connect(this.merger, 0, 0);  // Left channel
    this.rightGain.connect(this.merger, 0, 1); // Right channel

    this.output = this.merger;
  }

  public getOutput(): AudioNode | null {
    return this.output;
  }

  public start(): void {
    if (this.isPlaying || !this.leftOsc || !this.rightOsc || !this.leftGain || !this.rightGain) {
      return;
    }

    const now = this.audioContext.currentTime;

    // Start oscillators
    this.leftOsc.start(now);
    this.rightOsc.start(now);

    // Smooth fade-in (50ms)
    this.leftGain.gain.cancelScheduledValues(now);
    this.rightGain.gain.cancelScheduledValues(now);
    this.leftGain.gain.setValueAtTime(0, now);
    this.rightGain.gain.setValueAtTime(0, now);
    this.leftGain.gain.linearRampToValueAtTime(this.config.volume, now + 0.05);
    this.rightGain.gain.linearRampToValueAtTime(this.config.volume, now + 0.05);

    this.isPlaying = true;
  }

  public stop(): void {
    if (!this.isPlaying || !this.leftOsc || !this.rightOsc || !this.leftGain || !this.rightGain) {
      return;
    }

    const now = this.audioContext.currentTime;

    // Smooth fade-out (50ms)
    const currentLeftGain = this.leftGain.gain.value;
    const currentRightGain = this.rightGain.gain.value;

    this.leftGain.gain.cancelScheduledValues(now);
    this.rightGain.gain.cancelScheduledValues(now);
    this.leftGain.gain.setValueAtTime(currentLeftGain, now);
    this.rightGain.gain.setValueAtTime(currentRightGain, now);
    this.leftGain.gain.linearRampToValueAtTime(0, now + 0.05);
    this.rightGain.gain.linearRampToValueAtTime(0, now + 0.05);

    // Stop oscillators after fade
    this.leftOsc.stop(now + 0.06);
    this.rightOsc.stop(now + 0.06);

    this.isPlaying = false;

    // Clean up
    this.leftOsc = null;
    this.rightOsc = null;
  }

  public setVolume(volume: number): void {
    this.config.volume = volume;
    if (this.leftGain && this.rightGain && this.isPlaying) {
      const now = this.audioContext.currentTime;
      this.leftGain.gain.cancelScheduledValues(now);
      this.rightGain.gain.cancelScheduledValues(now);
      this.leftGain.gain.setValueAtTime(volume, now);
      this.rightGain.gain.setValueAtTime(volume, now);
    }
  }

  public dispose(): void {
    this.stop();
    this.output = null;
    this.leftGain = null;
    this.rightGain = null;
    this.merger = null;
  }
}



