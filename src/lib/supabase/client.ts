// src/lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/lib/types/supabase'; // We will create this type definition later

// Define the environment variables, ensuring they are not undefined.
// This provides a clear error if the .env.local file is not set up correctly.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or anonymous key is missing from .env.local");
}

/**
 * Creates a Supabase client for use in the browser.
 * This is a "singleton" instance, meaning we only create it once and reuse it.
 * This is safe to use in client-side components and throughout the browser environment.
 * The generic <Database> type provides full type-safety for all our database interactions.
 */
export const createSupabaseClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ); 