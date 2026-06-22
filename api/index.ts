import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { db, useSupabase, uploadToCloudinary, deleteFromCloudinary, useCloudinary } from './db';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const multipart = multer({ storage: multer.memoryStorage() }).any();
app.use((req, _res, next) => {
  if (req.is('multipart/form-data')) { multipart(req, _res, next); }
  else { next(); }
});
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
app.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache'); res.set('Expires', '0'); res.set('Surrogate-Control', 'no-store');
  next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key-1092';
const generateId = () => String(Date.now()) + '-' + Math.random().toString(36).slice(2, 8);
const getFileUrl = async (files: any, fieldName: string, fallback: string) => {
  if (!files || !Array.isArray(files)) return fallback;
  const file = files.find((f: any) => f.fieldname === fieldName);
  if (!file) return fallback;
  if (file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'))) return file.path;
  if (file.buffer) {
    const result = await uploadToCloudinary(file.buffer, 'portfolio_assets');
    if (result) return result.url;
  }
  return fallback;
};

const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied: No session authorization header found' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    req.user = decoded; next();
  } catch {
    return res.status(401).json({ message: 'Session expired or token invalid' });
  }
};

// ===== Diagnostic endpoint =====
app.get('/api/_debug', (_req, res) => {
  res.json({
    uptime: process.uptime(), node: process.version, useSupabase,
    env: {
      NODE_ENV: process.env.NODE_ENV || '(not set)',
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅ set' : '❌ missing',
      SUPABASE_KEY: (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY) ? '✅ set' : '❌ missing',
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '✅ set' : '❌ missing',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '✅ set' : '❌ missing',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '✅ set' : '❌ missing',
    },
    seeding: { useCloudinary, useSupabase },
  });
});

// ============================================
// AUTH
// ============================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(401).json({ message: 'Invalid credentials: Email and password required' });
    const user = await db.getUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials: User not found' });
    if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.post('/api/auth/logout', async (_req, res) => { res.json({ message: 'Logged out' }); });

app.get('/api/auth/me', authenticate, async (req: any, res) => {
  try {
    const user = await db.getUserByEmail(req.user.email);
    if (!user) return res.status(404).json({ message: 'User profile not found' });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// ============================================
// PROJECTS
// ============================================
app.get('/api/projects', async (_req, res) => {
  try { res.json(await db.getProjects()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.post('/api/projects', authenticate, async (req: any, res) => {
  try {
    const cover_image = await getFileUrl(req.files, 'cover_image', req.body.cover_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80');
    const images = req.body.images ? (typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images) : [];
    const techStack = req.body.tech_stack ? (typeof req.body.tech_stack === 'string' ? JSON.parse(req.body.tech_stack) : req.body.tech_stack) : [];
    const item = await db.createProject({
      title: req.body.title || '', internal_name: req.body.internal_name || null, description: req.body.description || '',
      cover_image, images, tech_stack: techStack, github_url: req.body.github_url || null, live_url: req.body.live_url || null,
      category: req.body.category || 'graphic', featured: req.body.featured === true || req.body.featured === 'true', status: 'published',
    });
    await db.logActivity('Project Created', `Added showcase work: ${item.title}`);
    res.status(201).json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.put('/api/projects/:id', authenticate, async (req: any, res) => {
  try {
    const body: any = {};
    const fields = ['title', 'internal_name', 'description', 'github_url', 'live_url', 'category', 'status'];
    for (const f of fields) { if (req.body[f] !== undefined) body[f] = req.body[f]; }
    if (req.body.tech_stack) body.tech_stack = typeof req.body.tech_stack === 'string' ? JSON.parse(req.body.tech_stack) : req.body.tech_stack;
    if (req.body.featured !== undefined) body.featured = req.body.featured === true || req.body.featured === 'true';
    const cover_image = await getFileUrl(req.files, 'cover_image', null);
    if (cover_image) body.cover_image = cover_image;
    const existingImages = req.body.existing_images ? (typeof req.body.existing_images === 'string' ? JSON.parse(req.body.existing_images) : req.body.existing_images) : [];
    const newImages = req.body.images ? (typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images) : [];
    body.images = [...existingImages, ...newImages];
    const item = await db.updateProject(req.params.id, body);
    if (!item) return res.status(404).json({ message: 'Project not found' });
    await db.logActivity('Project Updated', `Modified showcase work: ${item.title}`);
    res.json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/projects/:id', authenticate, async (req, res) => {
  try {
    await db.deleteProject(req.params.id);
    await db.logActivity('Project Deleted', `Removed showcase work ID: ${req.params.id}`);
    res.json({ message: 'Project deleted' });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// SKILLS
app.get('/api/skills', async (_req, res) => {
  try { res.json(await db.getSkills()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.post('/api/skills', authenticate, async (req: any, res) => {
  try {
    const item = await db.createSkill({ name: req.body.name, level: Number(req.body.level) || 0, category: req.body.category || 'frontend', order: Number(req.body.order) || 1 });
    await db.logActivity('Skill Added', `Added skill: ${item.name}`);
    res.status(201).json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.put('/api/skills/:id', authenticate, async (req: any, res) => {
  try {
    const item = await db.updateSkill(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: 'Skill not found' });
    await db.logActivity('Skill Updated', `Modified skill: ${item.name}`);
    res.json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/skills/:id', authenticate, async (req, res) => {
  try { await db.deleteSkill(req.params.id); res.json({ message: 'Skill deleted' }); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

// SERVICES
app.get('/api/services', async (_req, res) => {
  try { res.json(await db.getServices()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.post('/api/services', authenticate, async (req: any, res) => {
  try {
    const features = req.body.features ? (typeof req.body.features === 'string' ? JSON.parse(req.body.features) : req.body.features) : [];
    const item = await db.createService({
      title: req.body.title || '', description: req.body.description || '',       icon: await getFileUrl(req.files, 'service_image', req.body.icon || ''),
      features, price: req.body.price || null, order: Number(req.body.order) || 1,
    });
    await db.logActivity('Service Added', `Added service: ${item.title}`);
    res.status(201).json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.put('/api/services/:id', authenticate, async (req: any, res) => {
  try {
    const body: any = {};
    const fields = ['title', 'description', 'price'];
    for (const f of fields) { if (req.body[f] !== undefined) body[f] = req.body[f]; }
    if (req.body.order !== undefined) body.order = Number(req.body.order);
    if (req.body.features) body.features = typeof req.body.features === 'string' ? JSON.parse(req.body.features) : req.body.features;
    const icon = await getFileUrl(req.files, 'service_image', null);
    if (icon) body.icon = icon;
    if (req.body.icon !== undefined && !icon) body.icon = req.body.icon;
    const item = await db.updateService(req.params.id, body);
    if (!item) return res.status(404).json({ message: 'Service not found' });
    await db.logActivity('Service Updated', `Modified service: ${item.title}`);
    res.json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/services/:id', authenticate, async (req, res) => {
  try { await db.deleteService(req.params.id); res.json({ message: 'Service deleted' }); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

// TESTIMONIALS
app.get('/api/testimonials', async (_req, res) => {
  try { res.json(await db.getTestimonials()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.post('/api/testimonials', authenticate, async (req: any, res) => {
  try {
    const item = await db.createTestimonial({
      client_name: req.body.client_name || '',
      client_title: req.body.position || req.body.client_title || '',
      client_company: req.body.company || req.body.client_company || '',
      client_photo: await getFileUrl(req.files, 'client_photo', req.body.client_photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'),
      content: req.body.content || '', rating: Number(req.body.rating) || 5,
    });
    await db.logActivity('Testimonial Added', `Added testimonial from: ${item.client_name}`);
    res.status(201).json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.put('/api/testimonials/:id', authenticate, async (req: any, res) => {
  try {
    const body: any = {};
    const fields = ['client_name', 'client_photo', 'content', 'project_type', 'status'];
    for (const f of fields) { if (req.body[f] !== undefined) body[f] = req.body[f]; }
    if (req.body.rating !== undefined) body.rating = Number(req.body.rating);
    if (req.body.position !== undefined) body.client_title = req.body.position;
    if (req.body.company !== undefined) body.client_company = req.body.company;
    if (req.body.client_title !== undefined) body.client_title = req.body.client_title;
    if (req.body.client_company !== undefined) body.client_company = req.body.client_company;
    const photo = await getFileUrl(req.files, 'client_photo', null);
    if (photo) body.client_photo = photo;
    const item = await db.updateTestimonial(req.params.id, body);
    if (!item) return res.status(404).json({ message: 'Testimonial not found' });
    await db.logActivity('Testimonial Updated', `Modified testimonial from: ${item.client_name}`);
    res.json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/testimonials/:id', authenticate, async (req, res) => {
  try { await db.deleteTestimonial(req.params.id); res.json({ message: 'Testimonial deleted' }); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

// MESSAGES
app.post('/api/messages', async (req, res) => {
  try {
    const item = await db.createMessage({ name: req.body.name || '', email: req.body.email || '', subject: req.body.subject || '', message: req.body.message || '' });
    await db.logActivity('Comms Received', `Inquiry sent by: ${item.name}`);
    res.status(201).json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.get('/api/messages', authenticate, async (_req, res) => {
  try { res.json(await db.getMessages()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.patch('/api/messages/:id/read', authenticate, async (req, res) => {
  try {
    const item = await db.updateMessageStatus(req.params.id, 'read');
    if (!item) return res.status(404).json({ message: 'Message not found' });
    res.json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.patch('/api/messages/:id/archive', authenticate, async (req, res) => {
  try {
    const item = await db.updateMessageStatus(req.params.id, 'archived');
    if (!item) return res.status(404).json({ message: 'Message not found' });
    res.json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/messages/:id', authenticate, async (req, res) => {
  try { await db.deleteMessage(req.params.id); res.json({ message: 'Message deleted' }); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

// BLOG
app.get('/api/blog', async (_req, res) => {
  try { res.json(await db.getBlogPosts()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.get('/api/blog/categories', async (_req, res) => {
  try {
    const posts = await db.getBlogPosts();
    const tags = new Set<string>();
    posts.forEach((p: any) => (p.tags || []).forEach((t: string) => tags.add(t)));
    res.json(Array.from(tags));
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.post('/api/blog', authenticate, async (req: any, res) => {
  try {
    const tags = req.body.tags ? (typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags) : [];
    const item = await db.createBlogPost({
      title: req.body.title || '', slug: (req.body.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: req.body.excerpt || '', content: req.body.content || '',       cover_image: await getFileUrl(req.files, 'cover_image', req.body.cover_image || ''),
      tags, status: req.body.status || 'published',
    });
    await db.logActivity('Blog Published', `Published article: ${item.title}`);
    res.status(201).json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.put('/api/blog/:id', authenticate, async (req: any, res) => {
  try {
    const body: any = {};
    const fields = ['title', 'excerpt', 'content', 'status'];
    for (const f of fields) { if (req.body[f] !== undefined) body[f] = req.body[f]; }
    if (req.body.tags) body.tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
    if (req.body.title) body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const cover = await getFileUrl(req.files, 'cover_image', null);
    if (cover) body.cover_image = cover;
    const item = await db.updateBlogPost(req.params.id, body);
    if (!item) return res.status(404).json({ message: 'Blog post not found' });
    await db.logActivity('Blog Updated', `Modified article: ${item.title}`);
    res.json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/blog/:id', authenticate, async (req, res) => {
  try { await db.deleteBlogPost(req.params.id); res.json({ message: 'Article deleted' }); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

// ANALYTICS
app.get('/api/analytics/stats', async (_req, res) => {
  try { res.json(await db.getAnalyticsStats()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.get('/api/analytics/visitors', async (_req, res) => {
  try { res.json(await db.getVisitorChart()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.get('/api/analytics/devices', async (_req, res) => {
  try { res.json(await db.getDeviceChart()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.get('/api/analytics/browsers', async (_req, res) => {
  try { res.json(await db.getBrowserChart()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.get('/api/analytics/activity', authenticate, async (_req, res) => {
  try { res.json(await db.getActivityLogs()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.post('/api/analytics/track', async (_req, res) => {
  try { await db.trackVisit(); res.json({ success: true }); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

// SETTINGS
app.get('/api/settings', async (_req, res) => {
  try { res.json(await db.getSettings()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.put('/api/settings', authenticate, async (req: any, res) => {
  try {
    const body = { ...req.body };
    const avatar = await getFileUrl(req.files, 'avatar', null);
    if (avatar) body.avatar = avatar;
    const cv = await getFileUrl(req.files, 'cv', null);
    if (cv) body.cv_url = cv;
    const item = await db.updateSettings(body);
    await db.logActivity('Settings Config', 'Modified global profile settings');
    res.json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// MEDIA
app.get('/api/media', authenticate, async (_req, res) => {
  try { res.json(await db.getMedia()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.post('/api/media/upload', authenticate, async (req: any, res) => {
  try {
    const fileData = req.files?.find((f: any) => f.fieldname === 'file') || req.files?.[0];
    if (!fileData && !req.body.url) return res.status(400).json({ message: 'No file uploaded' });

    let url = req.body.url;
    let publicId = `local-${Date.now()}`;
    if (fileData?.buffer) {
      const result = await uploadToCloudinary(fileData.buffer, 'portfolio_assets');
      if (result) { url = result.url; publicId = result.publicId; }
    }
    const file = {
      id: generateId(), url, public_id: publicId,
      resource_type: fileData?.mimetype?.startsWith('video') ? 'video' : 'image',
      format: fileData?.mimetype?.split('/')[1] || 'png',
      size: fileData?.size || 0, created_at: new Date().toISOString(),
    };
    const item = await db.addMedia(file);
    await db.logActivity('Media Uploaded', `Added asset: ${item.public_id}`);
    res.status(201).json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/media/:public_id', authenticate, async (req, res) => {
  try {
    await deleteFromCloudinary(req.params.public_id);
    await db.deleteMedia(req.params.public_id);
    res.json({ message: 'Media deleted' });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// EXPERIENCE
app.get('/api/experience', async (_req, res) => {
  try { res.json(await db.getExperience()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.post('/api/experience', authenticate, async (req: any, res) => {
  try {
    const tags = req.body.tags ? (typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags) : [];
    const item = await db.createExperience({
      title: req.body.title || '', organization: req.body.company || req.body.organization || '', period: req.body.period || '',
      description: req.body.description || '', tags, order: Number(req.body.order) || 1, type: req.body.type || 'experience',
    });
    await db.logActivity('Experience Added', `Added timeline entry: ${item.title}`);
    res.status(201).json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.put('/api/experience/:id', authenticate, async (req: any, res) => {
  try {
    const body: any = {};
    const fields = ['title', 'period', 'description', 'type'];
    for (const f of fields) { if (req.body[f] !== undefined) body[f] = req.body[f]; }
    if (req.body.company !== undefined) body.organization = req.body.company;
    if (req.body.organization !== undefined) body.organization = req.body.organization;
    if (req.body.order !== undefined) body.order = Number(req.body.order);
    if (req.body.tags) body.tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
    const item = await db.updateExperience(req.params.id, body);
    if (!item) return res.status(404).json({ message: 'Experience entry not found' });
    await db.logActivity('Experience Updated', `Modified timeline entry: ${item.title}`);
    res.json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/experience/:id', authenticate, async (req, res) => {
  try { await db.deleteExperience(req.params.id); res.json({ message: 'Experience entry deleted' }); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

// LANGUAGES
app.get('/api/languages', async (_req, res) => {
  try { res.json(await db.getLanguages()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.post('/api/languages', authenticate, async (req: any, res) => {
  try {
    const p = Number(req.body.level) || Number(req.body.proficiency) || 0;
    const item = await db.createLanguage({
      name: req.body.name || '', proficiency: p, level: String(p),
      order: Number(req.body.order) || 1,
    });
    await db.logActivity('Language Added', `Added language: ${item.name}`);
    res.status(201).json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.put('/api/languages/:id', authenticate, async (req: any, res) => {
  try {
    const body: any = {};
    if (req.body.name !== undefined) body.name = req.body.name;
    if (req.body.level !== undefined || req.body.proficiency !== undefined) {
      const p = Number(req.body.proficiency) || Number(req.body.level) || 0;
      body.proficiency = p; body.level = String(p);
    }
    if (req.body.order !== undefined) body.order = Number(req.body.order);
    const item = await db.updateLanguage(req.params.id, body);
    if (!item) return res.status(404).json({ message: 'Language not found' });
    await db.logActivity('Language Updated', `Modified language: ${item.name}`);
    res.json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/languages/:id', authenticate, async (req, res) => {
  try { await db.deleteLanguage(req.params.id); res.json({ message: 'Language deleted' }); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

// CLIENT LOGOS
app.get('/api/client-logos', async (_req, res) => {
  try { res.json(await db.getClientLogos()); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.post('/api/client-logos', authenticate, async (req: any, res) => {
  try {
    const item = await db.createClientLogo({
      name: req.body.name || '', src: await getFileUrl(req.files, 'logo_image', req.body.src || ''), order: Number(req.body.order) || 1,
    });
    await db.logActivity('Client Logo Added', `Added client logo: ${item.name}`);
    res.status(201).json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.put('/api/client-logos/:id', authenticate, async (req: any, res) => {
  try {
    const body: any = {};
    if (req.body.name !== undefined) body.name = req.body.name;
    if (req.body.order !== undefined) body.order = Number(req.body.order);
    const src = await getFileUrl(req.files, 'logo_image', null);
    if (src) body.src = src;
    else if (req.body.src !== undefined) body.src = req.body.src;
    const item = await db.updateClientLogo(req.params.id, body);
    if (!item) return res.status(404).json({ message: 'Client logo not found' });
    await db.logActivity('Client Logo Updated', `Modified client logo: ${item.name}`);
    res.json(item);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/client-logos/:id', authenticate, async (req, res) => {
  try { await db.deleteClientLogo(req.params.id); res.json({ message: 'Client logo deleted' }); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
