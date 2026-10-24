import React, { useState, useRef } from 'react';
import {
  X,
  Users,
  Search,
  UserPlus,
  Check,
  Crown,
  ShieldCheck,
  Sparkles,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { MemberProfileData } from './MemberProfileModal';
import { AuthUser } from '../types';

interface CommunityMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: MemberProfileData[];
  currentUser: AuthUser | null;
  onSelectMember: (member: MemberProfileData) => void;
  onToggleFollowMember: (memberId: string, memberName: string, isNowFollowing: boolean) => void;
  language?: string;
  onShowToast?: (msg: string) => void;
}

export const CommunityMembersModal: React.FC<CommunityMembersModalProps> = ({
  isOpen,
  onClose,
  members,
  currentUser,
  onSelectMember,
  onToggleFollowMember,
  language = 'English',
  onShowToast,
}) => {
  const isSwahili = language === 'Swahili';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'following' | 'verified'>('all');
  const listContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const filteredMembers = members.filter((m) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      m.name.toLowerCase().includes(query) ||
      m.handle.toLowerCase().includes(query) ||
      m.role.toLowerCase().includes(query) ||
      (m.roleSwahili && m.roleSwahili.toLowerCase().includes(query)) ||
      m.location.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (activeTab === 'following') {
      return Boolean(m.isFollowedByMe);
    }
    if (activeTab === 'verified') {
      return m.statusBadge.toLowerCase().includes('verified') || m.statusBadge.toLowerCase().includes('vip');
    }
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#06160e] text-white w-full max-w-6xl xl:max-w-7xl rounded-3xl border border-emerald-500/40 shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-7 pb-4 border-b border-emerald-950/70 bg-[#04110b] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffd700] animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.8)]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#ffd700] flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {isSwahili ? 'Jamii ya Wafuasi & Wasifu wa Wanachama' : 'Community Followers & Member Profiles'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-editorial tracking-tight">
              {isSwahili ? 'Wafuasi wa Ev Dr. Boniphace J. Ndege' : 'Ev Dr. Boniphace J. Ndege Community Profiles'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-3xl leading-relaxed">
              {isSwahili
                ? 'Wanachama wote waliojisajili na wanaomfuata Ev Dr. Boniphace J. Ndege. Kila mwanachama ana wasifu halisi, picha zao wazi na uwezo wa kufuatana wenyewe kwa wenyewe.'
                : 'All registered community members and followers of Ev Dr. Boniphace J. Ndege. Each member has their own dedicated profile, clear imagery, and mutual follow capabilities.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-slate-300 hover:text-white border border-white/20 transition-all cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 sm:px-7 bg-[#05140c] border-b border-emerald-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isSwahili ? 'Tafuta mwanachama, jina, eneo...' : 'Search members, role, city...'}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl text-xs bg-black/50 border border-emerald-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-[#ffd700]"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: isSwahili ? `Wote (${members.length})` : `All (${members.length})` },
              {
                id: 'following',
                label: isSwahili
                  ? `Unaowafuata (${members.filter((m) => m.isFollowedByMe).length})`
                  : `Following (${members.filter((m) => m.isFollowedByMe).length})`,
              },
              {
                id: 'verified',
                label: isSwahili ? 'Waliothibitishwa' : 'Verified',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#d4af37] text-slate-950 font-black shadow-[0_0_12px_rgba(255,215,0,0.4)]'
                    : 'bg-black/50 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Member Cards Grid - Wide and clear imagery with smooth vertical scrolling */}
        <div
          ref={listContainerRef}
          className="p-4 sm:p-7 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 scroll-smooth"
        >
          {filteredMembers.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto text-emerald-600 mb-3 opacity-50" />
              <p className="text-sm font-semibold">
                {isSwahili ? 'Hakuna mwanachama aliyepatikana.' : 'No members found matching your search.'}
              </p>
            </div>
          ) : (
            filteredMembers.map((m) => {
              const isOwn = Boolean(
                m.isCurrentUser ||
                (currentUser && (currentUser.email === m.id || currentUser.name.toLowerCase() === m.name.toLowerCase()))
              );
              const isFollowed = Boolean(m.isFollowedByMe);

              return (
                <div
                  key={m.id}
                  className="p-5 sm:p-6 rounded-3xl border border-emerald-900/60 bg-gradient-to-b from-[#092014] to-[#05140c] hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row items-start gap-5 shadow-xl group hover:shadow-[0_0_24px_rgba(5,150,105,0.25)]"
                >
                  {/* Profile Image Wide into Medium Square Box */}
                  <div
                    className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 aspect-square rounded-2xl overflow-hidden shrink-0 ring-3 ring-emerald-500/40 border-2 border-[#ffd700]/70 group-hover:border-[#ffd700] shadow-2xl cursor-pointer bg-black/60 self-center sm:self-start"
                    onClick={() => {
                      onClose();
                      onSelectMember(m);
                    }}
                  >
                    <img
                      src={m.avatarUrl || '/src/assets/images/boniphace_avatar_1791315268492.jpg'}
                      alt={m.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-105 brightness-105"
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
                        {m.statusBadge}
                      </span>
                      <div className="flex items-start justify-between gap-3">
                      <div
                        className="cursor-pointer min-w-0"
                        onClick={() => {
                          onClose();
                          onSelectMember(m);
                        }}
                      >
                        <h4 className="text-base sm:text-lg font-black text-white hover:text-[#ffd700] transition-colors leading-tight truncate">
                          {m.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                          <span className="text-emerald-400 font-semibold">{m.handle}</span>
                          <span>·</span>
                          <span className="text-slate-300 font-medium">
                            {isSwahili ? m.roleSwahili : m.role}
                          </span>
                        </div>
                      </div>

                      {/* Follow Button / Your Profile */}
                      {!isOwn ? (
                        <button
                          type="button"
                          onClick={() => {
                            onToggleFollowMember(m.id, m.name, !isFollowed);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm active:scale-95 ${
                            isFollowed
                              ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40 hover:bg-slate-700 shadow-sm'
                              : 'bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#d4af37] text-slate-950 font-black shadow-[0_0_12px_rgba(255,215,0,0.4)] hover:brightness-105'
                          }`}
                        >
                          {isFollowed ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-400" />
                              <span>{isSwahili ? 'Unafuata' : 'Following'}</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4" />
                              <span>{isSwahili ? 'Fuata' : 'Follow'}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-[#ffd700] px-3.5 py-1.5 rounded-xl bg-black/60 border border-[#ffd700]/40 shadow-sm shrink-0">
                          {isSwahili ? 'Wasifu Wako' : 'Your Profile'}
                        </span>
                      )}
                    </div>
                  </div>

                    {/* Bio snippet */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">
                      {isSwahili ? (m.bioSwahili || m.bio) : (m.bio || m.bioSwahili)}
                    </p>

                    {/* Stats & View Profile Link */}
                    <div className="pt-3 border-t border-emerald-950/90 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-white">
                          {m.followersCount >= 1000
                            ? `${(m.followersCount / 1000).toFixed(1)}K`
                            : m.followersCount}{' '}
                          <span className="text-slate-400 font-normal">
                            {isSwahili ? 'Wafuasi' : 'Followers'}
                          </span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-[#ffd700]" />
                          {m.location}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectMember(m);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-[#ffd700] hover:text-[#f5d061] font-bold inline-flex items-center gap-1.5 cursor-pointer border border-[#ffd700]/30 transition-all text-xs shadow-xs"
                      >
                        <span>{isSwahili ? 'Tazama Wasifu' : 'View Profile'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
