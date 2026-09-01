import React from 'react';
import { Home, MessageCircle, HeartHandshake, User, Settings } from 'lucide-react';
import { AppScreen } from '../types';
import { soundEngine } from '../utils/audio';

interface AndroidNavBarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  unreadCount?: number;
  soundEnabled?: boolean;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  currentScreen,
  onNavigate,
  unreadCount = 0,
  soundEnabled = true,
}) => {
  const handleTabClick = (screen: AppScreen) => {
    if (soundEnabled) soundEngine.triggerHaptic();
    onNavigate(screen);
  };

  const navItems: Array<{ id: AppScreen; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'profiles', label: 'Profiles', icon: User },
    { id: 'memory', label: 'Memory', icon: HeartHandshake },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div 
      id="android-navigation-bar" 
      className="w-full shrink-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-2xl border-t border-white/20 px-3 pt-2.5 pb-5 select-none"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => handleTabClick(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'text-[#E27A7A] scale-105 font-bold'
                  : 'text-white/40 hover:text-white/80 scale-100'
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 bg-[#E27A7A]/10 rounded-2xl -z-10 border border-[#E27A7A]/40 shadow-[0_0_15px_rgba(226,122,122,0.2)]" />
              )}
              
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-[1.6]'}`} />
                {item.id === 'chat' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#E27A7A] text-black text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-black animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-1 tracking-widest uppercase font-sans ${isActive ? 'text-[#E27A7A] font-bold' : 'text-white/40'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Android System Gesture Bar Pill */}
      <div className="flex justify-center mt-3">
        <div className="w-28 h-1 bg-white/25 rounded-full hover:bg-white/50 transition-colors" />
      </div>
    </div>
  );
};

