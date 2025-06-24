'use server';

import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCharacter() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login?message=You must be logged in to create a character.');
  }

  const { data: newCharacter, error } = await supabase
    .from('characters')
    .insert({ name: 'Untitled Character', user_id: user.id, status: 'idea' })
    .select('id, name')
    .single();

  if (error) {
    console.error('Error creating character:', error);
    return redirect('/characters?message=Failed to create character.');
  }
  
  if (newCharacter) {
    await supabase.from('workflows').insert({
      name: `Workflow for ${newCharacter.name}`,
      user_id: user.id,
      character_id: newCharacter.id
    });
  }

  revalidatePath('/characters');
  redirect(`/characters/${newCharacter.id}`);
} 