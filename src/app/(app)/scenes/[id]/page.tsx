import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { SceneDetailClient } from '@/components/scenes/SceneDetailClient';
import { TagManager } from '@/components/tags/TagManager';

type Tag = { id: string; name: string; color: string; };

export default async function SceneDetailPage({ params }: { params: { id: string } }) {
    const supabase = createSupabaseServerClient();

    const { data: scene } = await supabase.from('scenes').select('*').eq('id', params.id).single();

    if (!scene) return <p>Scene not found.</p>;

    const { data: linkedCharactersData } = await supabase
        .from('character_scenes')
        .select('characters(*)')
        .eq('scene_id', params.id);
    const linkedCharacters = linkedCharactersData || [];

    const { data: allCharactersData } = await supabase.from('characters').select('id, name');
    const allCharacters = allCharactersData || [];
    
    const { data: appliedTags } = await (supabase as any).rpc('get_tags_for_entity', {
      entity_id_param: params.id,
      entity_type_param: 'scene'
    });

    // @ts-ignore - types not yet updated with tags table
    const { data: allAvailableTags } = await supabase.from('tags').select('*');

    const availableTags: Tag[] = allAvailableTags as any[] || [];

    // The type assertion is a bit of a workaround because Supabase's generated types
    // can sometimes be tricky with nested selections. We are confident in the shape of the data here.
    return <SceneDetailClient 
              scene={scene} 
              linkedCharacters={linkedCharacters as any} 
              allCharacters={allCharacters}
              appliedTags={appliedTags || []}
              allAvailableTags={availableTags}
            />;
} 