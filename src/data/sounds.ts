import { SoundConfig, FrequencySignalConfig } from '../types/audio';

// Deep Sleep Frequency Configuration (Delta waves: 0.5-4 Hz)
const deepSleepConfig: FrequencySignalConfig = {
  name: 'Deep Sleep',
  description: 'Delta waves for deep restorative sleep',
  targetBeatFreq: 2.0,
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 102.0, beatFreq: 2.0, volume: 0.85, phaseOffset: 0 },
    { leftFreq: 150.0, rightFreq: 152.0, beatFreq: 2.0, volume: 0.70, phaseOffset: Math.PI / 4 },
    { leftFreq: 200.0, rightFreq: 202.0, beatFreq: 2.0, volume: 0.60, phaseOffset: Math.PI / 2 },
    { leftFreq: 250.0, rightFreq: 252.0, beatFreq: 2.0, volume: 0.55, phaseOffset: Math.PI / 3 },
    { leftFreq: 300.0, rightFreq: 302.0, beatFreq: 2.0, volume: 0.50, phaseOffset: Math.PI },
  ],
  isochronicLayers: [
    { frequency: 2.0, pulseRate: 2.0, dutyCycle: 0.5, volume: 0.30 },
    { frequency: 4.0, pulseRate: 2.0, dutyCycle: 0.4, volume: 0.20 },
  ],
};

// Theta Sleep Configuration (4-8 Hz) - Light sleep and meditation
const thetaSleepConfig: FrequencySignalConfig = {
  name: 'Theta Sleep',
  description: 'Theta waves for light sleep and deep relaxation',
  targetBeatFreq: 5.0,
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 105.0, beatFreq: 5.0, volume: 0.88, phaseOffset: 0 },
    { leftFreq: 150.0, rightFreq: 155.0, beatFreq: 5.0, volume: 0.72, phaseOffset: Math.PI / 5 },
    { leftFreq: 200.0, rightFreq: 205.0, beatFreq: 5.0, volume: 0.68, phaseOffset: (2 * Math.PI) / 5 },
    { leftFreq: 250.0, rightFreq: 255.0, beatFreq: 5.0, volume: 0.62, phaseOffset: (3 * Math.PI) / 5 },
    { leftFreq: 300.0, rightFreq: 305.0, beatFreq: 5.0, volume: 0.58, phaseOffset: (4 * Math.PI) / 5 },
  ],
  isochronicLayers: [
    { frequency: 5.0, pulseRate: 5.0, dutyCycle: 0.5, volume: 0.28 },
    { frequency: 10.0, pulseRate: 5.0, dutyCycle: 0.45, volume: 0.18 },
  ],
};

// Alpha Relaxation Configuration (8-12 Hz)
const alphaRelaxConfig: FrequencySignalConfig = {
  name: 'Alpha Relaxation',
  description: 'Alpha waves for calm relaxation',
  targetBeatFreq: 10.0,
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 110.0, beatFreq: 10.0, volume: 0.85, phaseOffset: 0 },
    { leftFreq: 200.0, rightFreq: 210.0, beatFreq: 10.0, volume: 0.70, phaseOffset: Math.PI / 6 },
    { leftFreq: 300.0, rightFreq: 310.0, beatFreq: 10.0, volume: 0.60, phaseOffset: Math.PI / 3 },
  ],
  isochronicLayers: [
    { frequency: 10.0, pulseRate: 10.0, dutyCycle: 0.5, volume: 0.25 },
  ],
};

// Schumann Resonance Configuration (7.83 Hz)
const schumannConfig: FrequencySignalConfig = {
  name: 'Schumann Resonance',
  description: "Earth's natural frequency for grounding and balance",
  targetBeatFreq: 7.83,
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 107.83, beatFreq: 7.83, volume: 0.80, phaseOffset: 0 },
    { leftFreq: 200.0, rightFreq: 207.83, beatFreq: 7.83, volume: 0.65, phaseOffset: Math.PI / 4 },
    { leftFreq: 300.0, rightFreq: 307.83, beatFreq: 7.83, volume: 0.50, phaseOffset: Math.PI / 2 },
    { leftFreq: 150.0, rightFreq: 157.83, beatFreq: 7.83, volume: 0.60, phaseOffset: Math.PI / 6 },
  ],
  isochronicLayers: [
    { frequency: 7.83, pulseRate: 7.83, dutyCycle: 0.5, volume: 0.30 },
  ],
};

// Lullaby with embedded frequencies (uses theta with gentle modulation)
const lullabyFrequencyConfig: FrequencySignalConfig = {
  name: 'Dreamy Lullaby',
  description: 'Soft lullaby tones with embedded sleep frequencies',
  targetBeatFreq: 4.5,
  carrierLayers: [
    { leftFreq: 180.0, rightFreq: 184.5, beatFreq: 4.5, volume: 0.75, phaseOffset: 0 },
    { leftFreq: 220.0, rightFreq: 224.5, beatFreq: 4.5, volume: 0.65, phaseOffset: Math.PI / 4 },
    { leftFreq: 260.0, rightFreq: 264.5, beatFreq: 4.5, volume: 0.55, phaseOffset: Math.PI / 2 },
  ],
  isochronicLayers: [
    { frequency: 4.5, pulseRate: 4.5, dutyCycle: 0.45, volume: 0.20 },
    { frequency: 9.0, pulseRate: 4.5, dutyCycle: 0.40, volume: 0.15 },
  ],
};

// Soft seamless lullaby frequencies - gentle theta waves to mask loop transitions
const seamlessLullabyConfig: FrequencySignalConfig = {
  name: 'Seamless Lullaby',
  description: 'Gentle theta waves for seamless looping and deep relaxation',
  targetBeatFreq: 4.0, // Slightly slower for deeper relaxation
  carrierLayers: [
    { leftFreq: 200.0, rightFreq: 204.0, beatFreq: 4.0, volume: 0.60, phaseOffset: 0 },
    { leftFreq: 240.0, rightFreq: 244.0, beatFreq: 4.0, volume: 0.50, phaseOffset: Math.PI / 3 },
    { leftFreq: 280.0, rightFreq: 284.0, beatFreq: 4.0, volume: 0.45, phaseOffset: (2 * Math.PI) / 3 },
  ],
  isochronicLayers: [
    { frequency: 4.0, pulseRate: 4.0, dutyCycle: 0.40, volume: 0.18 }, // Softer pulse
    { frequency: 8.0, pulseRate: 4.0, dutyCycle: 0.35, volume: 0.12 }, // Gentle harmonic
  ],
};

// Subtle frequency configurations for audio-based sounds (25% volume when mixed)
// Delta waves for deep sleep sounds
const deltaSubtleConfig: FrequencySignalConfig = {
  name: 'Delta Enhancement',
  description: 'Subtle delta waves for deep sleep enhancement',
  targetBeatFreq: 2.0,
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 102.0, beatFreq: 2.0, volume: 0.60, phaseOffset: 0 },
    { leftFreq: 150.0, rightFreq: 152.0, beatFreq: 2.0, volume: 0.50, phaseOffset: Math.PI / 4 },
  ],
  isochronicLayers: [
    { frequency: 2.0, pulseRate: 2.0, dutyCycle: 0.5, volume: 0.20 },
  ],
};

// Theta waves for relaxation sounds
const thetaSubtleConfig: FrequencySignalConfig = {
  name: 'Theta Enhancement',
  description: 'Subtle theta waves for relaxation enhancement',
  targetBeatFreq: 4.5,
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 104.5, beatFreq: 4.5, volume: 0.65, phaseOffset: 0 },
    { leftFreq: 150.0, rightFreq: 154.5, beatFreq: 4.5, volume: 0.55, phaseOffset: Math.PI / 4 },
  ],
  isochronicLayers: [
    { frequency: 4.5, pulseRate: 4.5, dutyCycle: 0.45, volume: 0.18 },
  ],
};

// Theta waves for light sleep/meditation
const thetaLightConfig: FrequencySignalConfig = {
  name: 'Theta Light Enhancement',
  description: 'Subtle theta waves for light sleep enhancement',
  targetBeatFreq: 5.0,
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 105.0, beatFreq: 5.0, volume: 0.65, phaseOffset: 0 },
    { leftFreq: 150.0, rightFreq: 155.0, beatFreq: 5.0, volume: 0.55, phaseOffset: Math.PI / 5 },
  ],
  isochronicLayers: [
    { frequency: 5.0, pulseRate: 5.0, dutyCycle: 0.5, volume: 0.18 },
  ],
};

// Alpha waves for calm/zen sounds
const alphaSubtleConfig: FrequencySignalConfig = {
  name: 'Alpha Enhancement',
  description: 'Subtle alpha waves for calm enhancement',
  targetBeatFreq: 10.0,
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 110.0, beatFreq: 10.0, volume: 0.60, phaseOffset: 0 },
    { leftFreq: 200.0, rightFreq: 210.0, beatFreq: 10.0, volume: 0.50, phaseOffset: Math.PI / 6 },
  ],
  isochronicLayers: [
    { frequency: 10.0, pulseRate: 10.0, dutyCycle: 0.5, volume: 0.15 },
  ],
};

export const sounds: SoundConfig[] = [
  // Deep Sleep - Frequency-based sounds for deep restorative sleep
  {
    id: 'deep-sleep',
    name: 'Deep Sleep Waves',
    category: 'deep-sleep',
    description: 'Delta brainwaves for deep, restorative sleep',
    frequencyConfig: deepSleepConfig,
    animation: 'stars',
    color: '#6366f1',
  },
  {
    id: 'schumann',
    name: 'Schumann Resonance',
    category: 'deep-sleep',
    description: "Earth's natural frequency for grounding and deep sleep",
    frequencyConfig: schumannConfig,
    animation: 'spiral',
    color: '#10b981',
  },
  {
    id: 'airplane-cabin',
    name: 'Airplane Cabin',
    category: 'deep-sleep',
    description: 'Soothing white noise of an airplane cabin with deep sleep frequencies',
    audioUrl: '/sounds/drift-airplane-cabin.mp3',
    frequencyConfig: deltaSubtleConfig, // Delta for deep sleep
    animation: 'clouds',
    color: '#64748b',
  },
  {
    id: 'thunderstorm',
    name: 'Distant Thunderstorm',
    category: 'deep-sleep',
    description: 'Distant rumbling thunder with gentle rain and deep sleep frequencies',
    audioUrl: '/sounds/drift-thunder.mp3',
    frequencyConfig: deltaSubtleConfig, // Delta for deep sleep
    animation: 'storm',
    color: '#1e293b',
  },

  // Light Sleep - For falling asleep and light sleep
  {
    id: 'theta-sleep',
    name: 'Theta Sleep',
    category: 'light-sleep',
    description: 'Theta waves for light sleep and meditation',
    frequencyConfig: thetaSleepConfig,
    animation: 'waves',
    color: '#8b5cf6',
  },
  {
    id: 'dreamy-lullaby',
    name: 'Dreamy Lullaby',
    category: 'light-sleep',
    description: 'Gentle lullaby with embedded sleep frequencies',
    frequencyConfig: lullabyFrequencyConfig,
    animation: 'clouds',
    color: '#ec4899',
  },
  {
    id: 'soft-lullaby',
    name: 'Soft Lullaby',
    category: 'light-sleep',
    description: 'Soothing lullaby with seamless looping and gentle sleep frequencies',
    audioUrl: '/sounds/drift-lul1.mp3',
    frequencyConfig: seamlessLullabyConfig, // Soft frequencies to mask loop transitions
    animation: 'clouds',
    color: '#f472b6',
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    category: 'light-sleep',
    description: 'Gentle ocean waves on the shore with light sleep frequencies',
    audioUrl: '/sounds/drift-ocean-waves.mp3',
    frequencyConfig: thetaLightConfig, // Theta for light sleep
    animation: 'waves',
    color: '#06b6d4',
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    category: 'light-sleep',
    description: 'Gentle white noise for masking distractions with sleep frequencies',
    frequencyConfig: thetaSubtleConfig, // Theta for sleep enhancement
    animation: 'static',
    color: '#6b7280',
  },

  // Relaxation - For calm and peaceful moments
  {
    id: 'alpha-relax',
    name: 'Alpha Relaxation',
    category: 'relaxation',
    description: 'Calm alpha waves for peaceful relaxation',
    frequencyConfig: alphaRelaxConfig,
    animation: 'aurora',
    color: '#3b82f6',
  },
  {
    id: 'crackling-fire',
    name: 'Crackling Fire',
    category: 'relaxation',
    description: 'Cozy fireplace sounds with relaxation frequencies',
    audioUrl: '/sounds/drift-fireplace.mp3',
    frequencyConfig: thetaSubtleConfig, // Theta for relaxation
    animation: 'fire',
    color: '#f59e0b',
  },

  // Nature - Natural sounds for sleep
  {
    id: 'rain-forest',
    name: 'Rain Forest',
    category: 'nature',
    description: 'Peaceful rain falling in a forest with relaxation frequencies',
    audioUrl: '/sounds/drift-rain-in-forest.mp3',
    frequencyConfig: thetaSubtleConfig, // Theta for relaxation
    animation: 'rain',
    color: '#10b981',
  },
  {
    id: 'mountain-stream',
    name: 'Mountain Stream',
    category: 'nature',
    description: 'Flowing water over smooth stones with relaxation frequencies',
    audioUrl: '/sounds/dryft-water-mountain.mp3',
    frequencyConfig: thetaSubtleConfig, // Theta for relaxation
    animation: 'water',
    color: '#3b82f6',
  },

  // Ambient - Atmospheric sounds for meditation and focus
  {
    id: 'zen-garden',
    name: 'Zen Garden',
    category: 'ambient',
    description: 'Tranquil zen garden ambiance with calm frequencies',
    audioUrl: '/sounds/dryft-gardens.mp3',
    frequencyConfig: alphaSubtleConfig, // Alpha for calm
    animation: 'spiral',
    color: '#14b8a6',
  },
  {
    id: 'singing-bowls',
    name: 'Singing Bowls',
    category: 'ambient',
    description: 'Resonant Tibetan singing bowls with meditation frequencies',
    audioUrl: '/sounds/dryft-singing-bowls.mp3',
    frequencyConfig: thetaLightConfig, // Theta for meditation
    animation: 'ripples',
    color: '#f97316',
  },
  {
    id: 'cosmic-ambience',
    name: 'Cosmic Ambience',
    category: 'ambient',
    description: 'Evolving cosmic journey through deep space tones with subtle white noise',
    // Uses special CosmicAmbienceGenerator - no frequencyConfig needed
    animation: 'stars',
    color: '#8b5cf6',
  },
];

export const getSoundById = (id: string): SoundConfig | undefined => {
  return sounds.find(sound => sound.id === id);
};

export const getSoundsByCategory = (category: SoundConfig['category']): SoundConfig[] => {
  return sounds.filter(sound => sound.category === category);
};

// Sleep-focused categories
export const categories: SoundConfig['category'][] = ['deep-sleep', 'light-sleep', 'relaxation', 'nature', 'ambient'];
