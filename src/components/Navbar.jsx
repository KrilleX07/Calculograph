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
      <header className="w-full bg-[#efe7d6] border-b-4 border-[#3c2c1c] text-[#3c2c1c] py-2.5 sm:py-3.5 px-3 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo: Pure Bold Typography */}
          <a
            href="/"
            onClick={() => sound.playClick()}
            className="font-mono font-extrabold text-base sm:text-2xl tracking-[2.5px] sm:tracking-[4px] uppercase text-[#3c2c1c] hover:opacity-85 transition-opacity whitespace-nowrap"
          >
            CALCULOGRAPH
          </a>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs font-bold flex-shrink-0">
            
            {/* Audio Toggle Button */}
            <button
              type="button"
              onClick={toggleSound}
              title={isAudioOn ? 'Mute acoustic audio' : 'Enable audio'}
              className="w-8 h-8 sm:w-auto sm:h-auto sm:p-2 rounded border-2 border-[#3c2c1c] bg-[#e3d8c0] hover:bg-[#d6c9ab] text-[#3c2c1c] transition flex items-center justify-center shadow-[2px_3px_rgba(0,0,0,0.25)] active:translate-y-0.5 cursor-pointer flex-shrink-0"
            >
              {isAudioOn ? <Volume2 size={15} className="text-[#c05810]" /> : <VolumeX size={15} />}
            </button>

            {/* Twitter Link: Compact on mobile, expanded on desktop */}
            <a
              href="https://x.com/Calculograph"
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playClick()}
              className="calctrons-btn h-8 sm:h-auto py-1.5 sm:py-2 px-2.5 sm:px-4 text-[11px] sm:text-xs flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0 whitespace-nowrap shadow-[2px_3px_rgba(0,0,0,0.25)]"
            >
              <span className="font-extrabold text-xs">𝕏</span>
              <span className="hidden sm:inline">@Calculograph</span>
            </a>

          </div>

        </div>
      </header>

      {/* Secondary Statusbar: Rock-solid Dark Ink Terminal Line */}
      <div className="w-full bg-[#2a1e13] border-b-2 border-[#17130e] text-[#e3d8c0] py-2 px-4 sm:px-6 font-mono text-[10px] sm:text-[11px] font-bold tracking-[1.5px] uppercase">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 whitespace-nowrap select-none">
          <div className="flex items-center gap-2.5 pl-3 flex-shrink-0">
            {/* Phosphor Glow Dot with wide padding to prevent edge clipping */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#46e35f] shadow-[0_0_8px_#46e35f] flex-shrink-0 animate-pulse"></div>
            <span className="text-[#46e35f] tracking-[1.5px]">OPERATIONAL</span>
          </div>
          <span className="text-[#8d7c66]">|</span>
          <span className="hidden sm:inline">4,567 CALCULATING MACHINES</span>
          <span className="hidden sm:inline text-[#8d7c66]">|</span>
          <span>HYPEREVM</span>
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
          <span className="mx-4 text-[#c05810]">▼ HYPEREVM ENGINE</span>
          <span className="mx-4">◆ CALCULOGRAPH MEMORY PROTOCOL</span>
          <span className="mx-4 text-[#efe7d6]">★ 10 REGISTERS (M1-M10)</span>
          <span className="mx-4 text-[#f2c14b]">▲ PREVENT DUPLICATES</span>
          <span className="mx-4">◆ VERIFIED CHRONO PASS</span>
          <span className="mx-4 text-[#efe7d6]">★ PERMANENT TAPE ALLOCATION</span>
          <span className="mx-4 text-[#c05810]">▼ HYPEREVM ENGINE</span>
        </div>
      </div>

    </div>
  );
}
