import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../services/db';
import { authenticate } from '../middleware/auth';
import { upload, cloudinary } from '../config/cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key-1092';

// Helper to convert request file to Cloudinary URL
const getUploadedFileUrl = (req: any) => {
  return req.file ? req.file.path : null;
};

// ============================================
// AUTHENTICATION
// ============================================
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials: User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
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
      token
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/auth/me', authenticate, async (req: any, res) => {
  try {
    const user = await db.getUserByEmail(req.user.email);
    if (!user) return res.status(404).json({ message: 'User profile not found' });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// PROJECTS
// ============================================
router.get('/projects', async (req, res) => {
  try {
    const data = await db.getProjects();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/projects', authenticate, upload.fields([
  { name: 'cover_image', maxCount: 1 },
  { name: 'gallery_images', maxCount: 20 }
]), async (req, res) => {
  try {
    const files = (req as any).files;
    let coverUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80';
    if (files && files['cover_image'] && files['cover_image'][0]) {
      coverUrl = files['cover_image'][0].path || files['cover_image'][0].url || coverUrl;
    }
    
    let galleryUrls: string[] = [];
    if (files && files['gallery_images']) {
      galleryUrls = files['gallery_images'].map((f: any) => f.path || f.url || '');
    }

    const techStack = req.body.tech_stack ? JSON.parse(req.body.tech_stack) : [];
    const featured = req.body.featured === 'true';

    const projectData = {
      title: req.body.title || '',
      internal_name: req.body.internal_name || null,
      description: req.body.description || '',
      cover_image: coverUrl,
      images: galleryUrls,
      tech_stack: techStack,
      github_url: req.body.github_url || null,
      live_url: req.body.live_url || null,
      category: req.body.category || 'graphic',
      featured,
      status: 'published'
    };

    const data = await db.createProject(projectData);
    await db.logActivity('Project Created', `Added showcase work: ${projectData.title}`);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/projects/:id', authenticate, upload.fields([
  { name: 'cover_image', maxCount: 1 },
  { name: 'gallery_images', maxCount: 20 }
]), async (req, res) => {
  try {
    const files = (req as any).files;
    const updateData: any = {
      title: req.body.title,
      internal_name: req.body.internal_name || null,
      description: req.body.description,
      category: req.body.category,
      featured: req.body.featured === 'true',
      github_url: req.body.github_url || null,
      live_url: req.body.live_url || null,
    };

    if (req.body.tech_stack) {
      updateData.tech_stack = JSON.parse(req.body.tech_stack);
    }

    if (files && files['cover_image'] && files['cover_image'][0]) {
      updateData.cover_image = files['cover_image'][0].path || files['cover_image'][0].url;
    }

    let newGalleryUrls: string[] = [];
    if (files && files['gallery_images']) {
      newGalleryUrls = files['gallery_images'].map((f: any) => f.path || f.url || '');
    }

    let existingImages: string[] = [];
    if (req.body.existing_images) {
      existingImages = JSON.parse(req.body.existing_images);
    }
    
    updateData.images = [...existingImages, ...newGalleryUrls];

    const data = await db.updateProject(String(req.params.id), updateData);
    await db.logActivity('Project Updated', `Modified showcase work: ${updateData.title}`);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/projects/:id', authenticate, async (req, res) => {
  try {
    await db.deleteProject(String(req.params.id));
    await db.logActivity('Project Deleted', `Removed showcase work ID: ${req.params.id}`);
    res.json({ message: 'Project deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// SKILLS
// ============================================
router.get('/skills', async (req, res) => {
  try {
    const data = await db.getSkills();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/skills', authenticate, async (req, res) => {
  try {
    const data = await db.createSkill(req.body);
    await db.logActivity('Skill Matrix Config', `Added skill: ${req.body.name}`);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/skills/:id', authenticate, async (req, res) => {
  try {
    const data = await db.updateSkill(String(req.params.id), req.body);
    await db.logActivity('Skill Matrix Config', `Modified skill: ${req.body.name}`);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/skills/:id', authenticate, async (req, res) => {
  try {
    await db.deleteSkill(String(req.params.id));
    await db.logActivity('Skill Matrix Config', `Removed skill ID: ${req.params.id}`);
    res.json({ message: 'Skill deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// SERVICES
// ============================================
router.get('/services', async (req, res) => {
  try {
    const data = await db.getServices();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/services', authenticate, upload.single('service_image'), async (req, res) => {
  try {
    const imageUrl = getUploadedFileUrl(req) || req.body.icon || '';
    
    let features = [];
    if (req.body.features) {
      features = typeof req.body.features === 'string' ? JSON.parse(req.body.features) : req.body.features;
    }

    const serviceData = {
      title: req.body.title,
      description: req.body.description,
      icon: imageUrl,
      features,
      price: req.body.price || null,
      order: Number(req.body.order) || 1
    };

    const data = await db.createService(serviceData);
    await db.logActivity('Service Config', `Added catalog card: ${serviceData.title}`);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/services/:id', authenticate, upload.single('service_image'), async (req, res) => {
  try {
    const updateData: any = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price || null,
      order: Number(req.body.order) || 1
    };

    if (req.body.features) {
      updateData.features = typeof req.body.features === 'string' ? JSON.parse(req.body.features) : req.body.features;
    }

    const imageUrl = getUploadedFileUrl(req);
    if (imageUrl) {
      updateData.icon = imageUrl;
    } else if (req.body.icon !== undefined) {
      updateData.icon = req.body.icon;
    }

    const data = await db.updateService(String(req.params.id), updateData);
    await db.logActivity('Service Config', `Modified catalog card: ${updateData.title}`);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/services/:id', authenticate, async (req, res) => {
  try {
    await db.deleteService(String(req.params.id));
    await db.logActivity('Service Config', `Removed service card ID: ${req.params.id}`);
    res.json({ message: 'Service deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// TESTIMONIALS
// ============================================
router.get('/testimonials', async (req, res) => {
  try {
    const data = await db.getTestimonials();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/testimonials', authenticate, upload.single('client_photo'), async (req, res) => {
  try {
    const photoUrl = getUploadedFileUrl(req) || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80';
    const testimonialData = {
      ...req.body,
      rating: Number(req.body.rating),
      client_photo: photoUrl
    };
    const data = await db.createTestimonial(testimonialData);
    await db.logActivity('Testimonial Added', `Added review card from: ${testimonialData.client_name}`);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/testimonials/:id', authenticate, upload.single('client_photo'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.body.rating) updateData.rating = Number(req.body.rating);

    const photoUrl = getUploadedFileUrl(req);
    if (photoUrl) {
      updateData.client_photo = photoUrl;
    }

    const data = await db.updateTestimonial(String(req.params.id), updateData);
    await db.logActivity('Testimonial Updated', `Modified review card from: ${updateData.client_name}`);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/testimonials/:id', authenticate, async (req, res) => {
  try {
    await db.deleteTestimonial(String(req.params.id));
    await db.logActivity('Testimonial Deleted', `Removed review card ID: ${req.params.id}`);
    res.json({ message: 'Testimonial deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// MESSAGES (CONTACT FORM)
// ============================================
router.post('/messages', async (req, res) => {
  try {
    const data = await db.createMessage(req.body);
    await db.logActivity('Comms Received', `Inquiry sent by: ${req.body.name}`);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/messages', authenticate, async (req, res) => {
  try {
    const data = await db.getMessages();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/messages/:id/read', authenticate, async (req, res) => {
  try {
    const data = await db.updateMessageStatus(String(req.params.id), 'read');
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/messages/:id/archive', authenticate, async (req, res) => {
  try {
    const data = await db.updateMessageStatus(String(req.params.id), 'archived');
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/messages/:id', authenticate, async (req, res) => {
  try {
    await db.deleteMessage(String(req.params.id));
    res.json({ message: 'Inquiry deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// BLOG
// ============================================
router.get('/blog', async (req, res) => {
  try {
    const data = await db.getBlogPosts();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/blog', authenticate, upload.single('cover_image'), async (req, res) => {
  try {
    const coverUrl = getUploadedFileUrl(req) || '';
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];

    const postData = {
      title: req.body.title,
      slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: req.body.excerpt,
      content: req.body.content,
      cover_image: coverUrl,
      tags,
      status: req.body.status || 'published'
    };

    const data = await db.createBlogPost(postData);
    await db.logActivity('Blog Published', `Published article: ${postData.title}`);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/blog/:id', authenticate, upload.single('cover_image'), async (req, res) => {
  try {
    const updateData: any = {
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content,
      status: req.body.status
    };

    if (req.body.title) {
      updateData.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (req.body.tags) {
      updateData.tags = JSON.parse(req.body.tags);
    }

    const coverUrl = getUploadedFileUrl(req);
    if (coverUrl) {
      updateData.cover_image = coverUrl;
    }

    const data = await db.updateBlogPost(String(req.params.id), updateData);
    await db.logActivity('Blog Updated', `Modified article: ${updateData.title}`);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/blog/:id', authenticate, async (req, res) => {
  try {
    await db.deleteBlogPost(String(req.params.id));
    await db.logActivity('Blog Deleted', `Removed article ID: ${req.params.id}`);
    res.json({ message: 'Article deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// ANALYTICS
// ============================================
router.get('/analytics/stats', async (req, res) => {
  try {
    const data = await db.getAnalyticsStats();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/analytics/visitors', async (req, res) => {
  try {
    const data = await db.getVisitorChart();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/analytics/devices', async (req, res) => {
  try {
    const data = await db.getDeviceChart();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/analytics/browsers', async (req, res) => {
  try {
    const data = await db.getBrowserChart();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/analytics/activity', authenticate, async (req, res) => {
  try {
    const data = await db.getActivityLogs();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/analytics/track', async (req, res) => {
  try {
    await db.trackVisit();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// SETTINGS
// ============================================
router.get('/settings', async (req, res) => {
  try {
    const data = await db.getSettings();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/settings', authenticate, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cv', maxCount: 1 }]), async (req: any, res) => {
  try {
    const updateData: any = {
      name: req.body.name,
      title: req.body.title,
      subtitle: req.body.subtitle,
      bio: req.body.bio,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      seo_title: req.body.seo_title,
      seo_description: req.body.seo_description,
    };

    // New hero/about fields
    if (req.body.hero_headline !== undefined) updateData.hero_headline = req.body.hero_headline;
    if (req.body.hero_subheadline !== undefined) updateData.hero_subheadline = req.body.hero_subheadline;
    if (req.body.about_description !== undefined) updateData.about_description = req.body.about_description;
    if (req.body.about_section_title !== undefined) updateData.about_section_title = req.body.about_section_title;
    if (req.body.about_section_heading !== undefined) updateData.about_section_heading = req.body.about_section_heading;
    if (req.body.about_cta_text !== undefined) updateData.about_cta_text = req.body.about_cta_text;
    if (req.body.stat1_value !== undefined) updateData.stat1_value = req.body.stat1_value;
    if (req.body.stat1_label !== undefined) updateData.stat1_label = req.body.stat1_label;
    if (req.body.stat2_value !== undefined) updateData.stat2_value = req.body.stat2_value;
    if (req.body.stat2_label !== undefined) updateData.stat2_label = req.body.stat2_label;
    if (req.body.availability_status !== undefined) updateData.availability_status = req.body.availability_status;
    if (req.body.availability_response_time !== undefined) updateData.availability_response_time = req.body.availability_response_time;

    // JSON array fields
    if (req.body.client_logos) {
      try { updateData.client_logos = JSON.parse(req.body.client_logos); } catch { updateData.client_logos = req.body.client_logos; }
    }
    if (req.body.marquee_row1) {
      try { updateData.marquee_row1 = JSON.parse(req.body.marquee_row1); } catch { updateData.marquee_row1 = req.body.marquee_row1; }
    }
    if (req.body.marquee_row2) {
      try { updateData.marquee_row2 = JSON.parse(req.body.marquee_row2); } catch { updateData.marquee_row2 = req.body.marquee_row2; }
    }
    if (req.body.social_links) {
      try { updateData.social_links = JSON.parse(req.body.social_links); } catch { updateData.social_links = req.body.social_links; }
    }

    if (req.files) {
      if (req.files.avatar && req.files.avatar[0]) {
        updateData.avatar = req.files.avatar[0].path;
      }
      if (req.files.cv && req.files.cv[0]) {
        updateData.cv_url = req.files.cv[0].path;
      }
    }

    const data = await db.updateSettings(updateData);
    await db.logActivity('Settings Config', 'Modified global profile settings');
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// MEDIA MANAGER
// ============================================
router.get('/media', authenticate, async (req, res) => {
  try {
    const data = await db.getMedia();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/media/upload', authenticate, upload.single('file'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file asset uploaded' });
    }

    const isVideo = req.file.mimetype.startsWith('video');
    const mediaFile = {
      id: String(Date.now()),
      url: req.file.path,
      public_id: req.file.filename,
      resource_type: isVideo ? 'video' : 'image',
      format: req.file.mimetype.split('/')[1] || 'png',
      size: req.file.size,
      created_at: new Date().toISOString()
    };

    const data = await db.addMedia(mediaFile);
    await db.logActivity('Media Uploaded', `Added asset: ${mediaFile.public_id}`);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/media/:public_id', authenticate, async (req, res) => {
  try {
    const publicId = String(req.params.public_id);
    // Attempt deletion in Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (cErr) {
      console.warn('Could not delete from Cloudinary, deleting from local database/mock anyway');
    }

    await db.deleteMedia(publicId);
    await db.logActivity('Media Deleted', `Removed asset: ${publicId}`);
    res.json({ message: 'Media deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// EXPERIENCE (TIMELINE)
// ============================================
router.get('/experience', async (req, res) => {
  try {
    const data = await db.getExperience();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/experience', authenticate, async (req, res) => {
  try {
    const tags = req.body.tags ? (typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags) : [];
    const data = await db.createExperience({ ...req.body, tags });
    await db.logActivity('Experience Added', `Added timeline entry: ${req.body.title}`);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/experience/:id', authenticate, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = JSON.parse(updateData.tags);
    }
    const data = await db.updateExperience(String(req.params.id), updateData);
    await db.logActivity('Experience Updated', `Modified timeline entry: ${req.body.title}`);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/experience/:id', authenticate, async (req, res) => {
  try {
    await db.deleteExperience(String(req.params.id));
    await db.logActivity('Experience Deleted', `Removed timeline entry ID: ${req.params.id}`);
    res.json({ message: 'Experience entry deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// LANGUAGES
// ============================================
router.get('/languages', async (req, res) => {
  try {
    const data = await db.getLanguages();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/languages', authenticate, async (req, res) => {
  try {
    const data = await db.createLanguage(req.body);
    await db.logActivity('Language Added', `Added language: ${req.body.name}`);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/languages/:id', authenticate, async (req, res) => {
  try {
    const data = await db.updateLanguage(String(req.params.id), req.body);
    await db.logActivity('Language Updated', `Modified language: ${req.body.name}`);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/languages/:id', authenticate, async (req, res) => {
  try {
    await db.deleteLanguage(String(req.params.id));
    await db.logActivity('Language Deleted', `Removed language ID: ${req.params.id}`);
    res.json({ message: 'Language deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// CLIENT LOGOS
// ============================================
router.get('/client-logos', async (req, res) => {
  try {
    const data = await db.getClientLogos();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/client-logos', authenticate, upload.single('logo_image'), async (req, res) => {
  try {
    const logoUrl = getUploadedFileUrl(req) || req.body.src || '';
    const logoData = {
      name: req.body.name,
      src: logoUrl,
      order: Number(req.body.order) || 1
    };
    const data = await db.createClientLogo(logoData);
    await db.logActivity('Client Logo Added', `Added client logo: ${logoData.name}`);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/client-logos/:id', authenticate, upload.single('logo_image'), async (req, res) => {
  try {
    const updateData: any = {
      name: req.body.name,
      order: Number(req.body.order) || 1
    };

    const logoUrl = getUploadedFileUrl(req);
    if (logoUrl) {
      updateData.src = logoUrl;
    } else if (req.body.src) {
      updateData.src = req.body.src;
    }

    const data = await db.updateClientLogo(String(req.params.id), updateData);
    await db.logActivity('Client Logo Updated', `Modified client logo: ${updateData.name}`);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/client-logos/:id', authenticate, async (req, res) => {
  try {
    await db.deleteClientLogo(String(req.params.id));
    await db.logActivity('Client Logo Deleted', `Removed client logo ID: ${req.params.id}`);
    res.json({ message: 'Client logo deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
