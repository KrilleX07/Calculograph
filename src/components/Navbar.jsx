import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Navbar({ isAudioOn, setIsAudioOn }) {
  const toggleSound = () => {
    sound.enabled = !isAudioOn;
    setIsAudioOn(!isAudioOn);
    if (!isAudioOn) sound.playToggle();
  };

  return (
    <header className="w-full bg-[#04060A] border-b border-[#1E293B] sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Calculograph Brand */}
        <a
          href="#"
          onClick={() => sound.playClick()}
          className="text-left group flex items-center gap-2.5"
        >
          <span className="w-2 h-2 rounded-full bg-[#00F58C] shadow-sm shadow-[#00F58C] animate-pulse"></span>
          <span className="font-pixel text-[#00F58C] text-xs sm:text-sm tracking-wider hover:brightness-125 transition-all text-neon-green">
            CALCULOGRAPH
          </span>
        </a>

        {/* Right Navigation: Audio button + @Calculograph */}
        <nav className="flex items-center gap-4 sm:gap-6 font-pixel text-[10px] sm:text-xs">
          
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioOn ? 'Mute sound' : 'Enable sound'}
            className="p-2 rounded-lg text-slate-500 hover:text-[#00F58C] transition"
          >
            {isAudioOn ? <Volume2 size={16} className="text-[#00F58C]" /> : <VolumeX size={16} />}
          </button>

          {/* Twitter Link */}
          <a
            href="https://x.com/Calculograph"
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.playClick()}
            className="text-[#8B5CF6] hover:text-[#A78BFA] transition-colors uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>@Calculograph</span>
          </a>

        </nav>

      </div>
    </header>
  );
}
