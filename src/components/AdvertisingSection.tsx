import React, { useState } from 'react';
import {
  Megaphone,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Tag,
  CheckCircle2,
  TrendingUp,
  Palette,
  BookOpen,
  ShoppingBag,
  GraduationCap,
  Eye,
} from 'lucide-react';

export type AdAspectRatio = '1:1' | '9:16';

interface AdItem {
  id: string;
  category: 'design' | 'books' | 'shop' | 'masterclass' | 'sponsor';
  categoryLabelSwahili: string;
  categoryLabelEnglish: string;
  sponsorName: string;
  sponsorHandle: string;
  sponsorAvatar: string;
  titleSwahili: string;
  titleEnglish: string;
  descSwahili: string;
  descEnglish: string;
  ctaSwahili: string;
  ctaEnglish: string;
  imageSquare: string;
  imageVertical: string;
  tagSwahili: string;
  tagEnglish: string;
  viewsCount: string;
  badgeText: string;
}

const ADS_SERIES: AdItem[] = [
  {
    id: 'ad-design-web',
    category: 'design',
    categoryLabelSwahili: 'Usanifu & Tovuti',
    categoryLabelEnglish: 'Design & Websites',
    sponsorName: 'Ev Dr. Boniphace J. Ndege Studio',
    sponsorHandle: '@boniphacendege',
    sponsorAvatar: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
    titleSwahili: 'Open for Graphic Design & Website Design Projects',
    titleEnglish: 'Open for Graphic Design & Website Design Projects',
    descSwahili:
      'Karibuni wanachama na wateja wote! Leteni miradi yenu kwa ajili ya Graphic Design ya kisasa, Website Design, Uchapishaji wa Vitabu, na Mifumo ya Kidijitali ya Hadhi ya Juu.',
    descEnglish:
      'Welcome all members and clients! Bring your projects for professional Graphic Design, Website Design, Book Publishing, and High-End Digital Solutions.',
    ctaSwahili: 'Leta Mradi Wako',
    ctaEnglish: 'Submit Your Project',
    imageSquare: 'https://images.unsplash.com/photo-1542744094-3a31727560fa?auto=format&fit=crop&w=800&q=80',
    imageVertical: 'https://images.unsplash.com/photo-1542744094-3a31727560fa?auto=format&fit=crop&w=720&h=1280&q=80',
    tagSwahili: 'Miradi ya Kitaalamu',
    tagEnglish: 'Verified Studio Projects',
    viewsCount: '18.4K',
    badgeText: 'HOT SPONSOR',
  },
  {
    id: 'ad-book-publishing',
    category: 'books',
    categoryLabelSwahili: 'Uchapishaji Vitabu',
    categoryLabelEnglish: 'Book Publishing',
    sponsorName: 'Ev Dr. Boniphace J. Ndege Publishing',
    sponsorHandle: '@boniphacendege',
    sponsorAvatar: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
    titleSwahili: 'Chapisha Kitabu Chako Kimataifa (Amazon & Hardcover)',
    titleEnglish: 'Publish Your Book Globally with Full Distribution',
    descSwahili:
      'Uhariri wa kitaalamu wa miswada, usajili wa nambari ya kimataifa ya ISBN, usanifu wa jalada la 3D, na usambazaji mtandaoni duniani kote.',
    descEnglish:
      'Full manuscript editing, ISBN registration, bespoke 3D cover artistry, and multi-channel global distribution for aspiring & seasoned authors.',
    ctaSwahili: 'Anza Kuchapisha',
    ctaEnglish: 'Start Publishing',
    imageSquare: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    imageVertical: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=720&h=1280&q=80',
    tagSwahili: 'Vitabu & Elimu',
    tagEnglish: 'Books & Publishing',
    viewsCount: '14.2K',
    badgeText: 'PUBLISHER',
  },
  {
    id: 'ad-open-shop-deals',
    category: 'shop',
    categoryLabelSwahili: 'Open Shop Ofa',
    categoryLabelEnglish: 'Open Shop Deals',
    sponsorName: 'Open Shop Verified Merchant Desk',
    sponsorHandle: '@openshopdeals',
    sponsorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    titleSwahili: 'Punguzo la Kipekee Vifaa vya Teknolojia na Kielektroniki',
    titleEnglish: 'Exclusive Member Discounts on Certified Tech Hardware',
    descSwahili:
      'Pata kompyuta mpakato, vifaa vya studio, sauti na vifaa saidizi vya kidijitali vilivyothibitishwa kwa bei nafuu na usafirishaji wa haraka.',
    descEnglish:
      'Certified laptops, digital audio accessories, and tech gear at exclusive community rates with guaranteed delivery across Tanzania & East Africa.',
    ctaSwahili: 'Tazama Bidhaa',
    ctaEnglish: 'Explore Deals',
    imageSquare: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    imageVertical: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=720&h=1280&q=80',
    tagSwahili: 'Duka Rasmi',
    tagEnglish: 'Verified Marketplace',
    viewsCount: '22.8K',
    badgeText: 'OFFER',
  },
  {
    id: 'ad-masterclass-leadership',
    category: 'masterclass',
    categoryLabelSwahili: 'Mafunzo ya Uongozi',
    categoryLabelEnglish: 'Executive Mentorship',
    sponsorName: 'Digital Business & The Future Academy',
    sponsorHandle: '@boniphacendege',
    sponsorAvatar: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
    titleSwahili: 'Digital Business & The Future: Mafunzo ya Vitendo',
    titleEnglish: 'Digital Business & The Future Executive Masterclass',
    descSwahili:
      'Jifunze mikakati halisi ya kuanzisha biashara mtandaoni, usimamizi wa fedha, mifumo ya mauzo na uchumi wa waundaji kutoka kwa Ev Dr. Boniphace J. Ndege.',
    descEnglish:
      'Direct executive mentorship on internet commerce, online marketing, creator monetisation, and scaling sustainable digital ventures in Africa.',
    ctaSwahili: 'Jiunge na Darasa',
    ctaEnglish: 'Enroll in Class',
    imageSquare: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    imageVertical: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=720&h=1280&q=80',
    tagSwahili: 'Darasa Mubashara',
    tagEnglish: 'Live Masterclass',
    viewsCount: '31.5K',
    badgeText: 'MASTERCLASS',
  },
];

interface AdvertisingSectionProps {
  language?: string;
  onOpenContact?: (subject?: string) => void;
  onNavigate?: (sectionId: string) => void;
  onShowToast?: (msg: string) => void;
}

export const AdvertisingSection: React.FC<AdvertisingSectionProps> = ({
  language = 'English',
  onOpenContact,
  onNavigate,
  onShowToast,
}) => {
  const isSwahili = language === 'Swahili';
  const [selectedRatio, setSelectedRatio] = useState<AdAspectRatio>('1:1');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: isSwahili ? 'Matangazo Yote' : 'All Showcases' },
    { id: 'design', label: isSwahili ? 'Graphic & Web' : 'Design & Web' },
    { id: 'books', label: isSwahili ? 'Uchapishaji Vitabu' : 'Book Publishing' },
    { id: 'shop', label: isSwahili ? 'Open Shop Deals' : 'Open Shop Deals' },
    { id: 'masterclass', label: isSwahili ? 'Mafunzo & Darasa' : 'Masterclasses' },
  ];

  const filteredAds = ADS_SERIES.filter((ad) => {
    if (selectedCategory === 'all') return true;
    return ad.category === selectedCategory;
  });

  const handleActionClick = (ad: AdItem) => {
    if (ad.category === 'design') {
      onOpenContact?.('Graphic & Website Design Project Inquiry');
      onShowToast?.(
        isSwahili
          ? 'Fomu ya kuagiza mradi wa Graphic Design & Website Design imefunguliwa!'
          : 'Project inquiry form opened for Graphic & Website Design!'
      );
    } else if (ad.category === 'books') {
      onNavigate?.('books');
      onShowToast?.(
        isSwahili
          ? 'Umeelekezwa kwenye Sehemu ya Vitabu & Uchapishaji!'
          : 'Navigated to Book Publishing marketplace!'
      );
    } else if (ad.category === 'shop') {
      onNavigate?.('shop');
      onShowToast?.(
        isSwahili
          ? 'Umeelekezwa kwenye Open Shop Marketplace!'
          : 'Navigated to Open Shop Marketplace!'
      );
    } else {
      onNavigate?.('live');
      onShowToast?.(
        isSwahili
          ? 'Umeelekezwa kwenye Kipindi na Mafunzo Mubashara!'
          : 'Navigated to Live Broadcast & Masterclass!'
      );
    }
  };

  return (
    <section id="advertising" className="py-12 max-w-6xl mx-auto px-4 border-t border-emerald-950/10 dark:border-emerald-500/15">
      {/* Section Header with Ratio Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-[#ffd700] border border-emerald-500/30">
              <Megaphone className="w-4 h-4 text-[#ffd700]" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#ffd700] flex items-center gap-1.5">
              <span>{isSwahili ? 'Mfululizo wa Matangazo & Miradi' : 'Advertising Showcase & Sponsored Campaigns'}</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-emerald-50 tracking-tight font-editorial">
            {isSwahili ? 'Matangazo & Ushirikiano wa Biashara' : 'Advertising & Business Spotlights'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1 max-w-2xl">
            {isSwahili
              ? 'Tazama miradi ya Graphic Design, Website Design, Uchapishaji wa Vitabu na Ofa za Open Shop kwa uwiano unaotaka (1:1 au 9:16).'
              : 'Browse Graphic Design, Website Design, Book Publishing campaigns, and Open Shop deals in selective 1:1 or 9:16 aspect ratios.'}
          </p>
        </div>

        {/* Ratio Selector Switch: 1:1 vs 9:16 */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-slate-100 dark:bg-[#07160e] p-1.5 rounded-2xl border border-emerald-900/20 dark:border-emerald-500/30 shadow-md">
          <span className="text-xs font-bold text-slate-600 dark:text-emerald-300/80 px-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#ffd700]" />
            <span>{isSwahili ? 'Uwiano wa Tangazo:' : 'Ad Ratio:'}</span>
          </span>

          <div className="flex items-center gap-1 bg-white dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-emerald-500/20">
            <button
              type="button"
              onClick={() => setSelectedRatio('1:1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedRatio === '1:1'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 shadow-[0_0_10px_rgba(255,215,0,0.4)]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-3.5 h-3.5 border-2 border-current rounded-xs inline-block" />
              <span>1:1 (Square)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRatio('9:16')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedRatio === '9:16'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 shadow-[0_0_10px_rgba(255,215,0,0.4)]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-2.5 h-4 border-2 border-current rounded-xs inline-block" />
              <span>9:16 (Story/Vertical)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 dark:bg-gradient-to-r dark:from-emerald-700 dark:to-emerald-800 text-white shadow-sm border border-emerald-500/40'
                : 'bg-slate-100 dark:bg-emerald-950/40 text-slate-600 dark:text-emerald-300/70 hover:bg-slate-200 dark:hover:bg-emerald-900/50 border border-transparent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* RENDER MODE 1:1 (SQUARE GRID) */}
      {selectedRatio === '1:1' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredAds.map((ad) => (
            <div
              key={ad.id}
              className="card-neon-gold rounded-3xl overflow-hidden flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 shadow-lg border border-emerald-950/15 dark:border-emerald-500/25"
            >
              {/* 1:1 Square Image Container */}
              <div className="relative aspect-square w-full overflow-hidden bg-emerald-950">
                <img
                  src={ad.imageSquare || '/src/assets/images/boniphace_cover_1791315258070.jpg'}
                  alt={isSwahili ? ad.titleSwahili : ad.titleEnglish}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-black/75 backdrop-blur-md text-[#ffd700] border border-[#ffd700]/40 shadow-sm">
                    {ad.badgeText}
                  </span>
                </div>

                {/* Top Views count */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                  <Eye className="w-3 h-3 text-[#ffd700]" />
                  <span>{ad.viewsCount}</span>
                </div>

                {/* Bottom Overlay Info on Image */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                    {isSwahili ? ad.tagSwahili : ad.tagEnglish}
                  </span>
                  <h3 className="text-sm font-black text-white leading-tight line-clamp-2 drop-shadow-md">
                    {isSwahili ? ad.titleSwahili : ad.titleEnglish}
                  </h3>
                </div>
              </div>

              {/* Card Bottom Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white dark:bg-[#07170f]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={ad.sponsorAvatar || '/src/assets/images/boniphace_avatar_1791315268492.jpg'}
                      alt={ad.sponsorName}
                      className="w-6 h-6 rounded-lg object-cover ring-1 ring-emerald-500/40"
                    />
                    <div className="min-w-0">
                      <span className="block text-[11px] font-bold text-slate-800 dark:text-emerald-100 truncate">
                        {ad.sponsorName}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-emerald-200/80 leading-relaxed line-clamp-3">
                    {isSwahili ? ad.descSwahili : ad.descEnglish}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleActionClick(ad)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-98"
                >
                  <span>{isSwahili ? ad.ctaSwahili : ad.ctaEnglish}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* RENDER MODE 9:16 (STORY & VERTICAL REELS GRID) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAds.map((ad) => (
            <div
              key={ad.id}
              className="relative aspect-[9/16] rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-[0_0_24px_rgba(5,150,105,0.25)] flex flex-col justify-between p-5 text-white group hover:border-[#ffd700]/70 transition-all duration-300"
            >
              {/* Full Bleed 9:16 Vertical Image */}
              <img
                src={ad.imageVertical || '/src/assets/images/boniphace_cover_1791315258070.jpg'}
                alt={isSwahili ? ad.titleSwahili : ad.titleEnglish}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 -z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/30 -z-10" />

              {/* Glowing Top Ambient Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-[#ffd700] to-emerald-500/20 shadow-[0_0_10px_rgba(255,215,0,0.8)]" />

              {/* Top Header of Story */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  <img
                    src={ad.sponsorAvatar || '/src/assets/images/boniphace_avatar_1791315268492.jpg'}
                    alt={ad.sponsorName}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-[#ffd700]"
                  />
                  <span className="text-[10px] font-black text-white truncate max-w-[110px]">
                    {ad.sponsorHandle}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#ffd700] text-slate-950 shadow-xs">
                    9:16
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                    {ad.viewsCount}
                  </span>
                </div>
              </div>

              {/* Center Play / Spotlight Indicator */}
              <div className="relative z-10 my-auto text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/40 backdrop-blur-md border border-[#ffd700]/70 flex items-center justify-center text-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
              </div>

              {/* Bottom Content Area */}
              <div className="relative z-10 space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider">
                  {isSwahili ? ad.tagSwahili : ad.tagEnglish}
                </span>

                <h3 className="text-base font-black text-white leading-tight font-editorial drop-shadow-md">
                  {isSwahili ? ad.titleSwahili : ad.titleEnglish}
                </h3>

                <p className="text-xs text-slate-200/90 leading-relaxed line-clamp-3">
                  {isSwahili ? ad.descSwahili : ad.descEnglish}
                </p>

                <button
                  type="button"
                  onClick={() => handleActionClick(ad)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#d4af37] text-slate-950 font-black text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:scale-102 transition-all active:scale-95"
                >
                  <span>{isSwahili ? ad.ctaSwahili : ad.ctaEnglish}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Place Your Ad Callout Banner */}
      <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-[#041d11] via-[#072c1b] to-[#041d11] border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/30 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">
              {isSwahili
                ? 'Je, unahitaji kutangaza mradi, biashara au kitabu chako hapa?'
                : 'Need to feature your brand, service, or project in this section?'}
            </h4>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              {isSwahili
                ? 'Wasiliana na dawati la usimamizi la Ev Dr. Boniphace J. Ndege kwa matangazo ya uwiano wa 1:1 au 9:16.'
                : 'Contact the executive desk of Ev Dr. Boniphace J. Ndege for 1:1 or 9:16 advertising slots.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onOpenContact?.('Featured Advertising Space Booking');
            onShowToast?.(
              isSwahili
                ? 'Fomu ya kuhifadhi nafasi ya tangazo imefunguliwa!'
                : 'Ad placement inquiry form opened!'
            );
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-102 transition-all shrink-0"
        >
          <span>{isSwahili ? 'Weka Tangazo Lako' : 'Book Ad Placement'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
