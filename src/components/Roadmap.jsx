import React from 'react';
import { MapPin, CheckCircle2, CircleDashed, Rocket, Cpu, Landmark, Sparkles } from 'lucide-react';

export default function Roadmap() {
  const phases = [
    {
      phase: "01",
      tag: "GENESIS COMPLETED (1,000 ARCHIVES)",
      tagColor: "bg-hood-green/20 text-hood-green border-hood-green/40",
      icon: Rocket,
      title: "Phase 1: Genesis Spawn & Reveal",
      desc: "Smart contract deployment on Robinhood Chain, generation of 1,000 generative brokers, trait matrix indexing, and secondary marketplace verification.",
      milestones: [
        "Smart Contract Deployment on Robinhood Chain",
        "Community Whitelist & OG Discord Lounge",
        "1,000 Generative Broker Archetype Reveal",
        "Secondary Marketplace Verification"
      ]
    },
    {
      phase: "02",
      tag: "UP NEXT (Q2 2026)",
      tagColor: "bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/40",
      icon: Cpu,
      title: "Phase 2: Staking & $SPRM Token",
      desc: "Non-custodial staking protocol launch, $SPRM utility token airdrop, 100% royalty share to stakers, and automated trading sniper bot integration.",
      milestones: [
        "Non-Custodial Staking Contract Launch",
        "$SPRM Utility Token Airdrop",
        "100% Secondary Royalties to Stakers",
        "Discord Alpha Signal Bot Integration"
      ]
    },
    {
      phase: "03",
      tag: "DEVELOPMENT (Q3 2026)",
      tagColor: "bg-cyber-gold/20 text-cyber-gold border-cyber-gold/40",
      icon: Landmark,
      title: "Phase 3: The Hedge DAO & Alpha Terminal",
      desc: "Community-governed hedge vault deployment, institutional-grade arbitrage bots, and private trading alpha dashboard for holders.",
      milestones: [
        "Robinhood Hedge DAO Vault",
        "Community MEV & Trading Arbitrage Pool",
        "Governance Voting on Strategic Acquisitions",
        "Whale Terminal Access for Top Holders"
      ]
    },
    {
      phase: "04",
      tag: "FUTURE VISION (Q4 2026+)",
      tagColor: "bg-cyber-pink/20 text-cyber-pink border-cyber-pink/40",
      icon: Sparkles,
      title: "Phase 4: 3D Metaverse & Global Takeover",
      desc: "High-definition 3D avatars for virtual worlds, physical luxury streetwear drops, and private annual investor summits in Miami and NYC.",
      milestones: [
        "3D Rigged Metaverse Avatars",
        "Limited Luxury Streetwear Merch Drop",
        "Annual Private Yacht Summit in Miami",
        "Sperm Brokers V2 Next-Gen Expansion"
      ]
    },
  ];

  return (
    <section id="roadmap" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-hood-green/10 border border-hood-green/30 text-hood-green text-xs font-mono font-bold tracking-wider">
            <MapPin size={14} />
            <span>THE MASTERPLAN</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Roadmap (2026-2027)
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Our strategic trajectory to conquer the decentralized markets on Robinhood Chain.
          </p>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {phases.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl p-8 bg-[#0D111A]/90 border border-white/10 hover:border-hood-green/40 transition-all duration-300 space-y-6 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-hood-green transition-colors">
                      <Icon size={22} />
                    </div>
                    <span className="text-3xl font-extrabold font-mono text-slate-500 group-hover:text-hood-green transition-colors">
                      #{item.phase}
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-extrabold border ${item.tagColor}`}>
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-display text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Milestone Checklist */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  {item.milestones.map((ms, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-mono text-slate-300">
                      {idx === 0 ? (
                        <CheckCircle2 size={15} className="text-hood-green flex-shrink-0" />
                      ) : (
                        <CircleDashed size={15} className="text-slate-500 flex-shrink-0" />
                      )}
                      <span>{ms}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
