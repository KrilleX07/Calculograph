import React, { useRef, useState } from 'react';
import { Download, Share2, Check, Loader2, Copy } from 'lucide-react';
import { toPng } from 'html-to-image';
import { sound } from '../utils/sound';

export default function AllowlistPass({ data, onReset }) {
  const passRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const cleanTwitter = data.twitter.startsWith('@') ? data.twitter : `@${data.twitter}`;
  const firstLetter = cleanTwitter.replace('@', '').charAt(0).toUpperCase() || 'C';
  const shortenedWallet = `${data.wallet.slice(0, 6)}...${data.wallet.slice(-4)}`;
  
  const spotNumber = data.spotNumber || '0001';
  const formattedDate = new Date().toISOString().split('T')[0];

  // Exact waveform capsule sequence
  const barcodePills = [
    { h: 'h-6', bg: 'bg-[#00F58C]' }, // green
    { h: 'h-3', bg: 'bg-[#1E293B]' }, // dark
    { h: 'h-8', bg: 'bg-[#1E293B]' }, // dark tall
    { h: 'h-2', bg: 'bg-[#1E293B]' }, // dot
    { h: 'h-6', bg: 'bg-[#00F58C]' }, // green
    { h: 'h-7', bg: 'bg-[#1E293B]' }, // dark
    { h: 'h-3', bg: 'bg-[#1E293B]' }, // dot
    { h: 'h-10', bg: 'bg-[#00E5FF]' }, // cyan tall
    { h: 'h-6', bg: 'bg-[#00F58C]' }, // green
    { h: 'h-2', bg: 'bg-[#1E293B]' }, // dot
    { h: 'h-7', bg: 'bg-[#1E293B]' }, // dark
    { h: 'h-9', bg: 'bg-[#1E293B]' }, // dark tall
    { h: 'h-5', bg: 'bg-[#00F58C]' }, // green
    { h: 'h-7', bg: 'bg-[#1E293B]' }, // dark
    { h: 'h-2', bg: 'bg-[#00E5FF]' }, // cyan dot
    { h: 'h-7', bg: 'bg-[#1E293B]' }, // dark
    { h: 'h-6', bg: 'bg-[#00F58C]' }, // green
    { h: 'h-10', bg: 'bg-[#1E293B]' }, // dark tall
    { h: 'h-3', bg: 'bg-[#1E293B]' }, // dot
    { h: 'h-6', bg: 'bg-[#1E293B]' }, // dark
    { h: 'h-2', bg: 'bg-[#00F58C]' }, // green dot
    { h: 'h-10', bg: 'bg-[#00E5FF]' }, // cyan tall
    { h: 'h-7', bg: 'bg-[#1E293B]' }, // dark
    { h: 'h-8', bg: 'bg-[#1E293B]' }, // dark tall
    { h: 'h-5', bg: 'bg-[#00F58C]' }, // green
    { h: 'h-10', bg: 'bg-[#1E293B]' }, // dark tall
    { h: 'h-7', bg: 'bg-[#1E293B]' }, // dark
    { h: 'h-2', bg: 'bg-[#1E293B]' }, // dot
    { h: 'h-6', bg: 'bg-[#00F58C]' }, // green
    { h: 'h-7', bg: 'bg-[#1E293B]' }, // dark
  ];

  const handleDownload = async () => {
    if (!passRef.current) return;
    sound.playCash();
    setDownloading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      const dataUrl = await toPng(passRef.current, {
        cacheBust: true,
        pixelRatio: 3, // Ultra-sharp 3x retina HD
        backgroundColor: '#04060A',
        style: {
          transform: 'none',
          margin: '0',
        },
      });

      const link = document.createElement('a');
      link.download = `calculograph-pass-${cleanTwitter.replace('@', '')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download pass:', err);
    } finally {
      setDownloading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    sound.playCash();
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const tweetShareText = encodeURIComponent(
    `Just secured my official Calculograph Pass #${spotNumber} for @Calculograph! ⏳⚡\n\nApply with my code: ${data.myRefCode}\n\nRegister: ${data.refLink}`
  );

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-300 max-w-md mx-auto">
      
      {/* Title */}
      <div className="text-center space-y-1.5">
        <div className="font-pixel text-[9px] text-[#00F58C] uppercase tracking-widest">
          ACCESS GRANTED
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Welcome, {cleanTwitter}
        </h2>
        <p className="font-mono text-xs text-slate-400">
          Keep the pass — it’s your precision proof of entry.
        </p>
      </div>

      {/* ===================== DIGITAL CHRONO PASS CARD ===================== */}
      <div className="p-1 rounded-[2.2rem] bg-[#04060A]">
        <div
          ref={passRef}
          className="rounded-[2rem] p-7 sm:p-8 bg-gradient-to-b from-[#090E17] via-[#050810] to-[#030508] border-2 border-[#1E293B] shadow-2xl relative space-y-6 text-slate-100 select-none overflow-hidden"
        >
          {/* Glowing ambient gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-28 bg-[#00F58C]/10 blur-3xl pointer-events-none"></div>

          {/* Card Header */}
          <div className="flex justify-between items-center border-b border-[#1E293B] pb-4">
            <span className="font-pixel text-[10px] text-[#00F58C] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F58C] inline-block animate-ping"></span>
              CALCULOGRAPH
            </span>
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
              ALLOWLIST PASS
            </span>
          </div>

          {/* Avatar + Badge Section */}
          <div className="flex flex-col items-center text-center space-y-3 pt-1">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#00F58C] bg-black shadow-lg shadow-[#00F58C]/20 flex items-center justify-center">
                <img
                  src={data.avatarUrl || `/favicon.png`}
                  alt={cleanTwitter}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/favicon.png';
                  }}
                />
              </div>
              {/* Round initial badge */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#0D1522] border-2 border-[#00F58C] flex items-center justify-center font-bold text-white text-xs shadow-md">
                {firstLetter}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {cleanTwitter}
              </div>
              <div className="font-pixel text-[8px] text-slate-400 uppercase tracking-widest">
                VERIFIED OPERATOR
              </div>
            </div>
          </div>

          {/* Middle Highlight Box: Spot # + Date */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#04060A] border border-[#00F58C]/30 flex justify-between items-center shadow-inner">
            <div className="space-y-1">
              <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                ALLOWLIST SPOT
              </span>
              <span className="font-mono text-2xl sm:text-3xl text-[#00F58C] font-extrabold tracking-tight">
                #{spotNumber}
              </span>
            </div>

            <div className="space-y-1 text-right">
              <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                ISSUED
              </span>
              <span className="font-mono text-xs sm:text-sm text-slate-200 font-semibold">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Wallet Details */}
          <div className="space-y-1">
            <span className="block font-mono text-[9px] text-slate-500 uppercase tracking-wider">
              WALLET
            </span>
            <span className="font-mono text-sm text-white font-bold tracking-wider">
              {shortenedWallet}
            </span>
          </div>

          {/* Glowing Cyber Waveform Capsule Barcode */}
          <div className="py-2 flex items-center justify-between gap-1 h-12">
            {barcodePills.map((pill, i) => (
              <div
                key={i}
                className={`w-1.5 sm:w-2 rounded-full ${pill.h} ${pill.bg} transition-all`}
              ></div>
            ))}
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-center border-t border-[#1E293B] pt-4 font-mono text-[9px] text-slate-500">
            <span className="uppercase tracking-widest">
              CALCULOGRAPH • PHASE 1
            </span>
            <span className="text-[#00F58C] uppercase tracking-wider font-semibold">
              X.COM/CALCULOGRAPH
            </span>
          </div>

        </div>
      </div>

      {/* ===================== ACTION BUTTONS ===================== */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Download Pass Button */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="py-3.5 px-4 rounded-xl bg-[#00F58C] hover:bg-[#25FF9C] text-black font-pixel text-[10px] uppercase tracking-wider shadow-lg shadow-[#00F58C]/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {downloading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>SAVING...</span>
            </>
          ) : (
            <>
              <Download size={14} />
              <span>DOWNLOAD PASS</span>
            </>
          )}
        </button>

        {/* Share on X Button */}
        <a
          href={`https://twitter.com/intent/tweet?text=${tweetShareText}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => sound.playCash()}
          className="py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-pixel text-[10px] uppercase tracking-wider border border-white/15 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <Share2 size={14} />
          <span>SHARE ON X</span>
        </a>

      </div>

      {/* ===================== REFERRAL LINK BOX ===================== */}
      <div className="p-5 rounded-2xl bg-[#090D16] border border-[#1E293B] text-left space-y-3 shadow-lg">
        <div className="flex justify-between items-center">
          <span className="font-pixel text-[9px] text-slate-400 uppercase tracking-wider">
            YOUR INVITE LINK
          </span>
          <button
            type="button"
            onClick={() => copyToClipboard(data.myRefCode, 'code')}
            className="font-pixel text-[9px] text-[#00E5FF] hover:underline flex items-center gap-1"
          >
            {copiedCode ? 'COPIED CODE!' : `CODE: ${data.myRefCode}`}
          </button>
        </div>

        <div className="flex gap-2">
          <input
            readOnly
            value={data.refLink}
            className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-slate-300 font-mono text-xs truncate focus:outline-none"
          />
          <button
            type="button"
            onClick={() => copyToClipboard(data.refLink, 'link')}
            className="px-4 py-2.5 rounded-lg bg-[#00F58C] hover:bg-[#25FF9C] text-black font-pixel text-[9px] uppercase whitespace-nowrap flex items-center gap-1 transition"
          >
            <Copy size={12} />
            <span>{copiedLink ? 'COPIED!' : 'COPY'}</span>
          </button>
        </div>

        <p className="font-mono text-[11px] text-slate-500 leading-relaxed">
          Every operator who registers through your link secures your priority tier.
        </p>
      </div>

      {/* Reset Button */}
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={onReset}
          className="font-pixel text-[9px] text-slate-600 hover:text-slate-400 uppercase tracking-widest transition hover:underline"
        >
          [ REGISTER ANOTHER WALLET ]
        </button>
      </div>

    </div>
  );
}
