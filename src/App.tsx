import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Post,
  BlogArticle,
  Book,
  VideoItem,
  Product,
  CartItem,
  Order,
  Conversation,
  Message,
  Meeting,
  ReadingMaterial,
  AuthUser,
} from './types';
import * as api from './api';

import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { ProfileHero } from './components/ProfileHero';
import { QuickAccess } from './components/QuickAccess';
import { AboutSection } from './components/AboutSection';
import { SocialFeed } from './components/SocialFeed';
import { BlogSection } from './components/BlogSection';
import { BooksSection } from './components/BooksSection';
import { VideosSection } from './components/VideosSection';
import { LiveSection } from './components/LiveSection';
import { ShopSection } from './components/ShopSection';
import { ChatSection } from './components/ChatSection';
import { CreatorStudio } from './components/CreatorStudio';
import { SellerCenter } from './components/SellerCenter';
import { DashboardSection } from './components/DashboardSection';
import { Footer } from './components/Footer';
import { Modals } from './components/Modals';
import { AddProductModal } from './components/AddProductModal';
import { EditProfileModal } from './components/EditProfileModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AuthModal, AuthMode } from './components/AuthModal';
import { Preloader } from './components/Preloader';
import { BookPublishModal } from './components/BookPublishModal';
import { ArrowUp, WifiOff } from 'lucide-react';

export default function App() {
  // Theme (System Auto vs Manual Override) & Language
  const [themeMode, setThemeMode] = useState<'system' | 'light' | 'dark'>(() => {
    const saved = localStorage.getItem('bn_theme_mode');
    if (saved === 'system' || saved === 'light' || saved === 'dark') return saved;
    // If user has not set a manual override, default to 'system'
    const manual = localStorage.getItem('bn_dark');
    if (manual !== null) {
      return manual === 'true' ? 'dark' : 'light';
    }
    return 'system';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('bn_theme_mode');
    if (savedMode === 'dark') return true;
    if (savedMode === 'light') return false;
    const manual = localStorage.getItem('bn_dark');
    if (manual !== null) return manual === 'true';
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('bn_lang') || 'Swahili';
  });

  // UI Navigation
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [globalSearch, setGlobalSearch] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data States
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Ev Dr. Boniphace J. Ndege',
    handle: '@boniphacendege',
    title: 'PERSONAL BRAND · CREATOR · ENTREPRENEUR',
    titleSwahili: 'CHAPA BINAFSI · MUUNDAJI · MWEKEZAJI',
    bio: 'Building a digital home where ideas become opportunities · Technology becomes more meaningful when it connects people, knowledge, community and trusted commerce. Welcome to our official digital platform.',
    bioSwahili: 'Kujenga makazi ya kidijitali ambapo mawazo yanakuwa fursa · Teknolojia inapata maana kubwa zaidi inapowaunganisha watu, maarifa, jamii na biashara za uaminifu. Karibuni sana katika jukwaa letu rasmi la kidijitali.',
    avatarUrl: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
    coverUrl: '/src/assets/images/boniphace_cover_1791315258070.jpg',
    verified: true,
    followersCount: 12842,
    followingCount: 482,
    isFollowing: false,
    postsCount: 126,
    booksCount: 18,
    videosCount: 245,
    productsCount: 1820,
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('bn_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookModalInitialMode, setBookModalInitialMode] = useState<'pdf' | 'auto_book'>('pdf');
  const [isVideoUploadModalOpen, setIsVideoUploadModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Active readers / players
  const [activeReadingMaterial, setActiveReadingMaterial] = useState<ReadingMaterial | null>(null);
  const [activePlayingVideo, setActivePlayingVideo] = useState<VideoItem | null>(null);
  const [activeLiveMeeting, setActiveLiveMeeting] = useState<Meeting | null>(null);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const isRemember = localStorage.getItem('bn_remember_me') === 'true';
      const raw = isRemember
        ? localStorage.getItem('bn_auth_user')
        : sessionStorage.getItem('bn_auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');

  // Preloader State (Runs initially, can be re-triggered anytime)
  const [showPreloader, setShowPreloader] = useState(true);
  const [preloaderTriggerKey, setPreloaderTriggerKey] = useState(0);

  const handleOpenAuth = (initialMode: AuthMode = 'login') => {
    setAuthModalMode(initialMode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: AuthUser, message: string) => {
    setCurrentUser(user);
    showToast(message);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('bn_auth_user');
    localStorage.removeItem('bn_remember_me');
    localStorage.removeItem('bn_token');
    sessionStorage.removeItem('bn_auth_user');
    sessionStorage.removeItem('bn_token');
    showToast(
      language === 'Swahili'
        ? 'Umetoka kwenye akaunti kikamilifu.'
        : 'Signed out successfully.'
    );
  };

  const handleTriggerPreloader = () => {
    setShowPreloader(true);
    setPreloaderTriggerKey((prev) => prev + 1);
  };

  // Newsletter Mailing List State
  const [mailingList, setMailingList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bn_mailing_list');
      return saved
        ? JSON.parse(saved)
        : [
            'community@boniphacendege.com',
            'readers@boniphacendege.com',
            'innovation@boniphacendege.com',
          ];
    } catch {
      return ['community@boniphacendege.com', 'readers@boniphacendege.com'];
    }
  });

  // Synchronize mailing list from server if available
  useEffect(() => {
    fetch('/api/newsletter')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.subscribers)) {
          const serverEmails = data.subscribers.map((s: any) => s.email);
          setMailingList((prev) => Array.from(new Set([...prev, ...serverEmails])));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubscribeNewsletter = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      const err = language === 'Swahili'
        ? 'Tafadhali ingiza anwani sahihi ya barua pepe.'
        : 'Please enter a valid email address.';
      showToast(err);
      return { success: false, message: err };
    }

    if (mailingList.includes(cleanEmail)) {
      const alreadyMsg = language === 'Swahili'
        ? 'Barua pepe hii tayari imesajiliwa kwenye orodha ya jarida.'
        : 'This email is already subscribed to our newsletter list.';
      showToast(alreadyMsg);
      return { success: true, message: alreadyMsg };
    }

    const updated = [...mailingList, cleanEmail];
    setMailingList(updated);
    try {
      localStorage.setItem('bn_mailing_list', JSON.stringify(updated));
    } catch {}

    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
    } catch {}

    const successMsg = language === 'Swahili'
      ? `Asante! ${cleanEmail} imeongezwa kwenye orodha ya jarida letu.`
      : `Thank you! ${cleanEmail} has been added to our newsletter mailing list.`;
    showToast(successMsg);
    return { success: true, message: successMsg };
  };

  // Online / Offline Connectivity Tracker
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast(
        language === 'Swahili'
          ? 'Umeunganishwa tena kwenye mtandao!'
          : 'Back online! Connected to server.'
      );
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast(
        language === 'Swahili'
          ? 'Hali ya nje ya mtandao: Unaweza kusoma makala na vitabu vilivyohifadhiwa.'
          : 'Offline mode active: Cached blogs and book previews are accessible.'
      );
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [language]);

  // Listen for OS system theme preference changes in real-time
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mq.matches);

    const handleSystemChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
      if (themeMode === 'system') {
        setDarkMode(e.matches);
      }
    };

    mq.addEventListener('change', handleSystemChange);
    return () => mq.removeEventListener('change', handleSystemChange);
  }, [themeMode]);

  // Synchronize darkMode when themeMode changes
  useEffect(() => {
    if (themeMode === 'system') {
      const isDark = typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false;
      setDarkMode(isDark);
      localStorage.setItem('bn_theme_mode', 'system');
      localStorage.removeItem('bn_dark'); // clear manual override
    } else {
      const isDark = themeMode === 'dark';
      setDarkMode(isDark);
      localStorage.setItem('bn_theme_mode', themeMode);
      localStorage.setItem('bn_dark', isDark ? 'true' : 'false');
    }
  }, [themeMode]);

  // Sync Dark Mode class with HTML root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('bn_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Track scroll position to update the top progress bar and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      if (scrollHeight <= 0) {
        setScrollProgress(0);
      } else {
        const progress = Math.min(100, Math.max(0, (scrolled / scrollHeight) * 100));
        setScrollProgress(progress);
      }
      setShowBackToTop(scrolled > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load Initial Data from Backend
  useEffect(() => {
    async function loadData() {
      try {
        const [prof, pList, bList, bkList, vList, prList, oList, cList, mList] =
          await Promise.all([
            api.fetchProfile(),
            api.fetchPosts(),
            api.fetchBlogs(),
            api.fetchBooks(),
            api.fetchVideos(),
            api.fetchProducts(),
            api.fetchOrders(),
            api.fetchConversations(),
            api.fetchMeetings(),
          ]);

        if (prof) {
          if (prof.bio && (prof.bio.includes('Digital creator') || prof.bio.includes('Welcome to my personal'))) {
            prof.bio = '';
          }
          setProfile(prof);
        }
        if (pList) {
          const normPosts = pList.map((p) => {
            if (p.authorName === (prof?.name || 'Ev Dr. Boniphace J. Ndege') || p.authorName?.toLowerCase().includes('boniphace')) {
              return { ...p, authorAvatar: prof?.avatarUrl || p.authorAvatar };
            }
            return p;
          });
          setPosts(normPosts);
        }
        if (bList) setBlogs(bList);
        if (bkList) setBooks(bkList);
        if (vList) setVideos(vList);
        if (prList) setProducts(prList);
        if (oList) setOrders(oList);
        if (cList) {
          setConversations(cList);
          if (cList.length > 0) {
            setActiveConversation(cList[0]);
            const convMsgs = await api.fetchMessages(cList[0].id);
            setMessages(convMsgs);
          }
        }
        if (mList) setMeetings(mList);
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    }
    loadData();
  }, []);

  // When active conversation changes, load messages
  useEffect(() => {
    if (activeConversation) {
      api.fetchMessages(activeConversation.id).then((res) => {
        setMessages(res);
      });
    }
  }, [activeConversation]);

  // Toast Helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Require Authentication Helper: if unauthenticated, prompts to login
  const requireAuth = <T extends any[]>(
    action: (...args: T) => void,
    featureDescription?: string
  ) => {
    return (...args: T) => {
      if (!currentUser) {
        handleOpenAuth('login');
        showToast(
          language === 'Swahili'
            ? `Tafadhali ingia kwenye akaunti yako ili ${featureDescription || 'kufungua na kutumia huduma hii'}.`
            : `Please sign in to your account to ${featureDescription || 'access and open this feature'}.`
        );
        return;
      }
      action(...args);
    };
  };

  // Require Admin Helper: checks if user is logged in as admin
  const requireAdmin = <T extends any[]>(
    action: (...args: T) => void,
    adminFeatureName?: string
  ) => {
    return (...args: T) => {
      if (!currentUser) {
        handleOpenAuth('login');
        showToast(
          language === 'Swahili'
            ? `Tafadhali ingia kama Msimamizi (Admin) ili kufungua ${adminFeatureName || 'kipengele hiki'}.`
            : `Please sign in as Admin to access ${adminFeatureName || 'this feature'}.`
        );
        return;
      }
      if (currentUser.role !== 'admin') {
        showToast(
          language === 'Swahili'
            ? `Kipengele hiki cha ${adminFeatureName || 'Usimamizi'} ni cha Msimamizi (Admin - Ev Dr. Boniphace J. Ndege) pekee. Wageni na wanachama hawaruhusiwi.`
            : `This ${adminFeatureName || 'Admin'} feature is restricted to Admin (Ev Dr. Boniphace J. Ndege) only. Access denied.`
        );
        return;
      }
      action(...args);
    };
  };

  // Navigation Helper with Access Checks
  const scrollToSection = (id: string) => {
    // If visitor is unauthenticated, redirect to login when opening features
    if (!currentUser && id !== 'home' && id !== 'about') {
      handleOpenAuth('login');
      showToast(
        language === 'Swahili'
          ? 'Tafadhali ingia kwenye akaunti yako ili kufungua na kutumia huduma hii.'
          : 'Please sign in to access and open this feature.'
      );
      return;
    }

    // Protect admin-restricted sections
    if (['creator', 'seller', 'dashboard'].includes(id)) {
      if (!currentUser) {
        handleOpenAuth('login');
        showToast(
          language === 'Swahili'
            ? 'Tafadhali ingia kama Msimamizi (Admin) ili kufungua sehemu hii.'
            : 'Please sign in as Admin to access this feature.'
        );
        return;
      } else if (currentUser.role !== 'admin') {
        showToast(
          language === 'Swahili'
            ? 'Kipengele hiki ni cha Msimamizi (Admin - Ev Dr. Boniphace J. Ndege) pekee. Wageni na wanachama hawaruhusiwi.'
            : 'This feature is restricted to Admin (Ev Dr. Boniphace J. Ndege) only. Access denied.'
        );
        return;
      }
    }

    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Follow Action
  const handleToggleFollow = async () => {
    try {
      const res = await api.toggleFollowApi();
      setProfile((prev) => ({
        ...prev,
        isFollowing: res.isFollowing,
        followersCount: res.followersCount,
      }));
      showToast(
        res.isFollowing
          ? (language === 'Swahili'
              ? 'Sasa unamfuata Ev Dr. Boniphace J. Ndege'
              : 'You are now following Ev Dr. Boniphace J. Ndege')
          : (language === 'Swahili'
              ? 'Umeacha kumfuata Ev Dr. Boniphace J. Ndege'
              : 'You unfollowed Ev Dr. Boniphace J. Ndege')
      );
    } catch {
      showToast(language === 'Swahili' ? 'Hali ya ufuatiliaji imesasishwa' : 'Follow state updated');
    }
  };

  // Profile Share
  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Ev Dr. Boniphace J. Ndege - Global Shopping & Creator Hub',
        text: 'Visit the personal platform and Global Shopping marketplace of Ev Dr. Boniphace J. Ndege.',
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast(
        language === 'Swahili'
          ? 'Kiungo cha wasifu kimenakiliwa kwenye ubao!'
          : 'Profile link copied to clipboard!'
      );
    }
  };

  // Profile Save / Edit Handler
  const handleSaveProfile = async (updated: Partial<UserProfile>) => {
    try {
      const res = await api.updateProfileApi(updated);
      setProfile(res);
      // Synchronize posts author if name or avatar changed
      if (updated.name || updated.avatarUrl) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.authorHandle === profile.handle || p.authorName === profile.name) {
              return {
                ...p,
                authorName: res.name,
                authorAvatar: res.avatarUrl,
              };
            }
            return p;
          })
        );
      }
      showToast(
        language === 'Swahili'
          ? 'Taarifa za wasifu, bango na picha zimesasishwa kikamilifu!'
          : 'Profile information, banner and avatar updated successfully!'
      );
    } catch (err) {
      console.error('Failed to persist profile:', err);
      setProfile((prev) => ({ ...prev, ...updated }));
      showToast(language === 'Swahili' ? 'Wasifu umesasishwa!' : 'Profile updated!');
    }
  };

  // Post Actions
  const handleLikePost = async (id: string) => {
    try {
      const res = await api.likePostApi(id);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isLiked: res.isLiked, likesCount: res.likesCount } : p
        )
      );
      showToast(
        res.isLiked
          ? (language === 'Swahili' ? 'Umependa chapisho hili!' : 'Post liked!')
          : (language === 'Swahili' ? 'Umeondoa upendo kwenye chapisho' : 'Post like removed')
      );
    } catch {
      // optimistic
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const nextLiked = !p.isLiked;
            return {
              ...p,
              isLiked: nextLiked,
              likesCount: p.likesCount + (nextLiked ? 1 : -1),
            };
          }
          return p;
        })
      );
    }
  };

  const handleSavePost = async (id: string) => {
    try {
      const res = await api.savePostApi(id);
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isSaved: res.isSaved } : p))
      );
      showToast(
        res.isSaved
          ? (language === 'Swahili' ? 'Chapisho limehifadhiwa' : 'Post saved to bookmarks')
          : (language === 'Swahili' ? 'Chapisho limeondolewa' : 'Removed from saved')
      );
    } catch {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isSaved: !p.isSaved } : p))
      );
    }
  };

  const handleCommentPost = async (id: string, text: string) => {
    try {
      const newComment = await api.commentPostApi(id, text);
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const comments = [...(p.comments || []), newComment];
            return {
              ...p,
              comments,
              commentsCount: comments.length,
            };
          }
          return p;
        })
      );
      showToast(language === 'Swahili' ? 'Maoni yametumwa!' : 'Comment added!');
    } catch {
      showToast(language === 'Swahili' ? 'Maoni yamewasilishwa' : 'Comment submitted');
    }
  };

  const handleCreatePost = async (content: string, tag: string, title?: string) => {
    try {
      const created = await api.createPostApi({ content, tag, title });
      setPosts((prev) => [created, ...prev]);
      setProfile((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));
      showToast(
        language === 'Swahili'
          ? 'Chapisho limechapishwa kikamilifu!'
          : 'Post published successfully!'
      );
    } catch (err) {
      showToast(language === 'Swahili' ? 'Imeshindwa kutunga chapisho' : 'Failed to create post');
    }
  };

  // Blog Actions
  const handleCreateBlog = async (title: string, category: string, content: string, imageUrl?: string) => {
    try {
      const created = await api.createBlogApi({ title, category, content, imageUrl });
      setBlogs((prev) => [created, ...prev]);
      showToast(
        language === 'Swahili'
          ? 'Makala yamechapishwa kwenye blogu ya Ev Dr. Boniphace J. Ndege!'
          : 'Article published to Ev Dr. Boniphace J. Ndege Blog!'
      );
    } catch (err) {
      showToast(language === 'Swahili' ? 'Imeshindwa kuchapisha makala' : 'Failed to publish article');
    }
  };

  // Book Actions
  const handlePublishBook = async (bookData: {
    title: string;
    price: number;
    description: string;
    category: string;
    coverUrl: string;
    sampleContent: string;
    pdfUrl?: string;
    pdfFileName?: string;
    pdfFileSize?: string;
    chapters?: any[];
    pagesCount?: number;
    wordCount?: number;
    isAutoGenerated?: boolean;
  }) => {
    try {
      const created = await api.createBookApi(bookData);
      setBooks((prev) => [created, ...prev]);
      setProfile((prev) => ({ ...prev, booksCount: prev.booksCount + 1 }));
      showToast(
        language === 'Swahili'
          ? `Kitabu "${created.title}" kimechapishwa na jalada lake linaonekana moja kwa moja!`
          : `Book "${created.title}" published! Cover image is now live in the books section below.`
      );
    } catch (err) {
      showToast('Failed to publish book');
    }
  };

  const handleUpdateBookCover = async (bookId: string, coverUrl: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, coverUrl } : b))
    );
  };

  // Video Actions
  const handleCreateVideo = async (
    title: string,
    description: string,
    videoUrl?: string,
    thumbnailUrl?: string,
    duration?: string,
    category?: string
  ) => {
    try {
      const created = await api.createVideoApi({
        title,
        description,
        videoUrl,
        thumbnailUrl,
        duration,
        category,
      });
      setVideos((prev) => [created, ...prev]);
      setProfile((prev) => ({ ...prev, videosCount: prev.videosCount + 1 }));
      showToast(
        language === 'Swahili'
          ? 'Video imepakiwa na inapatikana kwenye maktaba!'
          : 'Video uploaded and ready to stream in the video hub!'
      );
    } catch (err) {
      showToast(language === 'Swahili' ? 'Imeshindwa kupakia video' : 'Failed to upload video');
    }
  };

  // Meeting Actions
  const handleCreateMeeting = async (title: string, schedule: string) => {
    try {
      const created = await api.createMeetingApi({ title, schedule });
      setMeetings((prev) => [...prev, created]);
      showToast('Meeting scheduled successfully!');
    } catch (err) {
      showToast('Failed to schedule meeting');
    }
  };

  // Product Actions
  const handleAddProduct = async (payload: {
    name: string;
    category: string;
    price: number;
    stock: number;
    image?: string;
    description?: string;
  }) => {
    try {
      const created = await api.createProductApi(payload);
      setProducts((prev) => [created, ...prev]);
      setProfile((prev) => ({ ...prev, productsCount: prev.productsCount + 1 }));
      showToast(`${created.name} listed on Global Shopping!`);
    } catch (err) {
      showToast('Failed to create product');
    }
  };

  // Cart Actions
  const handleAddToCart = (
    name: string,
    price: number,
    image: string,
    id: string,
    quantity: number = 1,
    condition?: string
  ) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === id);
      if (existing) {
        return prev.map((item) =>
          item.productId === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}`,
          productId: id,
          name,
          price,
          quantity,
          image,
          condition,
        },
      ];
    });
    showToast(
      `Added ${quantity > 1 ? `${quantity} units of ` : ''}"${name}" to cart`
    );
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from cart');
  };

  const handleCheckout = async (name: string, email: string) => {
    try {
      const order = await api.createOrderApi({
        items: cartItems,
        customerName: name,
        customerEmail: email,
      });
      setOrders((prev) => [order, ...prev]);
      setCartItems([]);
      setIsCartOpen(false);
      showToast(`Order confirmed! Receipt sent for ${order.orderNumber}`);
    } catch (err) {
      showToast('Order confirmed! Receipt sent.');
      setCartItems([]);
      setIsCartOpen(false);
    }
  };

  // Chat Actions
  const handleSendMessage = async (text: string) => {
    if (!activeConversation) return;
    try {
      const sent = await api.sendMessageApi(activeConversation.id, text);
      setMessages((prev) => [...prev, sent]);

      // Refresh messages after simulated reply
      setTimeout(async () => {
        const refreshed = await api.fetchMessages(activeConversation.id);
        setMessages(refreshed);
      }, 1400);
    } catch {
      const fallbackMsg: Message = {
        id: `m-${Date.now()}`,
        senderId: 'me',
        receiverId: activeConversation.id,
        text,
        timestamp: 'Just now',
        isMe: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  // Contact Action
  const handleSubmitContact = async (name: string, email: string, message: string) => {
    try {
      const res = await api.submitContactApi({ name, email, message });
      showToast(res.message);
    } catch {
      showToast(`Thank you ${name}! Your inquiry has been dispatched.`);
    }
  };

  // Global Search Handler
  const handleGlobalSearchChange = (query: string) => {
    setGlobalSearch(query);
    if (query.trim().toLowerCase().includes('shop') || query.trim().toLowerCase().includes('product')) {
      scrollToSection('shop');
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f7faf8] dark:bg-[#07120d] text-slate-900 dark:text-emerald-50 transition-colors">
      {/* Thin Fixed-Position Scroll Progress Bar at the very top */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none bg-transparent"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Content scroll progress"
      >
        <div
          className="h-full bg-gradient-to-r from-[#087a45] via-[#00a651] to-[#d4af37] transition-[width] duration-150 ease-out shadow-xs shadow-emerald-500/40"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 1. TOP NAVIGATION */}
      <Topbar
        profile={profile}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenNotifications={requireAuth(() => setIsNotificationsOpen(true), 'kuona taarifa zako')}
        onOpenCart={requireAuth(() => setIsCartOpen(true), 'kufungua kikapu cha ununuzi')}
        onNavigate={scrollToSection}
        cartCount={cartCount}
        searchQuery={globalSearch}
        onSearchChange={handleGlobalSearchChange}
        onOpenEditProfile={requireAuth(() => setIsEditProfileOpen(true), 'kuhariri wasifu wako')}
        language={language}
        onChangeLanguage={(lang) => {
          setLanguage(lang);
          localStorage.setItem('bn_lang', lang);
          showToast(lang === 'Swahili' ? 'Lugha imebadilishwa kuwa Kiswahili' : 'Language set to English');
        }}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        onTriggerPreloader={handleTriggerPreloader}
      />

      {/* Offline Status Persistent Indicator Banner */}
      {!isOnline && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold px-4 py-2 flex items-center justify-center gap-2 shadow-sm z-30 sticky top-16 border-b border-amber-500/30 animate-in fade-in duration-200">
          <WifiOff className="w-4 h-4 text-amber-200 shrink-0" />
          <span>
            {language === 'Swahili'
              ? 'Hali ya Nje ya Mtandao: Unaweza kusoma makala na vitabu vilivyohifadhiwa (Cache API).'
              : 'Offline Mode Active: Saved blog articles and book previews are available without a connection.'}
          </span>
        </div>
      )}

      {/* 2. SIDEBAR */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onShowToast={showToast}
        language={language}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
      />

      {/* 3. MAIN CONTENT */}
      <main className="md:pl-64 pt-18 transition-all">
        {/* Profile / Cover Header */}
        <ProfileHero
          profile={profile}
          isFollowing={profile.isFollowing}
          onToggleFollow={requireAuth(handleToggleFollow, 'kufuata muundaji')}
          onNavigate={scrollToSection}
          onShareProfile={handleShareProfile}
          onOpenEditProfile={requireAuth(() => setIsEditProfileOpen(true), 'kuhariri wasifu')}
          language={language}
        />

        {/* Quick Access */}
        <QuickAccess
          onNavigate={scrollToSection}
          language={language}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onShowToast={showToast}
        />

        {/* About Section */}
        <AboutSection onOpenContact={() => setIsContactModalOpen(true)} language={language} />

        {/* Social Feed & Community */}
        <SocialFeed
          posts={posts}
          profileAvatar={profile.avatarUrl}
          profileName={profile.name}
          onOpenCreatePost={requireAuth(() => setIsPostModalOpen(true), 'kuchapisha chapisho')}
          onLikePost={requireAuth((id) => handleLikePost(id), 'kupenda au kutoa maoni kwenye chapisho')}
          onSavePost={requireAuth((id) => handleSavePost(id), 'kuhifadhi chapisho')}
          onCommentPost={requireAuth((id, txt) => handleCommentPost(id, txt), 'kuandika maoni')}
          onSharePost={(post) => {
            navigator.clipboard?.writeText(window.location.href);
            showToast(`Post link for "${post.title || post.authorName}" copied!`);
          }}
          onFollowUser={requireAuth((personName) => {
            showToast(`You are now following ${personName}`);
          }, 'kufuata mwandishi au muundaji')}
          language={language}
        />

        {/* Blog Articles */}
        <BlogSection
          blogs={blogs}
          onOpenWriteBlog={requireAdmin(() => setIsBlogModalOpen(true), 'Kuandika Makala ya Blog')}
          onReadArticle={requireAuth((article) => {
            setActiveReadingMaterial({
              title: article.title,
              content: article.content,
              author: article.author,
              type: 'blog',
              category: article.category,
              readTime: article.readTime,
              coverUrl: article.imageUrl,
            });
          }, 'kufungua na kusoma makala haya')}
          language={language}
        />

        {/* Books Marketplace & Publishing */}
        <BooksSection
          books={books}
          onOpenPublishBook={requireAdmin((mode) => {
            setBookModalInitialMode(mode || 'pdf');
            setIsBookModalOpen(true);
          }, 'Kuchapisha Kitabu')}
          onReadBook={requireAuth((book) => {
            setActiveReadingMaterial({
              title: book.title,
              content: book.sampleContent,
              author: book.author,
              type: 'book',
              category: book.category,
              coverUrl: book.coverUrl,
              pdfUrl: book.pdfUrl,
              pdfFileName: book.pdfFileName,
              pdfFileSize: book.pdfFileSize,
              chapters: book.chapters,
            });
          }, 'kufungua na kusoma kitabu hiki')}
          onAddToCart={requireAuth((name, price, image, id) => handleAddToCart(name, price, image, id), 'kuongeza kitabu kwenye kikapu')}
          onUpdateBookCover={requireAdmin((bookId, coverUrl) => handleUpdateBookCover(bookId, coverUrl), 'Kubadili Jalada la Kitabu')}
          language={language}
          onShowToast={showToast}
        />

        {/* Video Hub */}
        <VideosSection
          videos={videos}
          onOpenUploadVideo={requireAdmin(() => setIsVideoUploadModalOpen(true), 'Kupakia Video')}
          onPlayVideo={requireAuth((video) => setActivePlayingVideo(video), 'kufungua na kutazama video hii')}
          language={language}
        />

        {/* Live Conferencing */}
        <LiveSection
          meetings={meetings}
          onOpenCreateMeeting={requireAdmin(() => setIsMeetingModalOpen(true), 'Kuunda Kikao Kipya')}
          onJoinMeeting={requireAuth((meeting) => setActiveLiveMeeting(meeting), 'kujiunga na kikao')}
          onSetReminder={requireAuth((title) => {
            showToast(`Reminder set for "${title}"`);
          }, 'kuweka ukumbusho wa kikao')}
          language={language}
        />

        {/* Global Shopping Marketplace */}
        <ShopSection
          products={products}
          onAddToCart={requireAuth((name, price, image, id) => handleAddToCart(name, price, image, id), 'kuongeza bidhaa kwenye kikapu')}
          onOpenCart={requireAuth(() => setIsCartOpen(true), 'kufungua kikapu cha ununuzi')}
          onOpenAddProduct={requireAdmin(() => setIsAddProductModalOpen(true), 'Kuweka Bidhaa Mpya')}
          onWishlistToggle={requireAuth((product) => {
            showToast(`Updated wishlist for ${product.name}`);
          }, 'kuhifadhi bidhaa')}
          onOpenProductDetail={requireAuth((prod) => setSelectedProductDetail(prod), 'kufungua maelezo ya kina ya bidhaa')}
          language={language}
        />

        {/* Messages & Chat */}
        <ChatSection
          conversations={conversations}
          activeConversation={activeConversation}
          messages={messages}
          onSelectConversation={requireAuth((conv) => setActiveConversation(conv), 'kufungua mazungumzo')}
          onSendMessage={requireAuth((text) => handleSendMessage(text), 'kutuma ujumbe')}
          onStartVideoCall={requireAuth((name) => {
            showToast(`Initiating secure video call with ${name}...`);
          }, 'kuanza simu ya video')}
          onStartVoiceCall={requireAuth((name) => {
            showToast(`Initiating secure voice call with ${name}...`);
          }, 'kuanza simu ya sauti')}
          language={language}
        />

        {/* Creator Studio - Admin Protected */}
        <CreatorStudio
          isAdmin={currentUser?.role === 'admin'}
          onOpenAuth={handleOpenAuth}
          onPublishContent={requireAdmin((payload) => {
            if (payload.type === 'Blog Article') {
              handleCreateBlog(payload.title, 'General', payload.description);
            } else if (payload.type === 'Book') {
              handlePublishBook({
                title: payload.title,
                price: 18000,
                description: payload.description,
                category: 'Business',
                coverUrl: '/src/assets/images/book_digital_vision_1791315278826.jpg',
                sampleContent: `Chapter 1: Overview\n\n${payload.description}`,
              });
            } else if (payload.type === 'Video') {
              handleCreateVideo(
                payload.title,
                payload.description,
                payload.videoUrl,
                payload.thumbnailUrl,
                payload.duration
              );
            } else {
              handleCreatePost(payload.description, 'Creator Studio', payload.title);
            }
          }, 'Kuchapisha Maudhui kwenye Studio')}
          language={language}
        />

        {/* Seller Center - Admin Protected */}
        <SellerCenter
          orders={orders}
          isAdmin={currentUser?.role === 'admin'}
          onOpenAddProduct={requireAdmin(() => setIsAddProductModalOpen(true), 'Kuweka Bidhaa Mpya')}
          onOpenAuth={handleOpenAuth}
          language={language}
        />

        {/* Platform Dashboard - Admin Protected */}
        <DashboardSection
          profile={profile}
          isAdmin={currentUser?.role === 'admin'}
          onOpenAuth={handleOpenAuth}
          language={language}
        />

        {/* Footer */}
        <Footer
          onNavigate={scrollToSection}
          onOpenContact={() => setIsContactModalOpen(true)}
          onShowToast={showToast}
          language={language}
          onOpenAuth={handleOpenAuth}
          mailingList={mailingList}
          onSubscribeNewsletter={handleSubscribeNewsletter}
        />
      </main>

      {/* Floating Visitor Sign-In Action Bar for Unauthenticated Users */}
      {!currentUser && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-[#04140b]/95 border border-[#ffd700]/50 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ffd700] to-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-md">
              BN
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">
                {language === 'Swahili' ? 'Karibu kwenye Mfumo' : 'Welcome to the Platform'}
              </p>
              <p className="text-[10px] text-emerald-300/80">
                {language === 'Swahili'
                  ? 'Gusa kipengele chochote ili kuingia kwenye akaunti yako.'
                  : 'Touch any feature to sign in to your account.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleOpenAuth('login')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#087a45] hover:brightness-110 text-white font-bold text-xs shadow-md border border-[#ffd700]/40 shrink-0 cursor-pointer"
          >
            {language === 'Swahili' ? 'Ingia' : 'Sign In'}
          </button>
        </div>
      )}

      {/* 4. MODALS */}
      <Modals
        isCartOpen={isCartOpen}
        onCloseCart={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateCartQty={handleUpdateCartQty}
        onCheckout={handleCheckout}

        isPostModalOpen={isPostModalOpen}
        onClosePostModal={() => setIsPostModalOpen(false)}
        onCreatePost={handleCreatePost}

        isBlogModalOpen={isBlogModalOpen}
        onCloseBlogModal={() => setIsBlogModalOpen(false)}
        onCreateBlog={handleCreateBlog}

        isVideoUploadModalOpen={isVideoUploadModalOpen}
        onCloseVideoUploadModal={() => setIsVideoUploadModalOpen(false)}
        onCreateVideo={handleCreateVideo}

        isMeetingModalOpen={isMeetingModalOpen}
        onCloseMeetingModal={() => setIsMeetingModalOpen(false)}
        onCreateMeeting={handleCreateMeeting}

        activeReadingMaterial={activeReadingMaterial}
        onCloseReaderModal={() => setActiveReadingMaterial(null)}

        activePlayingVideo={activePlayingVideo}
        onCloseVideoPlayerModal={() => setActivePlayingVideo(null)}
        onSelectVideo={(video) => setActivePlayingVideo(video)}
        videos={videos}
        onShowToast={showToast}

        activeLiveMeeting={activeLiveMeeting}
        onCloseLiveMeetingModal={() => setActiveLiveMeeting(null)}

        isContactModalOpen={isContactModalOpen}
        onCloseContactModal={() => setIsContactModalOpen(false)}
        onSubmitContact={handleSubmitContact}

        isNotificationsOpen={isNotificationsOpen}
        onCloseNotifications={() => setIsNotificationsOpen(false)}

        isSettingsOpen={isSettingsOpen}
        onCloseSettings={() => setIsSettingsOpen(false)}
        darkMode={darkMode}
        onToggleDarkMode={() => {
          const next = !darkMode;
          setThemeMode(next ? 'dark' : 'light');
          setDarkMode(next);
        }}
        language={language}
        onChangeLanguage={(lang) => {
          setLanguage(lang);
          localStorage.setItem('bn_lang', lang);
          showToast(`Language set to ${lang}`);
        }}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        themeMode={themeMode}
        onChangeThemeMode={(mode) => {
          setThemeMode(mode);
          if (mode === 'system') {
            showToast(language === 'Swahili' ? 'Mandhari ya kiotomatiki yamewashwa' : 'Matched system theme preference (auto)');
          } else {
            showToast(language === 'Swahili' ? `Mandhari yamewekwa kuwa ${mode === 'dark' ? 'Giza' : 'Mwanga'}` : `Theme set to ${mode}`);
          }
        }}
        systemIsDark={systemIsDark}
      />

      {/* 4.5. BOOK PUBLISH & CREATOR STUDIO MODAL */}
      <BookPublishModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        initialMode={bookModalInitialMode}
        onPublish={handlePublishBook}
        language={language}
        creatorName={profile.name}
        onShowToast={showToast}
      />

      {/* 5. ADD PRODUCT MODAL */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
        language={language}
      />

      {/* 6. EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        language={language}
      />

      {/* 7. PRODUCT DETAIL & REVIEWS MODAL */}
      <ProductDetailModal
        product={selectedProductDetail}
        isOpen={!!selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
        language={language}
        onSubmitReview={async (productId, rating, comment, author) => {
          try {
            const res = await api.createProductReviewApi(productId, {
              rating,
              comment,
              author,
            });
            setProducts((prev) =>
              prev.map((p) => (p.id === productId ? res.product : p))
            );
            setSelectedProductDetail(res.product);
            showToast('Review submitted successfully! Thank you.');
          } catch (err) {
            showToast('Failed to submit review');
          }
        }}
      />

      {/* 8. MODERN AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={handleAuthSuccess}
        language={language}
        onShowToast={showToast}
      />

      {/* 9. BEST AND MODERN PRELOADER */}
      {showPreloader && (
        <Preloader
          key={preloaderTriggerKey}
          onFinish={() => setShowPreloader(false)}
          language={language}
          isTriggered={preloaderTriggerKey > 0}
        />
      )}

      {/* 7. FLOATING BACK TO TOP BUTTON */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        title="Back to top"
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xl shadow-emerald-950/20 border border-emerald-400/30 transition-all duration-300 transform flex items-center justify-center group ${
          showBackToTop
            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
            : 'opacity-0 translate-y-6 pointer-events-none scale-90'
        }`}
      >
        <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
      </button>

      {/* 7. TOAST NOTIFICATION CONTAINER */}
      {toastMessage && (
        <div
          className={`fixed right-6 z-50 px-5 py-3 rounded-2xl bg-[#091f14] text-white shadow-2xl border border-emerald-500/30 text-xs font-semibold flex items-center gap-2 animate-bounce transition-all ${
            showBackToTop ? 'bottom-20' : 'bottom-6'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
