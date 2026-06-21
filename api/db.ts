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

// In-memory seed data — always available, even if Supabase is down
let DATA: Record<string, any> = {
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

// Helper: try-catch wrapper for Supabase writes
async function trySupabase(table: string, operation: 'insert' | 'update' | 'delete' | 'upsert', payload?: any, match?: any) {
  if (!useSupabase || !supabase) return;
  try {
    let q = supabase.from(table) as any;
    if (operation === 'insert') { await q.insert(payload); }
    else if (operation === 'upsert') { await q.upsert(payload); }
    else if (operation === 'update') { await q.update(payload).eq(match.field, match.value); }
    else if (operation === 'delete') { await q.delete().eq(match.field, match.value); }
  } catch (e: any) {
    console.warn(`Supabase ${operation} ${table} failed:`, e.message);
  }
}

// Helper: insert + select with try-catch
async function supabaseInsert(table: string, item: any) {
  if (!useSupabase || !supabase) return null;
  try {
    const { data } = await supabase.from(table).insert(item).select().single();
    return data;
  } catch (e: any) {
    console.warn(`Supabase insert ${table} failed:`, e.message);
    return null;
  }
}

// Helper: try-catch wrapper for Supabase reads (returns data or null)
async function readSupabase(table: string, options?: { orderField?: string; ascending?: boolean; limit?: number; single?: boolean }) {
  if (!useSupabase || !supabase) return null;
  try {
    let q = supabase.from(table).select('*') as any;
    if (options?.orderField) q = q.order(options.orderField, { ascending: options.ascending ?? true });
    if (options?.limit) q = q.limit(options.limit);
    if (options?.single) { const { data } = await q.single(); return data || null; }
    const { data } = await q;
    return (data && data.length > 0) ? data : null;
  } catch (e: any) {
    console.warn(`Supabase read ${table} failed:`, e.message);
    return null;
  }
}

export const db = {
  getUserByEmail: async (email: string) => {
    const local = DATA.users.find((u: any) => u.email === email);
    if (local) return local;
    if (useSupabase && supabase) {
      const data = await readSupabase('users', { single: true }).catch(() => null);
      if (data) return data;
    }
    return DATA.users.find((u: any) => u.email === email) || null;
  },

  logActivity: async (action: string, description: string) => {
    const entry = { action, description, created_at: new Date().toISOString() };
    DATA.activity_logs.unshift(entry);
    await trySupabase('activity_logs', 'insert', entry);
  },
  getActivityLogs: async () => DATA.activity_logs,

  // Settings
  getSettings: async () => {
    const sData = await readSupabase('settings', { single: true });
    if (sData) { DATA.settings = { ...DATA.settings, ...sData }; }
    return DATA.settings;
  },
  updateSettings: async (body: any) => {
    DATA.settings = { ...DATA.settings, ...body };
    await trySupabase('settings', 'upsert', DATA.settings);
    return DATA.settings;
  },

  // Projects
  getProjects: async () => {
    const sData = await readSupabase('projects', { orderField: 'created_at', ascending: false });
    if (sData) { DATA.projects = sData as any[]; return DATA.projects; }
    return DATA.projects;
  },
  createProject: async (body: any) => {
    const item = { ...body, created_at: new Date().toISOString() };
    const inserted = await supabaseInsert('projects', item);
    if (inserted) { DATA.projects.push(inserted); return inserted; }
    item.id = String(Date.now()); DATA.projects.push(item); return item;
  },
  updateProject: async (id: string, body: any) => {
    const idx = DATA.projects.findIndex((p: any) => p.id === id);
    if (idx !== -1) DATA.projects[idx] = { ...DATA.projects[idx], ...body };
    await trySupabase('projects', 'update', body, { field: 'id', value: id });
    return idx !== -1 ? DATA.projects[idx] : null;
  },
  deleteProject: async (id: string) => {
    DATA.projects = DATA.projects.filter((p: any) => p.id !== id);
    await trySupabase('projects', 'delete', null, { field: 'id', value: id });
  },

  // Skills
  getSkills: async () => {
    const sData = await readSupabase('skills', { orderField: 'order' });
    if (sData) { DATA.skills = sData as any[]; return DATA.skills; }
    return DATA.skills;
  },
  createSkill: async (body: any) => {
    const item = { ...body, created_at: new Date().toISOString() };
    const inserted = await supabaseInsert('skills', item);
    if (inserted) { DATA.skills.push(inserted); return inserted; }
    item.id = String(Date.now()); DATA.skills.push(item); return item;
  },
  updateSkill: async (id: string, body: any) => {
    const idx = DATA.skills.findIndex((s: any) => s.id === id);
    if (idx !== -1) DATA.skills[idx] = { ...DATA.skills[idx], ...body };
    await trySupabase('skills', 'update', body, { field: 'id', value: id });
    return idx !== -1 ? DATA.skills[idx] : null;
  },
  deleteSkill: async (id: string) => {
    DATA.skills = DATA.skills.filter((s: any) => s.id !== id);
    await trySupabase('skills', 'delete', null, { field: 'id', value: id });
  },

  // Services
  getServices: async () => {
    const sData = await readSupabase('services', { orderField: 'order' });
    if (sData) { DATA.services = sData as any[]; return DATA.services; }
    return [...DATA.services].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },
  createService: async (body: any) => {
    const item = { ...body, created_at: new Date().toISOString() };
    const inserted = await supabaseInsert('services', item);
    if (inserted) { DATA.services.push(inserted); return inserted; }
    item.id = String(Date.now()); DATA.services.push(item); return item;
  },
  updateService: async (id: string, body: any) => {
    const idx = DATA.services.findIndex((s: any) => s.id === id);
    if (idx !== -1) DATA.services[idx] = { ...DATA.services[idx], ...body };
    await trySupabase('services', 'update', body, { field: 'id', value: id });
    return idx !== -1 ? DATA.services[idx] : null;
  },
  deleteService: async (id: string) => {
    DATA.services = DATA.services.filter((s: any) => s.id !== id);
    await trySupabase('services', 'delete', null, { field: 'id', value: id });
  },

  // Testimonials
  getTestimonials: async () => {
    const sData = await readSupabase('testimonials');
    if (sData) { DATA.testimonials = sData as any[]; return DATA.testimonials; }
    return DATA.testimonials;
  },
  createTestimonial: async (body: any) => {
    const item = { ...body, created_at: new Date().toISOString() };
    const inserted = await supabaseInsert('testimonials', item);
    if (inserted) { DATA.testimonials.push(inserted); return inserted; }
    item.id = String(Date.now()); DATA.testimonials.push(item); return item;
  },
  updateTestimonial: async (id: string, body: any) => {
    const idx = DATA.testimonials.findIndex((t: any) => t.id === id);
    if (idx !== -1) DATA.testimonials[idx] = { ...DATA.testimonials[idx], ...body };
    await trySupabase('testimonials', 'update', body, { field: 'id', value: id });
    return idx !== -1 ? DATA.testimonials[idx] : null;
  },
  deleteTestimonial: async (id: string) => {
    DATA.testimonials = DATA.testimonials.filter((t: any) => t.id !== id);
    await trySupabase('testimonials', 'delete', null, { field: 'id', value: id });
  },

  // Messages
  getMessages: async () => {
    const sData = await readSupabase('messages', { orderField: 'created_at', ascending: false });
    if (sData) { DATA.messages = sData as any[]; return DATA.messages; }
    return DATA.messages;
  },
  createMessage: async (body: any) => {
    const item = { ...body, status: 'unread', created_at: new Date().toISOString() };
    const inserted = await supabaseInsert('messages', item);
    if (inserted) { DATA.messages.push(inserted); return inserted; }
    item.id = String(Date.now()); DATA.messages.push(item); return item;
  },
  updateMessageStatus: async (id: string, status: string) => {
    const msg = DATA.messages.find((m: any) => m.id === id);
    if (msg) msg.status = status;
    await trySupabase('messages', 'update', { status }, { field: 'id', value: id });
    return msg || null;
  },
  deleteMessage: async (id: string) => {
    DATA.messages = DATA.messages.filter((m: any) => m.id !== id);
    await trySupabase('messages', 'delete', null, { field: 'id', value: id });
  },

  // Blog
  getBlogPosts: async () => {
    const sData = await readSupabase('blog_posts', { orderField: 'created_at', ascending: false });
    if (sData) { DATA.blog_posts = sData as any[]; return DATA.blog_posts; }
    return DATA.blog_posts;
  },
  createBlogPost: async (body: any) => {
    const item = { ...body, views: 0, created_at: new Date().toISOString() };
    const inserted = await supabaseInsert('blog_posts', item);
    if (inserted) { DATA.blog_posts.push(inserted); return inserted; }
    item.id = String(Date.now()); DATA.blog_posts.push(item); return item;
  },
  updateBlogPost: async (id: string, body: any) => {
    const idx = DATA.blog_posts.findIndex((p: any) => p.id === id);
    if (idx !== -1) DATA.blog_posts[idx] = { ...DATA.blog_posts[idx], ...body };
    await trySupabase('blog_posts', 'update', body, { field: 'id', value: id });
    return idx !== -1 ? DATA.blog_posts[idx] : null;
  },
  deleteBlogPost: async (id: string) => {
    DATA.blog_posts = DATA.blog_posts.filter((p: any) => p.id !== id);
    await trySupabase('blog_posts', 'delete', null, { field: 'id', value: id });
  },

  // Analytics
  getAnalyticsStats: async () => {
    if (useSupabase && supabase) {
      try {
        const [vp] = await Promise.all([
          supabase.from('analytics').select('visitors'),
        ]);
        const totalVisitors = vp.data?.reduce((a: number, c: any) => a + (c.visitors || 0), 0) || DATA.analytics.total_visitors;
        const pCount = await readSupabase('projects').then(d => d?.length || DATA.projects.length).catch(() => DATA.projects.length);
        const mCount = await readSupabase('messages').then(d => d?.length || DATA.messages.length).catch(() => DATA.messages.length);
        const bCount = await readSupabase('blog_posts').then(d => d?.length || DATA.blog_posts.length).catch(() => DATA.blog_posts.length);
        return { total_visitors: totalVisitors, total_projects: pCount, total_messages: mCount, total_posts: bCount, unread_messages: DATA.messages.filter((m: any) => m.status === 'unread').length };
      } catch { /* fall through */ }
    }
    return { total_visitors: DATA.analytics.total_visitors, total_projects: DATA.projects.length,
      total_messages: DATA.messages.length, total_posts: DATA.blog_posts.length,
      unread_messages: DATA.messages.filter((m: any) => m.status === 'unread').length };
  },
  getVisitorChart: async () => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('analytics').select('date, visitors').order('date', { ascending: true }).limit(7);
        if (data && data.length > 0) return data.map((d: any) => ({ name: d.date, visits: d.visitors }));
      } catch { /* fall through */ }
    }
    return DATA.analytics.visitors;
  },
  getDeviceChart: async () => DATA.analytics.devices,
  getBrowserChart: async () => DATA.analytics.browsers,
  trackVisit: async () => {
    DATA.analytics.total_visitors += 1;
    if (useSupabase && supabase) {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase.from('analytics').select('*').eq('date', today).maybeSingle();
        if (data) await supabase.from('analytics').update({ visitors: data.visitors + 1 }).eq('date', today);
        else await supabase.from('analytics').insert({ date: today, visitors: 1 });
      } catch { /* silent */ }
    }
  },

  // Media
  getMedia: async () => {
    const sData = await readSupabase('project_media');
    if (sData) { DATA.media = sData as any[]; return DATA.media; }
    return DATA.media;
  },
  addMedia: async (body: any) => {
    const inserted = await supabaseInsert('project_media', body);
    if (inserted) { DATA.media.push(inserted); return inserted; }
    DATA.media.push(body); return body;
  },
  deleteMedia: async (publicId: string) => {
    DATA.media = DATA.media.filter((m: any) => m.public_id !== publicId);
    await trySupabase('project_media', 'delete', null, { field: 'public_id', value: publicId });
  },

  // Experience
  getExperience: async () => {
    const sData = await readSupabase('experience', { orderField: 'order' });
    if (sData) { DATA.experience = sData as any[]; return DATA.experience; }
    return [...DATA.experience].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },
  createExperience: async (body: any) => {
    const item = { ...body, created_at: new Date().toISOString() };
    const inserted = await supabaseInsert('experience', item);
    if (inserted) { DATA.experience.push(inserted); return inserted; }
    item.id = String(Date.now()); DATA.experience.push(item); return item;
  },
  updateExperience: async (id: string, body: any) => {
    const idx = DATA.experience.findIndex((e: any) => e.id === id);
    if (idx !== -1) DATA.experience[idx] = { ...DATA.experience[idx], ...body };
    await trySupabase('experience', 'update', body, { field: 'id', value: id });
    return idx !== -1 ? DATA.experience[idx] : null;
  },
  deleteExperience: async (id: string) => {
    DATA.experience = DATA.experience.filter((e: any) => e.id !== id);
    await trySupabase('experience', 'delete', null, { field: 'id', value: id });
  },

  // Languages
  getLanguages: async () => {
    const sData = await readSupabase('languages', { orderField: 'order' });
    if (sData) { DATA.languages = sData as any[]; return DATA.languages; }
    return [...DATA.languages].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },
  createLanguage: async (body: any) => {
    const item = { ...body, created_at: new Date().toISOString() };
    const inserted = await supabaseInsert('languages', item);
    if (inserted) { DATA.languages.push(inserted); return inserted; }
    item.id = String(Date.now()); DATA.languages.push(item); return item;
  },
  updateLanguage: async (id: string, body: any) => {
    const idx = DATA.languages.findIndex((l: any) => l.id === id);
    if (idx !== -1) DATA.languages[idx] = { ...DATA.languages[idx], ...body };
    await trySupabase('languages', 'update', body, { field: 'id', value: id });
    return idx !== -1 ? DATA.languages[idx] : null;
  },
  deleteLanguage: async (id: string) => {
    DATA.languages = DATA.languages.filter((l: any) => l.id !== id);
    await trySupabase('languages', 'delete', null, { field: 'id', value: id });
  },

  // Client Logos
  getClientLogos: async () => {
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('settings').select('client_logos').single();
        if (data?.client_logos && Array.isArray(data.client_logos) && data.client_logos.length > 0) {
          DATA.client_logos = data.client_logos.map((l: any, i: number) => ({
            id: l.id || `cl-${i + 1}`, name: l.name || '', src: l.src || '',
            order: typeof l.order === 'number' ? l.order : i + 1, created_at: l.created_at || new Date().toISOString(),
          })).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
          return DATA.client_logos;
        }
      } catch { /* fall through */ }
    }
    return [...DATA.client_logos].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  },
  createClientLogo: async (body: any) => {
    const item = { id: `cl-${Date.now()}`, created_at: new Date().toISOString(), ...body };
    DATA.client_logos.push(item);
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('settings').select('client_logos').single();
        const logos = [...(data?.client_logos || []), item];
        await supabase.from('settings').update({ client_logos: logos }).eq('id', '00000000-0000-0000-0000-000000000000');
      } catch { /* silent */ }
    }
    return item;
  },
  updateClientLogo: async (id: string, body: any) => {
    const idx = DATA.client_logos.findIndex((l: any) => l.id === id);
    if (idx !== -1) DATA.client_logos[idx] = { ...DATA.client_logos[idx], ...body, id: DATA.client_logos[idx].id };
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('settings').select('client_logos').single();
        let logos = data?.client_logos || [];
        const li = logos.findIndex((l: any) => l.id === id);
        if (li !== -1) logos[li] = { ...logos[li], ...body };
        await supabase.from('settings').update({ client_logos: logos }).eq('id', '00000000-0000-0000-0000-000000000000');
      } catch { /* silent */ }
    }
    return idx !== -1 ? DATA.client_logos[idx] : null;
  },
  deleteClientLogo: async (id: string) => {
    DATA.client_logos = DATA.client_logos.filter((l: any) => l.id !== id);
    if (useSupabase && supabase) {
      try {
        const { data } = await supabase.from('settings').select('client_logos').single();
        const logos = (data?.client_logos || []).filter((l: any) => l.id !== id);
        await supabase.from('settings').update({ client_logos: logos }).eq('id', '00000000-0000-0000-0000-000000000000');
      } catch { /* silent */ }
    }
  },
};
