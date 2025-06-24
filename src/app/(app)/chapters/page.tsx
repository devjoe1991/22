import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { createChapter } from '@/app/actions/chapter-actions';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default async function ChaptersPage() {
  const supabase = createSupabaseServerClient();
  const { data: chapters } = await supabase.from('chapters').select('id, name');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chapters</h1>
        <form action={createChapter}>
          <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" />Create Chapter</Button>
        </form>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {chapters?.map((chapter) => (
          <Link href={`/chapters/${chapter.id}`} key={chapter.id}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader><CardTitle>{chapter.name}</CardTitle></CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 