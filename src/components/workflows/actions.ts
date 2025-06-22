'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Node, Edge } from 'reactflow';

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