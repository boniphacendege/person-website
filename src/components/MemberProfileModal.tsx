import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  Camera,
  CheckCircle2,
  Calendar,
  MapPin,
  ShoppingBag,
  BookOpen,
  MessageSquare,
  Lock,
  Award,
  Upload,
  UserPlus,
  Check,
  Users,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { AuthUser } from '../types';

export interface MemberProfileData {
  id: string;
  name: string;
  handle: string;
  role: string;
  roleSwahili: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  bioSwahili: string;
  location: string;
  joinedDate: string;
  ordersCount: number;
  booksReadCount: number;
  followersCount: number;
  followingCount: number;
  isFollowedByMe?: boolean;
  followsAdmin?: boolean;
  recentActivity: string;
  recentActivitySwahili: string;
  statusBadge: string;
  isCurrentUser?: boolean;
  isAdmin?: boolean;
}

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberProfileData | null;
  currentUser: AuthUser | null;
  onUpdateMemberProfile?: (updated: Partial<MemberProfileData>) => void;
  onOpenChatWithMember?: (contactName: string) => void;
  onToggleFollowMember?: (memberId: string, memberName: string, isNowFollowing: boolean) => void;
  language?: string;
  onShowToast?: (msg: string) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  isOpen,
  onClose,
  member,
  currentUser,
  onUpdateMemberProfile,
  onOpenChatWithMember,
  onToggleFollowMember,
  language = 'English',
  onShowToast,
}) => {
  const isSwahili = language === 'Swahili';
  const isOwnProfile = Boolean(
    member?.isCurrentUser ||
    (currentUser && member && (currentUser.email === member.id || currentUser.name.toLowerCase() === member.name.toLowerCase()))
  );

  const [avatar, setAvatar] = useState(member?.avatarUrl || '');
  const [banner, setBanner] = useState(member?.bannerUrl || '');
  const [bio, setBio] = useState(
    member
      ? (isSwahili ? (member.bioSwahili || member.bio) : (member.bio || member.bioSwahili))
      : ''
  );
  const [location, setLocation] = useState(member?.location || 'Tanzania');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isFollowed, setIsFollowed] = useState(Boolean(member?.isFollowedByMe));
  const [followers, setFollowers] = useState(member?.followersCount || 120);

  useEffect(() => {
    if (member) {
      setAvatar(member.avatarUrl);
      setBanner(member.bannerUrl);
      setBio(isSwahili ? (member.bioSwahili || member.bio) : (member.bio || member.bioSwahili));
      setLocation(member.location || 'Tanzania');
      setIsFollowed(Boolean(member.isFollowedByMe));
      setFollowers(member.followersCount || 120);
      setIsEditingBio(false);
    }
  }, [member, isSwahili]);

  if (!isOpen || !member) return null;

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBanner(url);
    onUpdateMemberProfile?.({ bannerUrl: url });
    onShowToast?.(
      isSwahili
        ? 'Bango la mwanachama limesasishwa moja kwa moja!'
        : 'Member profile banner updated successfully!'
    );
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
    onUpdateMemberProfile?.({ avatarUrl: url });
    onShowToast?.(
      isSwahili
        ? 'Picha halisi ya wasifu imesasishwa!'
        : 'Real profile photo updated successfully!'
    );
  };

  const handleSaveBio = () => {
    setIsEditingBio(false);
    onUpdateMemberProfile?.({
      bio,
      bioSwahili: bio,
      location,
    });
    onShowToast?.(
      isSwahili
        ? 'Taarifa za wasifu zimehifadhiwa!'
        : 'Profile details saved successfully!'
    );
  };

  const handleToggleFollow = () => {
    const nextState = !isFollowed;
    setIsFollowed(nextState);
    const updatedCount = followers + (nextState ? 1 : -1);
    setFollowers(updatedCount);
    onToggleFollowMember?.(member.id, member.name, nextState);
    onShowToast?.(
      nextState
        ? (isSwahili ? `Sasa unamfuata ${member.name}!` : `You are now following ${member.name}!`)
        : (isSwahili ? `Umeacha kumfuata ${member.name}` : `Unfollowed ${member.name}`)
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0b1c13] text-white w-full max-w-2xl rounded-3xl border border-emerald-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Cover Banner Area */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-gradient-to-r from-emerald-950 to-[#032415] group shrink-0">
          <img
            src={banner || '/src/assets/images/boniphace_cover_1791315258070.jpg'}
            alt={`${member.name} Banner`}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c13] via-black/35 to-black/60" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white border border-white/20 transition-all cursor-pointer z-10"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Upload Banner Button (Enabled for own profile) */}
          {isOwnProfile && (
            <label
              className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/90 text-white text-xs font-bold border border-[#ffd700]/40 backdrop-blur-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg z-10"
              title="Upload Member Cover Banner"
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerUpload}
              />
              <Camera className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>{isSwahili ? 'Badili Bango' : 'Change Banner'}</span>
            </label>
          )}

          {/* Follows Admin Badge */}
          <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full text-xs font-black bg-black/70 text-[#ffd700] border border-[#ffd700]/40 backdrop-blur-xs flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
            <span>
              {isSwahili ? 'Mfuasi wa Ev Dr. Boniphace J. Ndege' : 'Follows Ev Dr. Boniphace J. Ndege'}
            </span>
          </div>

          {/* Member Badge Overlay */}
          <div className="absolute bottom-3 right-4 px-3 py-1 rounded-full text-xs font-black bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-xs flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#ffd700]" />
            <span>{member.statusBadge}</span>
          </div>
        </div>

        {/* Profile Details Area */}
        <div className="p-6 pt-0 relative space-y-5 overflow-y-auto flex-1">
          {/* Header Row: Avatar + Name + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
            <div className="flex items-end gap-4">
              {/* Real Profile Photo Container */}
              <div className="relative group/avatar shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-[#0b1c13] shadow-2xl bg-black border border-[#ffd700]/50">
                  <img
                    src={avatar || '/src/assets/images/boniphace_avatar_1791315268492.jpg'}
                    alt={member.name}
                    className="w-full h-full object-cover object-center group-hover/avatar:brightness-90 transition-all"
                  />
                </div>

                {isOwnProfile && (
                  <label
                    className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity"
                    title="Upload Real Profile Photo"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <Upload className="w-5 h-5 text-[#ffd700] mb-0.5" />
                    <span className="text-[10px] font-bold">{isSwahili ? 'Pakia Picha' : 'Upload'}</span>
                  </label>
                )}

                <span
                  className="absolute -bottom-1 -right-1 p-1 bg-emerald-600 rounded-full ring-2 ring-[#0b1c13] text-white"
                  title="Verified Member"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#ffd700]" />
                </span>
              </div>

              {/* Name & Handle */}
              <div className="mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-black text-white font-editorial">
                    {member.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/30">
                    {isSwahili ? member.roleSwahili : member.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mt-0.5">
                  <span>{member.handle}</span>
                  <span>·</span>
                  <span className="text-slate-300">
                    {isSwahili ? 'Mwanachama Aliyeidhinishwa' : 'Verified Community Member'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Follow each other + Send Message */}
            <div className="flex items-center gap-2 flex-wrap">
              {!isOwnProfile && (
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md ${
                    isFollowed
                      ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-[#ffd700] via-[#f5d061] to-[#d4af37] text-slate-950 font-black shadow-[0_0_12px_rgba(255,215,0,0.4)] hover:brightness-105'
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

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenChatWithMember?.(member.name);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white shadow-md border border-[#ffd700]/30 inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isSwahili ? 'Tuma Ujumbe' : 'Send Message'}</span>
              </button>

              {isOwnProfile && !isEditingBio && (
                <button
                  type="button"
                  onClick={() => setIsEditingBio(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-black/40 hover:bg-black/60 text-slate-200 border border-white/20 inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#ffd700]" />
                  <span>{isSwahili ? 'Hariri Wasifu' : 'Edit Bio'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Member Bio & Location */}
          <div className="p-4 rounded-2xl bg-black/30 border border-emerald-950/60 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider text-emerald-300">
                {isSwahili ? 'Kuhusu Mwanachama' : 'Member Bio'}
              </span>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#ffd700]" />
                  {location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  {member.joinedDate}
                </span>
              </div>
            </div>

            {isEditingBio ? (
              <div className="space-y-3 pt-1">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-emerald-500/40 text-xs text-white focus:outline-none focus:border-[#ffd700]"
                  placeholder={isSwahili ? 'Andika wasifu wako hapa...' : 'Write your bio here...'}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-black/50 border border-emerald-500/40 text-xs text-white focus:outline-none focus:border-[#ffd700]"
                    placeholder={isSwahili ? 'Mahali (mf. Dar es Salaam, Tanzania)' : 'Location'}
                  />
                  <button
                    onClick={handleSaveBio}
                    className="px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950"
                  >
                    {isSwahili ? 'Hifadhi' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white"
                  >
                    {isSwahili ? 'Ghairi' : 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {bio}
              </p>
            )}
          </div>

          {/* Prominent Access Control & Creator Studio Restriction Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-black/40 to-amber-950/30 border border-amber-500/40 shadow-inner space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                <ShieldAlert className="w-4 h-4 text-[#ffd700]" />
                <span>
                  {isSwahili ? 'Hali ya Ufikiaji wa Jukwaa' : 'Platform Access Status'}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                {isSwahili ? 'Studio Imezuiwa' : 'Studio Restricted'}
              </span>
            </div>

            <p className="text-xs text-amber-100/90 leading-relaxed">
              {isSwahili ? (
                <>
                  <strong className="text-white">Ufikiaji wa Creator Studio Umezuiwa: </strong>
                  Akaunti ya mwanachama huyu ina uwezo wa kusoma vitabu, kutazama video, kushiriki kwenye vikao na kufanya ununuzi kwenye Open Shop. Ufikiaji na uchapishaji ndani ya <span className="text-[#ffd700] font-bold">Creator Studio</span> unalindwa na unaruhusiwa kwa Msimamizi pekee (Ev Dr. Boniphace J. Ndege).
                </>
              ) : (
                <>
                  <strong className="text-white">Creator Studio Access Restricted: </strong>
                  Member profile permits browsing, purchasing on Open Shop, participating in discussions, and reading books. Publishing within the <span className="text-[#ffd700] font-bold">Creator Studio</span> is reserved strictly for Admin credentials (Ev Dr. Boniphace J. Ndege).
                </>
              )}
            </p>
          </div>

          {/* Member Community Stats & Activity Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Followers count */}
            <div className="p-3.5 rounded-xl bg-black/20 border border-emerald-950/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                {isSwahili ? 'Wafuasi' : 'Followers'}
              </span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#ffd700]" />
                <span className="text-base font-black text-white tabular-nums">
                  {followers >= 1000 ? `${(followers / 1000).toFixed(1)}K` : followers}
                </span>
              </div>
            </div>

            {/* Following count */}
            <div className="p-3.5 rounded-xl bg-black/20 border border-emerald-950/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                {isSwahili ? 'Wanaofuatwa' : 'Following'}
              </span>
              <div className="flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span className="text-base font-black text-white tabular-nums">
                  {member.followingCount || 12}
                </span>
              </div>
            </div>

            {/* Open Shop Orders */}
            <div className="p-3.5 rounded-xl bg-black/20 border border-emerald-950/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                {isSwahili ? 'Maagizo Open Shop' : 'Shop Orders'}
              </span>
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#ffd700]" />
                <span className="text-base font-black text-white tabular-nums">{member.ordersCount}</span>
              </div>
            </div>

            {/* Books Read */}
            <div className="p-3.5 rounded-xl bg-black/20 border border-emerald-950/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                {isSwahili ? 'Vitabu Vilivyosomwa' : 'Books Read'}
              </span>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span className="text-base font-black text-white tabular-nums">{member.booksReadCount}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="p-3.5 rounded-xl bg-black/20 border border-emerald-950/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {isSwahili ? 'Shughuli ya Hivi Karibuni' : 'Recent Activity'}
            </span>
            <p className="text-xs text-emerald-200 leading-relaxed">
              {isSwahili ? member.recentActivitySwahili : member.recentActivity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
