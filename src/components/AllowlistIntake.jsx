import React, { useState, useEffect } from 'react';
import { Check, Copy, Share2, ArrowRight, Loader2, AlertCircle, ShieldAlert, CheckCircle2, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { registerWhitelistUser, validateInviteCode, checkTwitterExists, checkWalletExists } from '../utils/supabase';
import { fetchTwitterAvatar } from '../utils/avatar';
import { sound } from '../utils/sound';
import AllowlistPass from './AllowlistPass';

export default function AllowlistIntake() {
  const [currentStep, setCurrentStep] = useState(1);
  const [twitterUsername, setTwitterUsername] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteCodeStatus, setInviteCodeStatus] = useState(null);

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
  const [maxStepReached, setMaxStepReached] = useState(1);

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
          setMaxStepReached(3);
          setMissions({
            follow: { completed: true, countdown: 0 },
            repost: { completed: true, countdown: 0 },
            tag: { completed: true, countdown: 0 },
          });
        }
      }
    } catch (e) {}
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

  // Handle Mission Click with 5-second countdown timer
  const handleMissionClick = (missionKey, externalUrl) => {
    // If already verified, clicking anywhere still opens Twitter!
    if (missions[missionKey].completed) {
      try { sound.playClick(); } catch (err) {}
      window.open(externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (missions[missionKey].countdown > 0) return;

    sound.playClick();
    window.open(externalUrl, '_blank', 'noopener,noreferrer');

    let count = 5;
    setMissions((prev) => ({
      ...prev,
      [missionKey]: { ...prev[missionKey], countdown: count },
    }));

    const interval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(interval);
        try { sound.playSuccess(); } catch (err) {}
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

  // Step 1: Validate identity, check Twitter duplicate and advance to missions
  const handleStep1Submit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');
    try { sound.playClick(); } catch (err) {}

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
    if (!/^[a-zA-Z0-9_]{1,30}$/.test(handleBody)) {
      setErrorMsg('X (Twitter) handle must only contain Latin letters (a-z, A-Z), numbers, and underscores (_).');
      return;
    }

    // Check if this Twitter account is already registered in DB
    const isTwitterTaken = await checkTwitterExists(cleanTwitter);
    if (isTwitterTaken) {
      setErrorMsg(`The X account ${cleanTwitter} is already registered on the Allowlist!`);
      return;
    }

    try { sound.playSuccess(); } catch (err) {}
    setMaxStepReached((prev) => Math.max(prev, 2));
    setCurrentStep(2);
  };

  // Step 2 Proceed to Wallet
  const handleStep2Proceed = () => {
    if (!allMissionsDone) {
      setErrorMsg('Please complete all 3 missions before proceeding.');
      return;
    }
    try { sound.playSuccess(); } catch (err) {}
    setErrorMsg('');
    setMaxStepReached((prev) => Math.max(prev, 3));
    setCurrentStep(3);
  };

  // Step 3: Final Submission & Database Registration
  const handleStep3Submit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    sound.playClick();

    const cleanWallet = walletAddress.trim().toLowerCase();

    if (!/^0x[a-fA-F0-9]{40}$/.test(cleanWallet)) {
      setErrorMsg('Invalid EVM wallet address. Must start with 0x and be 42 characters.');
      return;
    }

    setSubmitting(true);

    // Strict duplicate checks
    const isTwitterTaken = await checkTwitterExists(twitterUsername);
    if (isTwitterTaken) {
      setSubmitting(false);
      setErrorMsg(`The X account ${twitterUsername} is already registered on the Allowlist!`);
      return;
    }

    const isWalletTaken = await checkWalletExists(cleanWallet);
    if (isWalletTaken) {
      setSubmitting(false);
      setErrorMsg(`The wallet ${cleanWallet.slice(0, 6)}...${cleanWallet.slice(-4)} is already registered on the Allowlist!`);
      return;
    }

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
        colors: ['#c05810', '#46e35f', '#f2c14b', '#3c2c1c', '#efe7d6'],
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
    <div className="py-10 px-4 sm:px-6 max-w-[640px] w-full mx-auto space-y-8 font-mono">
      
      {/* Section Header */}
      <div className="text-center space-y-2">
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#c05810]">
          The Adding Room &bull; Phase 1
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-[4px] uppercase text-[#efe7d6]">
          CALCULOGRAPH
        </h1>
        <p className="text-xs text-[#8d7c66] max-w-md mx-auto leading-relaxed">
          3,333 calculating machines on Robinhood Chain. Complete 3 verification steps to secure your permanent ledger pass.
        </p>
      </div>

      {/* Step Tabs: Physical Mechanical Toggle Buttons */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded bg-[#221b12] border-2 border-[#3c2c1c] text-center font-bold text-[10px] sm:text-xs select-none shadow-[3px_4px_rgba(0,0,0,0.3)]">
        
        {/* Tab 1 */}
        <button
          type="button"
          onClick={() => {
            if (completedData) return;
            sound.playClick();
            setCurrentStep(1);
          }}
          className={`py-2.5 px-1 border-2 transition-all uppercase tracking-wider ${
            completedData || currentStep === 1
              ? 'bg-[#c05810] text-[#efe7d6] border-[#3c2c1c] shadow-[2px_2px_rgba(0,0,0,0.3)]'
              : currentStep > 1
              ? 'bg-[#e3d8c0] text-[#3c2c1c] border-[#3c2c1c] cursor-pointer'
              : 'border-transparent text-[#8d7c66]'
          }`}
        >
          {completedData ? '01 IDENTITY ✓' : '01 IDENTITY'}
        </button>

        {/* Tab 2: Unlocked and styled cream whenever Step 1 has been cleared */}
        <button
          type="button"
          onClick={async () => {
            if (completedData) return;
            if (maxStepReached >= 2 || allMissionsDone) {
              sound.playClick();
              setCurrentStep(2);
            } else if (currentStep === 1) {
              await handleStep1Submit();
            }
          }}
          className={`py-2.5 px-1 border-2 transition-all uppercase tracking-wider ${
            completedData || currentStep === 2
              ? 'bg-[#c05810] text-[#efe7d6] border-[#3c2c1c] shadow-[2px_2px_rgba(0,0,0,0.3)]'
              : maxStepReached >= 2 || allMissionsDone
              ? 'bg-[#e3d8c0] text-[#3c2c1c] border-[#3c2c1c] cursor-pointer'
              : 'border-transparent text-[#6d5b44] cursor-not-allowed opacity-50'
          }`}
        >
          {completedData ? '02 MISSIONS ✓' : '02 MISSIONS'}
        </button>

        {/* Tab 3: Unlocked and styled cream when missions are cleared */}
        <button
          type="button"
          disabled={!completedData && !allMissionsDone && maxStepReached < 3}
          onClick={() => {
            if (completedData || allMissionsDone || maxStepReached >= 3) {
              sound.playClick();
              setCurrentStep(3);
            }
          }}
          className={`py-2.5 px-1 border-2 transition-all uppercase tracking-wider ${
            completedData || currentStep === 3
              ? 'bg-[#c05810] text-[#efe7d6] border-[#3c2c1c] shadow-[2px_2px_rgba(0,0,0,0.3)]'
              : allMissionsDone || maxStepReached >= 3
              ? 'bg-[#e3d8c0] text-[#3c2c1c] border-[#3c2c1c] cursor-pointer'
              : 'border-transparent text-[#6d5b44] cursor-not-allowed opacity-50'
          }`}
        >
          {completedData ? '03 WALLET ✓' : '03 WALLET'}
        </button>

      </div>

      {/* Main Form Container: Calctrons Vintage Paper Panel */}
      <div className="calctrons-panel p-6 sm:p-8 space-y-6">
        
        {/* ===================== STEP 1: 01 IDENTITY ===================== */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-5 animate-in fade-in duration-150">
            
            <div className="border-b-2 border-[#d6c9ab] pb-2.5 flex justify-between items-baseline">
              <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#c05810]">
                DESK CLEARANCE FORM
              </span>
              <span className="text-[10px] text-[#8d7c66] uppercase tracking-wider">
                ENTRY REQUIRED
              </span>
            </div>

            {/* X Username Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#3c2c1c] uppercase tracking-[1.5px]">
                X USERNAME (TWITTER)
              </label>
              <input
                type="text"
                required
                value={twitterUsername}
                onChange={(e) => {
                  const latinOnly = e.target.value.replace(/[^a-zA-Z0-9_@]/g, '');
                  setTwitterUsername(latinOnly);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="@username"
                className="w-full px-4 py-3 bg-[#e3d8c0] border-2 border-[#3c2c1c] text-[#3c2c1c] font-mono text-sm font-bold focus:outline-none focus:bg-[#efe7d6] focus:border-[#c05810] transition placeholder:text-[#8d7c66]"
              />
            </div>

            {/* Live Twitter Avatar Preview Card */}
            {twitterUsername.replace('@', '').length >= 2 && (
              <div className="w-full p-2.5 bg-[#e3d8c0] border-2 border-[#3c2c1c] flex items-center gap-3 shadow-[2px_2px_rgba(0,0,0,0.15)] animate-in fade-in duration-150">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#3c2c1c] flex-shrink-0 bg-[#d6c9ab] flex items-center justify-center">
                  {avatarLoading ? (
                    <Loader2 size={15} className="text-[#c05810] animate-spin" />
                  ) : avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={twitterUsername}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarUrl(null)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={16} className="text-[#6d5b44]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#3c2c1c] truncate">
                      {twitterUsername.startsWith('@') ? twitterUsername : `@${twitterUsername}`}
                    </span>
                    <span className="px-1.5 py-0.5 border border-[#1f6b30] bg-[#d6f8dc] text-[#1f6b30] text-[8px] font-bold uppercase">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-[10px] text-[#6d5b44]">
                    Verified Operator Account
                  </div>
                </div>
              </div>
            )}

            {/* Invite Code Field (Optional) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-[#3c2c1c] uppercase tracking-[1.5px]">
                  INVITE CODE <span className="text-[#8d7c66] font-normal text-[10px]">(OPTIONAL)</span>
                </label>
                {inviteCodeStatus?.valid && inviteCode.trim() && (
                  <span className="text-[10px] font-bold text-[#1f6b30] flex items-center gap-1">
                    <Check size={12} /> VALID CODE
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
                placeholder="OPTIONAL (E.G. GENESIS, CALC)"
                className="w-full px-4 py-3 bg-[#e3d8c0] border-2 border-[#3c2c1c] text-[#3c2c1c] font-mono text-sm font-bold focus:outline-none focus:bg-[#efe7d6] focus:border-[#c05810] transition placeholder:text-[#8d7c66] uppercase tracking-wider"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="w-full p-2.5 bg-[#fee2e2] border-2 border-[#dc2626] text-[#991b1b] text-xs font-bold flex items-center gap-2 animate-in fade-in duration-100">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              className="calctrons-btn w-full py-3.5 px-6 text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>ENTER THE PROTOCOL &rarr;</span>
            </button>
          </form>
        )}

        {/* ===================== STEP 2: 02 MISSIONS ===================== */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b-2 border-[#d6c9ab] pb-3 flex justify-between items-baseline">
              <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#c05810]">
                MEMORIZATION CLEARANCE
              </span>
              <span className={`text-[10px] font-bold uppercase ${allMissionsDone ? 'text-[#1f6b30]' : 'text-[#b45309]'}`}>
                {completedMissionsCount} / 3 TASKS COMPLETED
              </span>
            </div>

            {/* Mission 1 */}
            <div
              onClick={() => handleMissionClick('follow', 'https://twitter.com/intent/follow?screen_name=Calculograph')}
              className={`p-4 border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                missions.follow.completed
                  ? 'bg-[#d6f8dc] border-[#1f6b30] text-[#17130e] hover:bg-[#c2f2cb] active:scale-[0.99]'
                  : 'bg-[#e3d8c0] border-[#3c2c1c] hover:bg-[#d6c9ab]'
              }`}
            >
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="text-xs font-bold text-[#3c2c1c]">
                  1. Follow @Calculograph on X
                </div>
                <div className="text-[11px] text-[#6d5b44]">
                  Synchronize with precision engine announcements
                </div>
              </div>

              <div className="flex-shrink-0">
                {missions.follow.completed ? (
                  <span className="px-3 py-1.5 border-2 border-[#1f6b30] bg-[#46e35f] text-[#17130e] text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <Check size={12} className="stroke-[3]" /> VERIFIED
                  </span>
                ) : missions.follow.countdown > 0 ? (
                  <span className="px-3 py-1.5 border-2 border-[#b45309] bg-[#fef3c7] text-[#92400e] text-[10px] font-bold animate-pulse">
                    VERIFYING {missions.follow.countdown}S...
                  </span>
                ) : (
                  <span className="calctrons-btn py-1.5 px-3 text-[10px]">
                    START &rarr;
                  </span>
                )}
              </div>
            </div>

            {/* Mission 2 */}
            <div
              onClick={() => handleMissionClick('repost', 'https://x.com/Calculograph')}
              className={`p-4 border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                missions.repost.completed
                  ? 'bg-[#d6f8dc] border-[#1f6b30] text-[#17130e] hover:bg-[#c2f2cb] active:scale-[0.99]'
                  : 'bg-[#e3d8c0] border-[#3c2c1c] hover:bg-[#d6c9ab]'
              }`}
            >
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="text-xs font-bold text-[#3c2c1c]">
                  2. Like & Repost Genesis Machine Post
                </div>
                <div className="text-[11px] text-[#6d5b44]">
                  Broadcast the 4,444 calculating machines dynasty
                </div>
              </div>

              <div className="flex-shrink-0">
                {missions.repost.completed ? (
                  <span className="px-3 py-1.5 border-2 border-[#1f6b30] bg-[#46e35f] text-[#17130e] text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <Check size={12} className="stroke-[3]" /> VERIFIED
                  </span>
                ) : missions.repost.countdown > 0 ? (
                  <span className="px-3 py-1.5 border-2 border-[#b45309] bg-[#fef3c7] text-[#92400e] text-[10px] font-bold animate-pulse">
                    VERIFYING {missions.repost.countdown}S...
                  </span>
                ) : (
                  <span className="calctrons-btn py-1.5 px-3 text-[10px]">
                    START &rarr;
                  </span>
                )}
              </div>
            </div>

            {/* Mission 3 */}
            <div
              onClick={() => handleMissionClick('tag', `https://twitter.com/intent/tweet?text=${encodeURIComponent('Securing my Genesis clearance on the @Calculograph desk! ⏳⚡\n\nTagging 2 operators: @ @\n\n#Calculograph')}`)}
              className={`p-4 border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                missions.tag.completed
                  ? 'bg-[#d6f8dc] border-[#1f6b30] text-[#17130e] hover:bg-[#c2f2cb] active:scale-[0.99]'
                  : 'bg-[#e3d8c0] border-[#3c2c1c] hover:bg-[#d6c9ab]'
              }`}
            >
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="text-xs font-bold text-[#3c2c1c]">
                  3. Tag 2 Operators with #Calculograph
                </div>
                <div className="text-[11px] text-[#6d5b44]">
                  Signal the floor and lock your priority allocation
                </div>
              </div>

              <div className="flex-shrink-0">
                {missions.tag.completed ? (
                  <span className="px-3 py-1.5 border-2 border-[#1f6b30] bg-[#46e35f] text-[#17130e] text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <Check size={12} className="stroke-[3]" /> VERIFIED
                  </span>
                ) : missions.tag.countdown > 0 ? (
                  <span className="px-3 py-1.5 border-2 border-[#b45309] bg-[#fef3c7] text-[#92400e] text-[10px] font-bold animate-pulse">
                    VERIFYING {missions.tag.countdown}S...
                  </span>
                ) : (
                  <span className="calctrons-btn py-1.5 px-3 text-[10px]">
                    START &rarr;
                  </span>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-[#fee2e2] border-2 border-[#dc2626] text-[#991b1b] text-xs font-bold flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Strict Proceed Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStep2Proceed}
                disabled={!allMissionsDone}
                className={`w-full py-4 px-6 text-sm font-bold uppercase tracking-wider transition-all duration-100 ${
                  allMissionsDone
                    ? 'calctrons-btn cursor-pointer'
                    : 'bg-[#d6c9ab] border-2 border-[#8d7c66] text-[#6d5b44] cursor-not-allowed opacity-60'
                }`}
              >
                {allMissionsDone ? (
                  <span>PROCEED TO WALLET &rarr;</span>
                ) : (
                  <span>COMPLETE ALL 3 TASKS ({completedMissionsCount}/3)</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ===================== STEP 3: 03 WALLET ===================== */}
        {currentStep === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b-2 border-[#d6c9ab] pb-3 flex justify-between items-baseline">
              <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#c05810]">
                WALLET RECORDING
              </span>
              <span className="text-[10px] font-bold text-[#1f6b30]">
                3/3 TASKS CLEARED ✓
              </span>
            </div>

            {/* Summary card */}
            <div className="p-4 bg-[#e3d8c0] border-2 border-[#3c2c1c] space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#6d5b44]">Operator:</span>
                <span className="text-[#3c2c1c]">{twitterUsername}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#6d5b44]">Clearance:</span>
                <span className="text-[#c05810]">GUARANTEED SPOT APPROVED</span>
              </div>
            </div>

            {/* Wallet Address input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#3c2c1c] uppercase tracking-[1.5px]">
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
                className="w-full px-4 py-3.5 bg-[#e3d8c0] border-2 border-[#3c2c1c] text-[#3c2c1c] font-mono text-sm font-bold focus:outline-none focus:bg-[#efe7d6] focus:border-[#c05810] transition placeholder:text-[#8d7c66]"
              />
              <p className="text-[11px] text-[#6d5b44]">
                Make sure this wallet is non-custodial (MetaMask, Rabby, Coinbase Wallet, etc.)
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-[#fee2e2] border-2 border-[#dc2626] text-[#991b1b] text-xs font-bold flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="calctrons-btn w-full py-4 px-6 text-sm flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>RECORDING ON LEDGER...</span>
                </>
              ) : (
                <span>MEMORIZE ENTRY ON DESK &rarr;</span>
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
