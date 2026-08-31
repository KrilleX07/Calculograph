import React, { useEffect } from 'react';
import { X, Download, Lock, Sparkles, Shield, Award, Quote } from 'lucide-react';
import { sound } from '../utils/sound';

export default function NFTModal({ nft, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        sound.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!nft) return null;

  const isGolden = nft.isMythic;

  const handleDownload = () => {
    sound.playCash();
    const link = document.createElement('a');
    link.href = nft.image;
    link.download = `sperm_broker_${nft.id}_${nft.name.toLowerCase().replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Modal Box */}
      <div className={`relative w-full max-w-4xl rounded-3xl overflow-hidden border shadow-2xl my-8 transition-all ${
        isGolden
          ? 'border-yellow-400/90 bg-gradient-to-b from-[#1c1404] via-[#0d111a] to-[#07090e]'
          : 'border-white/20 bg-[#0D111A]'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 hover:bg-white/20 border border-white/10 text-slate-300 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Left Column: Image showcase with 3D Holo frame */}
          <div className="md:col-span-5 p-6 sm:p-8 flex flex-col items-center justify-center bg-black/40 border-b md:border-b-0 md:border-r border-white/10">
            <div className={`relative w-full aspect-square rounded-2xl overflow-hidden holo-card border-2 ${
              isGolden ? 'border-yellow-400 shadow-2xl shadow-yellow-500/40' : 'border-white/15'
            }`}>
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono font-bold text-xs">
                #{nft.id}
              </div>

              <div className="absolute top-3 right-3">
                <span
                  className="px-3 py-1 rounded-lg backdrop-blur-md border text-xs font-mono font-extrabold"
                  style={{
                    backgroundColor: `${nft.rarityColor}25`,
                    borderColor: nft.rarityColor,
                    color: nft.rarityColor
                  }}
                >
                  {nft.rarity}
                </span>
              </div>
            </div>

            {/* Quick action: Download button */}
            <button
              onClick={handleDownload}
              className="mt-6 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-hood-green to-emerald-400 hover:from-emerald-400 hover:to-hood-green text-black font-mono text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-hood-green/20 transition duration-200"
            >
              <Download size={16} />
              <span>Download HD Avatar</span>
            </button>
          </div>

          {/* Right Column: Dossier, Lore, Traits & Status */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Header / Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-hood-green uppercase tracking-wider">
                  Dossier #{nft.id}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-400">
                  Rarity Score: <span className="text-white font-bold">{nft.rarityScore}</span>
                </span>
              </div>
              <h3 className="text-3xl font-extrabold font-display text-white">
                {nft.name}
              </h3>
              <p className="text-sm font-mono text-slate-400 mt-0.5">
                {nft.title}
              </p>
            </div>

            {/* Quote Box */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 relative">
              <Quote className="absolute top-3 left-3 text-white/10" size={28} />
              <p className="relative z-10 text-sm italic text-slate-200 pl-6">
                {nft.quote.en}
              </p>
            </div>

            {/* Lore Biography */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Biography / Lore
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {nft.description.en}
              </p>
            </div>

            {/* Staking Protocol Teaser Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-black border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Lock size={18} />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400">Phase 2 Staking Protocol</div>
                  <div className="text-sm font-bold text-amber-300 font-mono">
                    Eligible for Vault Yield
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-mono text-slate-400">Yield Multiplier:</div>
                <div className="text-base font-extrabold text-cyber-gold font-mono">
                  {nft.stakingMultiplier}
                </div>
              </div>
            </div>

            {/* Traits Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Attributes & Traits
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {nft.traits.map((trait, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1"
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>{trait.category}</span>
                      <span className="text-emerald-400 font-bold">{trait.rarity}</span>
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {trait.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-mono text-xs font-bold transition text-center"
              >
                Close Dossier
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
