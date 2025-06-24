import AuthButton from '@/components/auth/auth-button';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { UserProvider } from '@/lib/hooks/useUser';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
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