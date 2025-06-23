'use server';

import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCharacter(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login?message=You must be logged in to create a character.');
  }

  const { data, error } = await supabase
    .from('characters')
    .insert({ name: 'Untitled Character', user_id: user.id, status: 'idea' })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating character:', error);
    return redirect('/characters?message=Failed to create character.');
  }
  
  revalidatePath('/characters');
  redirect(`/characters/${data.id}`);
} 