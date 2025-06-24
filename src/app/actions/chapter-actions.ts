'use server';

import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { logAction } from '@/lib/audit/actions';

export async function createChapter() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login?message=You must be logged in to create a chapter.');
  }

  const { data: newChapter, error } = await supabase
    .from('chapters')
    .insert({ name: 'Untitled Chapter', user_id: user.id })
    .select('id, name')
    .single();

  if (error) {
    console.error('Error creating chapter:', error);
    // This assumes you have a /chapters page to redirect to.
    return redirect('/chapters?message=Failed to create chapter.');
  }

  if (newChapter) {
    await logAction('chapter.create', {
      item_id: newChapter.id,
      item_type: 'chapter',
      item_name: newChapter.name,
    });
    await supabase.from('workflows').insert({
      name: `Workflow for ${newChapter.name}`,
      user_id: user.id,
      chapter_id: newChapter.id
    });
  }
  
  revalidatePath('/chapters');
  redirect(`/chapters/${newChapter.id}`);
} 