'use server';

import { createClient } from '@/lib/supabase/server';

export async function logAction(action: string, details?: Record<string, any>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return; // Don't log if user isn't authenticated

  await supabase.from('audit_log').insert({
    user_id: user.id,
    action_type: action,
    details: details || {},
  });
} 