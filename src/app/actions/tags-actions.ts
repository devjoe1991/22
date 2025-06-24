'use server';
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createTag(prevState: any, formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const name = formData.get('name') as string;
  const color = formData.get('color_hex') as string || formData.get('color') as string;

  if (!name || !color) return { error: 'Name and color are required.' };

  // @ts-ignore - 'tags' table is new and types are not yet updated.
  const { error } = await supabase.from('tags').insert({ name, color, user_id: user.id });
  if (error) {
    console.error('Failed to create tag:', error);
    return { error: 'Failed to create tag. It might already exist.' };
  }

  revalidatePath('/settings/tags');
} 