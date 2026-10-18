import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Star,
  ShoppingCart,
  ShieldCheck,
  Package,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle,
  Search,
} from 'lucide-react';
import { Product, ProductReview } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (name: string, price: number, image: string, id: string, quantity: number, condition?: string) => void;
  onSubmitReview: (productId: string, rating: number, comment: string, author: string) => Promise<void>;
  language?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onSubmitReview,
  language = 'English',
}) => {
  const [selectedQty, setSelectedQty] = useState(1);
  const [userRating, setUserRating] = useState(5);
  const [userAuthor, setUserAuthor] = useState('');
  const [userComment, setUserComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isSwahili = language === 'Swahili';

  useEffect(() => {
    if (isOpen && product) {
      setSelectedQty(1);
      setUserComment('');
      setUserAuthor('');
      setUserRating(5);
      setSearchQuery('');
    }
  }, [isOpen, product?.id]);

  // Filter reviews based on search query
  const filteredReviews = useMemo(() => {
    if (!product?.reviews) return [];
    if (!searchQuery.trim()) return product.reviews;
    const q = searchQuery.toLowerCase().trim();
    return product.reviews.filter(
      (r) =>
        r.comment.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q)
    );
  }, [product?.reviews, searchQuery]);

  // Helper to highlight search terms
  const highlightText = (text: string) => {
    if (!searchQuery.trim() || !text) return text;
    try {
      const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-[#ffd700] text-slate-950 font-bold px-1 rounded-xs shadow-xs"
          >
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  if (!isOpen || !product) return null;

  const formatTZS = (num: number) => {
    return 'TZS ' + Number(num).toLocaleString('en-TZ');
  };

  const conditionColor = (condition?: string) => {
    switch (condition?.toLowerCase()) {
      case 'brand new':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'like new':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'refurbished':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'used - good':
      case 'used':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'collector edition':
        return 'bg-[#d4af37]/20 text-[#b58e17] dark:text-[#f3d46b] border-[#d4af37]/40';
      default:
        return 'bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-300 border-slate-200 dark:border-emerald-800';
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmitReview(
        product.id,
        userRating,
        userComment.trim(),
        userAuthor.trim() || 'Verified Customer'
      );
      setUserComment('');
      setUserAuthor('');
      setUserRating(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#07160f] w-full max-w-3xl rounded-3xl border border-emerald-500/25 shadow-[0_0_32px_rgba(5,150,105,0.35),0_0_12px_rgba(255,215,0,0.2)] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Subtle top gold-neon decorative rim */}
        <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/20 via-[#ffd700] to-emerald-500/20 shadow-[0_0_10px_rgba(5,150,105,0.4)]" />

        {/* Modal Topbar with Search Input Field */}
        <div className="p-4 px-6 border-b border-emerald-950/10 dark:border-emerald-500/15 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-400 dark:text-emerald-400/60">
              {product.category}
            </span>
            <span className="text-[#ffd700]">·</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-[#ffd700]">
              {product.seller}
            </span>
          </div>

          {/* Search Input Field inside Product Detail Modal */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm flex items-center bg-white dark:bg-emerald-950/70 rounded-xl px-2.5 py-1.5 border border-emerald-950/10 dark:border-emerald-500/25 focus-within:ring-2 focus-within:ring-emerald-500/20">
            <Search className="w-3.5 h-3.5 text-emerald-600 dark:text-[#ffd700] mr-1.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isSwahili ? 'Tafuta sifa, maelezo au maoni...' : 'Search specs, reviews...'}
              className="w-full bg-transparent text-xs text-slate-900 dark:text-emerald-50 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-[#ffd700] hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Feedback Ribbon */}
        {searchQuery.trim() && (
          <div className="px-6 py-2 bg-amber-50 dark:bg-emerald-950/80 border-b border-amber-200 dark:border-emerald-500/20 text-xs flex items-center justify-between text-slate-700 dark:text-emerald-200">
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-600 dark:text-[#ffd700]" />
              {isSwahili ? 'Inachuja kwa:' : 'Filtering by:'} &quot;
              <strong className="text-emerald-700 dark:text-[#ffd700]">{searchQuery}</strong>&quot; ({filteredReviews.length} {isSwahili ? 'maoni yaliyopatikana' : 'matching reviews'})
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-amber-700 dark:text-emerald-300 hover:underline font-semibold"
            >
              {isSwahili ? 'Futa' : 'Clear'}
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Main Product Info: Left Image, Right Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-emerald-950/40 border border-emerald-950/10 dark:border-emerald-500/20 shadow-sm">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full border shadow-xs ${conditionColor(
                    product.condition
                  )}`}
                >
                  {product.condition || 'Brand New'}
                </span>
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-emerald-50 leading-tight font-editorial">
                  {highlightText(product.name)}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-slate-300 dark:text-emerald-900'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 dark:text-emerald-200 ml-1">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-slate-400 text-xs">·</span>
                  <span className="text-xs text-slate-500 dark:text-emerald-300/70">
                    {product.reviewsCount || product.reviews?.length || 0} {isSwahili ? 'maoni' : 'reviews'}
                  </span>
                </div>

                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-4 tabular-nums">
                  {formatTZS(product.price)}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/75 mt-3 leading-relaxed">
                  {highlightText(product.description)}
                </p>
              </div>

              {/* Quantity Selector and Add to Cart */}
              <div className="pt-6 mt-6 border-t border-emerald-950/10 dark:border-emerald-500/15 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                      {isSwahili ? 'Idadi:' : 'Quantity:'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {isSwahili
                        ? `${product.stock} zimebaki stoo`
                        : `${product.stock} units available in stock`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedQty((prev) => Math.max(1, prev - 1))}
                      disabled={selectedQty <= 1}
                      className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800 disabled:opacity-40 text-sm font-bold flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold tabular-nums">
                      {selectedQty}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedQty((prev) => Math.min(product.stock, prev + 1))
                      }
                      disabled={selectedQty >= product.stock}
                      className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800 disabled:opacity-40 text-sm font-bold flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(
                      product.name,
                      product.price,
                      product.image,
                      product.id,
                      selectedQty,
                      product.condition
                    );
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-md shadow-emerald-700/25 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {isSwahili
                      ? `Ongeza ${selectedQty} kwenye Kikapu (${formatTZS(product.price * selectedQty)})`
                      : `Add ${selectedQty} ${selectedQty > 1 ? 'Units' : 'Unit'} to Cart (${formatTZS(product.price * selectedQty)})`}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <hr className="border-emerald-950/10 dark:border-emerald-500/15" />

          {/* Customer Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-emerald-50 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {isSwahili ? 'Maoni ya Wateja' : 'Customer Reviews'} ({filteredReviews.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isSwahili ? 'Mrejesho halisi kutoka kwa wanunuzi walioidhinishwa' : 'Real feedback from verified buyers and community members'}
                </p>
              </div>
            </div>

            {/* Existing Reviews List (Filtered) */}
            <div className="space-y-3 mb-6">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-slate-900 dark:text-emerald-50">
                          {highlightText(rev.author)}
                        </strong>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            {isSwahili ? 'Mnunuzi Aliyethibitishwa' : 'Verified Purchase'}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 text-xs mb-2">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3 h-3 ${
                            idx < rev.rating
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-slate-300 dark:text-emerald-900'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-emerald-100/80 leading-relaxed">
                      {highlightText(rev.comment)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-emerald-950/30 text-slate-400 text-xs">
                  {searchQuery.trim()
                    ? (isSwahili ? `Hakuna maoni yanayolingana na "${searchQuery}". Jaribu neno lingine.` : `No reviews matched "${searchQuery}". Try another search term.`)
                    : (isSwahili ? 'Hakuna maoni bado kwa bidhaa hii. Kuwa wa kwanza kuweka maoni hapa chini!' : 'No reviews yet for this product. Be the first to leave one below!')}
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-emerald-950/50 border border-emerald-900/15 dark:border-emerald-500/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-emerald-300 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {isSwahili ? 'Andika Maoni Yako' : 'Write a Review'}
              </h4>

              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-emerald-400/80 mb-1">
                      {isSwahili ? 'Kiwango Chako cha Nyota:' : 'Your Rating:'}
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="p-1 focus:outline-none cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 transition-transform hover:scale-110 ${
                              star <= userRating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-slate-300 dark:text-emerald-900'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 sm:max-w-xs">
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-emerald-400/80 mb-1">
                      {isSwahili ? 'Jina Lako:' : 'Your Name:'}
                    </label>
                    <input
                      type="text"
                      value={userAuthor}
                      onChange={(e) => setUserAuthor(e.target.value)}
                      placeholder={isSwahili ? 'Mf. Amani Mwamba' : 'E.g. Amani Mwamba'}
                      className="w-full h-9 px-3 text-xs bg-white dark:bg-[#0e1d15] border border-slate-200 dark:border-emerald-800 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-emerald-400/80 mb-1">
                    {isSwahili ? 'Uzoefu Wako & Ubora wa Bidhaa:' : 'Your Experience & Quality Feedback:'}
                  </label>
                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    rows={3}
                    placeholder={
                      isSwahili
                        ? 'Eleza ubora wa bidhaa, utoaji, na kama unapendekeza kwa wengine...'
                        : 'Describe product quality, delivery, and whether you recommend it...'
                    }
                    required
                    className="w-full p-3 text-xs bg-white dark:bg-[#0e1d15] border border-slate-200 dark:border-emerald-800 rounded-xl"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !userComment.trim()}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSwahili ? 'Tuma Maoni' : 'Submit Review'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
