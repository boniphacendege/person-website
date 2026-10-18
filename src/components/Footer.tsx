import React, { useState } from 'react';
import {
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
  Mail,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Users,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
  onShowToast: (msg: string) => void;
  language?: string;
  onOpenAuth?: (mode: 'login' | 'signup' | 'terms' | 'privacy') => void;
  mailingList?: string[];
  onSubscribeNewsletter?: (
    email: string
  ) => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenContact,
  onShowToast,
  language,
  onOpenAuth,
  mailingList = [],
  onSubscribeNewsletter,
}) => {
  const isSwahili = language === 'Swahili';

  // Newsletter Subscription state
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  const totalSubscribersCount = 286 + mailingList.length;

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();

    if (!cleanEmail) {
      setSubscribeStatus({
        type: 'error',
        message: isSwahili
          ? 'Tafadhali weka anwani ya barua pepe.'
          : 'Please enter your email address.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setSubscribeStatus({
        type: 'error',
        message: isSwahili
          ? 'Tafadhali weka barua pepe sahihi.'
          : 'Please enter a valid email address.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubscribeStatus({ type: 'idle', message: '' });

    try {
      if (onSubscribeNewsletter) {
        const result = await onSubscribeNewsletter(cleanEmail);
        if (result.success) {
          setSubscribeStatus({
            type: 'success',
            message: result.message || (isSwahili
              ? 'Asante sana! Umefanikiwa kujiunga na jarida letu.'
              : 'Thank you! You have successfully subscribed to our newsletter.'),
          });
          setEmailInput('');
        } else {
          setSubscribeStatus({
            type: 'error',
            message: result.message || (isSwahili
              ? 'Imeshindwa kusajili barua pepe.'
              : 'Failed to subscribe email.'),
          });
        }
      } else {
        // Fallback if not passed
        setSubscribeStatus({
          type: 'success',
          message: isSwahili
            ? 'Asante sana! Barua pepe yako imerekodiwa.'
            : 'Thank you! Your email has been added to our mailing list.',
        });
        setEmailInput('');
      }
    } catch (err: any) {
      setSubscribeStatus({
        type: 'error',
        message: isSwahili
          ? 'Hitilafu ya mtandao, tafadhali jaribu tena.'
          : 'Network error, please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#052b1b] text-white border-t border-emerald-900/40 mt-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        {/* Newsletter Subscription Section */}
        <section
          id="newsletter-section"
          aria-labelledby="newsletter-heading"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#073824] via-[#052b1b] to-[#041d12] border border-emerald-500/30 shadow-2xl p-6 sm:p-10"
        >
          {/* Subtle decorative glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#ffd700]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/30 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSwahili ? 'Jarida la Kipekee' : 'Exclusive Newsletter'}</span>
              </div>

              <h3
                id="newsletter-heading"
                className="text-2xl sm:text-3xl font-black font-editorial text-white tracking-tight leading-snug"
              >
                {isSwahili
                  ? 'Jiunge na Jarida Rasmi la Ev Dr. Boniphace J. Ndege'
                  : 'Subscribe to Ev Dr. Boniphace J. Ndege’s Newsletter'}
              </h3>

              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-xl">
                {isSwahili
                  ? 'Pokea taarifa za kwanza za machapisho ya vitabu vipya, video za kitaalamu, makala za kipekee za maarifa, vipindi vya mubashara na ofa za Soko la Kimataifa moja kwa moja kwenye barua pepe yako.'
                  : 'Get first access to new book publications, masterclass video releases, deep leadership essays, live session invitations, and curated global marketplace offers delivered straight to your inbox.'}
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-emerald-200/70">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#ffd700]" />
                  <span>
                    {isSwahili
                      ? `Wasomaji ${totalSubscribersCount}+ wamejiunga`
                      : `Join ${totalSubscribersCount}+ active subscribers`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isSwahili
                      ? 'Hakuna barua taka · Jitoe wakati wowote'
                      : 'Zero spam · Unsubscribe at any time'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleSubscribeSubmit}
                className="bg-black/30 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-emerald-500/20 shadow-inner space-y-3"
              >
                <label
                  htmlFor="newsletter-email"
                  className="block text-xs font-bold text-emerald-200 uppercase tracking-wider"
                >
                  {isSwahili ? 'Anwani ya Barua Pepe' : 'Email Address'}
                </label>

                <div className="relative flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300/60 pointer-events-none" />
                    <input
                      id="newsletter-email"
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (subscribeStatus.type !== 'idle') {
                          setSubscribeStatus({ type: 'idle', message: '' });
                        }
                      }}
                      placeholder={
                        isSwahili
                          ? 'Weka barua pepe yako hapa...'
                          : 'Enter your email address...'
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-emerald-400/30 focus:border-[#ffd700] text-sm text-white placeholder-emerald-200/50 outline-none transition-all"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#ffd700] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-[#052b1b] font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:pointer-events-none shrink-0"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-[#052b1b] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{isSwahili ? 'Jiunge' : 'Subscribe'}</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Status Feedback */}
                {subscribeStatus.type === 'success' && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-[#ffd700] shrink-0" />
                    <span>{subscribeStatus.message}</span>
                  </div>
                )}

                {subscribeStatus.type === 'error' && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                    <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                    <span>{subscribeStatus.message}</span>
                  </div>
                )}

                <p className="text-[11px] text-emerald-200/50 leading-tight">
                  {isSwahili ? (
                    <>
                      Kwa kubonyeza Jiunge, unakubali kupokea majarida na taarifa. Soma{' '}
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenAuth) onOpenAuth('privacy');
                          else onShowToast('Privacy policy: Data is safe.');
                        }}
                        className="underline hover:text-white cursor-pointer"
                      >
                        Sera ya Faragha
                      </button>
                      .
                    </>
                  ) : (
                    <>
                      By subscribing, you agree to receive newsletters and updates. View our{' '}
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenAuth) onOpenAuth('privacy');
                          else onShowToast('Privacy policy: Data is safe.');
                        }}
                        className="underline hover:text-white cursor-pointer"
                      >
                        Privacy Policy
                      </button>
                      .
                    </>
                  )}
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00a651] to-[#087a45] text-white flex items-center justify-center font-black text-sm shadow-md">
                BN
              </div>
              <h3 className="text-xl font-bold font-editorial">
                Ev Dr. Boniphace J. Ndege
              </h3>
            </div>
            <p className="text-xs text-emerald-100/70 leading-relaxed max-w-sm mb-6">
              {isSwahili
                ? 'Jukwaa la kisasa la kidijitali linalounganisha maudhui, jamii, maarifa, mawasiliano na Open Shop.'
                : 'A modern personal digital platform connecting content, community, knowledge, communication and Open Shop.'}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onShowToast('Facebook channel: @boniphacendege')}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => onShowToast('YouTube channel: Ev Dr. Boniphace J. Ndege Official')}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </button>
              <button
                onClick={() => onShowToast('Instagram: @boniphacendege')}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button
                onClick={() => onShowToast('LinkedIn: Ev Dr. Boniphace J. Ndege')}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column: Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              {isSwahili ? 'Gundua' : 'Explore'}
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/70">
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Makala za Blog' : 'Blog Articles'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('books')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Vitabu & Usomaji' : 'Books & Reading'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('videos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Kituo cha Video' : 'Video Hub'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('live')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Vipindi Mubashara' : 'Live Conferencing'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Community & Shopping */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              {isSwahili ? 'Soko na Studio' : 'Marketplace'}
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/70">
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Open Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Vitengo vya Bidhaa' : 'Categories'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('seller')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Kituo cha Muuzaji' : 'Seller Center'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('creator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Studio ya Muundaji' : 'Creator Studio'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              {isSwahili ? 'Msaada & Faragha' : 'Support'}
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/70">
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Wasiliana na Ev Dr. Boniphace Ndege' : 'Contact Ev Dr. Boniphace Ndege'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onOpenAuth) onOpenAuth('privacy');
                    else
                      onShowToast(
                        isSwahili
                          ? 'Sera ya Faragha: Taarifa zako zinalindwa kikamilifu.'
                          : 'Privacy policy: User data is protected and secured.'
                      );
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Sera ya Faragha' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onOpenAuth) onOpenAuth('terms');
                    else
                      onShowToast(
                        isSwahili
                          ? 'Vigezo na Masharti ya kawaida ya soko yanatumika.'
                          : 'Terms of Service: Standard marketplace terms apply.'
                      );
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Vigezo na Masharti' : 'Terms & Conditions'}
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onShowToast(
                      isSwahili
                        ? 'Dawati la msaada liko wazi saa 24/7.'
                        : 'Help Desk is active 24/7.'
                    )
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Kituo cha Usaidizi' : 'Help Center'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-200/50">
          <span>
            {isSwahili
              ? '© 2026 Ev Dr. Boniphace Ndege. Haki zote zimehifadhiwa.'
              : '© 2026 Ev Dr. Boniphace Ndege. All rights reserved.'}
          </span>
          <span>
            {isSwahili
              ? 'Open Shop · Vyombo vya Habari · Vitabu · Jamii · Mubashara'
              : 'Open Shop · Media · Books · Community · Live'}
          </span>
        </div>
      </div>
    </footer>
  );
};
