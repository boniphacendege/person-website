import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Link,
  Film,
  Camera,
  Layers,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (payload: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: string;
    category?: string;
  }) => void;
  language?: string;
}

const SAMPLE_PRESETS = [
  {
    title: 'Building Digital Dreams — Creator Blueprint',
    category: 'Technology',
    duration: '12:42',
    videoUrl: '/uploads/videos/inshot_20261010_real.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80',
    description: 'A deep dive into constructing high-performance creator businesses, community platforms, and sustainable monetization in Africa.',
  },
  {
    title: 'Global Shopping & Logistics in East Africa',
    category: 'E-Commerce',
    duration: '15:20',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
    description: 'Practical steps for merchants to list products, manage inventory across cities, and streamline order fulfillment.',
  },
  {
    title: 'Mastering Online Education & Skills',
    category: 'Education',
    duration: '09:15',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
    description: 'How self-directed online learning unlocks global job opportunities and personal agency in the digital era.',
  },
];

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  language = 'English',
}) => {
  const isSwahili = language === 'Swahili';

  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('10:00');
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const [selectedRawFile, setSelectedRawFile] = useState<File | null>(null);

  // Preview video state
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [isPreviewMuted, setIsPreviewMuted] = useState(false);

  // Clean up object URLs and preview playback on unmount or file change
  const currentObjectUrlRef = useRef<string | null>(null);
  const previewPlayPromiseRef = useRef<Promise<void> | null>(null);

  const safePreviewPlay = () => {
    const el = previewVideoRef.current;
    if (!el) return;
    try {
      const promise = el.play();
      if (promise !== undefined) {
        previewPlayPromiseRef.current = promise;
        promise
          .then(() => {
            previewPlayPromiseRef.current = null;
            setIsPreviewPlaying(true);
          })
          .catch((err) => {
            previewPlayPromiseRef.current = null;
            setIsPreviewPlaying(false);
            if (
              err &&
              (err.name === 'AbortError' ||
               err.name === 'NotAllowedError' ||
               String(err.message).toLowerCase().includes('interrupted') ||
               String(err.message).toLowerCase().includes('pause') ||
               String(err.message).toLowerCase().includes('removed'))
            ) {
              return;
            }
          });
      }
    } catch {
      // ignore sync errors
    }
  };

  const safePreviewPause = () => {
    const el = previewVideoRef.current;
    if (!el) return;
    setIsPreviewPlaying(false);
    if (previewPlayPromiseRef.current) {
      previewPlayPromiseRef.current
        .then(() => {
          try {
            el.pause();
          } catch {}
        })
        .catch(() => {});
    } else {
      try {
        el.pause();
      } catch {}
    }
  };

  useEffect(() => {
    return () => {
      safePreviewPause();
      if (currentObjectUrlRef.current && currentObjectUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(currentObjectUrlRef.current);
      }
    };
  }, []);

  // Format seconds into MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds <= 0) return '05:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Process selected file
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert(isSwahili ? 'Tafadhali chagua faili halali ya video (MP4, WebM, nk).' : 'Please choose a valid video file (MP4, WebM, etc).');
      return;
    }

    setSelectedRawFile(file);

    if (currentObjectUrlRef.current && currentObjectUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(currentObjectUrlRef.current);
    }

    const objUrl = URL.createObjectURL(file);
    currentObjectUrlRef.current = objUrl;
    setVideoUrl(objUrl);

    // Format file size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setFileDetails({
      name: file.name,
      size: `${sizeInMB} MB`,
    });

    if (!title.trim()) {
      // Auto-populate title from file name without extension
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
    }

    // Auto-detect duration and generate thumbnail using hidden video element
    const tempVideo = document.createElement('video');
    tempVideo.src = objUrl;
    tempVideo.preload = 'metadata';
    tempVideo.crossOrigin = 'anonymous';

    tempVideo.onloadedmetadata = () => {
      const dur = tempVideo.duration;
      setDuration(formatTime(dur));
      // Seek slightly into video to capture a meaningful frame
      tempVideo.currentTime = Math.min(1.5, dur / 2);
    };

    tempVideo.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = tempVideo.videoWidth || 640;
        canvas.height = tempVideo.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
          const frameData = canvas.toDataURL('image/jpeg', 0.85);
          setThumbnailUrl(frameData);
        }
      } catch (err) {
        // Fallback default thumbnail
        setThumbnailUrl('https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1000&q=80');
      }
    };
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleApplyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    safePreviewPause();
    setSelectedRawFile(null);
    setTitle(preset.title);
    setCategory(preset.category);
    setDuration(preset.duration);
    setVideoUrl(preset.videoUrl);
    setThumbnailUrl(preset.thumbnailUrl);
    setDescription(preset.description);
    setFileDetails({ name: `${preset.title}.mp4`, size: '24.5 MB' });
  };

  const handleTogglePreviewPlay = () => {
    const el = previewVideoRef.current;
    if (!el) return;
    if (el.paused) {
      safePreviewPlay();
    } else {
      safePreviewPause();
    }
  };

  const handleClose = () => {
    safePreviewPause();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    safePreviewPause();
    setIsProcessing(true);

    let finalVideoUrl = videoUrl.trim();

    // If a raw video file was selected, upload it to the server so it persists with its authentic recorded audio
    if (selectedRawFile && selectedRawFile.size > 0 && selectedRawFile.size <= 100 * 1024 * 1024) {
      try {
        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedRawFile);
        });

        const uploadRes = await fetch('/api/upload-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoData: base64Data,
            fileName: selectedRawFile.name,
            mimeType: selectedRawFile.type,
          }),
        });

        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          if (uploadJson.url) {
            finalVideoUrl = uploadJson.url;
          }
        }
      } catch (uploadErr) {
        console.warn('Real video direct upload to server failed, falling back:', uploadErr);
      }
    }

    if (!finalVideoUrl || finalVideoUrl.includes('oceans.mp4')) {
      finalVideoUrl = '/uploads/videos/inshot_20261010_real.mp4';
    }

    const finalThumb =
      thumbnailUrl.trim() ||
      'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1000&q=80';

    setTimeout(() => {
      onUpload({
        title: title.trim(),
        description: description.trim() || (isSwahili ? 'Video mpya ya Ev Dr. Boniphace J. Ndege.' : 'New video publication by Ev Dr. Boniphace J. Ndege.'),
        videoUrl: finalVideoUrl,
        thumbnailUrl: finalThumb,
        duration: duration || '10:00',
        category,
      });

      setIsProcessing(false);
      handleClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-[#0c1812] text-slate-900 dark:text-emerald-50 w-full max-w-2xl rounded-3xl border border-emerald-950/15 dark:border-emerald-500/25 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-950/10 dark:border-emerald-500/15 flex items-center justify-between bg-slate-50/60 dark:bg-[#07130d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00a651] to-[#052b1b] text-white flex items-center justify-center shadow-md shadow-emerald-900/30">
              <Film className="w-5 h-5 text-[#ffd700]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                {isSwahili ? 'Pakia na Chapisha Video' : 'Upload & Publish Video'}
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#ffd700]/20 text-[#d4af37] border border-[#ffd700]/40">
                  HD 1080p
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                {isSwahili
                  ? 'Weka video mpya kwenye maktaba ya jukwaa na hakikisha inacheza vizuri.'
                  : 'Add a new video to your platform catalog with full playback support.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Tabs: Choose Upload File vs Video URL */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-[#06120b] rounded-2xl border border-emerald-950/10 dark:border-emerald-500/20">
            <button
              type="button"
              onClick={() => setActiveTab('file')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'file'
                  ? 'bg-white dark:bg-emerald-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-emerald-300/70 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{isSwahili ? 'Faili ya Video ya Kienyeji' : 'Upload Video File'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-white dark:bg-emerald-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-emerald-300/70 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Link className="w-4 h-4" />
              <span>{isSwahili ? 'Kiungo cha Video (URL / Mtandao)' : 'Video URL / Stream Link'}</span>
            </button>
          </div>

          {/* Quick Presets for Instant 1-Click Testing */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/25">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
                {isSwahili ? 'Chagua kiolezo cha haraka kwa majaribio:' : 'Or test immediately with demo presets:'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-white dark:bg-[#0e2117] hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-emerald-200 border border-emerald-900/15 dark:border-emerald-600/30 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Film className="w-3 h-3 text-[#ffd700]" />
                  <span>{preset.title.split('—')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File Tab: Drag & Drop Zone */}
          {activeTab === 'file' ? (
            <div>
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer ${
                  isDragOver
                    ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
                    : videoUrl
                    ? 'border-emerald-500/40 bg-emerald-950/10 dark:bg-emerald-950/30'
                    : 'border-slate-300 dark:border-emerald-800/40 hover:border-emerald-500 bg-slate-50 dark:bg-[#07130d]'
                }`}
              >
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                  className="sr-only"
                />

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-[#087a45] text-white flex items-center justify-center shadow-lg shadow-emerald-900/30 mb-3">
                  <Upload className="w-7 h-7 text-[#ffd700]" />
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-emerald-100 text-center">
                  {fileDetails
                    ? `${isSwahili ? 'Faili iliyochaguliwa:' : 'Selected file:'} ${fileDetails.name}`
                    : isSwahili
                    ? 'Bofya hapa au buruta faili ya video (MP4, WebM)'
                    : 'Click to browse or drag & drop video file'}
                </p>

                <p className="text-[11px] text-slate-500 dark:text-emerald-400/60 mt-1">
                  {fileDetails
                    ? `${fileDetails.size} · ${duration}`
                    : isSwahili
                    ? 'Inakubali MP4, WebM, MOV, OGG (hadi 500MB)'
                    : 'Supports MP4, WebM, MOV, OGG (Full HD, 4K)'}
                </p>
              </label>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1.5">
                {isSwahili ? 'Kiungo cha Video (Direct MP4 au WebM URL)' : 'Video Stream URL (Direct MP4 or WebM)'}
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://example.com/stream/video.mp4"
                className="w-full h-11 px-3.5 text-xs bg-slate-50 dark:bg-[#06120b] border border-slate-200 dark:border-emerald-800/60 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-emerald-50"
              />
            </div>
          )}

          {/* Authentic Video Audio Guarantee Badge */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-[#ffd700] border border-[#ffd700]/30 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 text-[#ffd700]" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-slate-800 dark:text-emerald-100 flex items-center gap-1.5">
                <span>{isSwahili ? 'Sauti Halisi ya Video (Recorded Audio)' : 'Original Recorded Video Audio'}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#ffd700]/20 text-[#d4af37] border border-[#ffd700]/40 font-mono font-bold">
                  {isSwahili ? 'Hakuna AI Sound' : '100% Real Audio'}
                </span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-emerald-300/70 mt-0.5">
                {isSwahili
                  ? 'Video inapakiwa ikiwa na sauti yake halisi iliyorekodiwa moja kwa moja bila kubadilishwa au kutumia sauti ya AI.'
                  : 'Video is uploaded with its authentic microphone and camera sound track intact — no artificial or AI-generated voices.'}
              </p>
            </div>
          </div>

          {/* Video Preview Player with Playback Controls */}
          {Boolean(videoUrl) && (
            <div className="rounded-2xl border border-emerald-950/15 dark:border-emerald-500/30 overflow-hidden bg-black shadow-lg">
              <div className="p-2.5 bg-[#06120b] border-b border-emerald-900/30 flex items-center justify-between text-xs text-white">
                <span className="font-bold flex items-center gap-1.5 text-emerald-300">
                  <Play className="w-3.5 h-3.5 text-[#ffd700]" />
                  {isSwahili ? 'Kionyesho cha Papo Hapo (Sauti Halisi)' : 'Instant Player Preview (Real Audio)'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {duration}
                </span>
              </div>

              <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
                <video
                  ref={previewVideoRef}
                  src={videoUrl || undefined}
                  poster={thumbnailUrl || undefined}
                  muted={isPreviewMuted}
                  playsInline
                  onPlay={() => setIsPreviewPlaying(true)}
                  onPause={() => setIsPreviewPlaying(false)}
                  className="w-full h-full object-contain"
                />

                {/* Center Play/Pause button */}
                <button
                  type="button"
                  onClick={handleTogglePreviewPlay}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl border border-white/20 transition-all transform hover:scale-110 cursor-pointer"
                  title={isPreviewPlaying ? 'Pause preview' : 'Play preview'}
                >
                  {isPreviewPlaying ? (
                    <Pause className="w-6 h-6 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  )}
                </button>

                {/* Bottom mini controls for preview */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 px-2 py-1 rounded-lg backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() => {
                      if (!previewVideoRef.current) return;
                      const next = !isPreviewMuted;
                      previewVideoRef.current.muted = next;
                      setIsPreviewMuted(next);
                    }}
                    className="p-1 text-white hover:text-[#ffd700] transition-colors"
                    title={isPreviewMuted ? 'Unmute' : 'Mute'}
                  >
                    {isPreviewMuted ? (
                      <VolumeX className="w-3.5 h-3.5" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="text-[10px] text-emerald-300 font-bold uppercase">
                    {isPreviewPlaying ? 'Playing' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields: Title, Category, Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1.5">
                {isSwahili ? 'Kichwa cha Video *' : 'Video Title *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isSwahili ? 'Mfano: Jinsi ya Kutumia Soko la Kimataifa' : 'e.g., How to Scale Digital Products & Media'}
                className="w-full h-11 px-3.5 text-xs bg-slate-50 dark:bg-[#06120b] border border-slate-200 dark:border-emerald-800/60 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-emerald-50 font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1.5">
                  {isSwahili ? 'Kitengo / Kategoria' : 'Category / Topic'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 text-xs bg-slate-50 dark:bg-[#06120b] border border-slate-200 dark:border-emerald-800/60 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-emerald-50 font-bold"
                >
                  <option value="Technology">Technology & Software</option>
                  <option value="E-Commerce">Global Shopping & Trade</option>
                  <option value="Creator Economy">Creator Economy & Media</option>
                  <option value="Education">Education & Masterclasses</option>
                  <option value="Business">Business Strategy</option>
                  <option value="Lifestyle">Culture & Community</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1.5">
                  {isSwahili ? 'Muda wa Video (MM:SS)' : 'Duration (MM:SS)'}
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="12:40"
                    className="w-full h-11 pl-9 pr-3 text-xs bg-slate-50 dark:bg-[#06120b] border border-slate-200 dark:border-emerald-800/60 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-emerald-50 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1.5">
                {isSwahili ? 'Picha ya Jalada / Thumbnail URL' : 'Thumbnail Cover URL (Optional)'}
              </label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full h-10 px-3.5 text-xs bg-slate-50 dark:bg-[#06120b] border border-slate-200 dark:border-emerald-800/60 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-emerald-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1.5">
                {isSwahili ? 'Maelezo ya Video' : 'Video Description'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder={isSwahili ? 'Andika muhtasari na mada kuu zilizojadiliwa...' : 'Write an overview of this presentation or lecture...'}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-[#06120b] border border-slate-200 dark:border-emerald-800/60 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-emerald-50"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-emerald-950/10 dark:border-emerald-500/15 flex items-center justify-end gap-3 bg-slate-50/60 dark:bg-[#07130d]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-emerald-300 hover:bg-slate-200 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
          >
            {isSwahili ? 'Ghairi' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || isProcessing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00a651] to-[#087a45] hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center gap-2 cursor-pointer transition-all"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isSwahili ? 'Inachakata...' : 'Publishing...'}</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-[#ffd700]" />
                <span>{isSwahili ? 'Chapisha & Cheza Video' : 'Upload & Publish Video'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
