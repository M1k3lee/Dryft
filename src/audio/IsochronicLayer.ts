export interface IsochronicLayerConfig {
  frequency: number;
  pulseRate: number;
  dutyCycle: number;
  volume: number;
}

export class IsochronicNode {
  private audioContext: AudioContext;
  private config: IsochronicLayerConfig;
  private baseOsc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private output: AudioNode | null = null;
  private isPlaying: boolean = false;
  private scheduleId: number | null = null;

  constructor(audioContext: AudioContext, config: IsochronicLayerConfig) {
    this.audioContext = audioContext;
    this.config = config;
    this.createNodes();
  }

  private createNodes(): void {
    // Create base oscillator
    this.baseOsc = this.audioContext.createOscillator();
    this.baseOsc.type = 'sine';
    this.baseOsc.frequency.value = this.config.frequency;

    // Create gain node for volume control and pulsing
    this.gain = this.audioContext.createGain();
    this.gain.gain.value = 0;

    // Connect: Base Osc → Gain
    this.baseOsc.connect(this.gain);

    this.output = this.gain;
  }

  public getOutput(): AudioNode | null {
    return this.output;
  }

  public start(): void {
    if (this.isPlaying || !this.baseOsc || !this.gain) {
      return;
    }

    const now = this.audioContext.currentTime;
    const startTime = now + 0.05; // Start after fade-in

    // Start oscillator
    this.baseOsc.start(now);

    // Smooth fade-in (50ms)
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(0, now);
    
    const minGain = 0;
    const maxGain = this.config.volume;
    const centerGain = minGain + (maxGain - minGain) * this.config.dutyCycle;
    
    this.gain.gain.linearRampToValueAtTime(centerGain, startTime);

    // Schedule pulsing using Web Audio API timing
    this.schedulePulses(startTime);

    this.isPlaying = true;
  }

  private schedulePulses(startTime: number): void {
    if (!this.gain || !this.isPlaying) return;

    const minGain = 0;
    const maxGain = this.config.volume;
    const pulsePeriod = 1 / this.config.pulseRate; // seconds per pulse
    const onTime = pulsePeriod * this.config.dutyCycle;

    let currentTime = startTime;
    const duration = 3600; // Schedule for 1 hour max

    // Schedule pulses for the next hour
    while (currentTime < startTime + duration && this.isPlaying) {
      // Turn on
      this.gain.gain.setValueAtTime(maxGain, currentTime);
      
      // Turn off
      this.gain.gain.setValueAtTime(minGain, currentTime + onTime);

      currentTime += pulsePeriod;
    }

    // Schedule next batch if still playing
    if (this.isPlaying) {
      this.scheduleId = requestAnimationFrame(() => {
        if (this.isPlaying && this.gain) {
          this.schedulePulses(currentTime);
        }
      }) as unknown as number;
    }
  }

  public stop(): void {
    if (!this.isPlaying || !this.baseOsc || !this.gain) {
      return;
    }

    const now = this.audioContext.currentTime;

    // Clear schedule
    if (this.scheduleId !== null) {
      cancelAnimationFrame(this.scheduleId);
      this.scheduleId = null;
    }

    // Smooth fade-out (50ms)
    const currentGain = this.gain.gain.value;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(currentGain, now);
    this.gain.gain.linearRampToValueAtTime(0, now + 0.05);

    // Stop oscillator after fade
    this.baseOsc.stop(now + 0.06);

    this.isPlaying = false;

    // Clean up
    this.baseOsc = null;
  }

  public setVolume(volume: number): void {
    this.config.volume = volume;
    // Cancel and reschedule with new volume
    if (this.isPlaying) {
      const now = this.audioContext.currentTime;
      if (this.gain) {
        const currentGain = this.gain.gain.value;
        this.gain.gain.cancelScheduledValues(now);
        this.gain.gain.setValueAtTime(currentGain, now);
      }
      if (this.scheduleId !== null) {
        cancelAnimationFrame(this.scheduleId);
      }
      this.schedulePulses(now);
    }
  }

  public dispose(): void {
    this.stop();
    if (this.scheduleId !== null) {
      cancelAnimationFrame(this.scheduleId);
      this.scheduleId = null;
    }
    this.output = null;
    this.gain = null;
  }
}