import React, { useState, useRef, useEffect } from 'react';
import {
  Radio,
  Plus,
  Video,
  VideoOff,
  Calendar,
  Users,
  Bell,
  Monitor,
  Mic,
  MicOff,
  Camera,
  RefreshCw,
  Smartphone,
  Sparkles,
  Loader2,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { Meeting } from '../types';
import {
  requestUserMediaStream,
  getChromeInstructions,
  isIframeEnvironment,
  openStandaloneTab,
} from '../services/mediaPermissionService';
import { PermissionGuideModal } from './PermissionGuideModal';

interface LiveSectionProps {
  meetings: Meeting[];
  onOpenCreateMeeting: () => void;
  onJoinMeeting: (meeting: Meeting) => void;
  onSetReminder: (meetingTitle: string) => void;
  language?: string;
  onShowToast?: (msg: string) => void;
}

export const LiveSection: React.FC<LiveSectionProps> = ({
  meetings,
  onOpenCreateMeeting,
  onJoinMeeting,
  onSetReminder,
  language,
  onShowToast,
}) => {
  const isSwahili = language === 'Swahili';
  const liveRoom = meetings.find((m) => m.isLiveNow) || meetings[0];
  const upcomingMeetings = meetings.filter((m) => !m.isLiveNow);

  // Live broadcast interactive state
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);
  const [showChromeGuide, setShowChromeGuide] = useState(false);
  const [isPermissionGuideOpen, setIsPermissionGuideOpen] = useState(false);

  const chromeGuide = getChromeInstructions(isSwahili);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Cleanup tracks on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Multi-tier resilient camera stream starter wrapped in MediaPermissionService
  // Only called after direct user click (Start Camera, Toggle Camera, Retry Camera)
  const startCameraStream = async (
    targetFacing: 'user' | 'environment',
    targetDeviceId?: string,
    withAudioParam = true
  ) => {
    setCameraError(null);
    setIsRequestingCamera(true);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      const result = await requestUserMediaStream({
        facingMode: targetFacing,
        deviceId: targetDeviceId,
        withAudio: withAudioParam,
      });

      if (result.success && result.stream) {
        const stream = result.stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setIsScreenSharing(false);
        setCameraError(null);
        setShowChromeGuide(false);

        // Apply existing mute state to audio track
        if (isMuted) {
          stream.getAudioTracks().forEach((track) => {
            track.enabled = false;
          });
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => console.log('Video play notice:', err));
        }

        // Populate device list for external camera switching
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const vDevs = devices.filter((d) => d.kind === 'videoinput');
          setVideoDevices(vDevs);
        } catch {}

        onShowToast?.(
          isSwahili
            ? targetFacing === 'user'
              ? 'Kamera ya Mbele (Simu) inachukua video moja kwa moja!'
              : 'Kamera ya Nyuma (HD) inachukua video moja kwa moja!'
            : targetFacing === 'user'
            ? 'Front Camera active & capturing live video!'
            : 'Back Camera active & capturing live video!'
        );
      } else {
        const friendlyMsg = isSwahili ? result.swahiliInstruction : result.userFriendlyInstruction;
        setCameraError(friendlyMsg || (result.errorMessage ?? 'Camera access failed'));
        if (result.errorType === 'NotAllowedError') {
          setShowChromeGuide(true);
        }
        if (friendlyMsg) {
          onShowToast?.(friendlyMsg);
        }
      }
    } catch (err: unknown) {
      console.warn('Camera request notice:', err);
      const fallbackMsg = isSwahili
        ? 'Idhini ya kamera imezuiwa. Tafadhali bonyeza alama ya kufuli (lock 🔒) kwenye upau wa Chrome ili kuruhusu kamera na maikrofoni.'
        : 'Camera permission denied. Tap the lock 🔒 in Chrome address bar to allow camera & microphone access.';
      setCameraError(fallbackMsg);
      setShowChromeGuide(true);
      onShowToast?.(fallbackMsg);
    } finally {
      setIsRequestingCamera(false);
    }
  };

  // 1. Toggle Camera (Switch front/back mobile camera or external USB)
  const handleToggleCamera = async () => {
    if (!isStreaming) {
      await startCameraStream(facingMode);
      return;
    }

    if (videoDevices.length > 1) {
      const curIdx = videoDevices.findIndex((d) => d.deviceId === currentDeviceId);
      const nextIdx = (curIdx + 1) % videoDevices.length;
      const nextDev = videoDevices[nextIdx];
      setCurrentDeviceId(nextDev.deviceId);
      await startCameraStream(facingMode, nextDev.deviceId);
    } else {
      const nextFacing = facingMode === 'user' ? 'environment' : 'user';
      setFacingMode(nextFacing);
      await startCameraStream(nextFacing);
    }
  };

  // 2. Mute/Unmute Microphone
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !nextMuted;
      });
    }
    onShowToast?.(
      isSwahili
        ? nextMuted
          ? 'Maikrofoni imenyanyamazishwa (Muted)'
          : 'Maikrofoni imewashwa (Unmuted)'
        : nextMuted
        ? 'Microphone muted'
        : 'Microphone unmuted'
    );
  };

  // 3. Screen Share (using getDisplayMedia API)
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      // Revert to camera stream
      if (streamRef.current && videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(() => {});
      }
      onShowToast?.(isSwahili ? 'Kushiriki skrini kumesimamishwa' : 'Screen sharing stopped');
    } else {
      try {
        if (!navigator?.mediaDevices?.getDisplayMedia) {
          onShowToast?.(
            isSwahili
              ? 'Kushiriki skrini hakutumiki kwenye kivinjari/kifaa hiki'
              : 'Screen sharing not supported on this browser/device'
          );
          return;
        }

        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        screenStreamRef.current = displayStream;
        setIsScreenSharing(true);
        setIsStreaming(true);

        if (videoRef.current) {
          videoRef.current.srcObject = displayStream;
          videoRef.current.play().catch(() => {});
        }

        displayStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          screenStreamRef.current = null;
          if (streamRef.current && videoRef.current) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch(() => {});
          }
          onShowToast?.(isSwahili ? 'Kushiriki skrini kumesimamishwa' : 'Screen share stopped');
        };

        onShowToast?.(isSwahili ? 'Kushiriki skrini kumewashwa!' : 'Screen sharing started!');
      } catch (err) {
        console.warn('Screen share request notice:', err);
      }
    }
  };

  // Stop Streaming
  const handleStopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    setIsStreaming(false);
    setIsScreenSharing(false);
    onShowToast?.(isSwahili ? 'Kamera imesimamishwa' : 'Camera stopped');
  };

  return (
    <section id="live" className="py-12 max-w-6xl mx-auto px-4 border-t border-emerald-950/10 dark:border-emerald-500/15">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-[#ffd700]">
              {isSwahili ? 'Matangazo & Kongamano la Moja kwa Moja' : 'Live Broadcasting & Conferencing'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-emerald-50 tracking-tight font-editorial">
            {isSwahili ? 'Mikutano Mubashara & Video' : 'Live & Video Conferencing'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1">
            {isSwahili
              ? 'Tangaza na ungana kupitia video ya kamera ya simu, kompyuta, kushiriki skrini na sauti safi.'
              : 'Broadcast and connect via mobile camera, external webcam, screen sharing and clear audio.'}
          </p>
        </div>

        <button
          onClick={onOpenCreateMeeting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {isSwahili ? 'Unda Mkutano' : 'Create Meeting'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Live Room Spotlight with Interactive Camera, Screen Share & Mic Controls */}
        {liveRoom && (
          <div className="lg:col-span-3 relative rounded-3xl overflow-hidden min-h-[420px] flex flex-col justify-between bg-gradient-to-br from-[#052618] via-[#02180e] to-[#010d07] text-white shadow-[0_0_45px_rgba(16,185,129,0.28)] border-2 border-emerald-500/40 group">
            {/* Top Accent Rail */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/10 via-[#34d399] to-[#ffd700] shadow-[0_0_16px_rgba(52,211,153,0.9)] z-20" />
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* VIDEO ELEMENT / BACKDROP: 100% CLEAR VIDEO WHEN STREAMING */}
            {isStreaming ? (
              <div className="absolute inset-0 w-full h-full bg-black z-0 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <>
                <img
                  src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80"
                  alt="Live conference room"
                  className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity -z-10 group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02140c] via-[#042417]/85 to-transparent -z-10" />
              </>
            )}

            {/* Top Header Strip with Status Badges */}
            <div className="p-5 flex flex-wrap items-center justify-between gap-2.5 z-20">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.6)] tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  {isSwahili ? 'MUBASHARA SASA' : 'LIVE NOW'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#03150c]/90 backdrop-blur-md text-[#ffd700] border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>148 {isSwahili ? 'Wanaotazama' : 'Watching'}</span>
                </span>
              </div>

              {/* Active Stream Indicator */}
              {isStreaming && (
                <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-emerald-500/50 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {isScreenSharing
                      ? (isSwahili ? 'Skrini Inashirikiwa' : 'Screen Share Active')
                      : (facingMode === 'user'
                        ? (isSwahili ? 'Kamera ya Mbele (Front)' : 'Front Mobile Cam')
                        : (isSwahili ? 'Kamera ya Nyuma (Back HD)' : 'Back Mobile Cam'))}
                  </span>
                </div>
              )}
            </div>

            {/* Middle Section (When not streaming) */}
            {!isStreaming && (
              <div className="relative z-10 px-6 py-4">
                <span className="text-xs font-black text-[#ffd700] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  {isSwahili ? 'Matangazo Maalum ya Moja kwa Moja' : 'Featured Live Broadcast'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black mb-2 text-white leading-tight font-editorial drop-shadow-md">
                  {isSwahili ? 'Digital Business & The Future' : 'Digital Business & The Future'}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
                  {isSwahili
                    ? 'Washa kamera yako ya simu au kompyuta, shiriki skrini, au jiunge na chumba cha mkutano kuwasiliana na jamii.'
                    : 'Start your mobile or external webcam, share screen content, or join the live conference room.'}
                </p>

                {/* Requesting camera & microphone access banner */}
                {isRequestingCamera && (
                  <div className="mt-3 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2.5 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin text-[#ffd700] shrink-0" />
                    <span>
                      {isSwahili
                        ? 'Inaomba idhini ya kamera na maikrofoni kwenye Google Chrome... Tafadhali bonyeza "Allow" (Ruhusu).'
                        : 'Requesting camera & microphone access in Google Chrome... Please select "Allow" when prompted.'}
                    </span>
                  </div>
                )}

                {/* Camera / Mic Permission Denied or Device Error card */}
                {cameraError && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-black/85 border border-amber-500/60 backdrop-blur-md text-xs text-amber-200 space-y-2.5 shadow-lg">
                    <div className="flex items-start gap-2.5">
                      <span className="text-base shrink-0">🔒</span>
                      <div className="flex-1">
                        <strong className="block text-white font-bold text-xs">
                          {isSwahili
                            ? 'Idhini ya Kamera / Maikrofoni Inahitajika kwenye Google Chrome:'
                            : 'Camera / Microphone Permission Required in Google Chrome:'}
                        </strong>
                        <p className="text-[11px] text-amber-200/90 leading-relaxed mt-1">
                          {cameraError}
                        </p>
                      </div>
                    </div>

                    {/* Step-by-Step Chrome Instructions Accordion */}
                    <div className="bg-amber-950/40 rounded-xl p-2.5 border border-amber-500/25 text-[11px] space-y-1.5 text-amber-100">
                      <button
                        type="button"
                        onClick={() => setShowChromeGuide(!showChromeGuide)}
                        className="w-full text-left font-bold text-white flex items-center justify-between cursor-pointer hover:text-[#ffd700] transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-[#ffd700]" />
                          <span>{chromeGuide.title}</span>
                        </span>
                        {showChromeGuide ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>

                      {showChromeGuide && (
                        <div className="pt-2 space-y-2.5 text-[11px] border-t border-amber-500/20 mt-1.5">
                          <div>
                            <span className="font-bold text-[#ffd700] block mb-1">
                              {isSwahili ? 'Kwenye Google Chrome ya Kompyuta (Desktop):' : 'Desktop Google Chrome:'}
                            </span>
                            <ul className="list-disc pl-4 space-y-0.5 text-slate-200">
                              {chromeGuide.desktop.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-bold text-[#ffd700] block mb-1">
                              {isSwahili ? 'Kwenye Google Chrome ya Simu (Android):' : 'Android Google Chrome (Mobile):'}
                            </span>
                            <ul className="list-disc pl-4 space-y-0.5 text-slate-200">
                              {chromeGuide.android.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        type="button"
                        onClick={() => startCameraStream(facingMode)}
                        disabled={isRequestingCamera}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black text-[11px] shadow-sm hover:brightness-105 cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                      >
                        {isRequestingCamera ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>{isSwahili ? 'Inaomba...' : 'Requesting...'}</span>
                          </>
                        ) : (
                          <span>{isSwahili ? 'Washa Kamera Sasa (Allow)' : 'Activate Camera Now'}</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => startCameraStream(facingMode, undefined, false)}
                        disabled={isRequestingCamera}
                        className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-[11px] cursor-pointer"
                        title={isSwahili ? 'Jaribu kamera pekee bila maikrofoni' : 'Try camera only without microphone'}
                      >
                        {isSwahili ? 'Jaribu Kamera Pekee' : 'Try Video Only'}
                      </button>

                      {isIframeEnvironment() && (
                        <button
                          type="button"
                          onClick={openStandaloneTab}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-[11px] shadow-sm flex items-center gap-1.5 cursor-pointer"
                          title={isSwahili ? 'Fungua kwenye dirisha kamili la Chrome ili kuonyesha kidirisha cha ruhusa' : 'Open in direct Chrome tab to trigger native permission pop-up'}
                        >
                          <ExternalLink className="w-3 h-3 text-[#ffd700]" />
                          <span>{isSwahili ? 'Fungua Dirisha Kamili la Chrome' : 'Open in Standalone Chrome Tab'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleToggleScreenShare}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 font-bold text-[11px] cursor-pointer"
                      >
                        {isSwahili ? 'Jaribu Kushiriki Skrini' : 'Try Screen Share'}
                      </button>

                      {/* Visual Permission Guide Modal Trigger */}
                      <button
                        type="button"
                        onClick={() => setIsPermissionGuideOpen(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-[#ffd700] border border-amber-500/50 font-bold text-[11px] cursor-pointer flex items-center gap-1.5 shadow-xs"
                        title={isSwahili ? 'Fungua mwongozo wa picha kwa Chrome, Safari na Firefox' : 'Open visual step-by-step guide for Chrome, Safari, and Firefox'}
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span>{isSwahili ? 'Mwongozo wa Kivinjari (Chrome, Safari, Firefox)' : 'Browser Permission Guide'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Controls Deck with Toggle Camera, Screen Share, and Mute/Unmute */}
            <div className="relative z-20 p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-wrap items-center justify-between gap-3">
              {/* Left Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* 1. Toggle Camera (Front/Back mobile camera or External USB) */}
                <button
                  type="button"
                  onClick={handleToggleCamera}
                  disabled={isRequestingCamera}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white border border-[#ffd700]/30 shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-60"
                  title={isSwahili ? 'Badili Kamera (Mbele / Nyuma / Nje)' : 'Toggle Camera (Front / Back / External)'}
                >
                  {isRequestingCamera ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ffd700]" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 text-[#ffd700]" />
                  )}
                  <span>
                    {isRequestingCamera
                      ? (isSwahili ? 'Inaomba Idhini...' : 'Requesting Access...')
                      : !isStreaming
                      ? (isSwahili ? 'Washa Kamera' : 'Start Camera')
                      : (isSwahili ? 'Badili Kamera' : 'Toggle Camera')}
                  </span>
                  {!isRequestingCamera && <RefreshCw className="w-3 h-3 text-slate-300 ml-0.5" />}
                </button>

                {/* 2. Screen Share (using getDisplayMedia API) */}
                <button
                  type="button"
                  onClick={handleToggleScreenShare}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
                    isScreenSharing
                      ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black shadow-[0_0_14px_rgba(255,215,0,0.5)]'
                      : 'bg-emerald-950/90 hover:bg-emerald-900 text-emerald-200 border border-emerald-700'
                  }`}
                  title={isSwahili ? 'Shiriki Skrini / Dirisha' : 'Share Screen / Window'}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>
                    {isScreenSharing
                      ? (isSwahili ? 'Acha Skrini' : 'Stop Screen Share')
                      : (isSwahili ? 'Shiriki Skrini' : 'Screen Share')}
                  </span>
                </button>

                {/* 3. Mute / Unmute Microphone */}
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
                    isMuted
                      ? 'bg-rose-700 hover:bg-rose-600 text-white'
                      : 'bg-emerald-900/80 hover:bg-emerald-800 text-white border border-emerald-700/60'
                  }`}
                  title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                >
                  {isMuted ? <MicOff className="w-3.5 h-3.5 text-rose-300" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>
                    {isMuted
                      ? (isSwahili ? 'Sauti Imezimwa' : 'Muted')
                      : (isSwahili ? 'Sauti Wazi' : 'Mic Active')}
                  </span>
                </button>

                {/* Stop Stream Button when active */}
                {isStreaming && (
                  <button
                    type="button"
                    onClick={handleStopStream}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800/60 cursor-pointer transition-all"
                  >
                    <VideoOff className="w-3 h-3" />
                    <span>{isSwahili ? 'Zima' : 'Stop'}</span>
                  </button>
                )}
              </div>

              {/* Right Action: Join Live Room (Interactive Full Room) */}
              <button
                type="button"
                onClick={() => onJoinMeeting(liveRoom)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#d4af37] hover:brightness-105 text-slate-950 shadow-[0_0_15px_rgba(255,215,0,0.4)] transition-all cursor-pointer active:scale-95"
              >
                <Video className="w-4 h-4 text-slate-950" />
                <span>{isSwahili ? 'Chumba Kamili' : 'Join Full Room'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Upcoming Meetings List */}
        <div className="lg:col-span-2 card-neon-gold p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/10 via-[#ffd700]/60 to-emerald-500/10 mb-4 rounded-full" />
            <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#ffd700]" />
                {isSwahili ? 'Mikutano Inayokuja' : 'Upcoming Meetings'}
              </span>
              <span className="text-xs text-[#ffd700] font-bold">
                {isSwahili ? 'Ratiba' : 'Schedule'}
              </span>
            </h3>

            <div className="divide-y divide-emerald-950/10 dark:divide-emerald-500/15">
              {upcomingMeetings.map((meet) => (
                <div key={meet.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50 block leading-tight">
                      {isSwahili && meet.titleSwahili ? meet.titleSwahili : meet.title}
                    </strong>
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-emerald-400/60">
                    {isSwahili && meet.scheduleSwahili ? meet.scheduleSwahili : meet.schedule} · {isSwahili ? 'Mwezeshaji' : 'Host'}: {meet.hostName}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSetReminder(meet.title)}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 hover:bg-slate-200 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      {isSwahili ? 'Weka Kikumbusho' : 'Set Reminder'}
                    </button>
                    <button
                      onClick={() => onJoinMeeting(meet)}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-600/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      {isSwahili ? 'Jiunge' : 'Join'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Permission Guide Modal for Chrome, Safari & Firefox */}
      <PermissionGuideModal
        isOpen={isPermissionGuideOpen}
        onClose={() => setIsPermissionGuideOpen(false)}
        onRetry={() => startCameraStream(facingMode)}
        language={language}
      />
    </section>
  );
};
