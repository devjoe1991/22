'use client';

import { useUser } from '@/lib/hooks/useUser';

type Role = 'admin' | 'editor' | 'viewer' | 'moderator';

type RoleGuardProps = {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode; // Optional: content to show if role doesn't match
};

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { profile } = useUser();

  if (!profile || !allowedRoles.includes(profile.role as Role)) {
    return fallback;
  }

  return <>{children}</>;
} 