import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Warning: SUPABASE_URL or SUPABASE_ANON_KEY is missing. Using local mock database.');
  // Create a dummy proxy that won't be called (db.ts checks USE_MOCK first)
  supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      if (prop === 'from') {
        return () => {
          throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
        };
      }
      return undefined;
    },
  });
}

export { supabase };
