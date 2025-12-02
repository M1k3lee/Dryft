import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { SoundConfig } from '../types/audio';
import { useAppStore } from '../store/useAppStore';

interface SoundCardProps {
  sound: SoundConfig;
  isPlaying: boolean;
  delay?: number;
}

export default function SoundCard({ sound, isPlaying, delay = 0 }: SoundCardProps) {
  const playSound = useAppStore((state) => state.playSound);
  const stopSound = useAppStore((state) => state.stopSound);

  const handleClick = async () => {
    if (isPlaying) {
      await stopSound(sound.id);
    } else {
      await playSound(sound, 0.7);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="glass-effect rounded-2xl p-6 cursor-pointer card-hover relative overflow-hidden group"
      style={{
        borderColor: isPlaying ? sound.color || '#6366f1' : undefined,
        borderWidth: isPlaying ? '2px' : '1px',
      }}
      onClick={handleClick}
    >
      {/* Gradient background overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
        style={{
          background: `linear-gradient(135deg, ${sound.color || '#6366f1'}40, transparent)`,
        }}
      />

      {/* Glow effect when playing */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: `0 0 30px ${sound.color || '#6366f1'}60`,
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      <div className="relative z-10">
        {/* Icon/Color indicator */}
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: `${sound.color || '#6366f1'}30`,
              borderColor: sound.color || '#6366f1',
              borderWidth: '2px',
            }}
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: sound.color || '#6366f1' }}
            />
          </motion.div>

          {/* Play/Pause button - Larger and more prominent */}
          <motion.button
            className={`glass-effect rounded-full flex items-center justify-center transition-all ${
              isPlaying
                ? 'w-14 h-14 bg-dream-500/30 border-2 border-dream-400 glow-effect'
                : 'w-12 h-12 hover:bg-white/30 hover:scale-110'
            }`}
            whileHover={{ scale: isPlaying ? 1.05 : 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" fill="currentColor" />
            ) : (
              <Play className="w-6 h-6 ml-1" fill="currentColor" />
            )}
          </motion.button>
        </div>

        {/* Sound name */}
        <h3 className="text-xl font-semibold mb-2">{sound.name}</h3>

        {/* Description */}
        <p className="text-sm text-gray-300 mb-4">{sound.description}</p>

        {/* Category badge */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{
              backgroundColor: `${sound.color || '#6366f1'}20`,
              color: sound.color || '#6366f1',
            }}
          >
            {sound.category}
          </span>
          {sound.frequencyConfig && (
            <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300">
              {sound.frequencyConfig.targetBeatFreq}Hz
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
