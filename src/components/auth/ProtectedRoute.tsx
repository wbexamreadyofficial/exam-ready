'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/ui/spinner';
import type { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export function ProtectedRoute({ children, requiredRole, redirectTo = '/login' }: ProtectedRouteProps) {
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
  if (isLoading) return (<div className="flex min-h-screen items-center justify-center"><div className="flex flex-col items-center gap-4"><Spinner size="xl" /><p className="text-sm text-[var(--color-muted-foreground)]">Loading...</p></div></div>);
  if (!isAuthenticated) return null;
  if (requiredRole && user?.role !== requiredRole) return null;
  return <>{children}</>;
}
