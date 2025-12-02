import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Timer() {
  const currentTimer = useAppStore((state) => state.currentTimer);
  const timerDuration = useAppStore((state) => state.timerDuration);
  const setTimer = useAppStore((state) => state.setTimer);
  const updateTimer = useAppStore((state) => state.updateTimer);
  const clearTimer = useAppStore((state) => state.clearTimer);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(30);

  useEffect(() => {
    if (currentTimer === null || currentTimer <= 0) return;

    const interval = setInterval(() => {
      const newValue = Math.max(0, currentTimer - 1);
      updateTimer(newValue);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTimer, updateTimer]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setTimer(selectedMinutes);
    setShowModal(false);
  };

  const minutes = [15, 30, 45, 60, 90, 120];

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="glass-effect px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors relative"
      >
        <Clock className="w-5 h-5" />
        {currentTimer !== null ? formatTime(currentTimer) : 'Timer'}
        {currentTimer !== null && (
          <span
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: '#ef4444' }}
          />
        )}
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-effect rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Sleep Timer</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {minutes.map((min) => (
                  <button
                    key={min}
                    onClick={() => setSelectedMinutes(min)}
                    className={`glass-effect px-4 py-3 rounded-xl transition-all ${
                      selectedMinutes === min
                        ? 'bg-dream-500/30 glow-effect border-2 border-dream-500'
                        : 'hover:bg-white/20'
                    }`}
                  >
                    {min}m
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="mb-6">
                <label className="block text-sm mb-2">Custom Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={selectedMinutes}
                  onChange={(e) => setSelectedMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full glass-effect px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:border-dream-500 focus:outline-none"
                />
              </div>

              {/* Current Timer Display */}
              {currentTimer !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 rounded-xl bg-dream-500/20 border border-dream-500/50"
                >
                  <div className="text-center">
                    <p className="text-sm text-gray-300 mb-1">Current Timer</p>
                    <p className="text-3xl font-bold">{formatTime(currentTimer)}</p>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {currentTimer !== null && (
                  <button
                    onClick={clearTimer}
                    className="flex-1 glass-effect px-6 py-3 rounded-xl hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={handleStartTimer}
                  className="flex-1 glass-effect px-6 py-3 rounded-xl bg-dream-500/30 hover:bg-dream-500/50 glow-effect transition-colors"
                >
                  {currentTimer !== null ? 'Restart' : 'Start'} Timer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Notification */}
      {currentTimer !== null && currentTimer <= 60 && currentTimer > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-6 z-50 glass-effect px-6 py-4 rounded-xl border-2 border-orange-500/50"
        >
          <p className="text-sm text-orange-300">
            Timer: {formatTime(currentTimer)} remaining
          </p>
        </motion.div>
      )}
    </>
  );
}



