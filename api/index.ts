import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Parse multipart/form-data (text fields + file buffers in memory)
const multipart = multer().any();
app.use((req, _res, next) => {
  if (req.is('multipart/form-data')) {
    multipart(req, _res, next);
  } else {
    next();
  }
});
app.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key-1092';

// ===== In-Memory Mock Database =====
const ADMIN_HASH = bcrypt.hashSync('password123', 10);
let DATA = {
  users: [
    {
      id: '1',
      email: 'admin@portfolio.system',
      password_hash: ADMIN_HASH,
      name: 'Site Administrator',
      role: 'admin',
      created_at: new Date().toISOString(),
    },
  ],
  settings: {
    name: 'معتز جمعة',
    title: 'جونيور جرافيك ديزاينر',
    subtitle: 'Crafting premium digital experiences',
    bio: 'الإبداع ليس ما نفعله فقط بل ما نتركه في أذهان عملائنا\nمن تصميم الهوية البصرية إلى المحتوى الإبداعي الذي يبرز علامتك التجارية.',
    email: 'hello@portfolio.dev',
    phone: '+1 (555) 000-0000',
    location: 'البحيرة، مصر',
    seo_title: 'Futuristic Portfolio Platform',
    seo_description: 'Premium glassmorphism developer portfolio website',
    hero_headline: 'حين يجتمع الإبداع مع التفاصيل\nتولد تصاميم استثنائية.',
    hero_subheadline: 'موثوق من قبل',
    about_description: 'الإبداع ليس ما نفعله فقط بل ما نتركه في أذهان عملائنا\nمن تصميم الهوية البصرية إلى المحتوى الإبداعي الذي يبرز علامتك التجارية.',
    about_section_title: 'نبذة عني',
    about_section_heading: 'نحول الأفكار إلى تصاميم مؤثرة',
    about_cta_text: 'لنعمل معاً الآن',
    stat1_value: '+4',
    stat1_label: 'شركات',
    stat2_value: '+75',
    stat2_label: 'تصميم',
    client_logos: [
      { name: 'بيرفكت', src: '/logos/perfect.png' },
      { name: 'EGYFIELD', src: '/logos/egyfield.png' },
      { name: 'معتز', src: '/logos/moataz.png' },
      { name: 'المعاهد التعليمية', src: '/logos/institutes.png' },
    ],
    marquee_row1: [
      { text: 'تصميم الهوية', variant: 'glass' },
      { text: 'تصميم الشعارات', variant: 'solid' },
      { text: 'براندنج', variant: 'solid' },
      { text: 'تصاميم سوشيال ميديا', variant: 'solid' },
    ],
    marquee_row2: [
      { text: 'المطبوعات', variant: 'glass' },
      { text: 'براندنج', variant: 'solid' },
      { text: 'واجهات المستخدم', variant: 'solid' },
      { text: 'تصميم التغليف', variant: 'solid' },
      { text: 'إنفوجرافيك', variant: 'solid' },
      { text: 'تصميم العروض التقديمية', variant: 'glass' },
    ],
    social_links: [],
    availability_status: 'available',
    availability_response_time: '< 24 hours',
    avatar: '',
    cv_url: '',
  },
  projects: [] as any[],
  skills: [] as any[],
  services: [
    {
      id: 'srv-1',
      title: 'الهوية البصرية',
      description: 'أبني هويات بصرية متكاملة تؤسس شخصية العلامة التجارية وتترك انطباعاً قوياً لدى العملاء، بدءاً من الشعار وحتى أدق العناصر البصرية المرتبطة بالعلامة.',
      icon: '/services/branding.png',
      features: ['تصميم الشعارات', 'دليل الهوية', 'الأوراق الرسمية'],
      price: 'Quotes',
      order: 1,
    },
    {
      id: 'srv-2',
      title: 'تصميم السوشيال ميديا',
      description: 'إنشاء تصاميم إبداعية وجذابة لمنصات التواصل الاجتماعي تساعد على زيادة التفاعل وتعزز حضور العلامة التجارية بشكل احترافي ومبتكر.',
      icon: '/services/social_media.png',
      features: ['تصاميم إنستجرام', 'بنرات فيسبوك', 'محتوى إبداعي'],
      price: 'Quotes',
      order: 2,
    },
    {
      id: 'srv-3',
      title: 'تصميم المطبوعات',
      description: 'تصميم مواد تسويقية ومطبوعات احترافية تعزز هوية العلامة التجارية وتساعد على إيصال الرسائل التسويقية بشكل فعال ومميز.',
      icon: '/services/print.png',
      features: ['بروشورات', 'فلايرات', 'تغليف المنتجات'],
      price: 'Quotes',
      order: 3,
    },
    {
      id: 'srv-4',
      title: 'تصميم واجهات المستخدم',
      description: 'تصميم واجهات رقمية حديثة تجمع بين الجمال وسهولة الاستخدام لتقديم تجربة مستخدم مميزة وتحقق أهداف المشروع بكفاءة.',
      icon: '/services/ui_ux.png',
      features: ['تصميم تطبيقات', 'واجهات مواقع web', 'تجربة مستخدم UX'],
      price: 'Quotes',
      order: 4,
    },
  ],
  testimonials: [] as any[],
  messages: [] as any[],
  blog_posts: [] as any[],
  experience: [] as any[],
  languages: [] as any[],
  media: [] as any[],
  client_logos: [
    { id: 'cl-1', name: 'بيرفكت', src: '/logos/perfect.png', order: 1, created_at: new Date().toISOString() },
    { id: 'cl-2', name: 'EGYFIELD', src: '/logos/egyfield.png', order: 2, created_at: new Date().toISOString() },
    { id: 'cl-3', name: 'معتز', src: '/logos/moataz.png', order: 3, created_at: new Date().toISOString() },
    { id: 'cl-4', name: 'المعاهد التعليمية', src: '/logos/institutes.png', order: 4, created_at: new Date().toISOString() },
  ],
  analytics: {
    total_visitors: 1420,
    total_projects: 0,
    total_messages: 0,
    total_posts: 0,
    unread_messages: 0,
    visitors: [
      { name: 'Mon', visits: 120 },
      { name: 'Tue', visits: 180 },
      { name: 'Wed', visits: 240 },
      { name: 'Thu', visits: 200 },
      { name: 'Fri', visits: 310 },
      { name: 'Sat', visits: 280 },
      { name: 'Sun', visits: 380 },
    ],
    devices: [
      { name: 'Desktop', value: 65, color: '#00BFFF' },
      { name: 'Mobile', value: 28, color: '#4F46E5' },
      { name: 'Tablet', value: 7, color: '#7C3AED' },
    ],
    browsers: [
      { name: 'Chrome', value: 55, color: '#00BFFF' },
      { name: 'Safari', value: 25, color: '#06B6D4' },
      { name: 'Firefox', value: 12, color: '#4F46E5' },
      { name: 'Edge', value: 8, color: '#7C3AED' },
    ],
  },
  activity_logs: [] as any[],
};

// ===== Auth Middleware =====
const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied: No session authorization header found' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Session expired or token invalid' });
  }
};

// ===== Helper =====
const logActivity = (action: string, description: string) => {
  DATA.activity_logs.unshift({
    id: String(Date.now()),
    action,
    description,
    created_at: new Date().toISOString(),
  });
};

const generateId = () => String(Date.now()) + '-' + Math.random().toString(36).slice(2, 8);

// Get first uploaded file URL from multer req.files
const getFileUrl = (files: any, fieldName: string, fallback: string) => {
  if (!files || !Array.isArray(files)) return fallback;
  const file = files.find((f: any) => f.fieldname === fieldName);
  if (!file) return fallback;
  if (file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'))) return file.path;
  return file.filename ? `/uploads/${file.filename}` : (file.buffer ? `data:${file.mimetype};base64,${file.buffer.toString('base64')}` : fallback);
};

// ===== Diagnostic endpoint =====
app.get('/api/_debug', (_req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    node: process.version,
    dataKeys: Object.keys(DATA),
    clientLogosCount: DATA.client_logos.length,
    usersCount: DATA.users.length,
    env: { NODE_ENV: process.env.NODE_ENV || '(not set)' },
  });
});

// ============================================
// AUTH ROUTES
// ============================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const body = req.body || {};
    const { email, password } = body;
    if (!email || !password) {
      return res.status(401).json({ message: 'Invalid credentials: Email and password required' });
    }
    const user = DATA.users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials: User not found' });
    }
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials: Authentication failed' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/logout', async (_req, res) => {
  res.json({ message: 'Logged out' });
});

app.get('/api/auth/me', authenticate, async (req: any, res) => {
  try {
    const user = DATA.users.find((u) => u.email === req.user.email);
    if (!user) return res.status(404).json({ message: 'User profile not found' });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// PROJECTS
// ============================================
app.get('/api/projects', async (_req, res) => {
  try {
    res.json(DATA.projects);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/projects', authenticate, async (req: any, res) => {
  try {
    const project = {
      id: generateId(),
      created_at: new Date().toISOString(),
      title: req.body.title || '',
      internal_name: req.body.internal_name || null,
      description: req.body.description || '',
      cover_image: req.body.cover_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
      images: req.body.images || [],
      tech_stack: req.body.tech_stack || [],
      github_url: req.body.github_url || null,
      live_url: req.body.live_url || null,
      category: req.body.category || 'graphic',
      featured: req.body.featured === true || req.body.featured === 'true',
      status: 'published',
    };
    DATA.projects.push(project);
    logActivity('Project Created', `Added showcase work: ${project.title}`);
    res.status(201).json(project);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/projects/:id', authenticate, async (req: any, res) => {
  try {
    const idx = DATA.projects.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Project not found' });
    DATA.projects[idx] = { ...DATA.projects[idx], ...req.body, id: DATA.projects[idx].id, created_at: DATA.projects[idx].created_at };
    logActivity('Project Updated', `Modified showcase work: ${DATA.projects[idx].title}`);
    res.json(DATA.projects[idx]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/projects/:id', authenticate, async (req, res) => {
  try {
    DATA.projects = DATA.projects.filter((p) => p.id !== req.params.id);
    logActivity('Project Deleted', `Removed showcase work ID: ${req.params.id}`);
    res.json({ message: 'Project deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// SKILLS
// ============================================
app.get('/api/skills', async (_req, res) => {
  try {
    res.json(DATA.skills);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/skills', authenticate, async (req: any, res) => {
  try {
    const skill = { id: generateId(), created_at: new Date().toISOString(), ...req.body };
    DATA.skills.push(skill);
    logActivity('Skill Matrix Config', `Added skill: ${skill.name}`);
    res.status(201).json(skill);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/skills/:id', authenticate, async (req: any, res) => {
  try {
    const idx = DATA.skills.findIndex((s) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Skill not found' });
    DATA.skills[idx] = { ...DATA.skills[idx], ...req.body, id: DATA.skills[idx].id };
    logActivity('Skill Matrix Config', `Modified skill: ${DATA.skills[idx].name}`);
    res.json(DATA.skills[idx]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/skills/:id', authenticate, async (req, res) => {
  try {
    DATA.skills = DATA.skills.filter((s) => s.id !== req.params.id);
    logActivity('Skill Matrix Config', `Removed skill ID: ${req.params.id}`);
    res.json({ message: 'Skill deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// SERVICES
// ============================================
app.get('/api/services', async (_req, res) => {
  try {
    res.json([...DATA.services].sort((a, b) => (a.order || 0) - (b.order || 0)));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/services', authenticate, async (req: any, res) => {
  try {
    const service = {
      id: generateId(),
      created_at: new Date().toISOString(),
      title: req.body.title,
      description: req.body.description,
      icon: req.body.icon || '',
      features: req.body.features || [],
      price: req.body.price || null,
      order: Number(req.body.order) || 1,
    };
    DATA.services.push(service);
    logActivity('Service Config', `Added catalog card: ${service.title}`);
    res.status(201).json(service);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/services/:id', authenticate, async (req: any, res) => {
  try {
    const idx = DATA.services.findIndex((s) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Service not found' });
    DATA.services[idx] = { ...DATA.services[idx], ...req.body, id: DATA.services[idx].id };
    logActivity('Service Config', `Modified catalog card: ${DATA.services[idx].title}`);
    res.json(DATA.services[idx]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/services/:id', authenticate, async (req, res) => {
  try {
    DATA.services = DATA.services.filter((s) => s.id !== req.params.id);
    logActivity('Service Config', `Removed service card ID: ${req.params.id}`);
    res.json({ message: 'Service deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// TESTIMONIALS
// ============================================
app.get('/api/testimonials', async (_req, res) => {
  try {
    res.json(DATA.testimonials);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/testimonials', authenticate, async (req: any, res) => {
  try {
    const testimonial = {
      id: generateId(),
      created_at: new Date().toISOString(),
      ...req.body,
      rating: Number(req.body.rating) || 5,
      client_photo: req.body.client_photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    };
    DATA.testimonials.push(testimonial);
    logActivity('Testimonial Added', `Added review card from: ${testimonial.client_name}`);
    res.status(201).json(testimonial);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/testimonials/:id', authenticate, async (req: any, res) => {
  try {
    const idx = DATA.testimonials.findIndex((t) => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Testimonial not found' });
    DATA.testimonials[idx] = { ...DATA.testimonials[idx], ...req.body, id: DATA.testimonials[idx].id };
    logActivity('Testimonial Updated', `Modified review card from: ${DATA.testimonials[idx].client_name}`);
    res.json(DATA.testimonials[idx]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/testimonials/:id', authenticate, async (req, res) => {
  try {
    DATA.testimonials = DATA.testimonials.filter((t) => t.id !== req.params.id);
    logActivity('Testimonial Deleted', `Removed review card ID: ${req.params.id}`);
    res.json({ message: 'Testimonial deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// MESSAGES
// ============================================
app.post('/api/messages', async (req, res) => {
  try {
    const message = {
      id: generateId(),
      status: 'unread',
      created_at: new Date().toISOString(),
      ...req.body,
    };
    DATA.messages.push(message);
    logActivity('Comms Received', `Inquiry sent by: ${message.name}`);
    res.status(201).json(message);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/messages', authenticate, async (_req, res) => {
  try {
    res.json(DATA.messages);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/messages/:id/read', authenticate, async (req, res) => {
  try {
    const msg = DATA.messages.find((m) => m.id === req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    msg.status = 'read';
    res.json(msg);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/messages/:id/archive', authenticate, async (req, res) => {
  try {
    const msg = DATA.messages.find((m) => m.id === req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    msg.status = 'archived';
    res.json(msg);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/messages/:id', authenticate, async (req, res) => {
  try {
    DATA.messages = DATA.messages.filter((m) => m.id !== req.params.id);
    logActivity('Comms Deleted', `Removed inquiry ID: ${req.params.id}`);
    res.json({ message: 'Inquiry deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// BLOG
// ============================================
app.get('/api/blog', async (_req, res) => {
  try {
    res.json(DATA.blog_posts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/blog/categories', async (_req, res) => {
  try {
    const tags = new Set<string>();
    DATA.blog_posts.forEach((p: any) => (p.tags || []).forEach((t: string) => tags.add(t)));
    res.json(Array.from(tags));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/blog', authenticate, async (req: any, res) => {
  try {
    const post = {
      id: generateId(),
      created_at: new Date().toISOString(),
      views: 0,
      title: req.body.title || '',
      slug: (req.body.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: req.body.excerpt || '',
      content: req.body.content || '',
      cover_image: req.body.cover_image || '',
      tags: req.body.tags || [],
      status: req.body.status || 'published',
    };
    DATA.blog_posts.push(post);
    logActivity('Blog Published', `Published article: ${post.title}`);
    res.status(201).json(post);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/blog/:id', authenticate, async (req: any, res) => {
  try {
    const idx = DATA.blog_posts.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Blog post not found' });
    DATA.blog_posts[idx] = { ...DATA.blog_posts[idx], ...req.body, id: DATA.blog_posts[idx].id };
    if (req.body.title) {
      DATA.blog_posts[idx].slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    logActivity('Blog Updated', `Modified article: ${DATA.blog_posts[idx].title}`);
    res.json(DATA.blog_posts[idx]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/blog/:id', authenticate, async (req, res) => {
  try {
    DATA.blog_posts = DATA.blog_posts.filter((p) => p.id !== req.params.id);
    logActivity('Blog Deleted', `Removed article ID: ${req.params.id}`);
    res.json({ message: 'Article deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// ANALYTICS
// ============================================
app.get('/api/analytics/stats', async (_req, res) => {
  try {
    res.json({
      total_visitors: DATA.analytics.total_visitors,
      total_projects: DATA.projects.length,
      total_messages: DATA.messages.length,
      total_posts: DATA.blog_posts.length,
      unread_messages: DATA.messages.filter((m) => m.status === 'unread').length,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/analytics/visitors', async (_req, res) => {
  try {
    res.json(DATA.analytics.visitors);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/analytics/devices', async (_req, res) => {
  try {
    res.json(DATA.analytics.devices);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/analytics/browsers', async (_req, res) => {
  try {
    res.json(DATA.analytics.browsers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/analytics/activity', authenticate, async (_req, res) => {
  try {
    res.json(DATA.activity_logs);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/analytics/track', async (_req, res) => {
  try {
    DATA.analytics.total_visitors += 1;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// SETTINGS
// ============================================
app.get('/api/settings', async (_req, res) => {
  try {
    res.json(DATA.settings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/settings', authenticate, async (req: any, res) => {
  try {
    DATA.settings = { ...DATA.settings, ...req.body };
    logActivity('Settings Config', 'Modified global profile settings');
    res.json(DATA.settings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// MEDIA
// ============================================
app.get('/api/media', authenticate, async (_req, res) => {
  try {
    res.json(DATA.media);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/media/upload', authenticate, async (req: any, res) => {
  try {
    const file = {
      id: generateId(),
      url: req.body.url || `https://via.placeholder.com/400?text=${encodeURIComponent(req.body.name || 'media')}`,
      public_id: req.body.public_id || `local-${Date.now()}`,
      resource_type: req.body.resource_type || 'image',
      format: req.body.format || 'png',
      size: req.body.size || 0,
      created_at: new Date().toISOString(),
    };
    DATA.media.push(file);
    logActivity('Media Uploaded', `Added asset: ${file.public_id}`);
    res.status(201).json(file);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/media/:public_id', authenticate, async (req, res) => {
  try {
    DATA.media = DATA.media.filter((m) => m.public_id !== req.params.public_id);
    logActivity('Media Deleted', `Removed asset: ${req.params.public_id}`);
    res.json({ message: 'Media deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// EXPERIENCE
// ============================================
app.get('/api/experience', async (_req, res) => {
  try {
    res.json([...DATA.experience].sort((a, b) => (a.order || 0) - (b.order || 0)));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/experience', authenticate, async (req: any, res) => {
  try {
    const entry = {
      id: generateId(),
      created_at: new Date().toISOString(),
      ...req.body,
      tags: typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags || [],
    };
    DATA.experience.push(entry);
    logActivity('Experience Added', `Added timeline entry: ${entry.title}`);
    res.status(201).json(entry);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/experience/:id', authenticate, async (req: any, res) => {
  try {
    const idx = DATA.experience.findIndex((e) => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Experience entry not found' });
    const update = { ...req.body };
    if (update.tags && typeof update.tags === 'string') update.tags = JSON.parse(update.tags);
    DATA.experience[idx] = { ...DATA.experience[idx], ...update, id: DATA.experience[idx].id };
    logActivity('Experience Updated', `Modified timeline entry: ${DATA.experience[idx].title}`);
    res.json(DATA.experience[idx]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/experience/:id', authenticate, async (req, res) => {
  try {
    DATA.experience = DATA.experience.filter((e) => e.id !== req.params.id);
    logActivity('Experience Deleted', `Removed timeline entry ID: ${req.params.id}`);
    res.json({ message: 'Experience entry deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// LANGUAGES
// ============================================
app.get('/api/languages', async (_req, res) => {
  try {
    res.json([...DATA.languages].sort((a, b) => (a.order || 0) - (b.order || 0)));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/languages', authenticate, async (req: any, res) => {
  try {
    const lang = { id: generateId(), created_at: new Date().toISOString(), ...req.body };
    DATA.languages.push(lang);
    logActivity('Language Added', `Added language: ${lang.name}`);
    res.status(201).json(lang);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/languages/:id', authenticate, async (req: any, res) => {
  try {
    const idx = DATA.languages.findIndex((l) => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Language not found' });
    DATA.languages[idx] = { ...DATA.languages[idx], ...req.body, id: DATA.languages[idx].id };
    logActivity('Language Updated', `Modified language: ${DATA.languages[idx].name}`);
    res.json(DATA.languages[idx]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/languages/:id', authenticate, async (req, res) => {
  try {
    DATA.languages = DATA.languages.filter((l) => l.id !== req.params.id);
    logActivity('Language Deleted', `Removed language ID: ${req.params.id}`);
    res.json({ message: 'Language deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// CLIENT LOGOS
// ============================================
app.get('/api/client-logos', async (_req, res) => {
  try {
    res.json([...DATA.client_logos].sort((a, b) => (a.order || 0) - (b.order || 0)));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/client-logos', authenticate, async (req: any, res) => {
  try {
    const logo = {
      id: generateId(),
      created_at: new Date().toISOString(),
      name: req.body.name || '',
      src: req.body.src || '',
      order: Number(req.body.order) || 1,
    };
    DATA.client_logos.push(logo);
    logActivity('Client Logo Added', `Added client logo: ${logo.name}`);
    res.status(201).json(logo);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/client-logos/:id', authenticate, async (req: any, res) => {
  try {
    const idx = DATA.client_logos.findIndex((l) => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Client logo not found' });
    DATA.client_logos[idx] = { ...DATA.client_logos[idx], ...req.body, id: DATA.client_logos[idx].id };
    logActivity('Client Logo Updated', `Modified client logo: ${DATA.client_logos[idx].name}`);
    res.json(DATA.client_logos[idx]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/client-logos/:id', authenticate, async (req, res) => {
  try {
    DATA.client_logos = DATA.client_logos.filter((l) => l.id !== req.params.id);
    logActivity('Client Logo Deleted', `Removed client logo ID: ${req.params.id}`);
    res.json({ message: 'Client logo deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ===== Error Handler =====
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
