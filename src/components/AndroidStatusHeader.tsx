import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface AndroidStatusHeaderProps {
  moodColor?: string;
}

export const AndroidStatusHeader: React.FC<AndroidStatusHeaderProps> = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="android-status-bar"
      className="w-full flex items-center justify-between px-6 pt-3 pb-2 text-xs font-medium text-white/80 tracking-wider select-none z-50 shrink-0 pointer-events-none"
    >
      <div className="flex items-center gap-1.5 font-semibold text-white/90">
        <span className="tracking-tight">{time || '20:45'}</span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E27A7A] animate-pulse ml-0.5" />
      </div>

      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/20 shadow-sm">
        <span className="text-[9px] uppercase tracking-[0.2em] text-[#E27A7A] font-serif font-bold">Riya AI</span>
      </div>

      <div className="flex items-center gap-2 text-white/80">
        <span className="text-[9px] font-bold tracking-tight text-white/60 uppercase">5G</span>
        <Wifi className="w-3.5 h-3.5 text-white/80" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-white/80 font-mono">98%</span>
          <Battery className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};

