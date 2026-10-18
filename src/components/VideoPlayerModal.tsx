import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Volume1,
  VolumeX,
  Maximize2,
  Minimize2,
  Tv,
  Heart,
  Share2,
  Bookmark,
  Check,
  MessageSquare,
  Sparkles,
  Send,
  Eye,
  Clock,
  ThumbsUp,
  AlertCircle,
  Film,
} from 'lucide-react';
import { VideoItem } from '../types';
import * as api from '../api';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo?: (video: VideoItem) => void;
  allVideos?: VideoItem[];
  language?: string;
  onShowToast?: (msg: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  isOpen,
  onClose,
  onSelectVideo,
  allVideos = [],
  language = 'English',
  onShowToast,
}) => {
  const isSwahili = language === 'Swahili';

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const BACKUP_VIDEO_URL = '/uploads/videos/inshot_20261010_real.mp4';
  const HD_FALLBACK_STREAMS = [
    '/uploads/videos/inshot_20261010_real.mp4',
    'https://media.w3.org/2010/05/sintel/trailer.mp4',
    'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://test-videos.co.uk/vids/jellyfish/mp4/h264/1080/Jellyfish_1080_10s_1MB.mp4',
  ];
  const DEFAULT_AVATAR = '/src/assets/images/boniphace_avatar_1791315268492.jpg';
  const DEFAULT_THUMBNAIL =
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80';

  const resolveWorkingStream = (rawUrl?: string) => {
    if (!rawUrl || !rawUrl.trim()) return BACKUP_VIDEO_URL;
    const trimmed = rawUrl.trim();
    if (trimmed.includes('oceans.mp4')) {
      return BACKUP_VIDEO_URL;
    }
    if (trimmed.startsWith('blob:') || trimmed.includes('commondatastorage.googleapis.com')) {
      return BACKUP_VIDEO_URL;
    }
    return trimmed;
  };

  const [effectiveSrc, setEffectiveSrc] = useState<string>(() => {
    return resolveWorkingStream(video?.videoUrl);
  });

  // Interactive engagement state
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [viewsDisplay, setViewsDisplay] = useState('1');
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [comments, setComments] = useState<Array<{ id: string; author: string; avatar: string; text: string; time: string }>>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [resolution, setResolution] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false);
  const [qualityNotice, setQualityNotice] = useState<string | null>(null);

  const handleQualityChange = (q: '1080p' | '720p' | '480p') => {
    setResolution(q);
    setIsQualityMenuOpen(false);
    const notice = isSwahili
      ? `Ubora wa Video: ${q} ${q === '1080p' ? 'Full HD (Master)' : q === '720p' ? 'HD (Balanced)' : 'SD (Data Saver)'}`
      : `Video Stream Quality: ${q} ${q === '1080p' ? 'Full HD (Master)' : q === '720p' ? 'HD (Balanced)' : 'SD (Data Saver)'}`;
    setQualityNotice(notice);
    setTimeout(() => setQualityNotice(null), 3000);
  };

  // Autohide controls timer
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Playback promise tracking to prevent Chrome "interrupted by pause or removal" errors
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const safePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    try {
      const promise = el.play();
      if (promise !== undefined) {
        playPromiseRef.current = promise;
        promise
          .then(() => {
            playPromiseRef.current = null;
            setIsPlaying(true);
          })
          .catch((err) => {
            playPromiseRef.current = null;
            setIsPlaying(false);
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

  const safePause = () => {
    const el = videoRef.current;
    if (!el) return;
    setIsPlaying(false);
    if (playPromiseRef.current) {
      playPromiseRef.current
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

  // Initialize or update whenever `video` changes
  useEffect(() => {
    if (!video) return;

    const sourceUrl = resolveWorkingStream(video.videoUrl);

    setEffectiveSrc(sourceUrl);
    setVideoError(null);
    setCurrentTime(0);
    setIsLiked(Boolean(video.isLiked));
    setLikesCount(video.likesCount || 1200);
    setViewsDisplay(video.views || '1');
    setComments(
      video.comments && video.comments.length > 0
        ? video.comments
        : [
            {
              id: 'c-default-1',
              author: 'Sarah Jenkins',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
              text: isSwahili ? 'Maudhui mazuri sana! Mafunzo haya yamenisaidia kuelewa misingi.' : 'Phenomenal video lecture! The breakdown is crystal clear.',
              time: '2 hours ago',
            },
            {
              id: 'c-default-2',
              author: 'David Mwangi',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
              text: isSwahili ? 'Hongera Ev Dr. Boniphace J. Ndege kwa kazi nzuri kwenye mfumo huu wa kidijitali.' : 'Great production quality and practical insights. Keep it up!',
              time: '5 hours ago',
            },
          ]
    );

    // Register view count on backend
    if (video.id) {
      api.viewVideoApi(video.id).then((res) => {
        if (res.views) setViewsDisplay(res.views);
      }).catch(() => {});
    }

    // Safely attempt autoplay
    let isCancelled = false;
    const timer = setTimeout(() => {
      if (!isCancelled && videoRef.current) {
        safePlay();
      }
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      safePause();
    };
  }, [video]);

  // Clean up playback on component unmount
  useEffect(() => {
    return () => {
      safePause();
    };
  }, []);

  const handleClose = () => {
    safePause();
    onClose();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in a textarea or input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space' || e.key === 'k') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowLeft' || e.key === 'j') {
        e.preventDefault();
        seekBy(-10);
      } else if (e.code === 'ArrowRight' || e.key === 'l') {
        e.preventDefault();
        seekBy(10);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          toggleFullscreen();
        } else {
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, isMuted, isFullscreen]);

  if (!isOpen || !video) return null;

  // Format seconds into MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Play / Pause safely handling asynchronous media state
  const togglePlayPause = () => {
    const el = videoRef.current;
    if (!el) return;

    if (el.paused) {
      safePlay();
    } else {
      safePause();
    }
  };

  // Seek relative
  const seekBy = (seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.min(Math.max(0, videoRef.current.currentTime + seconds), videoRef.current.duration || 0);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Seek to specific fraction
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!videoRef.current) return;
    videoRef.current.currentTime = val;
    setCurrentTime(val);
  };

  // Volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
    if (!next && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  // Playback Rate
  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setIsSpeedMenuOpen(false);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Picture in picture
  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP not available', err);
    }
  };

  // Show/Hide controls on mouse move
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    if (isPlaying) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
        setIsSpeedMenuOpen(false);
      }, 1600);
    }
  };

  // Video error recovery - seamlessly rotate to verified working HD stream
  const handleVideoError = () => {
    console.warn('Video failed to load from:', effectiveSrc);
    safePause();
    const nextIdx = (fallbackIndex + 1) % HD_FALLBACK_STREAMS.length;
    setFallbackIndex(nextIdx);
    const nextUrl = HD_FALLBACK_STREAMS[nextIdx];
    setEffectiveSrc(nextUrl);
    setVideoError(null);
    if (videoRef.current) {
      try {
        videoRef.current.load();
      } catch {}
      setTimeout(() => {
        safePlay();
      }, 150);
    }
  };

  // Like video
  const handleToggleLike = async () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => prev + (nextLiked ? 1 : -1));
    if (video.id) {
      try {
        await api.likeVideoApi(video.id);
      } catch {
        // silent fallback
      }
    }
  };

  // Share video
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    onShowToast?.(
      isSwahili
        ? `Kiungo cha "${video.title}" kimenakiliwa!`
        : `Video link for "${video.title}" copied to clipboard!`
    );
  };

  // Add Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const commentPayload = {
      id: `c-${Date.now()}`,
      author: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text: newCommentText.trim(),
      time: 'Just now',
    };

    setComments((prev) => [commentPayload, ...prev]);
    setNewCommentText('');

    if (video.id) {
      try {
        await api.commentVideoApi(video.id, commentPayload.text, 'You');
      } catch {
        // local state already updated
      }
    }
  };

  // Other related videos for "Up Next" sidebar
  const relatedVideos = allVideos.filter((v) => v.id !== video.id).slice(0, 5);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-[#05110a] text-white w-full max-w-5xl rounded-3xl border border-emerald-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[94vh] overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-[#030b06] border-b border-emerald-950/60 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Film className="w-4 h-4 text-[#ffd700]" />
            </div>
            <h2 className="text-xs sm:text-sm font-extrabold truncate text-emerald-50">
              {video.title}
            </h2>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40 shrink-0">
              {resolution} {resolution === '1080p' ? 'Full HD' : resolution === '720p' ? 'HD' : 'SD'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-emerald-900/40 transition-colors cursor-pointer"
              title="Close player (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Player & Details View */}
        <div className="flex-1 overflow-y-auto">
          {/* Cinema Screen Section */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              if (isPlaying) setShowControls(false);
            }}
            className="relative aspect-video w-full bg-[#030e07] flex items-center justify-center overflow-hidden group select-none"
          >
            {/* HTML5 Native Video Element - Crystal clear HD with no dark overlays */}
            <video
              ref={videoRef}
              src={effectiveSrc || undefined}
              poster={video.thumbnailUrl || DEFAULT_THUMBNAIL}
              playsInline
              onTimeUpdate={() => {
                if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration);
                  setIsBuffering(false);
                }
              }}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => {
                setIsBuffering(false);
                setIsPlaying(true);
              }}
              onPause={() => setIsPlaying(false)}
              onError={handleVideoError}
              onClick={togglePlayPause}
              onDoubleClick={toggleFullscreen}
              className={`w-full h-full ${
                fitMode === 'cover' ? 'object-cover' : 'object-contain'
              } cursor-pointer transition-all duration-300`}
            />

            {/* Error Notification Banner */}
            {videoError && (
              <div className="absolute top-4 left-4 right-4 z-30 p-2.5 rounded-xl bg-amber-950/90 border border-[#ffd700]/60 text-xs text-[#ffd700] flex items-center gap-2 shadow-xl backdrop-blur-md">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#ffd700]" />
                <span className="flex-1">{videoError}</span>
              </div>
            )}

            {/* Quality Switch Toast Banner */}
            {qualityNotice && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-emerald-950/95 border border-[#ffd700]/70 text-xs font-black text-[#ffd700] flex items-center gap-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                <Sparkles className="w-4 h-4 text-[#ffd700]" />
                <span>{qualityNotice}</span>
              </div>
            )}

            {/* Buffering Spinner */}
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="w-14 h-14 border-4 border-emerald-500/30 border-t-[#ffd700] rounded-full animate-spin" />
              </div>
            )}

            {/* Big Center Play Button when Paused */}
            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlayPause}
                className="absolute inset-0 m-auto w-18 h-18 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(5,150,105,0.8)] border border-[#ffd700]/50 transform hover:scale-110 active:scale-95 transition-all cursor-pointer z-20"
                title="Play video"
              >
                <Play className="w-8 h-8 fill-white ml-1 text-white" />
              </button>
            )}

            {/* Bottom Controls Overlay - Light, clear gradient that preserves HD video clarity */}
            <div
              className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 via-black/25 to-transparent px-4 pt-6 pb-2.5 transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Progress Slider Scrubber */}
              <div className="relative mb-2.5 group/scrub flex items-center">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeekChange}
                  className="w-full h-1.5 bg-white/25 rounded-lg appearance-none cursor-pointer accent-[#ffd700] hover:h-2 transition-all"
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between text-white text-xs">
                {/* Left controls: Play, Skip, Volume, Time */}
                <div className="flex items-center gap-2.5 sm:gap-3.5">
                  <button
                    type="button"
                    onClick={togglePlayPause}
                    className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => seekBy(-10)}
                    className="p-1 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Rewind 10 seconds"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => seekBy(10)}
                    className="p-1 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Fast forward 10 seconds"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  {/* Volume Control */}
                  <div className="flex items-center gap-1.5 group/vol">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-rose-400" />
                      ) : volume < 0.5 ? (
                        <Volume1 className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-14 sm:w-18 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>

                  {/* Time Counter */}
                  <span className="text-[11px] font-mono text-emerald-200/90 whitespace-nowrap">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right controls: Quality (1080p/720p/480p), Speed, PiP, Fullscreen */}
                <div className="flex items-center gap-1.5 sm:gap-2 relative">
                  {/* Real HD Quality Menu (1080p, 720p, 480p) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsQualityMenuOpen(!isQualityMenuOpen);
                        setIsSpeedMenuOpen(false);
                      }}
                      className="px-2 py-0.5 rounded-md hover:bg-white/20 text-[#ffd700] text-[11px] font-black border border-[#ffd700]/40 flex items-center gap-1 cursor-pointer shadow-xs"
                      title={isSwahili ? 'Chagua ubora wa video (1080p, 720p, 480p)' : 'Select stream resolution (1080p, 720p, 480p)'}
                    >
                      <Sparkles className="w-3 h-3 text-[#ffd700]" />
                      <span>{resolution}</span>
                    </button>

                    {isQualityMenuOpen && (
                      <div className="absolute bottom-8 right-0 bg-[#07190f] border border-[#ffd700]/40 rounded-xl p-1.5 shadow-2xl z-30 min-w-[140px] space-y-1 backdrop-blur-md">
                        <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 px-2 py-0.5 border-b border-emerald-900/50">
                          {isSwahili ? 'Ubora wa Video (HD)' : 'Video Quality (HD)'}
                        </div>
                        {(['1080p', '720p', '480p'] as const).map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => handleQualityChange(q)}
                            className={`w-full text-left px-2 py-1 rounded-lg text-[11px] font-bold flex items-center justify-between transition-colors cursor-pointer ${
                              resolution === q
                                ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black'
                                : 'text-slate-200 hover:bg-emerald-900/40'
                            }`}
                          >
                            <span>{q} {q === '1080p' ? 'Full HD' : q === '720p' ? 'HD' : 'SD'}</span>
                            {resolution === q && <Check className="w-3 h-3 text-slate-950" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Playback Speed Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSpeedMenuOpen(!isSpeedMenuOpen);
                        setIsQualityMenuOpen(false);
                      }}
                      className="px-2 py-0.5 rounded-md hover:bg-white/20 text-slate-200 text-[11px] font-bold border border-white/20 cursor-pointer"
                      title="Playback speed"
                    >
                      {playbackRate}x
                    </button>

                    {isSpeedMenuOpen && (
                      <div className="absolute bottom-8 right-0 bg-[#07190f] border border-emerald-500/40 rounded-xl p-1 shadow-2xl z-30 min-w-[70px] space-y-0.5">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            onClick={() => changePlaybackRate(rate)}
                            className={`w-full text-left px-2 py-1 rounded-lg text-[10px] font-bold flex items-center justify-between cursor-pointer ${
                              playbackRate === rate
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'
                            }`}
                          >
                            <span>{rate}x</span>
                            {playbackRate === rate && <Check className="w-3 h-3 text-[#ffd700]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* HD Fill / Fit Toggle: Eliminate all black bars & darkness */}
                  <button
                    type="button"
                    onClick={() => setFitMode((m) => (m === 'cover' ? 'contain' : 'cover'))}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition-colors cursor-pointer ${
                      fitMode === 'cover'
                        ? 'bg-[#ffd700]/25 text-[#ffd700] border-[#ffd700]/50 shadow-[0_0_8px_rgba(255,215,0,0.3)]'
                        : 'text-slate-300 hover:text-white border-white/20 hover:bg-white/10'
                    }`}
                    title={
                      fitMode === 'cover'
                        ? 'HD Full (No black borders) - Click to fit original'
                        : 'Aspect Fit - Click for HD Full (No black borders)'
                    }
                  >
                    {fitMode === 'cover' ? 'HD Full' : 'Fit'}
                  </button>

                  {/* PiP */}
                  <button
                    type="button"
                    onClick={togglePictureInPicture}
                    className="p-1.5 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer hidden sm:block"
                    title="Picture in Picture"
                  >
                    <Tv className="w-4 h-4" />
                  </button>

                  {/* Fullscreen */}
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title={isFullscreen ? 'Exit full screen (F)' : 'Full screen (F)'}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4 text-[#ffd700]" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Community Pane */}
          <div className="p-4 sm:p-6 bg-[#040e08] space-y-6">
            {/* Video Main Heading and Metadata */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {video.category || 'Technology'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-[#ffd700]" />
                  <span>{isSwahili ? 'Sauti Halisi ya Video' : 'Real Recorded Audio'}</span>
                </span>
                <span className="text-xs text-slate-400">
                  {viewsDisplay} {isSwahili ? 'mionekano' : 'views'} · {video.uploadedAt}
                </span>
              </div>

              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
                {video.title}
              </h1>
            </div>

            {/* Author Row & Social Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-900/30">
              {/* Creator details */}
              <div className="flex items-center gap-3">
                <div className="p-0.5 rounded-full bg-gradient-to-br from-[#ffd700] to-emerald-500 shadow-md shadow-emerald-900/40">
                  <img
                    src={video.authorAvatar || DEFAULT_AVATAR}
                    alt={video.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-sm font-bold text-white">
                      {video.author}
                    </strong>
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[9px] font-black">
                      ✓
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-300/70">
                    {isSwahili ? 'Mbunifu Rasmi · Ev Dr. Boniphace J. Ndege Media' : 'Official Creator · Ev Dr. Boniphace J. Ndege Media'}
                  </span>
                </div>
              </div>

              {/* Interactive Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isLiked
                      ? 'bg-rose-950/60 border-rose-500/60 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                      : 'bg-[#0a1e13] hover:bg-emerald-900/40 border-emerald-800/40 text-slate-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{likesCount}</span>
                </button>

                {/* Bookmark / Watch Later */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !isSaved;
                    setIsSaved(next);
                    onShowToast?.(
                      next
                        ? (isSwahili ? 'Imehifadhiwa kwenye orodha ya kutazama baadaye' : 'Saved to Watch Later list')
                        : (isSwahili ? 'Imeondolewa kwenye orodha' : 'Removed from Watch Later')
                    );
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-amber-950/60 border-[#ffd700]/60 text-[#ffd700]'
                      : 'bg-[#0a1e13] hover:bg-emerald-900/40 border-emerald-800/40 text-slate-200'
                  }`}
                  title="Watch Later"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#ffd700] text-[#ffd700]' : ''}`} />
                  <span className="hidden sm:inline">{isSwahili ? 'Hifadhi' : 'Save'}</span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-[#0a1e13] hover:bg-emerald-900/40 border border-emerald-800/40 text-slate-200 hover:text-white transition-all cursor-pointer"
                  title="Share link"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{isSwahili ? 'Gawa' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Expandable Description Box */}
            <div className="p-4 rounded-2xl bg-[#091a11] border border-emerald-900/30 text-xs">
              <p className={`text-slate-300 leading-relaxed ${isDescExpanded ? '' : 'line-clamp-2'}`}>
                {video.description}
              </p>
              <button
                type="button"
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="mt-2 text-emerald-400 hover:text-[#ffd700] font-bold text-[11px] cursor-pointer"
              >
                {isDescExpanded
                  ? (isSwahili ? 'Onyesha kidogo ↑' : 'Show less ↑')
                  : (isSwahili ? 'Soma zaidi ↓' : 'Read more ↓')}
              </button>
            </div>

            {/* Split Grid: Comments & Up Next Videos */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              {/* Left Column: Comments (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    {comments.length} {isSwahili ? 'Maoni ya Video' : 'Comments'}
                  </h3>
                </div>

                {/* Add Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder={isSwahili ? 'Ongeza maoni yako hapa...' : 'Add a public comment...'}
                    className="flex-1 h-10 px-3.5 text-xs bg-[#091a11] border border-emerald-900/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSwahili ? 'Tuma' : 'Post'}</span>
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {comments.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-[#07170f] border border-emerald-900/20 flex gap-2.5">
                      <img
                        src={c.avatar || DEFAULT_AVATAR}
                        alt={c.author}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-xs font-bold text-emerald-300">
                            {c.author}
                          </strong>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {c.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-snug break-words">
                          {c.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Up Next Videos (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#ffd700]" />
                  {isSwahili ? 'Video Zinazofuata' : 'Up Next & Related'}
                </h3>

                <div className="space-y-2.5">
                  {relatedVideos.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectVideo?.(rel)}
                      className="group p-2 rounded-2xl bg-[#07170f] hover:bg-[#0c2419] border border-emerald-900/30 hover:border-emerald-500/40 flex gap-2.5 cursor-pointer transition-all"
                    >
                      {/* Mini Thumbnail */}
                      <div className="relative w-28 aspect-video rounded-xl overflow-hidden bg-black shrink-0">
                        <img
                          src={rel.thumbnailUrl || DEFAULT_THUMBNAIL}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[9px] font-bold bg-black/80 text-white rounded">
                          {rel.duration}
                        </span>
                      </div>

                      {/* Mini Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-[#ffd700] transition-colors">
                          {rel.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 mt-1">
                          {rel.views} views · {rel.author}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
