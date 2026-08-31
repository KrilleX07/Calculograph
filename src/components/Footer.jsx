import React from 'react';
import { sound } from '../utils/sound';

export default function Footer() {
  return (
    <footer className="border-t-4 border-[#3c2c1c] bg-[#3c2c1c] text-[#d6c9ab] py-8 mt-12 font-mono select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs">
        
        {/* Brand & Edition */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <span className="font-bold tracking-[3px] uppercase text-[#efe7d6] text-sm font-mono">
            CALCULOGRAPH
          </span>
          <span className="hidden sm:inline text-[#8d7c66]">|</span>
          <span className="text-[11px] text-[#d6c9ab]">
            © 2026 The Adding Room &bull; HyperEVM
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center justify-center gap-4 text-[11px] font-bold">
          <a
            href="https://x.com/Calculograph"
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.playClick()}
            className="text-[#f2c14b] hover:underline transition"
          >
            𝕏 @Calculograph
          </a>

          <span className="text-[#8d7c66]">&bull;</span>

          <a
            href="https://opensea.io"
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.playClick()}
            className="text-[#efe7d6] hover:underline transition"
          >
            OpenSea
          </a>
        </div>

      </div>
    </footer>
  );
}
