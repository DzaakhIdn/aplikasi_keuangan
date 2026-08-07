import { createClient } from '@supabase/supabase-js';

import { CONFIG } from '@/global-config';
// ----------------------------------------------------------------------

const supabaseUrl = CONFIG.supabase.url;
const supabaseKey = CONFIG.supabase.key;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

// ----------------------------------------------------------------------

export const supabase = createClient(supabaseUrl, supabaseKey);
