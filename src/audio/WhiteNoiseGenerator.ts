export class WhiteNoiseGenerator {
  private audioContext: AudioContext;
  private bufferSize: number = 4096;
  private noiseBuffer: AudioBuffer | null = null;
  private source: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private output: AudioNode | null = null;
  private isPlaying: boolean = false;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.createNoiseBuffer();
  }

  private createNoiseBuffer(): void {
    // Create a buffer with white noise
    this.noiseBuffer = this.audioContext.createBuffer(
      2, // Stereo
      this.bufferSize,
      this.audioContext.sampleRate
    );

    // Fill both channels with random noise
    for (let channel = 0; channel < this.noiseBuffer.numberOfChannels; channel++) {
      const channelData = this.noiseBuffer.getChannelData(channel);
      for (let i = 0; i < this.bufferSize; i++) {
        // Generate white noise (random values between -1 and 1)
        channelData[i] = Math.random() * 2 - 1;
      }
    }
  }

  public getOutput(): AudioNode | null {
    return this.output;
  }

  public start(): void {
    if (this.isPlaying || !this.noiseBuffer) {
      return;
    }

    // Create gain node
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;

    // Create buffer source
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.noiseBuffer;
    this.source.loop = true;

    // Connect: Source → Gain
    this.source.connect(this.gainNode);
    this.output = this.gainNode;

    // Start playback
    this.source.start(0);

    // Smooth fade-in (50ms)
    const now = this.audioContext.currentTime;
    this.gainNode.gain.setValueAtTime(0, now);
    this.gainNode.gain.linearRampToValueAtTime(1, now + 0.05);

    this.isPlaying = true;
  }

  public stop(): void {
    if (!this.isPlaying || !this.gainNode) {
      return;
    }

    const now = this.audioContext.currentTime;

    // Smooth fade-out (50ms)
    const currentGain = this.gainNode.gain.value;
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(currentGain, now);
    this.gainNode.gain.linearRampToValueAtTime(0, now + 0.05);

    // Stop source after fade
    if (this.source) {
      this.source.stop(now + 0.06);
      this.source = null;
    }

    this.isPlaying = false;
  }

  public setVolume(volume: number): void {
    if (this.gainNode && this.isPlaying) {
      const now = this.audioContext.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(volume, now);
    }
  }

  public dispose(): void {
    this.stop();
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    this.output = null;
    this.noiseBuffer = null;
  }
}



