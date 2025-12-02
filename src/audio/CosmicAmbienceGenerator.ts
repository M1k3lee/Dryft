import { WhiteNoiseGenerator } from './WhiteNoiseGenerator';

interface CosmicState {
  name: string;
  baseFreq: number; // Base frequency for the cosmic tone
  beatFreq: number; // Beat frequency for entrainment
  harmonics: number[]; // Harmonic frequencies to layer
  volume: number;
}

export class CosmicAmbienceGenerator {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private output: AudioNode;
  
  // Frequency layers
  private primaryOscLeft: OscillatorNode | null = null;
  private primaryOscRight: OscillatorNode | null = null;
  private primaryGainLeft: GainNode | null = null;
  private primaryGainRight: GainNode | null = null;
  private primaryMerger: ChannelMergerNode | null = null;
  private harmonicOscs: OscillatorNode[] = [];
  private harmonicGains: GainNode[] = [];
  
  // White noise layer
  private whiteNoise: WhiteNoiseGenerator | null = null;
  private whiteNoiseGain: GainNode | null = null;
  
  // State management
  private isPlaying: boolean = false;
  private currentState: CosmicState | null = null;
  private stateTransitionTimeout: number | null = null;
  private whiteNoiseTimeout: number | null = null;
  
  // Cosmic states - different "locations" in the cosmic journey
  private cosmicStates: CosmicState[] = [
    {
      name: 'Deep Space',
      baseFreq: 40, // Low, deep cosmic tone
      beatFreq: 2.0, // Delta for deep sleep
      harmonics: [80, 120, 160],
      volume: 0.7,
    },
    {
      name: 'Nebula Drift',
      baseFreq: 55,
      beatFreq: 3.5, // Deep theta
      harmonics: [110, 165, 220],
      volume: 0.65,
    },
    {
      name: 'Stellar Wind',
      baseFreq: 65,
      beatFreq: 4.5, // Theta
      harmonics: [130, 195, 260],
      volume: 0.7,
    },
    {
      name: 'Cosmic Resonance',
      baseFreq: 50,
      beatFreq: 7.83, // Schumann resonance
      harmonics: [100, 150, 200],
      volume: 0.68,
    },
    {
      name: 'Void Echo',
      baseFreq: 35,
      beatFreq: 2.5, // Deep delta
      harmonics: [70, 105, 140],
      volume: 0.72,
    },
    {
      name: 'Quantum Drift',
      baseFreq: 60,
      beatFreq: 5.0, // Theta
      harmonics: [120, 180, 240],
      volume: 0.66,
    },
  ];

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.masterGain = audioContext.createGain();
    this.masterGain.gain.value = 1.0;
    this.output = this.masterGain;
  }

  public getOutput(): AudioNode {
    return this.output;
  }

  public start(): void {
    if (this.isPlaying) {
      return;
    }

    const now = this.audioContext.currentTime;

    // Create primary oscillators for binaural beats (left and right)
    this.primaryOscLeft = this.audioContext.createOscillator();
    this.primaryOscRight = this.audioContext.createOscillator();
    this.primaryOscLeft.type = 'sine';
    this.primaryOscRight.type = 'sine';
    
    // Create gains for left and right channels
    this.primaryGainLeft = this.audioContext.createGain();
    this.primaryGainRight = this.audioContext.createGain();
    this.primaryGainLeft.gain.value = 0;
    this.primaryGainRight.gain.value = 0;
    
    // Create channel merger for stereo output
    this.primaryMerger = this.audioContext.createChannelMerger(2);
    
    // Connect: Osc → Gain → Merger
    this.primaryOscLeft.connect(this.primaryGainLeft);
    this.primaryOscRight.connect(this.primaryGainRight);
    this.primaryGainLeft.connect(this.primaryMerger, 0, 0); // Left channel
    this.primaryGainRight.connect(this.primaryMerger, 0, 1); // Right channel
    this.primaryMerger.connect(this.masterGain);

    // Create harmonic oscillators
    this.harmonicOscs = [];
    this.harmonicGains = [];
    
    for (let i = 0; i < 3; i++) {
      const osc = this.audioContext.createOscillator();
      osc.type = 'sine';
      const gain = this.audioContext.createGain();
      gain.gain.value = 0;
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      this.harmonicOscs.push(osc);
      this.harmonicGains.push(gain);
    }

    // Create white noise layer
    this.whiteNoise = new WhiteNoiseGenerator(this.audioContext);
    this.whiteNoiseGain = this.audioContext.createGain();
    this.whiteNoiseGain.gain.value = 0;
    
    const whiteNoiseOutput = this.whiteNoise.getOutput();
    if (whiteNoiseOutput) {
      whiteNoiseOutput.connect(this.whiteNoiseGain);
      this.whiteNoiseGain.connect(this.masterGain);
    }

    // Start all oscillators
    this.primaryOscLeft.start(now);
    this.primaryOscRight.start(now);
    this.harmonicOscs.forEach(osc => osc.start(now));
    this.whiteNoise.start();

    // Fade in
    if (this.primaryGainLeft && this.primaryGainRight) {
      this.primaryGainLeft.gain.setValueAtTime(0, now);
      this.primaryGainRight.gain.setValueAtTime(0, now);
      this.primaryGainLeft.gain.linearRampToValueAtTime(0.6, now + 2.0); // Slow fade in
      this.primaryGainRight.gain.linearRampToValueAtTime(0.6, now + 2.0);
    }
    
    this.harmonicGains.forEach((gain, i) => {
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15 - (i * 0.03), now + 2.0);
    });

    // Start the cosmic journey
    this.transitionToState(this.cosmicStates[0], now + 2.0);
    this.scheduleStateTransitions();
    this.scheduleWhiteNoiseEvents();

    this.isPlaying = true;
  }

  private transitionToState(state: CosmicState, startTime: number): void {
    if (!this.primaryOscLeft || !this.primaryOscRight || this.harmonicOscs.length === 0) return;

    const transitionDuration = 8.0; // 8 seconds for smooth transition
    const endTime = startTime + transitionDuration;

    // Transition primary oscillators (create binaural beat)
    const currentFreqLeft = this.primaryOscLeft.frequency.value;
    const currentFreqRight = this.primaryOscRight.frequency.value;
    
    // Left and right frequencies differ by beatFreq to create binaural beat
    const leftFreq = state.baseFreq;
    const rightFreq = state.baseFreq + state.beatFreq;
    
    this.primaryOscLeft.frequency.cancelScheduledValues(startTime);
    this.primaryOscRight.frequency.cancelScheduledValues(startTime);
    this.primaryOscLeft.frequency.setValueAtTime(currentFreqLeft, startTime);
    this.primaryOscRight.frequency.setValueAtTime(currentFreqRight, startTime);
    this.primaryOscLeft.frequency.linearRampToValueAtTime(leftFreq, endTime);
    this.primaryOscRight.frequency.linearRampToValueAtTime(rightFreq, endTime);

    // Transition harmonics
    state.harmonics.forEach((harmonic, i) => {
      if (i < this.harmonicOscs.length) {
        const osc = this.harmonicOscs[i];
        const currentHarmonic = osc.frequency.value;
        osc.frequency.cancelScheduledValues(startTime);
        osc.frequency.setValueAtTime(currentHarmonic, startTime);
        osc.frequency.linearRampToValueAtTime(harmonic, endTime);
      }
    });

    // Transition volumes
    if (this.primaryGainLeft && this.primaryGainRight) {
      const currentGain = this.primaryGainLeft.gain.value;
      this.primaryGainLeft.gain.cancelScheduledValues(startTime);
      this.primaryGainRight.gain.cancelScheduledValues(startTime);
      this.primaryGainLeft.gain.setValueAtTime(currentGain, startTime);
      this.primaryGainRight.gain.setValueAtTime(currentGain, startTime);
      this.primaryGainLeft.gain.linearRampToValueAtTime(state.volume, endTime);
      this.primaryGainRight.gain.linearRampToValueAtTime(state.volume, endTime);
    }

    this.harmonicGains.forEach((gain, i) => {
      const targetVolume = 0.15 - (i * 0.03);
      gain.gain.cancelScheduledValues(startTime);
      gain.gain.setValueAtTime(gain.gain.value, startTime);
      gain.gain.linearRampToValueAtTime(targetVolume, endTime);
    });

    this.currentState = state;
  }

  private scheduleStateTransitions(): void {
    if (!this.isPlaying) return;

    // Random time between 15-30 seconds for next transition
    const delay = 15000 + Math.random() * 15000;
    
    this.stateTransitionTimeout = setTimeout(() => {
      if (!this.isPlaying) return;

      // Choose a different state (not the current one)
      const availableStates = this.cosmicStates.filter(s => s !== this.currentState);
      const nextState = availableStates[Math.floor(Math.random() * availableStates.length)];
      
      const now = this.audioContext.currentTime;
      this.transitionToState(nextState, now);
      
      // Schedule next transition
      this.scheduleStateTransitions();
    }, delay) as unknown as number;
  }

  private scheduleWhiteNoiseEvents(): void {
    if (!this.isPlaying || !this.whiteNoiseGain) return;

    // Random time between 8-20 seconds
    const delay = 8000 + Math.random() * 12000;
    
    this.whiteNoiseTimeout = setTimeout(() => {
      if (!this.isPlaying || !this.whiteNoiseGain) return;

      const now = this.audioContext.currentTime;
      const fadeDuration = 3.0 + Math.random() * 4.0; // 3-7 second fade
      const holdDuration = 2.0 + Math.random() * 5.0; // 2-7 second hold
      
      const currentGain = this.whiteNoiseGain.gain.value;
      const targetGain = currentGain < 0.1 ? 0.15 + Math.random() * 0.1 : 0; // Fade in or out
      
      // Fade in/out
      this.whiteNoiseGain.gain.cancelScheduledValues(now);
      this.whiteNoiseGain.gain.setValueAtTime(currentGain, now);
      this.whiteNoiseGain.gain.linearRampToValueAtTime(targetGain, now + fadeDuration);
      
      // Hold, then fade back
      if (targetGain > 0) {
        this.whiteNoiseGain.gain.setValueAtTime(targetGain, now + fadeDuration);
        this.whiteNoiseGain.gain.linearRampToValueAtTime(0, now + fadeDuration + holdDuration);
      }
      
      // Schedule next white noise event
      this.scheduleWhiteNoiseEvents();
    }, delay) as unknown as number;
  }

  public stop(): void {
    if (!this.isPlaying) return;

    const now = this.audioContext.currentTime;

    // Clear timeouts
    if (this.stateTransitionTimeout !== null) {
      clearTimeout(this.stateTransitionTimeout);
      this.stateTransitionTimeout = null;
    }
    if (this.whiteNoiseTimeout !== null) {
      clearTimeout(this.whiteNoiseTimeout);
      this.whiteNoiseTimeout = null;
    }

    // Fade out
    if (this.primaryGainLeft && this.primaryGainRight) {
      this.primaryGainLeft.gain.cancelScheduledValues(now);
      this.primaryGainRight.gain.cancelScheduledValues(now);
      this.primaryGainLeft.gain.linearRampToValueAtTime(0, now + 2.0);
      this.primaryGainRight.gain.linearRampToValueAtTime(0, now + 2.0);
    }

    this.harmonicGains.forEach(gain => {
      gain.gain.cancelScheduledValues(now);
      gain.gain.linearRampToValueAtTime(0, now + 2.0);
    });

    if (this.whiteNoiseGain) {
      this.whiteNoiseGain.gain.cancelScheduledValues(now);
      this.whiteNoiseGain.gain.linearRampToValueAtTime(0, now + 2.0);
    }

    // Stop after fade
    setTimeout(() => {
      if (this.primaryOscLeft) {
        this.primaryOscLeft.stop();
        this.primaryOscLeft = null;
      }
      if (this.primaryOscRight) {
        this.primaryOscRight.stop();
        this.primaryOscRight = null;
      }
      this.harmonicOscs.forEach(osc => osc.stop());
      this.harmonicOscs = [];
      if (this.whiteNoise) {
        this.whiteNoise.stop();
        this.whiteNoise = null;
      }
    }, 2100);

    this.isPlaying = false;
  }

  public setVolume(volume: number): void {
    if (this.masterGain) {
      const now = this.audioContext.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(volume, now);
    }
  }

  public dispose(): void {
    this.stop();
    
    if (this.primaryGainLeft) {
      this.primaryGainLeft.disconnect();
    }
    if (this.primaryGainRight) {
      this.primaryGainRight.disconnect();
    }
    if (this.primaryMerger) {
      this.primaryMerger.disconnect();
    }
    
    if (this.masterGain) {
      this.masterGain.disconnect();
    }
    
    this.harmonicGains.forEach(gain => gain.disconnect());
    this.harmonicGains = [];
    
    if (this.whiteNoiseGain) {
      this.whiteNoiseGain.disconnect();
    }
    
    if (this.whiteNoise) {
      this.whiteNoise.dispose();
    }
  }
}
