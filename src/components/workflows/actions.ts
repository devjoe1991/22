'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Node, Edge } from 'reactflow';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function saveWorkflow(workflowId: string, nodes: Node[], edges: Edge[]) {
  const supabase = createClient();
  const { error } = await supabase
    .from('workflows')
    .update({
      nodes: nodes as any, // Cast to 'any' to satisfy Supabase type, as it expects Json
      edges: edges as any,
      updated_at: new Date().toISOString(),
    })
    .eq('id', workflowId);

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }
  revalidatePath(`/workflows/${workflowId}`);
}

export async function createWorkflow() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // This should be handled by middleware, but good to have a check
    return redirect('/login');
  }

  const { data, error } = await supabase
    .from('workflows')
    .insert({
      name: 'Untitled Workflow',
      user_id: user.id,
      state: { nodes: [], edges: [] } as any, // Initialize with empty state
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating workflow:', error);
    // Redirect to an error page or show a toast
    return redirect('/error');
  }

  revalidatePath('/workflows');
  redirect(`/workflows/${data.id}`);
} 