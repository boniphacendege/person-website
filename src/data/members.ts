import { MemberProfileData } from '../components/MemberProfileModal';
import { AuthUser } from '../types';

export const INITIAL_MEMBERS: Record<string, MemberProfileData> = {
  'david michael': {
    id: 'conv-david',
    name: 'David Michael',
    handle: '@davidmichael',
    role: 'Seller & Partner',
    roleSwahili: 'Muuzaji & Mshirika',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    bio: 'Verified Open Shop electronics merchant based in Arusha. Supplying certified tech gear, accessories and hardware with fast nationwide delivery.',
    bioSwahili: 'Muuzaji aliyethibitishwa wa vifaa vya kielektroniki kwenye Open Shop mwenye makazi Arusha. Ninasambaza vifaa halisi vya kidijitali na kutoa huduma ya haraka.',
    location: 'Arusha, Tanzania',
    joinedDate: 'Jan 2026',
    ordersCount: 42,
    booksReadCount: 6,
    followersCount: 12400,
    followingCount: 38,
    isFollowedByMe: true,
    followsAdmin: true,
    recentActivity: 'Yesterday · Product order update received, tracking #GS1047.',
    recentActivitySwahili: 'Jana · Taarifa ya sasisho la agizo imepokelewa, namba ya ufuatiliaji #GS1047.',
    statusBadge: 'Verified Merchant',
  },
  'grace writer': {
    id: 'conv-grace',
    name: 'Grace Writer',
    handle: '@gracewriter',
    role: 'Author & Member',
    roleSwahili: 'Mwandishi & Mwanachama',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    bio: 'Author, digital publisher and passionate member of Ev Dr. Boniphace J. Ndege’s readers forum. Passionate about personal growth and community development.',
    bioSwahili: 'Mwandishi, mchapishaji wa kidijitali na mwanachama hai wa jukwaa la wasomaji la Ev Dr. Boniphace J. Ndege. Ninazingatia maendeleo binafsi na uongozi.',
    location: 'Dar es Salaam, Tanzania',
    joinedDate: 'Feb 2026',
    ordersCount: 14,
    booksReadCount: 18,
    followersCount: 5700,
    followingCount: 42,
    isFollowedByMe: true,
    followsAdmin: true,
    recentActivity: 'Oct 4 · Your book "The Digital Vision" is truly amazing!',
    recentActivitySwahili: 'Oktoba 4 · Kitabu chako cha "The Digital Vision" ni kizuri na chenye hamasa kubwa!',
    statusBadge: 'Active Author',
  },
  'global seller support': {
    id: 'conv-support',
    name: 'Global Seller Support',
    handle: '@openshopsupport',
    role: 'Open Shop Operations',
    roleSwahili: 'Uendeshaji wa Open Shop',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    bio: 'Official merchant compliance, catalog vetting, and Open Shop seller onboarding desk. Committed to secure, trustworthy e-commerce transactions.',
    bioSwahili: 'Dawati rasmi la usimamizi wa ubora wa bidhaa, uthibitishaji wa wauzaji na uendeshaji wa Soko la Open Shop kwa usalama na uaminifu.',
    location: 'Zanzibar, Tanzania',
    joinedDate: 'Jan 2026',
    ordersCount: 128,
    booksReadCount: 12,
    followersCount: 891,
    followingCount: 12,
    isFollowedByMe: true,
    followsAdmin: true,
    recentActivity: 'Oct 2 · Store verification completed successfully.',
    recentActivitySwahili: 'Oktoba 2 · Uthibitishaji wa duka umekamilika kikamilifu.',
    statusBadge: 'Support Operations',
  },
  'sarah james': {
    id: 'conv-sarah',
    name: 'Sarah James',
    handle: '@sarahjames',
    role: 'Creator & Buyer',
    roleSwahili: 'Muundaji & Mnunuzi',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    bio: 'Creative writer, digital buyer and regular participant in live broadcasts. Inspired by African digital entrepreneurship.',
    bioSwahili: 'Mwandishi mbunifu, mnunuzi wa kidijitali na mshiriki wa mara kwa mara katika vipindi mubashara vya Ev Dr. Boniphace J. Ndege.',
    location: 'Dodoma, Tanzania',
    joinedDate: 'Dec 2025',
    ordersCount: 35,
    booksReadCount: 22,
    followersCount: 8400,
    followingCount: 65,
    isFollowedByMe: true,
    followsAdmin: true,
    recentActivity: 'Online now · Creator & Buyer',
    recentActivitySwahili: 'Yuko mtandaoni sasa · Muundaji & Mnunuzi',
    statusBadge: 'VIP Buyer',
  },
  'ev dr. boniphace j. ndege': {
    id: 'conv-boniphace',
    name: 'Ev Dr. Boniphace J. Ndege',
    handle: '@boniphacendege',
    role: 'Founder, Author & Verified Creator',
    roleSwahili: 'Mwanzilishi, Mwandishi & Muundaji Mkuu',
    avatarUrl: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
    bannerUrl: '/src/assets/images/boniphace_banner_1791315259974.jpg',
    bio: 'Founder, author, digital innovator, and executive publisher. Leading high-impact community growth, books, and digital business solutions.',
    bioSwahili: 'Mwanzilishi, mwandishi, mvumbuzi wa kidijitali na mchapishaji mkuu. Anaongoza maendeleo ya jamii, vitabu na masuluhisho ya biashara mtandaoni.',
    location: 'Dar es Salaam, Tanzania',
    joinedDate: 'Jan 2024',
    ordersCount: 420,
    booksReadCount: 52,
    followersCount: 12800,
    followingCount: 38,
    isFollowedByMe: false,
    followsAdmin: false,
    isAdmin: true,
    isCurrentUser: true,
    recentActivity: 'Admin · Digital Business & The Future host',
    recentActivitySwahili: 'Msimamizi · Mwezeshaji wa Digital Business & The Future',
    statusBadge: 'Admin',
  },
};

// Retrieve stored members or defaults from LocalStorage
export const getStoredMembersMap = (): Record<string, MemberProfileData> => {
  try {
    const raw = localStorage.getItem('bn_members_directory');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...INITIAL_MEMBERS, ...parsed };
    }
  } catch {}
  return { ...INITIAL_MEMBERS };
};

export const saveStoredMembersMap = (membersMap: Record<string, MemberProfileData>) => {
  try {
    localStorage.setItem('bn_members_directory', JSON.stringify(membersMap));
  } catch {}
};

export const getMemberProfile = (nameOrId: string): MemberProfileData => {
  const members = getStoredMembersMap();
  const key = nameOrId.toLowerCase().trim();

  // Look up by direct key
  if (members[key]) {
    return members[key];
  }

  // Look up by id or handle or name match
  const found = Object.values(members).find(
    (m) =>
      m.id.toLowerCase() === key ||
      m.name.toLowerCase() === key ||
      m.handle.toLowerCase() === key ||
      m.handle.toLowerCase() === `@${key}`
  );
  if (found) return found;

  // Fallback dynamic profile for any member name
  const fallback: MemberProfileData = {
    id: `member-${key.replace(/\s+/g, '-')}`,
    name: nameOrId,
    handle: `@${key.replace(/\s+/g, '')}`,
    role: 'Active Community Member',
    roleSwahili: 'Mwanachama Hai wa Jamii',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    bio: 'Passionate community member of Ev Dr. Boniphace J. Ndege’s ecosystem.',
    bioSwahili: 'Mwanachama mwenye shauku katika mfumo wa kidijitali wa Ev Dr. Boniphace J. Ndege.',
    location: 'Tanzania',
    joinedDate: '2026',
    ordersCount: 3,
    booksReadCount: 5,
    followersCount: 120,
    followingCount: 14,
    isFollowedByMe: false,
    followsAdmin: true,
    recentActivity: 'Active in community discussions',
    recentActivitySwahili: 'Mshiriki hai kwenye mijadala ya jamii',
    statusBadge: 'Member',
  };

  members[key] = fallback;
  saveStoredMembersMap(members);
  return fallback;
};

// Return array of all community followers/members
export const getAllMembersList = (): MemberProfileData[] => {
  const members = getStoredMembersMap();
  return Object.values(members);
};

// Create or update member profile for a signed up user
export const registerUserMemberProfile = (user: AuthUser): MemberProfileData => {
  const members = getStoredMembersMap();
  const key = user.name.toLowerCase().trim();

  const existing = members[key] || Object.values(members).find(
    (m) => m.id === user.id || m.name.toLowerCase() === user.name.toLowerCase()
  );

  const profileData: MemberProfileData = {
    id: user.id || `member-${Date.now()}`,
    name: user.name,
    handle: `@${user.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'member'}`,
    role: user.role === 'admin' ? 'Creator & Admin' : 'Active Community Member',
    roleSwahili: user.role === 'admin' ? 'Msimamizi wa Jukwaa' : 'Mwanachama wa Jamii',
    avatarUrl:
      user.avatarUrl ||
      existing?.avatarUrl ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    bannerUrl:
      existing?.bannerUrl ||
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    bio:
      existing?.bio ||
      `Passionate community member, learner and active follower of Ev Dr. Boniphace J. Ndege.`,
    bioSwahili:
      existing?.bioSwahili ||
      `Mwanachama mwenye shauku ya kujifunza, kukuza maarifa na mfuasi hai wa Ev Dr. Boniphace J. Ndege.`,
    location: existing?.location || 'Tanzania',
    joinedDate: existing?.joinedDate || 'Today',
    ordersCount: existing?.ordersCount || 0,
    booksReadCount: existing?.booksReadCount || 1,
    followersCount: existing?.followersCount || 1,
    followingCount: existing?.followingCount || 1,
    isFollowedByMe: false,
    followsAdmin: true,
    recentActivity: 'Joined community & following Ev Dr. Boniphace J. Ndege',
    recentActivitySwahili: 'Amejiunga na jamii na kumfuata Ev Dr. Boniphace J. Ndege',
    statusBadge: user.role === 'admin' ? 'Admin' : 'Verified Follower',
    isCurrentUser: true,
  };

  members[key] = profileData;
  saveStoredMembersMap(members);
  return profileData;
};
