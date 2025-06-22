'use server'

import { createClient } from '@/lib/supabase/server'
import { type Json } from '@/lib/types/supabase'
import { revalidatePath } from 'next/cache'
import { logAction } from '@/lib/audit/actions'

// This action creates the DB record AND a signed URL for the upload
export async function createAsset(characterId: string, fileName: string, fileType: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to upload files.')
  }
  
  // Sanitize filename to prevent path traversal issues
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '')
  const path = `${characterId}/${Date.now()}_${sanitizedFileName}`

  // Get a signed URL from Supabase storage, valid for 1 minute
  const { data, error: urlError } = await supabase.storage
    .from('assets') // Our storage bucket name
    .createSignedUploadUrl(path)

  if (urlError) {
    throw new Error(`Could not create signed URL: ${urlError.message}`)
  }

  const { error: dbError } = await supabase.from('assets').insert({
    parent_id: characterId,
    parent_type: 'character',
    file_name: sanitizedFileName,
    file_type: fileType,
    uploader_id: user.id,
    // The URL is constructed from the bucket and path
    file_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${path}`,
  })

  if (dbError) {
    throw new Error(`Database error: ${dbError.message}`)
  }
  
  revalidatePath(`/characters/${characterId}`)
  
  await logAction('asset.create', { characterId, fileName });

  return { signedUrl: data, path };
}

export async function saveCharacterStory(characterId: string, content: Json) {
  const supabase = createClient()
  const { error } = await supabase
    .from('characters')
    .update({ story_content: content })
    .eq('id', characterId);

  if (error) {
    throw new Error(`Database error while saving story: ${error.message}`);
  }

  if (!error) {
    await logAction('character.story.update', { characterId });
  }

  revalidatePath(`/characters/${characterId}`);
}

export async function addComment(characterId: string, content: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to comment.');
  }
  if (!content.trim()) {
    throw new Error('Comment cannot be empty.');
  }

  const { data: newComment, error } = await supabase.from('comments').insert({
    parent_id: characterId,
    content: content,
    user_id: user.id,
  }).select().single();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  // --- Start of Notification Logic ---
  if (newComment) {
    const { data: parentItem } = await supabase
      .from('characters')
      .select('user_id, name')
      .eq('id', newComment.parent_id)
      .single();

    if (parentItem && parentItem.user_id) {
        const commenterId = user.id;
        const ownerId = parentItem.user_id;

        if (commenterId !== ownerId) {
            await supabase.from('notifications').insert({
                user_id: ownerId,
                actor_id: commenterId,
                event_type: 'new_comment',
                content: {
                    comment_id: newComment.id,
                    parent_id: newComment.parent_id,
                    parent_type: 'character',
                    parent_name: parentItem.name,
                }
            });
        }
    }
  }
  // --- End of Notification Logic ---

  if (!error) {
    await logAction('comment.create', { characterId, content: content.substring(0, 50) });
  }

  // Revalidate the path to ensure server-rendered data is fresh on next load,
  // but the real-time update will handle the immediate UI change.
  revalidatePath(`/characters/${characterId}`);
}

export async function createCharacter() {
  // Placeholder function
  console.log('Create character action called');
  // In a real implementation, you would create a new character record in the database
  // and redirect to the new character's page, e.g., redirect(`/characters/new-id`);
  revalidatePath('/characters');
} 