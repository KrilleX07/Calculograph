import React from 'react';
import { sound } from '../utils/sound';

export default function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#04060A] text-slate-500 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        
        {/* Brand & Edition */}
        <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
          <span className="font-pixel text-[#00F58C] text-[10px] sm:text-[11px] uppercase tracking-wider">
            CALCULOGRAPH
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="font-mono text-[11px] text-slate-500">
            © 2026 Precision Timing Edition
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center justify-center gap-4 font-pixel text-[9px] sm:text-[10px] pt-1 sm:pt-0">
          <a
            href="https://x.com/Calculograph"
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.playClick()}
            className="text-[#8B5CF6] hover:text-[#A78BFA] transition tracking-wider"
          >
            𝕏 @Calculograph
          </a>

          <span className="text-slate-800">•</span>

          <a
            href="https://opensea.io"
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.playClick()}
            className="text-slate-500 hover:text-slate-300 transition tracking-wider"
          >
            OpenSea
          </a>
        </div>

      </div>
    </footer>
  );
}
