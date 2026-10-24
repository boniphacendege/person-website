import React, { useState, useMemo } from 'react';
import {
  PenTool,
  Clock,
  Eye,
  ArrowRight,
  Filter,
  Layers,
  Cpu,
  UserCheck,
  Briefcase,
  BookOpen,
  Sparkles,
  CloudCheck,
  X,
  Search,
  Share2,
} from 'lucide-react';
import { BlogArticle } from '../types';
import { isMaterialSavedSync } from '../utils/offlineStorage';

interface BlogSectionProps {
  blogs: BlogArticle[];
  onOpenWriteBlog: () => void;
  onReadArticle: (article: BlogArticle) => void;
  language?: string;
  onShowToast?: (msg: string) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  blogs,
  onOpenWriteBlog,
  onReadArticle,
  language,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isSwahili = language === 'Swahili';

  // Dynamically extract unique categories from existing blogs
  const categories = useMemo(() => {
    const catSet = new Set<string>();
    blogs.forEach((b) => {
      if (b.category && b.category.trim()) {
        catSet.add(b.category.trim());
      }
    });

    const list = Array.from(catSet);
    // Sort with predictable priority: Tech/Technology, Personal, Business, Books, Others
    list.sort((a, b) => {
      const order = ['tech', 'technology', 'personal', 'business', 'books'];
      const idxA = order.indexOf(a.toLowerCase());
      const idxB = order.indexOf(b.toLowerCase());
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return ['All', ...list];
  }, [blogs]);

  // Compute counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: blogs.length };
    blogs.forEach((b) => {
      const cat = b.category?.trim();
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
        // Also map 'Tech' and 'Technology' count appropriately if present
        if (cat.toLowerCase() === 'technology') {
          counts['Tech'] = (counts['Tech'] || 0) + 1;
        }
      }
    });
    return counts;
  }, [blogs]);

  // Filtered blogs based on selected category and keyword search query
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      if (selectedCategory !== 'All') {
        const sel = selectedCategory.toLowerCase();
        const cat = (b.category || '').toLowerCase();
        const matchCategory =
          (sel === 'tech' && (cat === 'tech' || cat === 'technology')) ||
          (sel === 'technology' && (cat === 'tech' || cat === 'technology')) ||
          cat === sel;
        if (!matchCategory) return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        b.title.toLowerCase().includes(q) ||
        (b.titleSwahili && b.titleSwahili.toLowerCase().includes(q)) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
        (b.content && b.content.toLowerCase().includes(q)) ||
        (b.category && b.category.toLowerCase().includes(q))
      );
    });
  }, [blogs, selectedCategory, searchQuery]);

  // Icon helper based on category name
  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower === 'all') return <Layers className="w-3.5 h-3.5" />;
    if (lower.includes('tech')) return <Cpu className="w-3.5 h-3.5" />;
    if (lower.includes('person') || lower.includes('life'))
      return <UserCheck className="w-3.5 h-3.5" />;
    if (lower.includes('busin') || lower.includes('entrepr'))
      return <Briefcase className="w-3.5 h-3.5" />;
    if (lower.includes('book') || lower.includes('read'))
      return <BookOpen className="w-3.5 h-3.5" />;
    return <Sparkles className="w-3.5 h-3.5" />;
  };

  // Swahili label helper
  const getCategoryLabel = (category: string) => {
    if (!isSwahili) return category;
    const lower = category.toLowerCase();
    if (lower === 'all') return 'Zote';
    if (lower === 'technology' || lower === 'tech') return 'Teknolojia';
    if (lower === 'personal') return 'Binafsi';
    if (lower === 'business') return 'Biashara';
    if (lower === 'books') return 'Vitabu';
    return category;
  };

  return (
    <section
      id="blog"
      className="py-12 max-w-6xl mx-auto px-4 border-t border-emerald-950/10 dark:border-emerald-500/15"
    >
      {/* Header and Write Blog Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-[#ffd700]">
              {isSwahili ? 'Mawazo & Uandishi' : 'Insights & Editorial'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#ffd700]/15 text-slate-800 dark:text-[#ffd700] border border-[#ffd700]/30">
              {blogs.length} {isSwahili ? 'Makala' : 'Articles'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-emerald-50 tracking-tight font-editorial mt-1">
            {isSwahili ? 'Makala za Ev Dr. Boniphace J. Ndege' : 'Ev Dr. Boniphace J. Ndege Blog'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1">
            {isSwahili
              ? 'Makala, fikra, ujasiriamali, teknolojia na maisha.'
              : 'Articles, ideas, entrepreneurship, technology and personal growth.'}
          </p>
        </div>

        <button
          onClick={onOpenWriteBlog}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <PenTool className="w-4 h-4" />
          {isSwahili ? 'Andika Makala' : 'Write Article'}
        </button>
      </div>

      {/* ========================================================= */}
      {/* DYNAMIC SEARCH & CATEGORY FILTERING SYSTEM                */}
      {/* ========================================================= */}
      <div className="mb-8 p-3 rounded-2xl bg-slate-100/70 dark:bg-emerald-950/40 border border-emerald-950/10 dark:border-emerald-500/20 backdrop-blur-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isSwahili ? 'Tafuta makala kwa jina, mada...' : 'Search articles by title, topic...'}
            className="w-full h-9 pl-9 pr-8 text-xs bg-white dark:bg-[#071910] border border-emerald-950/10 dark:border-emerald-500/20 rounded-xl text-slate-900 dark:text-emerald-50 placeholder-slate-400 focus:outline-none focus:border-[#ffd700]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills List */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            const count = categoryCounts[cat] || (cat === 'All' ? blogs.length : 0);

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#00a651] via-[#054425] to-[#042817] text-[#ffd700] border border-[#ffd700]/70 shadow-[0_0_12px_rgba(5,150,105,0.4)] scale-[1.02]'
                    : 'bg-white dark:bg-[#071910] text-slate-700 dark:text-emerald-200/80 hover:text-slate-900 dark:hover:text-white border border-emerald-950/10 dark:border-emerald-500/15 hover:border-emerald-500/40 shadow-xs'
                }`}
              >
                <span
                  className={
                    isSelected
                      ? 'text-[#ffd700]'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }
                >
                  {getCategoryIcon(cat)}
                </span>
                <span>{getCategoryLabel(cat)}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSelected
                      ? 'bg-[#ffd700]/25 text-[#ffd700]'
                      : 'bg-slate-100 dark:bg-emerald-900/50 text-slate-500 dark:text-emerald-300/70'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Reset Filter Button if a specific category or search is active */}
        {(selectedCategory !== 'All' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-slate-500 dark:text-emerald-300/70 hover:text-emerald-600 dark:hover:text-[#ffd700] flex items-center gap-1 transition-colors self-end md:self-auto cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            <span>{isSwahili ? 'Futa Kichujio' : 'Clear filter'}</span>
          </button>
        )}
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((article) => {
            const isCached = isMaterialSavedSync(article.title);

            return (
              <article
                key={article.id}
                className="group card-neon-gold rounded-3xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Subtle gold-green neon top rim */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/20 via-[#ffd700]/70 to-emerald-500/20" />

                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-emerald-950/40">
                    <img
                      src={
                        article.imageUrl ||
                        'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 text-[11px] font-extrabold px-3 py-1 rounded-full bg-white/95 dark:bg-[#07120d]/95 text-slate-900 dark:text-[#ffd700] border border-[#ffd700]/40 shadow-xs backdrop-blur-xs">
                      {getCategoryLabel(article.category)}
                    </span>

                    {/* Offline Persistence Badge if Cached */}
                    {isCached && (
                      <span
                        className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 shadow-xs backdrop-blur-xs flex items-center gap-1"
                        title="Persisted in Cache API for offline reading"
                      >
                        <CloudCheck className="w-3 h-3 text-emerald-400" />
                        <span>{isSwahili ? 'Nje ya Mtandao' : 'Offline Ready'}</span>
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-emerald-50 leading-snug group-hover:text-emerald-600 dark:group-hover:text-[#ffd700] transition-colors">
                      {isSwahili && article.titleSwahili ? article.titleSwahili : article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/70 mt-2 line-clamp-3 leading-relaxed">
                      {isSwahili && article.excerptSwahili ? article.excerptSwahili : article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-emerald-400/60 pt-4 border-t border-emerald-950/10 dark:border-emerald-500/15 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-[#ffd700]" />
                      {isSwahili && article.readTimeSwahili ? article.readTimeSwahili : article.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-[#ffd700]" />
                      {article.viewsCount} {isSwahili ? 'mionekano' : 'views'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onReadArticle(article)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-700 hover:text-white border border-emerald-900/10 dark:border-emerald-500/20 hover:border-[#ffd700]/50 hover:shadow-[0_0_12px_rgba(5,150,105,0.3)] transition-all cursor-pointer"
                    >
                      <span>{isSwahili ? 'Soma Makala Kamili' : 'Read Article'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#ffd700]" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const shareUrl = `${window.location.origin}#blog?article=${article.id}`;
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(shareUrl);
                          onShowToast?.(isSwahili ? 'Kiungo cha makala kimenakiliwa!' : 'Article link copied to clipboard!');
                        }
                      }}
                      className="p-2.5 rounded-xl border border-emerald-900/10 dark:border-emerald-500/20 text-slate-500 dark:text-emerald-300/70 hover:text-[#ffd700] hover:bg-emerald-950/60 transition-colors cursor-pointer shrink-0"
                      title={isSwahili ? 'Gawa makala' : 'Share article'}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 px-4 rounded-3xl bg-slate-50 dark:bg-emerald-950/20 border border-emerald-950/10 dark:border-emerald-500/15">
          <Filter className="w-10 h-10 text-emerald-600/40 dark:text-[#ffd700]/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-emerald-100">
            {isSwahili
              ? `Hakuna makala yaliyopatikana katika kategoria ya "${getCategoryLabel(
                  selectedCategory
                )}"`
              : `No articles found in category "${selectedCategory}"`}
          </h3>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1 max-w-sm mx-auto">
            {isSwahili
              ? 'Tafadhali chagua kategoria nyingine au onyesha makala yote.'
              : 'Try selecting a different category or view all published articles.'}
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer"
          >
            {isSwahili ? 'Onyesha Makala Yote' : 'Show All Articles'}
          </button>
        </div>
      )}
    </section>
  );
};
