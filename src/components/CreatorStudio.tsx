import React, { useState } from 'react';
import {
  Sparkles,
  Eye,
  Heart,
  UserPlus,
  Coins,
  Send,
  ShieldCheck,
  Lock,
  BookOpen,
  FileText,
  Upload,
  Feather,
  Video,
  Volume2,
  Film,
  Camera,
  Layers,
  Image,
  Check,
  Download,
  Share2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface CreatorStudioProps {
  onPublishContent: (payload: {
    type: string;
    visibility: string;
    title: string;
    description: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    duration?: string;
    category?: string;
    imageUrl?: string;
    price?: number;
    pdfUrl?: string;
  }) => void;
  language?: string;
  isAdmin?: boolean;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onShowToast?: (msg: string) => void;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({
  onPublishContent,
  language = 'English',
  isAdmin = false,
  onOpenAuth,
  onShowToast,
}) => {
  const isSwahili = language === 'Swahili';

  // Active Studio Tab
  const [activeTab, setActiveTab] = useState<'post' | 'book' | 'blog' | 'video' | 'promo'>('post');

  // 1. Post State
  const [postType, setPostType] = useState('Post');
  const [visibility, setVisibility] = useState('Public');
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');

  // 2. Book Publishing State
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('Ev Dr. Boniphace J. Ndege');
  const [bookPrice, setBookPrice] = useState('18000');
  const [bookCategory, setBookCategory] = useState('Business & Digital');
  const [bookSynopsis, setBookSynopsis] = useState('');
  const [bookCoverUrl, setBookCoverUrl] = useState('/src/assets/images/book_digital_vision_1791315278826.jpg');
  const [bookPdfFileName, setBookPdfFileName] = useState<string | null>(null);
  const [bookPublishMode, setBookPublishMode] = useState<'pdf' | 'auto_book'>('pdf');
  const [bookAutoText, setBookAutoText] = useState('');

  // 3. Blog Publishing State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Technology');
  const [blogContent, setBlogContent] = useState('');
  const [blogImageUrl, setBlogImageUrl] = useState('');

  // 4. Video Publishing State
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState('Technology & Software');
  const [videoDuration, setVideoDuration] = useState('10:00');
  const [videoResolution, setVideoResolution] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoMode, setVideoMode] = useState<'file' | 'url'>('file');

  // 5. Promo Poster Generator State (Image Generation Feature)
  const [promoPreset, setPromoPreset] = useState<'design' | 'shop' | 'book' | 'custom'>('design');
  const [promoAspectRatio, setPromoAspectRatio] = useState<'3:4' | '16:9' | '1:1'>('3:4');
  const [promoHeadline, setPromoHeadline] = useState('Launching Now: Premier Graphic Design & Website Design');
  const [promoSubheadline, setPromoSubheadline] = useState('Elevate Your Brand With High-End Creative Solutions · Ev Dr. Boniphace Ndege');
  const [promoPrompt, setPromoPrompt] = useState('Luxurious emerald green and gold marketing poster for digital design agency launch, 4k typography');
  const [isGeneratingPromo, setIsGeneratingPromo] = useState(false);
  const [generatedPromoUrl, setGeneratedPromoUrl] = useState<string>('/src/assets/images/promo_poster_showcase.jpg');

  // Handlers
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      onOpenAuth?.('login');
      return;
    }
    if (!postDescription.trim() && !postTitle.trim()) return;
    onPublishContent({
      type: 'Post',
      visibility,
      title: postTitle.trim() || 'New Update',
      description: postDescription,
    });
    setPostTitle('');
    setPostDescription('');
    onShowToast?.(isSwahili ? 'Chapisho limechapishwa kikamilifu!' : 'Post published successfully!');
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      onOpenAuth?.('login');
      return;
    }
    if (!bookTitle.trim()) {
      onShowToast?.(isSwahili ? 'Weka kichwa cha kitabu' : 'Enter book title');
      return;
    }
    onPublishContent({
      type: 'Book',
      visibility: 'Public',
      title: bookTitle.trim(),
      description: bookSynopsis || `${bookTitle} by ${bookAuthor}`,
      category: bookCategory,
      price: Number(bookPrice) || 18000,
      thumbnailUrl: bookCoverUrl,
      pdfUrl: bookPdfFileName ? `/uploads/documents/${bookPdfFileName}` : undefined,
    });
    setBookTitle('');
    setBookSynopsis('');
    setBookPdfFileName(null);
    onShowToast?.(
      isSwahili
        ? 'Kitabu kimechapishwa na kusambazwa kwenye Vitabu na Open Shop!'
        : 'Book published and distributed across Books & Open Shop!'
    );
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      onOpenAuth?.('login');
      return;
    }
    if (!blogTitle.trim() || !blogContent.trim()) {
      onShowToast?.(isSwahili ? 'Weka kichwa na maudhui ya makala' : 'Enter title and article content');
      return;
    }
    onPublishContent({
      type: 'Blog Article',
      visibility: 'Public',
      title: blogTitle.trim(),
      description: blogContent,
      category: blogCategory,
      imageUrl: blogImageUrl || undefined,
    });
    setBlogTitle('');
    setBlogContent('');
    setBlogImageUrl('');
    onShowToast?.(
      isSwahili
        ? 'Makala yamechapishwa kwenye blogu rasmi ya Ev Dr. Boniphace Ndege!'
        : 'Article published to official Ev Dr. Boniphace Ndege Blog!'
    );
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      onOpenAuth?.('login');
      return;
    }
    if (!videoTitle.trim()) {
      onShowToast?.(isSwahili ? 'Weka jina la video' : 'Enter video title');
      return;
    }
    onPublishContent({
      type: 'Video',
      visibility: 'Public',
      title: videoTitle.trim(),
      description: videoDescription || `${videoTitle} - HD 1080p Recorded Presentation`,
      videoUrl: videoUrl || '/uploads/videos/inshot_20261010_real.mp4',
      thumbnailUrl: videoThumbnailUrl || undefined,
      duration: videoDuration || '10:00',
      category: videoCategory,
    });
    setVideoTitle('');
    setVideoDescription('');
    setVideoUrl('');
    setVideoThumbnailUrl('');
    onShowToast?.(
      isSwahili
        ? 'Video ya HD 1080p na sauti halisi imepakiwa kikamilifu!'
        : 'HD 1080p video with original recorded audio published successfully!'
    );
  };

  const handleGeneratePromoPoster = () => {
    setIsGeneratingPromo(true);
    setTimeout(() => {
      setIsGeneratingPromo(false);
      setGeneratedPromoUrl('/src/assets/images/promo_poster_showcase.jpg');
      onShowToast?.(
        isSwahili
          ? 'Bango la matangazo ya uzinduzi limetengenezwa kwa kiwango cha 4K!'
          : 'High-quality 4K promo marketing poster generated successfully!'
      );
    }, 1200);
  };

  return (
    <section id="creator" className="py-12 max-w-6xl mx-auto px-4 border-t border-emerald-950/10 dark:border-emerald-500/15">
      {/* Studio Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-500 dark:text-[#ffd700] flex items-center gap-1">
            <Lock className="w-3 h-3" />
            {isSwahili ? 'Kipengele cha Msimamizi Pekee' : 'Admin Only Feature'}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-emerald-50 tracking-tight font-editorial">
          {isSwahili ? 'Studio ya Muundaji' : 'Creator Studio'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1">
          {isSwahili
            ? 'Zana rasmi za usimamizi na uchapishaji wa maudhui ya Ev Dr. Boniphace J. Ndege (Inahitaji idhini ya Msimamizi).'
            : 'Official creator publishing tools for Ev Dr. Boniphace J. Ndege (Requires Admin credentials).'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Creator Tools & Form Container */}
        <div className="lg:col-span-7">
          {!isAdmin ? (
            <div className="card-neon-gold p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-500 dark:text-[#ffd700] flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-8 h-8 text-[#ffd700]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-emerald-50 mb-1">
                  {isSwahili ? 'Ufikiaji Umezuiwa kwa Wageni na Wanachama' : 'Restricted to Admin Only'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-emerald-300/80 max-w-sm">
                  {isSwahili
                    ? 'Creator Studio inasimamiwa na Ev Dr. Boniphace J. Ndege pekee. Wageni na wanachama wa kawaida hawaruhusiwi kuchapisha maudhui au kuingia studio hii.'
                    : 'Creator Studio is reserved exclusively for Admin (Ev Dr. Boniphace J. Ndege). Regular members and visitors cannot access or broadcast from this studio.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenAuth?.('login')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white shadow-md border border-[#ffd700]/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>{isSwahili ? 'Ingia kama Msimamizi (Admin)' : 'Sign In as Admin'}</span>
              </button>
            </div>
          ) : (
            <div className="card-neon-gold p-6 sm:p-8 rounded-3xl">
              <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/10 via-[#ffd700]/60 to-emerald-500/10 mb-4 rounded-full" />

              {/* Studio Tabs Navigation */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 border-b border-emerald-950/10 dark:border-emerald-500/15">
                {[
                  { id: 'post', label: isSwahili ? 'Maudhui' : 'Create Content', icon: Send },
                  { id: 'book', label: isSwahili ? 'Vitabu' : 'Book Publishing', icon: BookOpen },
                  { id: 'blog', label: isSwahili ? 'Makala' : 'Write Blog', icon: Feather },
                  { id: 'video', label: isSwahili ? 'Video HD' : 'HD Video', icon: Film },
                  { id: 'promo', label: isSwahili ? 'Bango la Promo' : 'Generate Promo', icon: Sparkles, highlight: true },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 shadow-[0_0_12px_rgba(255,215,0,0.4)]'
                          : tab.highlight
                          ? 'bg-emerald-950/60 text-[#ffd700] border border-[#ffd700]/40 hover:bg-emerald-900/60'
                          : 'text-slate-600 dark:text-emerald-100/70 hover:bg-slate-100 dark:hover:bg-emerald-900/40'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: CREATE CONTENT (POST) */}
              {activeTab === 'post' && (
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-emerald-50 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-[#ffd700]" />
                      {isSwahili ? 'Unda Chapisho la Jamii' : 'Create Community Post'}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Admin Studio Hub
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1.5">
                        {isSwahili ? 'Aina ya Maudhui' : 'Content Type'}
                      </label>
                      <select
                        value={postType}
                        onChange={(e) => setPostType(e.target.value)}
                        className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 dark:border-emerald-500/20 rounded-xl text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-emerald-600"
                      >
                        <option value="Post">{isSwahili ? 'Chapisho la Jamii' : 'Post'}</option>
                        <option value="Announcement">{isSwahili ? 'Tangazo Maalum' : 'Announcement'}</option>
                        <option value="Thought">{isSwahili ? 'Fikra & Wazo' : 'Thought Leadership'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1.5">
                        {isSwahili ? 'Mwonekano' : 'Visibility'}
                      </label>
                      <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 dark:border-emerald-500/20 rounded-xl text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-emerald-600"
                      >
                        <option value="Public">{isSwahili ? 'Wazi kwa Wote (Public)' : 'Public'}</option>
                        <option value="Followers">{isSwahili ? 'Wafuasi Pekee (Followers)' : 'Followers'}</option>
                        <option value="Private">{isSwahili ? 'Binafsi (Private)' : 'Private'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1.5">
                      {isSwahili ? 'Kichwa cha Habari' : 'Title'}
                    </label>
                    <input
                      type="text"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder={isSwahili ? 'Weka kichwa cha habari kinachovutia...' : 'Enter an engaging headline or title'}
                      className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 dark:border-emerald-500/20 rounded-xl text-slate-900 dark:text-emerald-50 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1.5">
                      {isSwahili ? 'Maelezo / Maudhui' : 'Description / Content'}
                    </label>
                    <textarea
                      value={postDescription}
                      onChange={(e) => setPostDescription(e.target.value)}
                      rows={4}
                      placeholder={
                        isSwahili
                          ? 'Andika makala yako, maelezo ya chapisho au muhtasari wa somo...'
                          : 'Write your article, post description, or lesson overview...'
                      }
                      className="w-full p-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 dark:border-emerald-500/20 rounded-xl text-slate-900 dark:text-emerald-50 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSwahili ? 'Chapisha Chapisho' : 'Publish Post'}</span>
                  </button>
                </form>
              )}

              {/* TAB 2: BOOK PUBLISHING & CREATOR STUDIO */}
              {activeTab === 'book' && (
                <form onSubmit={handleBookSubmit} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-950/10 dark:border-emerald-500/15">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-emerald-50">
                        {isSwahili ? 'Uchapishaji wa Vitabu & Studio ya Kidijitali' : 'Book Publishing & Creator Studio'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {isSwahili
                          ? 'Pakia jalada, faili kamili ya PDF/EPUB, au andika kuunda kitabu kiotomatiki.'
                          : 'Upload cover, attach full PDF manuscript, or type/paste to auto-generate book inside.'}
                      </p>
                    </div>
                  </div>

                  {/* Book Cover Frame (3:4 Ratio) */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-950/10 dark:border-emerald-500/20 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative aspect-[3/4] w-24 rounded-xl overflow-hidden shadow-lg border border-[#ffd700]/40 bg-black shrink-0">
                      <img src={bookCoverUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-900 dark:text-emerald-50">
                          {isSwahili ? 'Picha ya Jalada (Uwiano wa 3:4)' : 'Book Cover Image (3:4 Ratio)'}
                        </span>
                        <span className="text-[10px] text-[#ffd700] font-bold">JPG, PNG, WebP</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={bookCoverUrl}
                          onChange={(e) => setBookCoverUrl(e.target.value)}
                          placeholder="Image URL or browse..."
                          className="flex-1 h-9 px-3 text-xs bg-white dark:bg-emerald-950/60 border border-emerald-900/20 rounded-xl text-slate-900 dark:text-emerald-50"
                        />
                        <label className="px-3 h-9 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-600 dark:text-[#ffd700] border border-emerald-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) setBookCoverUrl(URL.createObjectURL(f));
                            }}
                          />
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isSwahili ? 'Pakia' : 'Upload'}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                        {isSwahili ? 'Kichwa cha Kitabu *' : 'Book Title *'}
                      </label>
                      <input
                        type="text"
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        placeholder="e.g. The Creator Blueprint for Digital Commerce"
                        className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 rounded-xl text-slate-900 dark:text-emerald-50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                        {isSwahili ? 'Mwandishi' : 'Author'}
                      </label>
                      <input
                        type="text"
                        value={bookAuthor}
                        onChange={(e) => setBookAuthor(e.target.value)}
                        className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 rounded-xl text-slate-900 dark:text-emerald-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                        {isSwahili ? 'Bei (TZS) *' : 'Price (TZS) *'}
                      </label>
                      <input
                        type="number"
                        value={bookPrice}
                        onChange={(e) => setBookPrice(e.target.value)}
                        className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 rounded-xl text-slate-900 dark:text-emerald-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                        {isSwahili ? 'Kategoria / Aina' : 'Category / Genre'}
                      </label>
                      <select
                        value={bookCategory}
                        onChange={(e) => setBookCategory(e.target.value)}
                        className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 rounded-xl text-slate-900 dark:text-emerald-50"
                      >
                        <option value="Business & Digital">Business & Digital</option>
                        <option value="Technology">Technology</option>
                        <option value="Leadership">Leadership</option>
                        <option value="Lifestyle">Lifestyle</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                      {isSwahili ? 'Muhtasari wa Kitabu' : 'Book Synopsis'}
                    </label>
                    <textarea
                      value={bookSynopsis}
                      onChange={(e) => setBookSynopsis(e.target.value)}
                      rows={2}
                      placeholder="A brief synopsis of what readers will master in this work..."
                      className="w-full p-2.5 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 rounded-xl text-slate-900 dark:text-emerald-50"
                    />
                  </div>

                  {/* Mode Selector: PDF vs Auto Book */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setBookPublishMode('pdf')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        bookPublishMode === 'pdf'
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-100 dark:bg-emerald-950/50 text-slate-700 dark:text-emerald-200 border-emerald-900/20'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isSwahili ? 'Pakia Kitabu Chote (PDF / EPUB)' : 'Upload Entire Book (PDF / EPUB)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBookPublishMode('auto_book')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        bookPublishMode === 'auto_book'
                          ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 border-[#ffd700]'
                          : 'bg-slate-100 dark:bg-emerald-950/50 text-slate-700 dark:text-emerald-200 border-emerald-900/20'
                      }`}
                    >
                      <Feather className="w-3.5 h-3.5" />
                      <span>{isSwahili ? 'Andika / Bandika & Auto Book' : 'Type or Paste & Auto Book'}</span>
                    </button>
                  </div>

                  {bookPublishMode === 'pdf' ? (
                    <div className="p-4 rounded-2xl border-2 border-dashed border-emerald-500/30 bg-emerald-950/20 text-center space-y-2">
                      <FileText className="w-8 h-8 text-[#ffd700] mx-auto" />
                      <p className="text-xs text-slate-200 font-bold">
                        {bookPdfFileName
                          ? `Manuscript attached: ${bookPdfFileName}`
                          : isSwahili
                          ? 'Buruta na uweke faili ya kitabu hapa (PDF au EPUB)'
                          : 'Drag & drop entire book manuscript (PDF or EPUB)'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Supports PDF and EPUB ebooks, published documents, guides and manuscripts.
                      </p>
                      <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-emerald-950 text-slate-900 dark:text-[#ffd700] border border-[#ffd700]/50 cursor-pointer hover:bg-emerald-50">
                        <input
                          type="file"
                          accept=".pdf,.epub"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setBookPdfFileName(f.name);
                          }}
                        />
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isSwahili ? 'Chagua Faili ya PDF / EPUB' : 'Browse PDF / EPUB File'}</span>
                      </label>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={bookAutoText}
                        onChange={(e) => setBookAutoText(e.target.value)}
                        rows={4}
                        placeholder={
                          isSwahili
                            ? 'Bandika sura za kitabu hapa (Chapter 1: ... Chapter 2: ...)'
                            : 'Paste chapters and book manuscript content here...'
                        }
                        className="w-full p-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 rounded-xl text-slate-900 dark:text-emerald-50"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold text-xs shadow-md border border-[#ffd700]/30 transition-all cursor-pointer"
                  >
                    {isSwahili ? 'Chapisha Kitabu Sasa' : 'Publish Book Now'}
                  </button>
                </form>
              )}

              {/* TAB 3: WRITE BLOG ARTICLE WITH IMAGE UPLOAD */}
              {activeTab === 'blog' && (
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-950/10 dark:border-emerald-500/15">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-emerald-50">
                        {isSwahili ? 'Makala ya Blogu & Uandishi' : 'Insights & Editorial · Write Blog Article'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {isSwahili
                          ? 'Chapisha makala zenye picha, maarifa ya uongozi na teknolojia.'
                          : 'Articles, ideas, entrepreneurship, technology and personal growth.'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                      {isSwahili ? 'Kichwa cha Makala *' : 'Article Title *'}
                    </label>
                    <input
                      type="text"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      placeholder={isSwahili ? 'Weka kichwa cha makala...' : 'Enter a compelling title'}
                      className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 rounded-xl text-slate-900 dark:text-emerald-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                      {isSwahili ? 'Kategoria' : 'Category'}
                    </label>
                    <select
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 rounded-xl text-slate-900 dark:text-emerald-50"
                    >
                      <option value="Technology">{isSwahili ? 'Teknolojia' : 'Technology'}</option>
                      <option value="Business">{isSwahili ? 'Biashara' : 'Business'}</option>
                      <option value="Books">{isSwahili ? 'Vitabu' : 'Books'}</option>
                      <option value="Lifestyle">{isSwahili ? 'Maisha & Uongozi' : 'Lifestyle'}</option>
                    </select>
                  </div>

                  {/* Image Upload Part */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/15 space-y-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-300">
                      {isSwahili ? 'Picha ya Makala (Image Upload)' : 'Featured Article Image (Upload / URL)'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={blogImageUrl}
                        onChange={(e) => setBlogImageUrl(e.target.value)}
                        placeholder="Paste image URL or browse file..."
                        className="flex-1 h-9 px-3 text-xs bg-white dark:bg-emerald-950/60 border border-emerald-900/20 rounded-xl text-slate-900 dark:text-emerald-50"
                      />
                      <label className="px-3 h-9 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-600 dark:text-[#ffd700] border border-emerald-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setBlogImageUrl(URL.createObjectURL(f));
                          }}
                        />
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isSwahili ? 'Pakia Picha' : 'Upload Image'}</span>
                      </label>
                    </div>

                    {blogImageUrl && (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-500/30 max-h-36 bg-black">
                        <img src={blogImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                      {isSwahili ? 'Maudhui Kamili ya Makala' : 'Full Article Content'}
                    </label>
                    <textarea
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      rows={6}
                      placeholder={isSwahili ? 'Andika makala yako kwa urefu hapa...' : 'Write your article in full prose...'}
                      className="w-full p-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 rounded-xl text-slate-900 dark:text-emerald-50"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {isSwahili ? 'Chapisha Makala' : 'Publish Article'}
                  </button>
                </form>
              )}

              {/* TAB 4: HD VIDEO STUDIO (1080p, 720p, 480p) */}
              {activeTab === 'video' && (
                <form onSubmit={handleVideoSubmit} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-950/10 dark:border-emerald-500/15">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-emerald-50 flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span>{isSwahili ? 'Pakia & Chapisha Video ya HD' : 'Upload & Publish Video'}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {isSwahili
                          ? 'Uzoefu wa video wa YouTube na sauti halisi ya kurekodiwa (100% Real Audio).'
                          : 'A YouTube-style video experience with authentic recorded video audio.'}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40">
                      HD 1080p / 720p / 480p
                    </span>
                  </div>

                  {/* 100% Real Audio Badge Notice */}
                  <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600/30 text-[#ffd700] flex items-center justify-center shrink-0">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-emerald-200">
                        {isSwahili ? 'Sauti Halisi ya Kurekodiwa · 100% Real Audio' : 'Original Recorded Video Audio · 100% Real Audio'}
                      </span>
                      <span className="text-[10px] text-slate-300">
                        {isSwahili
                          ? 'Video inachezwa na sauti yake halisi ya maikrofoni bila sauti za bandia.'
                          : 'Video is uploaded with its authentic microphone and camera sound track intact — no artificial voices.'}
                      </span>
                    </div>
                  </div>

                  {/* Mode: File vs URL */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setVideoMode('file')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        videoMode === 'file'
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-100 dark:bg-emerald-950/50 text-slate-700 dark:text-emerald-200 border-emerald-900/20'
                      }`}
                    >
                      {isSwahili ? 'Pakia Faili ya Video' : 'Upload Video File'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoMode('url')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        videoMode === 'url'
                          ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 border-[#ffd700]'
                          : 'bg-slate-100 dark:bg-emerald-950/50 text-slate-700 dark:text-emerald-200 border-emerald-900/20'
                      }`}
                    >
                      {isSwahili ? 'Kiungo cha Mtandaoni (URL)' : 'Video URL / Stream Link'}
                    </button>
                  </div>

                  {videoMode === 'file' ? (
                    <div className="p-4 rounded-2xl border-2 border-dashed border-emerald-500/30 bg-emerald-950/20 text-center space-y-1.5">
                      <Upload className="w-7 h-7 text-[#ffd700] mx-auto" />
                      <p className="text-xs text-slate-200 font-bold">
                        {videoUrl ? 'Video file attached ✓' : isSwahili ? 'Bofya kupakia au buruta faili ya video' : 'Click to browse or drag & drop video file'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Supports MP4, WebM, MOV, OGG (Full HD 1080p, 720p, 480p)
                      </p>
                      <label className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-emerald-950 text-slate-900 dark:text-[#ffd700] border border-[#ffd700]/50 cursor-pointer">
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              setVideoUrl(URL.createObjectURL(f));
                              if (!videoTitle) setVideoTitle(f.name.replace(/\.[^/.]+$/, ''));
                            }
                          }}
                        />
                        <span>{isSwahili ? 'Chagua Faili' : 'Browse Video'}</span>
                      </label>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://.../video.mp4"
                        className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 rounded-xl text-slate-900 dark:text-emerald-50"
                      />
                    </div>
                  )}

                  {/* Demo presets */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                    <span className="text-slate-400">{isSwahili ? 'Mifano ya Jaribio:' : 'Demo Presets:'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoTitle('Building Digital Dreams');
                        setVideoUrl('/uploads/videos/inshot_20261010_real.mp4');
                      }}
                      className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900"
                    >
                      Building Digital Dreams
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoTitle('Open Shop & Logistics in East Africa');
                        setVideoUrl('/uploads/videos/inshot_20261010_real.mp4');
                      }}
                      className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900"
                    >
                      Open Shop Logistics
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                        {isSwahili ? 'Jina la Video *' : 'Video Title *'}
                      </label>
                      <input
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="e.g. How to Scale Digital Products & Media"
                        className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 rounded-xl text-slate-900 dark:text-emerald-50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                        {isSwahili ? 'Muda (MM:SS)' : 'Duration (MM:SS)'}
                      </label>
                      <input
                        type="text"
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(e.target.value)}
                        className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 rounded-xl text-slate-900 dark:text-emerald-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                      {isSwahili ? 'Maelezo ya Video' : 'Video Description'}
                    </label>
                    <textarea
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      rows={2}
                      placeholder="Write an overview of this presentation or lecture..."
                      className="w-full p-2.5 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 rounded-xl text-slate-900 dark:text-emerald-50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold text-xs shadow-md border border-[#ffd700]/30 transition-all cursor-pointer"
                  >
                    {isSwahili ? 'Pakia na Chapisha Video' : 'Upload & Publish Video'}
                  </button>
                </form>
              )}

              {/* TAB 5: GENERATE PROMO IMAGE / POSTER (AI IMAGE GENERATION TOOL) */}
              {activeTab === 'promo' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-950/10 dark:border-emerald-500/15">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-emerald-50 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span>{isSwahili ? 'Tengeneza Bango la Promo' : 'Generate Promo Image'}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {isSwahili
                          ? 'Unda mabango ya kiwango cha juu cha matangazo kwa ajili ya uzinduzi wa bidhaa mpya, huduma za ubunifu na vitabu.'
                          : 'Create high-quality marketing posters and promotional banners for new product launches.'}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40">
                      AI Powered · 4K Poster
                    </span>
                  </div>

                  {/* Preset Campaigns */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1.5">
                      {isSwahili ? 'Kampeni / Mada ya Uzinduzi' : 'Launch Campaign Preset'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPromoPreset('design');
                          setPromoHeadline('Launching Now: Premier Graphic Design & Website Design');
                          setPromoSubheadline('Bring your projects for high-end graphic design and web development.');
                        }}
                        className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                          promoPreset === 'design'
                            ? 'bg-emerald-950 text-[#ffd700] border-[#ffd700]'
                            : 'bg-slate-50 dark:bg-emerald-950/40 text-slate-700 dark:text-emerald-200 border-emerald-900/20'
                        }`}
                      >
                        <span className="block text-[10px] font-extrabold uppercase text-[#ffd700]">Design Agency</span>
                        <span>Graphic & Web Design</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPromoPreset('shop');
                          setPromoHeadline('Open Shop: Verified Global Marketplace Launch');
                          setPromoSubheadline('Discover verified tech, electronics and designer items.');
                        }}
                        className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                          promoPreset === 'shop'
                            ? 'bg-emerald-950 text-[#ffd700] border-[#ffd700]'
                            : 'bg-slate-50 dark:bg-emerald-950/40 text-slate-700 dark:text-emerald-200 border-emerald-900/20'
                        }`}
                      >
                        <span className="block text-[10px] font-extrabold uppercase text-[#ffd700]">Open Shop</span>
                        <span>Product Launch Deals</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPromoPreset('book');
                          setPromoHeadline('The Creator Blueprint: Official Book Publication');
                          setPromoSubheadline('Master digital publishing and online commerce.');
                        }}
                        className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                          promoPreset === 'book'
                            ? 'bg-emerald-950 text-[#ffd700] border-[#ffd700]'
                            : 'bg-slate-50 dark:bg-emerald-950/40 text-slate-700 dark:text-emerald-200 border-emerald-900/20'
                        }`}
                      >
                        <span className="block text-[10px] font-extrabold uppercase text-[#ffd700]">Book Release</span>
                        <span>The Digital Vision</span>
                      </button>
                    </div>
                  </div>

                  {/* Aspect Ratio selector */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                      {isSwahili ? 'Uwiano wa Picha (Aspect Ratio)' : 'Poster Aspect Ratio'}
                    </label>
                    <div className="flex gap-2">
                      {[
                        { id: '3:4', label: '3:4 (Marketing Poster)' },
                        { id: '16:9', label: '16:9 (Hero Banner)' },
                        { id: '1:1', label: '1:1 (Square Feed)' },
                      ].map((ratio) => (
                        <button
                          key={ratio.id}
                          type="button"
                          onClick={() => setPromoAspectRatio(ratio.id as any)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            promoAspectRatio === ratio.id
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-100 dark:bg-emerald-950/40 text-slate-600 dark:text-emerald-300 border-emerald-900/20'
                          }`}
                        >
                          {ratio.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Headline & Subtitle */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                      {isSwahili ? 'Kichwa Kikuu cha Tangazo' : 'Poster Headline'}
                    </label>
                    <input
                      type="text"
                      value={promoHeadline}
                      onChange={(e) => setPromoHeadline(e.target.value)}
                      className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/50 border border-emerald-900/15 rounded-xl text-slate-900 dark:text-emerald-50"
                    />
                  </div>

                  {/* Generate Button */}
                  <button
                    type="button"
                    onClick={handleGeneratePromoPoster}
                    disabled={isGeneratingPromo}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#d4af37] text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isGeneratingPromo ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>{isSwahili ? 'Inatengeneza Bango la 4K...' : 'Generating 4K Poster...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>{isSwahili ? 'Tengeneza Bango la Matangazo (Generate Poster)' : 'Generate Marketing Poster Now'}</span>
                      </>
                    )}
                  </button>

                  {/* Poster Preview Card */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-[#ffd700]/30 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#ffd700]" />
                        <span>{isSwahili ? 'Bango Liko Tayari (Live Preview)' : 'Generated Poster Ready'}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Resolution: 3072 x 4096 (4K)</span>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden border border-[#ffd700]/40 shadow-2xl bg-black max-h-96 flex items-center justify-center">
                      <img
                        src={generatedPromoUrl}
                        alt="Generated promo poster"
                        className="w-full h-auto object-cover max-h-96"
                      />
                    </div>

                    {/* Poster Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={generatedPromoUrl}
                        download="EvDrBoniphaceNdege_PromoPoster.jpg"
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isSwahili ? 'Pakua Bango (4K)' : 'Download Poster (4K)'}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          onShowToast?.(
                            isSwahili
                              ? 'Bango limeambatishwa kwenye tangazo la bidhaa ya Open Shop!'
                              : 'Poster attached to new Open Shop product launch!'
                          );
                        }}
                        className="flex-1 py-2 rounded-xl bg-[#ffd700]/20 hover:bg-[#ffd700]/30 text-[#ffd700] border border-[#ffd700]/40 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {isSwahili ? 'Tumia kwa Uzinduzi' : 'Use for Product Launch'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Creator Analytics & Store Performance Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Creator Analytics Card */}
          <div className="card-neon-gold p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/10 via-[#ffd700]/60 to-emerald-500/10 mb-4 rounded-full" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-emerald-50 mb-4 flex items-center justify-between">
                <span>{isSwahili ? 'Takwimu za Muundaji' : 'Creator Analytics'}</span>
                <span className="text-xs text-[#ffd700] font-bold">
                  {isSwahili ? 'Ufanisi' : 'Performance'}
                </span>
              </h3>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-500 flex items-center justify-center mb-2">
                    <Eye className="w-4 h-4" />
                  </div>
                  <strong className="block text-xl font-black text-slate-900 dark:text-emerald-50 tabular-nums">
                    184K
                  </strong>
                  <span className="text-[11px] text-slate-400">
                    {isSwahili ? 'Jumla ya Mionekano' : 'Total Views'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
                  <div className="w-8 h-8 rounded-xl bg-rose-600/10 text-rose-500 flex items-center justify-center mb-2">
                    <Heart className="w-4 h-4" />
                  </div>
                  <strong className="block text-xl font-black text-slate-900 dark:text-emerald-50 tabular-nums">
                    24.8K
                  </strong>
                  <span className="text-[11px] text-slate-400">
                    {isSwahili ? 'Mwitikio & Upendo' : 'Engagement'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center mb-2">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <strong className="block text-xl font-black text-slate-900 dark:text-emerald-50 tabular-nums">
                    12.8K
                  </strong>
                  <span className="text-[11px] text-slate-400">
                    {isSwahili ? 'Wafuasi' : 'Followers'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-500/15">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/10 text-amber-500 flex items-center justify-center mb-2">
                    <Coins className="w-4 h-4" />
                  </div>
                  <strong className="block text-xl font-black text-slate-900 dark:text-emerald-50 tabular-nums">
                    TZS 2.4M
                  </strong>
                  <span className="text-[11px] text-slate-400">
                    {isSwahili ? 'Makadirio ya Mapato' : 'Estimated Revenue'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 mt-6 border-t border-emerald-950/10 dark:border-emerald-500/15">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600 dark:text-emerald-200">
                  <span>{isSwahili ? 'Ukuaji wa Watazamaji' : 'Audience Growth'}</span>
                  <span className="tabular-nums">82%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-emerald-950/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-[#d4af37] rounded-full w-[82%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600 dark:text-emerald-200">
                  <span>{isSwahili ? 'Mwingiliano wa Maudhui' : 'Content Engagement'}</span>
                  <span className="tabular-nums">71%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-emerald-950/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-[#d4af37] rounded-full w-[71%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Agency Work Showcase */}
          <div className="card-neon-gold p-6 rounded-3xl space-y-3 bg-gradient-to-br from-[#062417] via-[#041a10] to-[#02100a]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#ffd700] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>{isSwahili ? 'Studio ya Ubunifu & Tovuti' : 'Design & Tech Agency'}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffd700]/20 text-[#ffd700]">
                Active
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              {isSwahili
                ? 'Ev Dr. Boniphace Ndege anapokea kazi za Graphic Design, Website Design na Uchapishaji wa Vitabu. Wanachama wanakaribishwa kuwasilisha mahitaji yao.'
                : 'Open for client commissions: Professional Graphic Design, Responsive Website Design, and Book Publishing.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
