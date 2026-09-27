'use client';
import { getRoleHome } from '@/lib/auth/roleHome';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { BrandLoader } from '@/components/ui/BrandLoader';
import type { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
  /** Optional replacement for the branded screen while the session resolves. */
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, requiredRole, redirectTo = '/login', fallback }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(`${redirectTo}?next=${encodeURIComponent(window.location.pathname)}`);
      } else if (requiredRole && user?.role !== requiredRole) {
        router.push(getRoleHome(user?.role));
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, redirectTo, router]);
  if (isLoading) return <>{fallback ?? <BrandLoader />}</>;
  if (!isAuthenticated) return null;
  if (requiredRole && user?.role !== requiredRole) return null;
  return <>{children}</>;
}
