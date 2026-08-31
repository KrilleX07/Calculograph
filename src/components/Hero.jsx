import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Zap, Shield, Flame, ExternalLink, Lock } from 'lucide-react';
import { NFT_COLLECTION } from '../data/nfts';
import { sound } from '../utils/sound';

export default function Hero({ onSelectNFT }) {
  const [activeIndex, setActiveIndex] = useState(10); // Start on Mythic Golden God by default!
  const currentNFT = NFT_COLLECTION[activeIndex];

  // Auto rotate preview every 6 seconds if user is idle
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % NFT_COLLECTION.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    sound.playClick();
    setActiveIndex((prev) => (prev + 1) % NFT_COLLECTION.length);
  };

  const handlePrev = () => {
    sound.playClick();
    setActiveIndex((prev) => (prev - 1 + NFT_COLLECTION.length) % NFT_COLLECTION.length);
  };

  return (
    <section className="relative pt-12 pb-24 overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-hood-green/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyber-pink/10 rounded-full blur-[130px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-cyber-gold/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Description, CTAs, Stats */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hood-green/10 border border-hood-green/30 text-hood-green text-xs font-mono font-bold tracking-wider shadow-sm shadow-hood-green/20">
              <span className="w-2 h-2 rounded-full bg-hood-green animate-ping"></span>
              <Sparkles size={14} />
              <span>OFFICIAL COLLECTION • ROBINHOOD CHAIN</span>
            </div>

            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-7xl font-extrabold font-display tracking-tight text-white leading-none">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  SPERM
                </span>{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-hood-green via-emerald-400 to-cyber-cyan text-neon-green">
                  BROKERS
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-mono text-emerald-400 font-semibold tracking-wide">
                16-Bit Wall Street Degen Dynasty
              </p>
            </div>

            {/* Subtitle / Description */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              The most unapologetic and bullish NFT collection on Wall Street. 11 legendary trader archetypes battling for liquidity and decentralized dominance on the Robinhood Chain.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#gallery"
                onClick={() => sound.playCash()}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-hood-green via-emerald-400 to-emerald-500 text-black font-extrabold text-base tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-hood-green/30 hover:shadow-hood-green/50 hover:scale-105 transition-all duration-300 group"
              >
                <Sparkles size={20} className="fill-black" />
                <span>Explore 11 Brokers</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#staking"
                onClick={() => sound.playClick()}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-hood-green/40 text-white font-bold text-base flex items-center justify-center gap-2 transition duration-300"
              >
                <Lock size={16} className="text-amber-400" />
                <span>Staking Vault (Soon)</span>
              </a>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
              <div className="p-4 rounded-2xl bg-[#0D111A]/60 border border-white/5">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">11</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Archetypes</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0D111A]/60 border border-white/5">
                <div className="text-2xl sm:text-3xl font-extrabold text-hood-green font-mono">1,000</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Total Supply</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0D111A]/60 border border-white/5">
                <div className="text-2xl sm:text-3xl font-extrabold text-cyber-cyan font-mono">0.088 ETH</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Floor Price</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0D111A]/60 border border-white/5">
                <div className="text-2xl sm:text-3xl font-extrabold text-cyber-gold font-mono">Robinhood</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">L2 Chain</div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Card Spotlight Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="relative w-full max-w-md">
              
              {/* Card Glow Frame */}
              <div className={`absolute -inset-2 rounded-3xl opacity-75 blur-xl transition-all duration-700 ${
                currentNFT.isMythic 
                  ? 'bg-gradient-to-r from-cyber-gold via-amber-500 to-yellow-300 opacity-90' 
                  : 'bg-gradient-to-r from-hood-green via-cyan-500 to-purple-600'
              }`}></div>

              {/* Main Card Container */}
              <div className={`relative rounded-3xl overflow-hidden holo-card border ${
                currentNFT.isMythic 
                  ? 'border-yellow-400/80 bg-gradient-to-b from-[#1c1404] to-[#0d111a]' 
                  : 'border-white/20 bg-[#0d111a]'
              } shadow-2xl transition-all duration-300`}>
                
                {/* Image Container with pixel styling */}
                <div className="relative aspect-square overflow-hidden bg-black/60 group cursor-pointer" onClick={() => onSelectNFT(currentNFT)}>
                  <img
                    src={currentNFT.image}
                    alt={currentNFT.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Overlay Badge */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-white font-mono text-xs font-bold">
                      #{currentNFT.id}
                    </span>
                    <span 
                      className="px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-mono font-extrabold tracking-wide"
                      style={{ 
                        backgroundColor: `${currentNFT.rarityColor}20`,
                        borderColor: currentNFT.rarityColor,
                        color: currentNFT.rarityColor 
                      }}
                    >
                      {currentNFT.rarity}
                    </span>
                  </div>

                  {currentNFT.isMythic && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-amber-500 text-black font-extrabold text-xs font-mono animate-bounce flex items-center gap-1 shadow-lg shadow-amber-500/50">
                      <Sparkles size={13} /> 1 OF 1
                    </div>
                  )}

                  {/* Click to inspect prompt overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/30 flex items-center gap-2">
                      <ExternalLink size={16} />
                      Inspect Dossier
                    </span>
                  </div>
                </div>

                {/* Card Info Footer */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold font-display text-white">
                        {currentNFT.name}
                      </h3>
                      <p className="text-sm font-mono text-slate-400 mt-0.5">
                        {currentNFT.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-mono">Staking</div>
                      <div className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1">
                        <Lock size={11} /> Phase 2 Soon
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic line-clamp-2">
                    {currentNFT.quote.en}
                  </p>

                  {/* Quick Traits Preview Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentNFT.traits.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                        {t.category}: <span className="text-emerald-400 font-semibold">{t.value}</span>
                      </span>
                    ))}
                  </div>

                  {/* Carousel Switchers */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <button
                      onClick={handlePrev}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="flex gap-1.5 overflow-x-auto max-w-[200px] py-1 px-1">
                      {NFT_COLLECTION.map((nft, idx) => (
                        <button
                          key={nft.id}
                          onClick={() => {
                            sound.playClick();
                            setActiveIndex(idx);
                          }}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            idx === activeIndex
                              ? 'bg-hood-green w-6'
                              : 'bg-white/20 hover:bg-white/40'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleNext}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
