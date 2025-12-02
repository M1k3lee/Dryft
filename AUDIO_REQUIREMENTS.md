# Audio Requirements for DreamScape Sleep App

## Overview

This document lists all audio files needed for the sleep app, including format specifications, file sizes, and looping requirements.

**Note:** Frequency-based sounds (Deep Sleep Waves, Theta Sleep, Alpha Relaxation, Schumann Resonance, Dreamy Lullaby) are generated programmatically and do NOT require audio files.

---

## Audio Format Specifications

### Recommended Format: **MP3**
- **Codec:** MP3 (MPEG-1 Audio Layer 3)
- **Bitrate:** 128-192 kbps (128 kbps recommended for smaller file size)
- **Sample Rate:** 44.1 kHz (standard)
- **Channels:** Stereo (2-channel) for spatial sounds, Mono acceptable for ambient
- **Why MP3:** Universal browser support, good compression, acceptable quality for ambient sounds

### Alternative Formats (Optional)
- **OGG Vorbis:** Better quality at lower bitrates, but less browser support
- **WebM:** Good compression, supported by modern browsers
- **AAC:** Excellent quality, but licensing considerations

---

## File Size Guidelines

### Target File Sizes (per sound):
- **Short loops (30-60 seconds):** 500 KB - 1.5 MB
- **Medium loops (60-120 seconds):** 1.5 MB - 3 MB
- **Long loops (2-5 minutes):** 3 MB - 7 MB

**Note:** These sizes are for 128 kbps MP3. Higher bitrates will increase file size proportionally.

---

## Perfect Loop Requirements

### Critical Loop Characteristics:
1. **Seamless Loop:** The end must perfectly match the beginning with no audible click or gap
2. **Zero-Crossing:** Loop points should be at zero-crossing points in the waveform
3. **Consistent Volume:** No volume changes at loop points
4. **Natural Transitions:** The sound should flow naturally when looping

### Recommended Loop Durations:
- **Nature sounds:** 60-120 seconds (longer is better for natural variation)
- **Ambient sounds:** 30-90 seconds
- **Realistic sounds:** 60-180 seconds
- **White noise:** 10-30 seconds (can be shorter since it's consistent)

---

## Complete Sound List

### 1. Airplane Cabin
- **ID:** `airplane-cabin`
- **Category:** Realistic
- **Description:** Soothing white noise of an airplane cabin
- **Format:** MP3, 128 kbps, Stereo
- **Duration:** 60-120 seconds (perfect loop)
- **File Size Target:** 1-2 MB
- **Characteristics:**
  - Constant low-frequency rumble
  - Subtle air conditioning hum
  - Very minimal variation
  - Should be calming and monotonous
- **Loop Requirements:** Must loop seamlessly (zero-crossing at start/end)

### 2. Ocean Waves
- **ID:** `ocean-waves`
- **Category:** Nature
- **Description:** Gentle ocean waves on the shore
- **Format:** MP3, 128-192 kbps, Stereo
- **Duration:** 90-180 seconds (perfect loop)
- **File Size Target:** 2-4 MB
- **Characteristics:**
  - Wave crash → recede → wave crash pattern
  - Natural rhythm (not too fast, not too slow)
  - Gentle, not aggressive
  - Should include subtle seagull sounds (optional)
- **Loop Requirements:** Critical - must loop at the end of a wave recede, before next wave begins

### 3. Rain Forest
- **ID:** `rain-forest`
- **Category:** Nature
- **Description:** Peaceful rain falling in a forest
- **Format:** MP3, 128 kbps, Stereo
- **Duration:** 120-180 seconds (perfect loop)
- **File Size Target:** 2-3 MB
- **Characteristics:**
  - Consistent rain patter
  - Subtle forest ambience (leaves rustling, distant birds)
  - No sudden changes in intensity
  - Calming and meditative
- **Loop Requirements:** Must loop seamlessly - rain should be consistent throughout

### 4. Distant Thunderstorm
- **ID:** `thunderstorm`
- **Category:** Nature
- **Description:** Distant rumbling thunder with gentle rain
- **Format:** MP3, 128-192 kbps, Stereo
- **Duration:** 180-300 seconds (perfect loop)
- **File Size Target:** 3-6 MB
- **Characteristics:**
  - Distant, muffled thunder (not jarring)
  - Gentle rain in background
  - Long pauses between thunder
  - Soothing, not scary
- **Loop Requirements:** Must loop at a quiet moment (between thunder claps)

### 5. Crackling Fire
- **ID:** `crackling-fire`
- **Category:** Realistic
- **Description:** Cozy fireplace sounds
- **Format:** MP3, 128 kbps, Stereo
- **Duration:** 60-120 seconds (perfect loop)
- **File Size Target:** 1-2 MB
- **Characteristics:**
  - Consistent crackling and popping
  - Subtle fire whoosh sounds
  - Warm, cozy atmosphere
  - No sudden loud pops
- **Loop Requirements:** Must loop seamlessly - fire should sound continuous

### 6. Mountain Stream
- **ID:** `mountain-stream`
- **Category:** Nature
- **Description:** Flowing water over smooth stones
- **Format:** MP3, 128 kbps, Stereo
- **Duration:** 90-150 seconds (perfect loop)
- **File Size Target:** 2-3 MB
- **Characteristics:**
  - Gentle water flow
  - Subtle bubbling and gurgling
  - Natural water rhythm
  - Calming and peaceful
- **Loop Requirements:** Must loop at a consistent flow point

### 7. Zen Garden
- **ID:** `zen-garden`
- **Category:** Ambient
- **Description:** Tranquil zen garden ambiance
- **Format:** MP3, 128 kbps, Stereo
- **Duration:** 60-120 seconds (perfect loop)
- **File Size Target:** 1-2 MB
- **Characteristics:**
  - Subtle wind chimes (very gentle)
  - Soft wind through leaves
  - Minimal, meditative
  - Very low volume variations
- **Loop Requirements:** Must loop seamlessly - very subtle transitions

### 8. Singing Bowls
- **ID:** `singing-bowls`
- **Category:** Ambient
- **Description:** Resonant Tibetan singing bowls
- **Format:** MP3, 192 kbps, Stereo (higher quality for harmonics)
- **Duration:** 30-90 seconds (perfect loop)
- **File Size Target:** 1-2 MB
- **Characteristics:**
  - Long, sustained tones
  - Rich harmonics and overtones
  - Gentle strikes (not harsh)
  - Meditative and calming
- **Loop Requirements:** Must loop at the end of a tone decay, before next strike

### 9. Cosmic Ambience
- **ID:** `cosmic-ambience`
- **Category:** Ambient
- **Description:** Ethereal space-like atmosphere
- **Format:** MP3, 128 kbps, Stereo
- **Duration:** 60-120 seconds (perfect loop)
- **File Size Target:** 1-2 MB
- **Characteristics:**
  - Deep, low-frequency drones
  - Subtle high-frequency sparkles
  - Otherworldly, ethereal
  - Very minimal variation
- **Loop Requirements:** Must loop seamlessly - should sound continuous

### 10. White Noise
- **ID:** `white-noise`
- **Category:** Ambient
- **Description:** Gentle white noise for masking distractions
- **Format:** MP3, 128 kbps, Mono or Stereo
- **Duration:** 10-30 seconds (perfect loop - can be shorter)
- **File Size Target:** 200-500 KB
- **Characteristics:**
  - Consistent frequency spectrum
  - No variations or patterns
  - Gentle, not harsh
  - Should mask background noise
- **Loop Requirements:** Easiest to loop - just needs to match start/end

---

## Technical Specifications Summary

| Sound | Duration | File Size | Bitrate | Channels | Priority |
|-------|----------|-----------|---------|----------|----------|
| Airplane Cabin | 60-120s | 1-2 MB | 128 kbps | Stereo | Medium |
| Ocean Waves | 90-180s | 2-4 MB | 128-192 kbps | Stereo | High |
| Rain Forest | 120-180s | 2-3 MB | 128 kbps | Stereo | High |
| Thunderstorm | 180-300s | 3-6 MB | 128-192 kbps | Stereo | Medium |
| Crackling Fire | 60-120s | 1-2 MB | 128 kbps | Stereo | High |
| Mountain Stream | 90-150s | 2-3 MB | 128 kbps | Stereo | High |
| Zen Garden | 60-120s | 1-2 MB | 128 kbps | Stereo | Low |
| Singing Bowls | 30-90s | 1-2 MB | 192 kbps | Stereo | Medium |
| Cosmic Ambience | 60-120s | 1-2 MB | 128 kbps | Stereo | Low |
| White Noise | 10-30s | 200-500 KB | 128 kbps | Mono/Stereo | Medium |

---

## Where to Find Audio Files

### Recommended Sources:
1. **Freesound.org** - Free, high-quality sounds with proper licensing
2. **Zapsplat.com** - Professional sound library (free with attribution)
3. **Adobe Stock Audio** - Premium quality (paid)
4. **AudioJungle** - Professional library (paid)
5. **YouTube Audio Library** - Free, royalty-free sounds

### Recording Your Own:
- Use a high-quality microphone
- Record in a quiet environment
- Record longer than needed (5-10 minutes) to find the best loop point
- Use audio editing software (Audacity, Adobe Audition, Reaper) to create perfect loops

---

## Audio Editing Tips for Perfect Loops

### Using Audacity (Free):
1. Import your audio file
2. Find a natural loop point (look for similar waveform patterns)
3. Use "Snap to Zero Crossing" feature
4. Apply a 10-20ms crossfade at the loop point
5. Export as MP3 at 128 kbps

### Using Adobe Audition:
1. Use "Loop Tuner" feature
2. Automatically finds best loop points
3. Applies seamless crossfades
4. Export with optimal settings

### General Tips:
- **Fade in/out:** Apply 50-100ms fade at start and end for seamless looping
- **Normalize:** Ensure consistent volume levels
- **Remove clicks:** Use declicker or manual editing
- **Test loops:** Play the loop 10+ times to ensure it's truly seamless

---

## File Naming Convention

Use this naming convention for consistency:
```
{sound-id}.mp3
```

Examples:
- `airplane-cabin.mp3`
- `ocean-waves.mp3`
- `rain-forest.mp3`
- etc.

---

## Storage Location

Place all audio files in:
```
public/sounds/
```

Then update the `audioUrl` in `src/data/sounds.ts`:
```typescript
audioUrl: '/sounds/airplane-cabin.mp3'
```

---

## Quality Checklist

Before using each audio file, verify:
- [ ] Seamless loop (play 10+ times, no clicks or gaps)
- [ ] Appropriate volume level (not too loud, not too quiet)
- [ ] Correct file format (MP3, 128-192 kbps)
- [ ] File size within target range
- [ ] Matches the sound description
- [ ] Calming and sleep-appropriate (not jarring)
- [ ] No copyright issues (properly licensed)

---

## Total Storage Requirements

**Estimated total:** 15-25 MB for all 10 sounds

This is reasonable for a web app and allows for good quality while maintaining fast load times.

---

## Notes

- Frequency-based sounds work immediately without any audio files
- You can start with just a few sounds and add more over time
- Consider offering multiple variations of popular sounds (e.g., different ocean wave intensities)
- Test all sounds on mobile devices to ensure they work well
- Consider creating shorter preview versions for faster initial loading




