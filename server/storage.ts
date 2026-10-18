import fs from 'fs';
import path from 'path';
import {
  UserProfile,
  Post,
  BlogArticle,
  Book,
  VideoItem,
  Product,
  Order,
  Message,
  Conversation,
  Meeting,
} from '../src/types';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  role: 'member' | 'creator' | 'seller' | 'admin';
  isVerified: boolean;
  rememberMe?: boolean;
  acceptedTerms: boolean;
  acceptedTermsAt: string;
  createdAt: string;
}

export interface DatabaseSchema {
  profile: UserProfile;
  posts: Post[];
  blogs: BlogArticle[];
  books: Book[];
  videos: VideoItem[];
  products: Product[];
  orders: Order[];
  conversations: Conversation[];
  messages: Record<string, Message[]>; // conversationId -> messages
  meetings: Meeting[];
  users?: UserAccount[];
  otps?: Record<string, { code: string; expiresAt: number; purpose: 'signup' | 'reset' | 'login' }>;
  subscribers?: Array<{ id: string; email: string; subscribedAt: string; source?: string }>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_DATA: DatabaseSchema = {
  users: [
    {
      id: 'usr-default-boniphace',
      name: 'Ev Dr. Boniphace J. Ndege',
      email: 'boniphacejndege@gmail.com',
      password: 'Password123!',
      avatarUrl: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
      role: 'admin',
      isVerified: true,
      acceptedTerms: true,
      acceptedTermsAt: new Date().toISOString(),
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  otps: {},
  profile: {
    name: 'Ev Dr. Boniphace Ndege',
    titleSwahili: 'CHAPA BINAFSI · MUUNDAJI · MWEKEZAJI',
    bioSwahili: 'Kujenga makazi ya kidijitali ambapo mawazo yanakuwa fursa · Teknolojia inapata maana kubwa zaidi inapowaunganisha watu, maarifa, jamii na biashara za uaminifu. Karibuni sana katika jukwaa letu rasmi la kidijitali.',
    handle: '@boniphacendege',
    title: 'PERSONAL BRAND · CREATOR · ENTREPRENEUR',
    bio: 'Building a digital home where ideas become opportunities · Technology becomes more meaningful when it connects people, knowledge, community and trusted commerce. Welcome to our official digital platform.',
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
  },
  posts: [
    {
      id: 'post-1',
      authorName: 'Ev Dr. Boniphace J. Ndege',
      authorAvatar: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
      authorHandle: '@boniphacendege',
      verified: true,
      createdAt: '2 hours ago',
      tag: 'Digital Life',
      tagSwahili: 'Maisha ya Kidijitali',
      title: 'Building a digital home where ideas become opportunities',
      titleSwahili: 'Kujenga makazi ya kidijitali ambapo mawazo yanakuwa fursa',
      content:
        'Technology becomes more meaningful when it connects people, knowledge, creativity and business in one place. Welcome to our unified creator ecosystem and Global Shopping experience!',
      contentSwahili:
        'Teknolojia inapata maana kubwa zaidi inapowaunganisha watu, maarifa, jamii na biashara za uaminifu. Karibuni sana katika jukwaa letu rasmi la kidijitali.',
      imageUrl: '/src/assets/images/boniphace_cover_1791315258070.jpg',
      likesCount: 248,
      isLiked: false,
      isSaved: false,
      commentsCount: 42,
      comments: [
        {
          id: 'c1',
          author: 'Sarah James',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
          text: 'Inspiring journey! The integrated marketplace is so seamless.',
          time: '1h ago',
        },
        {
          id: 'c2',
          author: 'David Michael',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          text: 'Great initiative for African entrepreneurs and global creators!',
          time: '35m ago',
        },
      ],
    },
    {
      id: 'post-2',
      authorName: 'Ev Dr. Boniphace J. Ndege',
      authorAvatar: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
      authorHandle: '@boniphacendege',
      verified: true,
      createdAt: 'Yesterday',
      tag: 'Global Shopping',
      tagSwahili: 'Soko la Dunia',
      title: 'Discover. Connect. Shop. Grow.',
      titleSwahili: 'Gundua. Ungana. Nunua. Kua.',
      content:
        'Global Shopping brings modern online commerce closer to buyers and sellers with a simple, secure marketplace experience. Browse local and global offerings from verified suppliers.',
      contentSwahili:
        'Soko la Kimataifa linawaleta wauzaji na wanunuzi karibu zaidi kwa usalama, ubora na urahisi wa kufanya ununuzi mtandaoni.',
      imageUrl: '/src/assets/images/marketplace_banner_1791315289481.jpg',
      likesCount: 184,
      isLiked: false,
      isSaved: false,
      commentsCount: 19,
      comments: [
        {
          id: 'c3',
          author: 'Grace Writer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          text: 'Placed my first order today, the checkout was effortless!',
          time: '18h ago',
        },
      ],
    },
  ],
  blogs: [
    {
      id: 'blog-1',
      title: 'The Future of Digital Platforms',
      category: 'Technology',
      excerpt:
        'How integrated digital ecosystems can connect people, creators, businesses and consumers into a sustainable growth engine.',
      content:
        'The next era of the internet is not about fragmented silos, but about integrated personal ecosystems. When content creation, digital publishing, video broadcasting, live communication, and e-commerce coexist under one roof, creators retain ownership of their audience while users enjoy a seamless experience without hopping between disparate apps.',
      readTime: '6 min read',
      viewsCount: '1.2K',
      imageUrl:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
      publishedAt: 'March 2026',
      author: 'Ev Dr. Boniphace J. Ndege',
    },
    {
      id: 'blog-2',
      title: 'Building a Modern Online Business',
      category: 'Business',
      excerpt:
        'From initial conceptualization to customer acquisition, discover the essential components of building resilient digital commerce in Africa and globally.',
      content:
        'Starting an online business requires more than just listing products. It demands transparent inventory management, friction-free payment flows, real-time customer communications, and authentic storytelling. Sellers who build community alongside their storefronts experience 4x higher retention rates.',
      readTime: '8 min read',
      viewsCount: '2.8K',
      imageUrl:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80',
      publishedAt: 'February 2026',
      author: 'Ev Dr. Boniphace J. Ndege',
    },
    {
      id: 'blog-3',
      title: 'Why Reading Still Matters',
      category: 'Books',
      excerpt:
        'Knowledge, imagination, and personal growth through deep reading in an era of superficial short-form distractions.',
      content:
        'Books provide what algorithm feeds cannot: depth of thought, uninterrupted mental focus, and timeless principles. Cultivating a disciplined daily reading habit transforms how leaders perceive problems and design enduring solutions.',
      readTime: '5 min read',
      viewsCount: '4.1K',
      imageUrl:
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=80',
      publishedAt: 'January 2026',
      author: 'Ev Dr. Boniphace J. Ndege',
    },
    {
      id: 'blog-4',
      title: 'Personal Growth & Focus in a Noisy World',
      category: 'Personal',
      excerpt:
        'Cultivating mental resilience, intentional solitude, and compounding daily disciplines to build an authentic life.',
      content:
        'In an era of relentless algorithmic notifications and public commentary, preserving your private mental sanctuary is not a luxury—it is an existential imperative for sustained creative work.\n\nSection 1: The Sovereignty of Morning Rituals\nWhen your first action upon waking is checking messages, you forfeit your mental sovereignty before the day even begins. Guard your first ninety minutes.\n\nSection 2: The Discipline of Saying No\nEvery commitment you say yes to is a silent no to your deepest priorities. High achievers filter out mediocre opportunities.\n\nSection 3: Long Horizons and Emotional Equilibrium\nPersonal development compounds silently. The habits you nurture today will reveal their harvest in years to come.',
      readTime: '7 min read',
      viewsCount: '3.2K',
      imageUrl:
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80',
      publishedAt: 'April 2026',
      author: 'Ev Dr. Boniphace J. Ndege',
    },
    {
      id: 'blog-5',
      title: 'Open Protocols & Tech Frontiers for Digital Creators',
      category: 'Tech',
      excerpt:
        'Exploring decentralized distribution, edge caching, progressive web architecture, and user-owned publishing platforms.',
      content:
        'The evolution of the internet is shifting from centralized gatekeepers toward open protocols and edge-first web performance. Creators who understand these underlying technological mechanics will own their destiny.\n\nSection 1: The Resilience of Progressive Web Standards\nModern web browsers possess incredible native power: Service Workers, Cache Storage APIs, and background processing. By decoupling content from fragile cloud connections, creators can deliver lightning-fast reading experiences that persist even when network coverage drops in transit or rural hubs.\n\nSection 2: Beyond Algorithmic Feeds\nWhen you build on direct protocols—RSS, sovereign domains, and direct-to-consumer catalogs—you insulate your readership from arbitrary algorithmic shifts.\n\nSection 3: Speed, Sovereignty, and User Respect\nFast, lightweight technology is a gesture of deep respect to your audience. When pages load instantly and offline readers work reliably without bloatware, trust and engagement skyrocket.',
      readTime: '9 min read',
      viewsCount: '5.1K',
      imageUrl:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80',
      publishedAt: 'May 2026',
      author: 'Ev Dr. Boniphace J. Ndege',
    },
  ],
  books: [
    {
      id: 'book-1',
      title: 'The Digital Vision',
      author: 'Ev Dr. Boniphace J. Ndege',
      price: 18000,
      rating: 5,
      reviewsCount: 142,
      coverUrl: '/src/assets/images/book_digital_vision_1791315278826.jpg',
      category: 'Technology & Strategy',
      description:
        'A blueprint for creators, leaders, and entrepreneurs navigating the transformative shifts in the global digital landscape.',
      sampleContent:
        'Chapter 1: The Blueprint\n\nEvery great platform begins not with lines of code, but with a profound understanding of human coordination. When we examine how communities gather, exchange value, and seek knowledge, we realize that digital tools are merely mirrors of timeless human aspirations.\n\nIn this chapter, we explore how clarity of vision precedes execution, and why foundational principles outlive fleeting technology fads.',
      pdfUrl: '/uploads/books/the_digital_vision.pdf',
      pdfFileName: 'the_digital_vision.pdf',
      pdfFileSize: '752 KB',
      chapters: [
        { title: 'Chapter 1: The Blueprint', content: 'Every great platform begins not with lines of code, but with a profound understanding of human coordination. When we examine how communities gather, exchange value, and seek knowledge, we realize that digital tools are merely mirrors of timeless human aspirations.\n\nIn this chapter, we explore how clarity of vision precedes execution, and why foundational principles outlive fleeting technology fads.', wordCount: 85 },
        { title: 'Chapter 2: Ecosystem Architecture', content: 'Architecture in digital commerce starts with sovereign infrastructure. Providing native offline cache capability, real-time sync, and rapid checkout converts passive readers into lifelong brand advocates.', wordCount: 92 },
        { title: 'Chapter 3: Compounding Impact', content: 'When physical goods, educational masterclasses, and digital books live under one cohesive umbrella, every interaction multiplies the lifetime trust of your community.', wordCount: 88 },
      ],
    },
    {
      id: 'book-2',
      title: 'Building Your Future',
      author: 'Ev Dr. Boniphace J. Ndege',
      price: 15000,
      rating: 4.8,
      reviewsCount: 98,
      coverUrl:
        'https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=700&q=85',
      category: 'Self-Development',
      description:
        'Actionable strategies for personal growth, career positioning, and mental resilience in uncertain economic times.',
      sampleContent:
        'Chapter 1: The Principle of Compounding\n\nSmall daily actions, repeated with deliberate discipline, compound into extraordinary outcomes over a decade. Learn to measure progress by system adherence rather than immediate outcomes.',
      isAutoGenerated: true,
      chapters: [
        { title: 'Chapter 1: The Principle of Compounding', content: 'Small daily actions, repeated with deliberate discipline, compound into extraordinary outcomes over a decade. Learn to measure progress by system adherence rather than immediate outcomes.', wordCount: 65 },
        { title: 'Chapter 2: Daily Systems & Execution', content: 'Goals define your direction, but systems dictate your daily execution. When habits are aligned with long-term digital mastery, progress becomes inevitable.', wordCount: 80 },
        { title: 'Chapter 3: Resilience in Uncertainty', content: 'Economic volatility tests conviction. Those who build deep technical competencies and direct relationships thrive regardless of external economic shifts.', wordCount: 75 },
      ],
    },
    {
      id: 'book-3',
      title: 'Ideas Into Reality',
      author: 'Ev Dr. Boniphace J. Ndege',
      price: 20000,
      rating: 5,
      reviewsCount: 210,
      coverUrl:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=85',
      category: 'Entrepreneurship',
      description:
        'The step-by-step methodology to take an abstract vision and turn it into a profitable, scalable product.',
      sampleContent:
        'Chapter 1: Validation and Market Resonance\n\nBefore investing resources into development, validate demand with genuine customer conversations. Understand the specific friction your solution relieves.',
    },
    {
      id: 'book-4',
      title: 'Leadership & Purpose',
      author: 'Ev Dr. Boniphace J. Ndege',
      price: 22000,
      rating: 4.9,
      reviewsCount: 84,
      coverUrl:
        'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=700&q=85',
      category: 'Leadership',
      description:
        'Authentic leadership principles to rally teams, build sustainable culture, and navigate high-stakes decisions.',
      sampleContent:
        'Chapter 1: Purpose as a Compass\n\nTrue leadership begins when personal ego gives way to shared mission. When every team member understands the collective objective, autonomy and creativity flourish.',
      pdfUrl: '/uploads/books/the_digital_vision.pdf',
      pdfFileName: 'leadership_and_purpose.pdf',
      pdfFileSize: '1.2 MB',
      chapters: [
        { title: 'Chapter 1: Purpose as a Compass', content: 'True leadership begins when personal ego gives way to shared mission. When every team member understands the collective objective, autonomy and creativity flourish.\n\n1.1 Leading by Example\nNo words can inspire a team if the leader\'s day-to-day discipline contradicts their speeches. Integrity is verified in small, unobserved moments.\n\n1.2 Fostering Psychological Safety\nHigh-performing groups require an environment where reasonable risks are celebrated and honest mistakes become learning milestones rather than causes for punishment.', wordCount: 95 },
        { title: 'Chapter 2: Building Sustainable Culture', content: 'Culture is not what is painted on office walls; it is what team members do when no supervisor is watching. Clear incentives, honest feedback, and shared sacrifice establish an unbreakable organizational DNA.', wordCount: 110 },
        { title: 'Chapter 3: High-Stakes Decision Making', content: 'When crisis strikes, uncertainty paralyzes ordinary teams. Principled leaders anchor their choices in permanent values, communicate with transparent clarity, and execute with focused velocity.', wordCount: 105 },
      ],
    },
  ],
  videos: [
    {
      id: 'vid-1',
      title: 'Building Digital Dreams — My Journey',
      duration: '12:42',
      views: '24K',
      uploadedAt: '3 days ago',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80',
      author: 'Ev Dr. Boniphace J. Ndege',
      authorAvatar: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
      videoUrl:
        '/uploads/videos/inshot_20261010_real.mp4',
      category: 'Creator Journey',
      likesCount: 1420,
      isLiked: false,
      commentsCount: 38,
      description:
        'In this video, I break down the behind-the-scenes story of creating a unified creator ecosystem and launching Global Shopping in East Africa.',
      comments: [
        {
          id: 'c-1',
          author: 'Sarah Jenkins',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
          text: 'This inspires me so much! The step-by-step breakdown of your digital ecosystem is crystal clear.',
          time: '2 hours ago',
        },
        {
          id: 'c-2',
          author: 'David Mwangi',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          text: 'Brilliant insights on market validation. Looking forward to the next session!',
          time: '5 hours ago',
        },
      ],
    },
    {
      id: 'vid-2',
      title: 'How Online Learning Is Changing Lives',
      duration: '18:05',
      views: '18K',
      uploadedAt: '1 week ago',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
      author: 'Ev Dr. Boniphace J. Ndege',
      authorAvatar: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
      videoUrl:
        'https://media.w3.org/2010/05/sintel/trailer.mp4',
      category: 'Education',
      likesCount: 980,
      isLiked: false,
      commentsCount: 22,
      description:
        'Examining the transformative democratization of digital skills and why self-paced mastery opens global opportunities for youth.',
      comments: [
        {
          id: 'c-3',
          author: 'Neema Raphael',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          text: 'Self-paced learning changed my entire career trajectory. Thank you for championing this cause.',
          time: '1 day ago',
        },
      ],
    },
    {
      id: 'vid-3',
      title: 'Entrepreneurship & The Digital Economy',
      duration: '24:10',
      views: '35K',
      uploadedAt: '2 weeks ago',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80',
      author: 'Ev Dr. Boniphace J. Ndege',
      authorAvatar: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
      videoUrl:
        'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
      category: 'Business',
      likesCount: 2430,
      isLiked: false,
      commentsCount: 64,
      description:
        'Practical frameworks for establishing commercial viability, choosing the right digital channels, and scaling responsibly.',
      comments: [
        {
          id: 'c-4',
          author: 'Baraka Temu',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          text: 'The economic models you presented on cross-border transactions are so practical.',
          time: '3 days ago',
        },
      ],
    },
    {
      id: 'vid-4',
      title: 'How To Start Selling Online',
      duration: '09:33',
      views: '12K',
      uploadedAt: '1 month ago',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
      author: 'Ev Dr. Boniphace J. Ndege',
      authorAvatar: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
      videoUrl:
        'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      category: 'E-Commerce',
      likesCount: 840,
      isLiked: false,
      commentsCount: 19,
      description:
        'A beginner-friendly guide to setting up your seller center account, photographing inventory, and handling orders on Global Shopping.',
      comments: [
        {
          id: 'c-5',
          author: 'Amina Kassim',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
          text: 'Just opened my store on the Global Marketplace following this exact guide!',
          time: '1 week ago',
        },
      ],
    },
    {
      id: 'vid-5',
      title: 'Technology, People & The Future',
      duration: '15:27',
      views: '44K',
      uploadedAt: '2 months ago',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1000&q=80',
      author: 'Ev Dr. Boniphace J. Ndege',
      authorAvatar: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
      videoUrl:
        'https://test-videos.co.uk/vids/jellyfish/mp4/h264/1080/Jellyfish_1080_10s_1MB.mp4',
      category: 'Technology',
      likesCount: 3100,
      isLiked: false,
      commentsCount: 85,
      description:
        'How emerging technologies will impact local manufacturing, cross-border payments, and decentralized creator collectives.',
      comments: [
        {
          id: 'c-6',
          author: 'Grace Wilson',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
          text: 'The convergence of mobile payments with creator tools is truly the next frontier.',
          time: '2 weeks ago',
        },
      ],
    },
    {
      id: 'vid-6',
      title: 'Inside The Creator Economy',
      duration: '21:14',
      views: '29K',
      uploadedAt: '3 months ago',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
      author: 'Ev Dr. Boniphace J. Ndege',
      authorAvatar: '/src/assets/images/boniphace_avatar_1791315268492.jpg',
      videoUrl:
        'https://media.w3.org/2010/05/sintel/trailer.mp4',
      category: 'Creator Economy',
      likesCount: 1950,
      isLiked: false,
      commentsCount: 42,
      description:
        'Exploring monetization avenues, building direct fan relationships, and turning personal brand equity into sustainable enterprises.',
      comments: [
        {
          id: 'c-7',
          author: 'Alex Kimaro',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
          text: 'Direct audience connection is 100x more valuable than relying on third-party algorithms.',
          time: '1 month ago',
        },
      ],
    },
  ],
  products: [
    {
      id: 'p-1',
      name: 'Premium Wireless Headphones',
      category: 'Electronics',
      price: 145000,
      seller: 'Tech World',
      rating: 4.9,
      reviewsCount: 38,
      condition: 'Brand New',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      stock: 35,
      description:
        'Active noise cancellation, 40-hour battery life, high-fidelity audio drivers, and memory foam comfort cups.',
      reviews: [
        {
          id: 'r-1',
          author: 'Amina Salum',
          rating: 5,
          comment: 'Incredible acoustic depth and pristine brand new factory seal. Fast delivery to Dar es Salaam!',
          date: '2 days ago',
          verifiedPurchase: true,
        },
        {
          id: 'r-2',
          author: 'Emmanuel K.',
          rating: 5,
          comment: 'Noise cancellation is top tier, exactly as described by Ev Dr. Boniphace J. Ndege.',
          date: '1 week ago',
          verifiedPurchase: true,
        },
      ],
    },
    {
      id: 'p-2',
      name: 'Smart Watch Pro',
      category: 'Electronics',
      price: 95000,
      seller: 'Digital Store',
      rating: 4.8,
      reviewsCount: 24,
      condition: 'Brand New',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      stock: 22,
      description:
        'Health tracking, AMOLED touch display, GPS navigation, water-resistant casing, and 7-day battery life.',
      reviews: [
        {
          id: 'r-3',
          author: 'John Mwangi',
          rating: 5,
          comment: 'Battery lasts a whole week easily. Crisp screen and great build quality.',
          date: '3 days ago',
          verifiedPurchase: true,
        },
      ],
    },
    {
      id: 'p-3',
      name: 'Premium Leather Bag',
      category: 'Fashion',
      price: 85000,
      seller: 'African Fashion',
      rating: 4.7,
      reviewsCount: 19,
      condition: 'Like New',
      image:
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
      stock: 14,
      description:
        'Handcrafted full-grain leather laptop messenger bag with brass buckles and durable canvas lining.',
      reviews: [
        {
          id: 'r-4',
          author: 'Farida Ally',
          rating: 5,
          comment: 'Impeccable authentic craftsmanship. Leather aroma and sturdy stitching.',
          date: '5 days ago',
          verifiedPurchase: true,
        },
      ],
    },
    {
      id: 'p-4',
      name: 'Modern Streetwear Sneakers',
      category: 'Fashion',
      price: 120000,
      seller: 'Urban Shoes',
      rating: 4.8,
      reviewsCount: 42,
      condition: 'Brand New',
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
      stock: 18,
      description:
        'Lightweight responsive cushioned sole, breathable mesh upper, and distinctive ergonomic design.',
      reviews: [
        {
          id: 'r-5',
          author: 'Kevin B.',
          rating: 5,
          comment: 'Super comfortable fit and head-turning look.',
          date: '1 week ago',
          verifiedPurchase: true,
        },
      ],
    },
    {
      id: 'p-5',
      name: 'Modern Barista Coffee Maker',
      category: 'Home',
      price: 185000,
      seller: 'Home Plus',
      rating: 4.6,
      reviewsCount: 15,
      condition: 'Refurbished',
      image:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
      stock: 12,
      description:
        'Italian 15-bar pressure pump, built-in milk steam wand, and precision temperature regulation.',
      reviews: [
        {
          id: 'r-6',
          author: 'Grace W.',
          rating: 4,
          comment: 'Certified refurbished unit in like-new condition, makes great espresso.',
          date: '2 weeks ago',
          verifiedPurchase: true,
        },
      ],
    },
    {
      id: 'p-6',
      name: 'Professional 4K Creator Camera',
      category: 'Electronics',
      price: 1450000,
      seller: 'Camera Hub',
      rating: 4.9,
      reviewsCount: 9,
      condition: 'Used - Good',
      image:
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
      stock: 6,
      description:
        'Mirrorless 4K 60fps recording, dual card slots, cinematic color profiles, and lightning-fast autofocus. Gently tested gear in solid operational condition.',
      reviews: [
        {
          id: 'r-7',
          author: 'David Michael',
          rating: 5,
          comment: 'Shutter count is low, sensor is spotless. Excellent price for used high-end camera!',
          date: '3 weeks ago',
          verifiedPurchase: true,
        },
      ],
    },
    {
      id: 'p-7',
      name: 'The Digital Vision Hardcover',
      category: 'Books',
      price: 25000,
      seller: 'BN Publishing',
      rating: 5.0,
      reviewsCount: 65,
      condition: 'Collector Edition',
      image: '/src/assets/images/book_digital_vision_1791315278826.jpg',
      stock: 150,
      description:
        'Author-signed collector hardcover edition with gold foil embossing and premium silk bookmark.',
      reviews: [
        {
          id: 'r-8',
          author: 'Dr. Joseph L.',
          rating: 5,
          comment: 'Signed first edition, extraordinary depth of knowledge. Must-read for tech innovators.',
          date: '4 days ago',
          verifiedPurchase: true,
        },
      ],
    },
    {
      id: 'p-8',
      name: 'Organic Botanical Skin Care Set',
      category: 'Beauty',
      price: 75000,
      seller: 'Beauty Africa',
      rating: 4.8,
      reviewsCount: 28,
      condition: 'Brand New',
      image:
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
      stock: 40,
      description:
        'All-natural African shea, marula oil, and botanical extracts formulated for radiant skin nourishment.',
      reviews: [],
    },
    {
      id: 'p-9',
      name: 'Match Tournament Football',
      category: 'Sports',
      price: 55000,
      seller: 'Sports Center',
      rating: 4.7,
      reviewsCount: 16,
      condition: 'Brand New',
      image:
        'https://images.unsplash.com/photo-1614632537190-23e4b7f8f0c7?auto=format&fit=crop&w=900&q=80',
      stock: 25,
      description:
        'FIFA-standard thermally bonded seamless surface for true trajectory and minimal moisture uptake.',
      reviews: [],
    },
    {
      id: 'p-10',
      name: 'Digital Business Masterclass',
      category: 'Digital',
      price: 120000,
      seller: 'BN Academy',
      rating: 4.9,
      reviewsCount: 110,
      condition: 'Brand New',
      image:
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
      stock: 999,
      description:
        'Lifetime access to 35 video modules, downloadable business templates, private community forum, and certificate.',
      reviews: [],
    },
    {
      id: 'p-11',
      name: 'Ergonomic Executive Desk Chair',
      category: 'Home',
      price: 320000,
      seller: 'Office Living',
      rating: 4.6,
      reviewsCount: 18,
      condition: 'Brand New',
      image:
        'https://images.unsplash.com/photo-1505843490701-5be5d7a5aab1?auto=format&fit=crop&w=900&q=80',
      stock: 8,
      description:
        'Adjustable lumbar support, breathable mesh back, multi-angle recline lock, and 3D armrests.',
      reviews: [],
    },
    {
      id: 'p-12',
      name: 'Polarized Aviator Sunglasses',
      category: 'Fashion',
      price: 45000,
      seller: 'Style Hub',
      rating: 4.8,
      reviewsCount: 31,
      condition: 'Brand New',
      image:
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
      stock: 50,
      description:
        'UV400 polarization protection, lightweight titanium alloy frame, and scratch-resistant optical lenses.',
      reviews: [],
    },
  ],
  orders: [
    {
      id: 'ord-1',
      orderNumber: '#GS-1048',
      items: [
        {
          id: 'item-1',
          productId: 'p-1',
          name: 'Premium Wireless Headphones',
          price: 145000,
          quantity: 1,
          image:
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
        },
      ],
      totalAmount: 145000,
      status: 'Paid',
      createdAt: 'Today, 11:20 AM',
      customerName: 'Sarah James',
      customerEmail: 'sarah.j@example.com',
    },
    {
      id: 'ord-2',
      orderNumber: '#GS-1047',
      items: [
        {
          id: 'item-2',
          productId: 'p-2',
          name: 'Smart Watch Pro',
          price: 95000,
          quantity: 1,
          image:
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
        },
      ],
      totalAmount: 95000,
      status: 'Processing',
      createdAt: 'Yesterday, 4:15 PM',
      customerName: 'David Michael',
      customerEmail: 'david.m@example.com',
    },
    {
      id: 'ord-3',
      orderNumber: '#GS-1046',
      items: [
        {
          id: 'item-3',
          productId: 'p-3',
          name: 'Premium Leather Bag',
          price: 85000,
          quantity: 1,
          image:
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
        },
      ],
      totalAmount: 85000,
      status: 'Shipped',
      createdAt: '2 days ago',
      customerName: 'Grace Writer',
      customerEmail: 'grace.w@example.com',
    },
  ],
  conversations: [
    {
      id: 'conv-sarah',
      contactName: 'Sarah James',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      lastMessage: 'I love the new Global Shopping experience.',
      lastMessageTime: '10:45 AM',
      isOnline: true,
      unreadCount: 0,
      role: 'Creator & Buyer',
    },
    {
      id: 'conv-david',
      contactName: 'David Michael',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      lastMessage: 'Product order update received, tracking #GS1047.',
      lastMessageTime: 'Yesterday',
      isOnline: false,
      unreadCount: 1,
      role: 'Seller & Partner',
    },
    {
      id: 'conv-grace',
      contactName: 'Grace Writer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      lastMessage: 'Your book "The Digital Vision" is truly amazing!',
      lastMessageTime: 'Oct 4',
      isOnline: true,
      unreadCount: 0,
      role: 'Author & Member',
    },
    {
      id: 'conv-support',
      contactName: 'Global Seller Support',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      lastMessage: 'Store verification completed successfully.',
      lastMessageTime: 'Oct 2',
      isOnline: true,
      unreadCount: 0,
      role: 'Marketplace Operations',
    },
  ],
  messages: {
    'conv-sarah': [
      {
        id: 'm1',
        senderId: 'sarah',
        receiverId: 'me',
        text: 'Hello Ev Dr. Boniphace J. Ndege! How are you doing today?',
        timestamp: '10:30 AM',
        isMe: false,
      },
      {
        id: 'm2',
        senderId: 'me',
        receiverId: 'sarah',
        text: "I'm doing great! Welcome to the new integrated platform and Global Shopping.",
        timestamp: '10:32 AM',
        isMe: true,
      },
      {
        id: 'm3',
        senderId: 'sarah',
        receiverId: 'me',
        text: 'I love the new Global Shopping experience and how easy it is to find books and gear.',
        timestamp: '10:45 AM',
        isMe: false,
      },
    ],
    'conv-david': [
      {
        id: 'm4',
        senderId: 'david',
        receiverId: 'me',
        text: 'Hello! I noticed the new seller tools in Seller Center.',
        timestamp: 'Yesterday',
        isMe: false,
      },
      {
        id: 'm5',
        senderId: 'me',
        receiverId: 'david',
        text: 'Yes David, you can now add items with stock tracking and receive direct orders.',
        timestamp: 'Yesterday',
        isMe: true,
      },
      {
        id: 'm6',
        senderId: 'david',
        receiverId: 'me',
        text: 'Product order update received, tracking #GS1047.',
        timestamp: 'Yesterday',
        isMe: false,
      },
    ],
    'conv-grace': [
      {
        id: 'm7',
        senderId: 'grace',
        receiverId: 'me',
        text: 'Your book "The Digital Vision" is truly amazing!',
        timestamp: 'Oct 4',
        isMe: false,
      },
    ],
    'conv-support': [
      {
        id: 'm8',
        senderId: 'support',
        receiverId: 'me',
        text: 'Store verification completed successfully. Your catalog is now live in Global Shopping.',
        timestamp: 'Oct 2',
        isMe: false,
      },
    ],
  },
  meetings: [
    {
      id: 'meet-1',
      title: 'Digital Business & The Future',
      schedule: 'Live Broadcasting Now',
      isLiveNow: true,
      hostName: 'Ev Dr. Boniphace J. Ndege',
      participantsCount: 148,
    },
    {
      id: 'meet-2',
      title: 'Entrepreneurs Community Round Table',
      schedule: 'Today • 8:00 PM',
      isLiveNow: false,
      hostName: 'Ev Dr. Boniphace J. Ndege',
      participantsCount: 85,
    },
    {
      id: 'meet-3',
      title: 'Book Readers & Authors Club',
      schedule: 'Tomorrow • 6:30 PM',
      isLiveNow: false,
      hostName: 'Ev Dr. Boniphace J. Ndege',
      participantsCount: 62,
    },
    {
      id: 'meet-4',
      title: 'Global Shopping Sellers Workshop',
      schedule: 'Saturday • 4:00 PM',
      isLiveNow: false,
      hostName: 'Ev Dr. Boniphace J. Ndege & Operations',
      participantsCount: 120,
    },
  ],
};

class StorageManager {
  private cache: DatabaseSchema | null = null;

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  public getData(): DatabaseSchema {
    if (this.cache) {
      return this.cache;
    }

    this.ensureDirectory();

    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      this.cache = JSON.parse(JSON.stringify(INITIAL_DATA));
      return this.cache!;
    }

    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      this.cache = JSON.parse(content);
      if (this.cache && Array.isArray(this.cache.products)) {
        this.cache.products.forEach((p, idx) => {
          if (!p.condition) {
            p.condition = INITIAL_DATA.products[idx]?.condition || 'Brand New';
          }
          if (!p.reviews) {
            p.reviews = INITIAL_DATA.products[idx]?.reviews || [];
          }
          if (p.reviewsCount === undefined) {
            p.reviewsCount = p.reviews?.length || INITIAL_DATA.products[idx]?.reviewsCount || 12;
          }
        });
      }

      if (this.cache && Array.isArray(this.cache.videos)) {
        const fallbackUrls = [
          '/uploads/videos/inshot_20261010_real.mp4',
          'https://media.w3.org/2010/05/sintel/trailer.mp4',
          'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
          'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          'https://test-videos.co.uk/vids/jellyfish/mp4/h264/1080/Jellyfish_1080_10s_1MB.mp4',
        ];
        this.cache.videos.forEach((v, idx) => {
          if (
            !v.videoUrl ||
            v.videoUrl.startsWith('blob:') ||
            v.videoUrl.includes('commondatastorage.googleapis.com') ||
            v.videoUrl.includes('oceans.mp4')
          ) {
            v.videoUrl = v.title.includes('InShot')
              ? '/uploads/videos/inshot_20261010_real.mp4'
              : (INITIAL_DATA.videos[idx]?.videoUrl?.includes('oceans.mp4')
                  ? '/uploads/videos/inshot_20261010_real.mp4'
                  : (INITIAL_DATA.videos[idx]?.videoUrl || fallbackUrls[idx % fallbackUrls.length]));
          }
          if (v.likesCount === undefined) {
            v.likesCount = INITIAL_DATA.videos[idx]?.likesCount || 1200;
          }
          if (v.commentsCount === undefined) {
            v.commentsCount = v.comments?.length || INITIAL_DATA.videos[idx]?.commentsCount || 24;
          }
          if (!v.comments || v.comments.length === 0) {
            v.comments = INITIAL_DATA.videos[idx]?.comments || [
              {
                id: `c-init-${idx}`,
                author: 'Sarah Jenkins',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                text: 'Phenomenal video and quality content! Keep it up.',
                time: 'Yesterday',
              },
            ];
          }
        });
      }

      if (this.cache) {
        if (!this.cache.users || !Array.isArray(this.cache.users)) {
          this.cache.users = JSON.parse(JSON.stringify(INITIAL_DATA.users));
        }
        if (!this.cache.otps || typeof this.cache.otps !== 'object') {
          this.cache.otps = {};
        }
      }
      return this.cache!;
    } catch (err) {
      console.error('Failed to read db.json, resetting to INITIAL_DATA', err);
      this.cache = JSON.parse(JSON.stringify(INITIAL_DATA));
      return this.cache!;
    }
  }

  public saveData(data: DatabaseSchema): void {
    this.cache = data;
    this.ensureDirectory();
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist to db.json', err);
    }
  }
}

export const storage = new StorageManager();
