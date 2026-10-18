import React from 'react';
import { Users, Heart, Eye, Wallet, ShieldCheck, Cloud, Globe, Lock } from 'lucide-react';
import { UserProfile } from '../types';

interface DashboardSectionProps {
  profile: UserProfile;
  language?: string;
  isAdmin?: boolean;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  profile,
  language,
  isAdmin = false,
  onOpenAuth,
}) => {
  const isSwahili = language === 'Swahili';

  return (
    <section id="dashboard" className="py-12 max-w-6xl mx-auto px-4 border-t border-emerald-950/10 dark:border-emerald-500/15">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-500 dark:text-[#ffd700] flex items-center gap-1">
            <Lock className="w-3 h-3" />
            {isSwahili ? 'Kipengele cha Msimamizi Pekee' : 'Admin Only Feature'}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-emerald-50 tracking-tight font-editorial">
          {isSwahili ? 'Dashibodi ya Jukwaa' : 'Platform Dashboard'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1">
          {isSwahili
            ? 'Muhtasari kamili wa jukwaa na ufanisi wa mifumo ya kidijitali (Inahitaji idhini ya Msimamizi).'
            : 'Your complete platform overview and digital operations health (Requires Admin credentials).'}
        </p>
      </div>

      {!isAdmin && (
        <div className="mb-8 p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-500 dark:text-[#ffd700] shrink-0" />
            <div>
              <p className="font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Ufikiaji wa Dashibodi Umezuiwa' : 'Dashboard Access Restricted'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-emerald-300/80 mt-0.5">
                {isSwahili
                  ? 'Takwimu za ndani za mfumo, mapato na dashibodi ya msimamizi zinaruhusiwa kwa Msimamizi pekee (Ev Dr. Boniphace J. Ndege).'
                  : 'Platform metrics, analytics and administrative financial controls are accessible exclusively to Admin (Ev Dr. Boniphace J. Ndege).'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenAuth?.('login')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-500 dark:text-[#ffd700] border border-amber-500/30 hover:bg-amber-500/25 transition-all self-start sm:self-auto cursor-pointer"
          >
            {isSwahili ? 'Ingia kama Msimamizi' : 'Sign in as Admin'}
          </button>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-neon-gold p-5 rounded-3xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-[#ffd700] flex items-center justify-center mb-3 border border-emerald-500/20">
            <Users className="w-5 h-5" />
          </div>
          <strong className="block text-2xl font-black text-slate-900 dark:text-emerald-50 tabular-nums">
            {profile.followersCount.toLocaleString()}
          </strong>
          <span className="text-xs text-slate-400">
            {isSwahili ? 'Jumla ya Wafuasi' : 'Total Followers'}
          </span>
        </div>

        <div className="card-neon-gold p-5 rounded-3xl">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 border border-rose-500/20">
            <Heart className="w-5 h-5" />
          </div>
          <strong className="block text-2xl font-black text-slate-900 dark:text-emerald-50 tabular-nums">
            48,291
          </strong>
          <span className="text-xs text-slate-400">
            {isSwahili ? 'Upendo wa Wasomaji' : 'Audience Likes'}
          </span>
        </div>

        <div className="card-neon-gold p-5 rounded-3xl">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 border border-blue-500/20">
            <Eye className="w-5 h-5" />
          </div>
          <strong className="block text-2xl font-black text-slate-900 dark:text-emerald-50 tabular-nums">
            284K
          </strong>
          <span className="text-xs text-slate-400">
            {isSwahili ? 'Jumla ya Mionekano' : 'Cumulative Views'}
          </span>
        </div>

        <div className="card-neon-gold p-5 rounded-3xl">
          <div className="w-10 h-10 rounded-xl bg-[#ffd700]/15 text-slate-900 dark:text-[#ffd700] flex items-center justify-center mb-3 border border-[#ffd700]/30 shadow-[0_0_8px_rgba(255,215,0,0.3)]">
            <Wallet className="w-5 h-5 text-[#ffd700]" />
          </div>
          <strong className="block text-2xl font-black text-slate-900 dark:text-[#ffd700] tabular-nums">
            TZS 4.8M
          </strong>
          <span className="text-xs text-slate-400">
            {isSwahili ? 'Mapato Safi ya Jukwaa' : 'Net Platform Revenue'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Activity */}
        <div className="card-neon-gold p-6 sm:p-8 rounded-3xl">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-emerald-50 mb-5 flex items-center justify-between">
            <span>{isSwahili ? 'Shughuli za Jukwaa' : 'Platform Activity'}</span>
            <span className="text-[11px] font-extrabold text-[#ffd700] uppercase tracking-wider">
              {isSwahili ? 'Vipimo Mubashara' : 'Live Metrics'}
            </span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600 dark:text-emerald-200">
                <span>{isSwahili ? 'Machapisho & Jamii' : 'Posts & Community'}</span>
                <span className="tabular-nums">68%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-emerald-950/60 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[68%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600 dark:text-emerald-200">
                <span>{isSwahili ? 'Vitabu & Uchapishaji' : 'Books & Publishing'}</span>
                <span className="tabular-nums">52%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-emerald-950/60 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-[#ffd700] rounded-full w-[52%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600 dark:text-emerald-200">
                <span>{isSwahili ? 'Video & Matangazo' : 'Videos & Streaming'}</span>
                <span className="tabular-nums">84%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-emerald-950/60 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full w-[84%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600 dark:text-emerald-200">
                <span>{isSwahili ? 'Soko la Dunia' : 'Global Shopping'}</span>
                <span className="tabular-nums text-[#ffd700]">73%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-emerald-950/60 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#ffd700] to-[#f5d061] rounded-full w-[73%] shadow-[0_0_8px_rgba(255,215,0,0.4)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features Status */}
        <div className="card-neon-gold p-6 sm:p-8 rounded-3xl space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-emerald-50 mb-3">
            {isSwahili ? 'Miundombinu ya Jukwaa' : 'Platform Infrastructure'}
          </h3>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50">
                  {isSwahili ? 'Akaunti na Usalama Imara' : 'Secure Account & Auth'}
                </strong>
                <span className="text-[11px] text-slate-400">
                  {isSwahili ? 'Uthibitishaji salama wa taarifa na akaunti' : 'End-to-end credential and session integrity'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              {isSwahili ? 'Inafanya Kazi' : 'Active'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50">
                  Persistent Storage Engine
                </strong>
                <span className="text-[11px] text-slate-400">
                  Real-time database sync and media storage
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Ready
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50">
                  Global Marketplace Engine
                </strong>
                <span className="text-[11px] text-slate-400">
                  Integrated checkout and multi-seller catalog
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Live
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
