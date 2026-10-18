import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface PreloaderProps {
  onFinish?: () => void;
  language?: string;
  isTriggered?: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({
  onFinish,
  language = 'English',
  isTriggered = false,
}) => {
  const isSwahili = language === 'Swahili';
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Status milestones based on percentage
  const getStatusText = (pct: number) => {
    if (pct < 25) {
      return isSwahili
        ? 'Kuanzisha Mfumo wa Kidijitali wa Ev Dr. Boniphace J. Ndege...'
        : 'Initializing Ev Dr. Boniphace J. Ndege Creator Ecosystem...';
    } else if (pct < 50) {
      return isSwahili
        ? 'Kusawazisha Soko la Global Shopping na Bidhaa...'
        : 'Synchronizing Global Shopping Marketplace & Catalog...';
    } else if (pct < 75) {
      return isSwahili
        ? 'Kupakia Video za HD, Vitabu na Mafunzo...'
        : 'Loading HD Videos, Masterclasses & Author Vault...';
    } else if (pct < 95) {
      return isSwahili
        ? 'Kulinda Hifadhi ya Nje ya Mtandao (Cache API)...'
        : 'Securing Offline Data Persistence & Cache API...';
    } else {
      return isSwahili ? 'Tayari! Karibu kwenye Mfumo.' : 'Ready! Welcome to the Hub.';
    }
  };

  useEffect(() => {
    setProgress(0);
    setIsFadingOut(false);
    setIsDone(false);

    const startTime = Date.now();
    const duration = 1800; // 1.8s for smooth, fast yet luxurious loading

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            setIsDone(true);
            onFinish?.();
          }, 450);
        }, 250);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isTriggered]);

  const handleSkip = () => {
    setProgress(100);
    setIsFadingOut(true);
    setTimeout(() => {
      setIsDone(true);
      onFinish?.();
    }, 200);
  };

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030e07] text-white transition-all duration-500 overflow-hidden select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-live="polite"
      aria-label="Loading application"
    >
      {/* Background ambient lighting halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] bg-emerald-600/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] bg-[#ffd700]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle fine mesh background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#00a651_1px,transparent_1px)] [background-size:24px_24px]"
      />

      <div className="relative z-10 flex flex-col items-center max-w-sm sm:max-w-md w-full px-6 text-center">
        {/* Emblem & Animated Rings Container */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer Rotating Emerald & Gold Gradient Orbit Ring */}
          <div className="absolute -inset-4 sm:-inset-5 rounded-full border-2 border-transparent border-t-[#ffd700] border-r-emerald-500/70 animate-spin [animation-duration:3s]" />
          <div className="absolute -inset-7 sm:-inset-8 rounded-full border border-emerald-500/20 border-b-[#ffd700]/60 animate-spin [animation-duration:5s] [animation-direction:reverse]" />

          {/* Glowing Aura Ring */}
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-[#00a651]/40 via-[#ffd700]/30 to-[#087a45]/40 blur-md animate-pulse" />

          {/* Central Luxury Monogram Box */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#072415] via-[#04160c] to-[#010905] border-2 border-[#ffd700]/70 shadow-[0_0_35px_rgba(5,150,105,0.45)] flex flex-col items-center justify-center">
            <span className="font-editorial font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-br from-[#ffe566] via-[#ffd700] to-[#d4af37] tracking-wider drop-shadow-[0_2px_10px_rgba(255,215,0,0.4)]">
              BN
            </span>
            <span className="text-[9px] font-bold text-emerald-400/90 tracking-widest uppercase mt-0.5">
              {isSwahili ? 'Kituo cha Muundaji' : 'Creator Hub'}
            </span>
          </div>
        </div>

        {/* Brand Name Title */}
        <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight font-editorial">
          Ev Dr. Boniphace J. Ndege
        </h1>
        <p className="text-xs sm:text-sm text-emerald-300/80 font-medium mt-1">
          {isSwahili
            ? 'Soko la Dunia · Maudhui · Jamii'
            : 'Global Shopping · Media · Community'}
        </p>

        {/* Progress Bar with Liquid Gold Shimmer */}
        <div className="w-full mt-8 mb-4">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-300/80 mb-2">
            <span className="text-[11px] font-medium text-emerald-200/90 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ffd700]" />
              {progress < 100 ? (isSwahili ? 'Inapakia...' : 'Loading...') : (isSwahili ? 'Imekamilika' : 'Completed')}
            </span>
            <span className="font-bold text-white text-sm">
              {progress}%
            </span>
          </div>

          <div className="relative w-full h-2 bg-emerald-950/70 border border-emerald-500/30 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00a651] via-[#ffd700] to-[#ffe566] transition-all duration-75 ease-out shadow-[0_0_14px_rgba(255,215,0,0.6)] relative"
              style={{ width: `${progress}%` }}
            >
              {/* Highlight head */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_white]" />
            </div>
          </div>
        </div>

        {/* Dynamic Status Caption */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-xs text-slate-400 font-medium animate-pulse flex items-center gap-1.5">
            {progress >= 100 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            <span>{getStatusText(progress)}</span>
          </p>
        </div>

        {/* Quick Skip Control for Accessibility */}
        <button
          type="button"
          onClick={handleSkip}
          className="mt-6 text-[11px] text-slate-500 hover:text-emerald-300 font-medium tracking-wide transition-colors flex items-center gap-1 cursor-pointer py-1 px-3 rounded-lg hover:bg-emerald-950/40"
        >
          <span>{isSwahili ? 'Ruka moja kwa moja' : 'Enter directly'}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Bottom Security / Copyright Tag */}
      <div className="absolute bottom-5 text-[10px] text-emerald-500/50 font-mono tracking-wider">
        SECURE CLOUD ENGINE · EAST AFRICA ECOSYSTEM
      </div>
    </div>
  );
};
