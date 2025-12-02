import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, X, Square, ChevronDown, ChevronUp, RotateCcw, Layers } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { audioEngine } from '../audio/AudioEngine';

export default function PlayerControls() {
  const [expandedAdvanced, setExpandedAdvanced] = useState<Set<string>>(new Set());
  const [layerVolumes, setLayerVolumes] = useState<Map<string, { carriers: number[], isochronics: number[] }>>(new Map());
  const activeSounds = useAppStore((state) => state.activeSounds);
  const masterVolume = useAppStore((state) => state.masterVolume);
  const setMasterVolume = useAppStore((state) => state.setMasterVolume);
  const stopSound = useAppStore((state) => state.stopSound);
  const stopAll = useAppStore((state) => state.stopAll);
  const setSoundVolume = useAppStore((state) => state.setSoundVolume);
  const setCarrierLayerVolume = useAppStore((state) => state.setCarrierLayerVolume);
  const setIsochronicLayerVolume = useAppStore((state) => state.setIsochronicLayerVolume);
  const resetFrequencyLayersToDefaults = useAppStore((state) => state.resetFrequencyLayersToDefaults);
  const mixMode = useAppStore((state) => state.mixMode);
  const toggleMixMode = useAppStore((state) => state.toggleMixMode);

  const soundsArray = Array.from(activeSounds.values());

  // Update layer volumes when sounds change or when volumes are adjusted
  const updateLayerVolumes = (soundId: string) => {
    const generator = audioEngine.getFrequencyGenerator(soundId);
    const config = generator?.getConfig();
    if (config) {
      setLayerVolumes(prev => {
        const newMap = new Map(prev);
        newMap.set(soundId, {
          carriers: config.carrierLayers.map(l => l.volume),
          isochronics: config.isochronicLayers.map(l => l.volume)
        });
        return newMap;
      });
    }
  };

  const toggleAdvanced = (soundId: string) => {
    setExpandedAdvanced(prev => {
      const newSet = new Set(prev);
      if (newSet.has(soundId)) {
        newSet.delete(soundId);
      } else {
        newSet.add(soundId);
        // Initialize layer volumes when expanding
        setTimeout(() => updateLayerVolumes(soundId), 50);
      }
      return newSet;
    });
  };

  const hasAdvancedControls = (soundId: string): boolean => {
    const activeSound = activeSounds.get(soundId);
    return !!(activeSound?.sound.frequencyConfig && 
             (activeSound.sound.frequencyConfig.carrierLayers.length > 0 || 
              activeSound.sound.frequencyConfig.isochronicLayers.length > 0));
  };

  return (
    <div className="glass-effect border-t border-white/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {soundsArray.length === 0 ? (
          <div className="text-center py-4 text-gray-400">
            <p>No sounds playing</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {/* Active Sounds Display */}
              {mixMode && soundsArray.length > 1 ? (
                // Mix Mode: Show all sounds in a wrapping grid
                <div className="flex flex-wrap items-center gap-2">
                  {soundsArray.map((activeSound) => (
                    <motion.div
                      key={activeSound.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 glass-effect px-3 py-1.5 rounded-full"
                      style={{
                        borderColor: activeSound.sound.color || '#6366f1',
                        borderWidth: '1px',
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                        style={{ backgroundColor: activeSound.sound.color || '#6366f1' }}
                      />
                      <span className="text-xs font-medium whitespace-nowrap">
                        {activeSound.sound.name}
                      </span>
                      <button
                        onClick={() => stopSound(activeSound.sound.id)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors flex-shrink-0 ml-1"
                        title="Stop this sound"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                // Single Sound Display
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: soundsArray[0]?.sound.color || '#6366f1' }}
                  />
                  <span className="text-sm font-medium">
                    {soundsArray[0]?.sound.name || 'No sounds playing'}
                  </span>
                </div>
              )}

              {/* Master Controls Row */}
              <div className="flex items-center justify-between gap-6 flex-wrap">
                {/* Mix Mode Toggle */}
                <button
                  onClick={toggleMixMode}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    mixMode
                      ? 'glass-effect bg-purple-500/30 border-2 border-purple-400/50 text-purple-200 hover:bg-purple-500/40'
                      : 'glass-effect border-2 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                  }`}
                  title={mixMode ? 'Mix Mode: Multiple sounds can play together' : 'Single Mode: Only one sound plays at a time'}
                >
                  <Layers className={`w-4 h-4 ${mixMode ? 'text-purple-300' : 'text-gray-400'}`} />
                  <span>{mixMode ? 'Mix Mode' : 'Single'}</span>
                </button>

                {/* Master Volume */}
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={masterVolume}
                    onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                    className="w-24 accent-dream-500"
                  />
                  <span className="text-sm w-10 text-right">
                    {Math.round(masterVolume * 100)}%
                  </span>
                </div>

                {/* Advanced Controls - Aligned with other controls */}
                {soundsArray.some(sound => hasAdvancedControls(sound.sound.id)) && (
                  <div className="flex items-center gap-2">
                    {soundsArray.map((activeSound) => {
                      if (!hasAdvancedControls(activeSound.sound.id)) return null;
                      const frequencyConfig = activeSound.sound.frequencyConfig;
                      if (!frequencyConfig) return null;
                      
                      const isExpanded = expandedAdvanced.has(activeSound.sound.id);
                      return (
                        <button
                          key={`advanced-btn-${activeSound.sound.id}`}
                          onClick={() => toggleAdvanced(activeSound.sound.id)}
                          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors glass-effect px-4 py-2 rounded-full"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                          <span className="font-medium">Advanced</span>
                          <span className="text-xs text-gray-400">
                            ({frequencyConfig.carrierLayers.length} carrier{frequencyConfig.carrierLayers.length !== 1 ? 's' : ''}, {frequencyConfig.isochronicLayers.length} isochronic{frequencyConfig.isochronicLayers.length !== 1 ? 's' : ''})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Stop All - More prominent */}
                <button
                  onClick={stopAll}
                  className="glass-effect px-6 py-3 rounded-full bg-red-500/20 border-2 border-red-500/50 hover:bg-red-500/30 hover:border-red-500/70 transition-all font-semibold flex items-center gap-2"
                >
                  <Square className="w-5 h-5" />
                  Stop All
                </button>
              </div>
            </div>

        {/* Individual Volume Controls */}
        {soundsArray.length > 1 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {soundsArray.map((activeSound) => (
                <div key={activeSound.id} className="flex items-center gap-3">
                  <span className="text-sm w-32 truncate">{activeSound.sound.name}</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={activeSound.relativeVolume ?? activeSound.volume / (masterVolume || 1)}
                    onChange={(e) => {
                      const relativeVolume = parseFloat(e.target.value);
                      setSoundVolume(activeSound.sound.id, relativeVolume);
                    }}
                    className="flex-1 accent-dream-500"
                  />
                  <span className="text-sm w-10 text-right">
                    {Math.round((activeSound.relativeVolume ?? activeSound.volume / (masterVolume || 1)) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Advanced Frequency Controls */}
        {soundsArray.map((activeSound) => {
          if (!hasAdvancedControls(activeSound.sound.id)) return null;
          
          const frequencyConfig = activeSound.sound.frequencyConfig;
          if (!frequencyConfig) return null;

          const isExpanded = expandedAdvanced.has(activeSound.sound.id);

          return (
            <motion.div
              key={`advanced-${activeSound.sound.id}`}
              initial={false}
              className="mt-4 pt-4 border-t border-white/10"
            >

              {/* Advanced Controls Panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pb-2">
                      {/* Reset Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            resetFrequencyLayersToDefaults(activeSound.sound.id);
                            // Update local state after reset
                            setTimeout(() => updateLayerVolumes(activeSound.sound.id), 100);
                          }}
                          className="glass-effect px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-white/20 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reset to Default
                        </button>
                      </div>

                      {/* Carrier Layers */}
                      {frequencyConfig.carrierLayers.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-gray-300">Carrier Layers (Binaural Beats)</h4>
                          <div className="space-y-3">
                            {frequencyConfig.carrierLayers.map((layer, index) => {
                              const storedVolumes = layerVolumes.get(activeSound.sound.id);
                              const currentVolume = storedVolumes?.carriers[index] ?? layer.volume;
                              return (
                                <div key={index} className="flex items-center gap-3">
                                  <span className="text-xs w-32 text-gray-400">
                                    {layer.leftFreq.toFixed(1)}Hz / {layer.rightFreq.toFixed(1)}Hz
                                    <br />
                                    <span className="text-gray-500">Beat: {layer.beatFreq.toFixed(1)}Hz</span>
                                  </span>
                                  <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={currentVolume}
                                    onChange={(e) => {
                                      const volume = parseFloat(e.target.value);
                                      setCarrierLayerVolume(activeSound.sound.id, index, volume);
                                      // Update local state to trigger re-render
                                      updateLayerVolumes(activeSound.sound.id);
                                    }}
                                    className="flex-1 accent-dream-500"
                                  />
                                  <span className="text-xs w-12 text-right">
                                    {Math.round(currentVolume * 100)}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Isochronic Layers */}
                      {frequencyConfig.isochronicLayers.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-gray-300">Isochronic Layers</h4>
                          <div className="space-y-3">
                            {frequencyConfig.isochronicLayers.map((layer, index) => {
                              const storedVolumes = layerVolumes.get(activeSound.sound.id);
                              const currentVolume = storedVolumes?.isochronics[index] ?? layer.volume;
                              return (
                                <div key={index} className="flex items-center gap-3">
                                  <span className="text-xs w-32 text-gray-400">
                                    {layer.frequency.toFixed(1)}Hz
                                    <br />
                                    <span className="text-gray-500">Pulse: {layer.pulseRate.toFixed(1)}Hz</span>
                                  </span>
                                  <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={currentVolume}
                                    onChange={(e) => {
                                      const volume = parseFloat(e.target.value);
                                      setIsochronicLayerVolume(activeSound.sound.id, index, volume);
                                      // Update local state to trigger re-render
                                      updateLayerVolumes(activeSound.sound.id);
                                    }}
                                    className="flex-1 accent-dream-500"
                                  />
                                  <span className="text-xs w-12 text-right">
                                    {Math.round(currentVolume * 100)}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
          </>
        )}
      </div>
    </div>
  );
}
