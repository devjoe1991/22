import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { UserProvider } from '@/lib/hooks/useUser';
import { GeistSans } from 'geist/font/sans';

const inter = Inter({ subsets: ['latin'] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'The Rebirth H22',
  description: 'A new beginning',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <UserProvider>
          <main className="min-h-screen flex flex-col items-center">
            {children}
          </main>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
} 