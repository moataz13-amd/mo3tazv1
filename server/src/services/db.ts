import fs from 'fs';
import path from 'path';
import { supabase } from '../config/supabase';
import dotenv from 'dotenv';

dotenv.config();

// In development: use fast local mock storage (instant writes, no schema issues)
// In production (Vercel): use Supabase cloud database
const USE_MOCK = process.env.NODE_ENV !== 'production' || !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY;
const MOCK_FILE = path.join(__dirname, '../../data/db_mock.json');

const defaultDeviceData = [
  { name: 'Desktop', value: 65, color: '#00BFFF' },
  { name: 'Mobile', value: 28, color: '#4F46E5' },
  { name: 'Tablet', value: 7, color: '#7C3AED' },
];

const defaultBrowserData = [
  { name: 'Chrome', value: 55, color: '#00BFFF' },
  { name: 'Safari', value: 25, color: '#06B6D4' },
  { name: 'Firefox', value: 12, color: '#4F46E5' },
  { name: 'Edge', value: 8, color: '#7C3AED' },
];


// Initialize local mock JSON storage if not exists
if (true) {
  const dataDir = path.dirname(MOCK_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(MOCK_FILE)) {
    const initialMockData = {
      users: [
        {
          id: '1',
          email: 'admin@portfolio.system',
          password_hash: '$2b$10$r7H7cbLtShf4cyGAsGHUz.Jna4Rk.F7Cd5ZpVB7eNxeg60dA0aJmC', // password123
          name: 'Site Administrator',
          role: 'admin',
          created_at: new Date().toISOString()
        }
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
          { name: 'المعاهد التعليمية', src: '/logos/institutes.png' }
        ],
        marquee_row1: [
          { text: 'تصميم الهوية', variant: 'glass' },
          { text: 'تصميم الشعارات', variant: 'solid' },
          { text: 'براندنج', variant: 'solid' },
          { text: 'تصاميم سوشيال ميديا', variant: 'solid' }
        ],
        marquee_row2: [
          { text: 'المطبوعات', variant: 'glass' },
          { text: 'براندنج', variant: 'solid' },
          { text: 'واجهات المستخدم', variant: 'solid' },
          { text: 'تصميم التغليف', variant: 'solid' },
          { text: 'إنفوجرافيك', variant: 'solid' },
          { text: 'تصميم العروض التقديمية', variant: 'glass' }
        ],
        social_links: [],
        availability_status: 'available',
        availability_response_time: '< 24 hours'
      },
      projects: [],
      skills: [],
      services: [
        {
          id: "srv-1",
          title: "الهوية البصرية",
          description: "أبني هويات بصرية متكاملة تؤسس شخصية العلامة التجارية وتترك انطباعاً قوياً لدى العملاء، بدءاً من الشعار وحتى أدق العناصر البصرية المرتبطة بالعلامة.",
          icon: "/services/branding.png",
          features: ["تصميم الشعارات", "دليل الهوية", "الأوراق الرسمية"],
          price: "Quotes",
          order: 1
        },
        {
          id: "srv-2",
          title: "تصميم السوشيال ميديا",
          description: "إنشاء تصاميم إبداعية وجذابة لمنصات التواصل الاجتماعي تساعد على زيادة التفاعل وتعزز حضور العلامة التجارية بشكل احترافي ومبتكر.",
          icon: "/services/social_media.png",
          features: ["تصاميم إنستجرام", "بنرات فيسبوك", "محتوى إبداعي"],
          price: "Quotes",
          order: 2
        },
        {
          id: "srv-3",
          title: "تصميم المطبوعات",
          description: "تصميم مواد تسويقية ومطبوعات احترافية تعزز هوية العلامة التجارية وتساعد على إيصال الرسائل التسويقية بشكل فعال ومميز.",
          icon: "/services/print.png",
          features: ["بروشورات", "فلايرات", "تغليف المنتجات"],
          price: "Quotes",
          order: 3
        },
        {
          id: "srv-4",
          title: "تصميم واجهات المستخدم",
          description: "تصميم واجهات رقمية حديثة تجمع بين الجمال وسهولة الاستخدام لتقديم تجربة مستخدم مميزة وتحقق أهداف المشروع بكفاءة.",
          icon: "/services/ui_ux.png",
          features: ["تصميم تطبيقات", "واجهات مواقع web", "تجربة مستخدم UX"],
          price: "Quotes",
          order: 4
        }
      ],
      testimonials: [],
      messages: [],
      blog_posts: [],
      experience: [],
      languages: [],
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
        ]
      },
      activity_logs: [],
      media: [],
      client_logos: [
        { id: 'cl-1', name: 'بيرفكت', src: '/logos/perfect.png', order: 1, created_at: new Date().toISOString() },
        { id: 'cl-2', name: 'EGYFIELD', src: '/logos/egyfield.png', order: 2, created_at: new Date().toISOString() },
        { id: 'cl-3', name: 'معتز', src: '/logos/moataz.png', order: 3, created_at: new Date().toISOString() },
        { id: 'cl-4', name: 'المعاهد التعليمية', src: '/logos/institutes.png', order: 4, created_at: new Date().toISOString() }
      ]
    };
    fs.writeFileSync(MOCK_FILE, JSON.stringify(initialMockData, null, 2));
  }
}

// Seed default admin into Supabase if table is empty
async function seedSupabaseAdmin() {
  try {
    const bcrypt = require('bcryptjs');
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      if (error.message?.includes('does not exist')) {
        console.warn('Supabase users table does not exist yet. Login will use mock fallback.');
      }
      return;
    }
    if (!data || data.length === 0) {
      const hash = await bcrypt.hash('password123', 10);
      await supabase.from('users').insert({
        email: 'admin@portfolio.system',
        password_hash: hash,
        name: 'Site Administrator',
        role: 'admin',
        created_at: new Date().toISOString(),
      });
      console.log('Default admin seeded into Supabase');
    }
  } catch (e: any) {
    console.warn('Supabase admin seed skipped:', e.message);
  }
}

// Run seed in production
if (!USE_MOCK) {
  seedSupabaseAdmin();
}

// Database Operations Layer
export const db = {
  _useMockForProjects: false,
  isMock: () => USE_MOCK,

  getMockData: () => {
    return JSON.parse(fs.readFileSync(MOCK_FILE, 'utf-8'));
  },

  saveMockData: (data: any) => {
    fs.writeFileSync(MOCK_FILE, JSON.stringify(data, null, 2));
  },

  // Users
  getUserByEmail: async (email: string) => {
    if (!USE_MOCK) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
        if (!error && data) return data;
        if (error) console.warn('Supabase getUserByEmail error:', error.message);
      } catch (e: any) {
        console.warn('Supabase getUserByEmail exception:', e.message);
      }
    }
    try {
      const mock = db.getMockData();
      return mock.users.find((u: any) => u.email === email) || null;
    } catch (e: any) {
      console.warn('Mock data fallback failed:', e.message);
    }
    // Hardcoded admin fallback for fresh deployments
    if (email === 'admin@portfolio.system') {
      const bcrypt = require('bcryptjs');
      return {
        id: '1',
        email: 'admin@portfolio.system',
        password_hash: bcrypt.hashSync('password123', 10),
        name: 'Site Administrator',
        role: 'admin',
        created_at: new Date().toISOString(),
      };
    }
    return null;
  },

  // Settings
  getSettings: async () => {
    let supabaseSettings: any = null;
    if (!USE_MOCK) {
      try {
        const { data, error } = await supabase.from('settings').select('*').single();
        if (!error && data) {
          supabaseSettings = data;
        }
      } catch (e: any) {
        console.warn('Supabase settings query exception, falling back to mock:', e.message);
      }
    }
    
    const mock = db.getMockData();
    const mockSettings = mock.settings || {};
    
    const merged = {
      ...mockSettings,
      ...(supabaseSettings || {})
    };
    
    if (supabaseSettings && supabaseSettings.avatar_url) {
      merged.avatar = supabaseSettings.avatar_url;
      merged.avatar_url = supabaseSettings.avatar_url;
    }
    
    return merged;
  },

  updateSettings: async (settingsData: any) => {
    const mock = db.getMockData();
    mock.settings = { ...(mock.settings || {}), ...settingsData };
    db.saveMockData(mock);

    if (!USE_MOCK) {
      try {
        const supabasePayload: any = {};
        if (settingsData.name !== undefined) supabasePayload.name = settingsData.name;
        if (settingsData.email !== undefined) supabasePayload.email = settingsData.email;
        if (settingsData.title !== undefined) supabasePayload.title = settingsData.title;
        if (settingsData.location !== undefined) supabasePayload.location = settingsData.location;
        if (settingsData.bio !== undefined) supabasePayload.bio = settingsData.bio;
        
        // Custom copywriting and branding settings
        if (settingsData.hero_headline !== undefined) supabasePayload.hero_headline = settingsData.hero_headline;
        if (settingsData.hero_subheadline !== undefined) supabasePayload.hero_subheadline = settingsData.hero_subheadline;
        if (settingsData.about_description !== undefined) supabasePayload.about_description = settingsData.about_description;
        if (settingsData.about_section_title !== undefined) supabasePayload.about_section_title = settingsData.about_section_title;
        if (settingsData.about_section_heading !== undefined) supabasePayload.about_section_heading = settingsData.about_section_heading;
        if (settingsData.about_cta_text !== undefined) supabasePayload.about_cta_text = settingsData.about_cta_text;
        
        // Counter Statistics
        if (settingsData.stat1_value !== undefined) supabasePayload.stat1_value = settingsData.stat1_value;
        if (settingsData.stat1_label !== undefined) supabasePayload.stat1_label = settingsData.stat1_label;
        if (settingsData.stat2_value !== undefined) supabasePayload.stat2_value = settingsData.stat2_value;
        if (settingsData.stat2_label !== undefined) supabasePayload.stat2_label = settingsData.stat2_label;

        // Custom Layout Assets & Lists
        if (settingsData.client_logos !== undefined) supabasePayload.client_logos = settingsData.client_logos;
        if (settingsData.marquee_row1 !== undefined) supabasePayload.marquee_row1 = settingsData.marquee_row1;
        if (settingsData.marquee_row2 !== undefined) supabasePayload.marquee_row2 = settingsData.marquee_row2;
        if (settingsData.social_links !== undefined) supabasePayload.social_links = settingsData.social_links;

        // Availability badge settings
        if (settingsData.availability_status !== undefined) supabasePayload.availability_status = settingsData.availability_status;
        if (settingsData.availability_response_time !== undefined) supabasePayload.availability_response_time = settingsData.availability_response_time;
        
        if (settingsData.avatar_url !== undefined) {
          supabasePayload.avatar_url = settingsData.avatar_url;
        } else if (settingsData.avatar !== undefined) {
          supabasePayload.avatar_url = settingsData.avatar;
        }

        if (Object.keys(supabasePayload).length > 0) {
          const { error } = await supabase
            .from('settings')
            .update(supabasePayload)
            .eq('id', '00000000-0000-0000-0000-000000000000');
            
          if (error) {
            console.warn('Supabase settings update failed, local fallback saved:', error.message);
          }
        }
      } catch (e: any) {
        console.warn('Supabase settings update exception, local fallback saved:', e.message);
      }
    }
    
    return mock.settings;
  },

  // Projects
  getProjects: async () => {
    if (!USE_MOCK) {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
        console.warn('Supabase getProjects failed, falling back to mock:', error?.message);
      } catch (e: any) {
        console.warn('Supabase getProjects failed with exception, falling back to mock:', e.message);
      }
    }
    return db.getMockData().projects || [];
  },

  createProject: async (project: any) => {
    if (!USE_MOCK) {
      const payload = { ...project };
      const { data, error } = await supabase.from('projects').insert(payload).select().single();
      if (error) {
        console.error('Supabase createProject error:', error.message);
        throw new Error(`Supabase createProject error: ${error.message}`);
      }
      return data;
    }
    const mock = db.getMockData();
    if (!mock.projects) mock.projects = [];
    const newProj = { id: String(Date.now()), created_at: new Date().toISOString(), ...project };
    mock.projects.push(newProj);
    db.saveMockData(mock);
    return newProj;
  },

  updateProject: async (id: string, project: any) => {
    if (!USE_MOCK) {
      const { data, error } = await supabase.from('projects').update(project).eq('id', id).select().single();
      if (error) {
        console.error('Supabase updateProject error:', error.message);
        throw new Error(`Supabase updateProject error: ${error.message}`);
      }
      return data;
    }
    const mock = db.getMockData();
    if (!mock.projects) mock.projects = [];
    const idx = mock.projects.findIndex((p: any) => p.id === id);
    if (idx !== -1) {
      mock.projects[idx] = { ...mock.projects[idx], ...project };
      db.saveMockData(mock);
      return mock.projects[idx];
    }
    return null;
  },

  deleteProject: async (id: string) => {
    if (!USE_MOCK) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteProject error:', error.message);
        throw new Error(`Supabase deleteProject error: ${error.message}`);
      }
      return true;
    }
    const mock = db.getMockData();
    if (!mock.projects) mock.projects = [];
    mock.projects = mock.projects.filter((p: any) => p.id !== id);
    db.saveMockData(mock);
    return true;
  },

  // Skills
  getSkills: async () => {
    if (USE_MOCK) {
      return db.getMockData().skills;
    }
    const { data, error } = await supabase.from('skills').select('*').order('order', { ascending: true });
    if (error) return [];
    return data;
  },

  createSkill: async (skill: any) => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      const newSkill = { id: String(Date.now()), created_at: new Date().toISOString(), ...skill };
      mock.skills.push(newSkill);
      db.saveMockData(mock);
      return newSkill;
    }
    const { data, error } = await supabase.from('skills').insert(skill).select().single();
    if (error) throw error;
    return data;
  },

  updateSkill: async (id: string, skill: any) => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      const idx = mock.skills.findIndex((s: any) => s.id === id);
      if (idx !== -1) {
        mock.skills[idx] = { ...mock.skills[idx], ...skill };
        db.saveMockData(mock);
        return mock.skills[idx];
      }
      return null;
    }
    const { data, error } = await supabase.from('skills').update(skill).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  deleteSkill: async (id: string) => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      mock.skills = mock.skills.filter((s: any) => s.id !== id);
      db.saveMockData(mock);
      return true;
    }
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Services
  getServices: async () => {
    if (!USE_MOCK) {
      try {
        const { data, error } = await supabase.from('services').select('*').order('order', { ascending: true });
        if (!error && data) return data;
        console.warn('Supabase getServices failed, falling back to mock:', error?.message);
      } catch (e: any) {
        console.warn('Supabase getServices failed with exception, falling back to mock:', e.message);
      }
    }
    return (db.getMockData().services || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },

  createService: async (service: any) => {
    if (!USE_MOCK) {
      try {
        const { data, error } = await supabase.from('services').insert(service).select().single();
        if (!error && data) return data;
        console.warn('Supabase createService failed, falling back to mock:', error?.message);
      } catch (e: any) {
        console.warn('Supabase createService failed with exception, falling back to mock:', e.message);
      }
    }
    const mock = db.getMockData();
    if (!mock.services) mock.services = [];
    const newServ = { id: String(Date.now()), created_at: new Date().toISOString(), ...service };
    mock.services.push(newServ);
    db.saveMockData(mock);
    return newServ;
  },

  updateService: async (id: string, service: any) => {
    if (!USE_MOCK) {
      try {
        const { data, error } = await supabase.from('services').update(service).eq('id', id).select().single();
        if (!error && data) return data;
        console.warn('Supabase updateService failed, falling back to mock:', error?.message);
      } catch (e: any) {
        console.warn('Supabase updateService failed with exception, falling back to mock:', e.message);
      }
    }
    const mock = db.getMockData();
    if (!mock.services) mock.services = [];
    const idx = mock.services.findIndex((s: any) => s.id === id);
    if (idx !== -1) {
      mock.services[idx] = { ...mock.services[idx], ...service };
      db.saveMockData(mock);
      return mock.services[idx];
    }
    return null;
  },

  deleteService: async (id: string) => {
    if (!USE_MOCK) {
      try {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (!error) return true;
        console.warn('Supabase deleteService failed, falling back to mock:', error?.message);
      } catch (e: any) {
        console.warn('Supabase deleteService failed with exception, falling back to mock:', e.message);
      }
    }
    const mock = db.getMockData();
    if (!mock.services) mock.services = [];
    mock.services = mock.services.filter((s: any) => s.id !== id);
    db.saveMockData(mock);
    return true;
  },

  // Testimonials
  getTestimonials: async () => {
    if (USE_MOCK) {
      return db.getMockData().testimonials;
    }
    const { data, error } = await supabase.from('testimonials').select('*');
    if (error) return [];
    return data;
  },

  createTestimonial: async (testimonial: any) => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      const newTest = { id: String(Date.now()), created_at: new Date().toISOString(), ...testimonial };
      mock.testimonials.push(newTest);
      db.saveMockData(mock);
      return newTest;
    }
    const { data, error } = await supabase.from('testimonials').insert(testimonial).select().single();
    if (error) throw error;
    return data;
  },

  updateTestimonial: async (id: string, testimonial: any) => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      const idx = mock.testimonials.findIndex((t: any) => t.id === id);
      if (idx !== -1) {
        mock.testimonials[idx] = { ...mock.testimonials[idx], ...testimonial };
        db.saveMockData(mock);
        return mock.testimonials[idx];
      }
      return null;
    }
    const { data, error } = await supabase.from('testimonials').update(testimonial).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  deleteTestimonial: async (id: string) => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      mock.testimonials = mock.testimonials.filter((t: any) => t.id !== id);
      db.saveMockData(mock);
      return true;
    }
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Messages
  getMessages: async () => {
    if (USE_MOCK) {
      return db.getMockData().messages;
    }
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  createMessage: async (message: any) => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      const newMsg = { id: String(Date.now()), status: 'unread', created_at: new Date().toISOString(), ...message };
      mock.messages.push(newMsg);
      db.saveMockData(mock);
      return newMsg;
    }
    const { data, error } = await supabase.from('messages').insert(message).select().single();
    if (error) throw error;
    return data;
  },

  updateMessageStatus: async (id: string, status: string) => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      const idx = mock.messages.findIndex((m: any) => m.id === id);
      if (idx !== -1) {
        mock.messages[idx].status = status;
        db.saveMockData(mock);
        return mock.messages[idx];
      }
      return null;
    }
    const { data, error } = await supabase.from('messages').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  deleteMessage: async (id: string) => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      mock.messages = mock.messages.filter((m: any) => m.id !== id);
      db.saveMockData(mock);
      return true;
    }
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Blog
  getBlogPosts: async () => {
    if (USE_MOCK) {
      return db.getMockData().blog_posts;
    }
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  createBlogPost: async (post: any) => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      const newPost = { id: String(Date.now()), views: 0, created_at: new Date().toISOString(), ...post };
      mock.blog_posts.push(newPost);
      db.saveMockData(mock);
      return newPost;
    }
    const { data, error } = await supabase.from('blog_posts').insert(post).select().single();
    if (error) throw error;
    return data;
  },

  updateBlogPost: async (id: string, post: any) => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      const idx = mock.blog_posts.findIndex((p: any) => p.id === id);
      if (idx !== -1) {
        mock.blog_posts[idx] = { ...mock.blog_posts[idx], ...post };
        db.saveMockData(mock);
        return mock.blog_posts[idx];
      }
      return null;
    }
    const { data, error } = await supabase.from('blog_posts').update(post).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  deleteBlogPost: async (id: string) => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      mock.blog_posts = mock.blog_posts.filter((p: any) => p.id !== id);
      db.saveMockData(mock);
      return true;
    }
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Analytics
  getAnalyticsStats: async () => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      return {
        total_visitors: mock.analytics.total_visitors,
        total_projects: mock.projects.length,
        total_messages: mock.messages.length,
        total_posts: mock.blog_posts.length,
        unread_messages: mock.messages.filter((m: any) => m.status === 'unread').length
      };
    }
    // Perform parallel supabase counts
    const [visCount, projCount, msgCount, blogCount, unreadCount] = await Promise.all([
      supabase.from('analytics').select('visitors'),
      supabase.from('projects').select('id', { count: 'exact' }),
      supabase.from('messages').select('id', { count: 'exact' }),
      supabase.from('blog_posts').select('id', { count: 'exact' }),
      supabase.from('messages').select('id', { count: 'exact' }).eq('status', 'unread')
    ]);

    const totalVisitors = visCount.data?.reduce((acc: number, curr: any) => acc + (curr.visitors || 0), 0) || 0;

    return {
      total_visitors: totalVisitors,
      total_projects: projCount.count || 0,
      total_messages: msgCount.count || 0,
      total_posts: blogCount.count || 0,
      unread_messages: unreadCount.count || 0
    };
  },

  getVisitorChart: async () => {
    if (USE_MOCK) return db.getMockData().analytics.visitors;
    const { data } = await supabase.from('analytics').select('date, visitors').order('date', { ascending: true }).limit(7);
    return data?.map((d: any) => ({ name: d.date, visits: d.visitors })) || [];
  },

  getDeviceChart: async () => {
    if (USE_MOCK) return db.getMockData().analytics.devices;
    // In production database, compile browser sums
    return defaultDeviceData;
  },

  getBrowserChart: async () => {
    if (USE_MOCK) return db.getMockData().analytics.browsers;
    return defaultBrowserData;
  },

  getActivityLogs: async () => {
    if (USE_MOCK) {
      return db.getMockData().activity_logs;
    }
    const { data } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(10);
    return data || [];
  },

  logActivity: async (action: string, description: string) => {
    const newLog = { id: String(Date.now()), action, description, created_at: new Date().toISOString() };
    if (USE_MOCK) {
      const mock = db.getMockData();
      mock.activity_logs.unshift(newLog);
      db.saveMockData(mock);
      return;
    }
    await supabase.from('activity_logs').insert({ action, description });
  },

  trackVisit: async () => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      mock.analytics.total_visitors += 1;
      db.saveMockData(mock);
      return;
    }
    // Increment visitors for current date or create new entry
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('analytics').select('*').eq('date', today).single();
    if (data) {
      await supabase.from('analytics').update({ visitors: data.visitors + 1 }).eq('date', today);
    } else {
      await supabase.from('analytics').insert({ date: today, visitors: 1 });
    }
  },

  // Media
  getMedia: async () => {
    if (USE_MOCK) {
      return db.getMockData().media;
    }
    const { data, error } = await supabase.from('project_media').select('*');
    if (error) {
      console.error('Supabase getMedia error:', error.message);
      throw new Error(`Supabase getMedia error: ${error.message}`);
    }
    return data || [];
  },

  addMedia: async (file: any) => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      mock.media.push(file);
      db.saveMockData(mock);
      return file;
    }
    const { data, error } = await supabase.from('project_media').insert(file).select().single();
    if (error) {
      console.error('Supabase addMedia error:', error.message);
      throw new Error(`Supabase addMedia error: ${error.message}`);
    }
    return data;
  },

  deleteMedia: async (publicId: string) => {
    if (USE_MOCK) {
      const mock = db.getMockData();
      mock.media = mock.media.filter((m: any) => m.public_id !== publicId);
      db.saveMockData(mock);
      return;
    }
    const { error } = await supabase.from('project_media').delete().eq('public_id', publicId);
    if (error) {
      console.error('Supabase deleteMedia error:', error.message);
      throw new Error(`Supabase deleteMedia error: ${error.message}`);
    }
  },

  // Experience
  getExperience: async () => {
    if (!USE_MOCK) {
      try {
        const { data, error } = await supabase.from('experience').select('*').order('order', { ascending: true });
        if (!error) return data || [];
        console.warn('Supabase experience query failed, falling back to mock:', error.message);
      } catch (e: any) {
        console.warn('Supabase experience query exception, falling back to mock:', e.message);
      }
    }
    const mock = db.getMockData();
    return (mock.experience || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },

  createExperience: async (entry: any) => {
    if (!USE_MOCK) {
      try {
        const { data, error } = await supabase.from('experience').insert(entry).select().single();
        if (!error) return data;
        console.warn('Supabase createExperience failed, falling back to mock:', error.message);
      } catch (e: any) {
        console.warn('Supabase createExperience failed with exception, falling back to mock:', e.message);
      }
    }
    const mock = db.getMockData();
    if (!mock.experience) mock.experience = [];
    const newEntry = { id: String(Date.now()), created_at: new Date().toISOString(), ...entry };
    mock.experience.push(newEntry);
    db.saveMockData(mock);
    return newEntry;
  },

  updateExperience: async (id: string, entry: any) => {
    if (!USE_MOCK) {
      try {
        const { data, error } = await supabase.from('experience').update(entry).eq('id', id).select().single();
        if (!error) return data;
        console.warn('Supabase updateExperience failed, falling back to mock:', error.message);
      } catch (e: any) {
        console.warn('Supabase updateExperience failed with exception, falling back to mock:', e.message);
      }
    }
    const mock = db.getMockData();
    if (!mock.experience) mock.experience = [];
    const idx = mock.experience.findIndex((e: any) => e.id === id);
    if (idx !== -1) {
      mock.experience[idx] = { ...mock.experience[idx], ...entry };
      db.saveMockData(mock);
      return mock.experience[idx];
    }
    return null;
  },

  deleteExperience: async (id: string) => {
    if (!USE_MOCK) {
      try {
        const { error } = await supabase.from('experience').delete().eq('id', id);
        if (!error) return true;
        console.warn('Supabase deleteExperience failed, falling back to mock:', error.message);
      } catch (e: any) {
        console.warn('Supabase deleteExperience failed with exception, falling back to mock:', e.message);
      }
    }
    const mock = db.getMockData();
    if (!mock.experience) mock.experience = [];
    mock.experience = mock.experience.filter((e: any) => e.id !== id);
    db.saveMockData(mock);
    return true;
  },

  // Languages
  getLanguages: async () => {
    if (!USE_MOCK) {
      try {
        const { data, error } = await supabase.from('languages').select('*').order('order', { ascending: true });
        if (!error) return data || [];
        console.warn('Supabase languages query failed, falling back to mock:', error.message);
      } catch (e: any) {
        console.warn('Supabase languages query exception, falling back to mock:', e.message);
      }
    }
    const mock = db.getMockData();
    return (mock.languages || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },

  createLanguage: async (lang: any) => {
    if (!USE_MOCK) {
      try {
        const { data, error } = await supabase.from('languages').insert(lang).select().single();
        if (!error) return data;
        console.warn('Supabase createLanguage failed, falling back to mock:', error.message);
      } catch (e: any) {
        console.warn('Supabase createLanguage failed with exception, falling back to mock:', e.message);
      }
    }
    const mock = db.getMockData();
    if (!mock.languages) mock.languages = [];
    const newLang = { id: String(Date.now()), created_at: new Date().toISOString(), ...lang };
    mock.languages.push(newLang);
    db.saveMockData(mock);
    return newLang;
  },

  updateLanguage: async (id: string, lang: any) => {
    if (!USE_MOCK) {
      try {
        const { data, error } = await supabase.from('languages').update(lang).eq('id', id).select().single();
        if (!error) return data;
        console.warn('Supabase updateLanguage failed, falling back to mock:', error.message);
      } catch (e: any) {
        console.warn('Supabase updateLanguage failed with exception, falling back to mock:', e.message);
      }
    }
    const mock = db.getMockData();
    if (!mock.languages) mock.languages = [];
    const idx = mock.languages.findIndex((l: any) => l.id === id);
    if (idx !== -1) {
      mock.languages[idx] = { ...mock.languages[idx], ...lang };
      db.saveMockData(mock);
      return mock.languages[idx];
    }
    return null;
  },

  deleteLanguage: async (id: string) => {
    if (!USE_MOCK) {
      try {
        const { error } = await supabase.from('languages').delete().eq('id', id);
        if (!error) return true;
        console.warn('Supabase deleteLanguage failed, falling back to mock:', error.message);
      } catch (e: any) {
        console.warn('Supabase deleteLanguage failed with exception, falling back to mock:', e.message);
      }
    }
    const mock = db.getMockData();
    if (!mock.languages) mock.languages = [];
    mock.languages = mock.languages.filter((l: any) => l.id !== id);
    db.saveMockData(mock);
    return true;
  },

  // Client Logos
  getClientLogos: async () => {
    if (!USE_MOCK) {
      try {
        const settings = await db.getSettings();
        if (settings && 'client_logos' in settings && Array.isArray(settings.client_logos)) {
          const rawLogos = settings.client_logos;
          const logos = rawLogos.map((logo: any, index: number) => ({
            id: logo.id || `cl-${index + 1}`,
            name: logo.name || '',
            src: logo.src || '',
            order: typeof logo.order === 'number' ? logo.order : index + 1,
            created_at: logo.created_at || new Date().toISOString()
          }));
          return logos.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        }
      } catch (e: any) {
        console.warn('Supabase settings.client_logos query failed, falling back to mock:', e.message);
      }
    }
    
    // Mock fallback
    const mock = db.getMockData();
    if (!mock.client_logos || mock.client_logos.length === 0) {
      mock.client_logos = [
        { id: 'cl-1', name: 'بيرفكت', src: '/logos/perfect.png', order: 1, created_at: new Date().toISOString() },
        { id: 'cl-2', name: 'EGYFIELD', src: '/logos/egyfield.png', order: 2, created_at: new Date().toISOString() },
        { id: 'cl-3', name: 'معتز', src: '/logos/moataz.png', order: 3, created_at: new Date().toISOString() },
        { id: 'cl-4', name: 'المعاهد التعليمية', src: '/logos/institutes.png', order: 4, created_at: new Date().toISOString() }
      ];
      db.saveMockData(mock);
    }
    return (mock.client_logos || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },

  createClientLogo: async (logo: any) => {
    if (!USE_MOCK) {
      try {
        const settings = await db.getSettings();
        if (settings && 'client_logos' in settings) {
          const logos = await db.getClientLogos();
          const newLogo = {
            id: `cl-${Date.now()}`,
            created_at: new Date().toISOString(),
            ...logo
          };
          logos.push(newLogo);
          await db.updateSettings({ client_logos: logos });
          return newLogo;
        }
      } catch (e: any) {
        console.warn('Supabase settings.client_logos create failed, falling back to mock:', e.message);
      }
    }
    
    // Mock fallback
    const mock = db.getMockData();
    if (!mock.client_logos) mock.client_logos = [];
    const newLogo = { id: `cl-${Date.now()}`, created_at: new Date().toISOString(), ...logo };
    mock.client_logos.push(newLogo);
    db.saveMockData(mock);
    return newLogo;
  },

  updateClientLogo: async (id: string, logo: any) => {
    if (!USE_MOCK) {
      try {
        const settings = await db.getSettings();
        if (settings && 'client_logos' in settings) {
          const logos = await db.getClientLogos();
          const idx = logos.findIndex((l: any) => l.id === id);
          if (idx !== -1) {
            logos[idx] = { ...logos[idx], ...logo };
            await db.updateSettings({ client_logos: logos });
            return logos[idx];
          }
        }
      } catch (e: any) {
        console.warn('Supabase settings.client_logos update failed, falling back to mock:', e.message);
      }
    }
    
    // Mock fallback
    const mock = db.getMockData();
    if (!mock.client_logos) mock.client_logos = [];
    const idx = mock.client_logos.findIndex((l: any) => l.id === id);
    if (idx !== -1) {
      mock.client_logos[idx] = { ...mock.client_logos[idx], ...logo };
      db.saveMockData(mock);
      return mock.client_logos[idx];
    }
    return null;
  },

  deleteClientLogo: async (id: string) => {
    if (!USE_MOCK) {
      try {
        const settings = await db.getSettings();
        if (settings && 'client_logos' in settings) {
          const logos = await db.getClientLogos();
          const filteredLogos = logos.filter((l: any) => l.id !== id);
          await db.updateSettings({ client_logos: filteredLogos });
          return true;
        }
      } catch (e: any) {
        console.warn('Supabase settings.client_logos delete failed, falling back to mock:', e.message);
      }
    }
    
    // Mock fallback
    const mock = db.getMockData();
    if (!mock.client_logos) mock.client_logos = [];
    mock.client_logos = mock.client_logos.filter((l: any) => l.id !== id);
    db.saveMockData(mock);
    return true;
  }
};
