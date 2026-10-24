import React from 'react';
import { PenTool, BookOpen, PlaySquare, Radio, MessageSquare, Store, LayoutGrid, CheckCircle2, RotateCcw } from 'lucide-react';

import { AuthUser } from '../types';

export type DashboardFilter = 'all' | 'blog' | 'books' | 'videos' | 'live' | 'messages' | 'shop';

interface QuickAccessProps {
  onNavigate?: (sectionId: string) => void;
  language?: string;
  currentUser?: AuthUser | null;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onShowToast?: (msg: string) => void;
  activeFilter?: DashboardFilter;
  onSelectFilter?: (filter: DashboardFilter) => void;
}

export const QuickAccess: React.FC<QuickAccessProps> = ({
  onNavigate,
  language,
  currentUser = null,
  onOpenAuth,
  onShowToast,
  activeFilter = 'all',
  onSelectFilter,
}) => {
  const isSwahili = language === 'Swahili';

  const items = [
    {
      id: 'all' as DashboardFilter,
      label: isSwahili ? 'Zote' : 'All',
      icon: LayoutGrid,
      desc: isSwahili ? 'Maudhui Yote' : 'Show Everything',
    },
    {
      id: 'blog' as DashboardFilter,
      label: isSwahili ? 'Makala' : 'Blog',
      icon: PenTool,
      desc: isSwahili ? 'Mawazo & Maarifa' : 'Articles & Ideas',
    },
    {
      id: 'books' as DashboardFilter,
      label: isSwahili ? 'Vitabu' : 'Books',
      icon: BookOpen,
      desc: isSwahili ? 'Dijitali & Nakala' : 'Digital & Print',
    },
    {
      id: 'videos' as DashboardFilter,
      label: isSwahili ? 'Video' : 'Videos',
      icon: PlaySquare,
      desc: isSwahili ? 'Maudhui ya Video' : 'YouTube-Style',
    },
    {
      id: 'live' as DashboardFilter,
      label: isSwahili ? 'Mubashara' : 'Live',
      icon: Radio,
      desc: isSwahili ? 'Mikutano & Matangazo' : 'Conferencing',
    },
    {
      id: 'messages' as DashboardFilter,
      label: isSwahili ? 'Ujumbe' : 'Chat',
      icon: MessageSquare,
      desc: isSwahili ? 'Mawasiliano ya Moja' : 'Direct Messaging',
    },
    {
      id: 'shop' as DashboardFilter,
      label: 'Open Shop',
      icon: Store,
      desc: isSwahili ? 'Nunua & Uza Bidhaa' : 'Marketplace',
    },
  ];

  const handleItemClick = (filterId: DashboardFilter) => {
    // If user clicks, activate the filter
    if (onSelectFilter) {
      onSelectFilter(filterId);
    }
    if (onNavigate) {
      if (filterId === 'all') {
        onNavigate('feed');
      } else {
        onNavigate(filterId);
      }
    }
  };

  const currentActiveItem = items.find((i) => i.id === activeFilter) || items[0];

  return (
    <section className="py-10 max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-emerald-50 tracking-tight font-editorial">
            {isSwahili ? 'Kila Kitu Mahali Pamoja' : 'Everything in One Place'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1">
            {isSwahili
              ? 'Gusa kitengo kuona hicho pekee kwenye Dashibodi, au chagua "Zote" kuona vyote.'
              : 'Press any item to view only that section on the Dashboard, or select "All" to show everything.'}
          </p>
        </div>

        {/* Status Pill indicating active filter */}
        {activeFilter !== 'all' && (
          <div className="flex items-center gap-2 bg-[#061e13] border border-[#ffd700]/50 rounded-2xl px-3.5 py-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
            <span className="text-xs font-bold text-white">
              {isSwahili ? 'Inaonyesha:' : 'Showing:'}{' '}
              <span className="text-[#ffd700]">{currentActiveItem.label}</span>
            </span>
            <button
              type="button"
              onClick={() => handleItemClick('all')}
              className="ml-2 inline-flex items-center gap-1 text-[11px] font-black text-emerald-300 hover:text-white bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/40 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isSwahili ? 'Onyesha Zote' : 'Show All'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeFilter === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`group p-3.5 rounded-2xl text-center transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-gradient-to-b from-[#0a2a1b] to-[#04150d] border-2 border-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.35)] scale-103'
                  : 'card-neon-gold hover:-translate-y-1'
              }`}
            >
              {isActive && (
                <span className="absolute top-2 right-2 p-0.5 rounded-full bg-[#ffd700] text-slate-950 shadow-xs">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
              )}

              <div
                className={`w-11 h-11 mx-auto rounded-xl flex items-center justify-center mb-2.5 transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-[#ffd700] to-[#f5d061] text-slate-950 shadow-md font-bold'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-[#ffd700] border border-emerald-500/20 group-hover:border-[#ffd700]/50 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-emerald-600 group-hover:to-emerald-700 group-hover:text-[#ffd700]'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <strong
                className={`block text-xs font-bold mb-0.5 transition-colors truncate ${
                  isActive
                    ? 'text-[#ffd700]'
                    : 'text-slate-900 dark:text-emerald-50 group-hover:text-emerald-600 dark:group-hover:text-[#ffd700]'
                }`}
              >
                {item.label}
              </strong>
              <span className="text-[10px] text-slate-400 dark:text-emerald-400/70 block truncate">
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
