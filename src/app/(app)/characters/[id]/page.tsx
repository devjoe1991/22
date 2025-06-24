import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { EditableField } from '@/components/ui/EditableField';
import { updateItemName } from '@/app/actions/general-actions';
import { ColorKeyManager } from '@/components/tags/ColorKeyManager';
import { AttributeTagManager } from '@/components/characters/AttributeTagManager';

type ColorKey = { id: string; name: string; color: string; };

async function getAppliedColorKeys(supabase: any, characterId: string): Promise<ColorKey[]> {
    const { data } = await supabase.rpc('get_color_keys_for_entity', {
        entity_id_param: characterId,
        entity_type_param: 'character'
    });
    return data || [];
}

// Need a new helper function for the RPC call
async function getColorKeysForEntity(supabase: any, entityId: string, entityType: string) {
    const { data } = await (supabase as any).rpc('get_color_keys_for_entity', {
        entity_id_param: entityId,
        entity_type_param: entityType
    });
    return data || [];
}


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

  const [appliedColorKeys, allAvailableColorKeys] = await Promise.all([
      getColorKeysForEntity(supabase, params.id, 'character'),
      (supabase as any).from('color_keys').select('*')
  ]);
  
  const attributeTags = (character as any).attribute_tags || { physical_attributes: [], cosmetic_symbology: [], animal_form: [] };

  return (
    <div className="p-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <EditableField 
          initialValue={character.name} 
          onSave={updateItemName.bind(null, 'characters', character.id)}
          fieldName="character name"
          textSize="text-3xl"
        />
        <div className="mt-8 grid md:grid-cols-2 gap-8 items-start">
            <AttributeTagManager 
                characterId={character.id}
                initialTags={attributeTags}
            />
            <ColorKeyManager
              entityId={params.id}
              entityType="character"
              appliedColorKeys={appliedColorKeys || []}
              allAvailableColorKeys={allAvailableColorKeys?.data || []}
            />
        </div>
      </div>
    </div>
  );
} 