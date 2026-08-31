import React from 'react';
import { Lock, Shield, Sparkles, Zap, Coins, Flame, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/sound';

export default function StakingCalculator() {
  const teaserFeatures = [
    {
      icon: Lock,
      color: 'text-hood-green',
      border: 'border-hood-green/30 hover:border-hood-green',
      bg: 'bg-hood-green/10',
      title: 'Non-Custodial Vault',
      desc: 'Lock your Sperm Brokers securely in the protocol while retaining full ownership of your NFTs.'
    },
    {
      icon: Coins,
      color: 'text-cyber-gold',
      border: 'border-cyber-gold/30 hover:border-cyber-gold',
      bg: 'bg-cyber-gold/10',
      title: '$SPRM Ecosystem Yield',
      desc: 'Earn native $SPRM utility rewards and secondary marketplace royalty dividends based on character rarity.'
    },
    {
      icon: Zap,
      color: 'text-cyber-cyan',
      border: 'border-cyber-cyan/30 hover:border-cyber-cyan',
      bg: 'bg-cyber-cyan/10',
      title: 'Whale Alpha Lounge',
      desc: 'Staking activates VIP Discord channels, institutional trading terminal access, and MEV sniper tools.'
    }
  ];

  return (
    <section id="staking" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-hood-green/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-hood-green/10 border border-hood-green/30 text-hood-green text-xs font-mono font-bold tracking-wider animate-pulse">
            <Lock size={14} />
            <span>PHASE 2 PROTOCOL • COMING SOON</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold font-display text-white tracking-tight">
            Staking Vault <span className="text-hood-green">Soon...</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            The non-custodial smart contracts are currently undergoing development and testing for the Robinhood Chain ecosystem.
          </p>
        </div>

        {/* Central High-Tech Locked Vault Card */}
        <div className="relative rounded-3xl p-8 sm:p-14 glass-panel-glow border border-white/15 shadow-2xl overflow-hidden text-center space-y-10">
          
          {/* Subtle Grid Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#00F58C_1px,transparent_1px)] [background-size:20px_20px]"></div>

          {/* Glowing Padlock Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute -inset-4 bg-hood-green/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-black/60 border-2 border-hood-green/50 flex items-center justify-center text-hood-green shadow-xl shadow-hood-green/20">
              <Lock size={48} className="animate-bounce" />
            </div>
          </div>

          {/* Status Text & Protocol Banner */}
          <div className="space-y-3 max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              The Vault is Preparing for Genesis Lock
            </h3>
            <p className="text-sm text-slate-300 font-mono">
              Holders of all 11 Sperm Broker archetypes will be eligible to stake for governance power, $SPRM dividends, and ecosystem royalties upon Phase 2 rollout.
            </p>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-4 border-t border-white/10">
            {teaserFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl bg-black/40 border ${feat.border} transition-all duration-300 space-y-3`}
                >
                  <div className={`w-12 h-12 rounded-xl ${feat.bg} border border-white/10 flex items-center justify-center ${feat.color}`}>
                    <Icon size={24} />
                  </div>
                  <h4 className="text-base font-bold font-display text-white">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Lock Action Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="px-8 py-4 rounded-2xl bg-black/60 border border-white/10 text-slate-400 text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>NETWORK STATUS: SMART CONTRACT DEPLOYMENT SCHEDULED (Q2 2026)</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
