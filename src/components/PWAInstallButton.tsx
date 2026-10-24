import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  X,
  Sparkles,
  WifiOff,
  BellRing,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  language?: string;
  variant?: 'topbar' | 'card' | 'badge';
  onShowToast?: (msg: string) => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  language = 'English',
  variant = 'topbar',
  onShowToast,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showPWAModal, setShowPWAModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const isSwahili = language === 'Swahili';

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok && onShowToast) {
        onShowToast(isSwahili ? 'App imesakinishwa kikamilifu!' : 'App installed successfully!');
      }
    } else {
      setShowPWAModal(true);
    }
  };

  const handleCheckUpdates = async () => {
    setIsUpdating(true);
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.update();
        }
      } catch {}
    }
    setTimeout(() => {
      setIsUpdating(false);
      if (onShowToast) {
        onShowToast(
          isSwahili
            ? 'Programu imesasishwa na maudhui yote yameoanishwa!'
            : 'PWA is up to date with latest offline content!'
        );
      }
    }, 1200);
  };

  return (
    <>
      {variant === 'badge' ? (
        <button
          type="button"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#d4af37] text-slate-950 shadow-[0_0_12px_rgba(255,215,0,0.35)] hover:brightness-105 transition-all cursor-pointer active:scale-95"
          title={isSwahili ? 'Sakinisha App ya Kisasa (PWA)' : 'Install Modern PWA App'}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isSwahili ? 'Sakinisha App' : 'Install App'}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowPWAModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 shadow-xs transition-all cursor-pointer active:scale-95"
          title={isSwahili ? 'Vipengele vya App ya Kisasa (PWA)' : 'Modern PWA Features & App Install'}
        >
          {isInstalled ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Download className="w-3.5 h-3.5 text-[#ffd700]" />
          )}
          <span className="hidden sm:inline">
            {isInstalled
              ? isSwahili ? 'PWA Imewezeshwa' : 'PWA Enabled'
              : isSwahili ? 'Sakinisha App' : 'Install App'}
          </span>
        </button>
      )}

      {/* Modern PWA Features & Install Modal */}
      {showPWAModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPWAModal(false);
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-[#06160e] text-white p-6 border-2 border-emerald-500/40 shadow-[0_0_60px_rgba(0,0,0,0.9)] relative space-y-5">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowPWAModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-slate-300 hover:text-white border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffd700] animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-wider text-[#ffd700]">
                  {isSwahili ? 'Teknolojia ya Kisasa ya PWA' : 'Modern Progressive Web App'}
                </span>
              </div>
              <h3 className="text-xl font-black text-white font-editorial">
                {isSwahili
                  ? 'Sakinisha App ya Ev Dr. Boniphace J. Ndege'
                  : 'Install Ev Dr. Boniphace J. Ndege App'}
              </h3>
              <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
                {isSwahili
                  ? 'Pata uzoefu kamili wa simu au kompyuta: usomaji wa nje ya mtandao, upakuaji wa haraka na arifa za moja kwa moja.'
                  : 'Experience native app performance: 100% offline reading, fast load speed, and instant notifications.'}
              </p>
            </div>

            {/* PWA Key Features Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-black/50 border border-emerald-500/30 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-950 text-[#ffd700] shrink-0 border border-emerald-800">
                  <WifiOff className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    {isSwahili ? 'Usomaji wa Vitabu Nje ya Mtandao' : 'Full Offline Reading & Caching'}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {isSwahili
                      ? 'Vitabu na makala zote zilizofunguliwa zinahifadhiwa kwenye kifaa chako hata bila intaneti.'
                      : 'All accessed book chapters, manuscripts, and articles stay saved offline on your device.'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-black/50 border border-emerald-500/30 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-950 text-[#ffd700] shrink-0 border border-emerald-800">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    {isSwahili ? 'Ufikiaji wa Haraka kwenye Skrini ya Nyumbani' : 'Add to Home Screen'}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {isSwahili
                      ? 'Inafunguka bila upau wa kivinjari kwa skrini nzima na wepesi mkubwa.'
                      : 'Launches full-screen with native app frame, zero lag, and instant startup.'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-black/50 border border-emerald-500/30 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-950 text-[#ffd700] shrink-0 border border-emerald-800">
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    {isSwahili ? 'Arifa za Moja kwa Moja' : 'Live Meeting Alerts & Sync'}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {isSwahili
                      ? 'Pata arifa za vyumba vya mikutano, machapisho mapya na ofa za Open Shop.'
                      : 'Never miss live broadcasts, newly published books, or merchant updates.'}
                  </p>
                </div>
              </div>
            </div>

            {/* iOS Instructions if on Safari */}
            {isIOS && (
              <div className="p-3.5 rounded-2xl bg-[#092014] border border-[#ffd700]/40 text-xs text-slate-200 space-y-1">
                <span className="font-black text-[#ffd700] block">
                  {isSwahili ? 'Mwongozo wa iPhone / iPad:' : 'iPhone / iPad Safari Install:'}
                </span>
                <p className="text-[11px]">
                  1. {isSwahili ? 'Gusa kitufe cha' : 'Tap'} <strong>Share</strong> {isSwahili ? 'kwenye Safari' : 'in Safari toolbar'} (ikoni ya mraba na mshale juu).
                </p>
                <p className="text-[11px]">
                  2. {isSwahili ? 'Chagua' : 'Select'} <strong>Add to Home Screen</strong>.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-2">
              {isInstallable && (
                <button
                  type="button"
                  onClick={async () => {
                    await install();
                    setShowPWAModal(false);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#d4af37] text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:brightness-105 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>{isSwahili ? 'Sakinisha App Sasa' : 'Install App Now'}</span>
                </button>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCheckUpdates}
                  disabled={isUpdating}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin text-[#ffd700]' : ''}`} />
                  <span>{isUpdating ? (isSwahili ? 'Inaoanisha...' : 'Syncing...') : (isSwahili ? 'Oanisha Maudhui' : 'Check Updates')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPWAModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-slate-300 text-xs font-bold border border-white/10 cursor-pointer"
                >
                  {isSwahili ? 'Funga' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
