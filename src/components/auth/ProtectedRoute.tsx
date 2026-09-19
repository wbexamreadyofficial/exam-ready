'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AppLayoutSkeleton } from '@/components/ui/page-skeletons';
import type { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
  /** Shown while the session resolves; should mirror the layout being protected. */
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
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, redirectTo, router]);
  if (isLoading) return <>{fallback ?? <AppLayoutSkeleton />}</>;
  if (!isAuthenticated) return null;
  if (requiredRole && user?.role !== requiredRole) return null;
  return <>{children}</>;
}
