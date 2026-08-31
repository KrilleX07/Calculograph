import React, { useState } from 'react';
import { Sparkles, Wallet, ShieldCheck, Check, AlertCircle, ArrowRight, Loader2, Share2, ExternalLink, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../utils/supabase';
import { sound } from '../utils/sound';
import { NFT_COLLECTION } from '../data/nfts';

export default function WhitelistForm({ wallet, onOpenWallet }) {
  const [walletInput, setWalletInput] = useState(wallet.address || '');
  const [twitterInput, setTwitterInput] = useState('');
  const [discordInput, setDiscordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Sync wallet address if connected via modal
  React.useEffect(() => {
    if (wallet.connected && wallet.address) {
      setWalletInput(wallet.address);
    }
  }, [wallet.connected, wallet.address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    sound.playClick();

    // Basic Validation
    const cleanWallet = walletInput.trim();
    let cleanTwitter = twitterInput.trim();
    const cleanDiscord = discordInput.trim();

    if (!cleanWallet) {
      setError('Please enter your EVM / Robinhood wallet address.');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(cleanWallet)) {
      setError('Invalid wallet address format. It must start with 0x and contain 42 characters.');
      return;
    }

    if (!cleanTwitter) {
      setError('Please enter your X (Twitter) handle.');
      return;
    }

    if (!cleanTwitter.startsWith('@')) {
      cleanTwitter = `@${cleanTwitter}`;
    }

    setLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from('whitelist')
        .insert([
          {
            wallet_address: cleanWallet.toLowerCase(),
            twitter_handle: cleanTwitter,
            discord_handle: cleanDiscord || null,
          }
        ])
        .select();

      if (insertError) {
        if (insertError.code === '23505' || insertError.message?.includes('unique') || insertError.message?.includes('duplicate')) {
          setError('This wallet address is already registered on the Whitelist!');
        } else {
          setError(`Database error: ${insertError.message || 'Unable to register. Please try again.'}`);
        }
        setLoading(false);
        return;
      }

      // Success!
      sound.playCash();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00F58C', '#00E5FF', '#FFD700', '#FFFFFF'],
      });

      setSuccessData({
        wallet: cleanWallet,
        twitter: cleanTwitter,
        discord: cleanDiscord,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tweetText = encodeURIComponent(
    `Just secured my spot on the @SpermBrokers Genesis Whitelist on Robinhood Chain! 🧬\n\n1,000 Wall Street Degens invading the blockchain.\n\nRegister now: https://sperm-broker.vercel.app`
  );

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-hood-green/10 rounded-full blur-[160px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyber-cyan/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-4xl mx-auto space-y-12">
        
        {/* Top Header & Lore Hook */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hood-green/10 border border-hood-green/30 text-hood-green text-xs font-mono font-bold tracking-wider shadow-sm shadow-hood-green/20 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-hood-green animate-ping"></span>
            <Sparkles size={14} />
            <span>GENESIS WHITELIST • LIMITED 1,000 SPOTS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
            Apply for <span className="text-transparent bg-clip-text bg-gradient-to-r from-hood-green via-emerald-400 to-cyber-cyan">Early Whitelist</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Register your wallet and X account to guarantee priority access to the Sperm Brokers 16-Bit NFT collection on Robinhood Chain.
          </p>
        </div>

        {/* The Main Terminal Form Card */}
        <div className="relative rounded-3xl p-6 sm:p-10 bg-[#0D111A]/95 border border-white/15 shadow-2xl backdrop-blur-xl space-y-8">
          
          {/* Top Subtle Grid Effect */}
          <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-hood-green to-transparent"></div>

          {successData ? (
            /* Success Confirmation Screen */
            <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-hood-green/20 border-2 border-hood-green flex items-center justify-center text-hood-green shadow-xl shadow-hood-green/30">
                <Check size={44} className="stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-extrabold font-display text-white">
                  You're on the Whitelist! 🎉
                </h3>
                <p className="text-sm font-mono text-slate-300">
                  Your registration has been secured in the Robinhood Chain genesis vault.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 max-w-md mx-auto text-left space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Registered Wallet:</span>
                  <span className="text-white font-bold">{successData.wallet.slice(0, 6)}...{successData.wallet.slice(-4)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>X Handle:</span>
                  <span className="text-hood-green font-bold">{successData.twitter}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-bold">APPROVED FOR PHASE 1</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${tweetText}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick()}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-hood-green to-emerald-400 text-black font-extrabold font-mono text-xs flex items-center justify-center gap-2 shadow-lg shadow-hood-green/20 hover:scale-105 transition"
                >
                  <Share2 size={15} />
                  <span>Share on 𝕏 to Boost Allocation</span>
                </a>

                <a
                  href="https://x.com/SpermBrokers"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick()}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <span>Follow @SpermBrokers</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ) : (
            /* Whitelist Form Inputs */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Wallet Address Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Wallet size={14} className="text-hood-green" />
                    <span>EVM / Robinhood Wallet Address</span>
                    <span className="text-rose-400">*</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onOpenWallet();
                    }}
                    className="text-hood-green hover:underline flex items-center gap-1"
                  >
                    <ShieldCheck size={13} />
                    <span>{wallet.connected ? 'Wallet Connected' : 'Auto-fill from Wallet'}</span>
                  </button>
                </div>

                <input
                  type="text"
                  required
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  placeholder="0x71C...3921"
                  className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-hood-green transition placeholder:text-slate-600"
                />
              </div>

              {/* Twitter / X Handle Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <span className="text-white font-bold leading-none">𝕏</span>
                    <span>X (Twitter) Handle</span>
                    <span className="text-rose-400">*</span>
                  </label>

                  <a
                    href="https://x.com/SpermBrokers"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-hood-green text-[11px] flex items-center gap-1"
                  >
                    <span>Follow @SpermBrokers</span>
                    <ExternalLink size={11} />
                  </a>
                </div>

                <input
                  type="text"
                  required
                  value={twitterInput}
                  onChange={(e) => setTwitterInput(e.target.value)}
                  placeholder="@your_username"
                  className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-hood-green transition placeholder:text-slate-600"
                />
              </div>

              {/* Discord Tag (Optional) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <label className="text-slate-300 font-bold">
                    Discord Username <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                </div>

                <input
                  type="text"
                  value={discordInput}
                  onChange={(e) => setDiscordInput(e.target.value)}
                  placeholder="username"
                  className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-hood-green transition placeholder:text-slate-600"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-hood-green via-emerald-400 to-cyber-cyan text-black font-extrabold font-display text-base tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-hood-green/25 hover:shadow-hood-green/40 hover:scale-[1.01] active:scale-[0.99] transition duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Registering to Vault...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="fill-black" />
                    <span>CLAIM EARLY BROKER WHITELIST</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* 11 Character Avatars Infinite Carousel / Preview Underneath */}
        <div className="space-y-4 text-center">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
            <span>11 Unique Generative Archetypes in Genesis Drop</span>
          </div>

          <div className="flex items-center justify-center gap-3 overflow-x-auto py-2 scrollbar-none">
            {NFT_COLLECTION.map((nft) => (
              <div
                key={nft.id}
                title={nft.name}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border flex-shrink-0 transition-transform hover:scale-110 cursor-pointer ${
                  nft.isMythic ? 'border-yellow-400 shadow-md shadow-yellow-500/30' : 'border-white/10 hover:border-hood-green'
                }`}
              >
                <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 3 Value Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center font-mono">
          <div className="p-4 rounded-2xl bg-[#0D111A]/60 border border-white/5 space-y-1">
            <div className="text-xs text-slate-400">Total Genesis Supply</div>
            <div className="text-lg font-bold text-white">1,000 Brokers</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0D111A]/60 border border-white/5 space-y-1">
            <div className="text-xs text-slate-400">Blockchain Network</div>
            <div className="text-lg font-bold text-hood-green">Robinhood L2</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0D111A]/60 border border-white/5 space-y-1">
            <div className="text-xs text-slate-400">Holder Staking</div>
            <div className="text-lg font-bold text-cyber-gold">Phase 2 Enabled</div>
          </div>
        </div>

      </div>
    </section>
  );
}
