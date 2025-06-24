'use client';

import { EditableField } from '@/components/ui/EditableField';
import { TaggingForm } from '@/components/scenes/TaggingForm';
import { updateItemName } from '@/app/actions/general-actions';
import { Tables } from '@/lib/types/supabase';
import { TagManager } from '../tags/TagManager';

type Character = Tables<'characters'>;
type BasicCharacter = Pick<Tables<'characters'>, 'id' | 'name'>;
type Tag = { id: string; name: string; color: string; };

interface SceneDetailClientProps {
  scene: Tables<'scenes'>;
  linkedCharacters: { characters: Character }[];
  allCharacters: BasicCharacter[];
  appliedTags: Tag[];
  allAvailableTags: Tag[];
}

export function SceneDetailClient({ scene, linkedCharacters, allCharacters, appliedTags, allAvailableTags }: SceneDetailClientProps) {
  const updateSceneName = updateItemName.bind(null, 'scenes', scene.id);

  return (
    <div className="p-8 space-y-8">
      <div>
        <EditableField 
          initialValue={scene.name} 
          onSave={updateSceneName}
          fieldName="scene name"
        />
        <div className="mt-4">
          <TagManager 
            entityId={scene.id}
            entityType="scene"
            appliedTags={appliedTags}
            allAvailableTags={allAvailableTags}
          />
        </div>
      </div>
      <p>{scene.description || 'No description provided.'}</p>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Characters in this Scene</h2>
        <div className="p-4 border rounded-lg mb-4">
            {linkedCharacters && linkedCharacters.length > 0 ? (
                <ul className="list-disc pl-5">
                    {linkedCharacters.map((link) => (
                        <li key={link.characters.id}>{link.characters.name}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground">No characters have been added to this scene yet.</p>
            )}
        </div>
        <TaggingForm sceneId={scene.id} allCharacters={allCharacters} />
      </div>
    </div>
  );
} 