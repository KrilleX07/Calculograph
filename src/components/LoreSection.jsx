import React from 'react';
import { BookOpen, Flame, Cpu, Globe } from 'lucide-react';

export default function LoreSection() {
  const chapters = [
    {
      icon: Flame,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10 border-amber-400/30',
      title: "1. Spawned in the Trading Pit",
      text: "When centralized market makers disabled the Buy button during the legendary short squeeze, a genetic uprising ignited within the fastest, most relentless trader cells.",
    },
    {
      icon: Cpu,
      color: 'text-cyber-cyan',
      bgColor: 'bg-cyber-cyan/10 border-cyber-cyan/30',
      title: "2. Evolution of the 11 Archetypes",
      text: "Only the strongest survived the volatility: from navy pinstripe veterans and MEV hackers to diamond-handed degens and lunar astronauts.",
    },
    {
      icon: Globe,
      color: 'text-hood-green',
      bgColor: 'bg-hood-green/10 border-hood-green/30',
      title: "3. The Robinhood Chain Era",
      text: "United under the celestial glory of the Golden God, the Sperm Brokers arrived on the Robinhood Chain to permanently decentralize wealth and liquidity.",
    },
  ];

  return (
    <section id="lore" className="py-24 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-hood-green/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-hood-green/10 border border-hood-green/30 text-hood-green text-xs font-mono font-bold tracking-wider">
            <BookOpen size={14} />
            <span>THE NARRATIVE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Lore & Philosophy
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            From the smoke-filled pits of Wall Street to decentralized financial supremacy on Robinhood Chain.
          </p>
        </div>

        {/* 3 Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {chapters.map((chap, idx) => {
            const Icon = chap.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl p-8 bg-[#0D111A]/80 border border-white/10 hover:border-hood-green/40 transition-all duration-300 space-y-6 relative group"
              >
                <div className={`w-14 h-14 rounded-2xl ${chap.bgColor} border flex items-center justify-center ${chap.color} shadow-lg`}>
                  <Icon size={28} />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold font-display text-white group-hover:text-hood-green transition-colors">
                    {chap.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {chap.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
