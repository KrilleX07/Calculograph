import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AllowlistIntake from './components/AllowlistIntake';
import Footer from './components/Footer';

export default function App() {
  const [isAudioOn, setIsAudioOn] = useState(true);

  return (
    <div className="min-h-screen bg-[#17130e] text-[#efe7d6] flex flex-col justify-between font-mono relative selection:bg-[#c05810] selection:text-[#efe7d6]">
      
      {/* Top Navbar & Status Ribbon */}
      <Navbar
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
      />

      {/* Main Content: Calculograph Allowlist Intake */}
      <main className="relative z-10 flex-1 flex flex-col justify-center py-6">
        <AllowlistIntake />
      </main>

      {/* Minimalist Footer */}
      <Footer />
    </div>
  );
}
