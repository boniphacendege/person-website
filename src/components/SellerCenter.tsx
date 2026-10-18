import React from 'react';
import { Package, ShoppingBag, TrendingUp, Users, Plus, CheckCircle, Clock, Truck, ShieldCheck, Lock } from 'lucide-react';
import { Order } from '../types';

interface SellerCenterProps {
  orders: Order[];
  onOpenAddProduct: () => void;
  language?: string;
  isAdmin?: boolean;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
}

export const SellerCenter: React.FC<SellerCenterProps> = ({
  orders,
  onOpenAddProduct,
  language,
  isAdmin = false,
  onOpenAuth,
}) => {
  const isSwahili = language === 'Swahili';

  const formatTZS = (num: number) => {
    return 'TZS ' + Number(num).toLocaleString('en-TZ');
  };

  return (
    <section id="seller" className="py-12 max-w-6xl mx-auto px-4 border-t border-emerald-950/10 dark:border-emerald-500/15">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-500 dark:text-[#ffd700] flex items-center gap-1">
              <Lock className="w-3 h-3" />
              {isSwahili ? 'Kipengele cha Msimamizi Pekee' : 'Admin Only Feature'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-emerald-50 tracking-tight font-editorial">
            {isSwahili ? 'Kituo cha Muuzaji' : 'Seller Center'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1">
            {isSwahili
              ? 'Simamia bidhaa, ghala, wateja, maagizo na mauzo ya duka (Inahitaji ufikiaji wa Msimamizi).'
              : 'Manage products, inventory, customers, orders and sales (Requires Admin credentials).'}
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={onOpenAddProduct}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {isSwahili ? 'Ongeza Bidhaa' : 'Add Product'}
          </button>
        ) : (
          <button
            onClick={() => onOpenAuth?.('login')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-500 dark:text-[#ffd700] border border-amber-500/30 hover:bg-amber-500/25 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isSwahili ? 'Ingia kama Msimamizi' : 'Sign in as Admin'}</span>
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-500 dark:text-[#ffd700] shrink-0" />
            <span>
              {isSwahili
                ? 'Kituo cha Muuzaji na usimamizi wa orodha ya bidhaa ni kwa ajili ya Msimamizi pekee (Ev Dr. Boniphace J. Ndege). Wageni na wanachama hawaruhusiwi kubadilisha orodha.'
                : 'Seller Center and inventory controls are restricted to Admin (Ev Dr. Boniphace J. Ndege) only. Standard members cannot alter inventory or dispatch orders.'}
            </span>
          </div>
        </div>
      )}

      {/* Seller KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-neon-gold p-5 rounded-3xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-[#ffd700] border border-emerald-500/20 flex items-center justify-center mb-3">
            <Package className="w-5 h-5" />
          </div>
          <strong className="block text-2xl font-black text-slate-900 dark:text-emerald-50 tabular-nums">
            248
          </strong>
          <span className="text-xs text-slate-400">
            {isSwahili ? 'Bidhaa Zinazouzwa' : 'Active Products'}
          </span>
        </div>

        <div className="card-neon-gold p-5 rounded-3xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <strong className="block text-2xl font-black text-slate-900 dark:text-emerald-50 tabular-nums">
            1,284
          </strong>
          <span className="text-xs text-slate-400">
            {isSwahili ? 'Maagizo Yaliyofanyika' : 'Orders Processed'}
          </span>
        </div>

        <div className="card-neon-gold p-5 rounded-3xl">
          <div className="w-10 h-10 rounded-xl bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/30 shadow-[0_0_8px_rgba(255,215,0,0.3)] flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <strong className="block text-2xl font-black text-slate-900 dark:text-[#ffd700] tabular-nums">
            TZS 18.4M
          </strong>
          <span className="text-xs text-slate-400">
            {isSwahili ? 'Jumla ya Mauzo' : 'Total Sales'}
          </span>
        </div>

        <div className="card-neon-gold p-5 rounded-3xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-[#ffd700] border border-emerald-500/20 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <strong className="block text-2xl font-black text-slate-900 dark:text-emerald-50 tabular-nums">
            5,482
          </strong>
          <span className="text-xs text-slate-400">
            {isSwahili ? 'Jumla ya Wateja' : 'Total Customers'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders List */}
        <div className="card-neon-gold p-6 sm:p-8 rounded-3xl">
          <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/10 via-[#ffd700]/60 to-emerald-500/10 mb-4 rounded-full" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-emerald-50 mb-4 flex items-center justify-between">
            <span>{isSwahili ? 'Maagizo ya Hivi Karibuni' : 'Recent Orders'}</span>
            <span className="text-xs text-[#ffd700] font-bold">
              {isSwahili ? 'Utekelezaji' : 'Fulfillment'}
            </span>
          </h3>

          <div className="divide-y divide-emerald-950/10 dark:divide-emerald-500/15">
            {orders.slice(0, 5).map((order) => {
              const firstItem = order.items[0];
              return (
                <div key={order.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50">
                        {order.orderNumber}
                      </strong>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.status === 'Paid'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : order.status === 'Processing'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {isSwahili
                          ? order.status === 'Paid'
                            ? 'Imelipwa'
                            : order.status === 'Processing'
                            ? 'Inachakatwa'
                            : 'Imetumwa'
                          : order.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-emerald-300/70 block mt-0.5">
                      {firstItem ? firstItem.name : isSwahili ? 'Agizo la Duka' : 'Store Order'} · {formatTZS(order.totalAmount)}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {order.createdAt}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Store Performance */}
        <div className="card-neon-gold p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/10 via-[#ffd700]/60 to-emerald-500/10 mb-4 rounded-full" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-emerald-50 mb-4 flex items-center justify-between">
              <span>{isSwahili ? 'Ufanisi wa Duka' : 'Store Performance'}</span>
              <span className="text-xs text-[#ffd700] font-bold">
                {isSwahili ? 'Uchambuzi' : 'Analytics'}
              </span>
            </h3>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-600 dark:text-emerald-200">
                  <span>{isSwahili ? 'Lengo la Mapato ya Mwezi' : 'Monthly Revenue Target'}</span>
                  <span className="tabular-nums">76%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-emerald-950/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-[#00a651] rounded-full w-[76%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-600 dark:text-emerald-200">
                  <span>{isSwahili ? 'Kuridhika kwa Wateja' : 'Customer Satisfaction'}</span>
                  <span className="tabular-nums">94%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-emerald-950/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-[#ffd700] rounded-full w-[94%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-600 dark:text-emerald-200">
                  <span>{isSwahili ? 'Upatikanaji wa Bidhaa & Akiba' : 'Product Availability & Stock'}</span>
                  <span className="tabular-nums">87%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-emerald-950/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-[#00a651] rounded-full w-[87%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/20 mt-6 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-emerald-200 font-semibold">
              {isSwahili ? 'Hali ya Muuzaji wa Soko la Dunia' : 'Global Shopping Merchant Status'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 shadow-[0_0_8px_rgba(255,215,0,0.35)]">
              {isSwahili ? 'Mshirika wa Dhahabu Aliyethibitishwa' : 'Verified Gold Partner'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
