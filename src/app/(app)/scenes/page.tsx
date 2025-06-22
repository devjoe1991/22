import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateSceneButton } from '@/components/scenes/CreateSceneButton';

export default async function ScenesPage() {
  const supabase = createSupabaseServerClient();
  const { data: scenes } = await supabase.from('scenes').select('id, name');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Scenes</h1>
        <CreateSceneButton />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {scenes?.map((scene) => (
          <Link href={`/scenes/${scene.id}`} key={scene.id}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader><CardTitle>{scene.name}</CardTitle></CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 