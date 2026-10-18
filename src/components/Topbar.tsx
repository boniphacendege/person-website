import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  ShoppingBag,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Package,
  UserPlus,
} from 'lucide-react';
import { UserProfile, AuthUser } from '../types';
import { BritishFlag, TanzaniaFlag } from './Flags';

interface TopbarProps {
  profile: UserProfile;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onToggleSidebar: () => void;
  onOpenNotifications: () => void;
  onOpenCart: () => void;
  onNavigate: (sectionId: string) => void;
  cartCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenEditProfile: () => void;
  onOpenMyProfile?: () => void;
  onOpenCommunityFollowers?: () => void;
  language?: string;
  onChangeLanguage?: (lang: string) => void;
  currentUser?: AuthUser | null;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onSignOut?: () => void;
  onTriggerPreloader?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  profile,
  onToggleSidebar,
  onOpenNotifications,
  onOpenCart,
  onNavigate,
  cartCount,
  searchQuery,
  onSearchChange,
  onOpenEditProfile,
  language = 'English',
  onChangeLanguage,
  currentUser = null,
  onOpenAuth,
  onSignOut,
  onTriggerPreloader,
  onOpenMyProfile,
  onOpenCommunityFollowers,
}) => {
  const isSwahili = language === 'Swahili';
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="fixed top-0 left-0 right-0 h-18 z-40 bg-white/95 dark:bg-[#06140d]/95 backdrop-blur-md border-b border-emerald-900/15 dark:border-emerald-500/25 neon-header-glow transition-all">
      {/* Low-bright dark green neon & pure gold decorative accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-600/30 via-[#ffd700] to-emerald-600/30 shadow-[0_0_12px_rgba(5,150,105,0.45)]" />

      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Brand */}
        <div className="flex items-center gap-3 min-w-fit">
          <button
            onClick={onToggleSidebar}
            className="p-2 md:hidden rounded-xl border border-emerald-900/15 dark:border-emerald-500/25 text-slate-700 dark:text-emerald-100 hover:border-[#ffd700]/50 hover:bg-emerald-500/10 hover:shadow-[0_0_12px_rgba(5,150,105,0.3)] transition-all"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="flex items-center gap-3 group"
          >
            <div className="relative p-[1.5px] rounded-xl bg-gradient-to-br from-[#ffd700] via-[#00a651] to-[#087a45] shadow-[0_0_14px_rgba(5,150,105,0.35)] group-hover:scale-105 transition-transform">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-gradient-to-br from-[#06331e] to-[#031d10] text-[#ffd700] flex items-center justify-center font-black text-base sm:text-lg border border-[#ffd700]/30 shadow-inner">
                BN
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-slate-900 dark:text-emerald-50 text-base leading-tight block group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                {profile.name}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-emerald-300/70 font-medium tracking-tight flex items-center gap-1.5">
                <span>Open Shop</span>
                <span className="text-[#ffd700] font-black text-xs">·</span>
                <span>{isSwahili ? 'Maudhui' : 'Media'}</span>
                <span className="text-[#ffd700] font-black text-xs">·</span>
                <span className="text-emerald-600 dark:text-[#ffd700] font-bold">{isSwahili ? 'Jamii' : 'Community'}</span>
              </span>
            </div>
          </a>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <div className="relative group">
            <Search className="w-4 h-4 text-emerald-600 dark:text-[#ffd700] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isSwahili ? 'Tafuta vitabu, bidhaa, video, makala...' : 'Search books, products, videos, articles...'}
              className="w-full h-10 pl-10 pr-4 text-sm bg-slate-100 dark:bg-[#0a1e14]/80 border border-emerald-950/10 dark:border-emerald-500/20 rounded-xl text-slate-900 dark:text-emerald-50 placeholder-slate-400 dark:placeholder-emerald-300/40 focus:outline-none focus:border-[#ffd700]/70 focus:bg-white dark:focus:bg-[#0c2217] focus:shadow-[0_0_16px_rgba(5,150,105,0.3),0_0_8px_rgba(255,215,0,0.25)] transition-all"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          {onChangeLanguage && (
            <button
              onClick={() => onChangeLanguage(isSwahili ? 'English' : 'Swahili')}
              className="h-10 px-2.5 rounded-xl border border-emerald-900/15 dark:border-emerald-500/25 text-slate-800 dark:text-emerald-100 flex items-center gap-1.5 hover:border-[#ffd700]/50 hover:bg-emerald-500/10 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title={isSwahili ? 'Badilisha kwenda Kiingereza (Switch to English)' : 'Switch to Swahili (Badilisha kwenda Kiswahili)'}
            >
              <div className="flex items-center">
                {isSwahili ? (
                  <TanzaniaFlag className="w-5 h-3.5" />
                ) : (
                  <BritishFlag className="w-5 h-3.5" />
                )}
              </div>
              <span className="hidden sm:inline text-[11px] font-extrabold text-emerald-700 dark:text-[#ffd700]">
                {isSwahili ? 'SW' : 'EN'}
              </span>
            </button>
          )}

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-xl border border-emerald-900/15 dark:border-emerald-500/25 text-slate-700 dark:text-emerald-100 flex items-center justify-center hover:text-emerald-600 hover:border-[#ffd700]/50 hover:bg-emerald-500/10 hover:shadow-[0_0_12px_rgba(5,150,105,0.3)] transition-all"
            title={isSwahili ? 'Taarifa' : 'Notifications'}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#07120d]" />
          </button>

          {/* Messages */}
          <button
            onClick={() => onNavigate('messages')}
            className="w-10 h-10 rounded-xl border border-emerald-900/15 dark:border-emerald-500/25 text-slate-700 dark:text-emerald-100 flex items-center justify-center hover:text-emerald-600 hover:border-[#ffd700]/50 hover:bg-emerald-500/10 hover:shadow-[0_0_12px_rgba(5,150,105,0.3)] transition-all"
            title={isSwahili ? 'Ujumbe' : 'Messages'}
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white flex items-center justify-center border border-[#ffd700]/40 shadow-[0_0_14px_rgba(5,150,105,0.35)] transition-all cursor-pointer"
            title={isSwahili ? 'Kikapu cha Manunuzi' : 'Shopping Cart'}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-50" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center text-[10px] font-extrabold bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 rounded-full ring-2 ring-white dark:ring-[#07120d] shadow-[0_0_8px_rgba(255,215,0,0.5)]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Preloader Reload Button */}
          {onTriggerPreloader && (
            <button
              onClick={onTriggerPreloader}
              className="w-10 h-10 rounded-xl border border-emerald-900/15 dark:border-emerald-500/25 text-slate-700 dark:text-emerald-100 flex items-center justify-center hover:text-[#ffd700] hover:border-[#ffd700]/50 hover:bg-emerald-500/10 transition-all cursor-pointer hidden sm:flex"
              title={isSwahili ? 'Onyesha Tena Uhuishaji wa Mwanzo (Preloader)' : 'Re-experience Preloader Animation'}
            >
              <Sparkles className="w-4 h-4 text-[#ffd700]" />
            </button>
          )}

          {/* User Authentication Status */}
          {currentUser ? (
            /* Logged-In User Profile Dropdown */
            <div className="relative pl-1 border-l border-emerald-900/15 dark:border-emerald-500/25" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-emerald-500/10 transition-all cursor-pointer select-none"
                title="Account menu"
              >
                <div className="relative p-0.5 rounded-full bg-gradient-to-br from-[#ffd700] to-emerald-500 shadow-[0_0_10px_rgba(5,150,105,0.35)]">
                  <img
                    src={currentUser.avatarUrl || profile.avatarUrl || '/src/assets/images/boniphace_avatar_1791315268492.jpg'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#07120d]" />
                </div>
                <div className="hidden lg:block text-left">
                  <span className="text-xs font-semibold text-slate-800 dark:text-emerald-100 block leading-none">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-[#ffd700] font-bold block leading-none mt-0.5">
                    {currentUser.role === 'admin' ? (isSwahili ? 'Msimamizi' : 'Creator / Admin') : (isSwahili ? 'Mwanachama' : 'Member')}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
              </button>

              {/* Account Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-12 w-64 bg-white dark:bg-[#07190f] border border-emerald-950/15 dark:border-emerald-500/30 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Info Header */}
                  <div className="p-3 bg-slate-50 dark:bg-[#03150b] rounded-xl border border-emerald-950/10 dark:border-emerald-500/15 mb-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-emerald-50 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-emerald-300/70 truncate">
                      {currentUser.email}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 dark:text-[#ffd700] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{isSwahili ? 'Akaunti Imethibitishwa' : 'Verified Member'}</span>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="space-y-0.5 text-xs">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenCart();
                      }}
                      className="w-full px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-emerald-100 text-left flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Package className="w-4 h-4 text-emerald-500" />
                      <span>{isSwahili ? 'Maagizo Yangu' : 'My Orders & Cart'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenMyProfile?.();
                      }}
                      className="w-full px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-emerald-100 text-left flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <User className="w-4 h-4 text-[#ffd700]" />
                      <span>{isSwahili ? 'Wasifu Wangu' : 'My Member Profile'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenCommunityFollowers?.();
                      }}
                      className="w-full px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-emerald-100 text-left flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>{isSwahili ? 'Wafuasi & Jamii' : 'Followers & Members'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenEditProfile();
                      }}
                      className="w-full px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-emerald-100 text-left flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>{isSwahili ? 'Mipangilio ya Akaunti' : 'Account Settings'}</span>
                    </button>

                    {onTriggerPreloader && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onTriggerPreloader();
                        }}
                        className="w-full px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-emerald-100 text-left flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Sparkles className="w-4 h-4 text-[#ffd700]" />
                        <span>{isSwahili ? 'Onyesha Preloader' : 'Replay Preloader'}</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-emerald-950/40 my-1" />

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSignOut?.();
                      }}
                      className="w-full px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-left flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{isSwahili ? 'Toka kwenye Akaunti' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth?.('signup')}
              className="h-10 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 border border-[#ffd700]/30 shadow-[0_0_12px_rgba(5,150,105,0.3)] transition-all cursor-pointer shrink-0"
              title={isSwahili ? 'Jiunge na Jamii / Ingia' : 'Join Community / Sign In'}
            >
              <UserPlus className="w-3.5 h-3.5 text-[#ffd700]" />
              <span className="hidden sm:inline">{isSwahili ? 'Jiunge na Jamii' : 'Join Community'}</span>
              <span className="sm:hidden">{isSwahili ? 'Jiunge' : 'Join'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
