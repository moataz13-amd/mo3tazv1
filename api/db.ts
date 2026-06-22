import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
export const useSupabase = !!(supabaseUrl && supabaseKey);
export const envVars = { urlSet: !!supabaseUrl, keySet: !!supabaseKey };

const supabase = useSupabase ? createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
}) : null;

export const useCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });
}

export async function uploadToCloudinary(buffer: Buffer, folder = 'portfolio_assets'): Promise<{ url: string; publicId: string } | null> {
  if (!useCloudinary) return null;
  return new Promise((resolve) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto', quality: 'auto:good', fetch_format: 'auto' },
      (err, result) => {
        if (err || !result) { console.error('Cloudinary upload failed:', err); resolve(null); }
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  if (!useCloudinary) return;
  try { await cloudinary.uploader.destroy(publicId); } catch (e: any) { console.warn('Cloudinary delete failed:', e.message); }
}

async function ensureAdmin() {
  if (!supabase) return;
  try {
    const { data } = await supabase.from('users').select('id').limit(1);
    if (!data || data.length === 0) {
      const hash = bcrypt.hashSync('password123', 10);
      await supabase.from('users').insert({
        email: 'admin@portfolio.system', password_hash: hash,
        name: 'Site Administrator', role: 'admin', created_at: new Date().toISOString(),
      });
    }
  } catch (e: any) { console.warn('Admin seed skipped:', e.message); }
}

async function ensureSettings() {
  if (!supabase) return;
  try {
    const { data } = await supabase.from('settings').select('id').limit(1);
    if (!data || data.length === 0) {
      await supabase.from('settings').insert({
        name: 'معتز جمعة', title: 'جونيور جرافيك ديزاينر', subtitle: 'Crafting premium digital experiences',
        bio: '', email: '', phone: '', location: '', seo_title: '', seo_description: '',
        hero_headline: '', hero_subheadline: '', about_description: '', about_section_title: '',
        about_section_heading: '', about_cta_text: '', stat1_value: '', stat1_label: '',
        stat2_value: '', stat2_label: '', social_links: [], client_logos: [],
        marquee_row1: [], marquee_row2: [], availability_status: 'available',
        availability_response_time: '', avatar: '', cv_url: '',
        created_at: new Date().toISOString(),
      });
    }
  } catch (e: any) { console.warn('Settings seed skipped:', e.message); }
}

if (useSupabase) { ensureAdmin(); ensureSettings(); }

const SETTINGS_FIELDS = [
  'name','title','subtitle','bio','email','phone','location',
  'seo_title','seo_description','hero_headline','hero_subheadline',
  'about_description','about_section_title','about_section_heading','about_cta_text',
  'stat1_value','stat1_label','stat2_value','stat2_label',
  'social_links','client_logos','marquee_row1','marquee_row2',
  'availability_status','availability_response_time','avatar','cv_url',
];

export const db = {
  getUserByEmail: async (email: string) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    return error || !data ? null : data;
  },

  logActivity: async (action: string, description: string) => {
    if (!supabase) return;
    try { await supabase.from('activity_logs').insert({ action, description, created_at: new Date().toISOString() }); } catch {}
  },

  getActivityLogs: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(20);
    return data || [];
  },

  getSettings: async () => {
    if (!supabase) return {};
    const { data } = await supabase.from('settings').select('*').limit(1).maybeSingle();
    return data || {};
  },

  updateSettings: async (body: any) => {
    if (!supabase) return body;
    const payload: any = {};
    for (const f of SETTINGS_FIELDS) { if (body[f] !== undefined) payload[f] = body[f]; }
    if (Object.keys(payload).length > 0) {
      await supabase.from('settings').update(payload).eq('id', (await supabase.from('settings').select('id').limit(1).maybeSingle()).data?.id || '');
    }
    return db.getSettings();
  },

  getProjects: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  createProject: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('projects').insert(body).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  updateProject: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('projects').update(body).eq('id', id).select().single();
    return error || !data ? null : data;
  },

  deleteProject: async (id: string) => {
    if (!supabase) return;
    await supabase.from('projects').delete().eq('id', id);
  },

  getSkills: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('skills').select('*').order('order', { ascending: true });
    return data || [];
  },

  createSkill: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('skills').insert(body).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  updateSkill: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('skills').update(body).eq('id', id).select().single();
    return error || !data ? null : data;
  },

  deleteSkill: async (id: string) => {
    if (!supabase) return;
    await supabase.from('skills').delete().eq('id', id);
  },

  getServices: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('services').select('*').order('order', { ascending: true });
    return data || [];
  },

  createService: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('services').insert(body).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  updateService: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('services').update(body).eq('id', id).select().single();
    return error || !data ? null : data;
  },

  deleteService: async (id: string) => {
    if (!supabase) return;
    await supabase.from('services').delete().eq('id', id);
  },

  getTestimonials: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('testimonials').select('*');
    return data || [];
  },

  createTestimonial: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('testimonials').insert(body).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  updateTestimonial: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('testimonials').update(body).eq('id', id).select().single();
    return error || !data ? null : data;
  },

  deleteTestimonial: async (id: string) => {
    if (!supabase) return;
    await supabase.from('testimonials').delete().eq('id', id);
  },

  getMessages: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  createMessage: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const item = { ...body, status: 'unread', created_at: new Date().toISOString() };
    const { data, error } = await supabase.from('messages').insert(item).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  updateMessageStatus: async (id: string, status: string) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('messages').update({ status }).eq('id', id).select().single();
    return error || !data ? null : data;
  },

  deleteMessage: async (id: string) => {
    if (!supabase) return;
    await supabase.from('messages').delete().eq('id', id);
  },

  getBlogPosts: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  createBlogPost: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('blog_posts').insert({ ...body, views: 0 }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  updateBlogPost: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('blog_posts').update(body).eq('id', id).select().single();
    return error || !data ? null : data;
  },

  deleteBlogPost: async (id: string) => {
    if (!supabase) return;
    await supabase.from('blog_posts').delete().eq('id', id);
  },

  getAnalyticsStats: async () => {
    if (!supabase) return { total_visitors: 0, total_projects: 0, total_messages: 0, total_posts: 0, unread_messages: 0 };
    try {
      const [pRes, mRes, bRes, uRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }).eq('status', 'unread'),
      ]);
      return {
        total_visitors: 0, total_projects: pRes.count || 0,
        total_messages: mRes.count || 0, total_posts: bRes.count || 0,
        unread_messages: uRes.count || 0,
      };
    } catch { return { total_visitors: 0, total_projects: 0, total_messages: 0, total_posts: 0, unread_messages: 0 }; }
  },

  getVisitorChart: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('analytics').select('date, visitors').order('date', { ascending: true }).limit(7);
    return data && data.length > 0 ? data.map((d: any) => ({ name: d.date, visits: d.visitors })) : [];
  },

  getDeviceChart: async () => [],
  getBrowserChart: async () => [],

  trackVisit: async () => {
    if (!supabase) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase.from('analytics').select('*').eq('date', today).maybeSingle();
      if (data) await supabase.from('analytics').update({ visitors: (data.visitors || 0) + 1 }).eq('date', today);
      else await supabase.from('analytics').insert({ date: today, visitors: 1 });
    } catch {}
  },

  getMedia: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('project_media').select('*');
    return data || [];
  },

  addMedia: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('project_media').insert(body).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  deleteMedia: async (publicId: string) => {
    if (!supabase) return;
    await supabase.from('project_media').delete().eq('public_id', publicId);
  },

  getExperience: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('experience').select('*').order('order', { ascending: true });
    return data || [];
  },

  createExperience: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('experience').insert(body).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  updateExperience: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('experience').update(body).eq('id', id).select().single();
    return error || !data ? null : data;
  },

  deleteExperience: async (id: string) => {
    if (!supabase) return;
    await supabase.from('experience').delete().eq('id', id);
  },

  getLanguages: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('languages').select('*').order('order', { ascending: true });
    return data || [];
  },

  createLanguage: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('languages').insert(body).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  updateLanguage: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('languages').update(body).eq('id', id).select().single();
    return error || !data ? null : data;
  },

  deleteLanguage: async (id: string) => {
    if (!supabase) return;
    await supabase.from('languages').delete().eq('id', id);
  },

  getClientLogos: async () => {
    if (!supabase) return [];
    try {
      const { data } = await supabase.from('settings').select('client_logos').limit(1).maybeSingle();
      if (data?.client_logos && Array.isArray(data.client_logos)) {
        return data.client_logos.map((l: any, i: number) => ({
          id: l.id || `cl-${i + 1}`, name: l.name || '', src: l.src || '',
          order: typeof l.order === 'number' ? l.order : i + 1, created_at: l.created_at || '',
        })).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      }
    } catch {}
    return [];
  },

  createClientLogo: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const item = { id: `cl-${Date.now()}`, created_at: new Date().toISOString(), ...body };
    const { data } = await supabase.from('settings').select('client_logos').limit(1).maybeSingle();
    const logos = [...(data?.client_logos || []), item];
    await supabase.from('settings').update({ client_logos: logos }).eq('id', (await supabase.from('settings').select('id').limit(1).maybeSingle()).data?.id || '');
    return item;
  },

  updateClientLogo: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data } = await supabase.from('settings').select('client_logos').limit(1).maybeSingle();
    const logos = data?.client_logos || [];
    const idx = logos.findIndex((l: any) => l.id === id);
    if (idx === -1) return null;
    logos[idx] = { ...logos[idx], ...body };
    await supabase.from('settings').update({ client_logos: logos }).eq('id', (await supabase.from('settings').select('id').limit(1).maybeSingle()).data?.id || '');
    return logos[idx];
  },

  deleteClientLogo: async (id: string) => {
    if (!supabase) return;
    const { data } = await supabase.from('settings').select('client_logos').limit(1).maybeSingle();
    const logos = (data?.client_logos || []).filter((l: any) => l.id !== id);
    await supabase.from('settings').update({ client_logos: logos }).eq('id', (await supabase.from('settings').select('id').limit(1).maybeSingle()).data?.id || '');
  },
};
