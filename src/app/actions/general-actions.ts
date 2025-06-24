'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logAction } from '@/lib/audit/actions';

type TableName = 'characters' | 'scenes' | 'chapters';

export async function updateItemName(
  table: TableName,
  id: string,
  newName: string
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to edit items.');
  }

  const { error } = await supabase
    .from(table)
    .update({ name: newName })
    .eq('id', id);

  if (error) {
    console.error(`Error updating ${table}:`, error);
    throw new Error(`Failed to update ${table}.`);
  }

  revalidatePath(`/${table}/${id}`);
  revalidatePath(`/${table}`);
} 