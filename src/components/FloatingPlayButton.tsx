import { motion } from 'framer-motion';
import { Square } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function FloatingPlayButton() {
  const activeSounds = useAppStore((state) => state.activeSounds);
  const stopAll = useAppStore((state) => state.stopAll);
  const isPlaying = activeSounds.size > 0;

  if (!isPlaying) return null;

  const soundsArray = Array.from(activeSounds.values());
  const primarySound = soundsArray[0];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed bottom-24 right-6 z-50"
    >
      <div className="flex flex-col items-end gap-3">
        {/* Main Play/Pause Button */}
        <motion.button
          onClick={stopAll}
          className="glass-effect w-16 h-16 rounded-full flex items-center justify-center bg-dream-500/40 border-2 border-dream-400 glow-effect shadow-2xl hover:bg-dream-500/60 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(99, 102, 241, 0.5)',
              '0 0 40px rgba(99, 102, 241, 0.8)',
              '0 0 20px rgba(99, 102, 241, 0.5)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Square className="w-8 h-8" fill="currentColor" />
        </motion.button>

        {/* Active Sound Indicator */}
        {primarySound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect px-4 py-2 rounded-full flex items-center gap-2 text-sm"
            style={{
              borderColor: primarySound.sound.color || '#6366f1',
              borderWidth: '1px',
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: primarySound.sound.color || '#6366f1' }}
            />
            <span className="font-medium">{primarySound.sound.name}</span>
            {soundsArray.length > 1 && (
              <span className="text-xs opacity-70">+{soundsArray.length - 1}</span>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
