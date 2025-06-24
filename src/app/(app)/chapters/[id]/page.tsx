import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { TagManager } from '@/components/tags/TagManager';
import { EditableField } from '@/components/ui/EditableField';
import { updateItemName } from '@/app/actions/general-actions';

type Tag = { id: string; name: string; color: string; };

export default async function ChapterPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: chapter } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!chapter) {
    notFound();
  }

  const { data: appliedTags } = await (supabase as any).rpc('get_tags_for_entity', {
    entity_id_param: params.id,
    entity_type_param: 'chapter'
  });

  // @ts-ignore - types not yet updated with tags table
  const { data: allAvailableTagsData } = await supabase.from('tags').select('*');
  const allAvailableTags: Tag[] = allAvailableTagsData as any[] || [];

  const updateChapterName = updateItemName.bind(null, 'chapters', chapter.id);

  return (
    <div className="p-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <EditableField 
          initialValue={chapter.name} 
          onSave={updateChapterName}
          fieldName="chapter name"
          textSize="text-3xl"
        />
        <div className="mt-6">
          <TagManager
            entityId={params.id}
            entityType="chapter"
            appliedTags={appliedTags || []}
            allAvailableTags={allAvailableTags}
          />
        </div>
        <div className="mt-8 prose prose-lg dark:prose-invert">
          <p>{chapter.description || 'No description provided.'}</p>
        </div>
      </div>
    </div>
  );
} 