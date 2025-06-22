// src/lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '../types/supabase';

// Create a singleton Supabase client for the browser
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
); 