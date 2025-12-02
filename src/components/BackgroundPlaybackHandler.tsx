import { useEffect } from 'react';
import { audioEngine } from '../audio/AudioEngine';
import { useAppStore } from '../store/useAppStore';

/**
 * Component to handle background playback and keep audio context alive
 */
export default function BackgroundPlaybackHandler() {
  const activeSounds = useAppStore((state) => state.activeSounds);

  useEffect(() => {
    // Ensure audio context stays alive when sounds are playing
    const ensureContextRunning = async () => {
      if (activeSounds.size > 0) {
        await audioEngine.ensureContextRunning();
      }
    };

    // Check periodically when sounds are active
    const interval = setInterval(() => {
      ensureContextRunning();
    }, 5000); // Check every 5 seconds

    ensureContextRunning();

    return () => clearInterval(interval);
  }, [activeSounds.size]);

  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && activeSounds.size > 0) {
        // Ensure context resumes when tab becomes visible
        await audioEngine.ensureContextRunning();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeSounds.size]);

  // Handle page focus/blur
  useEffect(() => {
    const handleFocus = async () => {
      if (activeSounds.size > 0) {
        await audioEngine.ensureContextRunning();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [activeSounds.size]);

  return null;
}



