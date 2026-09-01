import React, { useState } from 'react';
import { 
  Settings, 
  Sparkles, 
  Trash2, 
  Volume2, 
  Vibrate, 
  Smartphone, 
  Check, 
  AlertTriangle, 
  Download, 
  HeartHandshake, 
  Feather, 
  ShieldCheck, 
  Flame,
  Copy
} from 'lucide-react';
import { PersonalityOption, PersonalityType } from '../types';
import { PERSONALITY_OPTIONS } from '../data/defaults';
import { soundEngine } from '../utils/audio';

interface SettingsScreenProps {
  activePersonality: PersonalityType;
  onChangePersonality: (personality: PersonalityType) => void;
  onClearAllMemory: () => void;
  deviceId: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  ambientSound: boolean;
  onToggleAmbient: () => void;
  hapticsEnabled: boolean;
  onToggleHaptics: () => void;
  onExportData: () => void;
  onOpenDownloadFiles?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  activePersonality,
  onChangePersonality,
  onClearAllMemory,
  deviceId,
  soundEnabled,
  onToggleSound,
  ambientSound,
  onToggleAmbient,
  hapticsEnabled,
  onToggleHaptics,
  onExportData,
  onOpenDownloadFiles,
}) => {
  const [showClearConfirmModal, setShowClearConfirmModal] = useState<boolean>(false);
  const [copiedDeviceId, setCopiedDeviceId] = useState<boolean>(false);

  const handleCopyDeviceId = () => {
    if (soundEnabled) soundEngine.playSparkleSound();
    navigator.clipboard.writeText(deviceId);
    setCopiedDeviceId(true);
    setTimeout(() => setCopiedDeviceId(false), 2000);
  };

  const getPersonalityIcon = (iconName: string, isSelected: boolean) => {
    const iconClass = `w-4 h-4 ${isSelected ? 'text-black' : 'text-[#E27A7A]'}`;
    switch (iconName) {
      case 'HeartHandshake': return <HeartHandshake className={iconClass} />;
      case 'Sparkles': return <Sparkles className={iconClass} />;
      case 'Feather': return <Feather className={iconClass} />;
      case 'ShieldCheck': return <ShieldCheck className={iconClass} />;
      case 'Flame': return <Flame className={iconClass} />;
      default: return <Sparkles className={iconClass} />;
    }
  };

  return (
    <div id="settings-screen-container" className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#050505] select-none">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-[#E27A7A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header in Bold Typography */}
      <div className="px-5 pt-4 pb-3 bg-[#050505]/95 backdrop-blur-2xl border-b border-white/10 z-20 shrink-0">
        <h2 className="font-serif font-bold text-2xl text-[#E27A7A] tracking-tight">
          Settings
        </h2>
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium">
          Persona, atmosphere, and device memory
        </p>
      </div>

      {/* Settings Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar z-10">
        {/* SECTION 1: PERSONALITY CHOICES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#E27A7A] uppercase tracking-widest">
              Riya&apos;s Core Personality
            </span>
            <span className="text-[9px] text-white/40 uppercase tracking-widest">Tone &amp; Intimacy</span>
          </div>

          <div className="space-y-2">
            {PERSONALITY_OPTIONS.map((item: PersonalityOption) => {
              const isSelected = activePersonality === item.id;
              return (
                <div
                  key={item.id}
                  id={`personality-card-${item.id}`}
                  onClick={() => {
                    if (soundEnabled) soundEngine.playSparkleSound();
                    onChangePersonality(item.id);
                  }}
                  className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#0A0A0A] border-[#E27A7A] shadow-[0_0_20px_rgba(226,122,122,0.2)]'
                      : 'bg-[#0A0A0A] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-2xl border mt-0.5 ${isSelected ? 'bg-[#E27A7A] border-[#E27A7A]' : 'bg-white/5 border-white/10'}`}>
                        {getPersonalityIcon(item.icon, isSelected)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-white">
                            {item.name}
                          </h4>
                          {isSelected && (
                            <span className="text-[8px] uppercase px-2 py-0.2 rounded-full bg-[#E27A7A] text-black font-bold tracking-widest">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#E27A7A] font-serif italic mt-0.5">
                          {item.subtitle}
                        </p>
                        <p className="text-[11px] text-white/60 font-light mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                      isSelected ? 'border-[#E27A7A] bg-[#E27A7A] text-black' : 'border-white/20'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: AUDIO & SENSORY */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-[#E27A7A] uppercase tracking-widest">
            Atmosphere &amp; FX
          </span>

          <div className="p-4 rounded-3xl bg-[#0A0A0A] border border-white/20 space-y-3.5">
            {/* Ambient Sanctuary Drone */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-white/5 text-[#E27A7A]">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Romantic Ambient Sanctuary</div>
                  <div className="text-[10px] text-white/40">Warm harmonic midnight frequency</div>
                </div>
              </div>
              <button
                id="toggle-ambient-btn"
                onClick={onToggleAmbient}
                className={`w-10 h-5 rounded-full transition-colors relative ${ambientSound ? 'bg-[#E27A7A]' : 'bg-white/20'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black transition-transform ${ambientSound ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Sound FX */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-white/5 text-[#E27A7A]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Chimes &amp; Sparkle Sounds</div>
                  <div className="text-[10px] text-white/40">Gentle acoustic cues on messages</div>
                </div>
              </div>
              <button
                id="toggle-sound-fx-btn"
                onClick={onToggleSound}
                className={`w-10 h-5 rounded-full transition-colors relative ${soundEnabled ? 'bg-[#E27A7A]' : 'bg-white/20'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Haptic Vibration */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-white/5 text-[#E27A7A]">
                  <Vibrate className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Haptic Touch Vibrations</div>
                  <div className="text-[10px] text-white/40">Tactile pulses for mobile interactions</div>
                </div>
              </div>
              <button
                id="toggle-haptics-btn"
                onClick={onToggleHaptics}
                className={`w-10 h-5 rounded-full transition-colors relative ${hapticsEnabled ? 'bg-[#E27A7A]' : 'bg-white/20'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black transition-transform ${hapticsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: DEVICE IDENTITY & PRIVACY */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-[#E27A7A] uppercase tracking-widest">
            Device Memory &amp; Privacy
          </span>

          <div className="p-4 rounded-3xl bg-[#0A0A0A] border border-white/20 space-y-3.5">
            <div className="flex items-start gap-2.5">
              <Smartphone className="w-4 h-4 text-[#E27A7A] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-white">No Login Required • Device-ID Session</div>
                <div className="text-[11px] text-white/60 mt-0.5">
                  Riya remembers you directly through this device’s unique local identity.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-mono text-white/80 truncate max-w-[200px]">
                {deviceId}
              </span>
              <button
                id="copy-device-id-btn"
                onClick={handleCopyDeviceId}
                className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-[#E27A7A] hover:text-white px-2.5 py-1 rounded-full bg-white/5 border border-white/10"
              >
                {copiedDeviceId ? <Check className="w-3 h-3 text-[#E27A7A]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedDeviceId ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Export backup & Source Code Files */}
            <div className="border-t border-white/5 pt-2.5 space-y-2">
              {onOpenDownloadFiles && (
                <button
                  id="open-source-files-btn"
                  onClick={onOpenDownloadFiles}
                  className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-[#E27A7A] hover:bg-[#eb8c8c] text-[10px] uppercase tracking-widest text-black font-bold transition-all shadow-md shadow-[#E27A7A]/20"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Download Action History Files (8 Files)</span>
                </button>
              )}

              <button
                id="export-data-btn"
                onClick={onExportData}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-white/5 hover:bg-white/10 text-[10px] uppercase tracking-widest text-white/70 hover:text-white transition-colors border border-white/10"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Chat &amp; Memory Backup (JSON)</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: DANGER ZONE - CLEAR ALL MEMORY */}
        <div className="pt-2 pb-6 space-y-2">
          <button
            id="open-clear-memory-btn"
            onClick={() => setShowClearConfirmModal(true)}
            className="w-full py-3.5 px-4 rounded-full border border-red-900/50 text-red-400 text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-red-950/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Clear All Memory &amp; Reset Riya</span>
          </button>
          <p className="text-[9px] uppercase tracking-widest text-white/30 text-center">
            Erases name, nickname, likes, saved moments, and message history.
          </p>
        </div>
      </div>

      {/* Clear Memory Confirmation Modal */}
      {showClearConfirmModal && (
        <div 
          id="clear-confirm-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-sm bg-[#0A0A0A] border border-red-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-serif font-bold text-lg text-white">
              Erase Riya&apos;s Memory?
            </h3>

            <p className="text-xs text-white/70 leading-relaxed">
              This will permanently delete your <span className="text-[#E27A7A] font-semibold">About You profile</span>, all <span className="text-[#E27A7A] font-semibold">Saved Moments</span>, and active chat history. Riya will be reset to her initial state.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                id="cancel-clear-btn"
                onClick={() => setShowClearConfirmModal(false)}
                className="flex-1 py-3 px-4 rounded-full bg-white/10 hover:bg-white/15 text-[10px] uppercase tracking-widest text-white font-semibold"
              >
                Keep Memory
              </button>
              <button
                id="confirm-clear-memory-btn"
                onClick={() => {
                  if (soundEnabled) soundEngine.playSparkleSound();
                  onClearAllMemory();
                  setShowClearConfirmModal(false);
                }}
                className="flex-1 py-3 px-4 rounded-full bg-red-600 hover:bg-red-500 text-[10px] uppercase tracking-widest text-white font-semibold shadow-lg shadow-red-950/60"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

