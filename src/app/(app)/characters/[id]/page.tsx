import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AssetGallery from '@/components/characters/asset-gallery';
import CommentSection from '@/components/characters/comment-section';
import ActivityFeed from '@/components/characters/activity-feed';
import TiptapEditor from '@/components/editor/tiptap-editor';
import { saveCharacterStory } from '@/components/characters/actions';
import { TagManager } from '@/components/characters/TagManager';
import { updateCharacterTags } from '@/app/actions/character-actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CharacterDetailPageProps {
  params: { id: string };
}

export default async function CharacterDetailPage({ params }: CharacterDetailPageProps) {
  const supabase = createClient();
  
  const { data: character, error } = await supabase.from('characters').select('*').eq('id', params.id).single();
  const { data: comments } = await supabase.from('comments').select('*, profiles(username, avatar_url)').eq('parent_id', params.id).order('created_at', { ascending: true });
  
  // Fetch audit logs
  const { data: auditLogs } = await supabase
    .from('audit_log')
    .select('*, profiles(username)')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !character) {
    notFound();
  }

  // @ts-ignore - types not updated with filter_tags yet
  const tags = character.filter_tags || { physical_attributes: [], cosmetic_symbology: [], animal_form: [] };
  const saveStoryAction = saveCharacterStory.bind(null, character.id);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 grid gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold md:text-3xl">{character.name}</h1>
          <p className="text-muted-foreground">{character.description || 'No description provided.'}</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Backstory / Notes</h2>
          <TiptapEditor content={character.story_content} saveContent={saveStoryAction} />
        </div>
        <AssetGallery characterId={character.id} />
        <CommentSection characterId={character.id} initialComments={comments as any || []} />
      </div>
      <div className="lg:col-span-1 space-y-6">
        <ActivityFeed initialLogs={auditLogs as any || []} />
        <Card>
          <CardHeader>
            <CardTitle>Character Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <TagManager 
              characterId={character.id}
              category="physical_attributes"
              tags={tags.physical_attributes}
              updateAction={updateCharacterTags}
            />
            <TagManager 
              characterId={character.id}
              category="cosmetic_symbology"
              tags={tags.cosmetic_symbology}
              updateAction={updateCharacterTags}
            />
            <TagManager 
              characterId={character.id}
              category="animal_form"
              tags={tags.animal_form}
              updateAction={updateCharacterTags}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 