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

  // Vintage mechanical punchcard pattern
  const barcodePills = [
    { h: 'h-6', bg: 'bg-[#c05810]' }, // amber
    { h: 'h-3', bg: 'bg-[#3c2c1c]' }, // dark ink
    { h: 'h-8', bg: 'bg-[#3c2c1c]' },
    { h: 'h-2', bg: 'bg-[#3c2c1c]' },
    { h: 'h-6', bg: 'bg-[#46e35f]' }, // phosphor green
    { h: 'h-7', bg: 'bg-[#3c2c1c]' },
    { h: 'h-3', bg: 'bg-[#3c2c1c]' },
    { h: 'h-10', bg: 'bg-[#f2c14b]' }, // gold
    { h: 'h-6', bg: 'bg-[#46e35f]' },
    { h: 'h-2', bg: 'bg-[#3c2c1c]' },
    { h: 'h-7', bg: 'bg-[#3c2c1c]' },
    { h: 'h-9', bg: 'bg-[#3c2c1c]' },
    { h: 'h-5', bg: 'bg-[#c05810]' },
    { h: 'h-7', bg: 'bg-[#3c2c1c]' },
    { h: 'h-2', bg: 'bg-[#f2c14b]' },
    { h: 'h-7', bg: 'bg-[#3c2c1c]' },
    { h: 'h-6', bg: 'bg-[#46e35f]' },
    { h: 'h-10', bg: 'bg-[#3c2c1c]' },
    { h: 'h-3', bg: 'bg-[#3c2c1c]' },
    { h: 'h-6', bg: 'bg-[#3c2c1c]' },
    { h: 'h-2', bg: 'bg-[#c05810]' },
    { h: 'h-10', bg: 'bg-[#f2c14b]' },
    { h: 'h-7', bg: 'bg-[#3c2c1c]' },
    { h: 'h-8', bg: 'bg-[#3c2c1c]' },
    { h: 'h-5', bg: 'bg-[#46e35f]' },
    { h: 'h-10', bg: 'bg-[#3c2c1c]' },
    { h: 'h-7', bg: 'bg-[#3c2c1c]' },
    { h: 'h-2', bg: 'bg-[#3c2c1c]' },
    { h: 'h-6', bg: 'bg-[#c05810]' },
    { h: 'h-7', bg: 'bg-[#3c2c1c]' },
  ];

  const handleDownload = async () => {
    if (!passRef.current) return;
    try { sound.playCash(); } catch (e) {}
    setDownloading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      
      let dataUrl;
      try {
        dataUrl = await toPng(passRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: '#17130e',
          skipFonts: true,
          style: {
            transform: 'none',
            margin: '0',
          },
        });
      } catch (err1) {
        console.warn('First toPng attempt failed, retrying...', err1);
        dataUrl = await toPng(passRef.current, {
          cacheBust: false,
          pixelRatio: 1.5,
          backgroundColor: '#17130e',
          skipFonts: true,
        });
      }

      if (dataUrl) {
        const filename = `calculograph-pass-${cleanTwitter.replace('@', '')}.png`;
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          try {
            document.body.removeChild(link);
          } catch (e) {}
        }, 100);
      }
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
    `Just secured my official Calculograph Pass #${spotNumber} for @Calculograph on Robinhood Chain! ⏳⚡\n\nApply with my code: ${data.myRefCode}\n\nRegister: ${data.refLink}`
  );

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-200 max-w-md mx-auto font-mono text-[#3c2c1c]">
      
      {/* Title */}
      <div className="text-center space-y-1">
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#c05810]">
          MEMORIZATION COMPLETE &bull; DESK CLEARED
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3c2c1c] tracking-[2px] uppercase">
          Welcome, {cleanTwitter}
        </h2>
        <p className="text-xs text-[#6d5b44]">
          Keep your physical certificate — it’s your permanent proof of entry.
        </p>
      </div>

      {/* ===================== VINTAGE CALCTRON PHYSICAL CERTIFICATE ===================== */}
      <div className="p-1 rounded-sm bg-[#0d0b08]">
        <div
          ref={passRef}
          className="p-7 sm:p-8 bg-[#1a140d] border-4 border-[#d6c9ab] shadow-[8px_10px_rgba(0,0,0,0.65)] relative space-y-6 select-none overflow-hidden text-[#efe7d6]"
          style={{
            boxShadow: 'inset 0 0 0 4px #1a140d, inset 0 0 0 6px #d6c9ab, 8px 10px rgba(0,0,0,0.6)',
          }}
        >
          {/* Top Pass Header */}
          <div className="flex justify-between items-center border-b-2 border-[#3c2c1c] pb-3.5">
            <span className="font-bold text-xs uppercase tracking-[3px] text-[#efe7d6] font-mono">
              CALCULOGRAPH
            </span>
            <span className="text-[10px] font-bold text-[#f2c14b] uppercase tracking-[1.5px] border border-[#f2c14b]/30 px-1.5 py-0.5 rounded bg-[#f2c14b]/10">
              CHRONO PASS &bull; PH.1
            </span>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center text-center space-y-3 pt-1">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded border-4 border-[#d6c9ab] bg-[#2a1e13] shadow-[4px_5px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center">
                <img
                  src={data.avatarUrl || `/favicon.png`}
                  alt={cleanTwitter}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/favicon.png';
                  }}
                />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#c05810] border-2 border-[#d6c9ab] text-[#efe7d6] flex items-center justify-center font-bold text-xs shadow-md">
                {firstLetter}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#efe7d6] tracking-tight">
                {cleanTwitter}
              </div>
              <div className="text-[10px] font-bold text-[#c05810] uppercase tracking-[2.5px]">
                VERIFIED MACHINE OPERATOR
              </div>
            </div>
          </div>

          {/* Dark Mechanical Highlight Box: Spot # + Date */}
          <div className="p-4 rounded bg-[#0d0b08] border-2 border-[#3c2c1c] flex justify-between items-center text-[#efe7d6] shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
            <div className="space-y-0.5">
              <span className="block text-[9px] font-bold text-[#a89782] uppercase tracking-[1.5px]">
                CALCULOGRAPH SPOT
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#46e35f] tracking-tight text-shadow">
                #{spotNumber}
              </span>
            </div>

            <div className="space-y-0.5 text-right">
              <span className="block text-[9px] font-bold text-[#a89782] uppercase tracking-[1.5px]">
                DATE RECORDED
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#f2c14b]">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Wallet Details */}
          <div className="space-y-1 border-t-2 border-[#3c2c1c] pt-3">
            <span className="block text-[9px] font-bold text-[#a89782] uppercase tracking-[1.5px]">
              ASSIGNED EVM WALLET
            </span>
            <span className="text-base font-bold text-[#efe7d6] tracking-wider font-mono">
              {shortenedWallet}
            </span>
          </div>

          {/* Vintage Punchcard Waveform */}
          <div className="py-1 flex items-center justify-between gap-1 h-10 border-y-2 border-[#3c2c1c]">
            {barcodePills.map((pill, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-sm ${pill.h} ${pill.bg}`}
              ></div>
            ))}
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-center text-[10px] font-bold text-[#a89782] uppercase tracking-wider">
            <span>ROBINHOOD CHAIN &bull; 3,333 ED.</span>
            <span className="text-[#c05810] font-bold">X.COM/CALCULOGRAPH</span>
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
          className="calctrons-btn-phosphor py-3.5 px-4 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          {downloading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>SAVING...</span>
            </>
          ) : (
            <>
              <Download size={15} />
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
          className="calctrons-btn py-3.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
        >
          <Share2 size={15} />
          <span>SHARE ON X</span>
        </a>

      </div>

      {/* ===================== REFERRAL LINK BOX ===================== */}
      <div className="p-5 bg-[#e3d8c0] border-2 border-[#3c2c1c] text-left space-y-3 shadow-[3px_4px_rgba(0,0,0,0.25)]">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-[#3c2c1c] uppercase tracking-[1.5px]">
            YOUR INVITE REFERRAL LINK
          </span>
          <button
            type="button"
            onClick={() => copyToClipboard(data.myRefCode, 'code')}
            className="text-[10px] font-bold text-[#c05810] hover:underline"
          >
            {copiedCode ? 'COPIED CODE!' : `CODE: ${data.myRefCode}`}
          </button>
        </div>

        <div className="flex gap-2">
          <input
            readOnly
            value={data.refLink}
            className="w-full px-3 py-2.5 bg-[#efe7d6] border-2 border-[#3c2c1c] text-[#3c2c1c] font-mono text-xs truncate focus:outline-none"
          />
          <button
            type="button"
            onClick={() => copyToClipboard(data.refLink, 'link')}
            className="calctrons-btn px-4 py-2 text-[10px] whitespace-nowrap flex items-center gap-1"
          >
            <Copy size={12} />
            <span>{copiedLink ? 'COPIED!' : 'COPY'}</span>
          </button>
        </div>

        <p className="text-[11px] text-[#6d5b44] leading-relaxed">
          Every operator who registers through your link secures your priority tier.
        </p>
      </div>

      {/* Reset Button */}
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={onReset}
          className="text-[10px] font-bold text-[#8d7c66] hover:text-[#3c2c1c] uppercase tracking-[1.5px] transition underline"
        >
          [ REGISTER ANOTHER WALLET ]
        </button>
      </div>

    </div>
  );
}
