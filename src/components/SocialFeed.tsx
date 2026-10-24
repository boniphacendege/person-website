import React, { useState, useRef } from 'react';
import {
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  CheckCircle2,
  Send,
  Sparkles,
  Users,
  ExternalLink,
  Search,
  Check,
  UserPlus,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { Post } from '../types';

interface SocialFeedProps {
  posts: Post[];
  profileAvatar?: string;
  profileName?: string;
  onOpenCreatePost: () => void;
  onLikePost: (id: string) => void;
  onSavePost: (id: string) => void;
  onCommentPost: (id: string, text: string) => void;
  onSharePost: (post: Post) => void;
  onFollowUser: (name: string) => void;
  onOpenMemberProfile?: (name: string) => void;
  onOpenCommunityFollowers?: () => void;
  language?: string;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  posts,
  profileAvatar,
  profileName = 'Ev Dr. Boniphace J. Ndege',
  onOpenCreatePost,
  onLikePost,
  onSavePost,
  onCommentPost,
  onSharePost,
  onFollowUser,
  onOpenMemberProfile,
  onOpenCommunityFollowers,
  language = 'English',
}) => {
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [followedPeople, setFollowedPeople] = useState<Record<string, boolean>>({
    'David Michael': true,
    'Grace Writer': true,
    'Global Seller Support': true,
    'Sarah James': true,
    'Ev Dr. Boniphace J. Ndege': true,
  });
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberActiveTab, setMemberActiveTab] = useState<'all' | 'following' | 'verified'>('all');
  const memberListScrollRef = useRef<HTMLDivElement>(null);

  const scrollMemberList = (direction: 'up' | 'down') => {
    if (memberListScrollRef.current) {
      memberListScrollRef.current.scrollBy({
        top: direction === 'down' ? 300 : -300,
        behavior: 'smooth',
      });
    }
  };

  const isSwahili = language === 'Swahili';

  const handleFollowClick = (personName: string) => {
    setFollowedPeople((prev) => ({
      ...prev,
      [personName]: !prev[personName],
    }));
    onFollowUser(personName);
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onCommentPost(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <section id="posts" className="py-12 max-w-7xl mx-auto px-4 border-t border-emerald-950/10 dark:border-emerald-500/15">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-emerald-50 tracking-tight font-editorial">
            {isSwahili ? 'Machapisho ya Hivi Karibuni' : 'Latest Posts'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1">
            {isSwahili
              ? 'Mawazo, habari, hadithi na mazungumzo ya jamii.'
              : 'Thoughts, updates, stories and community conversations.'}
          </p>
        </div>

        <button
          onClick={onOpenCreatePost}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {isSwahili ? 'Tunga Chapisho' : 'Create Post'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed Column */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-6">
          {posts.map((post) => {
            const isCommentsOpen = activeCommentPostId === post.id;
            return (
              <article
                key={post.id}
                className="card-neon-gold rounded-3xl overflow-hidden"
              >
                {/* Subtle gold-green neon top rim */}
                <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/10 via-[#ffd700]/60 to-emerald-500/10" />

                {/* Post Header */}
                <div className="p-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative p-0.5 rounded-full bg-gradient-to-br from-[#ffd700] to-emerald-500 shadow-[0_0_8px_rgba(5,150,105,0.35)]">
                      <img
                        src={
                          ((post.authorName === profileName ||
                            post.authorName?.toLowerCase().includes('boniphace') ||
                            post.authorHandle?.toLowerCase().includes('boniphace')) &&
                          profileAvatar
                            ? profileAvatar
                            : post.authorAvatar || profileAvatar) || '/src/assets/images/boniphace_avatar_1791315268492.jpg'
                        }
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full object-cover object-center"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50">
                          {post.authorName}
                        </strong>
                        {post.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#ffd700]" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-emerald-400/70 flex items-center gap-1">
                        <span>{post.createdAt}</span>
                        <span className="text-[#ffd700]">·</span>
                        <span className="text-emerald-700 dark:text-[#ffd700] font-semibold">
                          {isSwahili && post.tagSwahili ? post.tagSwahili : post.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Body */}
                <div className="px-5 pb-4">
                  {(post.title || post.titleSwahili) && (
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-emerald-50 mb-2 leading-snug">
                      {isSwahili && post.titleSwahili ? post.titleSwahili : post.title}
                    </h3>
                  )}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/80 leading-relaxed">
                    {isSwahili && post.contentSwahili ? post.contentSwahili : post.content}
                  </p>
                </div>

                {/* Optional Post Image - Fitted into card with selected ratio */}
                {post.imageUrl && (
                  <div className={`relative w-full bg-slate-100 dark:bg-emerald-950/50 overflow-hidden ${
                    post.imageAspectRatio === '1:1'
                      ? 'aspect-square max-h-[500px]'
                      : 'aspect-video sm:h-80'
                  }`}>
                    <img
                      src={post.imageUrl || undefined}
                      alt={post.title || 'Post asset'}
                      className="w-full h-full object-cover hover:scale-101 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Action Bar */}
                <div className="px-4 py-3 border-t border-emerald-950/10 dark:border-emerald-500/15 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-emerald-300/70">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors ${
                      post.isLiked ? 'text-rose-600 dark:text-rose-400' : ''
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        post.isLiked ? 'fill-rose-600 text-rose-600 dark:fill-rose-400' : ''
                      }`}
                    />
                    <span className="tabular-nums">{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveCommentPostId(isCommentsOpen ? null : post.id)
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="tabular-nums">{post.commentsCount}</span>
                  </button>

                  <button
                    onClick={() => onSharePost(post)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{isSwahili ? 'Gawa' : 'Share'}</span>
                  </button>

                  <button
                    onClick={() => onSavePost(post.id)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors ${
                      post.isSaved ? 'text-amber-500' : ''
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${post.isSaved ? 'fill-amber-500' : ''}`}
                    />
                    <span>{post.isSaved ? (isSwahili ? 'Imehifadhiwa' : 'Saved') : (isSwahili ? 'Hifadhi' : 'Save')}</span>
                  </button>
                </div>

                {/* Comments Section Drawer */}
                {isCommentsOpen && (
                  <div className="p-4 bg-slate-50 dark:bg-[#09150e] border-t border-emerald-950/10 dark:border-emerald-500/15 space-y-3">
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {post.comments.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-start gap-2.5 p-2.5 bg-white dark:bg-[#0e1d15] rounded-xl text-xs"
                          >
                            <div
                              className="cursor-pointer shrink-0"
                              onClick={() => {
                                if (c.author !== profileName && !c.author?.toLowerCase().includes('boniphace')) {
                                  onOpenMemberProfile?.(c.author);
                                }
                              }}
                              title={isSwahili ? `Tazama wasifu wa ${c.author}` : `View ${c.author}'s profile`}
                            >
                              <img
                                src={
                                  ((c.author === profileName ||
                                    c.author?.toLowerCase().includes('boniphace')) &&
                                  profileAvatar
                                    ? profileAvatar
                                    : c.avatar || profileAvatar) || '/src/assets/images/boniphace_avatar_1791315268492.jpg'
                                }
                                alt={c.author}
                                className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/20 hover:ring-[#ffd700] transition-all"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <strong
                                  className="font-bold text-slate-800 dark:text-emerald-100 hover:text-[#ffd700] cursor-pointer transition-colors"
                                  onClick={() => {
                                    if (c.author !== profileName && !c.author?.toLowerCase().includes('boniphace')) {
                                      onOpenMemberProfile?.(c.author);
                                    }
                                  }}
                                >
                                  {c.author}
                                </strong>
                                <span className="text-[10px] text-slate-400">
                                  {c.time}
                                </span>
                              </div>
                              <p className="text-slate-600 dark:text-emerald-200/80 mt-0.5">
                                {c.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-2">
                        {isSwahili
                          ? 'Hakuna maoni bado. Kuwa wa kwanza kutoa maoni yako!'
                          : 'No comments yet. Be the first to share your thoughts!'}
                      </p>
                    )}

                    {/* New Comment Input - Fits neatly into card */}
                    <div className="flex items-center bg-slate-50 dark:bg-[#07120d] border border-emerald-900/15 dark:border-emerald-500/25 rounded-2xl p-1 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all pt-1">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendComment(post.id);
                        }}
                        placeholder={isSwahili ? 'Andika maoni yako...' : 'Write a comment...'}
                        className="flex-1 min-w-0 bg-transparent px-3 py-1.5 text-xs text-slate-900 dark:text-emerald-50 placeholder-slate-400 focus:outline-none"
                      />
                      <button
                        onClick={() => handleSendComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                        className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1 shrink-0 transition-all active:scale-95 shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">{isSwahili ? 'Tuma' : 'Send'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Right Column: Wide Profile & Members Section */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-6">
          {/* Community Followers & Member Profiles Container */}
          <div className="card-neon-gold p-5 sm:p-6 rounded-3xl border-2 border-emerald-500/30 shadow-[0_0_35px_rgba(5,150,105,0.18)] bg-[#04140b]/90">
            {/* Header */}
            <div className="pb-4 mb-4 border-b border-emerald-500/20">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#ffd700] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
                  {isSwahili ? 'Jamii ya Wafuasi & Wasifu wa Wanachama' : 'Community Followers & Member Profiles'}
                </span>
                {onOpenCommunityFollowers && (
                  <button
                    type="button"
                    onClick={onOpenCommunityFollowers}
                    className="text-[11px] font-bold text-emerald-400 hover:text-[#ffd700] transition-colors cursor-pointer"
                  >
                    {isSwahili ? 'Fungua Yote' : 'Expand'}
                  </button>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-editorial tracking-tight">
                {isSwahili ? 'Wasifu wa Jamii ya Ev Dr. Boniphace J. Ndege' : 'Ev Dr. Boniphace J. Ndege Community Profiles'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-emerald-200/80 mt-1 leading-relaxed">
                {isSwahili
                  ? 'Wanachama wote waliojisajili na wanaomfuata Ev Dr. Boniphace J. Ndege. Kila mwanachama ana wasifu halisi, picha zao wazi na uwezo wa kufuatana wenyewe kwa wenyewe.'
                  : 'All registered community members and followers of Ev Dr. Boniphace J. Ndege. Each member has their own dedicated profile, clear imagery, and mutual follow capabilities.'}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative mb-3.5">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                placeholder={isSwahili ? 'Tafuta mwanachama, jina, eneo...' : 'Search members, role, city...'}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl text-xs bg-black/50 dark:bg-black/60 border border-emerald-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-[#ffd700] transition-all"
              />
            </div>

            {/* Filter Tabs & Easy Scroll Controls */}
            {(() => {
              const allCommunityMembers = [
                {
                  badge: 'Verified Merchant',
                  name: 'David Michael',
                  handle: '@davidmichael',
                  role: 'Seller & Partner',
                  bio: 'Verified Open Shop electronics merchant based in Arusha. Supplying certified tech gear, accessories and hardware with fast nationwide delivery.',
                  followers: '12.4K Followers',
                  location: 'Arusha, Tanzania',
                  banner: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                  badgeColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40',
                },
                {
                  badge: 'Active Author',
                  name: 'Grace Writer',
                  handle: '@gracewriter',
                  role: 'Author & Member',
                  bio: 'Author, digital publisher and passionate member of Ev Dr. Boniphace J. Ndege’s readers forum. Passionate about personal growth and community development.',
                  followers: '5.7K Followers',
                  location: 'Dar es Salaam, Tanzania',
                  banner: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                  badgeColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40',
                },
                {
                  badge: 'Support Operations',
                  name: 'Global Seller Support',
                  handle: '@openshopsupport',
                  role: 'Open Shop Operations',
                  bio: 'Official merchant compliance, catalog vetting, and Open Shop seller onboarding desk. Committed to secure, trustworthy e-commerce transactions.',
                  followers: '891 Followers',
                  location: 'Zanzibar, Tanzania',
                  banner: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
                  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
                  badgeColor: 'bg-blue-500/25 text-blue-300 border-blue-500/40',
                },
                {
                  badge: 'VIP Buyer',
                  name: 'Sarah James',
                  handle: '@sarahjames',
                  role: 'Creator & Buyer',
                  bio: 'Creative writer, digital buyer and regular participant in live broadcasts. Inspired by African digital entrepreneurship.',
                  followers: '8.4K Followers',
                  location: 'Dodoma, Tanzania',
                  banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
                  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
                  badgeColor: 'bg-purple-500/25 text-purple-300 border-purple-500/40',
                },
                {
                  badge: 'Admin',
                  isYourProfile: true,
                  name: 'Ev Dr. Boniphace J. Ndege',
                  handle: '@boniphacendege',
                  role: 'Founder & Author',
                  bio: 'Visionary founder, published author, digital entrepreneur, and senior software engineer behind the community platform.',
                  followers: '45.2K Followers',
                  location: 'Dar es Salaam, Tanzania',
                  banner: '/src/assets/images/boniphace_banner_1791315259974.jpg',
                  avatar: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
                  badgeColor: 'bg-[#ffd700]/25 text-[#ffd700] border-[#ffd700]/50 font-black',
                },
              ];

              const totalCount = allCommunityMembers.length;
              const followingCount = allCommunityMembers.filter(
                (m) => !m.isYourProfile && followedPeople[m.name]
              ).length;

              const filteredCommunityMembers = allCommunityMembers.filter((m) => {
                const query = memberSearchQuery.toLowerCase().trim();
                const matches =
                  !query ||
                  m.name.toLowerCase().includes(query) ||
                  m.handle.toLowerCase().includes(query) ||
                  m.role.toLowerCase().includes(query) ||
                  m.location.toLowerCase().includes(query) ||
                  m.bio.toLowerCase().includes(query);

                if (!matches) return false;

                if (memberActiveTab === 'following') {
                  return Boolean(followedPeople[m.name]);
                }
                if (memberActiveTab === 'verified') {
                  return m.badge.includes('Verified') || m.badge.includes('Author') || m.badge === 'Admin' || m.isYourProfile;
                }
                return true;
              });

              return (
                <>
                  <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-emerald-950/40">
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full">
                      <button
                        type="button"
                        onClick={() => setMemberActiveTab('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          memberActiveTab === 'all'
                            ? 'bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-slate-950 font-black shadow-sm'
                            : 'bg-black/40 text-slate-300 hover:text-white border border-white/10'
                        }`}
                      >
                        {isSwahili ? `Wote (${totalCount})` : `All (${totalCount})`}
                      </button>

                      <button
                        type="button"
                        onClick={() => setMemberActiveTab('following')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          memberActiveTab === 'following'
                            ? 'bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-slate-950 font-black shadow-sm'
                            : 'bg-black/40 text-slate-300 hover:text-white border border-white/10'
                        }`}
                      >
                        {isSwahili ? `Unaowafuata (${followingCount})` : `Following (${followingCount})`}
                      </button>

                      <button
                        type="button"
                        onClick={() => setMemberActiveTab('verified')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          memberActiveTab === 'verified'
                            ? 'bg-gradient-to-r from-[#ffd700] to-[#d4af37] text-slate-950 font-black shadow-sm'
                            : 'bg-black/40 text-slate-300 hover:text-white border border-white/10'
                        }`}
                      >
                        {isSwahili ? 'Waliothibitishwa' : 'Verified'}
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Members List: Smoothly scroll up and down all lists */}
                  <div
                    ref={memberListScrollRef}
                    className="max-h-[720px] overflow-y-auto space-y-4 pr-1 scroll-smooth"
                  >
                    {filteredCommunityMembers.length === 0 ? (
                      <div className="py-10 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto text-emerald-600 mb-2 opacity-50" />
                        <p className="text-xs">
                          {isSwahili ? 'Hakuna mwanachama aliyepatikana.' : 'No members found matching your search.'}
                        </p>
                      </div>
                    ) : (
                      filteredCommunityMembers.map((member) => {
                        const isFollowed = followedPeople[member.name];
                        return (
                          <div
                            key={member.name}
                            className="p-4 sm:p-5 rounded-3xl bg-white/70 dark:bg-[#071910] border border-slate-200 dark:border-emerald-500/25 hover:border-[#ffd700]/60 transition-all shadow-md group/card flex flex-col sm:flex-row items-start gap-4"
                          >
                            {/* Profile Image Wide into Medium Square Box */}
                            <div
                              className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 aspect-square rounded-2xl overflow-hidden shrink-0 ring-2 ring-emerald-500/40 border-2 border-[#ffd700]/70 group-hover/card:border-[#ffd700] shadow-xl cursor-pointer bg-black/60 self-center sm:self-start"
                              onClick={() => onOpenMemberProfile?.(member.name)}
                            >
                              <img
                                src={member.avatar || '/src/assets/images/boniphace_avatar_1791315268492.jpg'}
                                alt={member.name}
                                className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-500 filter contrast-105 brightness-105"
                              />
                              <span className="absolute bottom-1.5 right-1.5 p-1 bg-emerald-600 rounded-full text-white shadow-md">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#ffd700]" />
                              </span>
                            </div>

                            {/* Card Content & Mutual Follow Capability */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between h-full w-full">
                              {/* Top Row: Badge, Name & Follow Button */}
                              <div className="mb-2">
                                <span className="inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/40 border border-emerald-500/30 text-[#ffd700] mb-1.5">
                                  {member.badge}
                                </span>
                                <div className="flex items-start justify-between gap-2">
                                  <div
                                    className="cursor-pointer min-w-0"
                                    onClick={() => onOpenMemberProfile?.(member.name)}
                                  >
                                    <h4 className="font-black text-base text-slate-900 dark:text-white hover:text-[#ffd700] transition-colors truncate">
                                      {member.name}
                                    </h4>
                                    <div className="text-xs text-slate-500 dark:text-emerald-300/90 font-medium mt-0.5">
                                      <span className="text-emerald-400 font-semibold">{member.handle}</span>
                                      <span className="mx-1.5">·</span>
                                      <span>{member.role}</span>
                                    </div>
                                  </div>

                                  {/* Follow Button / Your Profile */}
                                  {member.isYourProfile ? (
                                    <span className="text-[11px] font-black text-[#ffd700] bg-black/60 px-3 py-1 rounded-xl border border-[#ffd700]/40 shadow-xs shrink-0">
                                      {isSwahili ? 'Wasifu Wako' : 'Your Profile'}
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleFollowClick(member.name)}
                                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm active:scale-95 ${
                                        isFollowed
                                          ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40 hover:bg-slate-700'
                                          : 'bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#d4af37] text-slate-950 font-black shadow-[0_0_10px_rgba(255,215,0,0.35)]'
                                      }`}
                                    >
                                      {isFollowed ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                          <span>{isSwahili ? 'Unafuata' : 'Following'}</span>
                                        </>
                                      ) : (
                                        <>
                                          <UserPlus className="w-3.5 h-3.5" />
                                          <span>{isSwahili ? 'Fuata' : 'Follow'}</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Bio Description */}
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3 line-clamp-3">
                                {member.bio}
                              </p>

                              {/* Stats & View Profile Action */}
                              <div className="pt-2.5 border-t border-slate-200 dark:border-emerald-950/80 flex items-center justify-between text-xs text-slate-400">
                                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                  <span className="font-semibold text-slate-900 dark:text-white">{member.followers}</span>
                                  <span>·</span>
                                  <span className="flex items-center gap-1 text-slate-300">
                                    <MapPin className="w-3 h-3 text-[#ffd700]" />
                                    {member.location}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => onOpenMemberProfile?.(member.name)}
                                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-emerald-950/70 hover:bg-emerald-900/70 text-slate-800 dark:text-[#ffd700] hover:text-white border border-[#ffd700]/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                                >
                                  <span>{isSwahili ? 'Tazama Wasifu' : 'View Profile'}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              );
            })()}

            {/* View All Community Profiles Modal Button */}
            {onOpenCommunityFollowers && (
              <button
                type="button"
                onClick={onOpenCommunityFollowers}
                className="w-full mt-4 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-950/80 to-[#041d11] hover:from-emerald-900 hover:to-emerald-800 text-xs font-bold text-[#ffd700] border border-[#ffd700]/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                <Users className="w-4 h-4 text-[#ffd700]" />
                <span>{isSwahili ? 'Tazama Wafuasi & Wanachama Wote' : 'View All Community Profiles'}</span>
              </button>
            )}
          </div>

          {/* Trending Topics */}
          <div className="card-neon-gold p-6 rounded-3xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ffd700] shadow-[0_0_6px_rgba(255,215,0,0.6)]" />
              {isSwahili ? 'Mada Zinazovuma' : 'Trending Topics'}
            </h3>
            <div className="space-y-2 text-xs font-semibold text-slate-500 dark:text-emerald-300/70">
              {(isSwahili
                ? [
                    '#SokoLaDunia',
                    '#WaundajiWaKidijitali',
                    '#VitabuNaUchapishaji',
                    '#BiasharaMtandaoni',
                    '#EvDrBoniphaceJNdege',
                  ]
                : [
                    '#GlobalShopping',
                    '#DigitalCreators',
                    '#BooksAndPublishing',
                    '#OnlineBusinessAfrica',
                    '#EvDrBoniphaceJNdege',
                  ]
              ).map((tag) => (
                <div
                  key={tag}
                  className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
