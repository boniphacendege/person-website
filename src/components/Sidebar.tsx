import React from 'react';
import {
  Home,
  User,
  PenTool,
  BookOpen,
  PlaySquare,
  Radio,
  Users,
  Compass,
  MessageCircle,
  Store,
  Tag,
  ShoppingCart,
  Package,
  Sparkles,
  Store as ShopIcon,
  BarChart3,
  Settings,
  HelpCircle,
  X,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { AuthUser } from '../types';

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSettings: () => void;
  onOpenEditProfile: () => void;
  onShowToast: (msg: string) => void;
  language?: string;
  currentUser?: AuthUser | null;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onSignOut?: () => void;
  onOpenCommunityFollowers?: () => void;
  onOpenMyProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onNavigate,
  isOpen,
  onClose,
  cartCount,
  onOpenCart,
  onOpenSettings,
  onOpenEditProfile,
  onShowToast,
  language = 'English',
  currentUser = null,
  onOpenAuth,
  onSignOut,
  onOpenCommunityFollowers,
  onOpenMyProfile,
}) => {
  const isSwahili = language === 'Swahili';

  const handleItemClick = (sectionId: string, action?: () => void) => {
    // If visitor is unauthenticated, redirect to login when opening features
    if (!currentUser) {
      if (sectionId !== 'home' && sectionId !== 'about') {
        onOpenAuth?.('login');
        onShowToast(
          isSwahili
            ? 'Tafadhali ingia kwenye akaunti yako ili kufungua na kutumia huduma hii.'
            : 'Please sign in to access and open this feature.'
        );
        onClose();
        return;
      }
    }

    // Protect admin-restricted sections
    if (['creator', 'seller', 'dashboard'].includes(sectionId)) {
      if (!currentUser) {
        onOpenAuth?.('login');
        onShowToast(
          isSwahili
            ? 'Tafadhali ingia kama Msimamizi (Admin) ili kufungua sehemu hii.'
            : 'Please sign in as Admin to access this feature.'
        );
        onClose();
        return;
      } else if (currentUser.role !== 'admin') {
        onShowToast(
          isSwahili
            ? 'Kipengele hiki ni cha Msimamizi (Admin) pekee. Wageni na wanachama hawaruhusiwi.'
            : 'This feature is restricted to Admin only. Members and visitors cannot access it.'
        );
        onClose();
        return;
      }
    }

    if (action) {
      action();
    } else {
      onNavigate(sectionId);
    }
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed top-18 bottom-0 left-0 w-64 bg-white dark:bg-[#0c1811] border-r border-emerald-950/10 dark:border-emerald-500/15 z-40 overflow-y-auto transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Mobile close button */}
          <div className="flex items-center justify-between md:hidden pb-2 border-b border-emerald-950/10 dark:border-emerald-500/15">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isSwahili ? 'Urambazaji' : 'Navigation'}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-emerald-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section: Personal */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-400/60 px-3 mb-2">
              {isSwahili ? 'Binafsi' : 'Personal'}
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => handleItemClick('home')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === 'home'
                    ? 'bg-gradient-to-r from-emerald-600/15 via-[#ffd700]/15 to-transparent text-emerald-800 dark:text-[#ffd700] border-l-2 border-[#ffd700] shadow-[0_0_10px_rgba(5,150,105,0.2)] font-bold'
                    : 'text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                <Home className={`w-4 h-4 ${activeSection === 'home' ? 'text-[#ffd700]' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <span>{isSwahili ? 'Mwanzo' : 'Home'}</span>
              </button>

              <button
                onClick={() => handleItemClick('about')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === 'about'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isSwahili ? 'Kuhusu Mimi' : 'About Me'}</span>
              </button>

              <button
                onClick={() => handleItemClick('blog')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === 'blog'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                <PenTool className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isSwahili ? 'Makala' : 'Blog'}</span>
              </button>

              <button
                onClick={() => handleItemClick('books')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === 'books'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isSwahili ? 'Vitabu' : 'Books'}</span>
              </button>

              <button
                onClick={() => handleItemClick('videos')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === 'videos'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                <PlaySquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isSwahili ? 'Video' : 'Videos'}</span>
              </button>

              <button
                onClick={() => handleItemClick('live')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === 'live'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                <Radio className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isSwahili ? 'Mubashara & Vikao' : 'Live & Meetings'}</span>
              </button>
            </nav>
          </div>

          {/* Section: Community */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-400/60 px-3 mb-2">
              {isSwahili ? 'Jamii' : 'Community'}
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenCommunityFollowers?.();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isSwahili ? 'Wafuasi & Jamii' : 'Followers & Members'}</span>
                </div>
                <span className="text-[10px] font-bold text-[#ffd700] px-2 py-0.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30">
                  {isSwahili ? 'Wote' : 'Community'}
                </span>
              </button>

              <button
                onClick={() => {
                  onShowToast(isSwahili ? 'Inagundua waundaji na bidhaa...' : 'Discovering trending creators and products...');
                  handleItemClick('shop');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition-all"
              >
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isSwahili ? 'Gundua' : 'Discover'}</span>
              </button>

              <button
                onClick={() => handleItemClick('messages')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === 'messages'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isSwahili ? 'Ujumbe' : 'Messages'}</span>
              </button>
            </nav>
          </div>

          {/* Section: Open Shop */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-400/60 px-3 mb-2">
              {isSwahili ? 'Soko la Open Shop' : 'Open Shop'}
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => handleItemClick('shop')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === 'shop'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Open Shop</span>
              </button>

              <button
                onClick={() => handleItemClick('shop')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition-all"
              >
                <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isSwahili ? 'Vitengo vya Bidhaa' : 'Categories'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenCart();
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isSwahili ? 'Kikapu' : 'Cart'}</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full">
                  {cartCount}
                </span>
              </button>

              <button
                onClick={() => {
                  onShowToast(isSwahili ? 'Inaleta historia yako ya maagizo...' : 'Fetching your order history from Open Shop...');
                  handleItemClick('seller');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition-all"
              >
                <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isSwahili ? 'Maagizo Yangu' : 'My Orders'}</span>
              </button>
            </nav>
          </div>

          {/* Section: Creator & Business */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-400/60 px-3 mb-2">
              {isSwahili ? 'Studio & Biashara' : 'Creator & Business'}
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => handleItemClick('creator')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === 'creator'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isSwahili ? 'Studio ya Muundaji' : 'Creator Studio'}</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-500 dark:text-[#ffd700] border border-amber-500/30">
                  Admin 🔒
                </span>
              </button>

              <button
                onClick={() => handleItemClick('seller')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === 'seller'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShopIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isSwahili ? 'Kituo cha Muuzaji' : 'Seller Center'}</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-500 dark:text-[#ffd700] border border-amber-500/30">
                  Admin 🔒
                </span>
              </button>

              <button
                onClick={() => handleItemClick('dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === 'dashboard'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isSwahili ? 'Dashibodi' : 'Dashboard'}</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-500 dark:text-[#ffd700] border border-amber-500/30">
                  Admin 🔒
                </span>
              </button>
            </nav>
          </div>

          {/* Section: Account */}
          <div className="pt-2 border-t border-emerald-950/10 dark:border-emerald-500/15">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-400/60 px-3 mb-2">
              {isSwahili ? 'Akaunti' : 'Account'}
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth?.('login');
                    onShowToast(isSwahili ? 'Tafadhali ingia ili kuhariri wasifu wako.' : 'Please sign in to view and edit profile.');
                    onClose();
                    return;
                  }
                  onOpenEditProfile();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition-all"
              >
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isSwahili ? 'Hariri Wasifu' : 'Edit Profile'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenSettings();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition-all"
              >
                <Settings className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isSwahili ? 'Mipangilio' : 'Settings'}</span>
              </button>

              <button
                onClick={() => onShowToast(isSwahili ? 'Dawati la msaada liko wazi saa 24/7.' : 'Help Center is available 24/7.')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-emerald-100/80 hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition-all"
              >
                <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isSwahili ? 'Kituo cha Usaidizi' : 'Help Center'}</span>
              </button>

              {/* Authentication Button in Sidebar */}
              <div className="pt-2">
                {currentUser ? (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-[#062414] border border-emerald-950/10 dark:border-emerald-500/20 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 dark:text-emerald-50 truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-emerald-300/70 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenMyProfile?.();
                      }}
                      className="w-full py-1.5 px-2 rounded-lg bg-emerald-700/20 hover:bg-emerald-700/35 text-emerald-300 hover:text-white text-[11px] font-bold border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#ffd700]" />
                      <span>{isSwahili ? 'Wasifu Wangu' : 'My Member Profile'}</span>
                    </button>
                    <button
                      onClick={() => {
                        onSignOut?.();
                        onClose();
                      }}
                      className="w-full py-1.5 px-2 rounded-lg bg-white dark:bg-emerald-950 text-rose-600 dark:text-rose-300 text-[11px] font-bold border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/60 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isSwahili ? 'Toka kwenye Akaunti' : 'Sign Out'}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onOpenAuth?.('login');
                      onClose();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-md border border-[#ffd700]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isSwahili ? 'Ingia / Jisajili' : 'Sign In / Register'}</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};
