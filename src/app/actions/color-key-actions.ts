'use server';
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createColorKey(prevState: any, formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const name = formData.get('name') as string;
  const color = formData.get('color_hex') as string || formData.get('color') as string;

  if (!name || !color) return { error: 'Name and color are required.' };

  const { error } = await (supabase as any).from('color_keys').insert({ name, color, user_id: user.id });
  if (error) {
    console.error('Failed to create color key:', error);
    return { error: 'Failed to create color key. Name may already exist.' };
  }

  revalidatePath('/color-keys');
  return { error: null };
}

export async function addColorKeyToEntity(entityId: string, entityType: string, keyId: string) {
  const supabase = createSupabaseServerClient();
  
  const { error } = await (supabase as any).from('entity_color_keys').insert({
    entity_id: entityId,
    entity_type: entityType,
    key_id: keyId,
  });

  if (error) {
    console.error('Failed to add color key:', error);
    return { error: 'Failed to add color key to entity.' };
  }

  revalidatePath(`/${entityType}s/${entityId}`);
}

export async function removeColorKeyFromEntity(entityId: string, entityType: string, keyId: string) {
  const supabase = createSupabaseServerClient();

  const { error } = await (supabase as any).from('entity_color_keys').delete()
    .eq('entity_id', entityId)
    .eq('entity_type', entityType)
    .eq('key_id', keyId);
  
  if (error) {
    console.error('Failed to remove color key:', error);
    return { error: 'Failed to remove color key from entity.' };
  }

  revalidatePath(`/${entityType}s/${entityId}`);
} 