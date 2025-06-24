'use server';

import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { logAction } from '@/lib/audit/actions';

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
    await logAction('character.create', {
      item_id: newCharacter.id,
      item_type: 'character',
      item_name: newCharacter.name,
    });
    await supabase.from('workflows').insert({
      name: `Workflow for ${newCharacter.name}`,
      user_id: user.id,
      character_id: newCharacter.id
    });
  }

  revalidatePath('/characters');
  redirect(`/characters/${newCharacter.id}`);
}

type TagCategory = 'physical_attributes' | 'cosmetic_symbology' | 'animal_form';

export async function updateCharacterTags(
  characterId: string,
  category: TagCategory,
  newTags: string[]
) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to edit tags.');
  }

  // First, fetch the current tags object
  // @ts-ignore - The 'filter_tags' column was added via migration, but types are not yet updated.
  const { data: character, error: fetchError } = await supabase
    .from('characters')
    .select('filter_tags')
    .eq('id', characterId)
    .single();
  
  if (fetchError || !character) {
    console.error('Error fetching character tags:', fetchError);
    throw new Error('Failed to fetch character tags.');
  }

  // Update the specific category within the JSONB object
  // @ts-ignore
  const currentTags = character.filter_tags as Record<TagCategory, string[]>;
  currentTags[category] = newTags;

  // Now, update the character with the new tags object
  const { error: updateError } = await supabase
    .from('characters')
    // @ts-ignore
    .update({ filter_tags: currentTags })
    .eq('id', characterId);
  
  if (updateError) {
    console.error('Error updating character tags:', updateError);
    throw new Error('Failed to update character tags.');
  }

  // Revalidate the path to show the updated data
  revalidatePath(`/characters/${characterId}`);
}

export async function updateCharacterAttributeTags(characterId: string, attributeType: string, newTags: string[]) {
    const supabase = createSupabaseServerClient();
    
    // Construct the update object to target a specific key in the JSONB column
    const updateObject = {
        attribute_tags: {
            [attributeType]: newTags
        }
    };

    const { error } = await supabase
        .from('characters')
        .update(updateObject as any)
        .eq('id', characterId);

    if (error) {
        console.error("Failed to update attribute tags:", error);
        return { error: 'Failed to update character attributes.' };
    }

    revalidatePath(`/characters/${characterId}`);
    return { error: null };
} 