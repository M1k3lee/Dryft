export interface CarrierLayerConfig {
  leftFreq: number;
  rightFreq: number;
  beatFreq: number;
  volume: number;
  phaseOffset: number;
}

export interface IsochronicLayerConfig {
  frequency: number;
  pulseRate: number;
  dutyCycle: number;
  volume: number;
}

export interface FrequencySignalConfig {
  name: string;
  description: string;
  targetBeatFreq: number;
  carrierLayers: CarrierLayerConfig[];
  isochronicLayers: IsochronicLayerConfig[];
}

export interface SoundConfig {
  id: string;
  name: string;
  category: 'deep-sleep' | 'light-sleep' | 'relaxation' | 'nature' | 'ambient';
  description: string;
  icon?: string;
  frequencyConfig?: FrequencySignalConfig;
  audioUrl?: string;
  animation?: string;
  color?: string;
}

export interface ActiveSound {
  id: string;
  sound: SoundConfig;
  volume: number; // Actual volume (relative * master)
  relativeVolume?: number; // Relative volume (0-1, independent of master) - optional for backwards compat
  startTime: number;
  timer?: number;
}

export type SoundCategory = SoundConfig['category'];
