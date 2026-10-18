import React, { useState } from 'react';
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
  const [followedPeople, setFollowedPeople] = useState<Record<string, boolean>>({});
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
    <section id="posts" className="py-12 max-w-6xl mx-auto px-4 border-t border-emerald-950/10 dark:border-emerald-500/15">
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {isSwahili ? 'Tunga Chapisho' : 'Create Post'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-6">
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

                {/* Optional Post Image */}
                {post.imageUrl && (
                  <div className="relative h-72 sm:h-80 w-full bg-slate-100 dark:bg-emerald-950/50 overflow-hidden">
                    <img
                      src={post.imageUrl || undefined}
                      alt={post.title || 'Post asset'}
                      className="w-full h-full object-cover"
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

        {/* Right Sidebar Columns */}
        <div className="space-y-6">
          {/* People You May Know */}
          <div className="card-neon-gold p-6 rounded-3xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ffd700]" />
              {isSwahili ? 'Watu Unaoweza Kuwafahamu' : 'People You May Know'}
            </h3>

            <div className="space-y-4">
              {[
                {
                  name: 'Sarah James',
                  role: isSwahili ? 'Muundaji · Wafuasi 8.4K' : 'Creator · 8.4K followers',
                  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                },
                {
                  name: 'David Michael',
                  role: isSwahili ? 'Muuzaji · Wafuasi 12K' : 'Seller · 12K followers',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                },
                {
                  name: 'Grace Writer',
                  role: isSwahili ? 'Mwandishi · Wafuasi 5.7K' : 'Author · 5.7K followers',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                },
              ].map((person) => {
                const isFollowed = followedPeople[person.name];
                return (
                  <div
                    key={person.name}
                    className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-emerald-500/5 transition-all"
                  >
                    <div
                      className="flex items-center gap-3 min-w-0 cursor-pointer"
                      onClick={() => onOpenMemberProfile?.(person.name)}
                      title={isSwahili ? `Tazama wasifu wa ${person.name}` : `View ${person.name}'s profile`}
                    >
                      <img
                        src={person.avatar || '/src/assets/images/boniphace_avatar_1791315268492.jpg'}
                        alt={person.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-emerald-500/30"
                      />
                      <div className="min-w-0">
                        <strong className="block text-xs font-bold text-slate-900 dark:text-emerald-50 truncate hover:text-[#ffd700] transition-colors">
                          {person.name}
                        </strong>
                        <span className="block text-[10px] text-slate-400 truncate">
                          {person.role}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleFollowClick(person.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        isFollowed
                          ? 'bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-300 border border-emerald-900/20'
                          : 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black shadow-[0_0_8px_rgba(255,215,0,0.3)]'
                      }`}
                    >
                      {isFollowed
                        ? (isSwahili ? 'Unafuata' : 'Following')
                        : (isSwahili ? 'Fuata' : 'Follow')}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* View All Followers & Members Button */}
            {onOpenCommunityFollowers && (
              <button
                type="button"
                onClick={onOpenCommunityFollowers}
                className="w-full mt-4 py-2.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 text-xs font-bold text-[#ffd700] border border-[#ffd700]/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Users className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>{isSwahili ? 'Tazama Wafuasi & Wanachama Wote' : 'View All Community Followers'}</span>
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
