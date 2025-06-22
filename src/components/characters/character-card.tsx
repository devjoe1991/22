import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database } from '@/lib/types/supabase';

// Define the type for a single character based on our generated types
type Character = Database['public']['Tables']['characters']['Row'];

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link href={`/characters/${character.id}`}>
      <Card className="hover:border-primary transition-colors">
        <CardHeader>
          <CardTitle>{character.name}</CardTitle>
          <CardDescription className="line-clamp-2">{character.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video relative bg-muted rounded-md overflow-hidden">
            <Image
              // Use a placeholder if no thumbnail is available
              src={character.thumbnail_url || 'https://placehold.co/600x400/18181b/ffffff?text=No+Image'}
              alt={`Image of ${character.name}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-xs text-muted-foreground mt-2">Status: {character.status}</div>
        </CardContent>
      </Card>
    </Link>
  );
} 