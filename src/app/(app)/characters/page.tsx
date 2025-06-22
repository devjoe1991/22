import CharacterCard from '@/components/characters/character-card';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default async function CharactersPage() {
  const supabase = createClient();
  const { data: characters } = await supabase.from('characters').select('*');

  return (
    <div>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold">Characters</h1>
        <Link href="/characters/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Character
          </Button>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {characters?.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
} 