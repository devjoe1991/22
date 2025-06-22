import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AssetGallery from '@/components/characters/asset-gallery';
import CommentSection from '@/components/characters/comment-section';
import ActivityFeed from '@/components/characters/activity-feed';
import TiptapEditor from '@/components/editor/tiptap-editor';
import { saveCharacterStory } from '@/components/characters/actions';

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
      <div className="lg:col-span-1">
        <ActivityFeed initialLogs={auditLogs as any || []} />
      </div>
    </div>
  );
} 