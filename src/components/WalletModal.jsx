import React, { useState } from 'react';
import { X, ShieldCheck, Wallet, ArrowRight, RefreshCw } from 'lucide-react';
import { sound } from '../utils/sound';

export default function WalletModal({ isOpen, onClose, wallet, setWallet }) {
  const [connectingWallet, setConnectingWallet] = useState(null);

  if (!isOpen) return null;

  const walletOptions = [
    {
      id: 'robinhood',
      name: 'Robinhood Wallet',
      desc: 'Official Robinhood Chain L2',
      badge: 'RECOMMENDED',
      icon: '🏹',
    },
    {
      id: 'metamask',
      name: 'MetaMask',
      desc: 'Popular EVM Browser Wallet',
      icon: '🦊',
    },
    {
      id: 'phantom',
      name: 'Phantom',
      desc: 'Multi-chain & Solana / EVM',
      icon: '👻',
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      desc: 'Smart Wallet & Passkeys',
      icon: '🔵',
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      desc: 'Mobile QR Code & 100+ Wallets',
      icon: '🔗',
    },
  ];

  const handleConnect = (walletId) => {
    sound.playClick();
    setConnectingWallet(walletId);

    setTimeout(() => {
      sound.playCash();
      setWallet({
        connected: true,
        address: '0x7F38a9D2C85B1838618e7786B5A1A5cDb08f8B9c',
        balanceEth: '2.450',
        walletType: walletId,
        network: 'Robinhood Chain L2',
      });
      setConnectingWallet(null);
      onClose();
    }, 1200);
  };

  const handleDisconnect = () => {
    sound.playClick();
    setWallet({
      connected: false,
      address: '',
      balanceEth: '0',
      walletType: '',
      network: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 bg-[#0D111A] border border-white/20 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-hood-green font-bold">
            <Wallet size={14} />
            <span>WEB3 AUTHENTICATION</span>
          </div>
          <h3 className="text-2xl font-extrabold font-display text-white">
            {wallet.connected ? 'Wallet Overview' : 'Connect Web3 Wallet'}
          </h3>
          <p className="text-xs text-slate-400">
            Choose your preferred wallet to interact with Robinhood Chain
          </p>
        </div>

        {/* Connected State View */}
        {wallet.connected ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>Connected</span>
                </span>
                <span className="text-[11px] text-slate-400">Robinhood L2</span>
              </div>
              
              <div className="text-sm font-bold text-white break-all">
                {wallet.address}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-emerald-900/50 text-xs">
                <span className="text-slate-400">Balance:</span>
                <span className="font-bold text-hood-green">{wallet.balanceEth} ETH</span>
              </div>
            </div>

            <button
              onClick={handleDisconnect}
              className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold transition"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          /* Wallet Selector List */
          <div className="space-y-2.5">
            {walletOptions.map((opt) => {
              const isConnectingThis = connectingWallet === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleConnect(opt.id)}
                  disabled={connectingWallet !== null}
                  className="w-full p-3.5 rounded-2xl bg-black/40 hover:bg-white/5 border border-white/10 hover:border-hood-green/50 flex items-center justify-between transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white group-hover:text-hood-green transition-colors flex items-center gap-2">
                        <span>{opt.name}</span>
                        {opt.badge && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-hood-green/20 text-hood-green border border-hood-green/40">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {opt.desc}
                      </div>
                    </div>
                  </div>

                  {isConnectingThis ? (
                    <RefreshCw size={18} className="animate-spin text-hood-green" />
                  ) : (
                    <ArrowRight size={16} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
