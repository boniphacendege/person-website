import React, { useState } from 'react';
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
  if (!isOpen) return null;

  const isSwahili = language === 'Swahili';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'following' | 'verified'>('all');

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
      <div className="bg-[#081810] text-white w-full max-w-4xl rounded-3xl border border-emerald-500/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-emerald-950/60 bg-[#06140d] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffd700] animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#ffd700] flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {isSwahili ? 'Jamii ya Wafuasi & Wanachama' : 'Community Followers & Members'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-editorial tracking-tight">
              {isSwahili ? 'Wafuasi wa Ev Dr. Boniphace J. Ndege' : 'Followers & Community Members'}
            </h2>
            <p className="text-xs text-emerald-200/80 mt-1 max-w-2xl leading-relaxed">
              {isSwahili
                ? 'Wanachama wote waliojisajili na wanaomfuata Ev Dr. Boniphace J. Ndege. Kila mwanachama ana wasifu halisi na uwezo wa kufuatana wenyewe kwa wenyewe.'
                : 'All members who registered and follow Ev Dr. Boniphace J. Ndege. Every member has their own real profile with mutual following enabled.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-slate-300 hover:text-white border border-white/20 transition-all cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 sm:px-6 bg-[#07170f] border-b border-emerald-950/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isSwahili ? 'Tafuta mwanachama, jina, eneo...' : 'Search members, role, city...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-black/40 border border-emerald-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-[#ffd700]"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 shadow-[0_0_10px_rgba(255,215,0,0.35)]'
                    : 'bg-black/40 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMembers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto text-emerald-600 mb-2 opacity-50" />
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
                  className="rounded-2xl border border-emerald-950 bg-gradient-to-b from-[#0b1f14] to-[#07160e] hover:border-emerald-500/40 transition-all overflow-hidden flex flex-col justify-between shadow-lg group"
                >
                  {/* Card Banner */}
                  <div className="relative h-20 w-full overflow-hidden bg-emerald-950">
                    <img
                      src={m.bannerUrl}
                      alt={m.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f14] via-black/40 to-transparent" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-black/60 backdrop-blur-xs text-[#ffd700] border border-[#ffd700]/30">
                      {m.statusBadge}
                    </div>
                  </div>

                  {/* Body with Avatar */}
                  <div className="px-4 pb-4 -mt-7 relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-end justify-between gap-3 mb-2">
                        <div
                          className="relative cursor-pointer shrink-0"
                          onClick={() => {
                            onClose();
                            onSelectMember(m);
                          }}
                        >
                          <img
                            src={m.avatarUrl}
                            alt={m.name}
                            className="w-14 h-14 rounded-xl object-cover ring-2 ring-[#0b1f14] shadow-md border border-[#ffd700]/50"
                          />
                          <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-600 rounded-full text-white">
                            <ShieldCheck className="w-3 h-3 text-[#ffd700]" />
                          </span>
                        </div>

                        {/* Mutual Follow Button ("within themselves should have follow for") */}
                        {!isOwn ? (
                          <button
                            type="button"
                            onClick={() => {
                              onToggleFollowMember(m.id, m.name, !isFollowed);
                            }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0 ${
                              isFollowed
                                ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40 hover:bg-slate-700'
                                : 'bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#d4af37] text-slate-950 font-black shadow-[0_0_10px_rgba(255,215,0,0.35)] hover:brightness-105'
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
                        ) : (
                          <span className="text-[11px] font-bold text-[#ffd700] px-2.5 py-1 rounded-xl bg-black/40 border border-[#ffd700]/30">
                            {isSwahili ? 'Wasifu Wako' : 'Your Profile'}
                          </span>
                        )}
                      </div>

                      {/* Name & Role */}
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          onClose();
                          onSelectMember(m);
                        }}
                      >
                        <h4 className="text-sm font-black text-white hover:text-[#ffd700] transition-colors">
                          {m.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="text-emerald-400 font-semibold">{m.handle}</span>
                          <span>·</span>
                          <span className="text-slate-300 font-medium">
                            {isSwahili ? m.roleSwahili : m.role}
                          </span>
                        </div>
                      </div>

                      {/* Bio snippet */}
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {isSwahili ? (m.bioSwahili || m.bio) : (m.bio || m.bioSwahili)}
                      </p>
                    </div>

                    {/* Stats & View Profile Link */}
                    <div className="pt-3 mt-3 border-t border-emerald-950/80 flex items-center justify-between text-[11px] text-slate-400">
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
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3 h-3 text-[#ffd700]" />
                          {m.location}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectMember(m);
                        }}
                        className="text-[#ffd700] hover:text-[#f5d061] font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isSwahili ? 'Wasifu' : 'View Profile'}</span>
                        <ExternalLink className="w-3 h-3" />
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
