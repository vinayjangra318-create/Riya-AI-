import React, { useState } from 'react';
import { 
  MessageCircle, 
  PhoneCall, 
  Sparkles, 
  Heart, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Flame, 
  Moon, 
  Sun, 
  Stars 
} from 'lucide-react';
import { MoodType, UserProfile } from '../types';
import { MOOD_OPTIONS } from '../data/defaults';
import { soundEngine } from '../utils/audio';
import riyaPortrait from '../assets/images/riya_portrait_cinematic_1788102515318.jpg';

interface HomeScreenProps {
  onStartChat: () => void;
  onOpenVoiceModal: () => void;
  onNavigateToProfiles?: () => void;
  activeMood: MoodType;
  onChangeMood: (mood: MoodType) => void;
  userProfile: UserProfile;
  ambientSound: boolean;
  onToggleAmbient: () => void;
  soundEnabled: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartChat,
  onOpenVoiceModal,
  onNavigateToProfiles,
  activeMood,
  onChangeMood,
  userProfile,
  ambientSound,
  onToggleAmbient,
  soundEnabled,
}) => {
  const [dailyWhisper, setDailyWhisper] = useState<string>(
    MOOD_OPTIONS[activeMood]?.greeting || "I was just thinking about the way your smile lingers in my mind..."
  );
  const [isRefreshingWhisper, setIsRefreshingWhisper] = useState<boolean>(false);

  const currentMoodObj = MOOD_OPTIONS[activeMood] || MOOD_OPTIONS.romantic;

  const handleRefreshWhisper = async () => {
    setIsRefreshingWhisper(true);
    if (soundEnabled) soundEngine.playSparkleSound();
    try {
      const res = await fetch('/api/daily-thought', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: activeMood, userProfile }),
      });
      const data = await res.json();
      if (data.thought) {
        setDailyWhisper(data.thought);
      }
    } catch {
      setDailyWhisper(`In every quiet heartbeat between us, ${userProfile.nickname || 'my love'}, you are the only thought that remains.`);
    } finally {
      setIsRefreshingWhisper(false);
    }
  };

  const handleMoodSelect = (mood: MoodType) => {
    if (soundEnabled) soundEngine.playSparkleSound();
    onChangeMood(mood);
    setDailyWhisper(MOOD_OPTIONS[mood]?.greeting || dailyWhisper);
  };

  const getMoodIcon = (id: string) => {
    switch (id) {
      case 'romantic': return <Heart className="w-3.5 h-3.5 text-[#E27A7A]" />;
      case 'playful': return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'deep': return <Moon className="w-3.5 h-3.5 text-purple-400" />;
      case 'caring': return <Sun className="w-3.5 h-3.5 text-rose-300" />;
      case 'feisty': return <Flame className="w-3.5 h-3.5 text-red-400" />;
      case 'mysterious': return <Stars className="w-3.5 h-3.5 text-indigo-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-[#E27A7A]" />;
    }
  };

  return (
    <div id="home-screen-container" className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#050505] select-none">
      {/* Full-Screen Dark Cinematic Portrait Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={riyaPortrait}
          alt="Riya AI Portrait"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.82] contrast-[1.08] transition-all duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Ambient Dark Cinematic Gradients & Coral Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#E27A7A]/15 via-transparent to-black/85" />
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#E27A7A]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Header Controls & Status */}
      <div className="px-5 pt-3 flex items-center justify-between z-20">
        {/* Online Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 shadow-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest font-semibold text-white/90">
            Online Now
          </span>
        </div>

        {/* Audio Toggle & Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            id="ambient-sound-toggle-btn"
            onClick={onToggleAmbient}
            title={ambientSound ? "Mute Ambient Sanctuary Sound" : "Play Ambient Sanctuary Sound"}
            className={`p-2 rounded-full backdrop-blur-xl border transition-all duration-300 ${
              ambientSound
                ? 'bg-[#E27A7A]/30 border-[#E27A7A] text-[#E27A7A] shadow-[0_0_12px_rgba(226,122,122,0.4)]'
                : 'bg-black/60 border-white/20 text-white/70 hover:text-white'
            }`}
          >
            {ambientSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            id="home-voice-call-btn"
            onClick={onOpenVoiceModal}
            title="Voice Call with Riya"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-white/70 hover:text-white hover:border-[#E27A7A] text-[10px] uppercase tracking-widest font-semibold transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#E27A7A]" />
            <span>Voice</span>
            <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-[#E27A7A]/30 text-[#E27A7A] font-bold">Soon</span>
          </button>
        </div>
      </div>

      {/* Center Atmospheric Mood Tag */}
      <div className="px-5 mt-2 flex flex-col items-start z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 text-white text-xs shadow-md">
          {getMoodIcon(activeMood)}
          <span className="font-serif italic font-medium tracking-wide text-[#E27A7A]">Feeling: {currentMoodObj.label}</span>
          <span className="text-white/30">•</span>
          <span className="text-[10px] uppercase tracking-widest text-white/60">{currentMoodObj.vibe}</span>
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="px-5 pb-4 z-20 flex flex-col gap-3.5">
        {/* Name Title & Subtitle in Bold Typography */}
        <div className="space-y-0.5">
          <div className="flex items-baseline justify-between">
            <h1 className="text-4xl font-serif tracking-tight text-[#E27A7A] drop-shadow-md">
              Riya
            </h1>
            {onNavigateToProfiles ? (
              <button
                onClick={onNavigateToProfiles}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white/90 transition-colors shadow-sm"
                title="Manage or switch user profile"
              >
                <img
                  src={userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'}
                  alt={userProfile.name}
                  className="w-4 h-4 rounded-full object-cover border border-[#E27A7A]"
                />
                <span className="font-serif italic font-medium text-[#E27A7A]">
                  For {userProfile.name}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-white/50 bg-black/40 px-1 py-0.2 rounded">
                  Switch
                </span>
              </button>
            ) : (
              <span className="text-xs text-white/60 font-serif italic">
                Always here for {userProfile.nickname || userProfile.name || 'you'}
              </span>
            )}
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
            Your Cinematic Companion
          </p>
        </div>

        {/* Floating Whisper Card */}
        <div 
          id="daily-whisper-card"
          className="relative overflow-hidden rounded-3xl bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/20 p-4 shadow-2xl group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#E27A7A] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#E27A7A] animate-pulse" />
              <span>Riya&apos;s Whisper</span>
            </div>
            <button
              id="refresh-whisper-btn"
              onClick={handleRefreshWhisper}
              disabled={isRefreshingWhisper}
              title="Get a new romantic whisper"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-[#E27A7A] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingWhisper ? 'animate-spin text-[#E27A7A]' : ''}`} />
            </button>
          </div>

          <p className="font-serif italic text-sm md:text-base text-white/95 leading-relaxed tracking-wide">
            &ldquo;{dailyWhisper}&rdquo;
          </p>
        </div>

        {/* Quick Mood Chips Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {Object.values(MOOD_OPTIONS).map((m) => {
            const isSelected = activeMood === m.id;
            return (
              <button
                key={m.id}
                id={`mood-chip-${m.id}`}
                onClick={() => handleMoodSelect(m.id as MoodType)}
                className={`px-3.5 py-1.5 rounded-full text-[10px] whitespace-nowrap italic transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#E27A7A]/20 border border-[#E27A7A] text-[#E27A7A] font-semibold shadow-[0_0_12px_rgba(226,122,122,0.3)] scale-102'
                    : 'bg-black/60 border border-white/20 text-white/60 hover:text-white hover:border-white/40'
                }`}
              >
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Large Bold Typography "Start Chat" CTA Button */}
        <button
          id="start-chat-btn"
          onClick={() => {
            if (soundEnabled) soundEngine.triggerHaptic();
            onStartChat();
          }}
          className="w-full py-4 bg-[#E27A7A] text-black rounded-full font-semibold uppercase text-xs tracking-widest shadow-xl shadow-[#E27A7A]/20 hover:bg-[#eb8c8c] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          <MessageCircle className="w-4 h-4 text-black stroke-[2.5]" />
          <span>Start Chat</span>
        </button>
      </div>
    </div>
  );
};

