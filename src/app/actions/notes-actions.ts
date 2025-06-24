'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createNote(formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    const content = formData.get('content') as string;
    if (!content) return { error: 'Note content cannot be empty.' };

    const { error } = await (supabase as any).from('notes').insert({ content, creator_id: user.id });

    if (error) {
        console.error('Failed to create note:', error);
        return { error: 'Failed to create note.' };
    }

    revalidatePath('/notes');
    revalidatePath('/dashboard');
}

export async function deleteNote(noteId: string) {
    const supabase = createClient();
    const { error } = await (supabase as any).from('notes').delete().eq('id', noteId);

    if (error) {
        console.error('Failed to delete note:', error);
        return { error: 'Failed to delete note.' };
    }

    revalidatePath('/notes');
    revalidatePath('/dashboard');
}

export async function toggleGlobalPin(noteId: string, currentState: boolean) {
    const supabase = createClient();
    const { error } = await (supabase as any).from('notes').update({ is_pinned_globally: !currentState }).eq('id', noteId);

    if (error) {
        console.error('Failed to update pin status:', error);
        return { error: 'Failed to update pin status.' };
    }

    revalidatePath('/notes');
    revalidatePath('/dashboard');
}

export async function assignNoteToUser(noteId: string, targetUserId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };
    
    const { error } = await (supabase as any).from('note_assignments').insert({
        note_id: noteId,
        user_id: targetUserId,
        assigned_by: user.id
    });

    if (error) {
        console.error('Failed to assign note:', error);
        // Provide a more helpful error for unique constraint violation
        if (error.code === '23505') {
            return { error: 'Note is already assigned to this user.' };
        }
        return { error: 'Failed to assign note.' };
    }

    revalidatePath('/notes');
    revalidatePath('/dashboard');
}

export async function unassignNoteFromUser(noteId: string, targetUserId: string) {
    const supabase = createClient();
    const { error } = await (supabase as any).from('note_assignments').delete()
        .eq('note_id', noteId)
        .eq('user_id', targetUserId);

    if (error) {
        console.error('Failed to unassign note:', error);
        return { error: 'Failed to unassign note.' };
    }

    revalidatePath('/notes');
    revalidatePath('/dashboard');
} 