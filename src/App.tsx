import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SoundLibrary from './components/SoundLibrary';
import PlayerControls from './components/PlayerControls';
import FloatingPlayButton from './components/FloatingPlayButton';
import Logo from './components/Logo';
import SplashScreen from './components/SplashScreen';
import Timer from './components/Timer';
import BackgroundPlaybackHandler from './components/BackgroundPlaybackHandler';
import { useAppStore } from './store/useAppStore';
import { Sparkles } from 'lucide-react';

function App() {
  const [showLibrary, setShowLibrary] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const activeSounds = useAppStore((state) => state.activeSounds);
  const hasActiveSounds = activeSounds.size > 0;

  return (
    <div className="relative" style={{ margin: 0, padding: 0, top: 0, minHeight: '100vh' }}>
      <BackgroundPlaybackHandler />
      
      {/* Fixed background gradient overlay - ensures gradient stays fixed */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to bottom right, #0f172a, #312e81, #0f172a)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          willChange: 'auto'
        }}
      />
      
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      {/* Animated background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Top Right Controls */}
      <div className="fixed top-2 right-6 flex items-center gap-4 z-20" style={{ fontSize: '16px', lineHeight: 'normal' }}>
        <Timer />
        <button
          onClick={() => setShowLibrary(!showLibrary)}
          className="glass-effect px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          {showLibrary ? 'Hide' : 'Show'} Library
        </button>
      </div>

      {/* Logo - At very top, centered, natural size */}
      <div className="w-full flex justify-center items-start" style={{ marginTop: '0px', paddingTop: '0px', marginBottom: '3px', minHeight: 'auto' }}>
        <Logo size="massive" className="triple-size" />
      </div>

      {/* Active Sound Animations - Fixed overlay that doesn't scroll */}
      {hasActiveSounds && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 pointer-events-none z-0"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {Array.from(activeSounds.values()).map((activeSound) => (
            <SoundAnimation
              key={activeSound.id}
              sound={activeSound.sound}
            />
          ))}
        </motion.div>
      )}

      {/* Main Content - Library buttons 3px below logo */}
      <main className="relative z-10 pb-24" style={{ marginTop: '0px', paddingTop: '0px', lineHeight: 'normal', fontSize: '16px' }}>
        <AnimatePresence mode="wait">
          {showLibrary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ marginTop: '0px', paddingTop: '0px' }}
            >
              <SoundLibrary />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Play/Pause Button */}
      <FloatingPlayButton />

      {/* Player Controls */}
      {hasActiveSounds && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40"
        >
          <PlayerControls />
        </motion.div>
      )}
    </div>
  );
}

function SoundAnimation({ sound }: { sound: { animation?: string; color?: string } }) {
  if (!sound.animation) return null;

  const animations: Record<string, JSX.Element> = {
    stars: <StarsAnimation color={sound.color} />,
    waves: <WavesAnimation color={sound.color} />,
    clouds: <CloudsAnimation color={sound.color} />,
    aurora: <AuroraAnimation color={sound.color} />,
    spiral: <SpiralAnimation color={sound.color} />,
    rain: <RainAnimation color={sound.color} />,
    storm: <StormAnimation color={sound.color} />,
    fire: <FireAnimation color={sound.color} />,
    water: <WaterAnimation color={sound.color} />,
    ripples: <RipplesAnimation color={sound.color} />,
    static: <StaticAnimation color={sound.color} />,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
      {animations[sound.animation] || null}
    </div>
  );
}

function StarsAnimation({ color }: { color?: string }) {
  return (
    <div className="fixed inset-0" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: color || '#6366f1',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

function WavesAnimation({ color }: { color?: string }) {
  return (
    <div className="fixed inset-0 flex items-end" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {[0, 1, 2].map((i) => (
        <motion.svg
          key={i}
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 320"
          style={{ opacity: 0.3 - i * 0.1 }}
        >
          <motion.path
            fill={color || '#6366f1'}
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              d: [
                "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,192L48,202.7C96,213,192,235,288,234.7C384,235,480,213,576,197.3C672,181,768,171,864,176C960,181,1056,203,1152,213.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              ],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.svg>
      ))}
    </div>
  );
}

function CloudsAnimation({ color }: { color?: string }) {
  return (
    <div className="fixed inset-0" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            backgroundColor: color || '#6366f1',
            opacity: 0.2,
            width: `${100 + Math.random() * 200}px`,
            height: `${100 + Math.random() * 200}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 100, -100, 0],
            y: [0, 50, -50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

function AuroraAnimation({ color }: { color?: string }) {
  return (
    <div className="fixed inset-0" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${color || '#6366f1'}40 50%, transparent 100%)`,
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          y: [-100, 100, -100],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

function SpiralAnimation({ color }: { color?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <motion.div
        className="w-96 h-96 rounded-full border-4"
        style={{ borderColor: color || '#6366f1' }}
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    </div>
  );
}

function RainAnimation({ color }: { color?: string }) {
  return (
    <div className="fixed inset-0" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5"
          style={{
            backgroundColor: color || '#6366f1',
            height: '20px',
            left: `${Math.random() * 100}%`,
            top: '-20px',
          }}
          animate={{
            y: ['100vh', '120vh'],
          }}
          transition={{
            duration: 0.5 + Math.random() * 1,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

function StormAnimation({ color }: { color?: string }) {
  return (
    <div className="fixed inset-0" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: color || '#1e293b', opacity: 0.3 }}
        animate={{ opacity: [0.1, 0.5, 0.1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <RainAnimation color={color} />
    </div>
  );
}

function FireAnimation({ color }: { color?: string }) {
  return (
    <div className="fixed inset-0 flex items-end justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full"
          style={{
            backgroundColor: color || '#f59e0b',
            bottom: '10%',
            left: `${50 + (Math.random() - 0.5) * 20}%`,
          }}
          animate={{
            y: [0, -100, -200],
            x: [(Math.random() - 0.5) * 50],
            opacity: [1, 0.5, 0],
            scale: [1, 0.5, 0],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

function WaterAnimation({ color }: { color?: string }) {
  return <WavesAnimation color={color} />;
}

function RipplesAnimation({ color }: { color?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{ borderColor: color || '#6366f1' }}
          animate={{
            scale: [0, 4],
            opacity: [1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
          }}
        />
      ))}
    </div>
  );
}

function StaticAnimation({ color }: { color?: string }) {
  return (
    <div className="fixed inset-0" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {[...Array(200)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1"
          style={{
            backgroundColor: color || '#6b7280',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            delay: Math.random() * 0.2,
          }}
        />
      ))}
    </div>
  );
}


export default App;
