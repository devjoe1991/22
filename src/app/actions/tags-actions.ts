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
  return { error: null };
}

export async function addTagToEntity(entityId: string, entityType: string, tagId: string) {
  const supabase = createSupabaseServerClient();
  
  const { error } = await (supabase as any).from('entity_tags').insert({
    entity_id: entityId,
    entity_type: entityType,
    tag_id: tagId,
  });

  if (error) {
    console.error('Failed to add tag:', error);
    return { error: 'Failed to add tag to entity.' };
  }

  revalidatePath(`/${entityType}s/${entityId}`);
}

export async function removeTagFromEntity(entityId: string, entityType: string, tagId: string) {
  const supabase = createSupabaseServerClient();

  const { error } = await (supabase as any).from('entity_tags').delete()
    .eq('entity_id', entityId)
    .eq('entity_type', entityType)
    .eq('tag_id', tagId);

  if (error) {
    console.error('Failed to remove tag:', error);
    return { error: 'Failed to remove tag from entity.' };
  }

  revalidatePath(`/${entityType}s/${entityId}`);
} 