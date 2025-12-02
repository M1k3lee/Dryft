import { CarrierLayerNode } from './CarrierLayer';
import { IsochronicNode } from './IsochronicLayer';
import { FrequencySignalConfig } from '../types/audio';

export class FrequencySignalGenerator {
  private audioContext: AudioContext;
  private config: FrequencySignalConfig | null = null;
  private carrierLayers: CarrierLayerNode[] = [];
  private isochronicLayers: IsochronicNode[] = [];
  private masterGain: GainNode | null = null;
  private output: AudioNode | null = null;
  private isInitialized: boolean = false;
  private isPlaying: boolean = false;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.createMasterGain();
  }

  private createMasterGain(): void {
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 1.0;
    this.output = this.masterGain;
  }

  public initialize(config: FrequencySignalConfig): void {
    // Dispose existing layers
    this.disposeLayers();

    this.config = config;

    // Create carrier layers
    this.carrierLayers = config.carrierLayers.map(carrierConfig => {
      const layer = new CarrierLayerNode(this.audioContext, carrierConfig);
      const output = layer.getOutput();
      if (output) {
        output.connect(this.masterGain!);
      }
      return layer;
    });

    // Create isochronic layers
    this.isochronicLayers = config.isochronicLayers.map(isoConfig => {
      const layer = new IsochronicNode(this.audioContext, isoConfig);
      const output = layer.getOutput();
      if (output) {
        output.connect(this.masterGain!);
      }
      return layer;
    });

    this.isInitialized = true;
  }

  public start(): void {
    if (!this.isInitialized) {
      throw new Error('FrequencySignalGenerator must be initialized before starting');
    }

    if (this.isPlaying) {
      return;
    }

    // Start all layers
    this.carrierLayers.forEach(layer => layer.start());
    this.isochronicLayers.forEach(layer => layer.start());

    this.isPlaying = true;
  }

  public stop(): void {
    if (!this.isPlaying) {
      return;
    }

    // Stop all layers
    this.carrierLayers.forEach(layer => layer.stop());
    this.isochronicLayers.forEach(layer => layer.stop());

    this.isPlaying = false;
  }

  public setVolume(volume: number): void {
    if (this.masterGain) {
      const now = this.audioContext.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(volume, now);
    }
  }

  public getOutput(): AudioNode | null {
    return this.output;
  }

  private disposeLayers(): void {
    this.carrierLayers.forEach(layer => layer.dispose());
    this.isochronicLayers.forEach(layer => layer.dispose());
    this.carrierLayers = [];
    this.isochronicLayers = [];
  }

  public getCarrierLayers(): CarrierLayerNode[] {
    return this.carrierLayers;
  }

  public getIsochronicLayers(): IsochronicNode[] {
    return this.isochronicLayers;
  }

  public getConfig(): FrequencySignalConfig | null {
    return this.config;
  }

  public setCarrierLayerVolume(layerIndex: number, volume: number): void {
    if (layerIndex >= 0 && layerIndex < this.carrierLayers.length) {
      this.carrierLayers[layerIndex].setVolume(volume);
      if (this.config) {
        this.config.carrierLayers[layerIndex].volume = volume;
      }
    }
  }

  public setIsochronicLayerVolume(layerIndex: number, volume: number): void {
    if (layerIndex >= 0 && layerIndex < this.isochronicLayers.length) {
      this.isochronicLayers[layerIndex].setVolume(volume);
      if (this.config) {
        this.config.isochronicLayers[layerIndex].volume = volume;
      }
    }
  }

  public resetToDefaults(originalConfig: FrequencySignalConfig): void {
    if (!this.config) return;
    
    // Reset carrier layers
    originalConfig.carrierLayers.forEach((originalLayer, index) => {
      if (index < this.carrierLayers.length) {
        this.carrierLayers[index].setVolume(originalLayer.volume);
        this.config!.carrierLayers[index].volume = originalLayer.volume;
      }
    });

    // Reset isochronic layers
    originalConfig.isochronicLayers.forEach((originalLayer, index) => {
      if (index < this.isochronicLayers.length) {
        this.isochronicLayers[index].setVolume(originalLayer.volume);
        this.config!.isochronicLayers[index].volume = originalLayer.volume;
      }
    });
  }

  public dispose(): void {
    this.stop();
    this.disposeLayers();
    
    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch (e) {
        // Ignore if already disconnected
      }
      this.masterGain = null;
    }
    
    this.output = null;
    this.isInitialized = false;
    this.config = null;
  }
}
