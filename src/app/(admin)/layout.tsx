'use client';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { AdminLayoutSkeleton } from '@/components/ui/page-skeletons';
import { NotificationProvider } from '@/providers/NotificationProvider';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
function AdminShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <AdminSidebar />
      <AdminTopbar />
      <div className={cn('transition-all duration-300 pt-16', sidebarOpen ? 'lg:ml-60' : 'lg:ml-16')}>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin" redirectTo="/login" fallback={<AdminLayoutSkeleton />}>
      <NotificationProvider>
        <AdminShell>{children}</AdminShell>
      </NotificationProvider>
    </ProtectedRoute>
  );
}
