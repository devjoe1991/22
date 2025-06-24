import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { TagManager } from '@/components/tags/TagManager';

type Tag = { id: string; name: string; color: string; };

export default async function CharacterPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: character } = await supabase
    .from('characters')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!character) {
    notFound();
  }

  const { data: appliedTags } = await (supabase as any).rpc('get_tags_for_entity', {
    entity_id_param: params.id,
    entity_type_param: 'character'
  });

  // @ts-ignore - types not yet updated with tags table
  const { data: allAvailableTags } = await supabase.from('tags').select('*');

  const availableTags: Tag[] = allAvailableTags as any[] || [];


  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {character.name}
          </h1>
          <p className="text-lg text-muted-foreground">{character.description}</p>
        </div>

        <TagManager
          entityId={params.id}
          entityType="character"
          appliedTags={appliedTags || []}
          allAvailableTags={availableTags}
        />
      </div>
    </div>
  );
} 