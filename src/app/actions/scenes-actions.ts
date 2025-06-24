'use server';

import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createScene() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login?message=You must be logged in to create a scene.');
  }

  const { data: newScene, error } = await supabase
    .from('scenes')
    .insert({ name: 'Untitled Scene', user_id: user.id })
    .select('id, name')
    .single();

  if (error) {
    console.error('Error creating scene:', error);
    return redirect('/scenes?message=Failed to create scene.');
  }

  if (newScene) {
    await supabase.from('workflows').insert({
      name: `Workflow for ${newScene.name}`,
      user_id: user.id,
      scene_id: newScene.id
    });
  }
  
  revalidatePath('/scenes');
  redirect(`/scenes/${newScene.id}`);
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