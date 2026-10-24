import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Upload,
  ShoppingCart,
  Star,
  FileText,
  Feather,
  Sparkles,
  Camera,
  Layers,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  X,
} from 'lucide-react';
import { Book } from '../types';
import * as api from '../api';

interface BooksSectionProps {
  books: Book[];
  onOpenPublishBook: (mode?: 'pdf' | 'auto_book') => void;
  onReadBook: (book: Book) => void;
  onAddToCart: (name: string, price: number, image: string, id: string) => void;
  onUpdateBookCover?: (bookId: string, coverUrl: string) => void;
  language?: string;
  onShowToast?: (msg: string) => void;
}

export const BooksSection: React.FC<BooksSectionProps> = ({
  books,
  onOpenPublishBook,
  onReadBook,
  onAddToCart,
  onUpdateBookCover,
  language,
  onShowToast,
}) => {
  const isSwahili = language === 'Swahili';
  const [uploadingCoverForId, setUploadingCoverForId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories extracted from books
  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.category?.trim()) set.add(b.category.trim());
    });
    return ['All', ...Array.from(set)];
  }, [books]);

  // Filtered books based on search query and category
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchCat =
        selectedCategory === 'All' ||
        (b.category || '').toLowerCase() === selectedCategory.toLowerCase();
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        b.title.toLowerCase().includes(q) ||
        (b.author && b.author.toLowerCase().includes(q)) ||
        (b.description && b.description.toLowerCase().includes(q)) ||
        (b.category && b.category.toLowerCase().includes(q))
      );
    });
  }, [books, selectedCategory, searchQuery]);

  const formatTZS = (num: number) => {
    return 'TZS ' + Number(num).toLocaleString('en-TZ');
  };

  // Direct cover upload for an individual book card
  const handleCardCoverUpload = async (bookId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast?.(
        isSwahili
          ? 'Tafadhali chagua faili halali ya picha (JPG, PNG, WebP).'
          : 'Please select a valid image file (JPG, PNG, WebP).'
      );
      return;
    }

    setUploadingCoverForId(bookId);
    try {
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await api.uploadCoverApi({
        imageData: base64Data,
        fileName: file.name,
      });

      await api.updateBookApi(bookId, { coverUrl: res.url });
      onUpdateBookCover?.(bookId, res.url);

      onShowToast?.(
        isSwahili
          ? 'Jalada la kitabu limebadilishwa na linaonekana moja kwa moja!'
          : 'Book cover image updated and visible directly!'
      );
    } catch {
      // Local fallback
      const obj = URL.createObjectURL(file);
      onUpdateBookCover?.(bookId, obj);
      onShowToast?.('Cover updated locally');
    } finally {
      setUploadingCoverForId(null);
    }
  };

  return (
    <section id="books" className="py-12 max-w-6xl mx-auto px-4 border-t border-emerald-950/10 dark:border-emerald-500/15">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-[#ffd700]">
              {isSwahili ? 'Duka la Vitabu & Studio' : 'Bookstore & Digital Studio'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-emerald-50 tracking-tight font-editorial">
            {isSwahili ? 'Vitabu' : 'Books'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1">
            {isSwahili
              ? 'Soma, gundua, uza na chapisha vitabu mbalimbali. Pakia jalada, faili kamili ya PDF/EPUB, au andika ndani kuunda sura kiotomatiki.'
              : 'Read, discover, sell and publish books. Upload book cover, attach full PDF/EPUB manuscript, or type within to auto-generate chapters.'}
          </p>
        </div>

        {/* Dual Publishing Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Option 1: Upload Cover & PDF/EPUB */}
          <button
            onClick={() => onOpenPublishBook('pdf')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#087a45] text-white hover:brightness-110 border border-[#ffd700]/30 shadow-[0_0_14px_rgba(5,150,105,0.35)] transition-all cursor-pointer"
            title={isSwahili ? 'Pakia Jalada & Faili ya PDF/EPUB ya Kitabu' : 'Upload Cover & PDF/EPUB Book Manuscript'}
          >
            <FileText className="w-4 h-4 text-[#ffd700]" />
            <span>{isSwahili ? 'Pakia Jalada & PDF/EPUB' : 'Upload Cover & PDF/EPUB'}</span>
          </button>

          {/* Option 2: Type or Paste & Auto Book Inside */}
          <button
            onClick={() => onOpenPublishBook('auto_book')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#d4af37] text-slate-950 hover:brightness-105 shadow-[0_0_14px_rgba(255,215,0,0.4)] transition-all cursor-pointer"
            title={isSwahili ? 'Andika au Bandika Maudhui kuunda Kitabu Kiotomatiki' : 'Type or Paste Text to Auto-Generate Book Inside'}
          >
            <Feather className="w-4 h-4 text-slate-950" />
            <span>{isSwahili ? 'Andika / Bandika & Auto Book' : 'Type/Paste & Auto Book'}</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="mb-6 p-3 rounded-2xl bg-slate-100/70 dark:bg-emerald-950/40 border border-emerald-950/10 dark:border-emerald-500/20 backdrop-blur-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isSwahili ? 'Tafuta vitabu kwa jina, mwandishi, mada...' : 'Search books by title, author, topic...'}
            className="w-full h-9.5 pl-9 pr-8 text-xs bg-white dark:bg-[#071910] border border-emerald-950/10 dark:border-emerald-500/20 rounded-xl text-slate-900 dark:text-emerald-50 placeholder-slate-400 focus:outline-none focus:border-[#ffd700]"
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

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#00a651] via-[#054425] to-[#042817] text-[#ffd700] border border-[#ffd700]/70 shadow-[0_0_10px_rgba(5,150,105,0.4)]'
                    : 'bg-white dark:bg-[#071910] text-slate-700 dark:text-emerald-200/80 hover:text-slate-900 dark:hover:text-white border border-emerald-950/10 dark:border-emerald-500/15'
                }`}
              >
                {cat === 'All' ? (isSwahili ? 'Vitabu Vyote' : 'All Books') : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-slate-50 dark:bg-emerald-950/20 border border-emerald-950/10 dark:border-emerald-500/20">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70">
            {isSwahili ? 'Hakuna vitabu vinavyolingana na utafutaji wako.' : 'No books match your search or filter.'}
          </p>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs text-[#ffd700] hover:underline font-bold cursor-pointer"
            >
              {isSwahili ? 'Weka upya vichungi vyote' : 'Reset all filters'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
          const isUploadingThisCover = uploadingCoverForId === book.id;
          const hasPdf = Boolean(book.pdfUrl);
          const hasChapters = Array.isArray(book.chapters) && book.chapters.length > 0;

          return (
            <div
              key={book.id}
              className="group card-neon-gold rounded-3xl p-4 flex flex-col justify-between relative transition-all duration-300 hover:shadow-[0_0_24px_rgba(5,150,105,0.3)]"
            >
              <div>
                {/* Subtle top gold-neon decorative rim */}
                <div className="h-[1.5px] w-full bg-gradient-to-r from-emerald-500/10 via-[#ffd700]/60 to-emerald-500/10 mb-3 rounded-full" />

                {/* Book Cover Frame (3:4 ratio) with Direct Upload & Real-Time Preview */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-900 mb-3 shadow-inner ring-1 ring-[#ffd700]/30 group/cover">
                  <img
                    src={book.coverUrl || '/src/assets/images/book_digital_vision_1791315278826.jpg'}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-500"
                  />

                  {/* Spine 3D shadow gradient */}
                  <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />

                  {/* Direct Cover Image Upload Button */}
                  <label
                    className="absolute top-2.5 right-2.5 bg-black/75 hover:bg-black/95 text-white p-2 rounded-xl border border-[#ffd700]/50 shadow-lg cursor-pointer opacity-90 group-hover/cover:opacity-100 transition-all flex items-center gap-1.5 backdrop-blur-xs select-none"
                    title={isSwahili ? 'Pakia au badilisha picha ya jalada' : 'Upload or change book cover image'}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleCardCoverUpload(book.id, e.target.files[0]);
                        }
                      }}
                    />
                    {isUploadingThisCover ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#ffd700]" />
                    ) : (
                      <>
                        <Camera className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span className="text-[10px] font-bold text-slate-100 hidden sm:inline">
                          {isSwahili ? 'Badili Jalada' : 'Change Cover'}
                        </span>
                      </>
                    )}
                  </label>

                  {/* Format Badges Overlay on Cover */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5 flex-wrap pointer-events-none">
                    {hasPdf && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-black/80 text-[#ffd700] border border-[#ffd700]/40 shadow-xs">
                        <FileText className="w-3 h-3 text-[#ffd700]" />
                        <span>PDF / EPUB</span>
                      </span>
                    )}

                    {hasChapters && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-950/85 text-emerald-300 border border-emerald-500/40 shadow-xs">
                        <Layers className="w-3 h-3 text-emerald-400" />
                        <span>{book.chapters?.length} {isSwahili ? 'Sura' : 'Chapters'}</span>
                      </span>
                    )}

                    {book.isAutoGenerated && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-[#ffd700]/90 text-slate-950 shadow-xs">
                        <Sparkles className="w-3 h-3 text-slate-950" />
                        <span>Auto Book</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Book Meta */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-emerald-50 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {isSwahili && book.titleSwahili ? book.titleSwahili : book.title}
                  </h3>
                  <span className="block text-[11px] text-slate-400 dark:text-emerald-400/60 mt-0.5 truncate">
                    {isSwahili ? 'Kimeandikwa na' : 'By'} {book.author}
                  </span>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-[#ffd700] text-xs mt-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(book.rating)
                            ? 'fill-[#ffd700] text-[#ffd700]'
                            : 'text-slate-300 dark:text-emerald-900'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-bold text-slate-500 dark:text-[#ffd700] ml-1">
                      {book.rating}
                    </span>
                    {book.reviewsCount > 0 && (
                      <span className="text-[10px] text-slate-400 ml-0.5">
                        ({book.reviewsCount})
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-sm font-black text-emerald-700 dark:text-[#ffd700] mt-2 tabular-nums">
                    {formatTZS(book.price)}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Read & Buy */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-emerald-950/10 dark:border-emerald-500/15">
                <button
                  type="button"
                  onClick={() => onReadBook(book)}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-emerald-950/60 text-slate-800 dark:text-emerald-200 hover:border-[#ffd700]/50 hover:bg-emerald-500/10 border border-emerald-950/10 dark:border-emerald-500/20 transition-all cursor-pointer"
                  title={isSwahili ? 'Soma kitabu mtandaoni au PDF/EPUB' : 'Read book online, view PDF/EPUB manuscript'}
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-[#ffd700]" />
                  {isSwahili ? 'Soma' : 'Read'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onAddToCart(book.title, book.price, book.coverUrl, book.id)
                  }
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white border border-[#ffd700]/30 shadow-[0_0_10px_rgba(5,150,105,0.3)] transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {isSwahili ? 'Nunua' : 'Buy'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </section>
  );
};
