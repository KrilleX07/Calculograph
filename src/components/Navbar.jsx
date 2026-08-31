import React from 'react';
import { Volume2, VolumeX, ExternalLink } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Navbar({ isAudioOn, setIsAudioOn }) {
  const toggleSound = () => {
    sound.enabled = !isAudioOn;
    setIsAudioOn(!isAudioOn);
    if (!isAudioOn) sound.playToggle();
  };

  return (
    <div className="sticky top-0 z-50 select-none">
      
      {/* Primary Topbar: Vintage Paper Ledger */}
      <header className="w-full bg-[#efe7d6] border-b-4 border-[#3c2c1c] text-[#3c2c1c] py-3.5 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo: Unified Precision Mechanical Typography */}
          <a
            href="/"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2.5 font-mono font-bold text-lg sm:text-xl tracking-[3px] sm:tracking-[4px] uppercase text-[#3c2c1c] hover:opacity-85 transition-opacity group"
          >
            {/* Minimalist Mechanical Typewriter / Calculating Machine Emblem */}
            <div className="w-8 h-8 rounded border-2 border-[#3c2c1c] bg-[#c05810] text-[#efe7d6] flex items-center justify-center shadow-[2px_2px_rgba(0,0,0,0.3)] group-hover:bg-[#d46313] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Paper sheet at top */}
                <path d="M7 2h10v5H7z" />
                <line x1="9" y1="4.5" x2="15" y2="4.5" />
                {/* Typewriter platen roller */}
                <rect x="4" y="7" width="16" height="3" rx="1" />
                {/* Typewriter chassis */}
                <path d="M3 10h18l-1.5 11H4.5L3 10z" />
                {/* Key Matrix Dots */}
                <circle cx="8" cy="14" r="0.75" fill="currentColor" />
                <circle cx="12" cy="14" r="0.75" fill="currentColor" />
                <circle cx="16" cy="14" r="0.75" fill="currentColor" />
                <circle cx="10" cy="18" r="0.75" fill="currentColor" />
                <circle cx="14" cy="18" r="0.75" fill="currentColor" />
              </svg>
            </div>
            <span>CALCULOGRAPH</span>
          </a>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs font-bold">
            
            {/* Audio Toggle Button */}
            <button
              type="button"
              onClick={toggleSound}
              title={isAudioOn ? 'Mute acoustic audio' : 'Enable audio'}
              className="p-2 rounded border-2 border-[#3c2c1c] bg-[#e3d8c0] hover:bg-[#d6c9ab] text-[#3c2c1c] transition flex items-center justify-center shadow-[2px_3px_rgba(0,0,0,0.25)] active:translate-y-0.5 cursor-pointer"
            >
              {isAudioOn ? <Volume2 size={16} className="text-[#c05810]" /> : <VolumeX size={16} />}
            </button>

            {/* Twitter Link in Calctrons button style */}
            <a
              href="https://x.com/Calculograph"
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playClick()}
              className="calctrons-btn py-2 px-3 sm:px-4 text-[11px] sm:text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>𝕏 @Calculograph</span>
            </a>

          </div>

        </div>
      </header>

      {/* Secondary Statusbar: Rock-solid Dark Ink Terminal Line (Zero Jitter) */}
      <div className="w-full bg-[#2a1e13] border-b-2 border-[#17130e] text-[#e3d8c0] py-2 px-4 font-mono text-[10px] sm:text-[11px] font-bold tracking-[1.5px] uppercase">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 overflow-hidden whitespace-nowrap select-none">
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Static Phosphor Dot with Smooth Glow Animation (Zero layout jitter) */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#46e35f] shadow-[0_0_8px_#46e35f] flex-shrink-0 animate-pulse"></div>
            <span className="text-[#46e35f] tracking-[1.5px]">OPERATIONAL</span>
          </div>
          <span className="text-[#8d7c66]">|</span>
          <span className="hidden sm:inline">3,333 CALCULATING MACHINES</span>
          <span className="hidden sm:inline text-[#8d7c66]">|</span>
          <span>ROBINHOOD CHAIN</span>
          <span className="text-[#8d7c66]">|</span>
          <span className="text-[#f2c14b] border border-[#f2c14b] px-1.5 py-0.5 text-[9px]">
            GENESIS INTAKE
          </span>
        </div>
      </div>

      {/* Marquee Ticker Tape Ribbon */}
      <div className="w-full bg-[#0d0b08] border-b-2 border-[#3c2c1c] overflow-hidden py-1.5 text-[#46e35f] font-mono text-[10px] font-bold tracking-[1.5px] uppercase select-none shadow-inner">
        <div className="ticker-slide">
          <span className="mx-4">◆ CALCULOGRAPH MEMORY PROTOCOL</span>
          <span className="mx-4 text-[#efe7d6]">★ 10 REGISTERS (M1-M10)</span>
          <span className="mx-4 text-[#f2c14b]">▲ PREVENT DUPLICATES</span>
          <span className="mx-4">◆ VERIFIED CHRONO PASS</span>
          <span className="mx-4 text-[#efe7d6]">★ PERMANENT TAPE ALLOCATION</span>
          <span className="mx-4 text-[#c05810]">▼ ROBINHOOD L2 ENGINE</span>
          <span className="mx-4">◆ CALCULOGRAPH MEMORY PROTOCOL</span>
          <span className="mx-4 text-[#efe7d6]">★ 10 REGISTERS (M1-M10)</span>
          <span className="mx-4 text-[#f2c14b]">▲ PREVENT DUPLICATES</span>
          <span className="mx-4">◆ VERIFIED CHRONO PASS</span>
          <span className="mx-4 text-[#efe7d6]">★ PERMANENT TAPE ALLOCATION</span>
          <span className="mx-4 text-[#c05810]">▼ ROBINHOOD L2 ENGINE</span>
        </div>
      </div>

    </div>
  );
}
