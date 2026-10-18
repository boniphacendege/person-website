export type Language = 'English' | 'Swahili';

export interface Translations {
  // Navigation & Header
  navHome: string;
  navPosts: string;
  navStore: string;
  navBooks: string;
  navVideos: string;
  navArticles: string;
  navMessages: string;
  navDashboard: string;
  navCreatorStudio: string;
  navSellerCenter: string;
  navLive: string;
  navAbout: string;

  // Topbar
  searchPlaceholder: string;
  notifications: string;
  cart: string;
  settings: string;
  toggleTheme: string;

  // Profile Hero
  follow: string;
  following: string;
  message: string;
  bookMeeting: string;
  editProfile: string;
  shareProfile: string;
  verifiedCreator: string;
  followers: string;
  followingCount: string;
  postsCount: string;
  booksCount: string;
  videosCount: string;
  productsCount: string;

  // Chat Section
  chatTitle: string;
  chatSubtitle: string;
  activeConversations: string;
  onlineNow: string;
  offline: string;
  selectConversation: string;
  selectConversationDesc: string;
  writeMessageTo: (name: string) => string;
  send: string;
  startVideoCall: string;
  startVoiceCall: string;

  // Social Feed
  whatsOnYourMind: string;
  createPost: string;
  allPosts: string;
  articles: string;
  videos: string;
  like: string;
  liked: string;
  comment: string;
  comments: string;
  share: string;
  writeComment: string;
  peopleYouMayKnow: string;
  trendingTopics: string;

  // Settings Modal
  settingsTitle: string;
  appearance: string;
  darkMode: string;
  enable: string;
  disable: string;
  languageLabel: string;
  selectLanguage: string;
  accountPrivacy: string;
  secured: string;
  publicCreatorProfile: string;

  // Creator & Seller
  publishContent: string;
  manageShop: string;
  viewProducts: string;
  addToCart: string;
  readBook: string;
  watchVideo: string;
}

export const translations: Record<Language, Translations> = {
  English: {
    navHome: 'Home',
    navPosts: 'Posts',
    navStore: 'Store',
    navBooks: 'Books',
    navVideos: 'Videos',
    navArticles: 'Articles',
    navMessages: 'Messages',
    navDashboard: 'Dashboard',
    navCreatorStudio: 'Creator Studio',
    navSellerCenter: 'Seller Center',
    navLive: 'Live',
    navAbout: 'About',

    searchPlaceholder: 'Search posts, books, products, videos...',
    notifications: 'Notifications',
    cart: 'Cart',
    settings: 'Settings',
    toggleTheme: 'Toggle Theme',

    follow: 'Follow',
    following: 'Following',
    message: 'Message',
    bookMeeting: 'Book Meeting',
    editProfile: 'Edit Profile',
    shareProfile: 'Share Profile',
    verifiedCreator: 'Verified Creator',
    followers: 'Followers',
    followingCount: 'Following',
    postsCount: 'Posts',
    booksCount: 'Books',
    videosCount: 'Videos',
    productsCount: 'Products',

    chatTitle: 'Messages & Chat',
    chatSubtitle: 'Private conversations, seller chats and community messaging.',
    activeConversations: 'Active Conversations',
    onlineNow: 'Online now',
    offline: 'Offline',
    selectConversation: 'Select a conversation',
    selectConversationDesc: 'Choose a contact from the left list to start messaging.',
    writeMessageTo: (name: string) => `Write a message to ${name}...`,
    send: 'Send',
    startVideoCall: 'Start Video Call',
    startVoiceCall: 'Start Voice Call',

    whatsOnYourMind: "What's on your mind today?",
    createPost: 'Create Post',
    allPosts: 'All Posts',
    articles: 'Articles',
    videos: 'Videos',
    like: 'Like',
    liked: 'Liked',
    comment: 'Comment',
    comments: 'Comments',
    share: 'Share',
    writeComment: 'Write a comment...',
    peopleYouMayKnow: 'People You May Know',
    trendingTopics: 'Trending Topics',

    settingsTitle: 'Settings & Preferences',
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    enable: 'Enable',
    disable: 'Disable',
    languageLabel: 'Language',
    selectLanguage: 'Select interface language',
    accountPrivacy: 'Account Privacy',
    secured: 'Secured',
    publicCreatorProfile: 'Public creator profile',

    publishContent: 'Publish Content',
    manageShop: 'Manage Shop',
    viewProducts: 'View Products',
    addToCart: 'Add to Cart',
    readBook: 'Read Sample',
    watchVideo: 'Watch Video',
  },
  Swahili: {
    navHome: 'Mwanzo',
    navPosts: 'Machapisho',
    navStore: 'Duka',
    navBooks: 'Vitabu',
    navVideos: 'Video',
    navArticles: 'Makala',
    navMessages: 'Ujumbe',
    navDashboard: 'Dashibodi',
    navCreatorStudio: 'Studio ya Muundaji',
    navSellerCenter: 'Kituo cha Muuzaji',
    navLive: 'Mubashara',
    navAbout: 'Kuhusu',

    searchPlaceholder: 'Tafuta machapisho, vitabu, bidhaa, video...',
    notifications: 'Taarifa',
    cart: 'Mkokoteni',
    settings: 'Mipangilio',
    toggleTheme: 'Badilisha Muonekano',

    follow: 'Fuata',
    following: 'Unafuata',
    message: 'Tuma Ujumbe',
    bookMeeting: 'Panga Kikao',
    editProfile: 'Hariri Wasifu',
    shareProfile: 'Shiriki Wasifu',
    verifiedCreator: 'Muundaji Aliyethibitishwa',
    followers: 'Wafuasi',
    followingCount: 'Wanaofuatwa',
    postsCount: 'Machapisho',
    booksCount: 'Vitabu',
    videosCount: 'Video',
    productsCount: 'Bidhaa',

    chatTitle: 'Ujumbe na Mazungumzo',
    chatSubtitle: 'Mazungumzo ya faragha, mawasiliano ya wauzaji na jamii.',
    activeConversations: 'Mazungumzo Yanayoendelea',
    onlineNow: 'Yuko mtandaoni',
    offline: 'Nje ya mtandao',
    selectConversation: 'Chagua mazungumzo',
    selectConversationDesc: 'Chagua mtu kutoka kwenye orodha kuanza mazungumzo.',
    writeMessageTo: (name: string) => `Andika ujumbe kwa ${name}...`,
    send: 'Tuma',
    startVideoCall: 'Piga Simu ya Video',
    startVoiceCall: 'Piga Simu ya Sauti',

    whatsOnYourMind: 'Una mawazo gani leo?',
    createPost: 'Tunga Chapisho',
    allPosts: 'Machapisho Yote',
    articles: 'Makala',
    videos: 'Video',
    like: 'Penda',
    liked: 'Umependa',
    comment: 'Maoni',
    comments: 'Maoni',
    share: 'Shiriki',
    writeComment: 'Andika maoni yako...',
    peopleYouMayKnow: 'Watu Unaoweza Kuwajua',
    trendingTopics: 'Mada Zinazovuma',

    settingsTitle: 'Mipangilio & Mapendekezo',
    appearance: 'Muonekano',
    darkMode: 'Hali ya Usiku',
    enable: 'Washa',
    disable: 'Zima',
    languageLabel: 'Lugha',
    selectLanguage: 'Chagua lugha ya mfumo',
    accountPrivacy: 'Faragha ya Akaunti',
    secured: 'Imelindwa',
    publicCreatorProfile: 'Wasifu wa umma wa muundaji',

    publishContent: 'Chapisha Maudhui',
    manageShop: 'Simamia Duka',
    viewProducts: 'Tazama Bidhaa',
    addToCart: 'Weka Kwenye Mkokoteni',
    readBook: 'Soma Sampuli',
    watchVideo: 'Tazama Video',
  },
};
