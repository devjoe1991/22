import AuthButton from '@/components/auth/auth-button';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { UserProvider } from '@/lib/hooks/useUser';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header authButton={<AuthButton />} />
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-screen-2xl mx-auto w-full bg-muted/40">
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
} 