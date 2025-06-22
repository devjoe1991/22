import CharacterCard from '@/components/characters/character-card';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { createCharacter } from '@/components/characters/actions';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { cookies } from 'next/headers';

export default async function CharactersPage() {
  const supabase = createClient();
  const cookieStore = cookies();
  const { data: characters } = await supabase.from('characters').select('*');

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full max-w-screen-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Characters</h1>
        <RoleGuard allowedRoles={['admin', 'editor']}>
          <form action={createCharacter}>
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Character
            </Button>
          </form>
        </RoleGuard>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {characters?.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
} 