import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { SceneDetailClient } from '@/components/scenes/SceneDetailClient';

type ColorKey = { id: string; name: string; color: string; };

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
    
    const { data: appliedColorKeys } = await (supabase as any).rpc('get_color_keys_for_entity', {
      entity_id_param: params.id,
      entity_type_param: 'scenes'
    });

    const { data: allAvailableColorKeys } = await (supabase as any).from('color_keys').select('*');

    const availableKeys: ColorKey[] = allAvailableColorKeys as any[] || [];

    // The type assertion is a bit of a workaround because Supabase's generated types
    // can sometimes be tricky with nested selections. We are confident in the shape of the data here.
    return <SceneDetailClient 
              scene={scene} 
              linkedCharacters={linkedCharacters as any} 
              allCharacters={allCharacters}
              appliedColorKeys={appliedColorKeys || []}
              allAvailableColorKeys={availableKeys}
            />;
} 