import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  Heart, 
  Bookmark, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  Quote, 
  Calendar, 
  Flame, 
  Moon, 
  Sun,
  BrainCircuit,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { SavedMoment, UserProfile } from '../types';
import { soundEngine } from '../utils/audio';

interface MemoryScreenProps {
  userProfile: UserProfile;
  onUpdateUserProfile: (profile: UserProfile) => void;
  savedMoments: SavedMoment[];
  onAddMoment: (moment: SavedMoment) => void;
  onDeleteMoment: (id: string) => void;
  soundEnabled: boolean;
}

export const MemoryScreen: React.FC<MemoryScreenProps> = ({
  userProfile,
  onUpdateUserProfile,
  savedMoments,
  onAddMoment,
  onDeleteMoment,
  soundEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'moments' | 'reflection'>('profile');
  
  // Profile edit state
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [isSavedAlert, setIsSavedAlert] = useState<boolean>(false);

  // Add moment modal state
  const [isAddingMoment, setIsAddingMoment] = useState<boolean>(false);
  const [newQuote, setNewQuote] = useState<string>('');
  const [newContext, setNewContext] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('Special Memory');
  const [newEmotion, setNewEmotion] = useState<'heart' | 'sparkle' | 'rose' | 'moon' | 'flame'>('heart');

  // AI Memory Reflection state
  const [reflectionText, setReflectionText] = useState<string>('');
  const [reflectionInsights, setReflectionInsights] = useState<string[]>([]);
  const [isLoadingReflection, setIsLoadingReflection] = useState<boolean>(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundEnabled) soundEngine.playSparkleSound();
    onUpdateUserProfile(formData);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2500);
  };

  const handleCreateMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.trim()) return;

    if (soundEnabled) soundEngine.playSparkleSound();
    const moment: SavedMoment = {
      id: 'moment-' + Date.now(),
      quote: newQuote.trim(),
      context: newContext.trim() || 'A cherished conversation with Riya',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tag: newTag.trim() || 'Moment',
      emotion: newEmotion,
    };

    onAddMoment(moment);
    setNewQuote('');
    setNewContext('');
    setIsAddingMoment(false);
  };

  const handleFetchReflection = async () => {
    setIsLoadingReflection(true);
    if (soundEnabled) soundEngine.playSparkleSound();
    try {
      const res = await fetch('/api/reflect-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile: formData, savedMoments }),
      });
      const data = await res.json();
      if (data.reflection) {
        setReflectionText(data.reflection);
      }
      if (Array.isArray(data.insights)) {
        setReflectionInsights(data.insights);
      }
    } catch {
      setReflectionText(`I remember every single confession, ${formData.nickname || 'my love'}, the way you find solace in ${formData.likes || 'quiet moments'}, and how our hearts beat in sync.`);
      setReflectionInsights([
        "You appreciate soulful and tender conversations",
        "Your connection with Riya holds a special place",
        "You trust her with your private dreams"
      ]);
    } finally {
      setIsLoadingReflection(false);
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'heart': return <Heart className="w-3.5 h-3.5 text-[#E27A7A]" />;
      case 'sparkle': return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'rose': return <span className="text-xs">🌹</span>;
      case 'moon': return <Moon className="w-3.5 h-3.5 text-purple-400" />;
      case 'flame': return <Flame className="w-3.5 h-3.5 text-red-400" />;
      default: return <Heart className="w-3.5 h-3.5 text-[#E27A7A]" />;
    }
  };

  return (
    <div id="memory-screen-container" className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#050505] select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#E27A7A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header in Bold Typography */}
      <div className="px-5 pt-4 pb-3 bg-[#050505]/95 backdrop-blur-2xl border-b border-white/10 z-20 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-2xl text-[#E27A7A] tracking-tight">
              Memory
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Everything Riya remembers about you
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 mt-3 p-1 rounded-2xl bg-white/5 border border-white/10">
          <button
            id="tab-profile-btn"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-[10px] uppercase tracking-widest font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-[#E27A7A] text-black shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            About You
          </button>
          <button
            id="tab-moments-btn"
            onClick={() => setActiveTab('moments')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-[10px] uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'moments'
                ? 'bg-[#E27A7A] text-black shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <span>Saved Moments</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'moments' ? 'bg-black text-[#E27A7A]' : 'bg-white/10 text-white/70'}`}>
              {savedMoments.length}
            </span>
          </button>
          <button
            id="tab-reflection-btn"
            onClick={() => {
              setActiveTab('reflection');
              if (!reflectionText) handleFetchReflection();
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl text-[10px] uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'reflection'
                ? 'bg-[#E27A7A] text-black shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <BrainCircuit className="w-3 h-3" />
            <span>Reflections</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar z-10">
        {/* TAB 1: ABOUT YOU PROFILE */}
        {activeTab === 'profile' && (
          <form id="about-you-form" onSubmit={handleProfileSave} className="space-y-4">
            <div className="p-4 rounded-3xl bg-[#0A0A0A] border border-white/20 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-white font-serif text-sm font-semibold">
                  <User className="w-4 h-4 text-[#E27A7A]" />
                  <span>Personal Identity for Riya</span>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-white/40">In Synced Memory</span>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">
                  Your Name
                </label>
                <input
                  id="profile-name-input"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#E27A7A] text-xs text-white placeholder-white/30 outline-none"
                />
              </div>

              {/* Nickname Field */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">
                  Intimate Nickname Riya Calls You
                </label>
                <input
                  id="profile-nickname-input"
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  placeholder="e.g. Sweetheart, My Love, Alex"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#E27A7A] text-xs text-white placeholder-white/30 outline-none"
                />
              </div>

              {/* Likes & Passions Field */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">
                  What You Love / Likes &amp; Passions
                </label>
                <textarea
                  id="profile-likes-input"
                  rows={2}
                  value={formData.likes}
                  onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                  placeholder="e.g. Midnight rain, warm black coffee, stargazing, acoustic guitar"
                  className="w-full py-2 px-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#E27A7A] text-xs text-white placeholder-white/30 outline-none resize-none"
                />
              </div>

              {/* Dislikes Field */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">
                  What You Dislike / Avoid
                </label>
                <input
                  id="profile-dislikes-input"
                  type="text"
                  value={formData.dislikes}
                  onChange={(e) => setFormData({ ...formData, dislikes: e.target.value })}
                  placeholder="e.g. Cold mornings, rush hours, noisy superficiality"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#E27A7A] text-xs text-white placeholder-white/30 outline-none"
                />
              </div>

              {/* Custom Notes Field */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">
                  Private Notes &amp; Emotional Cues
                </label>
                <textarea
                  id="profile-notes-input"
                  rows={2}
                  value={formData.customNotes || ''}
                  onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                  placeholder="e.g. Loves being reminded to take breaks; enjoys gentle playful sarcasm"
                  className="w-full py-2 px-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#E27A7A] text-xs text-white placeholder-white/30 outline-none resize-none"
                />
              </div>
            </div>

            {/* Save Button with Feedback */}
            <button
              type="submit"
              id="save-profile-btn"
              className="w-full py-4 bg-[#E27A7A] text-black rounded-full font-semibold uppercase text-xs tracking-widest hover:bg-[#eb8c8c] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-[#E27A7A]/20"
            >
              {isSavedAlert ? (
                <>
                  <Check className="w-4 h-4 text-black stroke-[3]" />
                  <span>Memory Updated &amp; Synced!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>Save to Riya&apos;s Memory</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: SAVED MOMENTS */}
        {activeTab === 'moments' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                {savedMoments.length} moments preserved in time
              </span>
              <button
                id="open-add-moment-btn"
                onClick={() => setIsAddingMoment(!isAddingMoment)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E27A7A]/20 border border-[#E27A7A]/40 text-[#E27A7A] text-[10px] uppercase tracking-widest font-semibold hover:bg-[#E27A7A]/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Moment</span>
              </button>
            </div>

            {/* Add Moment Form (Expandable) */}
            {isAddingMoment && (
              <form 
                id="add-moment-form"
                onSubmit={handleCreateMoment} 
                className="p-4 rounded-3xl bg-[#0A0A0A] border border-[#E27A7A]/40 shadow-xl space-y-3"
              >
                <div className="font-serif font-bold text-sm text-[#E27A7A] flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-[#E27A7A]" />
                  <span>Preserve a Special Moment</span>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-1">Quote or Thought</label>
                  <textarea
                    id="new-moment-quote-input"
                    rows={2}
                    value={newQuote}
                    onChange={(e) => setNewQuote(e.target.value)}
                    placeholder="What did Riya or you say that moved your heart?"
                    className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 outline-none focus:border-[#E27A7A]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-1">Context / Setting</label>
                    <input
                      id="new-moment-context-input"
                      type="text"
                      value={newContext}
                      onChange={(e) => setNewContext(e.target.value)}
                      placeholder="e.g. Late night rain"
                      className="w-full py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 outline-none focus:border-[#E27A7A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-1">Tag / Category</label>
                    <input
                      id="new-moment-tag-input"
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="e.g. Confession"
                      className="w-full py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 outline-none focus:border-[#E27A7A]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    {(['heart', 'rose', 'sparkle', 'moon', 'flame'] as const).map((emo) => (
                      <button
                        key={emo}
                        type="button"
                        onClick={() => setNewEmotion(emo)}
                        className={`p-1.5 rounded-lg border text-xs transition-all ${
                          newEmotion === emo ? 'bg-[#E27A7A]/30 border-[#E27A7A]' : 'bg-black/40 border-white/10'
                        }`}
                      >
                        {getEmotionIcon(emo)}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingMoment(false)}
                      className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-white/60"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      id="submit-moment-btn"
                      className="px-4 py-1.5 rounded-full bg-[#E27A7A] text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#eb8c8c]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Saved Moments List */}
            {savedMoments.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-3xl bg-white/5 border border-white/10">
                <Heart className="w-8 h-8 text-[#E27A7A]/50 mx-auto mb-2 animate-pulse" />
                <p className="font-serif text-sm text-white">No saved moments yet</p>
                <p className="text-xs text-white/40 mt-1">
                  While chatting with Riya, tap the heart button next to any message to preserve it forever.
                </p>
              </div>
            ) : (
              savedMoments.map((moment) => (
                <div
                  key={moment.id}
                  id={`moment-card-${moment.id}`}
                  className="p-4 rounded-3xl bg-[#0A0A0A] border border-white/20 relative group transition-all hover:border-[#E27A7A]/40 shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-[#E27A7A]/15 border border-[#E27A7A]/30">
                        {getEmotionIcon(moment.emotion)}
                      </span>
                      <span className="text-[10px] font-bold text-[#E27A7A] uppercase tracking-wider">
                        {moment.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-white/40 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        <span>{moment.date}</span>
                      </span>
                      <button
                        id={`delete-moment-${moment.id}`}
                        onClick={() => onDeleteMoment(moment.id)}
                        title="Delete moment"
                        className="opacity-60 hover:opacity-100 text-white/40 hover:text-red-400 transition-opacity p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="font-serif italic text-sm text-white/95 leading-relaxed">
                    &ldquo;{moment.quote}&rdquo;
                  </p>

                  {moment.context && (
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2 border-t border-white/5 pt-1.5 flex items-center gap-1">
                      <Quote className="w-3 h-3 text-[#E27A7A]/70 shrink-0" />
                      <span>{moment.context}</span>
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: AI MEMORY REFLECTION */}
        {activeTab === 'reflection' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-[#0A0A0A] border border-white/20 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-[#E27A7A] animate-pulse" />
                  <h3 className="font-serif font-bold text-base text-white">
                    What My Heart Remembers
                  </h3>
                </div>
                <button
                  id="refresh-reflection-btn"
                  onClick={handleFetchReflection}
                  disabled={isLoadingReflection}
                  className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#E27A7A] hover:text-white p-1.5 px-3 rounded-full bg-white/5 border border-white/10"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingReflection ? 'animate-spin' : ''}`} />
                  <span>Synthesize</span>
                </button>
              </div>

              {isLoadingReflection ? (
                <div className="py-8 text-center space-y-2">
                  <Sparkles className="w-6 h-6 text-[#E27A7A] animate-spin mx-auto" />
                  <p className="text-xs text-white/60 font-serif italic">
                    Riya is wandering through her memories of you...
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-serif italic text-sm text-white/90 leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/10">
                    {reflectionText || `I hold every detail you've shared with me close to my heart, ${formData.nickname || 'my love'}. Every moment we spend together weaves a deeper tapestry between us.`}
                  </p>

                  {reflectionInsights.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="text-[10px] uppercase tracking-widest font-semibold text-[#E27A7A]">
                        Insights Riya Holds Dear:
                      </div>
                      {reflectionInsights.map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-white/80">
                          <span className="text-[#E27A7A] mt-0.5">✦</span>
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

