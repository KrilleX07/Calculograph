import React, { useState, useEffect } from 'react';
import { Check, Copy, Share2, ExternalLink, ArrowRight, Loader2, Sparkles, AlertCircle, ShieldAlert, CheckCircle2, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { registerWhitelistUser, validateInviteCode, checkTwitterExists, checkWalletExists } from '../utils/supabase';
import { fetchTwitterAvatar } from '../utils/avatar';
import { sound } from '../utils/sound';
import AllowlistPass from './AllowlistPass';

export default function AllowlistIntake() {
  const [currentStep, setCurrentStep] = useState(1);
  const [twitterUsername, setTwitterUsername] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [validatingCode, setValidatingCode] = useState(false);
  const [inviteCodeStatus, setInviteCodeStatus] = useState(null); // { valid: true/false, message }

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // 3 Missions state tracking
  const [missions, setMissions] = useState({
    follow: { completed: false, countdown: 0 },
    repost: { completed: false, countdown: 0 },
    tag: { completed: false, countdown: 0 },
  });

  const [walletAddress, setWalletAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedData, setCompletedData] = useState(null);

  // Debounced real Twitter avatar lookup
  useEffect(() => {
    const clean = twitterUsername.replace('@', '').trim();
    if (clean.length >= 2) {
      setAvatarLoading(true);
      const timer = setTimeout(() => {
        fetchTwitterAvatar(clean).then((url) => {
          setAvatarUrl(url);
          setAvatarLoading(false);
        });
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAvatarUrl(null);
      setAvatarLoading(false);
    }
  }, [twitterUsername]);

  // Restore completed state from localStorage on page reload
  useEffect(() => {
    try {
      const saved = localStorage.getItem('calculograph_registered_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.wallet && parsed?.twitter && parsed?.myRefCode) {
          setCompletedData(parsed);
          setTwitterUsername(parsed.twitter);
          setWalletAddress(parsed.wallet);
          setMissions({
            follow: { completed: true, countdown: 0 },
            repost: { completed: true, countdown: 0 },
            tag: { completed: true, countdown: 0 },
          });
          setCurrentStep(4);
        }
      }
    } catch (e) {
      console.warn('LocalStorage restore notice:', e);
    }
  }, []);

  // Auto-read ?ref=XYZ parameter from URL on load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref');
      if (refParam) {
        setInviteCode(refParam.toUpperCase());
        validateInviteCode(refParam.toUpperCase()).then((res) => {
          setInviteCodeStatus(res);
        });
      }
    } catch (e) {
      console.warn('URL param parse notice:', e);
    }
  }, []);

  // Countdown timer handler for missions
  const handleMissionClick = (missionKey, externalUrl) => {
    sound.playClick();
    window.open(externalUrl, '_blank', 'noopener,noreferrer');

    if (missions[missionKey].completed) return;

    let count = 5;
    setMissions((prev) => ({
      ...prev,
      [missionKey]: { ...prev[missionKey], countdown: count },
    }));

    const interval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(interval);
        sound.playCash();
        setMissions((prev) => ({
          ...prev,
          [missionKey]: { completed: true, countdown: 0 },
        }));
      } else {
        setMissions((prev) => ({
          ...prev,
          [missionKey]: { ...prev[missionKey], countdown: count },
        }));
      }
    }, 1000);
  };

  const completedMissionsCount = Object.values(missions).filter((m) => m.completed).length;
  const allMissionsDone = completedMissionsCount === 3;

  // Step 1: Validate identity, check Twitter duplicate and referral code
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    sound.playClick();

    let cleanTwitter = twitterUsername.trim();
    if (!cleanTwitter) {
      setErrorMsg('Please enter your X username.');
      return;
    }
    if (!cleanTwitter.startsWith('@')) {
      cleanTwitter = `@${cleanTwitter}`;
      setTwitterUsername(cleanTwitter);
    }

    const handleBody = cleanTwitter.slice(1);
    // Strict Latin-only alphanumeric + underscore check (no Cyrillic, no special chars)
    if (!/^[a-zA-Z0-9_]{1,30}$/.test(handleBody)) {
      setErrorMsg('X (Twitter) handle must only contain Latin letters (a-z, A-Z), numbers, and underscores (_).');
      return;
    }

    setValidatingCode(true);

    // Check if X handle is already registered in Supabase
    const isTwitterTaken = await checkTwitterExists(cleanTwitter);
    if (isTwitterTaken) {
      setValidatingCode(false);
      setErrorMsg(`The X account ${cleanTwitter} is already registered on the Allowlist!`);
      return;
    }

    // Validate invite code if entered
    if (inviteCode && inviteCode.trim()) {
      const codeCheck = await validateInviteCode(inviteCode.trim());
      setInviteCodeStatus(codeCheck);

      if (!codeCheck.valid) {
        setValidatingCode(false);
        setErrorMsg(codeCheck.message || 'Invalid invite code.');
        return;
      }
    }

    setValidatingCode(false);
    sound.playSuccess();
    setCurrentStep(2);
  };

  // Step 2 Proceed to Wallet (Hard locked until 3/3 missions)
  const handleStep2Proceed = () => {
    if (!allMissionsDone) {
      setErrorMsg('Please complete all 3 missions before proceeding.');
      return;
    }
    sound.playSuccess();
    setErrorMsg('');
    setCurrentStep(3);
  };

  // Step 3: Final Submission & Database Registration
  const handleStep3Submit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    sound.playClick();

    const cleanWallet = walletAddress.trim().toLowerCase();

    // Strict EVM address validation (0x + 40 hex characters)
    if (!/^0x[a-fA-F0-9]{40}$/.test(cleanWallet)) {
      setErrorMsg('Invalid EVM wallet address. Must start with 0x and be 42 characters.');
      return;
    }

    setSubmitting(true);

    // Pre-flight check: wallet duplicate
    const isWalletTaken = await checkWalletExists(cleanWallet);
    if (isWalletTaken) {
      setSubmitting(false);
      setErrorMsg(`The wallet ${cleanWallet.slice(0, 6)}...${cleanWallet.slice(-4)} is already registered on the Allowlist!`);
      return;
    }

    // Generate unique referral code for this user
    const usernameSlug = twitterUsername.replace('@', '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'CALC';
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const myRefCode = `${usernameSlug}-${randomSuffix}`;

    try {
      const res = await registerWhitelistUser({
        wallet: cleanWallet,
        twitter: twitterUsername,
        inviteCode: inviteCode || null,
        myRefCode,
      });

      if (!res.success) {
        setSubmitting(false);
        setErrorMsg(res.message || 'Registration failed.');
        return;
      }

      sound.playMythicReveal();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#00F58C', '#00E5FF', '#A855F7', '#FFD700', '#FFFFFF'],
      });

      const savedData = {
        twitter: twitterUsername,
        wallet: cleanWallet,
        myRefCode,
        avatarUrl: avatarUrl || `https://unavatar.io/x/${twitterUsername.replace('@', '')}`,
        spotNumber: res.spotNumber || '0001',
        inviteUsed: inviteCode || 'NONE',
        refLink: `${window.location.origin}/?ref=${myRefCode}`,
      };

      try {
        localStorage.setItem('calculograph_registered_user', JSON.stringify(savedData));
      } catch (e) {
        console.warn('LocalStorage save notice:', e);
      }

      setCompletedData(savedData);
      setCurrentStep(4);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    sound.playClick();
    try {
      localStorage.removeItem('calculograph_registered_user');
    } catch (e) {}
    setCompletedData(null);
    setTwitterUsername('');
    setWalletAddress('');
    setInviteCode('');
    setInviteCodeStatus(null);
    setMissions({
      follow: { completed: false, countdown: 0 },
      repost: { completed: false, countdown: 0 },
      tag: { completed: false, countdown: 0 },
    });
    setCurrentStep(1);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-10">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="font-pixel text-[10px] sm:text-xs text-[#00E5FF] tracking-widest uppercase flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F58C] animate-pulse"></span>
          CALCULOGRAPH GENESIS
        </div>
        <h1 className="font-pixel text-2xl sm:text-4xl text-[#00F58C] tracking-wide uppercase text-neon-green">
          ALLOWLIST INTAKE
        </h1>
      </div>

      {/* Step Tabs Pills Container with strict progression */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 rounded-xl bg-[#05070B] border border-[#1E293B] font-pixel text-[9px] sm:text-xs text-center select-none">
        
        {/* Tab 1 */}
        <button
          type="button"
          onClick={() => {
            if (completedData) return;
            sound.playClick();
            setCurrentStep(1);
          }}
          className={`py-3 px-2 rounded-lg border transition-all ${
            completedData || currentStep === 1
              ? 'border-[#00F58C] text-[#00F58C] bg-[#00F58C]/10 shadow-sm shadow-[#00F58C]/20'
              : currentStep > 1
              ? 'border-[#00F58C]/40 text-[#00F58C] bg-transparent cursor-pointer'
              : 'border-transparent text-slate-500'
          }`}
        >
          {completedData ? '01 IDENTITY ✓' : '01 IDENTITY'}
        </button>

        {/* Tab 2 */}
        <button
          type="button"
          disabled={!twitterUsername && !completedData}
          onClick={() => {
            if (completedData || !twitterUsername) return;
            sound.playClick();
            setCurrentStep(2);
          }}
          className={`py-3 px-2 rounded-lg border transition-all ${
            completedData || currentStep === 2
              ? 'border-[#00F58C] text-[#00F58C] bg-[#00F58C]/10 shadow-sm shadow-[#00F58C]/20'
              : allMissionsDone || currentStep > 2
              ? 'border-[#00F58C]/40 text-[#00F58C] bg-transparent cursor-pointer'
              : 'border-transparent text-slate-600 cursor-not-allowed'
          }`}
        >
          {completedData ? '02 MISSIONS ✓' : '02 MISSIONS'}
        </button>

        {/* Tab 3 */}
        <button
          type="button"
          disabled={!allMissionsDone && !completedData}
          onClick={() => {
            if (completedData || !allMissionsDone) return;
            sound.playClick();
            setCurrentStep(3);
          }}
          className={`py-3 px-2 rounded-lg border transition-all ${
            completedData || currentStep === 3
              ? 'border-[#00F58C] text-[#00F58C] bg-[#00F58C]/10 shadow-sm shadow-[#00F58C]/20'
              : currentStep > 3
              ? 'border-[#00F58C]/40 text-[#00F58C] bg-transparent'
              : allMissionsDone && currentStep > 1
              ? 'border-transparent text-slate-400 hover:text-white cursor-pointer'
              : 'border-transparent text-slate-600 cursor-not-allowed opacity-50'
          }`}
        >
          {completedData ? '03 WALLET ✓' : '03 WALLET'}
        </button>

      </div>

      {/* Main Terminal Box Container */}
      <div className="rounded-2xl p-6 sm:p-8 bg-[#080C14] border border-[#1E293B] shadow-2xl space-y-6">
        
        {/* ===================== STEP 1: 01 IDENTITY ===================== */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-6 animate-in fade-in duration-200">
            <div className="font-pixel text-[10px] text-slate-400 tracking-wider uppercase">
              DESK ACCESS REQUEST
            </div>

            {/* X Username Field */}
            <div className="space-y-2">
              <label className="block font-pixel text-[10px] text-slate-300 uppercase tracking-wider">
                X USERNAME
              </label>
              <input
                type="text"
                required
                value={twitterUsername}
                onChange={(e) => {
                  // Only allow Latin characters, digits, underscore and @
                  const latinOnly = e.target.value.replace(/[^a-zA-Z0-9_@]/g, '');
                  setTwitterUsername(latinOnly);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="@username"
                className="w-full px-4 py-4 rounded-xl bg-[#04060A] border border-[#1E293B] text-white font-mono text-sm focus:outline-none focus:border-[#00F58C] transition placeholder:text-slate-600"
              />
            </div>

            {/* Live Twitter Avatar Preview Card */}
            {twitterUsername.replace('@', '').length >= 2 && (
              <div className="p-3 rounded-xl bg-[#04060A] border border-[#1E293B] flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#00F58C]/40 flex-shrink-0 bg-[#0e1626] flex items-center justify-center">
                  {avatarLoading ? (
                    <Loader2 size={16} className="text-[#00F58C] animate-spin" />
                  ) : avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={twitterUsername}
                      onError={() => setAvatarUrl(null)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={18} className="text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm font-bold text-white truncate">
                      {twitterUsername.startsWith('@') ? twitterUsername : `@${twitterUsername}`}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#00F58C]/20 text-[#00F58C] font-pixel">
                      VERIFIED
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Live Twitter Profile Detected
                  </div>
                </div>
              </div>
            )}

            {/* Invite Code Field (Optional) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block font-pixel text-[10px] text-slate-300 uppercase tracking-wider">
                  INVITE CODE <span className="text-slate-500 font-mono text-[9px]">(OPTIONAL)</span>
                </label>
                {inviteCodeStatus?.valid && inviteCode.trim() && (
                  <span className="font-pixel text-[9px] text-[#00F58C] flex items-center gap-1">
                    <Check size={11} /> VALID CODE
                  </span>
                )}
              </div>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => {
                  const latinCode = e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
                  setInviteCode(latinCode);
                  setInviteCodeStatus(null);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="optional (e.g. GENESIS, CALC)"
                className="w-full px-4 py-4 rounded-xl bg-[#04060A] border border-[#1E293B] text-[#00E5FF] font-mono text-sm focus:outline-none focus:border-[#00F58C] transition placeholder:text-slate-600 uppercase tracking-wider"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={validatingCode}
              className="w-full py-4 px-6 rounded-xl bg-[#00F58C] hover:bg-[#25FF9C] text-black font-pixel text-xs uppercase tracking-widest shadow-lg shadow-[#00F58C]/20 hover:shadow-[#00F58C]/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {validatingCode ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>[ VERIFYING CODE... ]</span>
                </>
              ) : (
                <span>[ ENTER THE FLOOR ]</span>
              )}
            </button>
          </form>
        )}

        {/* ===================== STEP 2: 02 MISSIONS ===================== */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center">
              <span className="font-pixel text-[10px] text-slate-400 tracking-wider uppercase">
                DESK CLEARANCE PROTOCOL
              </span>
              <span className={`font-pixel text-[10px] font-bold ${allMissionsDone ? 'text-[#00F58C]' : 'text-amber-400'}`}>
                {completedMissionsCount} / 3 COMPLETED
              </span>
            </div>

            {/* Mission 1: Follow on X (Direct Follow Intent) */}
            <div
              onClick={() => handleMissionClick('follow', 'https://twitter.com/intent/follow?screen_name=Calculograph')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                missions.follow.completed
                  ? 'bg-[#00F58C]/10 border-[#00F58C]'
                  : 'bg-[#04060A] border-[#1E293B] hover:border-slate-400'
              }`}
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="font-pixel text-[11px] text-white">
                  1. Follow @Calculograph on X
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  Synchronize with official precision calculations & releases
                </div>
              </div>

              <div className="flex-shrink-0">
                {missions.follow.completed ? (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-[#00F58C] text-black font-pixel text-[9px] flex items-center justify-center gap-1 shadow-sm whitespace-nowrap">
                    <Check size={12} className="stroke-[3]" /> VERIFIED
                  </span>
                ) : missions.follow.countdown > 0 ? (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-amber-400/20 text-amber-300 font-pixel text-[9px] border border-amber-400/50 flex items-center justify-center gap-1 whitespace-nowrap animate-pulse">
                    VERIFYING {missions.follow.countdown}S...
                  </span>
                ) : (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-pixel text-[9px] border border-white/15 flex items-center justify-center whitespace-nowrap">
                    [ START ]
                  </span>
                )}
              </div>
            </div>

            {/* Mission 2: Like & Repost Announcement */}
            <div
              onClick={() => handleMissionClick('repost', 'https://x.com/Calculograph')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                missions.repost.completed
                  ? 'bg-[#00F58C]/10 border-[#00F58C]'
                  : 'bg-[#04060A] border-[#1E293B] hover:border-slate-400'
              }`}
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="font-pixel text-[11px] text-white">
                  2. Like & Repost Announcement
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  Broadcast the Genesis Precision Clockwork Dynasty
                </div>
              </div>

              <div className="flex-shrink-0">
                {missions.repost.completed ? (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-[#00F58C] text-black font-pixel text-[9px] flex items-center justify-center gap-1 shadow-sm whitespace-nowrap">
                    <Check size={12} className="stroke-[3]" /> VERIFIED
                  </span>
                ) : missions.repost.countdown > 0 ? (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-amber-400/20 text-amber-300 font-pixel text-[9px] border border-amber-400/50 flex items-center justify-center gap-1 whitespace-nowrap animate-pulse">
                    VERIFYING {missions.repost.countdown}S...
                  </span>
                ) : (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-pixel text-[9px] border border-white/15 flex items-center justify-center whitespace-nowrap">
                    [ START ]
                  </span>
                )}
              </div>
            </div>

            {/* Mission 3: Tag 2 Operators / Quote Tweet */}
            <div
              onClick={() => handleMissionClick('tag', `https://twitter.com/intent/tweet?text=${encodeURIComponent('Securing my Genesis clearance on the @Calculograph desk! ⏳⚡\n\nTagging 2 operators: @ @\n\n#Calculograph')}`)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                missions.tag.completed
                  ? 'bg-[#00F58C]/10 border-[#00F58C]'
                  : 'bg-[#04060A] border-[#1E293B] hover:border-slate-400'
              }`}
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="font-pixel text-[11px] text-white">
                  3. Tag 2 Operators with #Calculograph
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  Signal the floor and lock your priority allocation
                </div>
              </div>

              <div className="flex-shrink-0">
                {missions.tag.completed ? (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-[#00F58C] text-black font-pixel text-[9px] flex items-center justify-center gap-1 shadow-sm whitespace-nowrap">
                    <Check size={12} className="stroke-[3]" /> VERIFIED
                  </span>
                ) : missions.tag.countdown > 0 ? (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-amber-400/20 text-amber-300 font-pixel text-[9px] border border-amber-400/50 flex items-center justify-center gap-1 whitespace-nowrap animate-pulse">
                    VERIFYING {missions.tag.countdown}S...
                  </span>
                ) : (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-pixel text-[9px] border border-white/15 flex items-center justify-center whitespace-nowrap">
                    [ START ]
                  </span>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Strict Proceed Button (Locked until 3/3) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStep2Proceed}
                disabled={!allMissionsDone}
                className={`w-full py-4 px-6 rounded-xl font-pixel text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
                  allMissionsDone
                    ? 'bg-[#00F58C] hover:bg-[#25FF9C] text-black shadow-lg shadow-[#00F58C]/20 hover:shadow-[#00F58C]/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                    : 'bg-[#1E293B]/50 border border-white/5 text-slate-500 cursor-not-allowed'
                }`}
              >
                {allMissionsDone ? (
                  <span>[ PROCEED TO WALLET ]</span>
                ) : (
                  <span>[ COMPLETE ALL 3 MISSIONS ({completedMissionsCount}/3) ]</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ===================== STEP 3: 03 WALLET ===================== */}
        {currentStep === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center">
              <span className="font-pixel text-[10px] text-slate-400 tracking-wider uppercase">
                FINAL ALLOCATION DISPATCH
              </span>
              <span className="font-pixel text-[10px] text-[#00F58C]">
                3/3 MISSIONS CLEARED ✓
              </span>
            </div>

            {/* Summary card */}
            <div className="p-4 rounded-xl bg-[#04060A] border border-[#1E293B] space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Operator Identity:</span>
                <span className="text-[#00F58C] font-bold">{twitterUsername}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Desk Clearance:</span>
                <span className="text-[#00E5FF] font-bold">GTD SPOT APPROVED</span>
              </div>
            </div>

            {/* Wallet Address input */}
            <div className="space-y-2">
              <label className="block font-pixel text-[10px] text-slate-300 uppercase tracking-wider">
                EVM WALLET ADDRESS (ROBINHOOD / ETH)
              </label>
              <input
                type="text"
                required
                value={walletAddress}
                onChange={(e) => {
                  setWalletAddress(e.target.value.trim());
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="0x..."
                className="w-full px-4 py-4 rounded-xl bg-[#04060A] border border-[#1E293B] text-white font-mono text-sm focus:outline-none focus:border-[#00F58C] transition placeholder:text-slate-600"
              />
              <p className="font-mono text-[11px] text-slate-500">
                Make sure this wallet is non-custodial (MetaMask, Rabby, Coinbase Wallet, etc.)
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-xl bg-[#00F58C] hover:bg-[#25FF9C] text-black font-pixel text-xs uppercase tracking-widest shadow-lg shadow-[#00F58C]/20 hover:shadow-[#00F58C]/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>[ LOCKING ENTRY ON DESK... ]</span>
                </>
              ) : (
                <span>[ CLAIM CALCULOGRAPH PASS ]</span>
              )}
            </button>
          </form>
        )}

        {/* ===================== STEP 4: ACCESS GRANTED & DIGITAL PASS ===================== */}
        {currentStep === 4 && completedData && (
          <AllowlistPass data={completedData} onReset={handleReset} />
        )}

      </div>

    </div>
  );
}
