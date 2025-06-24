import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default async function WorkflowsPage() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();

  const { data: workflows, error } = await supabase
    .from('workflows')
    .select('id, name, created_at');

  if (error) {
    console.error('Error fetching workflows:', error);
    // You might want to render an error component here
    return <p>Error loading workflows.</p>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workflows</h1>
      </div>

      {workflows && workflows.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {workflows.map((workflow) => (
            <Link href={`/workflows/${workflow.id}`} key={workflow.id}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{workflow.name || 'Untitled Workflow'}</CardTitle>
                  <CardDescription>
                    Created on:{' '}
                    {workflow.created_at
                      ? new Date(workflow.created_at).toLocaleDateString()
                      : 'Date not available'}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">No workflows found.</p>
          <p className="text-gray-400 mt-2">
            Get started by creating a new workflow.
          </p>
        </div>
      )}
    </div>
  );
} 