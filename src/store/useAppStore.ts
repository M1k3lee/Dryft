import { create } from 'zustand';
import { SoundConfig, ActiveSound, FrequencySignalConfig } from '../types/audio';
import { audioEngine } from '../audio/AudioEngine';
import { getSoundById } from '../data/sounds';
import { getSoundById } from '../data/sounds';

interface AppState {
  activeSounds: Map<string, ActiveSound>;
  masterVolume: number;
  isPlaying: boolean;
  currentTimer: number | null;
  timerDuration: number | null;
  mixMode: boolean; // Allow multiple sounds to play simultaneously
  
  // Actions
  playSound: (sound: SoundConfig, volume?: number) => Promise<void>;
  stopSound: (soundId: string) => Promise<void>;
  stopAll: () => Promise<void>;
  setSoundVolume: (soundId: string, volume: number) => void;
  setMasterVolume: (volume: number) => void;
  setTimer: (minutes: number) => void;
  clearTimer: () => void;
  updateTimer: (remaining: number) => void;
  setCarrierLayerVolume: (soundId: string, layerIndex: number, volume: number) => void;
  setIsochronicLayerVolume: (soundId: string, layerIndex: number, volume: number) => void;
  resetFrequencyLayersToDefaults: (soundId: string) => void;
  toggleMixMode: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeSounds: new Map(),
  masterVolume: 0.7,
  isPlaying: false,
  currentTimer: null,
  timerDuration: null,
  mixMode: false, // Default: single sound mode

  playSound: async (sound: SoundConfig, volume: number = 0.7) => {
    // Initialize audio engine if needed
    if (!audioEngine) {
      await audioEngine.initialize();
    }

    const state = get();
    
    // If sound is already playing, stop it (toggle behavior)
    if (state.activeSounds.has(sound.id)) {
      await state.stopSound(sound.id);
      return;
    }

    // If mix mode is disabled, stop all other sounds (single sound mode)
    if (!state.mixMode && state.activeSounds.size > 0) {
      await state.stopAll();
    }

    // Play sound
    await audioEngine.playSound(sound, volume * state.masterVolume);

    // Store original frequency config for reset functionality
    const originalFrequencyConfig = sound.frequencyConfig 
      ? JSON.parse(JSON.stringify(sound.frequencyConfig)) as FrequencySignalConfig
      : undefined;

    // Add to active sounds
    const activeSound: ActiveSound = {
      id: sound.id,
      sound: {
        ...sound,
        frequencyConfig: originalFrequencyConfig ? JSON.parse(JSON.stringify(sound.frequencyConfig)) : undefined,
      },
      volume: volume * state.masterVolume,
      relativeVolume: volume,
      startTime: Date.now(),
    };

    set((state) => {
      const newActiveSounds = new Map(state.activeSounds);
      newActiveSounds.set(sound.id, activeSound);
      return {
        activeSounds: newActiveSounds,
        isPlaying: true,
      };
    });
  },

  stopSound: async (soundId: string) => {
    await audioEngine.stopSound(soundId);
    
    set((state) => {
      const newActiveSounds = new Map(state.activeSounds);
      newActiveSounds.delete(soundId);
      return {
        activeSounds: newActiveSounds,
        isPlaying: newActiveSounds.size > 0,
      };
    });
  },

  stopAll: async () => {
    await audioEngine.stopAll();
    
    set({
      activeSounds: new Map(),
      isPlaying: false,
    });
  },

  setSoundVolume: (soundId: string, relativeVolume: number) => {
    const state = get();
    const actualVolume = relativeVolume * state.masterVolume;
    
    audioEngine.setSoundVolume(soundId, actualVolume);
    
    set((state) => {
      const newActiveSounds = new Map(state.activeSounds);
      const activeSound = newActiveSounds.get(soundId);
      if (activeSound) {
        activeSound.relativeVolume = relativeVolume;
        activeSound.volume = actualVolume;
        newActiveSounds.set(soundId, activeSound);
      }
      return { activeSounds: newActiveSounds };
    });
  },

  setMasterVolume: (volume: number) => {
    audioEngine.setMasterVolume(volume);
    
    set((state) => {
      // Update all active sound volumes based on relative volumes
      const newActiveSounds = new Map(state.activeSounds);
      newActiveSounds.forEach((activeSound, soundId) => {
        activeSound.volume = activeSound.relativeVolume * volume;
        audioEngine.setSoundVolume(soundId, activeSound.volume);
      });
      
      return {
        masterVolume: volume,
        activeSounds: newActiveSounds,
      };
    });
  },

  setTimer: (minutes: number) => {
    const seconds = minutes * 60;
    set({
      timerDuration: seconds,
      currentTimer: seconds,
    });
  },

  clearTimer: () => {
    set({
      currentTimer: null,
      timerDuration: null,
    });
  },

  updateTimer: (remaining: number) => {
    set({ currentTimer: remaining });
    
    if (remaining <= 0) {
      const state = get();
      state.stopAll();
      state.clearTimer();
    }
  },

  setCarrierLayerVolume: (soundId: string, layerIndex: number, volume: number) => {
    audioEngine.setCarrierLayerVolume(soundId, layerIndex, volume);
  },

  setIsochronicLayerVolume: (soundId: string, layerIndex: number, volume: number) => {
    audioEngine.setIsochronicLayerVolume(soundId, layerIndex, volume);
  },

  resetFrequencyLayersToDefaults: (soundId: string) => {
    const state = get();
    const activeSound = state.activeSounds.get(soundId);
    if (activeSound?.sound.frequencyConfig) {
      // Get original config from sounds data
      const originalSound = getSoundById(soundId);
      if (originalSound?.frequencyConfig) {
        // Deep clone the original config
        const originalConfig = JSON.parse(JSON.stringify(originalSound.frequencyConfig));
        audioEngine.resetFrequencyLayersToDefaults(soundId, originalConfig);
      }
    }
  },

  toggleMixMode: () => {
    set((state) => ({ mixMode: !state.mixMode }));
  },
}));
