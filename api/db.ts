import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
export const useSupabase = !!(supabaseUrl && supabaseKey);
export const envVars = { urlSet: !!supabaseUrl, keySet: !!supabaseKey };

const supabase = useSupabase ? createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
}) : null;

const ADMIN_HASH = bcrypt.hashSync('password123', 10);

// Fallback seed data — used ONLY when Supabase is not available
const SEED: Record<string, any> = {
  users: [{ id: '1', email: 'admin@portfolio.system', password_hash: ADMIN_HASH, name: 'Site Administrator', role: 'admin', created_at: new Date().toISOString() }],
  settings: { name: 'معتز جمعة', title: 'جونيور جرافيك ديزاينر', subtitle: 'Crafting premium digital experiences',
    bio: 'الإبداع ليس ما نفعله فقط بل ما نتركه في أذهان عملائنا', email: 'hello@portfolio.dev',
    phone: '+1 (555) 000-0000', location: 'البحيرة، مصر', seo_title: 'Futuristic Portfolio Platform',
    seo_description: 'Premium glassmorphism developer portfolio website',
    hero_headline: 'حين يجتمع الإبداع مع التفاصيل\nt تولد تصاميم استثنائية.', hero_subheadline: 'موثوق من قبل',
    about_description: 'الإبداع ليس ما نفعله فقط بل ما نتركه في أذهان عملائنا', about_section_title: 'نبذة عني',
    about_section_heading: 'نحول الأفكار إلى تصاميم مؤثرة', about_cta_text: 'لنعمل معاً الآن',
    stat1_value: '+4', stat1_label: 'شركات', stat2_value: '+75', stat2_label: 'تصميم',
    client_logos: [{ name: 'بيرفكت', src: '/logos/perfect.png' }, { name: 'EGYFIELD', src: '/logos/egyfield.png' },
      { name: 'معتز', src: '/logos/moataz.png' }, { name: 'المعاهد التعليمية', src: '/logos/institutes.png' }],
    marquee_row1: [{ text: 'تصميم الهوية', variant: 'glass' }, { text: 'تصميم الشعارات', variant: 'solid' },
      { text: 'براندنج', variant: 'solid' }, { text: 'تصاميم سوشيال ميديا', variant: 'solid' }],
    marquee_row2: [{ text: 'المطبوعات', variant: 'glass' }, { text: 'براندنج', variant: 'solid' },
      { text: 'واجهات المستخدم', variant: 'solid' }, { text: 'تصميم التغليف', variant: 'solid' },
      { text: 'إنفوجرافيك', variant: 'solid' }, { text: 'تصميم العروض التقديمية', variant: 'glass' }],
    social_links: [], availability_status: 'available', availability_response_time: '< 24 hours', avatar: '', cv_url: '' },
  projects: [], skills: [], services: [
    { id: 'srv-1', title: 'الهوية البصرية', description: 'أبني هويات بصرية متكاملة', icon: '/services/branding.png',
      features: ['تصميم الشعارات', 'دليل الهوية', 'الأوراق الرسمية'], price: 'Quotes', order: 1 },
    { id: 'srv-2', title: 'تصميم السوشيال ميديا', description: 'إنشاء تصاميم إبداعية', icon: '/services/social_media.png',
      features: ['تصاميم إنستجرام', 'بنرات فيسبوك', 'محتوى إبداعي'], price: 'Quotes', order: 2 },
    { id: 'srv-3', title: 'تصميم المطبوعات', description: 'تصميم مواد تسويقية', icon: '/services/print.png',
      features: ['بروشورات', 'فلايرات', 'تغليف المنتجات'], price: 'Quotes', order: 3 },
    { id: 'srv-4', title: 'تصميم واجهات المستخدم', description: 'تصميم واجهات رقمية حديثة', icon: '/services/ui_ux.png',
      features: ['تصميم تطبيقات', 'واجهات مواقع web', 'تجربة مستخدم UX'], price: 'Quotes', order: 4 }],
  testimonials: [], messages: [], blog_posts: [], media: [],
  experience: [], languages: [],
  client_logos: [{ id: 'cl-1', name: 'بيرفكت', src: '/logos/perfect.png', order: 1, created_at: new Date().toISOString() },
    { id: 'cl-2', name: 'EGYFIELD', src: '/logos/egyfield.png', order: 2, created_at: new Date().toISOString() },
    { id: 'cl-3', name: 'معتز', src: '/logos/moataz.png', order: 3, created_at: new Date().toISOString() },
    { id: 'cl-4', name: 'المعاهد التعليمية', src: '/logos/institutes.png', order: 4, created_at: new Date().toISOString() }],
  activity_logs: [],
  analytics: { total_visitors: 1420, total_projects: 0, total_messages: 0, total_posts: 0, unread_messages: 0,
    visitors: [{ name: 'Mon', visits: 120 }, { name: 'Tue', visits: 180 }, { name: 'Wed', visits: 240 },
      { name: 'Thu', visits: 200 }, { name: 'Fri', visits: 310 }, { name: 'Sat', visits: 280 }, { name: 'Sun', visits: 380 }],
    devices: [{ name: 'Desktop', value: 65, color: '#00BFFF' }, { name: 'Mobile', value: 28, color: '#4F46E5' },
      { name: 'Tablet', value: 7, color: '#7C3AED' }],
    browsers: [{ name: 'Chrome', value: 55, color: '#00BFFF' }, { name: 'Safari', value: 25, color: '#06B6D4' },
      { name: 'Firefox', value: 12, color: '#4F46E5' }, { name: 'Edge', value: 8, color: '#7C3AED' }] },
};

// ============================================================
// SUPABASE-FIRST DATABASE LAYER
// All operations go to Supabase first. Memory is ONLY a fallback.
// ============================================================

export const db = {
  // ── Auth ──
  getUserByEmail: async (email: string) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
        if (!error && data) return data;
      } catch (e: any) { console.warn('DB getUserByEmail error:', e.message); }
    }
    // Fallback to hardcoded admin
    if (email === 'admin@portfolio.system') return SEED.users[0];
    return null;
  },

  // ── Activity Logs ──
  logActivity: async (action: string, description: string) => {
    const entry = { action, description, created_at: new Date().toISOString() };
    if (useSupabase && supabase) {
      try { await supabase.from('activity_logs').insert(entry); } catch {}
    }
  },
  getActivityLogs: async () => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(20);
        if (data) return data;
      } catch {}
    }
    return [];
  },

  // ── Settings ──
  getSettings: async () => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('settings').select('*').single();
        if (!error && data) return { ...SEED.settings, ...data };
      } catch (e: any) { console.warn('DB getSettings error:', e.message); }
    }
    return SEED.settings;
  },
  updateSettings: async (body: any) => {
    if (useSupabase && supabase) {
      try {
        const payload: any = {};
        const fields = ['name','email','title','location','bio','hero_headline','hero_subheadline',
          'about_description','about_section_title','about_section_heading','about_cta_text',
          'stat1_value','stat1_label','stat2_value','stat2_label','client_logos','marquee_row1',
          'marquee_row2','social_links','availability_status','availability_response_time',
          'subtitle','cv_url','phone','seo_title','seo_description','avatar_url'];
        for (const f of fields) { if (body[f] !== undefined) payload[f] = body[f]; }
        if (body.avatar !== undefined && !payload.avatar_url) payload.avatar_url = body.avatar;
        if (Object.keys(payload).length > 0) {
          const { error } = await supabase.from('settings').update(payload).eq('id', '00000000-0000-0000-0000-000000000000');
          if (error) console.error('DB updateSettings error:', error.message);
        }
        return await db.getSettings();
      } catch (e: any) { console.error('DB updateSettings exception:', e.message); }
    }
    return { ...SEED.settings, ...body };
  },

  // ── Projects ──
  getProjects: async () => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e: any) { console.warn('DB getProjects error:', e.message); }
    }
    return SEED.projects;
  },
  createProject: async (body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('projects').insert(body).select().single();
        if (!error && data) return data;
        console.error('DB createProject error:', error?.message);
      } catch (e: any) { console.error('DB createProject exception:', e.message); }
    }
    const item = { id: String(Date.now()), created_at: new Date().toISOString(), ...body };
    SEED.projects.push(item);
    return item;
  },
  updateProject: async (id: string, body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('projects').update(body).eq('id', id).select().single();
        if (!error && data) return data;
        console.error('DB updateProject error:', error?.message);
      } catch (e: any) { console.error('DB updateProject exception:', e.message); }
    }
    return null;
  },
  deleteProject: async (id: string) => {
    if (useSupabase && supabase) {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) console.error('DB deleteProject error:', error.message);
      } catch (e: any) { console.error('DB deleteProject exception:', e.message); }
    }
  },

  // ── Skills ──
  getSkills: async () => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('skills').select('*').order('order', { ascending: true });
        if (data) return data;
      } catch {}
    }
    return SEED.skills;
  },
  createSkill: async (body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('skills').insert(body).select().single();
        if (!error && data) return data;
        console.error('DB createSkill error:', error?.message);
      } catch (e: any) { console.error('DB createSkill exception:', e.message); }
    }
    const item = { id: String(Date.now()), created_at: new Date().toISOString(), ...body };
    SEED.skills.push(item);
    return item;
  },
  updateSkill: async (id: string, body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('skills').update(body).eq('id', id).select().single();
        if (!error && data) return data;
      } catch {}
    }
    return null;
  },
  deleteSkill: async (id: string) => {
    if (useSupabase && supabase) {
      try { await supabase.from('skills').delete().eq('id', id); } catch {}
    }
  },

  // ── Services ──
  getServices: async () => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('services').select('*').order('order', { ascending: true });
        if (data) return data;
      } catch {}
    }
    return [...SEED.services].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },
  createService: async (body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('services').insert(body).select().single();
        if (!error && data) return data;
        console.error('DB createService error:', error?.message);
      } catch (e: any) { console.error('DB createService exception:', e.message); }
    }
    const item = { id: String(Date.now()), created_at: new Date().toISOString(), ...body };
    SEED.services.push(item);
    return item;
  },
  updateService: async (id: string, body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('services').update(body).eq('id', id).select().single();
        if (!error && data) return data;
      } catch {}
    }
    return null;
  },
  deleteService: async (id: string) => {
    if (useSupabase && supabase) {
      try { await supabase.from('services').delete().eq('id', id); } catch {}
    }
  },

  // ── Testimonials ──
  getTestimonials: async () => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('testimonials').select('*');
        if (data) return data;
      } catch {}
    }
    return SEED.testimonials;
  },
  createTestimonial: async (body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('testimonials').insert(body).select().single();
        if (!error && data) return data;
      } catch {}
    }
    const item = { id: String(Date.now()), created_at: new Date().toISOString(), ...body };
    SEED.testimonials.push(item);
    return item;
  },
  updateTestimonial: async (id: string, body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('testimonials').update(body).eq('id', id).select().single();
        if (!error && data) return data;
      } catch {}
    }
    return null;
  },
  deleteTestimonial: async (id: string) => {
    if (useSupabase && supabase) {
      try { await supabase.from('testimonials').delete().eq('id', id); } catch {}
    }
  },

  // ── Messages ──
  getMessages: async () => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (data) return data;
      } catch {}
    }
    return SEED.messages;
  },
  createMessage: async (body: any) => {
    const item = { ...body, status: 'unread', created_at: new Date().toISOString() };
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('messages').insert(item).select().single();
        if (!error && data) return data;
      } catch {}
    }
    item.id = String(Date.now());
    SEED.messages.push(item);
    return item;
  },
  updateMessageStatus: async (id: string, status: string) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('messages').update({ status }).eq('id', id).select().single();
        if (!error && data) return data;
      } catch {}
    }
    return null;
  },
  deleteMessage: async (id: string) => {
    if (useSupabase && supabase) {
      try { await supabase.from('messages').delete().eq('id', id); } catch {}
    }
  },

  // ── Blog ──
  getBlogPosts: async () => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        if (data) return data;
      } catch {}
    }
    return SEED.blog_posts;
  },
  createBlogPost: async (body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('blog_posts').insert({ ...body, views: 0 }).select().single();
        if (!error && data) return data;
      } catch {}
    }
    const item = { id: String(Date.now()), views: 0, created_at: new Date().toISOString(), ...body };
    SEED.blog_posts.push(item);
    return item;
  },
  updateBlogPost: async (id: string, body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('blog_posts').update(body).eq('id', id).select().single();
        if (!error && data) return data;
      } catch {}
    }
    return null;
  },
  deleteBlogPost: async (id: string) => {
    if (useSupabase && supabase) {
      try { await supabase.from('blog_posts').delete().eq('id', id); } catch {}
    }
  },

  // ── Analytics ──
  getAnalyticsStats: async () => {
    if (useSupabase && supabase) {
      try {
        const [vRes, pRes, mRes, bRes, uRes] = await Promise.all([
          supabase.from('analytics').select('visitors'),
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('messages').select('id', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
          supabase.from('messages').select('id', { count: 'exact', head: true }).eq('status', 'unread'),
        ]);
        return {
          total_visitors: vRes.data?.reduce((a: number, c: any) => a + (c.visitors || 0), 0) || 0,
          total_projects: pRes.count || 0,
          total_messages: mRes.count || 0,
          total_posts: bRes.count || 0,
          unread_messages: uRes.count || 0,
        };
      } catch {}
    }
    return SEED.analytics;
  },
  getVisitorChart: async () => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('analytics').select('date, visitors').order('date', { ascending: true }).limit(7);
        if (data && data.length > 0) return data.map((d: any) => ({ name: d.date, visits: d.visitors }));
      } catch {}
    }
    return SEED.analytics.visitors;
  },
  getDeviceChart: async () => SEED.analytics.devices,
  getBrowserChart: async () => SEED.analytics.browsers,
  trackVisit: async () => {
    if (useSupabase && supabase) {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase.from('analytics').select('*').eq('date', today).maybeSingle();
        if (data) await supabase.from('analytics').update({ visitors: data.visitors + 1 }).eq('date', today);
        else await supabase.from('analytics').insert({ date: today, visitors: 1 });
      } catch {}
    }
  },

  // ── Media ──
  getMedia: async () => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('project_media').select('*');
        if (data) return data;
      } catch {}
    }
    return SEED.media;
  },
  addMedia: async (body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('project_media').insert(body).select().single();
        if (!error && data) return data;
      } catch {}
    }
    SEED.media.push(body);
    return body;
  },
  deleteMedia: async (publicId: string) => {
    if (useSupabase && supabase) {
      try { await supabase.from('project_media').delete().eq('public_id', publicId); } catch {}
    }
  },

  // ── Experience ──
  getExperience: async () => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('experience').select('*').order('order', { ascending: true });
        if (data) return data;
      } catch {}
    }
    return SEED.experience;
  },
  createExperience: async (body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('experience').insert(body).select().single();
        if (!error && data) return data;
      } catch {}
    }
    const item = { id: String(Date.now()), created_at: new Date().toISOString(), ...body };
    SEED.experience.push(item);
    return item;
  },
  updateExperience: async (id: string, body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('experience').update(body).eq('id', id).select().single();
        if (!error && data) return data;
      } catch {}
    }
    return null;
  },
  deleteExperience: async (id: string) => {
    if (useSupabase && supabase) {
      try { await supabase.from('experience').delete().eq('id', id); } catch {}
    }
  },

  // ── Languages ──
  getLanguages: async () => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('languages').select('*').order('order', { ascending: true });
        if (data) return data;
      } catch {}
    }
    return SEED.languages;
  },
  createLanguage: async (body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('languages').insert(body).select().single();
        if (!error && data) return data;
      } catch {}
    }
    const item = { id: String(Date.now()), created_at: new Date().toISOString(), ...body };
    SEED.languages.push(item);
    return item;
  },
  updateLanguage: async (id: string, body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('languages').update(body).eq('id', id).select().single();
        if (!error && data) return data;
      } catch {}
    }
    return null;
  },
  deleteLanguage: async (id: string) => {
    if (useSupabase && supabase) {
      try { await supabase.from('languages').delete().eq('id', id); } catch {}
    }
  },

  // ── Client Logos (stored in settings.client_logos JSONB) ──
  getClientLogos: async () => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('settings').select('client_logos').single();
        if (data?.client_logos && Array.isArray(data.client_logos)) {
          return data.client_logos.map((l: any, i: number) => ({
            id: l.id || `cl-${i + 1}`, name: l.name || '', src: l.src || '',
            order: typeof l.order === 'number' ? l.order : i + 1, created_at: l.created_at || new Date().toISOString(),
          })).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        }
      } catch {}
    }
    return [...SEED.client_logos].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },
  createClientLogo: async (body: any) => {
    const item = { id: `cl-${Date.now()}`, created_at: new Date().toISOString(), ...body };
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('settings').select('client_logos').single();
        const logos = [...(data?.client_logos || []), item];
        await supabase.from('settings').update({ client_logos: logos }).eq('id', '00000000-0000-0000-0000-000000000000');
      } catch {}
    }
    return item;
  },
  updateClientLogo: async (id: string, body: any) => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('settings').select('client_logos').single();
        let logos = data?.client_logos || [];
        const li = logos.findIndex((l: any) => l.id === id);
        if (li !== -1) { logos[li] = { ...logos[li], ...body }; }
        await supabase.from('settings').update({ client_logos: logos }).eq('id', '00000000-0000-0000-0000-000000000000');
        return li !== -1 ? logos[li] : null;
      } catch {}
    }
    return null;
  },
  deleteClientLogo: async (id: string) => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('settings').select('client_logos').single();
        const logos = (data?.client_logos || []).filter((l: any) => l.id !== id);
        await supabase.from('settings').update({ client_logos: logos }).eq('id', '00000000-0000-0000-0000-000000000000');
      } catch {}
    }
  },
};
