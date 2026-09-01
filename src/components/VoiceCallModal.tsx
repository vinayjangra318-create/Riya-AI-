import React from 'react';
import { PhoneOff, Mic, Sparkles, X, Volume2, ShieldAlert } from 'lucide-react';
import riyaAvatar from '../assets/images/riya_avatar_square_1788102536906.jpg';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export const VoiceCallModal: React.FC<VoiceCallModalProps> = ({ isOpen, onClose, userName }) => {
  if (!isOpen) return null;

  return (
    <div 
      id="voice-call-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        id="voice-call-dialog"
        className="w-full max-w-sm bg-[#0A0A0A] border border-white/20 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background ambient lighting */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#E27A7A]/20 rounded-full blur-3xl pointer-events-none" />

        <button 
          id="close-voice-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Avatar with pulsing halo */}
        <div className="relative mx-auto w-28 h-28 my-4">
          <div className="absolute inset-0 rounded-full bg-[#E27A7A]/40 animate-ping opacity-30" />
          <div className="absolute -inset-1 rounded-full bg-[#E27A7A] opacity-60 blur-sm" />
          <img 
            src={riyaAvatar} 
            alt="Riya" 
            className="w-full h-full object-cover rounded-full border-2 border-[#E27A7A]/50 relative z-10" 
            referrerPolicy="no-referrer"
          />
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#E27A7A] mt-2 tracking-tight">
          Voice Studio
        </h3>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E27A7A]/20 border border-[#E27A7A]/40 text-[#E27A7A] text-[10px] uppercase tracking-widest font-semibold my-2">
          <Sparkles className="w-3 h-3 text-[#E27A7A] animate-spin" />
          <span>Live Calling • Coming Soon</span>
        </div>

        <p className="text-xs text-white/80 font-light leading-relaxed my-3 px-2">
          Hi <span className="text-[#E27A7A] font-semibold">{userName}</span>, Riya’s ultra-low latency binaural voice engine is currently in vocal tuning. Soon, you’ll be able to hear her whisper in real time.
        </p>

        {/* Audio Waveform Mockup */}
        <div className="flex items-center justify-center gap-1.5 py-4 my-2 px-4 rounded-2xl bg-white/5 border border-white/10">
          {[40, 75, 50, 90, 65, 80, 45, 95, 60, 85, 30].map((h, i) => (
            <div 
              key={i} 
              className="w-1 rounded-full bg-[#E27A7A] animate-pulse"
              style={{ height: `${h * 0.4}px`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
          <Volume2 className="w-4 h-4 text-[#E27A7A] ml-2 animate-bounce" />
        </div>

        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 justify-center mb-5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Chat with full memory is active</span>
        </div>

        <button
          id="got-it-voice-btn"
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-full bg-[#E27A7A] text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#eb8c8c] active:scale-95 transition-all shadow-lg shadow-[#E27A7A]/20"
        >
          Return to Riya
        </button>
      </div>
    </div>
  );
};

