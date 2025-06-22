import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { TaggingForm } from '@/components/scenes/TaggingForm';

export default async function SceneDetailPage({ params }: { params: { id: string } }) {
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient();

    // Fetch scene details
    const { data: scene } = await supabase.from('scenes').select('*').eq('id', params.id).single();

    // Fetch characters linked to THIS scene
    const { data: linkedCharacters } = await supabase
        .from('character_scenes')
        .select('characters(*)')
        .eq('scene_id', params.id);

    // Fetch ALL characters to populate the dropdown
    const { data: allCharacters } = await supabase.from('characters').select('id, name');

    if (!scene) return <p>Scene not found.</p>;

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">{scene.name}</h1>
            <p>{scene.description || 'No description provided.'}</p>
            
            {/* Section for managing linked characters */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">Characters in this Scene</h2>
                <div className="p-4 border rounded-lg mb-4">
                    {linkedCharacters && linkedCharacters.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {linkedCharacters.map((link: any) => (
                                <li key={link.characters.id}>{link.characters.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No characters have been added to this scene yet.</p>
                    )}
                </div>
                <TaggingForm sceneId={scene.id} allCharacters={allCharacters || []} />
            </div>
        </div>
    );
} 