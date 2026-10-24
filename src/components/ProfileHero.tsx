import React from 'react';
import { CheckCircle2, Crown, UserPlus, Check, MessageSquare, Share2, Edit3, Camera } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileHeroProps {
  profile: UserProfile;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onNavigate: (sectionId: string) => void;
  onShareProfile: () => void;
  onOpenEditProfile: () => void;
  onOpenCommunityFollowers?: () => void;
  language?: string;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  profile,
  isFollowing,
  onToggleFollow,
  onNavigate,
  onShareProfile,
  onOpenEditProfile,
  onOpenCommunityFollowers,
  language = 'English',
}) => {
  const isSwahili = language === 'Swahili';
  return (
    <section id="home" className="relative">
      {/* Cover Banner */}
      <div className="relative h-80 sm:h-88 md:h-96 w-full overflow-hidden bg-gradient-to-r from-[#075c36] to-[#00a651] group">
        <img
          src={profile.coverUrl || '/src/assets/images/boniphace_cover_1791315258070.jpg'}
          alt="Creative studio and digital vision banner"
          className="w-full h-full object-cover opacity-85 mix-blend-overlay group-hover:scale-101 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black/85" />

        {/* Change Banner Quick Button */}
        <button
          onClick={onOpenEditProfile}
          className="absolute top-4 right-4 sm:right-8 z-20 px-3 py-1.5 rounded-xl bg-black/55 hover:bg-black/75 text-white text-xs font-semibold backdrop-blur-xs border border-white/25 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
          title="Change Profile Cover Banner"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isSwahili ? 'Badili Bango' : 'Change Cover'}</span>
        </button>

        <div className="absolute top-10 sm:top-14 md:top-16 left-6 md:left-12 max-w-2xl text-white z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-emerald-300 drop-shadow-md">
              {isSwahili
                ? (profile.titleSwahili || 'CHAPA BINAFSI · MUUNDAJI · MWEKEZAJI')
                : (profile.title || 'PERSONAL BRAND · CREATOR · ENTREPRENEUR')}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight font-editorial text-white drop-shadow-lg leading-snug py-1">
            Ev Dr. Boniphace J. Ndege
          </h1>

          {/* Invitation to bring work for Graphic Design & Website Design - direct on banner with transparent background */}
          <div className="pt-2 max-w-xl bg-transparent border-0 shadow-none">
            <div className="flex items-center gap-2 text-xs font-black text-[#ffd700] uppercase tracking-wider mb-1 drop-shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
              <span>
                {isSwahili
                  ? 'Karibuni Kazi za Graphic Design & Website Design'
                  : 'Open for Graphic Design & Website Design Projects'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/95 leading-relaxed font-medium drop-shadow-md">
              {isSwahili
                ? 'Karibuni sana wanachama na wateja wote kuleta kazi zenu kwa ajili ya Ubunifu wa Michoro (Graphic Design), Kutengeneza Tovuti (Website Design), Uchapishaji wa Vitabu na Masuluhisho ya Kidijitali ya Kisasa!'
                : 'Welcome all members and clients! Bring your projects for professional Graphic Design, Website Design, Book Publishing, and High-End Digital Solutions.'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Card Overlay */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-20">
        <div className="card-neon-gold rounded-3xl p-6 md:p-8 relative overflow-visible">
          {/* Subtle top gold-neon decorative bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-[#ffd700] to-emerald-500/20 shadow-[0_0_10px_rgba(5,150,105,0.4)] rounded-t-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div
                className="relative mt-0 sm:-mt-2 z-30 group cursor-pointer shrink-0"
                onClick={onOpenEditProfile}
                title="Click to change profile picture or information"
              >
                <div className="p-1 rounded-3xl bg-gradient-to-br from-[#ffd700] via-[#059669] to-[#04331d] shadow-[0_0_20px_rgba(5,150,105,0.45)]">
                  <img
                    src={profile.avatarUrl || '/src/assets/images/boniphace_avatar_1791315268492.jpg'}
                    alt={profile.name}
                    className="w-28 h-28 sm:w-34 sm:h-34 rounded-[22px] object-cover object-center ring-4 ring-white dark:ring-[#08160f] shadow-xl group-hover:brightness-90 transition-all"
                  />
                </div>
                <div className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                </div>
                <span
                  className="absolute bottom-1 right-1 p-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-full ring-2 ring-white dark:ring-[#08160f] shadow-[0_0_8px_rgba(5,150,105,0.5)] border border-[#ffd700]/50"
                  title="Verified Creator"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#ffd700]" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-emerald-50 font-editorial">
                    {profile.name || 'Ev Dr. Boniphace J. Ndege'}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 shadow-[0_0_10px_rgba(255,215,0,0.4)] border border-[#ffd700]">
                    <Crown className="w-3.5 h-3.5 fill-slate-950" />
                    {isSwahili ? 'Muundaji Aliyethibitishwa' : 'Verified Creator'}
                  </span>
                </div>
                <div className="text-xs font-semibold text-emerald-700 dark:text-[#ffd700]/90 mt-0.5">
                  {profile.handle || '@boniphacendege'}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/80 mt-2 max-w-2xl leading-relaxed">
                  {isSwahili
                    ? (profile.bioSwahili || profile.bio || "Kujenga makazi ya kidijitali ambapo mawazo yanakuwa fursa · Teknolojia inapata maana kubwa zaidi inapowaunganisha watu, maarifa, jamii na biashara za uaminifu. Karibuni sana katika jukwaa letu rasmi la kidijitali.")
                    : (profile.bio || "Building a digital home where ideas become opportunities · Technology becomes more meaningful when it connects people, knowledge, community and trusted commerce. Welcome to our official digital platform.")}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap sm:flex-nowrap">
              <button
                onClick={onOpenEditProfile}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#d4af37] text-slate-950 hover:brightness-105 shadow-[0_0_14px_rgba(255,215,0,0.35)] transition-all cursor-pointer"
                title={isSwahili ? 'Hariri Taarifa za Wasifu, Bango & Picha' : 'Edit Profile Information, Banner & Avatar'}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isSwahili ? 'Hariri Wasifu' : 'Edit Profile'}</span>
              </button>

              <button
                onClick={onToggleFollow}
                className={`flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isFollowing
                    ? 'bg-slate-100 dark:bg-emerald-950/70 text-slate-800 dark:text-emerald-200 border border-emerald-900/15'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-[0_0_14px_rgba(5,150,105,0.35)] border border-[#ffd700]/30'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-[#ffd700]" />
                    {isSwahili ? 'Unafuata' : 'Following'}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    {isSwahili ? 'Fuata' : 'Follow'}
                  </>
                )}
              </button>

              <button
                onClick={() => onNavigate('messages')}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-emerald-950/40 text-slate-700 dark:text-emerald-100 border border-emerald-900/15 dark:border-emerald-500/25 hover:border-[#ffd700]/50 hover:shadow-[0_0_12px_rgba(5,150,105,0.3)] transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-[#ffd700]" />
                {isSwahili ? 'Ujumbe' : 'Message'}
              </button>

              <button
                onClick={onShareProfile}
                className="p-2.5 rounded-xl border border-emerald-900/15 dark:border-emerald-500/25 text-slate-600 dark:text-emerald-200 hover:border-[#ffd700]/50 hover:shadow-[0_0_12px_rgba(5,150,105,0.3)] transition-all"
                title={isSwahili ? 'Shiriki Wasifu' : 'Share Profile'}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-6 mt-6 border-t border-emerald-950/10 dark:border-emerald-500/15 text-center">
            <div
              onClick={onOpenCommunityFollowers}
              className="p-2 rounded-xl hover:bg-emerald-500/10 transition-all cursor-pointer group/stat"
              title={isSwahili ? 'Bofya kutazama wafuasi wote' : 'Click to view all followers'}
            >
              <span className="block text-lg sm:text-xl font-black text-slate-900 dark:text-[#ffd700] tabular-nums group-hover/stat:scale-105 transition-transform">
                {(profile.followersCount / 1000).toFixed(1)}K
              </span>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-emerald-400/70 uppercase tracking-tight group-hover/stat:text-[#ffd700]">
                {isSwahili ? 'Wafuasi' : 'Followers'}
              </span>
            </div>

            <div
              onClick={onOpenCommunityFollowers}
              className="p-2 rounded-xl hover:bg-emerald-500/10 transition-all cursor-pointer group/stat"
              title={isSwahili ? 'Bofya kutazama wanaofuatwa' : 'Click to view following list'}
            >
              <span className="block text-lg sm:text-xl font-black text-slate-900 dark:text-emerald-50 tabular-nums group-hover/stat:scale-105 transition-transform">
                {profile.followingCount}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-emerald-400/70 uppercase tracking-tight group-hover/stat:text-emerald-300">
                {isSwahili ? 'Wanaofuatwa' : 'Following'}
              </span>
            </div>

            <div className="p-2">
              <span className="block text-lg sm:text-xl font-black text-slate-900 dark:text-emerald-50 tabular-nums">
                {profile.postsCount}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-emerald-400/70 uppercase tracking-tight">
                {isSwahili ? 'Machapisho' : 'Posts'}
              </span>
            </div>

            <div className="p-2">
              <span className="block text-lg sm:text-xl font-black text-slate-900 dark:text-[#ffd700] tabular-nums">
                {profile.booksCount}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-emerald-400/70 uppercase tracking-tight">
                {isSwahili ? 'Vitabu' : 'Books'}
              </span>
            </div>

            <div className="p-2">
              <span className="block text-lg sm:text-xl font-black text-slate-900 dark:text-emerald-50 tabular-nums">
                {profile.videosCount}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-emerald-400/70 uppercase tracking-tight">
                {isSwahili ? 'Video' : 'Videos'}
              </span>
            </div>

            <div className="p-2">
              <span className="block text-lg sm:text-xl font-black text-slate-900 dark:text-[#ffd700] tabular-nums">
                {(profile.productsCount / 1000).toFixed(1)}K
              </span>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-emerald-400/70 uppercase tracking-tight">
                {isSwahili ? 'Bidhaa' : 'Products'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
