import React from 'react';
import { Video, Play, Upload, Volume2 } from 'lucide-react';
import { VideoItem } from '../types';

interface VideosSectionProps {
  videos: VideoItem[];
  onOpenUploadVideo: () => void;
  onPlayVideo: (video: VideoItem) => void;
  language?: string;
}

export const VideosSection: React.FC<VideosSectionProps> = ({
  videos,
  onOpenUploadVideo,
  onPlayVideo,
  language,
}) => {
  const isSwahili = language === 'Swahili';

  return (
    <section id="videos" className="py-12 max-w-6xl mx-auto px-4 border-t border-emerald-950/10 dark:border-emerald-500/15">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-emerald-50 tracking-tight font-editorial">
            {isSwahili ? 'Video' : 'Videos'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1">
            {isSwahili
              ? 'Uzoefu wa video kama YouTube ndani ya Ev Dr. Boniphace J. Ndege (Video zinacheza na sauti yake halisi ya kurekodiwa).'
              : 'A YouTube-style video experience inside Ev Dr. Boniphace J. Ndege with authentic recorded video audio.'}
          </p>
        </div>

        <button
          onClick={onOpenUploadVideo}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          {isSwahili ? 'Pakia Video' : 'Upload Video'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="group card-neon-gold rounded-3xl overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Subtle top gold-neon decorative rim */}
              <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/20 via-[#ffd700]/70 to-emerald-500/20" />

              {/* Thumbnail with duration badge and play icon */}
              <div
                onClick={() => onPlayVideo(vid)}
                className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer"
              >
                <img
                  src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80'}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                />

                <div className="absolute inset-0 flex items-center justify-center transition-colors group-hover:bg-emerald-950/20">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#063b22]/90 to-[#032012]/90 text-[#ffd700] border border-[#ffd700]/60 flex items-center justify-center shadow-[0_0_16px_rgba(5,150,105,0.5)] transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-[#ffd700] ml-0.5" />
                  </div>
                </div>

                {/* Real Audio Badge */}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] font-bold bg-black/85 text-emerald-200 border border-emerald-500/40 rounded-md tracking-tight backdrop-blur-xs flex items-center gap-1 shadow-md">
                  <Volume2 className="w-3 h-3 text-[#ffd700]" />
                  <span>{isSwahili ? 'Sauti Halisi' : 'Real Audio'}</span>
                </span>

                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold bg-black/85 text-white border border-[#ffd700]/30 rounded-md tracking-tight backdrop-blur-xs">
                  {vid.duration}
                </span>
              </div>

              {/* Video Info */}
              <div className="p-4 flex items-start gap-3">
                <div className="p-0.5 rounded-full bg-gradient-to-br from-[#ffd700] to-emerald-500 shrink-0 mt-0.5 shadow-[0_0_6px_rgba(5,150,105,0.3)]">
                  <img
                    src={vid.authorAvatar || '/src/assets/images/boniphace_avatar_1791315268492.jpg'}
                    alt={vid.author}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3
                    onClick={() => onPlayVideo(vid)}
                    className="text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50 line-clamp-2 leading-snug cursor-pointer group-hover:text-emerald-600 dark:group-hover:text-[#ffd700] transition-colors"
                  >
                    {isSwahili && vid.titleSwahili ? vid.titleSwahili : vid.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 dark:text-emerald-400/70 mt-1 flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-slate-600 dark:text-emerald-200">{vid.author}</span>
                    <span className="text-[#ffd700]">·</span>
                    <span>{vid.views} {isSwahili ? 'mionekano' : 'views'}</span>
                    <span className="text-[#ffd700]">·</span>
                    <span>{vid.uploadedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
