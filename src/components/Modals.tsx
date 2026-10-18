import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  Lock,
  BookOpen,
  Play,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Users,
  Send,
  Moon,
  Sun,
  Globe,
  ShieldCheck,
  Check,
  User,
  Laptop,
  ArrowDown,
  ArrowUp,
  MessageSquare,
  Crown,
  ChevronDown,
  Sparkles,
  Upload,
} from 'lucide-react';
import { CartItem, Book, BlogArticle, VideoItem, Meeting, ReadingMaterial } from '../types';
import { ReaderModal } from './ReaderModal';
import { VideoUploadModal } from './VideoUploadModal';
import { VideoPlayerModal } from './VideoPlayerModal';
import { BritishFlag, TanzaniaFlag } from './Flags';

interface ModalsProps {
  // Cart
  isCartOpen: boolean;
  onCloseCart: () => void;
  cartItems: CartItem[];
  onRemoveFromCart: (id: string) => void;
  onUpdateCartQty: (id: string, delta: number) => void;
  onCheckout: (name: string, email: string) => void;

  // Post Modal
  isPostModalOpen: boolean;
  onClosePostModal: () => void;
  onCreatePost: (content: string, tag: string, title?: string) => void;

  // Blog Modal
  isBlogModalOpen: boolean;
  onCloseBlogModal: () => void;
  onCreateBlog: (title: string, category: string, content: string, imageUrl?: string) => void;

  // Book Modal (optional, handled in App.tsx)
  isBookModalOpen?: boolean;
  onCloseBookModal?: () => void;
  onCreateBook?: (title: string, price: number, description: string, category: string) => void;

  // Video Upload Modal
  isVideoUploadModalOpen: boolean;
  onCloseVideoUploadModal: () => void;
  onCreateVideo: (
    title: string,
    description: string,
    videoUrl?: string,
    thumbnailUrl?: string,
    duration?: string,
    category?: string
  ) => void;

  // Meeting Create Modal
  isMeetingModalOpen: boolean;
  onCloseMeetingModal: () => void;
  onCreateMeeting: (title: string, schedule: string) => void;

  // Reader Modal
  activeReadingMaterial: ReadingMaterial | null;
  onCloseReaderModal: () => void;

  // Video Player Modal
  activePlayingVideo: VideoItem | null;
  onCloseVideoPlayerModal: () => void;
  onSelectVideo?: (video: VideoItem) => void;
  videos?: VideoItem[];
  onShowToast?: (msg: string) => void;

  // Live Room Modal
  activeLiveMeeting: Meeting | null;
  onCloseLiveMeetingModal: () => void;

  // Contact Modal
  isContactModalOpen: boolean;
  onCloseContactModal: () => void;
  onSubmitContact: (name: string, email: string, message: string) => void;

  // Notifications Modal
  isNotificationsOpen: boolean;
  onCloseNotifications: () => void;

  // Settings Modal
  isSettingsOpen: boolean;
  onCloseSettings: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: string;
  onChangeLanguage: (lang: string) => void;
  onOpenEditProfile: () => void;
  themeMode?: 'system' | 'light' | 'dark';
  onChangeThemeMode?: (mode: 'system' | 'light' | 'dark') => void;
  systemIsDark?: boolean;
}

export const Modals: React.FC<ModalsProps> = ({
  isCartOpen,
  onCloseCart,
  cartItems,
  onRemoveFromCart,
  onUpdateCartQty,
  onCheckout,

  isPostModalOpen,
  onClosePostModal,
  onCreatePost,

  isBlogModalOpen,
  onCloseBlogModal,
  onCreateBlog,

  isBookModalOpen,
  onCloseBookModal,
  onCreateBook,

  isVideoUploadModalOpen,
  onCloseVideoUploadModal,
  onCreateVideo,

  isMeetingModalOpen,
  onCloseMeetingModal,
  onCreateMeeting,

  activeReadingMaterial,
  onCloseReaderModal,

  activePlayingVideo,
  onCloseVideoPlayerModal,
  onSelectVideo,
  videos,
  onShowToast,

  activeLiveMeeting,
  onCloseLiveMeetingModal,

  isContactModalOpen,
  onCloseContactModal,
  onSubmitContact,

  isNotificationsOpen,
  onCloseNotifications,

  isSettingsOpen,
  onCloseSettings,
  darkMode,
  onToggleDarkMode,
  language,
  onChangeLanguage,
  onOpenEditProfile,
  themeMode = 'system',
  onChangeThemeMode,
  systemIsDark = false,
}) => {
  const isSwahili = language === 'Swahili';
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Local state for forms
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');

  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postTag, setPostTag] = useState('Digital Life');

  const [blogTitle, setBlogTitle] = useState('');
  const [blogCat, setBlogCat] = useState('Technology');
  const [blogContent, setBlogContent] = useState('');
  const [blogImageUrl, setBlogImageUrl] = useState('');

  const [bookTitle, setBookTitle] = useState('');
  const [bookPrice, setBookPrice] = useState('18000');
  const [bookDesc, setBookDesc] = useState('');
  const [bookCat, setBookCat] = useState('Business');

  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');

  const [meetTitle, setMeetTitle] = useState('');
  const [meetSchedule, setMeetSchedule] = useState('Today • 8:00 PM');

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  // Live room local interactive state with Easy Scroll
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [liveChatInput, setLiveChatInput] = useState('');
  const [isLiveChatScrolledUp, setIsLiveChatScrolledUp] = useState(false);
  const liveChatContainerRef = useRef<HTMLDivElement>(null);
  const liveChatBottomRef = useRef<HTMLDivElement>(null);

  const [liveChatMessages, setLiveChatMessages] = useState<
    Array<{ author: string; text: string; time: string; isHost?: boolean }>
  >([
    { author: 'Sarah J.', text: 'Welcome everyone to today’s broadcast!', time: '8:00 PM' },
    { author: 'David M.', text: 'Clear audio and video stream.', time: '8:01 PM' },
    { author: 'Grace W.', text: 'Excited for the book club announcements!', time: '8:02 PM' },
    { author: 'Alex K.', text: 'Connecting live from Dar es Salaam. Great visual quality!', time: '8:03 PM' },
    { author: 'Ev Dr. Boniphace J. Ndege (Host)', text: 'Karibuni sana! In today’s live room we are unveiling the creator blueprint and store integration.', time: '8:04 PM', isHost: true },
    { author: 'Neema R.', text: 'Audio clarity is 100% on mobile.', time: '8:04 PM' },
    { author: 'Sarah J.', text: 'If you have questions for Ev Dr. Boniphace J. Ndege, drop them here in the chat anytime.', time: '8:05 PM' },
    { author: 'Baraka T.', text: 'Can we access the digital downloads during this call?', time: '8:06 PM' },
    { author: 'Ev Dr. Boniphace J. Ndege (Host)', text: 'Yes Baraka, all books and resources are instant access in the store!', time: '8:07 PM', isHost: true },
  ]);

  // Easy scroll helpers for Live Meeting Chat
  const scrollToLiveChatBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (liveChatBottomRef.current) {
      liveChatBottomRef.current.scrollIntoView({ behavior });
    }
    setIsLiveChatScrolledUp(false);
  };

  const scrollToLiveChatTop = (behavior: ScrollBehavior = 'smooth') => {
    if (liveChatContainerRef.current) {
      liveChatContainerRef.current.scrollTo({ top: 0, behavior });
    }
  };

  const handleLiveChatScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const distanceFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    setIsLiveChatScrolledUp(distanceFromBottom > 45);
  };

  // Scroll to bottom when live room opens
  useEffect(() => {
    if (activeLiveMeeting) {
      const timer = setTimeout(() => {
        scrollToLiveChatBottom('auto');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeLiveMeeting]);

  // Auto-scroll on new message if user was already near bottom
  useEffect(() => {
    if (!isLiveChatScrolledUp && activeLiveMeeting) {
      scrollToLiveChatBottom('smooth');
    }
  }, [liveChatMessages.length]);

  const formatTZS = (num: number) => {
    return 'TZS ' + Number(num).toLocaleString('en-TZ');
  };

  const totalCart = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* 1. CART MODAL / DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0e1d15] w-full max-w-lg rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-emerald-950/10 dark:border-emerald-500/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                  {isSwahili
                    ? `Kikapu Chako cha Manunuzi (${cartItems.length})`
                    : `Your Shopping Cart (${cartItems.length})`}
                </h3>
              </div>
              <button
                onClick={onCloseCart}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15"
                  >
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <strong className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50 truncate">
                        {item.name}
                      </strong>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {item.condition && (
                          <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">
                            {item.condition}
                          </span>
                        )}
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {formatTZS(item.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => onUpdateCartQty(item.id, -1)}
                          className="w-5 h-5 rounded-md bg-white dark:bg-[#0e1d15] border border-slate-200 dark:border-emerald-800 text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateCartQty(item.id, 1)}
                          className="w-5 h-5 rounded-md bg-white dark:bg-[#0e1d15] border border-slate-200 dark:border-emerald-800 text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 cursor-pointer"
                      title={isSwahili ? 'Ondoa bidhaa' : 'Remove item'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold">
                    {isSwahili ? 'Kikapu chako kiko tupu.' : 'Your cart is empty.'}
                  </p>
                  <p className="text-xs mt-1">
                    {isSwahili
                      ? 'Ongeza vitabu, vifaa au bidhaa kutoka Soko la Dunia!'
                      : 'Add books, tech, or items from Global Shopping!'}
                  </p>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-5 border-t border-emerald-950/10 dark:border-emerald-500/15 bg-slate-50/50 dark:bg-emerald-950/30 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-600 dark:text-emerald-200">
                    {isSwahili ? 'Jumla ya Agizo' : 'Order Subtotal'}
                  </span>
                  <strong className="text-base font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatTZS(totalCart)}
                  </strong>
                </div>

                <div className="space-y-2 pt-2">
                  <input
                    type="text"
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    placeholder={isSwahili ? 'Jina Kamili kwa Uwasilishaji' : 'Full Name for Delivery'}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-[#0e1d15] border border-slate-200 dark:border-emerald-800 rounded-xl"
                  />
                  <input
                    type="email"
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    placeholder={isSwahili ? 'Anwani ya Barua Pepe' : 'Email Address'}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-[#0e1d15] border border-slate-200 dark:border-emerald-800 rounded-xl"
                  />
                </div>

                <button
                  onClick={() => {
                    onCheckout(checkoutName, checkoutEmail);
                    setCheckoutName('');
                    setCheckoutEmail('');
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-md shadow-emerald-700/25 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSwahili ? 'Endelea Kulipa kwa Usalama' : 'Proceed to Secure Checkout'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. CREATE POST MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0e1d15] w-full max-w-lg rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/10 dark:border-emerald-500/15 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Tunga Chapisho' : 'Create Post'}
              </h3>
              <button
                onClick={onClosePostModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Mada / Lebo' : 'Topic / Tag'}
                </label>
                <select
                  value={postTag}
                  onChange={(e) => setPostTag(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                >
                  <option value="Digital Life">{isSwahili ? 'Maisha ya Kidijitali' : 'Digital Life'}</option>
                  <option value="Global Shopping">{isSwahili ? 'Soko la Dunia' : 'Global Shopping'}</option>
                  <option value="Creator Economy">{isSwahili ? 'Uchumi wa Muundaji' : 'Creator Economy'}</option>
                  <option value="Books & Knowledge">{isSwahili ? 'Vitabu & Maarifa' : 'Books & Knowledge'}</option>
                  <option value="Technology">{isSwahili ? 'Teknolojia' : 'Technology'}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Kichwa cha Habari (Hiari)' : 'Headline (Optional)'}
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder={isSwahili ? 'Kichwa cha chapisho...' : 'Post headline'}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Una wazo gani leo?' : "What's on your mind?"}
                </label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={4}
                  placeholder={
                    isSwahili
                      ? 'Shiriki hadithi, maarifa, au tangazo na jamii...'
                      : 'Share a story, insight, or announcement with the community...'
                  }
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <button
                onClick={() => {
                  if (!postContent.trim()) return;
                  onCreatePost(postContent, postTag, postTitle);
                  setPostContent('');
                  setPostTitle('');
                  onClosePostModal();
                }}
                disabled={!postContent.trim()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
              >
                {isSwahili ? 'Chapisha Chapisho' : 'Publish Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. BLOG MODAL */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0e1d15] w-full max-w-xl rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/10 dark:border-emerald-500/15 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Andika Makala ya Blog' : 'Write Blog Article'}
              </h3>
              <button
                onClick={onCloseBlogModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Kichwa cha Makala' : 'Article Title'}
                </label>
                <input
                  type="text"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder={isSwahili ? 'Weka kichwa cha makala...' : 'Enter a compelling title'}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Kategoria' : 'Category'}
                </label>
                <select
                  value={blogCat}
                  onChange={(e) => setBlogCat(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                >
                  <option value="Technology">{isSwahili ? 'Teknolojia' : 'Technology'}</option>
                  <option value="Business">{isSwahili ? 'Biashara' : 'Business'}</option>
                  <option value="Books">{isSwahili ? 'Vitabu' : 'Books'}</option>
                  <option value="Lifestyle">{isSwahili ? 'Maisha & Uongozi' : 'Lifestyle'}</option>
                </select>
              </div>

              {/* Image Upload Part */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Picha ya Makala (Image Upload)' : 'Article Image / Cover (Upload)'}
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={blogImageUrl}
                      onChange={(e) => setBlogImageUrl(e.target.value)}
                      placeholder={isSwahili ? 'Weka kiungo cha picha (URL) au pakia faili...' : 'Paste image URL or browse below...'}
                      className="flex-1 h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                    />
                    <label className="px-3 h-10 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-600 dark:text-[#ffd700] border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setBlogImageUrl(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isSwahili ? 'Pakia Picha' : 'Upload'}</span>
                    </label>
                  </div>

                  {blogImageUrl && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-500/30 max-h-36 bg-black">
                      <img
                        src={blogImageUrl}
                        alt="Blog cover preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setBlogImageUrl('')}
                        className="absolute top-2 right-2 p-1 rounded-lg bg-black/75 hover:bg-black text-white cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Maudhui Kamili ya Makala' : 'Full Article Content'}
                </label>
                <textarea
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  rows={8}
                  placeholder={isSwahili ? 'Andika makala yako kwa urefu hapa...' : 'Write your article in full prose...'}
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <button
                onClick={() => {
                  if (!blogTitle.trim() || !blogContent.trim()) return;
                  onCreateBlog(blogTitle, blogCat, blogContent, blogImageUrl || undefined);
                  setBlogTitle('');
                  setBlogContent('');
                  setBlogImageUrl('');
                  onCloseBlogModal();
                }}
                disabled={!blogTitle.trim() || !blogContent.trim()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
              >
                {isSwahili ? 'Chapisha Makala' : 'Publish Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. BOOK PUBLISH MODAL (Delegated to BookPublishModal in App.tsx) */}


      {/* 5. UPLOAD VIDEO MODAL */}
      <VideoUploadModal
        isOpen={isVideoUploadModalOpen}
        onClose={onCloseVideoUploadModal}
        onUpload={(payload) => {
          onCreateVideo(
            payload.title,
            payload.description,
            payload.videoUrl,
            payload.thumbnailUrl,
            payload.duration,
            payload.category
          );
        }}
        language={language}
      />

      {/* 6. CREATE MEETING MODAL */}
      {isMeetingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0e1d15] w-full max-w-lg rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/10 dark:border-emerald-500/15 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Unda Mkutano au Matangazo Mubashara' : 'Create Meeting or Live Broadcast'}
              </h3>
              <button
                onClick={onCloseMeetingModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Mada / Kichwa cha Mkutano' : 'Meeting Topic / Title'}
                </label>
                <input
                  type="text"
                  value={meetTitle}
                  onChange={(e) => setMeetTitle(e.target.value)}
                  placeholder={
                    isSwahili
                      ? 'Mf. Darasa la Kimkakati na Ev Dr. Boniphace J. Ndege'
                      : 'E.g. Strategy Masterclass with Ev Dr. Boniphace J. Ndege'
                  }
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Muda Uliopangwa' : 'Scheduled Time'}
                </label>
                <input
                  type="text"
                  value={meetSchedule}
                  onChange={(e) => setMeetSchedule(e.target.value)}
                  placeholder={isSwahili ? 'Kesho • Saa 1:00 Usiku' : 'Tomorrow • 7:00 PM'}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <button
                onClick={() => {
                  if (!meetTitle.trim()) return;
                  onCreateMeeting(meetTitle, meetSchedule);
                  setMeetTitle('');
                  onCloseMeetingModal();
                }}
                disabled={!meetTitle.trim()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
              >
                {isSwahili ? 'Panga Chumba cha Mkutano' : 'Schedule Meeting Room'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. READER MODAL (Books or Blogs) with subtle reading progress indicator */}
      {activeReadingMaterial && (
        <ReaderModal
          material={activeReadingMaterial}
          onClose={onCloseReaderModal}
          language={language}
        />
      )}

      {/* 8. VIDEO PLAYER MODAL */}
      <VideoPlayerModal
        isOpen={!!activePlayingVideo}
        video={activePlayingVideo}
        onClose={onCloseVideoPlayerModal}
        onSelectVideo={onSelectVideo}
        allVideos={videos}
        language={language}
        onShowToast={onShowToast}
      />

      {/* 9. LIVE ROOM MODAL */}
      {activeLiveMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#07120d] text-white w-full max-w-5xl rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[92vh]">
            {/* Live Video Stage */}
            <div className="md:col-span-8 flex flex-col justify-between bg-black relative">
              <div className="p-4 flex items-center justify-between absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse">
                    LIVE
                  </span>
                  <span className="text-xs font-bold text-white truncate">
                    {activeLiveMeeting.title}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-300">
                  <Users className="w-3.5 h-3.5" />
                  <span>{activeLiveMeeting.participantsCount} participants</span>
                </div>
              </div>

              {/* Main Simulated Video Screen */}
              <div className="flex-1 aspect-video flex items-center justify-center relative">
                <img
                  src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80"
                  alt="Live host"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1.5 rounded-xl text-xs font-semibold">
                  Ev Dr. Boniphace J. Ndege (Host)
                </div>
              </div>

              {/* Conference Controls */}
              <div className="p-4 bg-[#091811] flex items-center justify-center gap-3 border-t border-emerald-950">
                <button
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`p-3 rounded-full text-white transition-colors ${
                    micEnabled ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                  title={micEnabled ? 'Mute' : 'Unmute'}
                >
                  {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setCamEnabled(!camEnabled)}
                  className={`p-3 rounded-full text-white transition-colors ${
                    camEnabled ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                  title={camEnabled ? 'Turn camera off' : 'Turn camera on'}
                >
                  {camEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={onCloseLiveMeetingModal}
                  className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white ml-4 cursor-pointer"
                >
                  {isSwahili ? 'Ondoka Mkutano' : 'Leave Meeting'}
                </button>
              </div>
            </div>

            {/* Live Chat Pane with Easy Scroll */}
            <div className="md:col-span-4 bg-[#0e1d15] flex flex-col justify-between border-l border-emerald-950 h-full min-h-[360px] md:max-h-[580px] relative">
              {/* Live Meeting Chat Header with Easy Scroll Controls */}
              <div className="p-3.5 px-4 border-b border-emerald-900/30 flex items-center justify-between bg-[#0a1710]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {isSwahili ? 'Mazungumzo ya Mkutano' : 'Live Meeting Chat'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Quick Easy Scroll to Bottom control */}
                  <button
                    type="button"
                    onClick={() => scrollToLiveChatBottom('smooth')}
                    className="p-1 px-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-800/40 text-emerald-300 hover:text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title={isSwahili ? 'Shuka chini kwa urahisi' : 'Easy Scroll to bottom'}
                  >
                    <ArrowDown className="w-3 h-3 text-[#ffd700]" />
                    <span className="hidden sm:inline">{isSwahili ? 'Shuka Chini' : 'Easy Scroll'}</span>
                  </button>

                  {/* Scroll to Top control */}
                  <button
                    type="button"
                    onClick={() => scrollToLiveChatTop('smooth')}
                    className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-800/40 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={isSwahili ? 'Panda juu' : 'Scroll to top'}
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>

                  <button
                    onClick={onCloseLiveMeetingModal}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900/40 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Message Stream with Easy Smooth Scroll */}
              <div
                ref={liveChatContainerRef}
                onScroll={handleLiveChatScroll}
                className="flex-1 p-3.5 space-y-2.5 overflow-y-auto max-h-[380px] scroll-smooth overscroll-contain touch-pan-y"
              >
                {liveChatMessages.map((msg, idx) => {
                  const isMe = msg.author === 'You';
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 text-xs p-2.5 rounded-2xl border transition-all ${
                        isMe
                          ? 'bg-emerald-900/35 border-emerald-500/30 ml-4'
                          : msg.isHost
                          ? 'bg-amber-950/30 border-[#ffd700]/30 mr-2'
                          : 'bg-emerald-950/40 border-emerald-900/20 mr-2'
                      }`}
                    >
                      {/* Avatar Initials Badge */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs ${
                          isMe
                            ? 'bg-emerald-600 text-white'
                            : msg.isHost
                            ? 'bg-gradient-to-br from-[#ffd700] to-emerald-600 text-slate-950'
                            : 'bg-emerald-900 text-emerald-200 border border-emerald-700/40'
                        }`}
                      >
                        {msg.isHost ? (
                          <Crown className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                        ) : (
                          msg.author.charAt(0)
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className={`font-bold truncate ${
                              msg.isHost
                                ? 'text-[#ffd700]'
                                : isMe
                                ? 'text-emerald-300'
                                : 'text-emerald-400'
                            }`}
                          >
                            {msg.author}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {msg.time}
                          </span>
                        </div>
                        <p className="text-slate-200 leading-snug break-words">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={liveChatBottomRef} className="h-1" />
              </div>

              {/* Floating Easy Scroll Button when scrolled up */}
              {isLiveChatScrolledUp && (
                <button
                  type="button"
                  onClick={() => scrollToLiveChatBottom('smooth')}
                  className="absolute bottom-28 right-4 z-30 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xl shadow-black/80 flex items-center gap-1.5 border border-[#ffd700]/60 backdrop-blur-md animate-bounce cursor-pointer transition-all"
                  title="Easy Scroll to latest messages"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-[#ffd700]" />
                  <span>{isSwahili ? 'Shuka Chini ↓' : 'Easy Scroll ↓'}</span>
                </button>
              )}

              {/* Quick Reactions Bar */}
              <div className="px-3 pt-2 pb-1 border-t border-emerald-900/30 bg-[#0a1710] flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[10px] font-semibold text-slate-400 mr-1 shrink-0">
                  {isSwahili ? 'Mwitikio:' : 'React:'}
                </span>
                {['👏', '🔥', '❤️', '👍', 'Inspiring!', 'Questions?'].map((reaction) => (
                  <button
                    key={reaction}
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      setLiveChatMessages((prev) => [
                        ...prev,
                        { author: 'You', text: reaction, time: timeStr },
                      ]);
                      setTimeout(() => scrollToLiveChatBottom('smooth'), 50);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-slate-200 hover:text-white border border-emerald-800/40 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0"
                  >
                    {reaction}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-[#0a1710] border-t border-emerald-900/30">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!liveChatInput.trim()) return;
                    const now = new Date();
                    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    setLiveChatMessages((prev) => [
                      ...prev,
                      { author: 'You', text: liveChatInput.trim(), time: timeStr },
                    ]);
                    setLiveChatInput('');
                    setTimeout(() => scrollToLiveChatBottom('smooth'), 50);
                  }}
                  className="flex items-center gap-1.5 bg-[#06110b] border border-emerald-900/50 rounded-2xl p-1 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20"
                >
                  <input
                    type="text"
                    value={liveChatInput}
                    onChange={(e) => setLiveChatInput(e.target.value)}
                    placeholder={isSwahili ? 'Piga gumzo na washiriki wa mkutano...' : 'Chat with meeting participants...'}
                    className="flex-1 h-8 px-3 text-xs bg-transparent text-white placeholder-slate-400 focus:outline-none min-w-0"
                  />
                  <button
                    type="submit"
                    disabled={!liveChatInput.trim()}
                    className="h-8 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isSwahili ? 'Tuma' : 'Send'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. CONTACT BONIPHACE MODAL */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0e1d15] w-full max-w-lg rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/10 dark:border-emerald-500/15 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Wasiliana na Ev Dr. Boniphace J. Ndege' : 'Contact Ev Dr. Boniphace J. Ndege'}
              </h3>
              <button
                onClick={onCloseContactModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Jina Lako Kamili' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder={isSwahili ? 'Weka jina lako kamili' : 'Your full name'}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Barua Pepe Yako' : 'Your Email'}
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {isSwahili ? 'Ujumbe Wako' : 'Message'}
                </label>
                <textarea
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  rows={4}
                  placeholder={
                    isSwahili
                      ? 'Je, tunawezaje kushirikiana, kusaidiana, au kufanya kazi pamoja?'
                      : 'How can we collaborate, assist, or partner together?'
                  }
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-emerald-50"
                />
              </div>

              <button
                onClick={() => {
                  if (!contactName || !contactEmail || !contactMsg) return;
                  onSubmitContact(contactName, contactEmail, contactMsg);
                  setContactName('');
                  setContactEmail('');
                  setContactMsg('');
                  onCloseContactModal();
                }}
                disabled={!contactName || !contactEmail || !contactMsg}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
              >
                {isSwahili ? 'Tuma Ujumbe' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. NOTIFICATIONS MODAL */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0e1d15] w-full max-w-md rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/10 dark:border-emerald-500/15 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Taarifa' : 'Notifications'}
              </h3>
              <button
                onClick={onCloseNotifications}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
                <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                  {isSwahili ? 'Sarah amependa chapisho lako' : 'Sarah liked your post'}
                </strong>
                <span className="text-[10px] text-slate-400">{isSwahili ? 'Dakika 10 zilizopita' : '10 minutes ago'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
                <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                  {isSwahili ? 'Wanachama wapya 24 wamejiunga na jamii yako' : '24 new members joined your community'}
                </strong>
                <span className="text-[10px] text-slate-400">{isSwahili ? 'Leo' : 'Today'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
                <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                  {isSwahili ? 'Agizo jipya limepokelewa: #GS-1048' : 'New order received: #GS-1048'}
                </strong>
                <span className="text-[10px] text-slate-400">{isSwahili ? 'Leo' : 'Today'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
                <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                  {isSwahili ? 'Kipindi mubashara kinaanza baada ya dakika 15' : 'Live session starts in 15 minutes'}
                </strong>
                <span className="text-[10px] text-slate-400">{isSwahili ? 'Matangazo yaliyopangwa' : 'Scheduled broadcast'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0e1d15] w-full max-w-md rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-950/10 dark:border-emerald-500/15 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Mipangilio ya Mfumo' : 'Platform Settings'}
              </h3>
              <button
                onClick={onCloseSettings}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Profile & Branding Edit */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-emerald-600" />
                  <div>
                    <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                      {isSwahili ? 'Wasifu & Chapa' : 'Profile & Branding'}
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      {isSwahili
                        ? 'Badili picha, bango, jina, na maelezo'
                        : 'Change photos, banner, name, and bio'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onCloseSettings();
                    onOpenEditProfile();
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#d4af37] hover:bg-[#c29e2e] text-slate-900 transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Hariri Wasifu' : 'Edit Profile'}
                </button>
              </div>

              {/* Theme Settings: Permanently Locked to Signature Dark Emerald & Gold */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-950/5 dark:border-emerald-500/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#06331e] to-[#02130a] border border-[#ffd700]/30 flex items-center justify-center text-[#ffd700] shadow-sm">
                    <Sparkles className="w-4 h-4 text-[#ffd700]" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                      {language === 'Swahili' ? 'Mandhari ya Kudumu: Kijani Kibichi & Dhahabu' : 'Permanent Theme: Dark Emerald & Gold'}
                    </strong>
                    <span className="text-[10px] text-emerald-600 dark:text-[#ffd700] font-semibold">
                      {language === 'Swahili'
                        ? 'Hali ya Usiku (Dark Mode) imefungwa kiotomatiki kwa uzoefu bora'
                        : 'Signature dark aesthetic locked permanently'}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider">
                  Active
                </span>
              </div>

              {/* Language Drop-Down Menu */}
              <div className="relative p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-950/5 dark:border-emerald-500/15">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-emerald-600 dark:text-[#ffd700]" />
                    <div>
                      <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                        {isSwahili ? 'Lugha ya Mfumo' : 'Interface Language'}
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        {isSwahili ? 'Chagua Kiingereza au Kiswahili' : 'Select English or Swahili'}
                      </span>
                    </div>
                  </div>

                  {/* Drop-down Menu Trigger Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#0e1d15] text-slate-800 dark:text-emerald-100 border border-emerald-950/15 dark:border-emerald-600/40 shadow-xs hover:border-[#ffd700]/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      aria-haspopup="listbox"
                      aria-expanded={isLangDropdownOpen}
                      title={isSwahili ? 'Bofya kubadilisha lugha' : 'Click to change language'}
                    >
                      <div className="flex items-center gap-1.5">
                        {isSwahili ? (
                          <TanzaniaFlag className="w-5 h-3.5" />
                        ) : (
                          <BritishFlag className="w-5 h-3.5" />
                        )}
                        <span className="text-xs font-extrabold text-slate-900 dark:text-emerald-100">
                          {isSwahili ? 'Kiswahili' : 'English'}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                          isLangDropdownOpen ? 'rotate-180 text-emerald-500' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu Modal */}
                    {isLangDropdownOpen && (
                      <div className="absolute right-0 mt-1.5 w-52 rounded-2xl bg-white dark:bg-[#0a1811] border border-emerald-950/15 dark:border-emerald-500/30 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-400/60 border-b border-emerald-950/5 dark:border-emerald-500/10 mb-1">
                          {isSwahili ? 'Chagua Lugha' : 'Select Language'}
                        </div>

                        {/* Option 1: English with British Flag */}
                        <button
                          type="button"
                          onClick={() => {
                            onChangeLanguage('English');
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2.5 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            !isSwahili
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-[#ffd700]'
                              : 'text-slate-700 dark:text-emerald-100/90 hover:bg-slate-100 dark:hover:bg-emerald-900/40'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <BritishFlag className="w-5 h-3.5" />
                            <div className="text-left">
                              <span className="block leading-tight font-extrabold">English</span>
                              <span className="text-[10px] text-slate-400 dark:text-emerald-400/60 font-normal">United Kingdom</span>
                            </div>
                          </div>
                          {!isSwahili && <Check className="w-4 h-4 text-emerald-600 dark:text-[#ffd700]" />}
                        </button>

                        {/* Option 2: Swahili with Tanzania Flag */}
                        <button
                          type="button"
                          onClick={() => {
                            onChangeLanguage('Swahili');
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2.5 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            isSwahili
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-[#ffd700]'
                              : 'text-slate-700 dark:text-emerald-100/90 hover:bg-slate-100 dark:hover:bg-emerald-900/40'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <TanzaniaFlag className="w-5 h-3.5" />
                            <div className="text-left">
                              <span className="block leading-tight font-extrabold">Kiswahili</span>
                              <span className="text-[10px] text-slate-400 dark:text-emerald-400/60 font-normal">Tanzania</span>
                            </div>
                          </div>
                          {isSwahili && <Check className="w-4 h-4 text-emerald-600 dark:text-[#ffd700]" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-950/5 dark:border-emerald-500/15">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50">
                      {language === 'Swahili' ? 'Faragha ya Akaunti' : 'Account Privacy'}
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      {language === 'Swahili' ? 'Wasifu wa umma wa muundaji' : 'Public creator profile'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {language === 'Swahili' ? 'Imelindwa' : 'Secured'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
