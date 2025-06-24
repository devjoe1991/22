import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createCharacter } from '@/app/actions/character-actions';
import { PlusCircle } from 'lucide-react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { FilterControls } from '@/components/directory/FilterControls';
import { Tables } from '@/lib/types/supabase';

// Page component now accepts searchParams
export default async function CharactersPage({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    status?: string;
    cosmetic?: string;
  };
}) {
  const supabase = createClient();

  const searchQuery = searchParams?.search || '';
  const statusFilter = searchParams?.status || '';
  const cosmeticFilter = searchParams?.cosmetic || '';

  // Start building the Supabase query
  let query = supabase
    .from('characters')
    .select('*');

  // Apply text search filter if a query exists
  // We use `or` to search in both name and description fields
  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }

  // Apply status filter if a status is selected
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  // Apply cosmetic tag filter if one is selected
  if (cosmeticFilter) {
    // This query finds characters where the 'tags'->'cosmetic' array contains the filter value.
    query = query.filter('tags', 'cs', `{"cosmetic": ["${cosmeticFilter}"]}`);
  }
  
  // Order by creation date
  query = query.order('created_at', { ascending: false });

  // Execute the final query
  const { data: characters } = await query;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
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

      {/* Add the FilterControls component here */}
      <FilterControls />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {characters?.map((character: Tables<'characters'>) => (
          <Link href={`/characters/${character.id}`} key={character.id}>
            <Card className="hover:shadow-md transition-shadow">
              {/* You can add a thumbnail image here later using character.thumbnail_url */}
              <CardHeader>
                <CardTitle>{character.name}</CardTitle>
                <CardDescription className="capitalize">
                  {character.status?.replace('-', ' ')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 