import React, { useState } from 'react';
import { Layers, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { sound } from '../utils/sound';

export default function TraitMatrix() {
  const categories = [
    {
      name: "Outfits & Suits",
      traits: [
        { name: "Navy Pinstripe Suit", rarity: "34%", tier: "Common" },
        { name: "Savile Row Tweed Waistcoat", rarity: "22%", tier: "Uncommon" },
        { name: "Heavy-Duty Miner Overalls", rarity: "19%", tier: "Uncommon" },
        { name: "Battle-Torn Office Suit", rarity: "14%", tier: "Rare" },
        { name: "Charcoal Bespoke Tuxedo", rarity: "12%", tier: "Rare" },
        { name: "Pastel Pink Linen Blazer", rarity: "11%", tier: "Rare" },
        { name: "Studded Synth-Leather", rarity: "7%", tier: "Epic" },
        { name: "Sherwood Green Tunic", rarity: "6%", tier: "Epic" },
        { name: "Apollo 420 Pressure Suit", rarity: "3%", tier: "Legendary" },
        { name: "24K Solid Gold Dipped", rarity: "0.01%", tier: "1/1 Mythic" }
      ]
    },
    {
      name: "Headwear & Caps",
      traits: [
        { name: "Victorian Silk Top Hat", rarity: "18%", tier: "Uncommon" },
        { name: "Industrial LED Hard Hat", rarity: "16%", tier: "Uncommon" },
        { name: "Red Degen Karate Band", rarity: "10%", tier: "Rare" },
        { name: "Neon Optical Cyber Visor", rarity: "6%", tier: "Epic" },
        { name: "Feathered Archer Cap", rarity: "5%", tier: "Epic" },
        { name: "Gold-Reflective EVA Helmet", rarity: "2.5%", tier: "Legendary" },
        { name: "Imperial Diamond Crown", rarity: "0.01%", tier: "1/1 Mythic" }
      ]
    },
    {
      name: "Weapons & Hand Items",
      traits: [
        { name: "Leather Portfolio & WSJ", rarity: "25%", tier: "Common" },
        { name: "Vintage Briar Pipe", rarity: "17%", tier: "Uncommon" },
        { name: "Crystal Champagne Flute", rarity: "15%", tier: "Rare" },
        { name: "Bitcoin Electric Pickaxe", rarity: "14%", tier: "Uncommon" },
        { name: "Banded $100 Cash Stack", rarity: "12%", tier: "Rare" },
        { name: "Mini Saturn V Rocket", rarity: "7%", tier: "Rare" },
        { name: "Exploit Hardware Deck", rarity: "6%", tier: "Epic" },
        { name: "Candlestick Longbow", rarity: "4%", tier: "Epic" },
        { name: "Neon Bullish Moon Flag", rarity: "2.8%", tier: "Legendary" },
        { name: "Scepter of Infinite Alpha", rarity: "0.01%", tier: "1/1 Mythic" }
      ]
    },
    {
      name: "Auras & Special Effects",
      traits: [
        { name: "Floor Bell Resonance", rarity: "50%", tier: "Common" },
        { name: "Old World Aristocracy", rarity: "20%", tier: "Uncommon" },
        { name: "HODL Energy Surge", rarity: "12%", tier: "Rare" },
        { name: "Retrowave Sunset Flare", rarity: "10%", tier: "Rare" },
        { name: "Matrix Green Rain", rarity: "8%", tier: "Epic" },
        { name: "Margin Call Red Siren", rarity: "7%", tier: "Rare Meme" },
        { name: "Emerald Robinhood Glow", rarity: "5%", tier: "Epic" },
        { name: "Zero-G Cosmic Stardust", rarity: "3.2%", tier: "Legendary" },
        { name: "Solar Corona Alpha", rarity: "0.01%", tier: "1/1 Mythic" }
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="traits" className="py-24 relative bg-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider">
            <Layers size={14} />
            <span>RARITY ARCHITECTURE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Trait Matrix & Distribution
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Every Sperm Broker is mathematically synthesized with procedural properties that determine its collector rank and prospective yield multipliers.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playClick();
                setActiveTab(idx);
              }}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                activeTab === idx
                  ? 'bg-hood-green text-black shadow-lg shadow-hood-green/20'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Trait Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories[activeTab].traits.map((t, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#0D111A] border border-white/10 flex items-center justify-between hover:border-hood-green/40 transition"
            >
              <div>
                <div className="text-xs font-bold text-white">{t.name}</div>
                <div className="text-[10px] font-mono text-slate-500">{t.tier}</div>
              </div>
              <div className="text-right font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-emerald-400">
                  {t.rarity}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
