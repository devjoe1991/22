import { createClient } from '@/lib/supabase/server';
import AuthButton from '@/components/auth/auth-button';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { UserProvider } from '@/lib/hooks/useUser';

export default async function AppLayout({ children }: { children: React.ReactNode }) {

  const supabase = createClient();

  // Use Promise.all to fetch all counts concurrently for performance
  const [
    { count: charactersCount },
    { count: scenesCount },
    { count: chaptersCount },
  ] = await Promise.all([
    supabase.from('characters').select('*', { count: 'exact', head: true }),
    supabase.from('scenes').select('*', { count: 'exact', head: true }),
    supabase.from('chapters').select('*', { count: 'exact', head: true }),
  ]);

  // Create a clean object to pass down as props
  const itemCounts = {
    characters: charactersCount,
    scenes: scenesCount,
    chapters: chaptersCount,
  };

  return (
    <UserProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar counts={itemCounts} />
        <div className="flex-1 flex flex-col">
          <Header authButton={<AuthButton />} />
          <main className="flex-1 w-full max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
} 