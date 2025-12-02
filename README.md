# DRYFT - Sleep & Relaxation App

A beautiful, dreamy web application designed to help people achieve better sleep through advanced audio frequencies and soothing sounds. Built with React, TypeScript, and the Web Audio API.

## Features

### 🎵 Advanced Audio System
- **Multi-layer frequency generation** using carrier frequencies and isochronic tones
- **Binaural beats** for brainwave entrainment (Delta, Theta, Alpha waves)
- **Gateway frequency configurations** inspired by advanced frequency research
- **Multiple simultaneous audio layers** (6-15 carrier layers + 1-6 isochronic layers per sound)

### 🌊 Sound Categories
- **Frequency-based**: Deep Sleep Waves (Delta), Theta Sleep, Alpha Relaxation, Schumann Resonance
- **Lullabies**: Dreamy lullabies with embedded sleep frequencies
- **Nature Sounds**: Ocean waves, rain forest, thunderstorms, mountain streams
- **Realistic Sounds**: Airplane cabin, crackling fire
- **Ambient/Zen**: Zen garden, singing bowls, cosmic ambience, white noise

### ✨ Beautiful UI/UX
- **Dreamy, animated design** with thoughtful transitions
- **Contextual animations** that match each sound (stars, waves, clouds, aurora, etc.)
- **Smooth fade-in/fade-out** for professional audio quality
- **Glass morphism effects** and gradient backgrounds
- **Responsive design** for all screen sizes

### ⏱️ Timer Functionality
- Set sleep timers (15, 30, 45, 60, 90, 120 minutes or custom)
- Automatic sound fade-out when timer ends
- Visual countdown display

### 🔊 Advanced Controls
- Master volume control
- Individual sound volume control
- Mix multiple sounds simultaneously
- Play/pause controls for each sound

### 🌙 Background Playback
- Continuous playback in background
- Audio context management for uninterrupted sleep sessions
- Keep-alive mechanisms for mobile browsers

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **Web Audio API** - Advanced audio generation
- **Tailwind CSS** - Styling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/M1k3lee/Dryft.git
cd Dryft
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Deployment

This app is automatically deployed to GitHub Pages using GitHub Actions. 

### Live Site

The app is available at: **https://m1k3lee.github.io/Dryft/**

### Automatic Deployment

- Every push to the `main` branch automatically triggers a build and deployment
- The GitHub Actions workflow builds the app and deploys it to GitHub Pages
- No manual steps required after pushing to main

### Manual Deployment

If you need to manually trigger a deployment:

1. Go to the "Actions" tab in your GitHub repository
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

## Project Structure

```
src/
├── audio/                    # Audio engine and frequency generators
│   ├── AudioEngine.ts       # Main audio engine
│   ├── CarrierLayer.ts      # Binaural beat generation
│   ├── IsochronicLayer.ts   # Isochronic tone generation
│   └── FrequencySignalGenerator.ts  # Multi-layer frequency orchestrator
├── components/               # React components
│   ├── SoundLibrary.tsx     # Sound selection interface
│   ├── SoundCard.tsx        # Individual sound cards
│   ├── PlayerControls.tsx   # Playback controls
│   └── Timer.tsx            # Sleep timer
├── data/
│   └── sounds.ts            # Sound configurations and library
├── store/
│   └── useAppStore.ts       # Global state management
├── types/
│   └── audio.ts             # TypeScript type definitions
└── App.tsx                  # Main app component
```

## Audio System Architecture

The app uses a sophisticated multi-layer audio system:

1. **Carrier Layers**: Generate binaural beats by playing slightly different frequencies to each ear
2. **Isochronic Layers**: Create pulsing tones for rhythmic entrainment
3. **Frequency Signal Generator**: Orchestrates multiple layers for complex signals
4. **Audio Engine**: Manages playback, volume, and context state

### Example: Deep Sleep Configuration

- **Target Frequency**: 2.0 Hz (Delta waves)
- **Carrier Layers**: 5 pairs of frequencies creating 2.0 Hz beats
- **Isochronic Layers**: 2 pulsing tones reinforcing the 2.0 Hz rhythm
- **Total Entrainment Techniques**: 7 simultaneous layers

## Customization

### Adding New Sounds

Edit `src/data/sounds.ts` to add new sounds:

```typescript
{
  id: 'your-sound-id',
  name: 'Your Sound Name',
  category: 'nature',
  description: 'Description here',
  audioUrl: 'path/to/audio.mp3',
  animation: 'waves',
  color: '#3b82f6',
}
```

### Creating Frequency Configurations

Add frequency-based sounds with custom configurations:

```typescript
const customConfig: FrequencySignalConfig = {
  name: 'Custom Frequency',
  targetBeatFreq: 5.0,
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 105.0, beatFreq: 5.0, volume: 0.85, phaseOffset: 0 },
    // ... more layers
  ],
  isochronicLayers: [
    { frequency: 5.0, pulseRate: 5.0, dutyCycle: 0.5, volume: 0.25 },
    // ... more layers
  ],
};
```

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (including iOS)
- Mobile browsers with Web Audio API support

**Note**: Some mobile browsers may require user interaction before audio can start (autoplay policy).

## Background Playback Notes

- The app includes mechanisms to keep audio playing in the background
- For best results on mobile, keep the browser tab active
- Future versions may include Service Worker support for true background playback

## Development Notes

### Audio Context Management

The app automatically handles:
- Audio context initialization
- Suspension/resume for autoplay policies
- Background playback keep-alive
- Smooth fade-in/fade-out transitions

### Performance

- Audio is generated in real-time (no pre-loaded files for frequencies)
- Optimized for smooth performance with multiple simultaneous sounds
- Efficient rendering of animations using Framer Motion

## Future Enhancements

- [ ] Service Worker for offline support
- [ ] Progressive Web App (PWA) capabilities
- [ ] Android/iOS native app versions
- [ ] Sound mixing presets
- [ ] Sleep tracking integration
- [ ] Alarm clock functionality
- [ ] Custom frequency builder UI
- [ ] Sound library expansion with more realistic sounds

## License

MIT License - feel free to use this project for your own sleep app!

## Credits

Audio frequency configurations based on research in:
- Gateway Project methodologies
- Binaural beat and isochronic tone research
- Brainwave entrainment studies

---

**Sweet dreams! 🌙✨**
