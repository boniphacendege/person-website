import React, { useState } from 'react';
import {
  X,
  Camera,
  Mic,
  Lock,
  Sliders,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Smartphone,
  Laptop,
  AlertCircle,
  HelpCircle,
  Compass,
  Globe,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { isIframeEnvironment, openStandaloneTab } from '../services/mediaPermissionService';

interface PermissionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  language?: string;
}

type BrowserTab = 'chrome' | 'safari' | 'firefox';

export const PermissionGuideModal: React.FC<PermissionGuideModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  language = 'English',
}) => {
  const isSwahili = language === 'Swahili';
  const [activeBrowser, setActiveBrowser] = useState<BrowserTab>('chrome');
  const [activePlatform, setActivePlatform] = useState<'desktop' | 'mobile'>('mobile');
  const inIframe = isIframeEnvironment();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#07190f] text-white w-full max-w-3xl rounded-3xl border-2 border-emerald-500/40 shadow-[0_0_50px_rgba(5,150,105,0.35)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Rail with Gold Accent */}
        <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/10 via-[#ffd700] to-emerald-500/10" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 pb-4 border-b border-emerald-950/80 flex items-center justify-between gap-3 bg-[#04120a] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-emerald-950 border border-emerald-500/30 flex items-center justify-center text-[#ffd700] shadow-[0_0_12px_rgba(5,150,105,0.3)]">
              <Camera className="w-5 h-5 text-[#ffd700]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  {isSwahili ? 'Mwongozo wa Kivinjari' : 'Browser Permission Guide'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700]" />
                <span className="text-[10px] font-bold text-[#ffd700]">
                  Chrome · Safari · Firefox
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white font-editorial leading-tight">
                {isSwahili
                  ? 'Jinsi ya Kuruhusu Kamera & Maikrofoni'
                  : 'How to Enable Camera & Microphone'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-black/40 hover:bg-rose-950 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chrome "Site Can Ask" Special Notice Banner */}
        <div className="p-3 px-5 bg-gradient-to-r from-amber-950/70 via-black to-emerald-950/60 border-b border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
          <AlertCircle className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="text-[#ffd700] font-black block">
              {isSwahili
                ? 'Kama Chrome inaonyesha: "Site can ask for your camera / microphone"'
                : 'Notice: If Chrome shows "Site can ask for your camera / microphone"'}
            </strong>
            <p className="text-amber-100/90 mt-0.5">
              {isSwahili
                ? 'Hiyo inamaanisha Chrome ipo tayari kutoa idhini! Chrome inasubiri ubonyeze kitufe cha "Washa Kamera Sasa" kwenye ukurasa huu ili ionyeshe kidirisha cha [Allow / Ruhusu].'
                : 'That means Chrome is in the correct Ask mode! Chrome is waiting for you to tap "Activate Camera Now" below so it can display the [Allow] prompt.'}
            </p>
          </div>
        </div>

        {/* Browser Selector Tabs */}
        <div className="p-3 px-4 sm:px-6 bg-[#030d07] border-b border-emerald-950 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {/* Browser Selection */}
          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-2xl border border-emerald-500/25">
            <button
              type="button"
              onClick={() => setActiveBrowser('chrome')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeBrowser === 'chrome'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black shadow-[0_0_10px_rgba(255,215,0,0.35)]'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Google Chrome</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveBrowser('safari')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeBrowser === 'safari'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black shadow-[0_0_10px_rgba(255,215,0,0.35)]'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Apple Safari</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveBrowser('firefox')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeBrowser === 'firefox'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black shadow-[0_0_10px_rgba(255,215,0,0.35)]'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Firefox</span>
            </button>
          </div>

          {/* Platform Toggle: Mobile vs Desktop */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-emerald-500/20 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActivePlatform('mobile')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activePlatform === 'mobile'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>{isSwahili ? 'Simu (Mobile)' : 'Mobile'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePlatform('desktop')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activePlatform === 'desktop'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Laptop className="w-3 h-3" />
              <span>{isSwahili ? 'Kompyuta (Desktop)' : 'Desktop'}</span>
            </button>
          </div>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* ========================================================= */}
          {/* 1. GOOGLE CHROME GUIDE                                    */}
          {/* ========================================================= */}
          {activeBrowser === 'chrome' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#ffd700] uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Chrome · {activePlatform === 'mobile' ? 'Android / Mobile' : 'Windows & Mac'}</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {isSwahili ? 'Hatua 3 Rahisi' : '3 Simple Steps'}
                </span>
              </div>

              {/* Visual Diagram: Chrome Address Bar Mockup */}
              <div className="bg-[#021008] rounded-2xl p-4 border border-emerald-500/25 space-y-3">
                <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                  <span>{isSwahili ? 'Mchoro wa Upau wa Anwani wa Chrome:' : 'Chrome Address Bar Diagram:'}</span>
                  <span className="text-[#ffd700]">{activePlatform === 'mobile' ? 'Simu (Top/Bottom Bar)' : 'Desktop (Top Bar)'}</span>
                </div>

                <div className="bg-black rounded-xl p-2.5 border border-white/10 flex items-center justify-between gap-3 font-mono text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-amber-500/20 text-[#ffd700] border border-amber-500/40 flex items-center gap-1 font-sans text-[11px] font-bold animate-pulse">
                      <Lock className="w-3.5 h-3.5 text-[#ffd700]" />
                      <span>{activePlatform === 'mobile' ? '🔒 Lock / ⚙️ Tune' : '🔒 Site Info'}</span>
                    </span>
                    <span className="text-slate-400 text-[11px] truncate">https://ais-dev-asf3qzpwrr...</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold font-sans bg-emerald-950 px-2 py-0.5 rounded">
                    {activePlatform === 'mobile' ? '⋮ Menu' : '🔒 Permissions'}
                  </span>
                </div>
              </div>

              {/* Step-by-Step Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Step 1 */}
                <div className="bg-[#03150c] p-4 rounded-2xl border border-emerald-500/20 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-950 text-[#ffd700] font-black text-xs flex items-center justify-center border border-[#ffd700]/30 shadow-xs">
                    1
                  </div>
                  <strong className="text-xs font-bold text-white block">
                    {activePlatform === 'mobile'
                      ? isSwahili ? 'Bonyeza Kufuli 🔒 au Vitone ⋮' : 'Tap Lock 🔒 or Menu ⋮'
                      : isSwahili ? 'Bonyeza Alama ya Kufuli 🔒' : 'Click the Lock Icon 🔒'}
                  </strong>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {activePlatform === 'mobile'
                      ? isSwahili
                        ? 'Juu kwenye upau wa anwani ya Chrome, bonyeza alama ya kufuli (🔒) au vitone vitatu (⋮) kisha chagua Mipangilio ya Tovuti.'
                        : 'At the top of Chrome, tap the lock icon (🔒) or the 3 dots (⋮) and tap "Site settings" or "Permissions".'
                      : isSwahili
                        ? 'Kwenye upau wa anwani wa Chrome juu kushoto, bonyeza alama ya kufuli (🔒) au kiteuzi cha mipangilio.'
                        : 'On the left of the Chrome address bar, click the Lock (🔒) or tune icon to view website permissions.'}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-[#03150c] p-4 rounded-2xl border border-emerald-500/20 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-950 text-[#ffd700] font-black text-xs flex items-center justify-center border border-[#ffd700]/30 shadow-xs">
                    2
                  </div>
                  <strong className="text-xs font-bold text-white block">
                    {isSwahili ? 'Weka "Allow" au "Ask"' : 'Set to "Allow" or "Ask"'}
                  </strong>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isSwahili
                      ? 'Tafuta Kamera (Camera) na Maikrofoni (Microphone). Hakikisha zimewekwa "Allow" au "Site can ask for your camera".'
                      : 'Find Camera and Microphone. Ensure they are set to "Allow" or "Site can ask for your camera".'}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-[#03150c] p-4 rounded-2xl border border-emerald-500/20 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-950 text-[#ffd700] font-black text-xs flex items-center justify-center border border-[#ffd700]/30 shadow-xs">
                    3
                  </div>
                  <strong className="text-xs font-bold text-white block">
                    {isSwahili ? 'Bonyeza "Washa Kamera Sasa"' : 'Tap "Activate Camera Now"'}
                  </strong>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isSwahili
                      ? 'Rudi kwenye ukurasa huu na ubonyeze kitufe cha dhahabu cha "Washa Kamera Sasa", kisha chagua "Allow" kwenye ujumbe wa Chrome.'
                      : 'Return here and click the gold "Activate Camera Now" button, then choose "Allow" or "While using the app" on the Chrome prompt.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. APPLE SAFARI GUIDE (iOS iPhone & Mac)                  */}
          {/* ========================================================= */}
          {activeBrowser === 'safari' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#ffd700] uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Apple Safari · {activePlatform === 'mobile' ? 'iPhone / iPad iOS' : 'MacBook / macOS'}</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {isSwahili ? 'Hatua za Safari' : 'Safari Steps'}
                </span>
              </div>

              {/* Safari Address Bar Visual Mockup */}
              <div className="bg-[#021008] rounded-2xl p-4 border border-emerald-500/25 space-y-3">
                <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                  <span>{isSwahili ? 'Mchoro wa Safari kwenye iPhone/Mac:' : 'Safari Interface Diagram:'}</span>
                  <span className="text-[#ffd700]">{activePlatform === 'mobile' ? 'Kitufe cha "aA" chini' : 'Safari Preferences'}</span>
                </div>

                <div className="bg-black rounded-xl p-2.5 border border-white/10 flex items-center justify-between gap-3 font-mono text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 font-sans text-xs font-bold animate-pulse">
                      aA
                    </span>
                    <span className="text-slate-400 text-[11px]">ais-dev-asf3qzpwrr...</span>
                  </div>
                  <span className="text-[10px] text-blue-300 font-bold font-sans bg-blue-950 px-2 py-0.5 rounded">
                    Website Settings
                  </span>
                </div>
              </div>

              {/* Steps for Safari */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Step 1 */}
                <div className="bg-[#03150c] p-4 rounded-2xl border border-emerald-500/20 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-950 text-[#ffd700] font-black text-xs flex items-center justify-center border border-[#ffd700]/30 shadow-xs">
                    1
                  </div>
                  <strong className="text-xs font-bold text-white block">
                    {activePlatform === 'mobile'
                      ? isSwahili ? 'Bonyeza kitufe cha "aA"' : 'Tap the "aA" Button'
                      : isSwahili ? 'Menyu ya Safari > Settings' : 'Safari > Settings for Website'}
                  </strong>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {activePlatform === 'mobile'
                      ? isSwahili
                        ? 'Kwenye upau wa anwani wa Safari (chini au juu ya iPhone), bonyeza alama ya herufi "aA".'
                        : 'On your iPhone Safari address bar, tap the "aA" icon on the left.'
                      : isSwahili
                        ? 'Kwenye upau wa juu wa Mac, chagua Safari > Settings for This Website.'
                        : 'In the top macOS menu bar, click Safari > Settings for This Website.'}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-[#03150c] p-4 rounded-2xl border border-emerald-500/20 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-950 text-[#ffd700] font-black text-xs flex items-center justify-center border border-[#ffd700]/30 shadow-xs">
                    2
                  </div>
                  <strong className="text-xs font-bold text-white block">
                    {isSwahili ? 'Chagua "Website Settings"' : 'Select "Website Settings"'}
                  </strong>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isSwahili
                      ? 'Chagua "Website Settings" kisha uweke Kamera (Camera) na Maikrofoni kuwa "Allow" (Ruhusu).'
                      : 'Tap "Website Settings" and set both Camera and Microphone to "Allow".'}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-[#03150c] p-4 rounded-2xl border border-emerald-500/20 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-950 text-[#ffd700] font-black text-xs flex items-center justify-center border border-[#ffd700]/30 shadow-xs">
                    3
                  </div>
                  <strong className="text-xs font-bold text-white block">
                    {isSwahili ? 'Pakia Upya & Washa Kamera' : 'Reload & Activate Camera'}
                  </strong>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isSwahili
                      ? 'Bonyeza "Done", kisha ubonyeze kitufe cha "Washa Kamera Sasa" kwenye ukurasa huu kuanza moja kwa moja.'
                      : 'Tap "Done" and click "Activate Camera Now" on this page to start the live video feed.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. MOZILLA FIREFOX GUIDE                                  */}
          {/* ========================================================= */}
          {activeBrowser === 'firefox' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#ffd700] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mozilla Firefox · {activePlatform === 'mobile' ? 'Android / Mobile' : 'Desktop'}</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {isSwahili ? 'Hatua za Firefox' : 'Firefox Steps'}
                </span>
              </div>

              {/* Firefox Address Bar Visual Mockup */}
              <div className="bg-[#021008] rounded-2xl p-4 border border-emerald-500/25 space-y-3">
                <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                  <span>{isSwahili ? 'Mchoro wa Firefox Address Bar:' : 'Firefox Address Bar Diagram:'}</span>
                  <span className="text-[#ffd700]">Clear Blocked Permissions</span>
                </div>

                <div className="bg-black rounded-xl p-2.5 border border-white/10 flex items-center justify-between gap-3 font-mono text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/40 font-sans text-xs font-bold flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-orange-400" />
                      <span>Blocked ✕</span>
                    </span>
                    <span className="text-slate-400 text-[11px]">ais-dev-asf3qzpwrr...</span>
                  </div>
                  <span className="text-[10px] text-orange-400 font-bold font-sans bg-orange-950 px-2 py-0.5 rounded">
                    Clear Permission
                  </span>
                </div>
              </div>

              {/* Steps for Firefox */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Step 1 */}
                <div className="bg-[#03150c] p-4 rounded-2xl border border-emerald-500/20 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-950 text-[#ffd700] font-black text-xs flex items-center justify-center border border-[#ffd700]/30 shadow-xs">
                    1
                  </div>
                  <strong className="text-xs font-bold text-white block">
                    {isSwahili ? 'Bonyeza Alama ya Kamera Kushoto' : 'Click the Crossed Camera Icon'}
                  </strong>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isSwahili
                      ? 'Kwenye upau wa anwani wa Firefox, utaona alama ya kamera iliyokatwa mstari (✕).'
                      : 'On the left of the Firefox address bar, click the camera icon showing a red cross (✕).'}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-[#03150c] p-4 rounded-2xl border border-emerald-500/20 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-950 text-[#ffd700] font-black text-xs flex items-center justify-center border border-[#ffd700]/30 shadow-xs">
                    2
                  </div>
                  <strong className="text-xs font-bold text-white block">
                    {isSwahili ? 'Ondoa Zuio (Clear Block)' : 'Clear Blocked Permission'}
                  </strong>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isSwahili
                      ? 'Bonyeza "Clear Allowed/Blocked Status" ili Firefox iruhusu tovuti hii kuomba kamera tena.'
                      : 'Click "Clear Allowed/Blocked Status" so Firefox resets the permission back to prompt.'}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-[#03150c] p-4 rounded-2xl border border-emerald-500/20 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-950 text-[#ffd700] font-black text-xs flex items-center justify-center border border-[#ffd700]/30 shadow-xs">
                    3
                  </div>
                  <strong className="text-xs font-bold text-white block">
                    {isSwahili ? 'Washa Kamera & Chagua "Remember"' : 'Allow & Check "Remember"'}
                  </strong>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isSwahili
                      ? 'Bonyeza kitufe cha "Washa Kamera Sasa" kisha uweke alama kwenye "Remember this decision" na ubonyeze "Allow".'
                      : 'Click "Activate Camera Now", tick "Remember this decision", and click "Allow".'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions Deck */}
        <div className="p-4 sm:px-6 bg-[#030e07] border-t border-emerald-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              {isSwahili
                ? 'Baada ya kurekebisha, bonyeza "Washa Kamera Sasa" kuanza.'
                : 'After updating settings, click "Activate Camera Now" to start.'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Direct Retry button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onRetry?.();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#ffd700] text-slate-950 font-black text-xs cursor-pointer shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-slate-950" />
              <span>{isSwahili ? 'Washa Kamera Sasa (Allow)' : 'Activate Camera Now'}</span>
            </button>

            {/* Standalone Tab Button if in iframe */}
            {inIframe && (
              <button
                type="button"
                onClick={openStandaloneTab}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                title={isSwahili ? 'Fungua kwenye dirisha kamili la Chrome' : 'Open in standalone Chrome tab'}
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>{isSwahili ? 'Fungua Dirisha Kamili' : 'Open Standalone Tab'}</span>
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs cursor-pointer"
            >
              {isSwahili ? 'Funga' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
