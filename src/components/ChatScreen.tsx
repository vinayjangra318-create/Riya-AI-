import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  Sparkles, 
  Heart, 
  BookmarkCheck, 
  ChevronLeft, 
  PhoneCall, 
  MoreVertical, 
  Trash2, 
  Smile, 
  Flame, 
  Moon, 
  Sun, 
  Stars,
  MessageSquareHeart
} from 'lucide-react';
import { ChatMessage, MoodType, PersonalityType, UserProfile, SavedMoment } from '../types';
import { MOOD_OPTIONS, CONVERSATION_STARTERS } from '../data/defaults';
import { soundEngine } from '../utils/audio';
import riyaAvatar from '../assets/images/riya_avatar_square_1788102536906.jpg';

interface ChatScreenProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearChat: () => void;
  onSaveMoment: (moment: SavedMoment) => void;
  onBackToHome: () => void;
  onOpenVoiceModal: () => void;
  activeMood: MoodType;
  onChangeMood: (mood: MoodType) => void;
  activePersonality: PersonalityType;
  userProfile: UserProfile;
  isLoading: boolean;
  soundEnabled: boolean;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  onSaveMoment,
  onBackToHome,
  onOpenVoiceModal,
  activeMood,
  onChangeMood,
  userProfile,
  isLoading,
  soundEnabled,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [showMoodDropdown, setShowMoodDropdown] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [savedMessageIds, setSavedMessageIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isLoading]);

  // Initial set of saved moments
  useEffect(() => {
    const ids = new Set<string>();
    messages.forEach((m) => {
      if (m.isSaved) ids.add(m.id);
    });
    setSavedMessageIds(ids);
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || isLoading) return;

    if (soundEnabled) soundEngine.playSendSound();
    setInputText('');
    await onSendMessage(text);
  };

  const handleQuickStarter = (starterText: string) => {
    setInputText(starterText);
    inputRef.current?.focus();
  };

  const handleToggleSaveMoment = (msg: ChatMessage) => {
    if (soundEnabled) soundEngine.playSparkleSound();
    const newSaved = new Set(savedMessageIds);
    if (newSaved.has(msg.id)) {
      newSaved.delete(msg.id);
    } else {
      newSaved.add(msg.id);
      const newMoment: SavedMoment = {
        id: 'saved-' + Date.now(),
        quote: msg.text,
        context: `Saved from chat (${MOOD_OPTIONS[activeMood]?.label || 'Conversation'})`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        tag: MOOD_OPTIONS[activeMood]?.label || 'Special Moment',
        emotion: 'heart',
      };
      onSaveMoment(newMoment);
    }
    setSavedMessageIds(newSaved);
  };

  const currentMoodObj = MOOD_OPTIONS[activeMood] || MOOD_OPTIONS.romantic;

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

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div id="chat-screen-container" className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#0A0A0A] select-none">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#E27A7A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Header */}
      <div 
        id="chat-header-bar"
        className="px-4 py-3 bg-[#0A0A0A]/95 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between z-30 shrink-0 shadow-md"
      >
        <div className="flex items-center gap-3">
          <button
            id="chat-back-home-btn"
            onClick={onBackToHome}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#E27A7A]/20 border border-[#E27A7A]/40 flex items-center justify-center font-serif text-[#E27A7A] font-bold text-sm">
              R
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-sm font-semibold text-white">
                Riya
              </h2>
              <span className="text-[8px] uppercase tracking-widest px-1.5 py-0.2 rounded bg-[#E27A7A]/20 text-[#E27A7A] font-bold border border-[#E27A7A]/30">
                Premium
              </span>
            </div>
            <p className="text-[9px] text-white/40 uppercase tracking-tighter flex items-center gap-1">
              <span>{isLoading ? 'Typing...' : `With ${userProfile.nickname || 'you'}`}</span>
            </p>
          </div>
        </div>

        {/* Header Right Actions: Mood Pill Selector & Menu */}
        <div className="flex items-center gap-2">
          {/* Mood Pill Toggle */}
          <div className="relative">
            <button
              id="mood-selector-toggle-btn"
              onClick={() => setShowMoodDropdown(!showMoodDropdown)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/20 text-[#E27A7A] text-[10px] italic hover:border-[#E27A7A] transition-all"
            >
              <span>{currentMoodObj.label}</span>
            </button>

            {/* Mood Dropdown Popover */}
            {showMoodDropdown && (
              <div 
                id="mood-dropdown-menu"
                className="absolute right-0 top-9 w-44 bg-[#111111] border border-white/20 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-3xl"
              >
                <div className="px-2 py-1 text-[9px] uppercase font-bold text-white/40 tracking-widest">
                  Personality Tone
                </div>
                {Object.values(MOOD_OPTIONS).map((m) => (
                  <button
                    key={m.id}
                    id={`select-mood-opt-${m.id}`}
                    onClick={() => {
                      if (soundEnabled) soundEngine.playSparkleSound();
                      onChangeMood(m.id as MoodType);
                      setShowMoodDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-left transition-colors ${
                      activeMood === m.id
                        ? 'bg-[#E27A7A] text-black font-bold'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-serif text-xs">{m.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            id="chat-voice-call-btn"
            onClick={onOpenVoiceModal}
            title="Voice Call (Coming Soon)"
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#E27A7A] border border-white/10 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
          </button>

          {/* Chat options menu */}
          <div className="relative">
            <button
              id="chat-options-menu-btn"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div 
                id="chat-options-popover"
                className="absolute right-0 top-9 w-40 bg-[#111111] border border-white/20 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-3xl"
              >
                <button
                  id="clear-chat-history-btn"
                  onClick={() => {
                    if (confirm('Clear current chat messages?')) {
                      onClearChat();
                      setShowMenu(false);
                    }
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-colors font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div 
        id="messages-scroll-area"
        className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar z-10"
        onClick={() => {
          if (showMoodDropdown) setShowMoodDropdown(false);
          if (showMenu) setShowMenu(false);
        }}
      >
        {messages.map((msg) => {
          const isRiya = msg.sender === 'riya';
          const isSaved = savedMessageIds.has(msg.id);

          return (
            <div
              key={msg.id}
              id={`msg-bubble-${msg.id}`}
              className={`flex flex-col ${isRiya ? 'items-start' : 'items-end'} group`}
            >
              <div className="flex items-start gap-2 max-w-[85%]">
                {/* Bubble Container */}
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed transition-all shadow-md ${
                    isRiya
                      ? 'bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 rounded-tl-none font-serif'
                      : 'bg-[#E27A7A]/20 border border-[#E27A7A]/30 text-white/90 rounded-tr-none ml-auto'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Bubble Footer with Timestamp & Save Moment Button */}
                  <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-white/5 text-[9px] text-white/40 uppercase tracking-wider">
                    <span>{formatTime(msg.timestamp)}</span>

                    {isRiya && (
                      <button
                        id={`save-moment-btn-${msg.id}`}
                        onClick={() => handleToggleSaveMoment(msg)}
                        title={isSaved ? "Saved in Memories" : "Save this moment to Memory"}
                        className={`flex items-center gap-1 transition-colors ${
                          isSaved ? 'text-[#E27A7A] font-bold' : 'text-white/40 hover:text-[#E27A7A]'
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <BookmarkCheck className="w-3 h-3 text-[#E27A7A]" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Heart className="w-3 h-3" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isLoading && (
          <div id="typing-indicator" className="flex items-center gap-1 py-2 px-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starters Chip Carousel */}
      <div className="p-4 pt-0">
        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
          {CONVERSATION_STARTERS.map((starter, idx) => (
            <button
              key={idx}
              id={`starter-chip-${idx}`}
              onClick={() => handleQuickStarter(starter)}
              className="px-3 py-1 border border-white/20 rounded-full text-[9px] whitespace-nowrap italic text-white/60 hover:text-[#E27A7A] hover:border-[#E27A7A] transition-colors"
            >
              {starter}
            </button>
          ))}
        </div>

        {/* Bottom Input Field */}
        <form onSubmit={handleSend} className="bg-white/5 border border-white/10 rounded-full p-1.5 flex items-center gap-2">
          <input
            ref={inputRef}
            id="chat-message-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 px-4 text-xs text-white placeholder-white/30 bg-transparent outline-none"
          />

          <button
            type="submit"
            id="send-chat-btn"
            disabled={!inputText.trim() || isLoading}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              inputText.trim() && !isLoading
                ? 'bg-[#E27A7A] text-black shadow-md'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

