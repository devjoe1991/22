'use client';

import { useUser } from '@/lib/hooks/useUser';
import { redirect } from 'next/navigation';

type Role = 'admin' | 'editor' | 'viewer' | 'moderator';

type RoleGuardProps = {
  allowedRoles: Role[];
  children: React.ReactNode;
  redirect?: boolean;
  redirectPath?: string;
};

export function RoleGuard({ allowedRoles, children, redirect: shouldRedirect = false, redirectPath = '/dashboard' }: RoleGuardProps) {
  const { profile, isLoading } = useUser();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  const hasPermission = profile && allowedRoles.includes(profile.role as Role);

  if (!hasPermission) {
    if (shouldRedirect) {
      redirect(redirectPath);
    }
    return null;
  }

  return <>{children}</>;
} 