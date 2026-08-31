import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { sound } from '../utils/sound';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What is the Sperm Brokers NFT collection?",
      a: "Sperm Brokers is an elite collection of 1,000 16-bit retro characters based on 11 iconic Wall Street archetypes, specifically engineered for the Robinhood Chain ecosystem."
    },
    {
      q: "Which blockchain is the collection hosted on?",
      a: "The collection resides natively on Robinhood Chain L2 (EVM compatible). Network transactions benefit from instant finality and fractions of a cent in gas fees."
    },
    {
      q: "What utility and rights do holders receive?",
      a: "Holders receive 100% full commercial intellectual property (IP) rights, upcoming $SPRM staking protocol yield, exclusive access to the VIP Whale Alpha Signals Discord, and guaranteed whitelist allocation for future ecosystem expansions."
    },
    {
      q: "When will the $SPRM Staking Protocol launch?",
      a: "Staking is scheduled for Phase 2 (Q2 2026). Once deployed, holders will be able to lock their brokers non-custodially to stream daily $SPRM dividends and earn secondary market royalty splits."
    },
    {
      q: "Which Web3 wallets are supported?",
      a: "We support Robinhood Wallet, MetaMask, Phantom, Coinbase Wallet, and 100+ other wallets via WalletConnect."
    }
  ];

  const toggle = (idx) => {
    sound.playClick();
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-hood-green/10 border border-hood-green/30 text-hood-green text-xs font-mono font-bold tracking-wider">
            <HelpCircle size={14} />
            <span>KNOWLEDGE BASE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#0D111A] border-hood-green/50 shadow-lg shadow-hood-green/5'
                    : 'bg-[#0D111A]/60 border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-white"
                >
                  <span>{item.q}</span>
                  <div className={`p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-hood-green' : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm text-slate-300 leading-relaxed border-t border-white/5 font-sans animate-in fade-in duration-200">
                    <p className="pt-4">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
