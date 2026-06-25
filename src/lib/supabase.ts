// src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Отсутствуют PUBLIC_SUPABASE_URL или PUBLIC_SUPABASE_ANON_KEY в .env',
  );
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
