import React from 'react';
import { PenTool, BookOpen, PlaySquare, Radio, MessageSquare, Store } from 'lucide-react';

import { AuthUser } from '../types';

interface QuickAccessProps {
  onNavigate: (sectionId: string) => void;
  language?: string;
  currentUser?: AuthUser | null;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onShowToast?: (msg: string) => void;
}

export const QuickAccess: React.FC<QuickAccessProps> = ({
  onNavigate,
  language,
  currentUser = null,
  onOpenAuth,
  onShowToast,
}) => {
  const isSwahili = language === 'Swahili';

  const items = [
    {
      id: 'blog',
      label: isSwahili ? 'Makala' : 'Blog',
      icon: PenTool,
      desc: isSwahili ? 'Mawazo & Maarifa' : 'Articles & Ideas',
    },
    {
      id: 'books',
      label: isSwahili ? 'Vitabu' : 'Books',
      icon: BookOpen,
      desc: isSwahili ? 'Dijitali & Nakala' : 'Digital & Print',
    },
    {
      id: 'videos',
      label: isSwahili ? 'Video' : 'Videos',
      icon: PlaySquare,
      desc: isSwahili ? 'Maudhui ya Video' : 'YouTube-Style',
    },
    {
      id: 'live',
      label: isSwahili ? 'Mubashara' : 'Live',
      icon: Radio,
      desc: isSwahili ? 'Mikutano & Matangazo' : 'Conferencing',
    },
    {
      id: 'messages',
      label: isSwahili ? 'Ujumbe' : 'Chat',
      icon: MessageSquare,
      desc: isSwahili ? 'Mawasiliano ya Moja' : 'Direct Messaging',
    },
    {
      id: 'shop',
      label: 'Open Shop',
      icon: Store,
      desc: isSwahili ? 'Nunua & Uza Bidhaa' : 'Marketplace',
    },
  ];

  return (
    <section className="py-12 max-w-6xl mx-auto px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-emerald-50 tracking-tight font-editorial">
          {isSwahili ? 'Kila Kitu Mahali Pamoja' : 'Everything in One Place'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1">
          {isSwahili
            ? 'Ungana, buni maudhui, jifunze maarifa, wasiliana na fanya ununuzi.'
            : 'Connect, create, learn, communicate and shop.'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (!currentUser) {
                  onOpenAuth?.('login');
                  onShowToast?.(
                    isSwahili
                      ? 'Tafadhali ingia kwenye akaunti yako ili kufungua na kutumia huduma hii.'
                      : 'Please sign in to access and use this feature.'
                  );
                  return;
                }
                onNavigate(item.id);
              }}
              className="group p-4 card-neon-gold rounded-2xl text-center hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-[#ffd700] border border-emerald-500/20 group-hover:border-[#ffd700]/50 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-emerald-600 group-hover:to-emerald-700 group-hover:text-[#ffd700] transition-all shadow-[0_0_8px_rgba(5,150,105,0.2)]">
                <Icon className="w-5 h-5" />
              </div>
              <strong className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50 mb-0.5 group-hover:text-emerald-600 dark:group-hover:text-[#ffd700] transition-colors">
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
