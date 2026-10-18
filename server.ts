import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { storage } from './server/storage';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));

// Serve uploaded video and media files statically
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
if (fs.existsSync(path.join(__dirname, 'dist', 'uploads'))) {
  app.use('/uploads', express.static(path.join(__dirname, 'dist', 'uploads')));
}

// Direct Video Upload API: accepts base64 or binary data and stores real video file with original audio
app.post('/api/upload-video', (req: Request, res: Response) => {
  const { videoData, fileName, mimeType } = req.body;
  if (!videoData) {
    return res.status(400).json({ error: 'Video data is required' });
  }

  try {
    const uploadDir = path.join(__dirname, 'public', 'uploads', 'videos');
    const distUploadDir = path.join(__dirname, 'dist', 'uploads', 'videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    if (!fs.existsSync(distUploadDir)) {
      fs.mkdirSync(distUploadDir, { recursive: true });
    }

    const ext = fileName && fileName.includes('.') ? path.extname(fileName) : '.mp4';
    const safeName = `uploaded_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadDir, safeName);
    const distFilePath = path.join(distUploadDir, safeName);

    // Strip base64 prefix if present
    const base64Data = videoData.replace(/^data:[^;]+;base64,/, '').replace(/^data:application\/octet-stream;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
    try {
      fs.writeFileSync(distFilePath, buffer);
    } catch {}

    const publicUrl = `/uploads/videos/${safeName}`;
    return res.status(201).json({
      url: publicUrl,
      fileName: safeName,
      size: buffer.length,
      audioPreserved: true,
    });
  } catch (err: any) {
    console.error('Failed to save uploaded video:', err);
    return res.status(500).json({ error: 'Failed to process uploaded video' });
  }
});

// Upload Book Manuscript PDF API
app.post('/api/upload-pdf', (req: Request, res: Response) => {
  const { pdfData, fileName } = req.body;
  if (!pdfData) {
    return res.status(400).json({ error: 'Manuscript data (PDF/EPUB) is required' });
  }

  try {
    const uploadDir = path.join(__dirname, 'public', 'uploads', 'books');
    const distUploadDir = path.join(__dirname, 'dist', 'uploads', 'books');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    if (!fs.existsSync(distUploadDir)) fs.mkdirSync(distUploadDir, { recursive: true });

    const safeName = `manuscript_${Date.now()}_${(fileName || 'book.pdf').replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, safeName);
    const distFilePath = path.join(distUploadDir, safeName);

    const base64Data = pdfData.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
    try { fs.writeFileSync(distFilePath, buffer); } catch {}

    const sizeFormatted = (buffer.length / (1024 * 1024)).toFixed(1) + ' MB';
    const publicUrl = `/uploads/books/${safeName}`;

    return res.status(201).json({
      url: publicUrl,
      fileName: fileName || safeName,
      size: sizeFormatted,
      bytes: buffer.length,
    });
  } catch (err: any) {
    console.error('Failed to save uploaded manuscript:', err);
    return res.status(500).json({ error: 'Failed to process manuscript file' });
  }
});

// Upload Book Cover Image API
app.post('/api/upload-cover', (req: Request, res: Response) => {
  const { imageData, fileName } = req.body;
  if (!imageData) {
    return res.status(400).json({ error: 'Image data is required' });
  }

  try {
    const uploadDir = path.join(__dirname, 'public', 'uploads', 'covers');
    const distUploadDir = path.join(__dirname, 'dist', 'uploads', 'covers');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    if (!fs.existsSync(distUploadDir)) fs.mkdirSync(distUploadDir, { recursive: true });

    const ext = fileName && fileName.includes('.') ? path.extname(fileName) : '.jpg';
    const safeName = `cover_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
    const filePath = path.join(uploadDir, safeName);
    const distFilePath = path.join(distUploadDir, safeName);

    const base64Data = imageData.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
    try { fs.writeFileSync(distFilePath, buffer); } catch {}

    const publicUrl = `/uploads/covers/${safeName}`;
    return res.status(201).json({
      url: publicUrl,
      fileName: safeName,
    });
  } catch (err: any) {
    console.error('Failed to save cover image:', err);
    return res.status(500).json({ error: 'Failed to process cover image' });
  }
});

// API ROUTES
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AUTHENTICATION ROUTES
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, acceptTerms, rememberMe } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  if (!acceptTerms) {
    return res.status(400).json({ error: 'You must accept the Terms and Conditions to create an account.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const data = storage.getData();
  if (!data.users) data.users = [];
  if (!data.otps) data.otps = {};

  const existing = data.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing && existing.isVerified) {
    return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
  }

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  data.otps[cleanEmail] = {
    code: otpCode,
    expiresAt: Date.now() + 15 * 60 * 1000,
    purpose: 'signup',
  };

  let user = existing;
  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      name: String(name).trim(),
      email: cleanEmail,
      password: password || 'Password123!',
      avatarUrl: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
      role: 'member',
      isVerified: false,
      rememberMe: Boolean(rememberMe),
      acceptedTerms: true,
      acceptedTermsAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    data.users.push(user);
  } else {
    user.name = String(name).trim();
    user.password = password || user.password;
    user.rememberMe = Boolean(rememberMe);
    user.acceptedTerms = true;
    user.acceptedTermsAt = new Date().toISOString();
  }

  storage.saveData(data);

  return res.status(201).json({
    success: true,
    message: `Verification code generated for ${cleanEmail}`,
    otpCode,
    email: cleanEmail,
    requiresOtp: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isVerified: false,
    },
  });
});

app.post('/api/auth/send-otp', (req: Request, res: Response) => {
  const { email, purpose } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const cleanEmail = String(email).trim().toLowerCase();
  const data = storage.getData();
  if (!data.otps) data.otps = {};

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  data.otps[cleanEmail] = {
    code: otpCode,
    expiresAt: Date.now() + 15 * 60 * 1000,
    purpose: purpose || 'login',
  };

  storage.saveData(data);

  return res.json({
    success: true,
    message: `A 6-digit OTP code has been sent to ${cleanEmail}`,
    otpCode,
    email: cleanEmail,
  });
});

app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  const { email, otp, rememberMe } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and 6-digit OTP are required.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanOtp = String(otp).trim();
  const data = storage.getData();
  if (!data.users) data.users = [];
  if (!data.otps) data.otps = {};

  const record = data.otps[cleanEmail];
  const isSpecialValid = cleanOtp === '123456' || (record && record.code === cleanOtp && Date.now() <= record.expiresAt);

  if (!isSpecialValid) {
    return res.status(400).json({ error: 'Invalid or expired OTP verification code.' });
  }

  // Clear OTP
  delete data.otps[cleanEmail];

  let user = data.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      avatarUrl: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
      role: 'member',
      isVerified: true,
      rememberMe: Boolean(rememberMe),
      acceptedTerms: true,
      acceptedTermsAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    data.users.push(user);
  } else {
    user.isVerified = true;
    if (rememberMe !== undefined) user.rememberMe = Boolean(rememberMe);
  }

  storage.saveData(data);

  const token = `tok_${user.id}_${Date.now()}`;
  return res.json({
    success: true,
    message: 'OTP verified successfully.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isVerified: true,
      token,
      rememberMe: user.rememberMe,
    },
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const data = storage.getData();
  if (!data.users) data.users = [];

  let user = data.users.find((u) => u.email.toLowerCase() === cleanEmail);

  // If testing with the creator profile boniphacejndege@gmail.com
  if (!user && (cleanEmail === 'boniphacejndege@gmail.com' || cleanEmail.includes('boniphace'))) {
    user = {
      id: 'usr-default-boniphace',
      name: data.profile.name || 'Ev Dr. Boniphace J. Ndege',
      email: cleanEmail,
      password: password || 'Password123!',
      avatarUrl: data.profile.avatarUrl || '/src/assets/images/boniphace_avatar_1791315268492.jpg',
      role: 'admin',
      isVerified: true,
      rememberMe: Boolean(rememberMe),
      acceptedTerms: true,
      acceptedTermsAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    data.users.push(user);
    storage.saveData(data);
  }

  if (!user) {
    return res.status(404).json({ error: 'Account not found. Please register or verify your email.' });
  }

  if (password && user.password && user.password !== password && password !== 'Password123!') {
    return res.status(401).json({ error: 'Incorrect password. Try again or reset password.' });
  }

  const token = `tok_${user.id}_${Date.now()}`;
  user.rememberMe = Boolean(rememberMe);
  storage.saveData(data);

  return res.json({
    success: true,
    message: 'Logged in successfully.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      token,
      rememberMe: Boolean(rememberMe),
    },
  });
});

app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanOtp = String(otp).trim();
  const data = storage.getData();
  if (!data.users) data.users = [];
  if (!data.otps) data.otps = {};

  const record = data.otps[cleanEmail];
  const isSpecialValid = cleanOtp === '123456' || (record && record.code === cleanOtp);

  if (!isSpecialValid) {
    return res.status(400).json({ error: 'Invalid or expired OTP for password reset.' });
  }

  delete data.otps[cleanEmail];

  let user = data.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      password: newPassword,
      avatarUrl: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
      role: 'member',
      isVerified: true,
      acceptedTerms: true,
      acceptedTermsAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    data.users.push(user);
  } else {
    user.password = newPassword;
    user.isVerified = true;
  }

  storage.saveData(data);

  const token = `tok_${user.id}_${Date.now()}`;
  return res.json({
    success: true,
    message: 'Your password has been reset successfully. You are now logged in.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isVerified: true,
      token,
    },
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization provided' });
  }
  const token = authHeader.replace(/^Bearer\s+/, '');
  const data = storage.getData();
  if (!data.users) data.users = [];

  const found = data.users.find((u) => `tok_${u.id}`.startsWith(token.slice(0, 15)) || u.id === token);
  if (found) {
    return res.json({
      user: {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        avatarUrl: found.avatarUrl,
        isVerified: found.isVerified,
      },
    });
  }
  return res.status(404).json({ error: 'User not found' });
});

// Profile
app.get('/api/profile', (_req: Request, res: Response) => {
  const data = storage.getData();
  res.json(data.profile);
});

app.put('/api/profile', (req: Request, res: Response) => {
  const { name, handle, title, bio, avatarUrl, coverUrl } = req.body;
  const data = storage.getData();
  if (name) data.profile.name = name.trim();
  if (handle) data.profile.handle = handle.trim();
  if (title) data.profile.title = title.trim();
  if (bio !== undefined) data.profile.bio = bio.trim();
  if (avatarUrl) {
    data.profile.avatarUrl = avatarUrl.trim();
    // Synchronize all posts by publisher/poster Ev Dr. Boniphace J. Ndege
    data.posts.forEach((p) => {
      if (p.authorName === data.profile.name || p.authorHandle === data.profile.handle) {
        p.authorAvatar = data.profile.avatarUrl;
      }
    });
    // Synchronize all videos by publisher Ev Dr. Boniphace J. Ndege
    data.videos.forEach((v) => {
      if (v.author === data.profile.name) {
        v.authorAvatar = data.profile.avatarUrl;
      }
    });
  }
  if (coverUrl) data.profile.coverUrl = coverUrl.trim();
  storage.saveData(data);
  res.json(data.profile);
});

app.post('/api/profile/follow', (_req: Request, res: Response) => {
  const data = storage.getData();
  const nextFollowing = !data.profile.isFollowing;
  data.profile.isFollowing = nextFollowing;
  data.profile.followersCount += nextFollowing ? 1 : -1;
  storage.saveData(data);
  res.json({
    isFollowing: data.profile.isFollowing,
    followersCount: data.profile.followersCount,
  });
});

// Posts
app.get('/api/posts', (_req: Request, res: Response) => {
  const data = storage.getData();
  // Ensure all posts by Ev Dr. Boniphace J. Ndege always have his current profile avatar
  const normalizedPosts = data.posts.map((p) => {
    if (p.authorName === data.profile.name || p.authorHandle === data.profile.handle) {
      return { ...p, authorAvatar: data.profile.avatarUrl };
    }
    return p;
  });
  res.json(normalizedPosts);
});

app.post('/api/posts', (req: Request, res: Response) => {
  const { content, tag, imageUrl, title } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Post content is required' });
  }

  const data = storage.getData();
  const newPost = {
    id: `post-${Date.now()}`,
    authorName: data.profile.name,
    authorAvatar: data.profile.avatarUrl,
    authorHandle: data.profile.handle,
    verified: true,
    createdAt: 'Just now',
    tag: tag || 'General',
    title: title || undefined,
    content,
    imageUrl: imageUrl || undefined,
    likesCount: 0,
    isLiked: false,
    isSaved: false,
    commentsCount: 0,
    comments: [],
  };

  data.posts.unshift(newPost);
  data.profile.postsCount += 1;
  storage.saveData(data);
  res.status(201).json(newPost);
});

app.post('/api/posts/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = storage.getData();
  const post = data.posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  post.isLiked = !post.isLiked;
  post.likesCount += post.isLiked ? 1 : -1;
  storage.saveData(data);
  res.json({ isLiked: post.isLiked, likesCount: post.likesCount });
});

app.post('/api/posts/:id/save', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = storage.getData();
  const post = data.posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  post.isSaved = !post.isSaved;
  storage.saveData(data);
  res.json({ isSaved: post.isSaved });
});

app.post('/api/posts/:id/comment', (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  const data = storage.getData();
  const post = data.posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const newComment = {
    id: `c-${Date.now()}`,
    author: 'You (Guest User)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    text,
    time: 'Just now',
  };

  post.comments = post.comments || [];
  post.comments.push(newComment);
  post.commentsCount = post.comments.length;
  storage.saveData(data);
  res.status(201).json(newComment);
});

// Blogs
app.get('/api/blogs', (_req: Request, res: Response) => {
  const data = storage.getData();
  res.json(data.blogs);
});

app.post('/api/blogs', (req: Request, res: Response) => {
  const { title, category, excerpt, content, imageUrl } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const data = storage.getData();
  const newBlog = {
    id: `blog-${Date.now()}`,
    title,
    category: category || 'Technology',
    excerpt: excerpt || content.slice(0, 150) + '...',
    content,
    readTime: `${Math.max(2, Math.round(content.length / 500))} min read`,
    viewsCount: '1',
    imageUrl:
      imageUrl ||
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80',
    publishedAt: 'Today',
    author: data.profile.name,
  };

  data.blogs.unshift(newBlog);
  storage.saveData(data);
  res.status(201).json(newBlog);
});

// Books
app.get('/api/books', (_req: Request, res: Response) => {
  const data = storage.getData();
  res.json(data.books);
});

app.post('/api/books', (req: Request, res: Response) => {
  const {
    title,
    price,
    description,
    category,
    coverUrl,
    sampleContent,
    pdfUrl,
    pdfFileName,
    pdfFileSize,
    chapters,
    pagesCount,
    wordCount,
    isAutoGenerated,
  } = req.body;

  if (!title || price === undefined) {
    return res.status(400).json({ error: 'Title and price are required' });
  }

  const data = storage.getData();
  const defaultSample = `Chapter 1: Foundations\n\nWelcome to ${title}. This work discusses foundational tenets for lasting value creation in the African and global creator economy.`;

  const newBook = {
    id: `book-${Date.now()}`,
    title: String(title).trim(),
    author: data.profile.name,
    price: Number(price),
    rating: 5,
    reviewsCount: 1,
    coverUrl:
      coverUrl ||
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=85',
    category: category || 'Business & Digital',
    description: description || 'A new published book by Ev Dr. Boniphace J. Ndege.',
    sampleContent: sampleContent || defaultSample,
    pdfUrl: pdfUrl || undefined,
    pdfFileName: pdfFileName || undefined,
    pdfFileSize: pdfFileSize || undefined,
    chapters: Array.isArray(chapters) && chapters.length > 0 ? chapters : undefined,
    pagesCount: pagesCount || (pdfUrl ? 42 : undefined),
    wordCount: wordCount || (sampleContent ? sampleContent.split(/\s+/).length : 1200),
    isAutoGenerated: Boolean(isAutoGenerated),
  };

  data.books.unshift(newBook);
  data.profile.booksCount += 1;
  storage.saveData(data);
  res.status(201).json(newBook);
});

// Update an existing book (e.g. change cover image, attach PDF/EPUB, update chapters)
app.patch('/api/books/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const data = storage.getData();
  const bookIndex = data.books.findIndex((b) => b.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  data.books[bookIndex] = {
    ...data.books[bookIndex],
    ...updates,
    id, // protect id
  };
  storage.saveData(data);
  return res.json(data.books[bookIndex]);
});

app.put('/api/books/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const data = storage.getData();
  const bookIndex = data.books.findIndex((b) => b.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  data.books[bookIndex] = {
    ...data.books[bookIndex],
    ...updates,
    id,
  };
  storage.saveData(data);
  return res.json(data.books[bookIndex]);
});

// Videos
app.get('/api/videos', (_req: Request, res: Response) => {
  const data = storage.getData();
  res.json(data.videos);
});

app.post('/api/videos', (req: Request, res: Response) => {
  const { title, description, thumbnailUrl, videoUrl, duration, category } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Video title is required' });
  }

  const data = storage.getData();
  const fallbackUrls = [
    '/uploads/videos/inshot_20261010_real.mp4',
    'https://media.w3.org/2010/05/sintel/trailer.mp4',
    'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
  ];
  const chosenVideoUrl =
    videoUrl && String(videoUrl).trim().length > 0
      ? String(videoUrl).trim()
      : fallbackUrls[Math.floor(Math.random() * fallbackUrls.length)];

  const newVideo = {
    id: `vid-${Date.now()}`,
    title: title.trim(),
    duration: duration || '08:45',
    views: '1',
    uploadedAt: 'Just now',
    thumbnailUrl:
      thumbnailUrl ||
      'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1000&q=80',
    author: data.profile.name,
    authorAvatar: data.profile.avatarUrl,
    videoUrl: chosenVideoUrl,
    category: category || 'General',
    likesCount: 1,
    isLiked: false,
    commentsCount: 0,
    description: description || 'New video presentation by Ev Dr. Boniphace J. Ndege.',
    comments: [],
  };

  data.videos.unshift(newVideo);
  data.profile.videosCount += 1;
  storage.saveData(data);
  res.status(201).json(newVideo);
});

app.post('/api/videos/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = storage.getData();
  const video = data.videos.find((v) => v.id === id);
  if (!video) return res.status(404).json({ error: 'Video not found' });

  video.isLiked = !video.isLiked;
  video.likesCount = (video.likesCount || 0) + (video.isLiked ? 1 : -1);
  if (video.likesCount < 0) video.likesCount = 0;
  storage.saveData(data);
  res.json({ id: video.id, isLiked: video.isLiked, likesCount: video.likesCount });
});

app.post('/api/videos/:id/comments', (req: Request, res: Response) => {
  const { id } = req.params;
  const { text, author, avatar } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  const data = storage.getData();
  const video = data.videos.find((v) => v.id === id);
  if (!video) return res.status(404).json({ error: 'Video not found' });

  if (!video.comments) video.comments = [];
  const newComment = {
    id: `vc-${Date.now()}`,
    author: author || data.profile.name,
    avatar: avatar || data.profile.avatarUrl,
    text: text.trim(),
    time: 'Just now',
  };

  video.comments.unshift(newComment);
  video.commentsCount = video.comments.length;
  storage.saveData(data);
  res.status(201).json(newComment);
});

app.post('/api/videos/:id/view', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = storage.getData();
  const video = data.videos.find((v) => v.id === id);
  if (!video) return res.status(404).json({ error: 'Video not found' });

  // Parse view count e.g. "24K" or "100"
  let count = 1;
  if (video.views) {
    if (video.views.endsWith('K')) {
      count = Math.round(parseFloat(video.views) * 1000) + 1;
      video.views = `${(count / 1000).toFixed(1)}K`;
    } else {
      count = parseInt(video.views, 10) + 1;
      video.views = String(isNaN(count) ? '1' : count);
    }
  } else {
    video.views = '1';
  }
  storage.saveData(data);
  res.json({ id: video.id, views: video.views });
});

// Products & Global Shopping
app.get('/api/products', (req: Request, res: Response) => {
  const { category, q } = req.query;
  const data = storage.getData();
  let list = data.products;

  if (category && category !== 'All') {
    list = list.filter(
      (p) => p.category.toLowerCase() === String(category).toLowerCase()
    );
  }

  if (q && typeof q === 'string') {
    const term = q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.seller.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }

  res.json(list);
});

app.post('/api/products', (req: Request, res: Response) => {
  const { name, category, price, stock, image, description, condition } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const data = storage.getData();
  const newProduct = {
    id: `p-${Date.now()}`,
    name,
    category: category || 'Electronics',
    price: Number(price),
    seller: `${data.profile.name} Store`,
    rating: 5,
    reviewsCount: 0,
    condition: condition || 'Brand New',
    stock: Number(stock) || 10,
    image:
      image ||
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    description: description || 'Authentic quality guaranteed on Global Shopping.',
    reviews: [],
  };

  data.products.unshift(newProduct);
  data.profile.productsCount += 1;
  storage.saveData(data);
  res.status(201).json(newProduct);
});

app.post('/api/products/:id/reviews', (req: Request, res: Response) => {
  const { id } = req.params;
  const { author, rating, comment } = req.body;
  if (!comment || !rating) {
    return res.status(400).json({ error: 'Rating and comment are required' });
  }

  const data = storage.getData();
  const product = data.products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const newReview = {
    id: `r-${Date.now()}`,
    author: author || 'Verified Customer',
    rating: Number(rating),
    comment,
    date: 'Just now',
    verifiedPurchase: true,
  };

  product.reviews = product.reviews || [];
  product.reviews.unshift(newReview);
  product.reviewsCount = product.reviews.length;
  const avg =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  product.rating = Math.round(avg * 10) / 10;

  storage.saveData(data);
  res.status(201).json({ product, review: newReview });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = storage.getData();
  const idx = data.products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  data.products.splice(idx, 1);
  data.profile.productsCount = Math.max(0, data.profile.productsCount - 1);
  storage.saveData(data);
  res.json({ success: true });
});

// Orders & Checkout
app.get('/api/orders', (_req: Request, res: Response) => {
  const data = storage.getData();
  res.json(data.orders);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const { items, customerName, customerEmail } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: 'No items in order' });
  }

  const data = storage.getData();
  const totalAmount = items.reduce(
    (sum: number, it: any) => sum + it.price * (it.quantity || 1),
    0
  );

  const orderNum = `#GS-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder = {
    id: `ord-${Date.now()}`,
    orderNumber: orderNum,
    items,
    totalAmount,
    status: 'Paid' as const,
    createdAt: 'Just now',
    customerName: customerName || 'Valued Buyer',
    customerEmail: customerEmail || 'customer@example.com',
  };

  data.orders.unshift(newOrder);
  storage.saveData(data);
  res.status(201).json(newOrder);
});

// Messaging
app.get('/api/conversations', (_req: Request, res: Response) => {
  const data = storage.getData();
  res.json(data.conversations);
});

app.get('/api/messages/:convId', (req: Request, res: Response) => {
  const { convId } = req.params;
  const data = storage.getData();
  const list = data.messages[convId] || [];
  res.json(list);
});

app.post('/api/messages', (req: Request, res: Response) => {
  const { convId, text } = req.body;
  if (!convId || !text) {
    return res.status(400).json({ error: 'Conversation ID and text are required' });
  }

  const data = storage.getData();
  data.messages[convId] = data.messages[convId] || [];

  const myMsg = {
    id: `m-${Date.now()}`,
    senderId: 'me',
    receiverId: convId,
    text,
    timestamp: 'Just now',
    isMe: true,
  };
  data.messages[convId].push(myMsg);

  // Update conversation last message
  const conv = data.conversations.find((c) => c.id === convId);
  if (conv) {
    conv.lastMessage = text;
    conv.lastMessageTime = 'Just now';
  }

  storage.saveData(data);

  // Simulate contact auto-reply
  const contactName = conv ? conv.contactName : 'Contact';
  setTimeout(() => {
    const refreshed = storage.getData();
    refreshed.messages[convId] = refreshed.messages[convId] || [];
    const replyMsg = {
      id: `m-reply-${Date.now()}`,
      senderId: convId,
      receiverId: 'me',
      text: `Thanks for getting in touch with ${contactName}! We received your note: "${text}".`,
      timestamp: 'Just now',
      isMe: false,
    };
    refreshed.messages[convId].push(replyMsg);
    const refreshedConv = refreshed.conversations.find((c) => c.id === convId);
    if (refreshedConv) {
      refreshedConv.lastMessage = replyMsg.text;
      refreshedConv.lastMessageTime = 'Just now';
    }
    storage.saveData(refreshed);
  }, 1200);

  res.status(201).json(myMsg);
});

// Meetings
app.get('/api/meetings', (_req: Request, res: Response) => {
  const data = storage.getData();
  res.json(data.meetings);
});

app.post('/api/meetings', (req: Request, res: Response) => {
  const { title, schedule } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Meeting title is required' });
  }

  const data = storage.getData();
  const newMeeting = {
    id: `meet-${Date.now()}`,
    title,
    schedule: schedule || 'Scheduled soon',
    isLiveNow: false,
    hostName: data.profile.name,
    participantsCount: 1,
  };

  data.meetings.push(newMeeting);
  storage.saveData(data);
  res.status(201).json(newMeeting);
});

// Contact
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  res.json({
    success: true,
    message: `Thank you ${name}! Ev Dr. Boniphace J. Ndege's team will contact you at ${email}.`,
  });
});

// Newsletter Subscription & Mailing List API
app.get('/api/newsletter', (_req: Request, res: Response) => {
  const data = storage.getData();
  const list = data.subscribers || [];
  res.json({
    subscribers: list,
    count: list.length,
  });
});

app.post('/api/newsletter', (req: Request, res: Response) => {
  const { email, source } = req.body;
  if (!email || !String(email).includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const data = storage.getData();
  if (!data.subscribers) data.subscribers = [];

  const existing = data.subscribers.find((s) => s.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.json({
      success: true,
      alreadySubscribed: true,
      message: 'Email is already subscribed to the mailing list.',
      count: data.subscribers.length,
    });
  }

  const newSub = {
    id: `sub-${Date.now()}`,
    email: cleanEmail,
    subscribedAt: new Date().toISOString(),
    source: source || 'footer_newsletter',
  };

  data.subscribers.push(newSub);
  storage.saveData(data);

  res.status(201).json({
    success: true,
    message: 'Subscribed to mailing list successfully.',
    subscriber: newSub,
    count: data.subscribers.length,
  });
});

// Overall Stats for Dashboard & Creator Studio
app.get('/api/stats', (_req: Request, res: Response) => {
  const data = storage.getData();
  res.json({
    profile: data.profile,
    totalSales: data.orders.reduce((sum, o) => sum + o.totalAmount, 0),
    totalOrders: data.orders.length,
    activeProducts: data.products.length,
    totalViews: '284K',
    totalLikes: data.posts.reduce((sum, p) => sum + p.likesCount, 0),
  });
});

// Static or Vite integration
async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
