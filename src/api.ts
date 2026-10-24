import {
  UserProfile,
  Post,
  BlogArticle,
  Book,
  VideoItem,
  Product,
  Order,
  Conversation,
  Message,
  Meeting,
  AuthUser,
  LoginCredentials,
  SignupCredentials,
  ResetPasswordPayload,
  BookChapter,
} from './types';
import {
  cacheBlogsOffline,
  getCachedBlogsOffline,
  cacheBooksOffline,
  getCachedBooksOffline,
} from './utils/offlineStorage';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function fetchProfile(): Promise<UserProfile> {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('Failed to load profile');
    const data: UserProfile = await res.json();
    if (data.bio && (data.bio.includes('Digital creator') || data.bio.includes('Welcome to my personal'))) {
      data.bio = '';
    }
    localStorage.setItem('bn_profile_cache', JSON.stringify(data));
    return data;
  } catch (err) {
    const cached = localStorage.getItem('bn_profile_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.bio && (parsed.bio.includes('Digital creator') || parsed.bio.includes('Welcome to my personal'))) {
          parsed.bio = '';
        }
        return parsed;
      } catch {
        // ignore
      }
    }
    return {
      name: 'Ev Dr. Boniphace J. Ndege',
      handle: '@boniphacendege',
      title: 'PERSONAL BRAND · CREATOR · ENTREPRENEUR',
      bio: '',
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
    };
  }
}

export async function updateProfileApi(payload: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  const updated = await res.json();
  localStorage.setItem('bn_profile_cache', JSON.stringify(updated));
  return updated;
}

export async function toggleFollowApi(): Promise<{ isFollowing: boolean; followersCount: number }> {
  try {
    const res = await fetch('/api/profile/follow', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to update follow');
    return await res.json();
  } catch (err) {
    const current = localStorage.getItem('bn_followed') === 'true';
    const next = !current;
    localStorage.setItem('bn_followed', String(next));
    return { isFollowing: next, followersCount: next ? 12843 : 12842 };
  }
}

export async function fetchPosts(): Promise<Post[]> {
  try {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('Failed to fetch posts');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function createPostApi(payload: {
  content: string;
  tag?: string;
  title?: string;
  imageUrl?: string;
  imageAspectRatio?: '1:1' | '16:9';
}): Promise<Post> {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return await res.json();
}

export async function likePostApi(id: string): Promise<{ isLiked: boolean; likesCount: number }> {
  const res = await fetch(`/api/posts/${id}/like`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to like post');
  return await res.json();
}

export async function savePostApi(id: string): Promise<{ isSaved: boolean }> {
  const res = await fetch(`/api/posts/${id}/save`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to save post');
  return await res.json();
}

export async function commentPostApi(id: string, text: string) {
  const res = await fetch(`/api/posts/${id}/comment`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to post comment');
  return await res.json();
}

export async function fetchBlogs(): Promise<BlogArticle[]> {
  try {
    const res = await fetch('/api/blogs');
    if (!res.ok) throw new Error('Failed to fetch blogs');
    const data: BlogArticle[] = await res.json();
    // Cache for offline reading persistence
    cacheBlogsOffline(data).catch(() => {});
    return data;
  } catch (err) {
    // Offline persistence fallback from Cache API / storage
    const cached = await getCachedBlogsOffline();
    return cached;
  }
}

export async function createBlogApi(payload: {
  title: string;
  category: string;
  content: string;
  imageUrl?: string;
}): Promise<BlogArticle> {
  const res = await fetch('/api/blogs', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to publish blog');
  return await res.json();
}

export async function fetchBooks(): Promise<Book[]> {
  try {
    const res = await fetch('/api/books');
    if (!res.ok) throw new Error('Failed to fetch books');
    const data: Book[] = await res.json();
    // Cache for offline reading persistence
    cacheBooksOffline(data).catch(() => {});
    return data;
  } catch (err) {
    // Offline persistence fallback from Cache API / storage
    const cached = await getCachedBooksOffline();
    return cached;
  }
}

export async function createBookApi(payload: {
  title: string;
  price: number;
  description: string;
  category?: string;
  coverUrl?: string;
  sampleContent?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  chapters?: BookChapter[];
  pagesCount?: number;
  wordCount?: number;
  isAutoGenerated?: boolean;
}): Promise<Book> {
  const res = await fetch('/api/books', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to publish book');
  return await res.json();
}

export async function updateBookApi(id: string, updates: Partial<Book>): Promise<Book> {
  const res = await fetch(`/api/books/${id}`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update book');
  return await res.json();
}

export async function uploadPdfApi(payload: {
  pdfData: string;
  fileName: string;
}): Promise<{ url: string; fileName: string; size: string; pagesCount?: number }> {
  const res = await fetch('/api/upload-pdf', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to upload PDF manuscript');
  return data;
}

export async function uploadCoverApi(payload: {
  imageData: string;
  fileName?: string;
}): Promise<{ url: string; fileName: string }> {
  const res = await fetch('/api/upload-cover', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to upload cover image');
  return data;
}

export async function fetchVideos(): Promise<VideoItem[]> {
  try {
    const res = await fetch('/api/videos');
    if (!res.ok) throw new Error('Failed to fetch videos');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function createVideoApi(payload: {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  duration?: string;
  category?: string;
}): Promise<VideoItem> {
  const res = await fetch('/api/videos', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to upload video');
  return await res.json();
}

export async function likeVideoApi(videoId: string): Promise<{ id: string; isLiked: boolean; likesCount: number }> {
  const res = await fetch(`/api/videos/${videoId}/like`, {
    method: 'POST',
    headers: JSON_HEADERS,
  });
  if (!res.ok) throw new Error('Failed to like video');
  return await res.json();
}

export async function commentVideoApi(
  videoId: string,
  text: string,
  author?: string,
  avatar?: string
): Promise<{ id: string; author: string; avatar: string; text: string; time: string }> {
  const res = await fetch(`/api/videos/${videoId}/comments`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ text, author, avatar }),
  });
  if (!res.ok) throw new Error('Failed to post video comment');
  return await res.json();
}

export async function viewVideoApi(videoId: string): Promise<{ id: string; views: string }> {
  try {
    const res = await fetch(`/api/videos/${videoId}/view`, {
      method: 'POST',
      headers: JSON_HEADERS,
    });
    if (!res.ok) throw new Error('Failed to register video view');
    return await res.json();
  } catch {
    return { id: videoId, views: '1' };
  }
}

export async function fetchProducts(category = 'All', q = ''): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (q) params.set('q', q);
    const res = await fetch(`/api/products?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function createProductApi(payload: {
  name: string;
  category: string;
  price: number;
  stock?: number;
  condition?: string;
  image?: string;
  description?: string;
}): Promise<Product> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return await res.json();
}

export async function createProductReviewApi(
  productId: string,
  payload: { author?: string; rating: number; comment: string }
): Promise<{ product: Product; review: any }> {
  const res = await fetch(`/api/products/${productId}/reviews`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit review');
  return await res.json();
}

export async function createOrderApi(payload: {
  items: any[];
  customerName?: string;
  customerEmail?: string;
}): Promise<Order> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create order');
  return await res.json();
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await fetch('/api/orders');
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function fetchConversations(): Promise<Conversation[]> {
  try {
    const res = await fetch('/api/conversations');
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function fetchMessages(convId: string): Promise<Message[]> {
  try {
    const res = await fetch(`/api/messages/${convId}`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function sendMessageApi(convId: string, text: string): Promise<Message> {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ convId, text }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return await res.json();
}

export async function fetchMeetings(): Promise<Meeting[]> {
  try {
    const res = await fetch('/api/meetings');
    if (!res.ok) throw new Error('Failed to fetch meetings');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function createMeetingApi(payload: {
  title: string;
  schedule?: string;
}): Promise<Meeting> {
  const res = await fetch('/api/meetings', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create meeting');
  return await res.json();
}

export async function submitContactApi(payload: {
  name: string;
  email: string;
  message: string;
}) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit message');
  return await res.json();
}

// Authentication API methods
export async function loginApi(credentials: LoginCredentials): Promise<{
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to sign in');
  return data;
}

export async function registerApi(credentials: SignupCredentials): Promise<{
  success: boolean;
  message: string;
  otpCode: string;
  email: string;
  requiresOtp: boolean;
  user: AuthUser;
}> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create account');
  return data;
}

export async function sendOtpApi(email: string, purpose: 'signup' | 'reset' | 'login' = 'login'): Promise<{
  success: boolean;
  message: string;
  otpCode: string;
  email: string;
}> {
  const res = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, purpose }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send OTP code');
  return data;
}

export async function verifyOtpApi(email: string, otp: string, rememberMe?: boolean): Promise<{
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}> {
  const res = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, otp, rememberMe }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to verify OTP code');
  return data;
}

export async function resetPasswordApi(payload: ResetPasswordPayload): Promise<{
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}> {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reset password');
  return data;
}

export async function getMeApi(token: string): Promise<{ user: AuthUser }> {
  const res = await fetch('/api/auth/me', {
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
  return data;
}

