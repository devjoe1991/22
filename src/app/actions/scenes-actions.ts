'use server';

import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createScene() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in.' };

  const { data, error } = await supabase
    .from('scenes')
    .insert({ name: 'Untitled Scene', user_id: user.id })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating scene:', error);
    return { error: 'Failed to create scene.' };
  }
  
  revalidatePath('/scenes');
  redirect(`/scenes/${data.id}`);
}

export async function addCharacterToScene(formData: FormData) {
    const supabase = createSupabaseServerClient();

    const characterId = formData.get('characterId') as string;
    const sceneId = formData.get('sceneId') as string;

    if (!characterId || !sceneId) {
        console.error('Missing form data for addCharacterToScene');
        return { error: 'Missing required fields.' };
    }

    const { error } = await supabase
        .from('character_scenes')
        .insert({ character_id: characterId, scene_id: sceneId });
    
    if (error) {
        console.error('Error adding character to scene:', error);
        return { error: 'Failed to add character to scene.' };
    }

    revalidatePath(`/scenes/${sceneId}`);
} 