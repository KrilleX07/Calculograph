import React, { useState, useMemo } from 'react';
import { Sparkles, Search, Filter, Layers, Eye, Lock } from 'lucide-react';
import { NFT_COLLECTION, RARITY_TIERS } from '../data/nfts';
import { sound } from '../utils/sound';

export default function Gallery({ onSelectNFT }) {
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNFTs = useMemo(() => {
    return NFT_COLLECTION.filter((nft) => {
      const matchesRarity = selectedRarity === 'All' || nft.rarity.toLowerCase() === selectedRarity.toLowerCase();
      
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesRarity;

      const matchesName = nft.name.toLowerCase().includes(query);
      const matchesTitle = nft.title.toLowerCase().includes(query);
      const matchesTraits = nft.traits.some(
        (t) => t.category.toLowerCase().includes(query) || t.value.toLowerCase().includes(query)
      );
      const matchesDesc = nft.description.en.toLowerCase().includes(query);

      return matchesRarity && (matchesName || matchesTitle || matchesTraits || matchesDesc);
    });
  }, [selectedRarity, searchQuery]);

  return (
    <section id="gallery" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-hood-green/10 border border-hood-green/30 text-hood-green text-xs font-mono font-bold tracking-wider">
              <Sparkles size={14} />
              <span>ALL 11 CHARACTERS</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
              Character Gallery
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl">
              Explore all 11 unique 16-bit pixel masterpieces. Click any card to inspect 3D holographic foil, rarity metrics, and full lore.
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or trait..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0D111A] border border-white/10 text-white text-sm focus:outline-none focus:border-hood-green placeholder:text-slate-600 transition"
            />
          </div>
        </div>

        {/* Rarity Tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono pr-2">
            <Filter size={14} />
            <span>Rarity:</span>
          </div>

          {RARITY_TIERS.map((tier) => {
            const isActive = selectedRarity.toLowerCase() === tier.name.toLowerCase();
            return (
              <button
                key={tier.name}
                onClick={() => {
                  sound.playClick();
                  setSelectedRarity(tier.name);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-hood-green text-black border-hood-green shadow-md shadow-hood-green/20'
                    : 'bg-[#0D111A]/80 text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {tier.name}
              </button>
            );
          })}
        </div>

        {/* NFTs Grid */}
        {filteredNFTs.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#0D111A]/40 border border-white/10 text-center space-y-3">
            <div className="text-4xl">🔍</div>
            <div className="text-lg font-bold text-white">No brokers matched your query</div>
            <button
              onClick={() => {
                sound.playClick();
                setSelectedRarity('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-hood-green transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNFTs.map((nft) => {
              const isGolden = nft.isMythic;
              return (
                <div
                  key={nft.id}
                  onClick={() => {
                    if (isGolden) sound.playMythicReveal();
                    else sound.playClick();
                    onSelectNFT(nft);
                  }}
                  className={`group relative rounded-3xl overflow-hidden holo-card border transition-all duration-300 cursor-pointer flex flex-col ${
                    isGolden
                      ? 'border-yellow-400/80 bg-gradient-to-b from-[#1a1303] to-[#0d111a] hover:shadow-2xl hover:shadow-yellow-500/30'
                      : 'border-white/10 bg-[#0D111A] hover:border-hood-green/50 hover:shadow-xl hover:shadow-hood-green/10'
                  }`}
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-square overflow-hidden bg-black/40">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-white font-mono text-[11px] font-bold">
                        #{nft.id}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className="px-2.5 py-1 rounded-lg backdrop-blur-md border text-[11px] font-mono font-extrabold tracking-wide"
                        style={{
                          backgroundColor: `${nft.rarityColor}20`,
                          borderColor: nft.rarityColor,
                          color: nft.rarityColor,
                        }}
                      >
                        {nft.rarity}
                      </span>
                    </div>

                    {/* Hover Overlay Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-xl bg-hood-green text-black font-extrabold text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-hood-green/30">
                        <Eye size={15} />
                        <span>Inspect Dossier</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold font-display text-white group-hover:text-hood-green transition-colors">
                        {nft.name}
                      </h3>
                      <p className="text-xs font-mono text-slate-400">
                        {nft.title}
                      </p>
                    </div>

                    {/* Traits snippet */}
                    <div className="flex flex-wrap gap-1">
                      {nft.traits.slice(0, 2).map((tr, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
                        >
                          {tr.value}
                        </span>
                      ))}
                    </div>

                    {/* Staking Status Info */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Staking:</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Lock size={12} />
                        Phase 2 Soon
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
