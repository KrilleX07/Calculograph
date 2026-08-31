import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AllowlistIntake from './components/AllowlistIntake';
import Footer from './components/Footer';

export default function App() {
  const [isAudioOn, setIsAudioOn] = useState(true);

  return (
    <div className="min-h-screen bg-[#04060A] text-slate-100 selection:bg-[#00F58C] selection:text-black flex flex-col justify-between font-mono relative overflow-hidden">
      {/* Scanline CRT overlay effect for authentic precision terminal aesthetic */}
      <div className="fixed inset-0 scanlines pointer-events-none z-40 opacity-15"></div>

      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#00F58C]/5 blur-[120px] pointer-events-none"></div>

      {/* Top Navbar */}
      <Navbar
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
      />

      {/* Main Content: Calculograph Allowlist Intake */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        <AllowlistIntake />
      </main>

      {/* Minimalist Footer */}
      <Footer />
    </div>
  );
}
