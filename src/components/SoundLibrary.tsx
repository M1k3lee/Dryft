import { useState } from 'react';
import { motion } from 'framer-motion';
import { sounds, categories, getSoundsByCategory } from '../data/sounds';
import { useAppStore } from '../store/useAppStore';
import SoundCard from './SoundCard';
import { Moon, Cloud, Waves, Heart, Sparkles } from 'lucide-react';

const categoryIcons = {
  'deep-sleep': Moon,
  'light-sleep': Cloud,
  'relaxation': Heart,
  'nature': Waves,
  'ambient': Sparkles,
};

const categoryNames = {
  'deep-sleep': 'Deep Sleep',
  'light-sleep': 'Light Sleep',
  'relaxation': 'Relaxation',
  'nature': 'Nature',
  'ambient': 'Ambient',
};

export default function SoundLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const activeSounds = useAppStore((state) => state.activeSounds);
  
  const displayedSounds = selectedCategory
    ? getSoundsByCategory(selectedCategory as any)
    : sounds;

  return (
    <div className="max-w-7xl mx-auto px-6 pb-8" style={{ paddingTop: '0px', marginTop: '0px', lineHeight: 'normal', fontSize: '16px' }}>
      {/* Category Filter - Exactly 3px below logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-wrap gap-3 justify-center"
        style={{ marginTop: '0px', paddingTop: '0px', lineHeight: 'normal' }}
      >
        <button
          onClick={() => setSelectedCategory(null)}
          className={`glass-effect px-6 py-3 rounded-full transition-all ${
            selectedCategory === null
              ? 'bg-dream-500/30 glow-effect'
              : 'hover:bg-white/20'
          }`}
        >
          All Sounds
        </button>
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`glass-effect px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                selectedCategory === category
                  ? 'bg-dream-500/30 glow-effect'
                  : 'hover:bg-white/20'
              }`}
            >
              <Icon className="w-5 h-5" />
              {categoryNames[category]}
            </button>
          );
        })}
      </motion.div>

      {/* Sound Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {displayedSounds.map((sound, index) => (
          <SoundCard
            key={sound.id}
            sound={sound}
            isPlaying={activeSounds.has(sound.id)}
            delay={index * 0.05}
          />
        ))}
      </motion.div>

      {displayedSounds.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-xl text-gray-400">No sounds found in this category</p>
        </motion.div>
      )}
    </div>
  );
}
