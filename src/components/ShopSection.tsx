import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  Star,
  Plus,
  PackageOpen,
  ShieldCheck,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { Product } from '../types';

interface ShopSectionProps {
  products: Product[];
  onAddToCart: (
    name: string,
    price: number,
    image: string,
    id: string,
    quantity?: number,
    condition?: string
  ) => void;
  onOpenCart: () => void;
  onOpenAddProduct: () => void;
  onWishlistToggle: (product: Product) => void;
  onOpenProductDetail: (product: Product) => void;
  language?: string;
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  products,
  onAddToCart,
  onOpenCart,
  onOpenAddProduct,
  onWishlistToggle,
  onOpenProductDetail,
  language,
}) => {
  const isSwahili = language === 'Swahili';
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [wishlistedIds, setWishlistedIds] = useState<Record<string, boolean>>({});

  const categories = isSwahili
    ? [
        { id: 'All', label: 'Zote' },
        { id: 'Fashion', label: 'Mitindo' },
        { id: 'Electronics', label: 'Vifaa vya Umeme' },
        { id: 'Home', label: 'Nyumbani' },
        { id: 'Books', label: 'Vitabu' },
        { id: 'Beauty', label: 'Urembo' },
        { id: 'Sports', label: 'Michezo' },
        { id: 'Digital', label: 'Kidijitali' },
      ]
    : [
        { id: 'All', label: 'All' },
        { id: 'Fashion', label: 'Fashion' },
        { id: 'Electronics', label: 'Electronics' },
        { id: 'Home', label: 'Home' },
        { id: 'Books', label: 'Books' },
        { id: 'Beauty', label: 'Beauty' },
        { id: 'Sports', label: 'Sports' },
        { id: 'Digital', label: 'Digital' },
      ];

  const conditions = isSwahili
    ? [
        { id: 'All', label: 'Hali Zote' },
        { id: 'Brand New', label: 'Mpya Kabisa' },
        { id: 'Like New', label: 'Kama Mpya' },
        { id: 'Refurbished', label: 'Iliyoboreshwa' },
        { id: 'Used - Good', label: 'Iliyotumika - Nzuri' },
        { id: 'Collector Edition', label: 'Toleo Maalum' },
      ]
    : [
        { id: 'All', label: 'All Conditions' },
        { id: 'Brand New', label: 'Brand New' },
        { id: 'Like New', label: 'Like New' },
        { id: 'Refurbished', label: 'Refurbished' },
        { id: 'Used - Good', label: 'Used - Good' },
        { id: 'Collector Edition', label: 'Collector Edition' },
      ];

  const handleWishlist = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlistedIds((prev) => ({
      ...prev,
      [product.id]: !prev[product.id],
    }));
    onWishlistToggle(product);
  };

  const formatTZS = (num: number) => {
    return 'TZS ' + Number(num).toLocaleString('en-TZ');
  };

  const conditionBadgeStyle = (condition?: string) => {
    switch (condition?.toLowerCase()) {
      case 'brand new':
        return 'bg-gradient-to-r from-emerald-500/20 to-[#ffd700]/20 text-emerald-700 dark:text-[#ffd700] border-[#ffd700]/40 font-bold';
      case 'like new':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'refurbished':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'used - good':
      case 'used':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'collector edition':
        return 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 border-[#ffd700] font-black shadow-[0_0_8px_rgba(255,215,0,0.4)]';
      default:
        return 'bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-300 border-slate-200 dark:border-emerald-800';
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesCond =
      selectedCondition === 'All' ||
      (p.condition && p.condition.toLowerCase() === selectedCondition.toLowerCase()) ||
      (!p.condition && selectedCondition === 'Brand New');
    const matchesSearch =
      localSearch === '' ||
      p.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      p.seller.toLowerCase().includes(localSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(localSearch.toLowerCase()) ||
      (p.condition && p.condition.toLowerCase().includes(localSearch.toLowerCase()));
    return matchesCat && matchesCond && matchesSearch;
  });

  return (
    <section id="shop" className="py-12 max-w-6xl mx-auto px-4 border-t border-emerald-950/10 dark:border-emerald-500/15">
      {/* High-end Marketplace Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 bg-gradient-to-r from-[#075c36] via-[#087a45] to-[#00a651] text-white shadow-xl mb-10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#d4af37]/20 text-[#f3d46b] border border-[#d4af37]/40 mb-3">
            {isSwahili ? 'SOKO LA OPEN SHOP' : 'OPEN SHOP MARKETPLACE'}
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tight font-editorial">
            Open Shop
          </h2>
          <div className="text-sm font-extrabold text-[#ffd700] tracking-wide mb-2">
            {isSwahili ? 'Gundua. Ungana. Nunua. Kua.' : 'Discover. Connect. Shop. Grow.'}
          </div>
          <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed mb-6">
            {isSwahili
              ? 'Open Shop inawaleta wauzaji na wanunuzi karibu zaidi kwa usalama, ubora na urahisi wa kufanya ununuzi mtandaoni. Chuja kulingana na hali ya bidhaa, kagua maoni na uagize moja kwa moja.'
              : 'Open Shop brings sellers and buyers closer together with safety, quality, and seamless online shopping. Filter by verified condition, inspect reviews, and order directly.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={
                  isSwahili
                    ? 'Tafuta bidhaa, hali, chapa, vifaa...'
                    : 'Search products, condition, brands, gear...'
                }
                className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm bg-white text-slate-900 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onOpenCart}
                className="flex-1 sm:flex-none h-11 px-5 rounded-xl text-xs font-bold bg-[#d4af37] hover:bg-[#c29e2e] text-slate-900 shadow-md inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                {isSwahili ? 'Kikapu' : 'Cart'}
              </button>

              <button
                onClick={onOpenAddProduct}
                className="flex-1 sm:flex-none h-11 px-4 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {isSwahili ? 'Uza Bidhaa' : 'Sell Item'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Row 1: Categories */}
      <div className="mb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            {isSwahili ? 'Kitengo:' : 'Category:'}
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-[#0e1d15] text-slate-600 dark:text-emerald-100/70 border border-emerald-950/10 dark:border-emerald-500/20 hover:bg-slate-50 dark:hover:bg-emerald-900/30'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Row 2: Condition / Quality Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {isSwahili ? 'Ubora:' : 'Quality:'}
          </span>
          {conditions.map((cond) => {
            const isActive = selectedCondition === cond.id;
            return (
              <button
                key={cond.id}
                onClick={() => setSelectedCondition(cond.id)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-emerald-950/40 text-slate-600 dark:text-emerald-300/80 hover:bg-slate-200 dark:hover:bg-emerald-900/40 border border-slate-200/80 dark:border-emerald-800/60'
                }`}
              >
                {cond.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isWish = wishlistedIds[product.id];
            const reviewsCount = product.reviewsCount ?? product.reviews?.length ?? 0;
            const conditionText = product.condition || 'Brand New';

            return (
              <div
                key={product.id}
                onClick={() => onOpenProductDetail(product)}
                className="group card-neon-gold rounded-3xl overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                {/* Subtle gold-green neon top line */}
                <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/20 via-[#ffd700]/70 to-emerald-500/20" />
                <div>
                  <div className="relative aspect-square w-full bg-slate-100 dark:bg-emerald-950/40 overflow-hidden">
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Condition / Quality Badge */}
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-xs backdrop-blur-xs ${conditionBadgeStyle(
                        conditionText
                      )}`}
                    >
                      {conditionText}
                    </span>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleWishlist(product, e)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-[#07120d]/90 backdrop-blur-xs flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors shadow-sm cursor-pointer"
                      title={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isWish ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-emerald-400/60 font-semibold mb-1">
                      <span className="uppercase tracking-tight truncate">
                        {product.seller}
                      </span>
                      <span className="text-slate-500 dark:text-emerald-300/70">
                        {product.stock > 0
                          ? isSwahili
                            ? `${product.stock} zimebaki`
                            : `${product.stock} units left`
                          : isSwahili
                          ? 'Imeisha'
                          : 'Out of stock'}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50 leading-snug line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {isSwahili && product.nameSwahili ? product.nameSwahili : product.name}
                    </h3>

                    {/* Rating and Reviews Row */}
                    <div className="flex items-center gap-1.5 text-xs mt-2">
                      <div className="flex items-center gap-0.5 text-[#ffd700]">
                        <Star className="w-3.5 h-3.5 fill-[#ffd700] text-[#ffd700]" />
                        <span className="text-[11px] font-bold text-slate-800 dark:text-[#ffd700]">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-slate-300 dark:text-emerald-800">·</span>
                      <span className="text-[11px] text-slate-500 dark:text-emerald-300/80 hover:underline flex items-center gap-0.5">
                        <MessageSquare className="w-3 h-3 text-slate-400 inline" />
                        {reviewsCount} {isSwahili ? 'maoni' : (reviewsCount === 1 ? 'review' : 'reviews')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-emerald-950/10 dark:border-emerald-500/15">
                    <div>
                      <span className="text-[10px] text-slate-400 block -mb-0.5">
                        {isSwahili ? 'Bei' : 'Price'}
                      </span>
                      <div className="text-sm font-black text-emerald-700 dark:text-[#ffd700] tabular-nums">
                        {formatTZS(product.price)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenProductDetail(product);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-emerald-950/70 hover:bg-slate-200 dark:hover:bg-emerald-900/60 text-slate-700 dark:text-emerald-200 text-[11px] font-bold inline-flex items-center gap-1 border border-emerald-900/10 dark:border-emerald-500/20 hover:border-[#ffd700]/40 transition-colors"
                        title={isSwahili ? 'Tazama maoni na maelezo ya kina ya bidhaa' : 'View reviews and product details'}
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-[#ffd700]" />
                        <span>{isSwahili ? 'Kagua' : 'Inspect'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(
                            product.name,
                            product.price,
                            product.image,
                            product.id,
                            1,
                            product.condition
                          );
                        }}
                        className="p-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white border border-[#ffd700]/30 shadow-[0_0_10px_rgba(5,150,105,0.3)] transition-all cursor-pointer"
                        title={isSwahili ? 'Ongeza kwenye kikapu' : 'Add 1 to cart'}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-white dark:bg-[#0e1d15] rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20">
          <PackageOpen className="w-12 h-12 mx-auto text-emerald-600 dark:text-emerald-400 mb-3 opacity-60" />
          <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
            {isSwahili
              ? 'Hakuna bidhaa zilizopatikana kwa vichujio hivi'
              : 'No products found matching filters'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-emerald-400/60 mt-1">
            {isSwahili
              ? 'Jaribu kubadilisha maneno ya utafutaji, hali ya ubora, au kategoria.'
              : 'Try adjusting your search query, condition filter, or category selection.'}
          </p>
        </div>
      )}
    </section>
  );
};
