import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  Lock,
  BookOpen,
  Play,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Users,
  Send,
  Moon,
  Sun,
  Globe,
  ShieldCheck,
  Check,
  User,
  Laptop,
  ArrowDown,
  ArrowUp,
  MessageSquare,
  Crown,
  ChevronDown,
  Sparkles,
  Upload,
  Monitor,
  Tv,
  Maximize2,
  Minimize2,
  Radio,
  Volume2,
  VolumeX,
  Camera,
  Cast,
  Bluetooth,
  Sliders,
  Smartphone,
  RefreshCw,
  Loader2,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { CartItem, Book, BlogArticle, VideoItem, Meeting, ReadingMaterial } from '../types';
import { ReaderModal } from './ReaderModal';
import { VideoUploadModal } from './VideoUploadModal';
import { PermissionGuideModal } from './PermissionGuideModal';
import {
  requestUserMediaStream,
  isIframeEnvironment,
  openStandaloneTab,
} from '../services/mediaPermissionService';
import { VideoPlayerModal } from './VideoPlayerModal';
import { BritishFlag, TanzaniaFlag } from './Flags';

interface ModalsProps {
  // Cart
  isCartOpen: boolean;
  onCloseCart: () => void;
  cartItems: CartItem[];
  onRemoveFromCart: (id: string) => void;
  onUpdateCartQty: (id: string, delta: number) => void;
  onCheckout: (name: string, email: string) => void;

  // Post Modal
  isPostModalOpen: boolean;
  onClosePostModal: () => void;
  onCreatePost: (
    content: string,
    tag: string,
    title?: string,
    imageUrl?: string,
    imageAspectRatio?: '1:1' | '16:9'
  ) => void;

  // Blog Modal
  isBlogModalOpen: boolean;
  onCloseBlogModal: () => void;
  onCreateBlog: (title: string, category: string, content: string, imageUrl?: string) => void;

  // Book Modal (optional, handled in App.tsx)
  isBookModalOpen?: boolean;
  onCloseBookModal?: () => void;
  onCreateBook?: (title: string, price: number, description: string, category: string) => void;

  // Video Upload Modal
  isVideoUploadModalOpen: boolean;
  onCloseVideoUploadModal: () => void;
  onCreateVideo: (
    title: string,
    description: string,
    videoUrl?: string,
    thumbnailUrl?: string,
    duration?: string,
    category?: string
  ) => void;

  // Meeting Create Modal
  isMeetingModalOpen: boolean;
  onCloseMeetingModal: () => void;
  onCreateMeeting: (title: string, schedule: string) => void;

  // Reader Modal
  activeReadingMaterial: ReadingMaterial | null;
  onCloseReaderModal: () => void;

  // Video Player Modal
  activePlayingVideo: VideoItem | null;
  onCloseVideoPlayerModal: () => void;
  onSelectVideo?: (video: VideoItem) => void;
  videos?: VideoItem[];
  onShowToast?: (msg: string) => void;

  // Live Room Modal
  activeLiveMeeting: Meeting | null;
  onCloseLiveMeetingModal: () => void;

  // Contact Modal
  isContactModalOpen: boolean;
  onCloseContactModal: () => void;
  onSubmitContact: (name: string, email: string, message: string) => void;

  // Notifications Modal
  isNotificationsOpen: boolean;
  onCloseNotifications: () => void;

  // Settings Modal
  isSettingsOpen: boolean;
  onCloseSettings: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: string;
  onChangeLanguage: (lang: string) => void;
  onOpenEditProfile: () => void;
  themeMode?: 'system' | 'light' | 'dark';
  onChangeThemeMode?: (mode: 'system' | 'light' | 'dark') => void;
  systemIsDark?: boolean;
}

export const Modals: React.FC<ModalsProps> = ({
  isCartOpen,
  onCloseCart,
  cartItems,
  onRemoveFromCart,
  onUpdateCartQty,
  onCheckout,

  isPostModalOpen,
  onClosePostModal,
  onCreatePost,

  isBlogModalOpen,
  onCloseBlogModal,
  onCreateBlog,

  isBookModalOpen,
  onCloseBookModal,
  onCreateBook,

  isVideoUploadModalOpen,
  onCloseVideoUploadModal,
  onCreateVideo,

  isMeetingModalOpen,
  onCloseMeetingModal,
  onCreateMeeting,

  activeReadingMaterial,
  onCloseReaderModal,

  activePlayingVideo,
  onCloseVideoPlayerModal,
  onSelectVideo,
  videos,
  onShowToast,

  activeLiveMeeting,
  onCloseLiveMeetingModal,

  isContactModalOpen,
  onCloseContactModal,
  onSubmitContact,

  isNotificationsOpen,
  onCloseNotifications,

  isSettingsOpen,
  onCloseSettings,
  darkMode,
  onToggleDarkMode,
  language,
  onChangeLanguage,
  onOpenEditProfile,
  themeMode = 'system',
  onChangeThemeMode,
  systemIsDark = false,
}) => {
  const isSwahili = language === 'Swahili';
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Local state for forms
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');

  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postTag, setPostTag] = useState('Digital Life');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postImageAspectRatio, setPostImageAspectRatio] = useState<'1:1' | '16:9'>('16:9');

  const [blogTitle, setBlogTitle] = useState('');
  const [blogCat, setBlogCat] = useState('Technology');
  const [blogContent, setBlogContent] = useState('');
  const [blogImageUrl, setBlogImageUrl] = useState('');
  const [blogImageAspectRatio, setBlogImageAspectRatio] = useState<'1:1' | '16:9'>('16:9');

  const [bookTitle, setBookTitle] = useState('');
  const [bookPrice, setBookPrice] = useState('18000');
  const [bookDesc, setBookDesc] = useState('');
  const [bookCat, setBookCat] = useState('Business');

  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');

  const [meetTitle, setMeetTitle] = useState('');
  const [meetSchedule, setMeetSchedule] = useState('Today • 8:00 PM');

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  // Live room local interactive state with multi-device camera access, screen share & TV connect
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [liveChatInput, setLiveChatInput] = useState('');
  const [isLiveChatScrolledUp, setIsLiveChatScrolledUp] = useState(false);
  const [liveMeetingViewMode, setLiveMeetingViewMode] = useState<'screen' | 'chat' | 'split'>('split');
  const [isScreenShareActive, setIsScreenShareActive] = useState(false);
  const [isStageFullScreen, setIsStageFullScreen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraSource, setSelectedCameraSource] = useState<string>('user');
  const [selectedAudioSource, setSelectedAudioSource] = useState<string>('default');
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);
  const [showDeviceSelectorModal, setShowDeviceSelectorModal] = useState(false);
  const [showConnectTVModal, setShowConnectTVModal] = useState(false);
  const [meetingPermissionError, setMeetingPermissionError] = useState<string | null>(null);
  const [isRequestingMeetingMedia, setIsRequestingMeetingMedia] = useState(false);
  const [isMeetingPermissionGuideOpen, setIsMeetingPermissionGuideOpen] = useState(false);

  const liveChatContainerRef = useRef<HTMLDivElement>(null);
  const liveChatBottomRef = useRef<HTMLDivElement>(null);
  const hostVideoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micRafRef = useRef<number | null>(null);

  const stopAudioAnalyser = () => {
    if (micRafRef.current) {
      cancelAnimationFrame(micRafRef.current);
      micRafRef.current = null;
    }
    setMicAudioLevel(0);
  };

  const startAudioAnalyser = (stream: MediaStream) => {
    try {
      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) return;

      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtxClass();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        const source = audioCtxRef.current.createMediaStreamSource(stream);
        const analyser = audioCtxRef.current.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setMicAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          micRafRef.current = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      }
    } catch (err) {
      console.warn('Audio analyser setup note:', err);
    }
  };

  const refreshDevices = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const vDevs = devices.filter((d) => d.kind === 'videoinput');
        const aDevs = devices.filter((d) => d.kind === 'audioinput');
        setVideoDevices(vDevs);
        setAudioDevices(aDevs);
      }
    } catch (err) {
      console.warn('Device enumeration note:', err);
    }
  };

  const startMediaStream = async (
    camSource = selectedCameraSource,
    micSource = selectedAudioSource,
    withAudioParam = micEnabled
  ) => {
    if (!activeLiveMeeting) return;

    // Stop current camera stream if any
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    stopAudioAnalyser();

    if (!camEnabled && !withAudioParam) {
      setCameraActive(false);
      setMeetingPermissionError(null);
      return;
    }

    setMeetingPermissionError(null);
    setIsRequestingMeetingMedia(true);

    try {
      const isNamedCam =
        camSource && camSource !== 'default' && camSource !== 'user' && camSource !== 'environment';

      const result = await requestUserMediaStream({
        facingMode: camSource === 'environment' ? 'environment' : 'user',
        deviceId: isNamedCam ? camSource : undefined,
        withAudio: withAudioParam,
        audioDeviceId: micSource && micSource !== 'default' ? micSource : undefined,
      });

      if (result.success && result.stream) {
        const stream = result.stream;
        cameraStreamRef.current = stream;
        setCameraActive(true);
        setMeetingPermissionError(null);

        if (!isScreenShareActive && hostVideoRef.current) {
          hostVideoRef.current.srcObject = stream;
          hostVideoRef.current.play().catch(() => {});
        }

        if (micEnabled && stream.getAudioTracks().length > 0) {
          startAudioAnalyser(stream);
        }

        await refreshDevices();
      } else {
        const friendly = isSwahili ? result.swahiliInstruction : result.userFriendlyInstruction;
        setMeetingPermissionError(
          friendly ||
            (isSwahili
              ? 'Idhini ya kamera/maikrofoni imezuiwa kwenye Google Chrome.'
              : 'Camera or microphone access denied in Google Chrome.')
        );
        setCameraActive(false);
      }
    } catch (err) {
      console.warn('Camera/mic media stream access notice:', err);
      const fallbackMsg = isSwahili
        ? 'Idhini ya kamera/maikrofoni imezuiwa kwenye Chrome. Bonyeza alama ya kufuli (lock 🔒) kwenye upau wa Chrome ili kuruhusu.'
        : 'Camera or microphone permission denied in Chrome. Tap the lock 🔒 in Chrome address bar to allow access.';
      setMeetingPermissionError(fallbackMsg);
      setCameraActive(false);
    } finally {
      setIsRequestingMeetingMedia(false);
    }
  };

  useEffect(() => {
    if (activeLiveMeeting) {
      startMediaStream(selectedCameraSource, selectedAudioSource);
    } else {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop());
        cameraStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      stopAudioAnalyser();
      setCameraActive(false);
      setIsScreenShareActive(false);
    }

    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop());
        cameraStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      stopAudioAnalyser();
    };
  }, [activeLiveMeeting, camEnabled, micEnabled, selectedCameraSource, selectedAudioSource]);

  const handleToggleScreenShare = async () => {
    if (isScreenShareActive) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setIsScreenShareActive(false);
      if (hostVideoRef.current && cameraStreamRef.current) {
        hostVideoRef.current.srcObject = cameraStreamRef.current;
        hostVideoRef.current.play().catch(() => {});
      }
      onShowToast?.(isSwahili ? 'Kushiriki skrini kumesimamishwa' : 'Screen share stopped');
    } else {
      try {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getDisplayMedia) {
          const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });
          screenStreamRef.current = displayStream;
          setIsScreenShareActive(true);

          if (hostVideoRef.current) {
            hostVideoRef.current.srcObject = displayStream;
            hostVideoRef.current.play().catch(() => {});
          }

          displayStream.getVideoTracks()[0].onended = () => {
            setIsScreenShareActive(false);
            screenStreamRef.current = null;
            if (hostVideoRef.current && cameraStreamRef.current) {
              hostVideoRef.current.srcObject = cameraStreamRef.current;
              hostVideoRef.current.play().catch(() => {});
            }
            onShowToast?.(isSwahili ? 'Kushiriki skrini kumesimamishwa' : 'Screen share stopped');
          };

          onShowToast?.(isSwahili ? 'Kushiriki skrini kumewashwa kwa uwazi!' : 'Screen sharing activated clearly!');
        } else {
          onShowToast?.('Screen sharing not supported on this device/browser');
        }
      } catch (err) {
        console.warn('Screen share request note:', err);
      }
    }
  };

  const handlePictureInPicture = async () => {
    try {
      if (hostVideoRef.current && document.pictureInPictureEnabled) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
          onShowToast?.(isSwahili ? 'Skrini imerejea kawaida' : 'Returned from Picture-in-Picture');
        } else {
          await hostVideoRef.current.requestPictureInPicture();
          onShowToast?.(isSwahili ? 'Skrini imeunganishwa kwa TV/Monita (Picture-in-Picture)' : 'Screen connected to TV / External Display (Picture-in-Picture)');
        }
      } else {
        setShowConnectTVModal(true);
      }
    } catch (err) {
      console.warn('Picture-in-Picture notice:', err);
      setShowConnectTVModal(true);
    }
  };

  const handleLeaveMeeting = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    stopAudioAnalyser();
    setCameraActive(false);
    setIsScreenShareActive(false);
    setMeetingPermissionError(null);
    setIsRequestingMeetingMedia(false);
    onCloseLiveMeetingModal();
  };

  const handleBluetoothConnect = async () => {
    try {
      if (typeof navigator !== 'undefined' && 'bluetooth' in navigator && (navigator as unknown as { bluetooth?: { requestDevice: (opt: unknown) => Promise<{ name?: string; id?: string; addEventListener?: (ev: string, cb: () => void) => void }> } }).bluetooth) {
        onShowToast?.(
          isSwahili
            ? 'Inafungua menyu ya vifaa vya Bluetooth kwenye kivinjari chako cha Chrome...'
            : 'Opening Bluetooth device chooser in Chrome...'
        );

        const bluetoothApi = (navigator as unknown as { bluetooth: { requestDevice: (opt: unknown) => Promise<{ name?: string; id?: string; addEventListener?: (ev: string, cb: () => void) => void }> } }).bluetooth;
        const device = await bluetoothApi.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['generic_access', 'battery_service', 'device_information'],
        });

        if (device) {
          const devName = device.name || 'Bluetooth Device';
          device.addEventListener?.('gattserverdisconnected', () => {
            onShowToast?.(isSwahili ? `Kifaa cha Bluetooth ${devName} kimekatika` : `Bluetooth device ${devName} disconnected`);
          });
          onShowToast?.(isSwahili ? `Kifaa cha Bluetooth ${devName} kimeunganishwa kikamilifu!` : `Bluetooth device ${devName} connected successfully!`);
        }
      } else {
        onShowToast?.(
          isSwahili
            ? 'Web Bluetooth inahitaji Google Chrome kwenye HTTPS au muunganisho wa mfumo'
            : 'Web Bluetooth requires Google Chrome over HTTPS or system-level Bluetooth pairing'
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && (err.name === 'NotFoundError' || err.message.toLowerCase().includes('cancel'))) {
        onShowToast?.(isSwahili ? 'Uchaguzi wa Bluetooth umesitishwa' : 'Bluetooth pairing chooser closed');
      } else {
        console.warn('Bluetooth note:', err);
        onShowToast?.(
          isSwahili
            ? 'Unganisha TV au spika za Bluetooth kupitia mipangilio ya mfumo wako'
            : 'Connect TV screen or Bluetooth speakers via your system settings'
        );
      }
    }
  };

  const [liveChatMessages, setLiveChatMessages] = useState<
    Array<{ author: string; text: string; time: string; isHost?: boolean }>
  >([
    { author: 'Sarah J.', text: 'Welcome everyone to today’s broadcast!', time: '8:00 PM' },
    { author: 'David M.', text: 'Clear audio and video stream.', time: '8:01 PM' },
    { author: 'Grace W.', text: 'Excited for the book club announcements!', time: '8:02 PM' },
    { author: 'Alex K.', text: 'Connecting live from Dar es Salaam. Great visual quality!', time: '8:03 PM' },
    { author: 'Ev Dr. Boniphace J. Ndege (Host)', text: 'Karibuni sana! In today’s live room we are unveiling the creator blueprint and store integration.', time: '8:04 PM', isHost: true },
    { author: 'Neema R.', text: 'Audio clarity is 100% on mobile.', time: '8:04 PM' },
    { author: 'Sarah J.', text: 'If you have questions for Ev Dr. Boniphace J. Ndege, drop them here in the chat anytime.', time: '8:05 PM' },
    { author: 'Baraka T.', text: 'Can we access the digital downloads during this call?', time: '8:06 PM' },
    { author: 'Ev Dr. Boniphace J. Ndege (Host)', text: 'Yes Baraka, all books and resources are instant access in the store!', time: '8:07 PM', isHost: true },
  ]);

  // Easy scroll helpers for Live Meeting Chat
  const scrollToLiveChatBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (liveChatBottomRef.current) {
      liveChatBottomRef.current.scrollIntoView({ behavior });
    }
    setIsLiveChatScrolledUp(false);
  };

  const scrollToLiveChatTop = (behavior: ScrollBehavior = 'smooth') => {
    if (liveChatContainerRef.current) {
      liveChatContainerRef.current.scrollTo({ top: 0, behavior });
    }
  };

  const handleLiveChatScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const distanceFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    setIsLiveChatScrolledUp(distanceFromBottom > 45);
  };

  // Scroll to bottom when live room opens
  useEffect(() => {
    if (activeLiveMeeting) {
      const timer = setTimeout(() => {
        scrollToLiveChatBottom('auto');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeLiveMeeting]);

  // Auto-scroll on new message if user was already near bottom
  useEffect(() => {
    if (!isLiveChatScrolledUp && activeLiveMeeting) {
      scrollToLiveChatBottom('smooth');
    }
  }, [liveChatMessages.length]);

  const formatTZS = (num: number) => {
    return 'TZS ' + Number(num).toLocaleString('en-TZ');
  };

  const totalCart = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* 1. CART MODAL / DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0e1d15] w-full max-w-lg rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-emerald-950/10 dark:border-emerald-500/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                  {isSwahili
                    ? `Kikapu Chako cha Manunuzi (${cartItems.length})`
                    : `Your Shopping Cart (${cartItems.length})`}
                </h3>
              </div>
              <button
                onClick={onCloseCart}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15"
                  >
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <strong className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50 truncate">
                        {item.name}
                      </strong>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {item.condition && (
                          <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">
                            {item.condition}
                          </span>
                        )}
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {formatTZS(item.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => onUpdateCartQty(item.id, -1)}
                          className="w-5 h-5 rounded-md bg-white dark:bg-[#0e1d15] border border-slate-200 dark:border-emerald-800 text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateCartQty(item.id, 1)}
                          className="w-5 h-5 rounded-md bg-white dark:bg-[#0e1d15] border border-slate-200 dark:border-emerald-800 text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 cursor-pointer"
                      title={isSwahili ? 'Ondoa bidhaa' : 'Remove item'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold">
                    {isSwahili ? 'Kikapu chako kiko tupu.' : 'Your cart is empty.'}
                  </p>
                  <p className="text-xs mt-1">
                    {isSwahili
                      ? 'Ongeza vitabu, vifaa au bidhaa kutoka Soko la Dunia!'
                      : 'Add books, tech, or items from Global Shopping!'}
                  </p>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-5 border-t border-emerald-950/10 dark:border-emerald-500/15 bg-slate-50/50 dark:bg-emerald-950/30 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-600 dark:text-emerald-200">
                    {isSwahili ? 'Jumla ya Agizo' : 'Order Subtotal'}
                  </span>
                  <strong className="text-base font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatTZS(totalCart)}
                  </strong>
                </div>

                <div className="space-y-2 pt-2">
                  <input
                    type="text"
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    placeholder={isSwahili ? 'Jina Kamili kwa Uwasilishaji' : 'Full Name for Delivery'}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-[#0e1d15] border border-slate-200 dark:border-emerald-800 rounded-xl"
                  />
                  <input
                    type="email"
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    placeholder={isSwahili ? 'Anwani ya Barua Pepe' : 'Email Address'}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-[#0e1d15] border border-slate-200 dark:border-emerald-800 rounded-xl"
                  />
                </div>

                <button
                  onClick={() => {
                    onCheckout(checkoutName, checkoutEmail);
                    setCheckoutName('');
                    setCheckoutEmail('');
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-md shadow-emerald-700/25 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSwahili ? 'Endelea Kulipa kwa Usalama' : 'Proceed to Secure Checkout'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. CREATE POST MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0e1d15] w-full max-w-lg rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/10 dark:border-emerald-500/15 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Tunga Chapisho' : 'Create Post'}
              </h3>
              <button
                onClick={onClosePostModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Mada / Lebo' : 'Topic / Tag'}
                </label>
                <select
                  value={postTag}
                  onChange={(e) => setPostTag(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                >
                  <option value="Digital Life">{isSwahili ? 'Maisha ya Kidijitali' : 'Digital Life'}</option>
                  <option value="Global Shopping">{isSwahili ? 'Soko la Dunia' : 'Global Shopping'}</option>
                  <option value="Creator Economy">{isSwahili ? 'Uchumi wa Muundaji' : 'Creator Economy'}</option>
                  <option value="Books & Knowledge">{isSwahili ? 'Vitabu & Maarifa' : 'Books & Knowledge'}</option>
                  <option value="Technology">{isSwahili ? 'Teknolojia' : 'Technology'}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Kichwa cha Habari (Hiari)' : 'Headline (Optional)'}
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder={isSwahili ? 'Kichwa cha chapisho...' : 'Post headline'}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Una wazo gani leo?' : "What's on your mind?"}
                </label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={3}
                  placeholder={
                    isSwahili
                      ? 'Shiriki hadithi, maarifa, au tangazo na jamii...'
                      : 'Share a story, insight, or announcement with the community...'
                  }
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              {/* Selective Upload Image Section inside card grey background color */}
              <div className="p-4 bg-zinc-800/90 dark:bg-zinc-850/95 border border-zinc-700/80 rounded-2xl space-y-3 shadow-md text-white">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-200">
                    {isSwahili ? 'Picha ya Makala / Jalada (Pakia)' : 'Article Image / Cover (Upload)'}
                  </label>
                  {/* Selective ratio 1:1 or 16:9 */}
                  <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-zinc-600/50">
                    <button
                      type="button"
                      onClick={() => setPostImageAspectRatio('1:1')}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        postImageAspectRatio === '1:1'
                          ? 'bg-[#ffd700] text-slate-950 shadow-sm'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      1:1
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostImageAspectRatio('16:9')}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        postImageAspectRatio === '16:9'
                          ? 'bg-[#ffd700] text-slate-950 shadow-sm'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      16:9
                    </button>
                  </div>
                </div>

                {/* Paste image URL or browse file... Upload Image */}
                <div className="space-y-2.5">
                  <div>
                    <input
                      type="url"
                      value={postImageUrl}
                      onChange={(e) => setPostImageUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="w-full h-10 px-3.5 text-xs bg-zinc-900/90 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-[#ffd700]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-[1px] flex-1 bg-zinc-700/60" />
                    <span className="text-[10px] uppercase font-bold text-zinc-400">or</span>
                    <div className="h-[1px] flex-1 bg-zinc-700/60" />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <label className="flex-1 h-10 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (typeof evt.target?.result === 'string') {
                                setPostImageUrl(evt.target.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Upload className="w-3.5 h-3.5 text-zinc-400" />
                      <span>browse file...</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = 'image/*';
                        fileInput.onchange = (e: any) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (typeof evt.target?.result === 'string') {
                                setPostImageUrl(evt.target.result);
                              }
                            };
                            reader.readAsDataURL(f);
                          }
                        };
                        fileInput.click();
                      }}
                      className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shrink-0 active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#ffd700]" />
                      <span>Upload Image</span>
                    </button>
                  </div>
                </div>

                {/* Preview fitted into card with selected ratio */}
                {postImageUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-zinc-600 bg-black/80 shadow-inner">
                    <div
                      className={`w-full ${
                        postImageAspectRatio === '1:1' ? 'aspect-square max-h-56' : 'aspect-video max-h-48'
                      } flex items-center justify-center overflow-hidden bg-black`}
                    >
                      <img
                        src={postImageUrl}
                        alt="Post preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setPostImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 hover:bg-rose-600 text-white border border-white/20 transition-all cursor-pointer shadow-md"
                      title={isSwahili ? 'Ondoa picha' : 'Remove image'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/80 text-[#ffd700] border border-[#ffd700]/40">
                      Ratio: {postImageAspectRatio}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (!postContent.trim()) return;
                  onCreatePost(postContent, postTag, postTitle, postImageUrl, postImageAspectRatio);
                  setPostContent('');
                  setPostTitle('');
                  setPostImageUrl('');
                  onClosePostModal();
                }}
                disabled={!postContent.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-md transition-all active:scale-98"
              >
                {isSwahili ? 'Chapisha Chapisho' : 'Publish Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. BLOG MODAL */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0e1d15] w-full max-w-xl rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/10 dark:border-emerald-500/15 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Andika Makala ya Blog' : 'Write Blog Article'}
              </h3>
              <button
                onClick={onCloseBlogModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Kichwa cha Makala' : 'Article Title'}
                </label>
                <input
                  type="text"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder={isSwahili ? 'Weka kichwa cha makala...' : 'Enter a compelling title'}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Kategoria' : 'Category'}
                </label>
                <select
                  value={blogCat}
                  onChange={(e) => setBlogCat(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                >
                  <option value="Technology">{isSwahili ? 'Teknolojia' : 'Technology'}</option>
                  <option value="Business">{isSwahili ? 'Biashara' : 'Business'}</option>
                  <option value="Books">{isSwahili ? 'Vitabu' : 'Books'}</option>
                  <option value="Lifestyle">{isSwahili ? 'Maisha & Uongozi' : 'Lifestyle'}</option>
                </select>
              </div>

              {/* Image Upload Part inside card grey background color */}
              <div className="p-4 bg-zinc-800/90 dark:bg-zinc-850/95 border border-zinc-700/80 rounded-2xl space-y-3 shadow-md text-white">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-200">
                    {isSwahili ? 'Picha ya Makala / Jalada (Pakia)' : 'Article Image / Cover (Upload)'}
                  </label>
                  <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-zinc-600/50">
                    <button
                      type="button"
                      onClick={() => setBlogImageAspectRatio('1:1')}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        blogImageAspectRatio === '1:1'
                          ? 'bg-[#ffd700] text-slate-950 shadow-sm'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      1:1
                    </button>
                    <button
                      type="button"
                      onClick={() => setBlogImageAspectRatio('16:9')}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        blogImageAspectRatio === '16:9'
                          ? 'bg-[#ffd700] text-slate-950 shadow-sm'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      16:9
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <input
                      type="url"
                      value={blogImageUrl}
                      onChange={(e) => setBlogImageUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="w-full h-10 px-3.5 text-xs bg-zinc-900/90 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-[#ffd700]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-[1px] flex-1 bg-zinc-700/60" />
                    <span className="text-[10px] uppercase font-bold text-zinc-400">or</span>
                    <div className="h-[1px] flex-1 bg-zinc-700/60" />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <label className="flex-1 h-10 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (typeof evt.target?.result === 'string') {
                                setBlogImageUrl(evt.target.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Upload className="w-3.5 h-3.5 text-zinc-400" />
                      <span>browse file...</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = 'image/*';
                        fileInput.onchange = (e: any) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (typeof evt.target?.result === 'string') {
                                setBlogImageUrl(evt.target.result);
                              }
                            };
                            reader.readAsDataURL(f);
                          }
                        };
                        fileInput.click();
                      }}
                      className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shrink-0 active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#ffd700]" />
                      <span>Upload Image</span>
                    </button>
                  </div>

                  {blogImageUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-600 bg-black/80 shadow-inner">
                      <div
                        className={`w-full ${
                          blogImageAspectRatio === '1:1' ? 'aspect-square max-h-56' : 'aspect-video max-h-48'
                        } flex items-center justify-center overflow-hidden bg-black`}
                      >
                        <img
                          src={blogImageUrl}
                          alt="Blog cover preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setBlogImageUrl('')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 hover:bg-rose-600 text-white border border-white/20 transition-all cursor-pointer shadow-md"
                        title={isSwahili ? 'Ondoa picha' : 'Remove image'}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/80 text-[#ffd700] border border-[#ffd700]/40">
                        Ratio: {blogImageAspectRatio}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Maudhui Kamili ya Makala' : 'Full Article Content'}
                </label>
                <textarea
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  rows={8}
                  placeholder={isSwahili ? 'Andika makala yako kwa urefu hapa...' : 'Write your article in full prose...'}
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <button
                onClick={() => {
                  if (!blogTitle.trim() || !blogContent.trim()) return;
                  onCreateBlog(blogTitle, blogCat, blogContent, blogImageUrl || undefined);
                  setBlogTitle('');
                  setBlogContent('');
                  setBlogImageUrl('');
                  onCloseBlogModal();
                }}
                disabled={!blogTitle.trim() || !blogContent.trim()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
              >
                {isSwahili ? 'Chapisha Makala' : 'Publish Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. BOOK PUBLISH MODAL (Delegated to BookPublishModal in App.tsx) */}


      {/* 5. UPLOAD VIDEO MODAL */}
      <VideoUploadModal
        isOpen={isVideoUploadModalOpen}
        onClose={onCloseVideoUploadModal}
        onUpload={(payload) => {
          onCreateVideo(
            payload.title,
            payload.description,
            payload.videoUrl,
            payload.thumbnailUrl,
            payload.duration,
            payload.category
          );
        }}
        language={language}
      />

      {/* 6. CREATE MEETING MODAL */}
      {isMeetingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0e1d15] w-full max-w-lg rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/10 dark:border-emerald-500/15 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Unda Mkutano au Matangazo Mubashara' : 'Create Meeting or Live Broadcast'}
              </h3>
              <button
                onClick={onCloseMeetingModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Mada / Kichwa cha Mkutano' : 'Meeting Topic / Title'}
                </label>
                <input
                  type="text"
                  value={meetTitle}
                  onChange={(e) => setMeetTitle(e.target.value)}
                  placeholder={
                    isSwahili
                      ? 'Mf. Darasa la Kimkakati na Ev Dr. Boniphace J. Ndege'
                      : 'E.g. Strategy Masterclass with Ev Dr. Boniphace J. Ndege'
                  }
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Muda Uliopangwa' : 'Scheduled Time'}
                </label>
                <input
                  type="text"
                  value={meetSchedule}
                  onChange={(e) => setMeetSchedule(e.target.value)}
                  placeholder={isSwahili ? 'Kesho • Saa 1:00 Usiku' : 'Tomorrow • 7:00 PM'}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <button
                onClick={() => {
                  if (!meetTitle.trim()) return;
                  onCreateMeeting(meetTitle, meetSchedule);
                  setMeetTitle('');
                  onCloseMeetingModal();
                }}
                disabled={!meetTitle.trim()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
              >
                {isSwahili ? 'Panga Chumba cha Mkutano' : 'Schedule Meeting Room'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. READER MODAL (Books or Blogs) with subtle reading progress indicator */}
      {activeReadingMaterial && (
        <ReaderModal
          material={activeReadingMaterial}
          onClose={onCloseReaderModal}
          language={language}
        />
      )}

      {/* 8. VIDEO PLAYER MODAL */}
      <VideoPlayerModal
        isOpen={!!activePlayingVideo}
        video={activePlayingVideo}
        onClose={onCloseVideoPlayerModal}
        onSelectVideo={onSelectVideo}
        allVideos={videos}
        language={language}
        onShowToast={onShowToast}
      />

      {/* 9. LIVE ROOM MODAL - SCREEN ALWAYS ACCESSIBLE & VISIBLE */}
      {activeLiveMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`bg-[#05130b] text-white w-full ${
            isStageFullScreen ? 'max-w-[98vw] h-[96vh]' : 'max-w-6xl xl:max-w-7xl max-h-[94vh]'
          } rounded-3xl border-2 border-emerald-500/40 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col transition-all duration-300`}>
            
            {/* Top Modal Header with View Switcher Tabs so screen is never hidden */}
            <div className="p-3 sm:px-6 bg-[#030e07] border-b border-emerald-950/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.6)] flex items-center gap-1.5 tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>{isSwahili ? 'MUBASHARA' : 'LIVE'}</span>
                </span>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate max-w-xs sm:max-w-md">
                    {activeLiveMeeting.title || 'Digital Business & The Future'}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-300">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#ffd700]" />
                      <span>{activeLiveMeeting.participantsCount || 148} {isSwahili ? 'washiriki' : 'watching'}</span>
                    </span>
                    <span>·</span>
                    <span className="text-emerald-400 font-bold">1080p HD Stream</span>
                  </div>
                </div>
              </div>

              {/* View Switcher Tabs: Show Screen, Split View, Show Chat */}
              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-2xl border border-emerald-500/30">
                <button
                  type="button"
                  onClick={() => setLiveMeetingViewMode('screen')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    liveMeetingViewMode === 'screen'
                      ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black shadow-[0_0_10px_rgba(255,215,0,0.35)]'
                      : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
                  }`}
                  title={isSwahili ? 'Onyesha Skrini Pekee' : 'Show Screen Focused'}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>{isSwahili ? 'Skrini' : 'Screen'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLiveMeetingViewMode('split')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    liveMeetingViewMode === 'split'
                      ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black shadow-[0_0_10px_rgba(255,215,0,0.35)]'
                      : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
                  }`}
                  title={isSwahili ? 'Onyesha Skrini na Mazungumzo Pamoja' : 'Split View: Screen + Chat'}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isSwahili ? 'Skrini & Gumzo' : 'Split View'}</span>
                  <span className="sm:hidden">{isSwahili ? 'Pamoja' : 'Split'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLiveMeetingViewMode('chat')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    liveMeetingViewMode === 'chat'
                      ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black shadow-[0_0_10px_rgba(255,215,0,0.35)]'
                      : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
                  }`}
                  title={isSwahili ? 'Onyesha Mazungumzo Pekee' : 'Show Chat Only'}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isSwahili ? 'Gumzo' : 'Chat'}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-600 text-white font-bold">
                    {liveChatMessages.length}
                  </span>
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={handleLeaveMeeting}
                className="p-2 rounded-xl bg-black/40 hover:bg-rose-950 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Close Meeting"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Requesting media banner */}
            {isRequestingMeetingMedia && (
              <div className="bg-emerald-950/95 border-b border-emerald-500/40 p-2.5 px-5 flex items-center justify-between text-xs text-emerald-200 animate-pulse">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ffd700]" />
                  <span>
                    {isSwahili
                      ? 'Inaomba idhini ya kamera na maikrofoni kwenye Google Chrome... Tafadhali bonyeza "Allow" (Ruhusu).'
                      : 'Requesting camera & microphone in Google Chrome... Please select "Allow" when prompted.'}
                  </span>
                </div>
              </div>
            )}

            {/* Permission Denied in Meeting Banner with Chrome Guidance ("Site can ask") */}
            {meetingPermissionError && (
              <div className="bg-amber-950/95 border-b border-amber-500/50 p-3 px-5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200 shadow-md">
                <div className="flex items-start gap-2.5 max-w-xl">
                  <span className="text-base shrink-0">🔒</span>
                  <div>
                    <strong className="text-white block font-bold text-xs">
                      {isSwahili
                        ? 'Chrome: "Site can ask for your camera" (Ruhusa ya Kamera):'
                        : 'Google Chrome: "Site can ask for your camera" (Ready to Prompt):'}
                    </strong>
                    <span className="text-[11px] text-amber-200/90 leading-relaxed block mt-0.5">
                      {meetingPermissionError}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Direct User Click activates the browser permission prompt */}
                  <button
                    type="button"
                    onClick={() => startMediaStream()}
                    disabled={isRequestingMeetingMedia}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black text-xs cursor-pointer shadow-sm hover:brightness-105 flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {isRequestingMeetingMedia ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{isSwahili ? 'Inaomba...' : 'Requesting...'}</span>
                      </>
                    ) : (
                      <span>{isSwahili ? 'Washa Kamera Sasa (Allow)' : 'Activate Camera Now'}</span>
                    )}
                  </button>

                  {/* Video Only option in case microphone is blocked/busy */}
                  <button
                    type="button"
                    onClick={() => startMediaStream(selectedCameraSource, selectedAudioSource, false)}
                    disabled={isRequestingMeetingMedia}
                    className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs cursor-pointer"
                    title={isSwahili ? 'Jaribu kamera pekee bila maikrofoni' : 'Try video only without microphone'}
                  >
                    {isSwahili ? 'Kamera Pekee' : 'Video Only'}
                  </button>

                  {/* If embedded in iframe, open standalone tab */}
                  {isIframeEnvironment() && (
                    <button
                      type="button"
                      onClick={openStandaloneTab}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                      title={isSwahili ? 'Fungua kwenye dirisha kamili la Chrome ili kuonyesha kidirisha cha ruhusa' : 'Open in direct Chrome tab to trigger native permission pop-up'}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#ffd700]" />
                      <span>{isSwahili ? 'Fungua Dirisha Kamili la Chrome' : 'Open Standalone Tab'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Alert / Prompt banner to Show Screen */}
            {liveMeetingViewMode === 'chat' && (
              <div className="bg-gradient-to-r from-[#031d10] via-[#05321c] to-[#031d10] p-3 px-5 border-b-2 border-[#ffd700] flex items-center justify-between text-xs font-bold text-white shadow-lg">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffd700] animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.8)]" />
                  <div>
                    <span className="text-[#ffd700] font-black uppercase mr-1.5">
                      {isSwahili ? 'Skrini imefichwa:' : 'Screen is hidden:'}
                    </span>
                    <span className="text-white">
                      {isSwahili
                        ? 'Bonyeza hapa kuonyesha skrini ya matangazo ya moja kwa moja!'
                        : 'Click here to show the live broadcast screen!'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLiveMeetingViewMode('split')}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black text-xs cursor-pointer shadow-[0_0_12px_rgba(255,215,0,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <Monitor className="w-3.5 h-3.5 text-slate-950" />
                  <span>{isSwahili ? 'Onyesha Skrini Sasa' : 'Show Screen Now'}</span>
                </button>
              </div>
            )}

            {/* Main Stage & Chat Container */}
            <div className={`flex-1 overflow-hidden grid ${
              liveMeetingViewMode === 'screen'
                ? 'grid-cols-1'
                : liveMeetingViewMode === 'chat'
                ? 'grid-cols-1'
                : 'grid-cols-1 lg:grid-cols-12'
            }`}>
              
              {/* LIVE VIDEO / SCREEN STAGE (Visible in 'screen' and 'split' modes) */}
              {(liveMeetingViewMode === 'screen' || liveMeetingViewMode === 'split') && (
                <div className={`${
                  liveMeetingViewMode === 'screen'
                    ? 'col-span-12'
                    : 'lg:col-span-7 xl:col-span-8'
                } flex flex-col justify-between bg-black relative border-b lg:border-b-0 lg:border-r border-emerald-950/80`}>
                  
                  {/* Status & Host Bar Outside Screen Frame - Clear and Professional */}
                  <div className="p-3 px-4 bg-[#031008] border-b border-emerald-950 flex flex-wrap items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-[#ffd700]/40 flex items-center justify-center shrink-0">
                        <Crown className="w-4 h-4 text-[#ffd700]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-white">
                            Ev Dr. Boniphace J. Ndege (Host)
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {isSwahili ? 'Mwenyeji Mwenye Uthibitisho' : 'Verified Author & Creator'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-emerald-400">
                          <span className="flex items-center gap-1 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{isSwahili ? 'Anazungumza Moja kwa Moja' : 'Speaking Live'}</span>
                          </span>
                          <span className="text-emerald-700">·</span>
                          <span className="text-slate-300">
                            {isScreenShareActive
                              ? (isSwahili ? 'Skrini Inashirikiwa' : 'Screen Share Active')
                              : (cameraActive ? (isSwahili ? 'Kamera Inachukua Video Moja kwa Moja' : 'Camera Capturing Live Video') : (isSwahili ? 'Kamera Imetulia' : 'Standby Screen'))}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Real Microphone Sound Meter */}
                    <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                      <span className="text-[10px] font-bold text-slate-300">
                        {isSwahili ? 'Sauti ya Maikrofoni:' : 'Mic Audio:'}
                      </span>
                      {micEnabled ? (
                        <div className="flex items-center gap-0.5">
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                          <span className={`w-1 h-3 rounded-full transition-all ${micAudioLevel > 5 ? 'bg-emerald-400 scale-y-125' : 'bg-emerald-900'}`} />
                          <span className={`w-1 h-4 rounded-full transition-all ${micAudioLevel > 20 ? 'bg-[#ffd700] scale-y-125' : 'bg-emerald-900'}`} />
                          <span className={`w-1 h-3 rounded-full transition-all ${micAudioLevel > 40 ? 'bg-emerald-400 scale-y-125' : 'bg-emerald-900'}`} />
                          <span className={`w-1 h-2 rounded-full transition-all ${micAudioLevel > 60 ? 'bg-emerald-300 scale-y-125' : 'bg-emerald-900'}`} />
                          <span className="text-[10px] font-mono text-emerald-400 ml-1.5">
                            {micAudioLevel > 5 ? `${micAudioLevel}%` : (isSwahili ? 'Wazi' : 'Clear')}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-400 text-[10px] font-bold">
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>{isSwahili ? 'Imenyamazishwa' : 'Muted'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Screen Content: Pure and Clear - Zero objects or text on image or video */}
                  <div className="flex-1 w-full min-h-[300px] sm:min-h-[460px] flex items-center justify-center relative overflow-hidden bg-black">
                    {/* Pure Video Stream: NO text, NO overlay buttons, NO badges on video */}
                    <video
                      ref={hostVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-contain bg-black ${cameraActive || isScreenShareActive ? 'block' : 'hidden'}`}
                    />

                    {/* Clear Standby View: NO text, NO overlay buttons, NO badges on image */}
                    {!cameraActive && !isScreenShareActive && (
                      <img
                        src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1600&q=85"
                        alt=""
                        className="w-full h-full object-contain bg-black"
                      />
                    )}
                  </div>

                  {/* Conference & Stage Controls Bar */}
                  <div className="p-3 sm:px-5 bg-[#04120a] flex flex-wrap items-center justify-between gap-3 border-t border-emerald-950">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* 1. Microphone Toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          const next = !micEnabled;
                          setMicEnabled(next);
                          if (!next) stopAudioAnalyser();
                        }}
                        className={`p-2.5 sm:px-3.5 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                          micEnabled ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                        }`}
                        title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
                      >
                        {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        <span>{micEnabled ? (isSwahili ? 'Maikrofoni Imewashwa' : 'Mic On') : (isSwahili ? 'Maikrofoni Imezimwa' : 'Muted')}</span>
                      </button>

                      {/* 2. Camera Toggle */}
                      <button
                        type="button"
                        onClick={() => setCamEnabled(!camEnabled)}
                        className={`p-2.5 sm:px-3.5 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                          camEnabled ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                        }`}
                        title={camEnabled ? 'Turn camera off' : 'Turn camera on'}
                      >
                        {camEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                        <span>{camEnabled ? (isSwahili ? 'Kamera Imewashwa' : 'Cam On') : (isSwahili ? 'Kamera Imezimwa' : 'Cam Off')}</span>
                      </button>

                      {/* 3. Camera & External Device Selector (Mobile, External camera like Konica/Canon, USB capture) */}
                      <button
                        type="button"
                        onClick={() => {
                          refreshDevices();
                          setShowDeviceSelectorModal(true);
                        }}
                        className="p-2.5 sm:px-3.5 rounded-xl bg-black/60 hover:bg-emerald-950 text-slate-200 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                        title={isSwahili ? 'Chagua Kamera (Kamera ya simu, Kamera ya nje kama Konica, n.k.)' : 'Select Camera (Mobile, External camera like Konica/Canon, etc.)'}
                      >
                        <Camera className="w-4 h-4 text-[#ffd700]" />
                        <span className="hidden sm:inline">{isSwahili ? 'Badili Kamera' : 'Camera Devices'}</span>
                        <Sliders className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      {/* 4. Real Screen Share */}
                      <button
                        type="button"
                        onClick={handleToggleScreenShare}
                        className={`p-2.5 sm:px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                          isScreenShareActive
                            ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black shadow-[0_0_14px_rgba(255,215,0,0.5)]'
                            : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                        }`}
                        title={isSwahili ? 'Shiriki Skrini / Dirisha' : 'Share Screen / Window'}
                      >
                        <Monitor className="w-4 h-4" />
                        <span>{isScreenShareActive ? (isSwahili ? 'Acha Kushiriki Skrini' : 'Stop Sharing') : (isSwahili ? 'Shiriki Skrini' : 'Screen Share')}</span>
                      </button>

                      {/* 5. Connect TV Screen & Bluetooth */}
                      <button
                        type="button"
                        onClick={() => setShowConnectTVModal(true)}
                        className="p-2.5 sm:px-3.5 rounded-xl bg-gradient-to-r from-emerald-900/60 to-emerald-950/80 hover:bg-emerald-900 text-[#ffd700] border border-[#ffd700]/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                        title={isSwahili ? 'Unganisha kwenye TV Screen / Bluetooth' : 'Connect to TV Screen / Bluetooth'}
                      >
                        <Tv className="w-4 h-4 text-[#ffd700]" />
                        <Bluetooth className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="hidden md:inline">{isSwahili ? 'Unganisha TV / Bluetooth' : 'TV Screen / Bluetooth'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Picture in Picture */}
                      <button
                        type="button"
                        onClick={handlePictureInPicture}
                        className="p-2.5 rounded-xl bg-black/50 hover:bg-emerald-950 text-slate-300 hover:text-white border border-emerald-900/40 transition-colors cursor-pointer"
                        title={isSwahili ? 'Fungua Skrini ya Pop-out (Picture-in-Picture)' : 'Pop-out Floating Video (Picture-in-Picture)'}
                      >
                        <Cast className="w-4 h-4 text-emerald-300" />
                      </button>

                      {/* Fullscreen stage toggle */}
                      <button
                        type="button"
                        onClick={() => setIsStageFullScreen(!isStageFullScreen)}
                        className="p-2.5 rounded-xl bg-black/50 hover:bg-emerald-950 text-slate-300 hover:text-white border border-emerald-900/40 transition-colors cursor-pointer"
                        title={isStageFullScreen ? 'Normal size' : 'Expand Screen'}
                      >
                        {isStageFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </button>

                      {/* Leave Meeting */}
                      <button
                        type="button"
                        onClick={handleLeaveMeeting}
                        className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white cursor-pointer shadow-md active:scale-95 transition-all"
                      >
                        {isSwahili ? 'Ondoka' : 'Leave'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* LIVE CHAT PANE (Visible in 'chat' and 'split' modes) */}
              {(liveMeetingViewMode === 'chat' || liveMeetingViewMode === 'split') && (
                <div className={`${
                  liveMeetingViewMode === 'chat'
                    ? 'col-span-12'
                    : 'lg:col-span-5 xl:col-span-4'
                } bg-[#08170f] flex flex-col justify-between h-full min-h-[380px] sm:min-h-[440px] relative`}>
                  
                  {/* Live Meeting Chat Header with Easy Scroll Controls */}
                  <div className="p-3 px-4 border-b border-emerald-900/40 flex items-center justify-between bg-[#04120a] shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">
                          {isSwahili ? 'Mazungumzo ya Mkutano' : 'Live Meeting Chat'}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {liveChatMessages.length} {isSwahili ? 'jumbe' : 'messages'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Show Screen Button */}
                      <button
                        type="button"
                        onClick={() => setLiveMeetingViewMode('split')}
                        className="p-1.5 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                        title={isSwahili ? 'Onyesha Skrini ya Matangazo' : 'Show Live Screen'}
                      >
                        <Tv className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span>{isSwahili ? 'Onyesha Skrini' : 'Show Screen'}</span>
                      </button>

                      {/* Quick Easy Scroll to Bottom control */}
                      <button
                        type="button"
                        onClick={() => scrollToLiveChatBottom('smooth')}
                        className="p-1.5 px-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 text-[#ffd700] hover:text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                        title={isSwahili ? 'Shuka chini kwa urahisi' : 'Easy Scroll to bottom'}
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span>{isSwahili ? 'Shuka Chini' : 'Easy Scroll'}</span>
                      </button>

                      {/* Scroll to Top control */}
                      <button
                        type="button"
                        onClick={() => scrollToLiveChatTop('smooth')}
                        className="p-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={isSwahili ? 'Panda juu' : 'Scroll to top'}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Message Stream with Easy Smooth Scroll */}
                  <div
                    ref={liveChatContainerRef}
                    onScroll={handleLiveChatScroll}
                    className="flex-1 p-3.5 space-y-3 overflow-y-auto max-h-[380px] sm:max-h-[460px] scroll-smooth overscroll-contain touch-pan-y"
                  >
                    {liveChatMessages.map((msg, idx) => {
                      const isMe = msg.author === 'You';
                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-2.5 text-xs p-3 rounded-2xl border transition-all ${
                            isMe
                              ? 'bg-emerald-900/40 border-emerald-500/40 ml-4 shadow-sm'
                              : msg.isHost
                              ? 'bg-gradient-to-br from-amber-950/40 via-[#181a0b] to-[#0a1209] border-[#ffd700]/40 shadow-sm mr-2'
                              : 'bg-emerald-950/50 border-emerald-900/30 mr-2 hover:border-emerald-700/40'
                          }`}
                        >
                          {/* Avatar Initials Badge */}
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-sm ${
                              isMe
                                ? 'bg-emerald-600 text-white'
                                : msg.isHost
                                ? 'bg-gradient-to-br from-[#ffd700] to-[#f5d061] text-slate-950 font-black ring-1 ring-[#ffd700]'
                                : 'bg-emerald-900 text-emerald-200 border border-emerald-700/40'
                            }`}
                          >
                            {msg.isHost ? (
                              <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
                            ) : (
                              msg.author.charAt(0)
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span
                                className={`font-bold truncate ${
                                  msg.isHost
                                    ? 'text-[#ffd700] font-black'
                                    : isMe
                                    ? 'text-emerald-300 font-bold'
                                    : 'text-emerald-400 font-semibold'
                                }`}
                              >
                                {msg.author}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                                {msg.time}
                              </span>
                            </div>
                            <p className="text-slate-200 leading-relaxed break-words text-xs">
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={liveChatBottomRef} className="h-1" />
                  </div>

                  {/* Direct Easy Scroll Bar */}
                  <div className="px-4 py-1.5 bg-[#030d07] border-t border-emerald-950/80 flex items-center justify-between shrink-0">
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {isSwahili ? 'Sogeza mazungumzo:' : 'Live Chat Navigation:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollToLiveChatBottom('smooth')}
                      className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 border border-[#ffd700]/50 transition-all cursor-pointer active:scale-95"
                      title="Easy Scroll to bottom"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-[#ffd700]" />
                      <span>{isSwahili ? 'Shuka Chini ↓' : 'Easy Scroll ↓'}</span>
                    </button>
                  </div>

                  {/* Floating Easy Scroll Button when scrolled up */}
                  {isLiveChatScrolledUp && (
                    <button
                      type="button"
                      onClick={() => scrollToLiveChatBottom('smooth')}
                      className="absolute bottom-28 right-4 z-30 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold shadow-2xl shadow-black flex items-center gap-1.5 border border-[#ffd700]/70 backdrop-blur-md animate-bounce cursor-pointer transition-all"
                      title="Easy Scroll to latest messages"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-[#ffd700]" />
                      <span>{isSwahili ? 'Shuka Chini ↓' : 'Easy Scroll ↓'}</span>
                    </button>
                  )}

                  {/* Quick Reactions Bar */}
                  <div className="px-3 pt-2.5 pb-2 border-t border-emerald-900/40 bg-[#04120a] flex items-center gap-1.5 overflow-x-auto shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">
                      {isSwahili ? 'Mwitikio:' : 'React:'}
                    </span>
                    {['👏', '🔥', '❤️', '👍', 'Inspiring!', 'Questions?'].map((reaction) => (
                      <button
                        key={reaction}
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          setLiveChatMessages((prev) => [
                            ...prev,
                            { author: 'You', text: reaction, time: timeStr },
                          ]);
                          setTimeout(() => scrollToLiveChatBottom('smooth'), 50);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-slate-200 hover:text-white border border-emerald-800/50 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-95 hover:border-[#ffd700]/40"
                      >
                        {reaction}
                      </button>
                    ))}
                  </div>

                  {/* Chat Input Bar */}
                  <div className="p-3 bg-[#04120a] border-t border-emerald-900/40 shrink-0">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!liveChatInput.trim()) return;
                        const now = new Date();
                        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        setLiveChatMessages((prev) => [
                          ...prev,
                          { author: 'You', text: liveChatInput.trim(), time: timeStr },
                        ]);
                        setLiveChatInput('');
                        setTimeout(() => scrollToLiveChatBottom('smooth'), 50);
                      }}
                      className="flex items-center gap-1.5 bg-[#07170f] border border-emerald-800/50 rounded-2xl p-1.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20"
                    >
                      <input
                        type="text"
                        value={liveChatInput}
                        onChange={(e) => setLiveChatInput(e.target.value)}
                        placeholder={isSwahili ? 'Piga gumzo na washiriki wa mkutano...' : 'Chat with meeting participants...'}
                        className="flex-1 h-8 px-3 text-xs bg-transparent text-white placeholder-slate-400 focus:outline-none min-w-0"
                      />
                      <button
                        type="submit"
                        disabled={!liveChatInput.trim()}
                        className="h-8 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-40 text-white text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isSwahili ? 'Tuma' : 'Send'}</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9B. CAMERA & AUDIO DEVICE SELECTOR MODAL (Mobile front/back, Konica, Canon, external webcams, Bluetooth mic) */}
      {showDeviceSelectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#05140b] text-white w-full max-w-lg rounded-3xl border-2 border-emerald-500/40 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/80 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-950 border border-[#ffd700]/40">
                  <Camera className="w-5 h-5 text-[#ffd700]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {isSwahili ? 'Chagua Kamera & Vifaa vya Sauti' : 'Camera & Microphone Devices'}
                  </h3>
                  <p className="text-[11px] text-emerald-300">
                    {isSwahili
                      ? 'Kamera ya simu, kamera ya nje kama Konica, Canon, USB capture'
                      : 'Mobile camera, external camera like Konica/Canon, USB capture'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDeviceSelectorModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-950 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Video Camera Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#ffd700] flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    <span>{isSwahili ? 'Chanzo cha Kamera (Video Input)' : 'Camera Source (Video Input)'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={refreshDevices}
                    className="text-[10px] text-emerald-300 hover:text-[#ffd700] flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{isSwahili ? 'Sasisha Vifaa' : 'Refresh Devices'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {/* Preset 1: Mobile Front / Selfie Camera */}
                  <label
                    onClick={() => setSelectedCameraSource('user')}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedCameraSource === 'user'
                        ? 'bg-emerald-950/80 border-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.25)]'
                        : 'bg-black/40 border-emerald-900/40 hover:border-emerald-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {isSwahili ? 'Kamera ya Mbele / Simu (Selfie / User)' : 'Front / Mobile Camera (Selfie / User)'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isSwahili ? 'Kamera ya mbele ya simu au webcam iliyojengwa ndani' : 'Default front-facing mobile lens or laptop webcam'}
                        </div>
                      </div>
                    </div>
                    {selectedCameraSource === 'user' && <Check className="w-4 h-4 text-[#ffd700]" />}
                  </label>

                  {/* Preset 2: Mobile Back / Environment Camera */}
                  <label
                    onClick={() => setSelectedCameraSource('environment')}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedCameraSource === 'environment'
                        ? 'bg-emerald-950/80 border-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.25)]'
                        : 'bg-black/40 border-emerald-900/40 hover:border-emerald-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {isSwahili ? 'Kamera ya Nyuma / Simu (Rear / Environment HD)' : 'Back / Mobile Camera (Rear / Environment HD)'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isSwahili ? 'Kamera yenye ubora wa juu ya nyuma ya simu' : 'High-resolution back lens for clear environment capture'}
                        </div>
                      </div>
                    </div>
                    {selectedCameraSource === 'environment' && <Check className="w-4 h-4 text-[#ffd700]" />}
                  </label>

                  {/* Detected External Cameras (Konica, Canon, USB Video, Cam Link, etc.) */}
                  {videoDevices.length > 0 ? (
                    videoDevices.map((device, idx) => {
                      const isSelected = selectedCameraSource === device.deviceId;
                      const label = device.label || `External Camera ${idx + 1} (${device.deviceId.slice(0, 8)}...)`;
                      return (
                        <label
                          key={device.deviceId}
                          onClick={() => setSelectedCameraSource(device.deviceId)}
                          className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-950/80 border-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.25)]'
                              : 'bg-black/40 border-emerald-900/40 hover:border-emerald-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Laptop className="w-4 h-4 text-emerald-400" />
                            <div>
                              <div className="text-xs font-bold text-white">{label}</div>
                              <div className="text-[10px] text-slate-400">
                                {isSwahili ? 'Kamera ya Nje (Konica / Canon / USB capture)' : 'External Camera (Konica / Canon / USB capture)'}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#ffd700]" />}
                        </label>
                      );
                    })
                  ) : (
                    <div className="p-3 rounded-2xl bg-black/40 border border-emerald-900/40 text-[11px] text-slate-400 leading-relaxed">
                      💡 {isSwahili
                        ? 'Kutumia kamera ya nje kama Konica Minolta au Canon: Iunganishe kupitia kadi ya USB capture au programu ya kamera na ubofye "Sasisha Vifaa".'
                        : 'To use external cameras like Konica Minolta or Canon: Connect via HDMI-to-USB capture card / webcam utility and tap "Refresh Devices".'}
                    </div>
                  )}
                </div>
              </div>

              {/* Microphone Input Section */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#ffd700] mb-2 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isSwahili ? 'Chanzo cha Maikrofoni (Audio Input)' : 'Microphone Source (Audio Input)'}</span>
                </label>

                <div className="space-y-2">
                  <label
                    onClick={() => setSelectedAudioSource('default')}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedAudioSource === 'default'
                        ? 'bg-emerald-950/80 border-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.25)]'
                        : 'bg-black/40 border-emerald-900/40 hover:border-emerald-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Mic className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {isSwahili ? 'Maikrofoni ya Kawaida ya Mfumo' : 'Default System Microphone'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isSwahili ? 'Kipaza sauti cha ndani chenye kuondoa mwangwi' : 'Built-in mic with echo cancellation & noise suppression'}
                        </div>
                      </div>
                    </div>
                    {selectedAudioSource === 'default' && <Check className="w-4 h-4 text-[#ffd700]" />}
                  </label>

                  {audioDevices.map((device, idx) => {
                    const isSelected = selectedAudioSource === device.deviceId;
                    const label = device.label || `Microphone ${idx + 1}`;
                    return (
                      <label
                        key={device.deviceId}
                        onClick={() => setSelectedAudioSource(device.deviceId)}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950/80 border-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.25)]'
                            : 'bg-black/40 border-emerald-900/40 hover:border-emerald-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                          <div>
                            <div className="text-xs font-bold text-white">{label}</div>
                            <div className="text-[10px] text-slate-400">
                              {isSwahili ? 'Kifaa cha sauti cha nje / Bluetooth' : 'External audio device / Bluetooth'}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#ffd700]" />}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 mt-2 border-t border-emerald-950/80 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowDeviceSelectorModal(false)}
                className="px-4 py-2 rounded-xl bg-black/40 hover:bg-emerald-950 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                {isSwahili ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  startMediaStream(selectedCameraSource, selectedAudioSource);
                  setShowDeviceSelectorModal(false);
                  onShowToast?.(isSwahili ? 'Kamera na vifaa vimebadilishwa kwa uwazi!' : 'Camera & audio devices updated clearly!');
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#d4af37] text-slate-950 text-xs font-black shadow-[0_0_14px_rgba(255,215,0,0.4)] transition-all cursor-pointer"
              >
                {isSwahili ? 'Tumia Kamera Hii' : 'Apply & Activate Camera'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9C. CONNECT TO TV SCREEN & BLUETOOTH MODAL */}
      {showConnectTVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#05140b] text-white w-full max-w-lg rounded-3xl border-2 border-emerald-500/40 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/80 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-950 border border-[#ffd700]/40">
                  <Tv className="w-5 h-5 text-[#ffd700]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {isSwahili ? 'Unganisha kwenye Skrini ya TV na Bluetooth' : 'Connect to TV Screen & Bluetooth'}
                  </h3>
                  <p className="text-[11px] text-emerald-300">
                    {isSwahili
                      ? 'Tazama au tangaza kwenye skrini ya TV, monita ya pili, au spika za Bluetooth'
                      : 'Display stream on TV screens, second monitors, or Bluetooth sound systems'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConnectTVModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-950 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {/* Option 1: Picture-in-Picture to TV/External screen */}
              <div className="p-4 rounded-2xl bg-black/40 border border-emerald-900/40 hover:border-emerald-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-300 shrink-0">
                    <Cast className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {isSwahili ? '1. Pop-out / Picture-in-Picture kwa TV' : '1. Pop-out / Picture-in-Picture to TV'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {isSwahili
                        ? 'Hutengeneza dirisha huru la video unaloweza kulisogeza na kulipanua kwenye TV au monita ya pili.'
                        : 'Floats a clear video window that you can drag and maximize onto your TV or external screen.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handlePictureInPicture();
                    setShowConnectTVModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white text-xs font-bold shrink-0 shadow-md cursor-pointer transition-all"
                >
                  {isSwahili ? 'Fungua Pop-out' : 'Open Pop-out'}
                </button>
              </div>

              {/* Option 2: Bluetooth Device Pairing */}
              <div className="p-4 rounded-2xl bg-black/40 border border-emerald-900/40 hover:border-emerald-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-300 shrink-0">
                    <Bluetooth className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {isSwahili ? '2. Unganisha Bluetooth (Spika / Sauti)' : '2. Connect Bluetooth (Speakers / Audio)'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {isSwahili
                        ? 'Unganisha spika ya Bluetooth, soundbar au vipokea sauti kwa sauti safi kabisa.'
                        : 'Pair Bluetooth soundbars, TV audio systems, or external wireless headsets for crisp sound.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleBluetoothConnect}
                  className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold shrink-0 shadow-md cursor-pointer transition-all"
                >
                  {isSwahili ? 'Tafuta Bluetooth' : 'Pair Bluetooth'}
                </button>
              </div>

              {/* Option 3: Wireless Display / Smart TV Mirroring */}
              <div className="p-4 rounded-2xl bg-black/40 border border-emerald-900/40 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#ffd700]/10 text-[#ffd700] shrink-0">
                  <Tv className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-white">
                    {isSwahili ? '3. Kutuma kwenye Smart TV (AirPlay / Chromecast)' : '3. Wireless Screen to Smart TV (AirPlay / Cast)'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {isSwahili
                      ? 'Kwenye simu au kompyuta yako, chagua "Cast / Screen Mirroring" au "AirPlay" ili kuakisi skrini nzima kwenye Samsung, LG, Sony au Android TV.'
                      : 'On your mobile device or computer, select "Cast / Screen Mirroring" or "AirPlay" in system quick settings to mirror to Samsung, LG, Sony, or Apple TV.'}
                  </p>
                </div>
              </div>

              {/* Option 4: Fullscreen Cinema / TV Mode */}
              <div className="p-4 rounded-2xl bg-black/40 border border-emerald-900/40 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-300 shrink-0">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {isSwahili ? '4. Skrini Kamili ya Sinema (Fullscreen)' : '4. Fullscreen Cinema Mode'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {isSwahili
                        ? 'Panua skrini safi kufunika runinga yako nzima bila kitu chochote kuingilia.'
                        : 'Expands the clear screen to fill your entire TV screen with zero obstacles.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsStageFullScreen(true);
                    setShowConnectTVModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shrink-0 shadow-md cursor-pointer transition-all"
                >
                  {isSwahili ? 'Skrini Kamili' : 'Fullscreen'}
                </button>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-emerald-950/80 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowConnectTVModal(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
                {isSwahili ? 'Tayari' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. CONTACT BONIPHACE MODAL */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0e1d15] w-full max-w-lg rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/10 dark:border-emerald-500/15 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Wasiliana na Ev Dr. Boniphace J. Ndege' : 'Contact Ev Dr. Boniphace J. Ndege'}
              </h3>
              <button
                onClick={onCloseContactModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Jina Lako Kamili' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder={isSwahili ? 'Weka jina lako kamili' : 'Your full name'}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Barua Pepe Yako' : 'Your Email'}
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Ujumbe Wako' : 'Message'}
                </label>
                <textarea
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  rows={4}
                  placeholder={
                    isSwahili
                      ? 'Je, tunawezaje kushirikiana, kusaidiana, au kufanya kazi pamoja?'
                      : 'How can we collaborate, assist, or partner together?'
                  }
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <button
                onClick={() => {
                  if (!contactName || !contactEmail || !contactMsg) return;
                  onSubmitContact(contactName, contactEmail, contactMsg);
                  setContactName('');
                  setContactEmail('');
                  setContactMsg('');
                  onCloseContactModal();
                }}
                disabled={!contactName || !contactEmail || !contactMsg}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
              >
                {isSwahili ? 'Tuma Ujumbe' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. NOTIFICATIONS MODAL */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0e1d15] w-full max-w-md rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/10 dark:border-emerald-500/15 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Taarifa' : 'Notifications'}
              </h3>
              <button
                onClick={onCloseNotifications}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
                <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                  {isSwahili ? 'Sarah amependa chapisho lako' : 'Sarah liked your post'}
                </strong>
                <span className="text-[10px] text-slate-400">{isSwahili ? 'Dakika 10 zilizopita' : '10 minutes ago'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
                <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                  {isSwahili ? 'Wanachama wapya 24 wamejiunga na jamii yako' : '24 new members joined your community'}
                </strong>
                <span className="text-[10px] text-slate-400">{isSwahili ? 'Leo' : 'Today'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
                <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                  {isSwahili ? 'Agizo jipya limepokelewa: #GS-1048' : 'New order received: #GS-1048'}
                </strong>
                <span className="text-[10px] text-slate-400">{isSwahili ? 'Leo' : 'Today'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
                <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                  {isSwahili ? 'Kipindi mubashara kinaanza baada ya dakika 15' : 'Live session starts in 15 minutes'}
                </strong>
                <span className="text-[10px] text-slate-400">{isSwahili ? 'Matangazo yaliyopangwa' : 'Scheduled broadcast'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0e1d15] w-full max-w-md rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/10 dark:border-emerald-500/15 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Mipangilio ya Mfumo' : 'Platform Settings'}
              </h3>
              <button
                onClick={onCloseSettings}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Profile & Branding Edit */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-emerald-600" />
                  <div>
                    <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                      {isSwahili ? 'Wasifu & Chapa' : 'Profile & Branding'}
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      {isSwahili
                        ? 'Badili picha, bango, jina, na maelezo'
                        : 'Change photos, banner, name, and bio'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onCloseSettings();
                    onOpenEditProfile();
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#d4af37] hover:bg-[#c29e2e] text-slate-900 transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Hariri Wasifu' : 'Edit Profile'}
                </button>
              </div>

              {/* Theme Settings: Permanently Locked to Signature Dark Emerald & Gold */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-950/5 dark:border-emerald-500/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#06331e] to-[#02130a] border border-[#ffd700]/30 flex items-center justify-center text-[#ffd700] shadow-sm">
                    <Sparkles className="w-4 h-4 text-[#ffd700]" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                      {language === 'Swahili' ? 'Mandhari ya Kudumu: Kijani Kibichi & Dhahabu' : 'Permanent Theme: Dark Emerald & Gold'}
                    </strong>
                    <span className="text-[10px] text-emerald-600 dark:text-[#ffd700] font-semibold">
                      {language === 'Swahili'
                        ? 'Hali ya Usiku (Dark Mode) imefungwa kiotomatiki kwa uzoefu bora'
                        : 'Signature dark aesthetic locked permanently'}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider">
                  Active
                </span>
              </div>

              {/* Language Drop-Down Menu */}
              <div className="relative p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-950/5 dark:border-emerald-500/15">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-emerald-600 dark:text-[#ffd700]" />
                    <div>
                      <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                        {isSwahili ? 'Lugha ya Mfumo' : 'Interface Language'}
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        {isSwahili ? 'Chagua Kiingereza au Kiswahili' : 'Select English or Swahili'}
                      </span>
                    </div>
                  </div>

                  {/* Drop-down Menu Trigger Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#0e1d15] text-slate-800 dark:text-emerald-100 border border-emerald-950/15 dark:border-emerald-600/40 shadow-xs hover:border-[#ffd700]/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      aria-haspopup="listbox"
                      aria-expanded={isLangDropdownOpen}
                      title={isSwahili ? 'Bofya kubadilisha lugha' : 'Click to change language'}
                    >
                      <div className="flex items-center gap-1.5">
                        {isSwahili ? (
                          <TanzaniaFlag className="w-5 h-3.5" />
                        ) : (
                          <BritishFlag className="w-5 h-3.5" />
                        )}
                        <span className="text-xs font-extrabold text-slate-900 dark:text-emerald-100">
                          {isSwahili ? 'Kiswahili' : 'English'}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                          isLangDropdownOpen ? 'rotate-180 text-emerald-500' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu Modal */}
                    {isLangDropdownOpen && (
                      <div className="absolute right-0 mt-1.5 w-52 rounded-2xl bg-white dark:bg-[#0a1811] border border-emerald-950/15 dark:border-emerald-500/30 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-400/60 border-b border-emerald-950/5 dark:border-emerald-500/10 mb-1">
                          {isSwahili ? 'Chagua Lugha' : 'Select Language'}
                        </div>

                        {/* Option 1: English with British Flag */}
                        <button
                          type="button"
                          onClick={() => {
                            onChangeLanguage('English');
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2.5 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            !isSwahili
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-[#ffd700]'
                              : 'text-slate-700 dark:text-emerald-100/90 hover:bg-slate-100 dark:hover:bg-emerald-900/40'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <BritishFlag className="w-5 h-3.5" />
                            <div className="text-left">
                              <span className="block leading-tight font-extrabold">English</span>
                              <span className="text-[10px] text-slate-400 dark:text-emerald-400/60 font-normal">United Kingdom</span>
                            </div>
                          </div>
                          {!isSwahili && <Check className="w-4 h-4 text-emerald-600 dark:text-[#ffd700]" />}
                        </button>

                        {/* Option 2: Swahili with Tanzania Flag */}
                        <button
                          type="button"
                          onClick={() => {
                            onChangeLanguage('Swahili');
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2.5 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            isSwahili
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-[#ffd700]'
                              : 'text-slate-700 dark:text-emerald-100/90 hover:bg-slate-100 dark:hover:bg-emerald-900/40'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <TanzaniaFlag className="w-5 h-3.5" />
                            <div className="text-left">
                              <span className="block leading-tight font-extrabold">Kiswahili</span>
                              <span className="text-[10px] text-slate-400 dark:text-emerald-400/60 font-normal">Tanzania</span>
                            </div>
                          </div>
                          {isSwahili && <Check className="w-4 h-4 text-emerald-600 dark:text-[#ffd700]" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-950/5 dark:border-emerald-500/15">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                      {language === 'Swahili' ? 'Faragha ya Akaunti' : 'Account Privacy'}
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      {language === 'Swahili' ? 'Wasifu wa umma wa muundaji' : 'Public creator profile'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {language === 'Swahili' ? 'Imelindwa' : 'Secured'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
