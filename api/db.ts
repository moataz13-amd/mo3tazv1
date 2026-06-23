import { createClient, SupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
export const useSupabase = !!(supabaseUrl && supabaseKey);
export const envVars = { urlSet: !!supabaseUrl, keySet: !!supabaseKey };

let supabase: SupabaseClient | null = null;
if (useSupabase) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
  console.log('[DB] Supabase client initialized');
}

export const useCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });
  console.log('[DB] Cloudinary configured');
}

const EXPECTED_TABLES = [
  'users', 'settings', 'projects', 'skills', 'services',
  'testimonials', 'messages', 'blog_posts', 'analytics',
  'activity_logs', 'experience', 'languages', 'project_media',
];

export async function healthCheck() {
  const env: Record<string, boolean> = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
    JWT_SECRET: !!process.env.JWT_SECRET,
  };

  const tables: Record<string, boolean> = {};
  const errors: string[] = [];

  if (!supabase) {
    return { status: 'error' as const, supabase: false, tables: {}, env, errors: ['Supabase not configured'] };
  }

  for (const table of EXPECTED_TABLES) {
    try {
      const { error } = await supabase.from(table).select('id', { count: 'exact', head: true }).limit(0);
      tables[table] = !error;
      if (error) errors.push(`${table}: ${error.message}`);
    } catch (e: any) {
      tables[table] = false;
      errors.push(`${table}: ${e.message}`);
    }
  }

  const allOk = Object.values(tables).every(Boolean);
  return {
    status: allOk ? 'ok' : errors.length === Object.keys(tables).length ? 'error' : 'degraded' as 'ok' | 'degraded' | 'error',
    supabase: true,
    tables,
    env,
    errors,
  };
}

export async function uploadToCloudinary(buffer: Buffer, folder = 'portfolio_assets'): Promise<{ url: string; publicId: string } | null> {
  if (!useCloudinary) { console.warn('[DB] Cloudinary not configured, skipping upload'); return null; }
  return new Promise((resolve) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto', quality: 'auto:good', fetch_format: 'auto' },
      (err, result) => {
        if (err || !result) {
          console.error('[DB] Cloudinary upload failed:', err?.message || 'no result');
          resolve(null);
        } else {
          console.log('[DB] Cloudinary upload success:', result.public_id);
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      }
    );
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  if (!useCloudinary) return;
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log('[DB] Cloudinary delete success:', publicId);
  } catch (e: any) {
    console.warn('[DB] Cloudinary delete failed:', publicId, e.message);
  }
}

async function ensureAdmin() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      console.error('[DB] ensureAdmin query failed:', error.message);
      return;
    }
    if (!data || data.length === 0) {
      const hash = bcrypt.hashSync('password123', 10);
      const { error: insertError } = await supabase.from('users').insert({
        email: 'admin@portfolio.system',
        password_hash: hash,
        name: 'Admin',
        role: 'admin',
        created_at: new Date().toISOString(),
      });
      if (insertError) {
        console.error('[DB] ensureAdmin insert failed:', insertError.message);
      } else {
        console.log('[DB] Admin user created');
      }
    }
  } catch (e: any) {
    console.error('[DB] ensureAdmin error:', e.message);
  }
}

// Fire-and-forget admin seeding at startup
if (useSupabase) {
  ensureAdmin();
}

const SETTINGS_FIELDS = [
  'name', 'title', 'subtitle', 'bio', 'email', 'phone', 'location',
  'seo_title', 'seo_description', 'hero_headline', 'hero_subheadline',
  'about_description', 'about_section_title', 'about_section_heading', 'about_cta_text',
  'stat1_value', 'stat1_label', 'stat2_value', 'stat2_label',
  'social_links', 'client_logos', 'marquee_row1', 'marquee_row2',
  'availability_status', 'availability_response_time', 'avatar', 'cv_url',
];

async function getSettingsId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('settings').select('id').limit(1).maybeSingle();
  return data?.id || null;
}

function log(op: string, detail?: string) {
  console.log(`[DB] ${op}${detail ? ` — ${detail}` : ''}`);
}

export const db = {
  getUserByEmail: async (email: string) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (error) { console.error('[DB] getUserByEmail error:', error.message); }
    return error || !data ? null : data;
  },

  logActivity: async (action: string, description: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('activity_logs').insert({ action, description, created_at: new Date().toISOString() });
    if (error) console.error('[DB] logActivity error:', error.message);
  },

  getActivityLogs: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(20);
    if (error) console.error('[DB] getActivityLogs error:', error.message);
    return data || [];
  },

  getSettings: async () => {
    if (!supabase) return {};
    const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
    if (error) console.error('[DB] getSettings error:', error.message);
    return data || {};
  },

  updateSettings: async (body: any) => {
    if (!supabase) return body;
    const payload: any = {};
    for (const f of SETTINGS_FIELDS) {
      if (body[f] !== undefined) payload[f] = body[f];
    }
    if (Object.keys(payload).length > 0) {
      const id = await getSettingsId();
      if (id) {
        const { error } = await supabase.from('settings').update(payload).eq('id', id);
        if (error) console.error('[DB] updateSettings error:', error.message);
      } else {
        const { error } = await supabase.from('settings').insert({ ...payload, created_at: new Date().toISOString() });
        if (error) console.error('[DB] updateSettings insert error:', error.message);
      }
    }
    log('updateSettings');
    return db.getSettings();
  },

  getProjects: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) console.error('[DB] getProjects error:', error.message);
    return data || [];
  },

  createProject: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('projects').insert(body).select().single();
    if (error) { console.error('[DB] createProject error:', error.message); throw new Error(error.message); }
    log('createProject', data.title);
    return data;
  },

  updateProject: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('projects').update(body).eq('id', id).select().single();
    if (error) { console.error('[DB] updateProject error:', error.message); return null; }
    return data || null;
  },

  deleteProject: async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) console.error('[DB] deleteProject error:', error.message);
    log('deleteProject', id);
  },

  getSkills: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('skills').select('*').order('order', { ascending: true });
    if (error) console.error('[DB] getSkills error:', error.message);
    return data || [];
  },

  createSkill: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('skills').insert(body).select().single();
    if (error) { console.error('[DB] createSkill error:', error.message); throw new Error(error.message); }
    log('createSkill', data.name);
    return data;
  },

  updateSkill: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('skills').update(body).eq('id', id).select().single();
    if (error) { console.error('[DB] updateSkill error:', error.message); return null; }
    return data || null;
  },

  deleteSkill: async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) console.error('[DB] deleteSkill error:', error.message);
  },

  getServices: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('services').select('*').order('order', { ascending: true });
    if (error) console.error('[DB] getServices error:', error.message);
    return data || [];
  },

  createService: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('services').insert(body).select().single();
    if (error) { console.error('[DB] createService error:', error.message); throw new Error(error.message); }
    log('createService', data.title);
    return data;
  },

  updateService: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('services').update(body).eq('id', id).select().single();
    if (error) { console.error('[DB] updateService error:', error.message); return null; }
    return data || null;
  },

  deleteService: async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) console.error('[DB] deleteService error:', error.message);
  },

  getTestimonials: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('testimonials').select('*');
    if (error) console.error('[DB] getTestimonials error:', error.message);
    return data || [];
  },

  createTestimonial: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('testimonials').insert(body).select().single();
    if (error) { console.error('[DB] createTestimonial error:', error.message); throw new Error(error.message); }
    log('createTestimonial', data.client_name);
    return data;
  },

  updateTestimonial: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('testimonials').update(body).eq('id', id).select().single();
    if (error) { console.error('[DB] updateTestimonial error:', error.message); return null; }
    return data || null;
  },

  deleteTestimonial: async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) console.error('[DB] deleteTestimonial error:', error.message);
  },

  getMessages: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error) console.error('[DB] getMessages error:', error.message);
    return data || [];
  },

  createMessage: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const item = { ...body, status: 'unread', created_at: new Date().toISOString() };
    const { error } = await supabase.from('messages').insert(item);
    if (error) { console.error('[DB] createMessage error:', error.message); throw new Error(error.message); }
    log('createMessage', body.name || 'unknown');
    return item;
  },

  updateMessageStatus: async (id: string, status: string) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('messages').update({ status }).eq('id', id).select().single();
    if (error) { console.error('[DB] updateMessageStatus error:', error.message); return null; }
    return data || null;
  },

  deleteMessage: async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) console.error('[DB] deleteMessage error:', error.message);
  },

  getBlogPosts: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (error) console.error('[DB] getBlogPosts error:', error.message);
    return data || [];
  },

  createBlogPost: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('blog_posts').insert({ ...body, views: 0 }).select().single();
    if (error) { console.error('[DB] createBlogPost error:', error.message); throw new Error(error.message); }
    log('createBlogPost', data.title);
    return data;
  },

  updateBlogPost: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('blog_posts').update(body).eq('id', id).select().single();
    if (error) { console.error('[DB] updateBlogPost error:', error.message); return null; }
    return data || null;
  },

  deleteBlogPost: async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) console.error('[DB] deleteBlogPost error:', error.message);
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
        total_visitors: 0,
        total_projects: pRes.count || 0,
        total_messages: mRes.count || 0,
        total_posts: bRes.count || 0,
        unread_messages: uRes.count || 0,
      };
    } catch (e: any) {
      console.error('[DB] getAnalyticsStats error:', e.message);
      return { total_visitors: 0, total_projects: 0, total_messages: 0, total_posts: 0, unread_messages: 0 };
    }
  },

  getVisitorChart: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('analytics').select('date, visitors').order('date', { ascending: true }).limit(7);
    if (error) { console.error('[DB] getVisitorChart error:', error.message); return []; }
    return data && data.length > 0
      ? data.map((d: any) => ({ name: d.date, visits: d.visitors }))
      : [];
  },

  getDeviceChart: async () => [],
  getBrowserChart: async () => [],

  trackVisit: async () => {
    if (!supabase) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase.from('analytics').select('*').eq('date', today).maybeSingle();
      if (error && error.code !== 'PGRST116') { console.error('[DB] trackVisit query error:', error.message); return; }
      if (data) {
        await supabase.from('analytics').update({ visitors: (data.visitors || 0) + 1 }).eq('date', today);
      } else {
        await supabase.from('analytics').insert({ date: today, visitors: 1 });
      }
    } catch (e: any) {
      console.error('[DB] trackVisit error:', e.message);
    }
  },

  getMedia: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('project_media').select('*');
    if (error) { console.error('[DB] getMedia error:', error.message); return []; }
    return data || [];
  },

  addMedia: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('project_media').insert(body).select().single();
    if (error) { console.error('[DB] addMedia error:', error.message); throw new Error(error.message); }
    log('addMedia', data.public_id);
    return data;
  },

  deleteMedia: async (publicId: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('project_media').delete().eq('public_id', publicId);
    if (error) console.error('[DB] deleteMedia error:', error.message);
  },

  getExperience: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('experience').select('*').order('order', { ascending: true });
    if (error) { console.error('[DB] getExperience error:', error.message); return []; }
    return data || [];
  },

  createExperience: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('experience').insert(body).select().single();
    if (error) { console.error('[DB] createExperience error:', error.message); throw new Error(error.message); }
    log('createExperience', data.title);
    return data;
  },

  updateExperience: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('experience').update(body).eq('id', id).select().single();
    if (error) { console.error('[DB] updateExperience error:', error.message); return null; }
    return data || null;
  },

  deleteExperience: async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) console.error('[DB] deleteExperience error:', error.message);
  },

  getLanguages: async () => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('languages').select('*').order('order', { ascending: true });
    if (error) { console.error('[DB] getLanguages error:', error.message); return []; }
    return data || [];
  },

  createLanguage: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase.from('languages').insert(body).select().single();
    if (error) { console.error('[DB] createLanguage error:', error.message); throw new Error(error.message); }
    log('createLanguage', data.name);
    return data;
  },

  updateLanguage: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('languages').update(body).eq('id', id).select().single();
    if (error) { console.error('[DB] updateLanguage error:', error.message); return null; }
    return data || null;
  },

  deleteLanguage: async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('languages').delete().eq('id', id);
    if (error) console.error('[DB] deleteLanguage error:', error.message);
  },

  getClientLogos: async () => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('settings').select('client_logos').limit(1).maybeSingle();
      if (error || !data?.client_logos) return [];
      const logos = data.client_logos;
      if (!Array.isArray(logos)) return [];
      return logos.map((l: any, i: number) => ({
        id: l.id || `cl-${i + 1}`,
        name: l.name || '',
        src: l.src || '',
        order: typeof l.order === 'number' ? l.order : i + 1,
        created_at: l.created_at || '',
      })).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    } catch (e: any) {
      console.error('[DB] getClientLogos error:', e.message);
      return [];
    }
  },

  createClientLogo: async (body: any) => {
    if (!supabase) throw new Error('Database not configured');
    const item = { id: `cl-${Date.now()}`, created_at: new Date().toISOString(), ...body };
    const { data } = await supabase.from('settings').select('client_logos').limit(1).maybeSingle();
    const logos = [...(data?.client_logos || []), item];
    const id = await getSettingsId();
    if (id) {
      const { error } = await supabase.from('settings').update({ client_logos: logos }).eq('id', id);
      if (error) { console.error('[DB] createClientLogo error:', error.message); throw new Error(error.message); }
    }
    log('createClientLogo', item.name);
    return item;
  },

  updateClientLogo: async (id: string, body: any) => {
    if (!supabase) return null;
    const { data } = await supabase.from('settings').select('client_logos').limit(1).maybeSingle();
    const logos: any[] = data?.client_logos || [];
    const idx = logos.findIndex((l: any) => l.id === id);
    if (idx === -1) return null;
    logos[idx] = { ...logos[idx], ...body };
    const settingsId = await getSettingsId();
    if (settingsId) {
      await supabase.from('settings').update({ client_logos: logos }).eq('id', settingsId);
    }
    return logos[idx];
  },

  deleteClientLogo: async (id: string) => {
    if (!supabase) return;
    const { data } = await supabase.from('settings').select('client_logos').limit(1).maybeSingle();
    const logos = (data?.client_logos || []).filter((l: any) => l.id !== id);
    const settingsId = await getSettingsId();
    if (settingsId) {
      await supabase.from('settings').update({ client_logos: logos }).eq('id', settingsId);
    }
  },

  clearClientLogos: async () => {
    if (!supabase) return;
    const settingsId = await getSettingsId();
    if (settingsId) {
      const { error } = await supabase.from('settings').update({ client_logos: [] }).eq('id', settingsId);
      if (error) console.error('[DB] clearClientLogos error:', error.message);
    }
    log('clearClientLogos');
  },
};
