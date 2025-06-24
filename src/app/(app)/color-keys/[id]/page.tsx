import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Film, BookOpen } from "lucide-react";

type Entity = {
    id: string;
    name: string;
}

async function fetchLinkedEntities(supabase: any, keyId: string, entityType: 'character' | 'scene' | 'chapter'): Promise<Entity[]> {
    const table = `${entityType}s`;
    const { data: entityLinks } = await supabase
        .from('entity_color_keys')
        .select('entity_id')
        .eq('key_id', keyId)
        .eq('entity_type', entityType);
    
    if (!entityLinks || entityLinks.length === 0) return [];

    const entityIds = entityLinks.map((link: any) => link.entity_id);
    const { data: entities } = await supabase
        .from(table)
        .select('id, name')
        .in('id', entityIds);
    
    return entities || [];
}

export default async function ColorKeyDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient();

    const { data: colorKey } = await (supabase as any)
        .from('color_keys')
        .select('*')
        .eq('id', params.id)
        .single();
    
    if (!colorKey) notFound();

    const [characters, scenes, chapters] = await Promise.all([
        fetchLinkedEntities(supabase, params.id, 'character'),
        fetchLinkedEntities(supabase, params.id, 'scene'),
        fetchLinkedEntities(supabase, params.id, 'chapter'),
    ]);

    const entitySections = [
        { title: "Characters", icon: <User className="h-5 w-5" />, items: characters, type: 'characters' },
        { title: "Scenes", icon: <Film className="h-5 w-5" />, items: scenes, type: 'scenes' },
        { title: "Chapters", icon: <BookOpen className="h-5 w-5" />, items: chapters, type: 'chapters' },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg border-4" style={{ backgroundColor: colorKey.color, borderColor: `${colorKey.color}40`}}></div>
                <div>
                    <h1 className="text-4xl font-bold">{colorKey.name}</h1>
                    <p className="text-lg text-muted-foreground">{colorKey.description || 'No description for this key.'}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {entitySections.map(section => (
                    <Card key={section.title}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                {section.icon}
                                <span>{section.title} with this Key</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {section.items.length > 0 ? (
                                <div className="space-y-2">
                                    {section.items.map(item => (
                                        <Link key={item.id} href={`/${section.type}/${item.id}`} className="block p-3 border rounded-md hover:bg-muted transition-colors">
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No {section.title.toLowerCase()} are linked to this key yet.</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 