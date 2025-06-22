// src/app/(auth)/layout.tsx
// This is the layout for the login and signup pages.
// It's simple because these pages don't need the main sidebar or header.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  );
} 