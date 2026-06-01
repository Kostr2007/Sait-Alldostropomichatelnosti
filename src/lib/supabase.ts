import { createBrowserClient } from '@supabase/ssr';

const suopabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const suopabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!suopabaseUrl || !suopabaseAnonKey) {
  throw new Error(
    '=== ОШИБКА! === Отсутствуют PUBLIC_SUPABASE_URL или PUBLIC_SUPABASE_ANON_KEY в .env',
  );
}

export const supabase = createBrowserClient(suopabaseUrl, suopabaseAnonKey);
