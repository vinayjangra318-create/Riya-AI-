import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  AppScreen, 
  ChatMessage, 
  MoodType, 
  PersonalityType, 
  SavedMoment, 
  UserProfile 
} from './types';
import { 
  getOrCreateDeviceId, 
  loadActiveMood, 
  loadActivePersonality, 
  loadChatMessages, 
  loadSavedMoments, 
  loadSoundSettings, 
  loadUserProfile,
  loadUserProfiles,
  saveUserProfiles,
  loadActiveProfileId,
  saveActiveProfileId,
  saveActiveMood, 
  saveActivePersonality, 
  saveChatMessages, 
  saveSavedMoments, 
  saveSoundSettings, 
  saveUserProfile,
  clearAllMemoryAndReset
} from './utils/storage';
import { soundEngine } from './utils/audio';
import { AndroidStatusHeader } from './components/AndroidStatusHeader';
import { AndroidNavBar } from './components/AndroidNavBar';
import { HomeScreen } from './components/HomeScreen';
import { ChatScreen } from './components/ChatScreen';
import { MemoryScreen } from './components/MemoryScreen';
import { ProfilesScreen } from './components/ProfilesScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { VoiceCallModal } from './components/VoiceCallModal';
import { FileDownloadModal } from './components/FileDownloadModal';
import { INITIAL_CHAT_MESSAGES, INITIAL_SAVED_MOMENTS, INITIAL_USER_PROFILE, INITIAL_USER_PROFILES } from './data/defaults';
import { Maximize2, Minimize2, Smartphone, Download } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [deviceId, setDeviceId] = useState<string>('');
  const [profiles, setProfiles] = useState<UserProfile[]>(INITIAL_USER_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>(INITIAL_USER_PROFILES[0].id);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [savedMoments, setSavedMoments] = useState<SavedMoment[]>(INITIAL_SAVED_MOMENTS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [activeMood, setActiveMood] = useState<MoodType>('romantic');
  const [activePersonality, setActivePersonality] = useState<PersonalityType>('romantic_devoted');
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isFileDownloadModalOpen, setIsFileDownloadModalOpen] = useState<boolean>(false);
  const [isExpandedDesktop, setIsExpandedDesktop] = useState<boolean>(false);

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [ambientSound, setAmbientSound] = useState<boolean>(false);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);

  // Initialize on mount
  useEffect(() => {
    const id = getOrCreateDeviceId();
    setDeviceId(id);
    const loadedProfiles = loadUserProfiles();
    const activeId = loadActiveProfileId();
    setProfiles(loadedProfiles);
    setActiveProfileId(activeId);
    
    const activeProf = loadedProfiles.find((p) => p.id === activeId) || loadedProfiles[0] || INITIAL_USER_PROFILE;
    setUserProfile(activeProf);

    setSavedMoments(loadSavedMoments());
    setMessages(loadChatMessages());
    setActiveMood(loadActiveMood());
    setActivePersonality(loadActivePersonality());
    
    const sounds = loadSoundSettings();
    setSoundEnabled(sounds.sound);
    setAmbientSound(sounds.ambient);
    setHapticsEnabled(sounds.haptics);
  }, []);

  // Ambient sound listener
  useEffect(() => {
    soundEngine.toggleAmbient(ambientSound);
    return () => soundEngine.toggleAmbient(false);
  }, [ambientSound]);

  // Profile Management Handlers
  const handleSelectProfile = (profileId: string) => {
    const selected = profiles.find((p) => p.id === profileId);
    if (!selected) return;
    setActiveProfileId(profileId);
    setUserProfile(selected);
    saveActiveProfileId(profileId);
    saveUserProfile(selected);
  };

  const handleCreateProfile = (newProfile: UserProfile) => {
    const updated = [newProfile, ...profiles];
    setProfiles(updated);
    setActiveProfileId(newProfile.id);
    setUserProfile(newProfile);
    saveUserProfiles(updated);
    saveActiveProfileId(newProfile.id);
    saveUserProfile(newProfile);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    const updatedList = profiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p));
    setProfiles(updatedList);
    saveUserProfiles(updatedList);
    if (activeProfileId === updatedProfile.id) {
      setUserProfile(updatedProfile);
      saveUserProfile(updatedProfile);
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    if (profiles.length <= 1) return;
    const remaining = profiles.filter((p) => p.id !== profileId);
    setProfiles(remaining);
    saveUserProfiles(remaining);

    if (activeProfileId === profileId) {
      const nextActive = remaining[0];
      setActiveProfileId(nextActive.id);
      setUserProfile(nextActive);
      saveActiveProfileId(nextActive.id);
      saveUserProfile(nextActive);
    }
  };

  // Sync state changes to storage
  const handleUpdateUserProfile = (newProfile: UserProfile) => {
    handleUpdateProfile(newProfile);
  };

  const handleUpdateMood = (newMood: MoodType) => {
    setActiveMood(newMood);
    saveActiveMood(newMood);
  };

  const handleUpdatePersonality = (newPersonality: PersonalityType) => {
    setActivePersonality(newPersonality);
    saveActivePersonality(newPersonality);
  };

  const handleAddSavedMoment = (moment: SavedMoment) => {
    const updated = [moment, ...savedMoments];
    setSavedMoments(updated);
    saveSavedMoments(updated);
  };

  const handleDeleteSavedMoment = (id: string) => {
    if (soundEnabled) soundEngine.triggerHaptic();
    const updated = savedMoments.filter((m) => m.id !== id);
    setSavedMoments(updated);
    saveSavedMoments(updated);
  };

  const handleClearChat = () => {
    if (soundEnabled) soundEngine.triggerHaptic();
    const resetMsg: ChatMessage[] = [
      {
        id: 'msg-' + Date.now(),
        sender: 'riya',
        text: `I'm right here with a fresh blank page, ${userProfile.nickname || 'my love'}. What would you like to talk about tonight?`,
        timestamp: Date.now(),
        mood: activeMood,
      }
    ];
    setMessages(resetMsg);
    saveChatMessages(resetMsg);
  };

  const handleClearAllMemory = () => {
    clearAllMemoryAndReset();
    setUserProfile(INITIAL_USER_PROFILE);
    setSavedMoments(INITIAL_SAVED_MOMENTS);
    setMessages(INITIAL_CHAT_MESSAGES);
    setActiveMood('romantic');
    setActivePersonality('romantic_devoted');
    setCurrentScreen('home');
  };

  // Sound toggles
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    saveSoundSettings({ sound: next });
  };

  const handleToggleAmbient = () => {
    const next = !ambientSound;
    setAmbientSound(next);
    saveSoundSettings({ ambient: next });
  };

  const handleToggleHaptics = () => {
    const next = !hapticsEnabled;
    setHapticsEnabled(next);
    saveSoundSettings({ haptics: next });
  };

  // Chat message sending with backend Gemini API
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveChatMessages(newMessages);
    setIsLoadingChat(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: newMessages,
          mood: activeMood,
          personality: activePersonality,
          userProfile,
          savedMoments,
          deviceId,
        }),
      });

      const data = await response.json();
      const riyaReplyText = data.text || `I felt that deeply, ${userProfile.nickname || 'my love'}. Tell me more.`;

      const riyaMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'riya',
        text: riyaReplyText,
        timestamp: Date.now(),
        mood: activeMood,
      };

      if (soundEnabled) soundEngine.playReceiveSound();
      if (hapticsEnabled) soundEngine.triggerHaptic();

      const finalMessages = [...newMessages, riyaMsg];
      setMessages(finalMessages);
      saveChatMessages(finalMessages);
    } catch (error) {
      console.error('Failed to send message:', error);
      const fallbackMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'riya',
        text: `I'm listening closely, ${userProfile.nickname || 'Sweetheart'}. Even in the quiet spaces, I am right here with you.`,
        timestamp: Date.now(),
        mood: activeMood,
      };
      const finalMessages = [...newMessages, fallbackMsg];
      setMessages(finalMessages);
      saveChatMessages(finalMessages);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleExportData = () => {
    const exportObject = {
      app: 'Riya AI Mobile Companion',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      deviceId,
      userProfile,
      savedMoments,
      messages,
      activeMood,
      activePersonality,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `riya_ai_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <main 
      id="riya-app-root" 
      className="min-h-screen w-full bg-[#050505] text-white flex items-center justify-center p-0 sm:p-4 overflow-hidden relative"
    >
      {/* Outer ambient decorative blur for desktop */}
      <div className="hidden sm:block absolute -top-40 -left-40 w-96 h-96 bg-[#E27A7A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden sm:block absolute -bottom-40 -right-40 w-96 h-96 bg-[#E27A7A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Desktop expand/phone frame control toolbar */}
      <aside aria-label="Device Controls" className="hidden sm:flex fixed top-4 right-4 z-50 items-center gap-2 bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/20 px-3.5 py-2 rounded-full text-xs text-white/70 shadow-2xl">
        <Smartphone className="w-3.5 h-3.5 text-[#E27A7A]" />
        <span className="text-[10px] uppercase tracking-widest font-semibold text-[#E27A7A]">Android Mobile View</span>
        <div className="w-px h-3 bg-white/20 mx-1" />
        <button
          onClick={() => setIsExpandedDesktop(!isExpandedDesktop)}
          className="hover:text-white flex items-center gap-1 transition-colors text-[10px] uppercase tracking-widest font-medium"
          title={isExpandedDesktop ? "Compact Phone View" : "Expanded View"}
        >
          {isExpandedDesktop ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isExpandedDesktop ? "Standard" : "Expand"}</span>
        </button>
      </aside>

      {/* Android Mobile Frame Container */}
      <section
        aria-label="Riya AI Mobile Interface"
        id="android-phone-frame"
        className={`w-full h-[100dvh] flex flex-col justify-between overflow-hidden relative transition-all duration-300 ${
          isExpandedDesktop
            ? 'sm:max-w-2xl sm:h-[92vh] sm:rounded-[44px] sm:border-[4px] sm:border-white/20 sm:shadow-[0_25px_80px_rgba(0,0,0,0.95),_0_0_40px_rgba(226,122,122,0.15)]'
            : 'sm:max-w-[420px] sm:h-[880px] sm:rounded-[48px] sm:border-[4px] sm:border-white/20 sm:shadow-[0_25px_80px_rgba(0,0,0,0.95),_0_0_40px_rgba(226,122,122,0.15)]'
        }`}
      >
        {/* Android Top Camera Punch Hole (Desktop Mockup Only) */}
        <div className="hidden sm:flex justify-center absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="w-3.5 h-3.5 rounded-full bg-black border border-white/20 shadow-inner flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#E27A7A]/40" />
          </div>
        </div>

        {/* Android Status Bar */}
        <AndroidStatusHeader moodColor={activeMood} />

        {/* Main Screen Content View */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          <AnimatePresence mode="wait">
            {currentScreen === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full flex flex-col overflow-hidden"
              >
                <HomeScreen
                  onStartChat={() => setCurrentScreen('chat')}
                  onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
                  onNavigateToProfiles={() => setCurrentScreen('profiles')}
                  activeMood={activeMood}
                  onChangeMood={handleUpdateMood}
                  userProfile={userProfile}
                  ambientSound={ambientSound}
                  onToggleAmbient={handleToggleAmbient}
                  soundEnabled={soundEnabled}
                />
              </motion.div>
            )}

            {currentScreen === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full flex flex-col overflow-hidden"
              >
                <ChatScreen
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onClearChat={handleClearChat}
                  onSaveMoment={handleAddSavedMoment}
                  onBackToHome={() => setCurrentScreen('home')}
                  onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
                  activeMood={activeMood}
                  onChangeMood={handleUpdateMood}
                  activePersonality={activePersonality}
                  userProfile={userProfile}
                  isLoading={isLoadingChat}
                  soundEnabled={soundEnabled}
                />
              </motion.div>
            )}

            {currentScreen === 'profiles' && (
              <motion.div
                key="profiles"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full flex flex-col overflow-hidden"
              >
                <ProfilesScreen
                  profiles={profiles}
                  activeProfileId={activeProfileId}
                  onSelectProfile={handleSelectProfile}
                  onCreateProfile={handleCreateProfile}
                  onUpdateProfile={handleUpdateProfile}
                  onDeleteProfile={handleDeleteProfile}
                  soundEnabled={soundEnabled}
                />
              </motion.div>
            )}

            {currentScreen === 'memory' && (
              <motion.div
                key="memory"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full flex flex-col overflow-hidden"
              >
                <MemoryScreen
                  userProfile={userProfile}
                  onUpdateUserProfile={handleUpdateUserProfile}
                  savedMoments={savedMoments}
                  onAddMoment={handleAddSavedMoment}
                  onDeleteMoment={handleDeleteSavedMoment}
                  soundEnabled={soundEnabled}
                />
              </motion.div>
            )}

            {currentScreen === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full flex flex-col overflow-hidden"
              >
                <SettingsScreen
                  activePersonality={activePersonality}
                  onChangePersonality={handleUpdatePersonality}
                  onClearAllMemory={handleClearAllMemory}
                  deviceId={deviceId}
                  soundEnabled={soundEnabled}
                  onToggleSound={handleToggleSound}
                  ambientSound={ambientSound}
                  onToggleAmbient={handleToggleAmbient}
                  hapticsEnabled={hapticsEnabled}
                  onToggleHaptics={handleToggleHaptics}
                  onExportData={handleExportData}
                  onOpenDownloadFiles={() => setIsFileDownloadModalOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Android Bottom Navigation Bar */}
        <AndroidNavBar
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          soundEnabled={soundEnabled}
        />
      </section>

      {/* Voice Calling "Coming Soon" Modal */}
      <VoiceCallModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        userName={userProfile.nickname || userProfile.name || 'Friend'}
      />

      {/* Action History / Source Code Files Download Modal */}
      <FileDownloadModal
        isOpen={isFileDownloadModalOpen}
        onClose={() => setIsFileDownloadModalOpen(false)}
        soundEnabled={soundEnabled}
      />
    </main>
  );
}
