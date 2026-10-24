import React from 'react';
import { Mail, UserPlus, BookOpen, Play, Store } from 'lucide-react';

interface AboutSectionProps {
  onOpenContact: () => void;
  language?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenContact, language }) => {
  const isSwahili = language === 'Swahili';

  return (
    <section id="about" className="py-12 max-w-6xl mx-auto px-4 border-t border-emerald-950/10 dark:border-emerald-500/15">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-emerald-50 tracking-tight font-editorial">
            {isSwahili ? 'Kuhusu Ev Dr. Boniphace J. Ndege' : 'About Ev Dr. Boniphace J. Ndege'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1 max-w-xl">
            {isSwahili
              ? 'Mfumo wa kipekee wa kidijitali uliojengwa kwa misingi ya watu, maarifa, ubunifu na biashara.'
              : 'A personal digital ecosystem built around people, knowledge, creativity and commerce.'}
          </p>
        </div>

        <button
          onClick={onOpenContact}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Mail className="w-4 h-4" />
          {isSwahili ? 'Wasiliana Nami' : 'Contact'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Story Card */}
        <div className="card-neon-gold p-6 sm:p-8 rounded-3xl">
          <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/10 via-[#ffd700]/60 to-emerald-500/10 mb-4 rounded-full" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-emerald-50 mb-3 flex items-center justify-between">
            <span>{isSwahili ? 'Simulizi Yangu' : 'My Story'}</span>
            <span className="text-xs text-[#ffd700] font-bold">
              {isSwahili ? 'Mwandishi & Muundaji' : 'Author & Creator'}
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/75 leading-relaxed">
            {isSwahili
              ? 'Ev Dr. Boniphace J. Ndege ni jukwaa binafsi la kidijitali lililobuniwa kuunganisha maudhui, uchapishaji wa vitabu, video, jamii, mawasiliano na biashara katika mfumo mmoja wa kisasa mtandaoni.'
              : 'Ev Dr. Boniphace J. Ndege is a personal digital brand designed to bring content, publishing, video, community, communication and commerce together in one modern online experience.'}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/75 leading-relaxed mt-4">
            {isSwahili
              ? 'Wageni na wanachama wanaweza kufuata jukwaa, kusoma makala, kugundua vitabu, kutazama video, kushiriki vipindi mubashara, kuwasiliana na wengine na kununua bidhaa kupitia Soko la Kimataifa.'
              : 'Visitors can follow the platform, read articles, discover books, watch videos, join live sessions, communicate with other members and purchase products through Global Shopping.'}
          </p>
        </div>

        {/* What You Can Do Card */}
        <div className="card-neon-gold p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/10 via-[#ffd700]/60 to-emerald-500/10 mb-2 rounded-full" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-emerald-50 mb-2 flex items-center justify-between">
            <span>{isSwahili ? 'Unachoweza Kufanya' : 'What You Can Do'}</span>
            <span className="text-xs text-[#ffd700] font-bold">
              {isSwahili ? 'Mfumo Wetu' : 'Ecosystem'}
            </span>
          </h3>

          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-[#ffd700] border border-emerald-500/20 flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Fuata & Jiunge na Jamii' : 'Follow & Join'}
              </strong>
              <span className="text-[11px] text-slate-500 dark:text-emerald-400/70">
                {isSwahili ? 'Jenga mtandao wako na ungana na waundaji' : 'Build your community and connect with creators'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-[#ffd700] border border-emerald-500/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Soma & Nunua Vitabu' : 'Read & Buy Books'}
              </strong>
              <span className="text-[11px] text-slate-500 dark:text-emerald-400/70">
                {isSwahili ? 'Gundua sura za kidijitali, vitabu pepe na nakala ngumu' : 'Explore digital chapters, e-books, and signed print editions'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-[#ffd700] border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Tazama Video za Mafunzo' : 'Watch Videos'}
              </strong>
              <span className="text-[11px] text-slate-500 dark:text-emerald-400/70">
                {isSwahili ? 'Tiririsha video na mikutano ya moja kwa moja ya mtandaoni' : 'YouTube-style streaming and live video conferences'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-[#ffd700] border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Soko la Kimataifa' : 'Global Shopping'}
              </strong>
              <span className="text-[11px] text-slate-500 dark:text-emerald-400/70">
                {isSwahili ? 'Nunua na uza vifaa vya kielektroniki, mitindo na bidhaa halisi' : 'Buy and sell curated electronics, fashion, and physical goods'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
