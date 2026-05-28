import { createBrowserClient, createServerClient } from '@supabase/supabase-js';

export const supabase = createBrowserClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
);

// Для серверных действий
export const createSupabaseServer = (cookies: any) =>
  createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    { cookies },
  );
