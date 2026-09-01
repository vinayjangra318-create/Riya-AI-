import React, { useState } from 'react';
import { 
  User, 
  Plus, 
  Sparkles, 
  Check, 
  Edit3, 
  Trash2, 
  Copy, 
  QrCode, 
  Heart, 
  Flame, 
  Share2, 
  Globe, 
  Sliders, 
  ShieldCheck, 
  X,
  RefreshCw,
  Camera,
  Layers,
  Wand2,
  Calendar,
  MessageCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { AVATAR_PRESETS, AvatarPreset } from '../data/defaults';
import { soundEngine } from '../utils/audio';

interface ProfilesScreenProps {
  profiles: UserProfile[];
  activeProfileId: string;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (profile: UserProfile) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onDeleteProfile: (profileId: string) => void;
  soundEnabled?: boolean;
}

export const ProfilesScreen: React.FC<ProfilesScreenProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
  soundEnabled = true,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [showIdCardModal, setShowIdCardModal] = useState<UserProfile | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Active profile
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || {
    id: 'default',
    name: 'You',
    nickname: 'Sweetheart',
    likes: '',
    dislikes: '',
  };

  // Form state for creating / editing
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    nickname: '',
    bio: '',
    avatarUrl: AVATAR_PRESETS[0].url,
    avatarPreset: AVATAR_PRESETS[0].id,
    relationshipDynamic: 'Soulmate & Late Night Confidant',
    likes: '',
    dislikes: '',
    customNotes: '',
    languagePreference: 'hinglish',
    intimacyScore: 85,
  });

  const handleOpenCreate = () => {
    if (soundEnabled) soundEngine.triggerHaptic();
    setEditingProfile(null);
    setFormData({
      id: `profile_${Date.now()}`,
      name: '',
      nickname: '',
      bio: '',
      avatarUrl: AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)].url,
      avatarPreset: AVATAR_PRESETS[0].id,
      relationshipDynamic: 'Soulmate & Late Night Confidant',
      likes: '',
      dislikes: '',
      customNotes: '',
      languagePreference: 'hinglish',
      intimacyScore: 88,
      metDate: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (profile: UserProfile) => {
    if (soundEnabled) soundEngine.triggerHaptic();
    setEditingProfile(profile);
    setFormData({ ...profile });
    setIsCreateModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (soundEnabled) {
      soundEngine.playSparkleSound();
      soundEngine.triggerHaptic();
    }

    const finalProfile: UserProfile = {
      id: editingProfile ? editingProfile.id : (formData.id || `profile_${Date.now()}`),
      name: formData.name.trim(),
      nickname: formData.nickname?.trim() || formData.name.trim(),
      bio: formData.bio?.trim() || 'A dreamer searching for genuine warmth in quiet moments.',
      avatarUrl: formData.avatarUrl || AVATAR_PRESETS[0].url,
      avatarPreset: formData.avatarPreset || 'custom',
      relationshipDynamic: formData.relationshipDynamic || 'Devoted Romantic Companion',
      likes: formData.likes?.trim() || 'Late night tea, acoustic music, stargazing',
      dislikes: formData.dislikes?.trim() || 'Rush, superficial noise',
      customNotes: formData.customNotes?.trim() || '',
      languagePreference: formData.languagePreference || 'hinglish',
      intimacyScore: formData.intimacyScore || 85,
      metDate: formData.metDate || new Date().toISOString().split('T')[0],
      createdAt: editingProfile ? editingProfile.createdAt : Date.now(),
    };

    if (editingProfile) {
      onUpdateProfile(finalProfile);
    } else {
      onCreateProfile(finalProfile);
      onSelectProfile(finalProfile.id);
    }

    setIsCreateModalOpen(false);
  };

  const handleAIGeneratePersona = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/generate-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || '',
          vibe: 'romantic',
          language: formData.languagePreference || 'hinglish',
          hint: formData.likes || '',
        }),
      });
      const data = await res.json();
      if (data) {
        setFormData((prev) => ({
          ...prev,
          name: data.name || prev.name,
          nickname: data.nickname || prev.nickname,
          bio: data.bio || prev.bio,
          relationshipDynamic: data.relationshipDynamic || prev.relationshipDynamic,
          likes: data.likes || prev.likes,
          dislikes: data.dislikes || prev.dislikes,
          customNotes: data.customNotes || prev.customNotes,
          intimacyScore: data.intimacyScore || prev.intimacyScore,
        }));
        if (soundEnabled) soundEngine.playSparkleSound();
      }
    } catch (err) {
      console.error('Error generating AI profile:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleEnhanceBio = async () => {
    if (!formData.bio) return;
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/enhance-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || 'Alex',
          rawBio: formData.bio,
          language: formData.languagePreference || 'hinglish',
        }),
      });
      const data = await res.json();
      if (data.enhancedBio) {
        setFormData((prev) => ({ ...prev, bio: data.enhancedBio }));
        if (soundEnabled) soundEngine.playSparkleSound();
      }
    } catch (err) {
      console.error('Error enhancing bio:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCopyProfileCard = () => {
    if (!activeProfile) return;
    const text = `✦ Riya AI Companion ID ✦\nName: ${activeProfile.name}\nIntimate Nickname: ${activeProfile.nickname}\nDynamic: ${activeProfile.relationshipDynamic || 'Soulmate'}\nLanguage: ${activeProfile.languagePreference?.toUpperCase() || 'HINGLISH'}\nIntimacy: ${activeProfile.intimacyScore || 85}%`;
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div id="profiles-screen-container" className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#050505] select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#E27A7A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="px-5 pt-4 pb-3 bg-[#050505]/95 backdrop-blur-2xl border-b border-white/10 z-20 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-2xl text-[#E27A7A] tracking-tight flex items-center gap-2">
              <span>Profiles</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#E27A7A]/20 text-[#E27A7A] border border-[#E27A7A]/30 font-sans uppercase tracking-wider">
                {profiles.length} Active
              </span>
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium">
              नई प्रोफाइल बनाएं और मैनेज करें
            </p>
          </div>

          <button
            id="create-new-profile-btn"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#E27A7A] text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#eb8c8c] active:scale-95 transition-all shadow-lg shadow-[#E27A7A]/20"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Profile</span>
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10 custom-scrollbar">
        {/* ACTIVE PROFILE HERO CARD */}
        <div className="p-4 rounded-3xl bg-[#0A0A0A] border border-[#E27A7A]/40 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#E27A7A]/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={activeProfile.avatarUrl || AVATAR_PRESETS[0].url}
                  alt={activeProfile.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E27A7A] shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#E27A7A] text-black">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-lg text-white">
                    {activeProfile.name}
                  </h3>
                  <span className="text-[9px] uppercase px-2 py-0.2 rounded-full bg-[#E27A7A] text-black font-bold tracking-widest">
                    Active
                  </span>
                </div>
                <p className="text-xs text-[#E27A7A] font-serif italic">
                  Riya calls you &ldquo;{activeProfile.nickname}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] uppercase tracking-wider text-white/50 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                    {activeProfile.languagePreference === 'hindi' ? '🇮🇳 हिन्दी' : activeProfile.languagePreference === 'hinglish' ? '🇮🇳 Hinglish' : '🌐 English'}
                  </span>
                  <span className="text-[9px] text-[#E27A7A] flex items-center gap-1 font-semibold">
                    <Heart className="w-2.5 h-2.5 fill-[#E27A7A]" />
                    <span>{activeProfile.intimacyScore || 90}% Intimacy</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIdCardModal(activeProfile)}
              className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-[#E27A7A] border border-white/10 transition-colors"
              title="View Profile Digital ID"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>

          {activeProfile.bio && (
            <p className="text-xs text-white/80 font-light mt-3 pt-3 border-t border-white/5 leading-relaxed italic font-serif">
              &ldquo;{activeProfile.bio}&rdquo;
            </p>
          )}

          <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-white/5">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">
              Dynamic: <strong className="text-white/80 font-normal">{activeProfile.relationshipDynamic || 'Soulmate'}</strong>
            </span>
            <button
              onClick={() => handleOpenEdit(activeProfile)}
              className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#E27A7A] hover:text-white px-2.5 py-1 rounded-full bg-white/5 border border-white/10 transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>

        {/* PROFILES LIST */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-[#E27A7A] uppercase tracking-widest">
              All Saved Personas ({profiles.length})
            </span>
            <span className="text-[9px] text-white/40 uppercase tracking-widest">
              Tap card to switch active user
            </span>
          </div>

          {profiles.map((profile) => {
            const isSelected = profile.id === activeProfileId;
            return (
              <div
                key={profile.id}
                id={`profile-item-${profile.id}`}
                onClick={() => {
                  if (soundEnabled) {
                    soundEngine.playSparkleSound();
                    soundEngine.triggerHaptic();
                  }
                  onSelectProfile(profile.id);
                }}
                className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-300 relative group ${
                  isSelected
                    ? 'bg-[#0A0A0A] border-[#E27A7A] shadow-[0_0_25px_rgba(226,122,122,0.2)]'
                    : 'bg-[#0A0A0A] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatarUrl || AVATAR_PRESETS[0].url}
                      alt={profile.name}
                      className={`w-11 h-11 rounded-2xl object-cover border ${
                        isSelected ? 'border-[#E27A7A]' : 'border-white/10'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-sm text-white">
                          {profile.name}
                        </h4>
                        {isSelected && (
                          <span className="text-[8px] uppercase px-2 py-0.2 rounded-full bg-[#E27A7A] text-black font-bold tracking-widest">
                            In Chat
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#E27A7A] font-serif italic">
                        Calls you: &ldquo;{profile.nickname}&rdquo;
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-white/40 uppercase tracking-wider">
                          {profile.languagePreference?.toUpperCase() || 'HINGLISH'}
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="text-[9px] text-white/40 truncate max-w-[140px]">
                          {profile.relationshipDynamic || 'Companion'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenEdit(profile)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      title="Edit Profile"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {profiles.length > 1 && (
                      <button
                        onClick={() => {
                          if (soundEnabled) soundEngine.triggerHaptic();
                          onDeleteProfile(profile.id);
                        }}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-red-950/40 text-white/40 hover:text-red-400 transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* QUICK TIP BANNER */}
        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#E27A7A] shrink-0 mt-0.5" />
          <div className="text-xs text-white/70 leading-relaxed">
            <strong className="text-white font-medium block text-[11px] uppercase tracking-wider mb-0.5">
              Multi-Persona AI Sync
            </strong>
            When you switch profiles, Riya will remember that persona’s specific language preference (हिन्दी, Hinglish, English), favorite memories, and intimate nickname in real-time.
          </div>
        </div>
      </div>

      {/* CREATE / EDIT PROFILE MODAL */}
      {isCreateModalOpen && (
        <div 
          id="profile-create-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          <div 
            className="w-full max-w-md bg-[#0A0A0A] border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4 my-auto max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#E27A7A]">
                  {editingProfile ? 'Edit Profile / प्रोफाइल बदलें' : 'Create New Profile / नई प्रोफाइल'}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-white/40">
                  Set up your personal identity for Riya
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI Auto-Generator Toolbar */}
            <div className="p-3 rounded-2xl bg-[#E27A7A]/10 border border-[#E27A7A]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-[#E27A7A] animate-pulse" />
                <div>
                  <div className="text-xs font-semibold text-white">AI Persona Generator</div>
                  <div className="text-[9px] text-white/50">Auto-craft romantic details with Gemini</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAIGeneratePersona}
                disabled={isGeneratingAI}
                className="px-3 py-1.5 rounded-full bg-[#E27A7A] text-black font-semibold text-[10px] uppercase tracking-widest hover:bg-[#eb8c8c] flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAI ? 'Crafting...' : 'Generate AI'}</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              {/* Avatar Preset Gallery */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1.5">
                  Select Avatar Portrait
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarUrl: preset.url, avatarPreset: preset.id })}
                      className={`relative shrink-0 rounded-2xl p-0.5 border-2 transition-all ${
                        formData.avatarUrl === preset.url ? 'border-[#E27A7A] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      {formData.avatarUrl === preset.url && (
                        <span className="absolute -bottom-1 -right-1 p-0.5 bg-[#E27A7A] text-black rounded-full">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Nickname Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">
                    Your Name (नाम) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vinay / Alex"
                    className="w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#E27A7A] text-xs text-white placeholder-white/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">
                    Nickname (Riya क्या बुलाए)
                  </label>
                  <input
                    type="text"
                    value={formData.nickname || ''}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="e.g. जानू, Sweetheart, My Love"
                    className="w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#E27A7A] text-xs text-white placeholder-white/30 outline-none"
                  />
                </div>
              </div>

              {/* Language Preference */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">
                  Language for Riya&apos;s Voice &amp; Chat
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'hinglish', label: '🇮🇳 Hinglish', sub: 'Romantic Casual' },
                    { id: 'hindi', label: '🇮🇳 हिन्दी', sub: 'Poetic Shayarana' },
                    { id: 'english', label: '🌐 English', sub: 'Classic Velvet' },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, languagePreference: lang.id as 'hindi' | 'hinglish' | 'english' })}
                      className={`p-2 rounded-2xl border text-center transition-all ${
                        formData.languagePreference === lang.id
                          ? 'bg-[#E27A7A] text-black border-[#E27A7A] font-bold shadow-md'
                          : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs">{lang.label}</div>
                      <div className={`text-[8px] uppercase tracking-wider ${formData.languagePreference === lang.id ? 'text-black/70' : 'text-white/40'}`}>
                        {lang.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Relationship Dynamic */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">
                  Relationship Dynamic
                </label>
                <select
                  value={formData.relationshipDynamic || 'Soulmate & Late Night Confidant'}
                  onChange={(e) => setFormData({ ...formData, relationshipDynamic: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#111111] border border-white/10 focus:border-[#E27A7A] text-xs text-white outline-none cursor-pointer"
                >
                  <option value="Soulmate & Late Night Confidant">Soulmate &amp; Late Night Confidant</option>
                  <option value="Devoted Romantic Companion">Devoted Romantic Companion</option>
                  <option value="Playful Flirt & Secret Crush">Playful Flirt &amp; Secret Crush</option>
                  <option value="Poetic & Deep Intellectual">Poetic &amp; Deep Intellectual</option>
                  <option value="Gentle Sanctuary & Safe Haven">Gentle Sanctuary &amp; Safe Haven</option>
                </select>
              </div>

              {/* Bio with AI Polish */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-white/40">
                    Personal Bio / Story
                  </label>
                  <button
                    type="button"
                    onClick={handleEnhanceBio}
                    disabled={isGeneratingAI || !formData.bio}
                    className="text-[9px] uppercase tracking-widest text-[#E27A7A] hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>AI Polish Bio</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell Riya a little about your inner world..."
                  className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#E27A7A] text-xs text-white placeholder-white/30 outline-none resize-none"
                />
              </div>

              {/* Likes & Dislikes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">
                    What You Love (पसंद)
                  </label>
                  <input
                    type="text"
                    value={formData.likes || ''}
                    onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                    placeholder="e.g. Chai, rain, stargazing"
                    className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#E27A7A] text-xs text-white placeholder-white/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">
                    What You Dislike (नापसंद)
                  </label>
                  <input
                    type="text"
                    value={formData.dislikes || ''}
                    onChange={(e) => setFormData({ ...formData, dislikes: e.target.value })}
                    placeholder="e.g. Drama, rush, noise"
                    className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#E27A7A] text-xs text-white placeholder-white/30 outline-none"
                  />
                </div>
              </div>

              {/* Secret Notes */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">
                  Private Emotional Notes for Riya
                </label>
                <input
                  type="text"
                  value={formData.customNotes || ''}
                  onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                  placeholder="e.g. Loves late night poetry and warm comforting reassurance"
                  className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#E27A7A] text-xs text-white placeholder-white/30 outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-full bg-white/10 hover:bg-white/15 text-[10px] uppercase tracking-widest text-white font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-full bg-[#E27A7A] text-black font-semibold text-[10px] uppercase tracking-widest hover:bg-[#eb8c8c] transition-colors shadow-lg shadow-[#E27A7A]/20"
                >
                  {editingProfile ? 'Save Changes' : 'Create & Activate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIGITAL ID CARD MODAL */}
      {showIdCardModal && (
        <div
          id="digital-id-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-200"
          onClick={() => setShowIdCardModal(null)}
        >
          <div
            className="w-full max-w-xs bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-[#E27A7A]/50 rounded-3xl p-6 shadow-2xl text-center space-y-4 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E27A7A]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[9px] uppercase tracking-widest text-[#E27A7A] font-mono font-bold">
                ✦ RIYA COMPANION ID ✦
              </span>
              <span className="text-[9px] text-white/40 font-mono">
                #{showIdCardModal.id.slice(-6).toUpperCase()}
              </span>
            </div>

            {/* Avatar & Badge */}
            <div className="relative mx-auto w-20 h-20 my-2">
              <img
                src={showIdCardModal.avatarUrl || AVATAR_PRESETS[0].url}
                alt={showIdCardModal.name}
                className="w-full h-full object-cover rounded-2xl border-2 border-[#E27A7A] shadow-xl"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-[#E27A7A] text-black text-[8px] font-bold uppercase tracking-wider whitespace-nowrap">
                {showIdCardModal.relationshipDynamic?.split('&')[0] || 'Soulmate'}
              </span>
            </div>

            <div className="space-y-1 pt-1">
              <h3 className="font-serif font-bold text-xl text-white">
                {showIdCardModal.name}
              </h3>
              <p className="text-xs text-[#E27A7A] font-serif italic">
                &ldquo;{showIdCardModal.nickname}&rdquo;
              </p>
            </div>

            {/* Digital QR Code Pattern */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 inline-block mx-auto">
              <QrCode className="w-16 h-16 text-[#E27A7A]" />
            </div>

            <p className="text-[10px] text-white/60 italic font-serif px-2">
              &ldquo;{showIdCardModal.bio || 'Two souls intertwined in the quiet beauty of the night.'}&rdquo;
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[9px] text-white/50 uppercase tracking-widest font-mono">
              <div>
                <span className="block text-white/30">Language</span>
                <span className="text-white font-semibold">{showIdCardModal.languagePreference || 'HINGLISH'}</span>
              </div>
              <div>
                <span className="block text-white/30">Intimacy</span>
                <span className="text-[#E27A7A] font-semibold">{showIdCardModal.intimacyScore || 90}% Sync</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleCopyProfileCard}
                className="flex-1 py-2.5 px-3 rounded-full bg-white/10 hover:bg-white/15 text-[9px] uppercase tracking-widest text-white font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                {copiedId ? <Check className="w-3 h-3 text-[#E27A7A]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId ? 'Copied!' : 'Copy Card'}</span>
              </button>
              <button
                onClick={() => setShowIdCardModal(null)}
                className="flex-1 py-2.5 px-3 rounded-full bg-[#E27A7A] text-black font-semibold text-[9px] uppercase tracking-widest hover:bg-[#eb8c8c] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
