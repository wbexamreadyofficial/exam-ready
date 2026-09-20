'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { cn } from '@/lib/utils';
import { NotificationProvider } from '@/providers/NotificationProvider';

/**
 * Admin shell.
 *
 * NOTE: there is deliberately no auth guard here yet — the panel is reachable
 * by anyone who knows the URL, via the button on the home page. Before launch
 * this must be wrapped in `<ProtectedRoute requiredRole="admin">` again and
 * `/admin` restored to `ROLE_PREFIXES` in `src/proxy.ts`.
 *
 * Layout: below `lg` the sidebar is an overlay drawer; at `lg` and up it is a
 * fixed rail that collapses to icons.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer on navigation — otherwise it stays open over the new page.
  useEffect(() => setMobileOpen(false), [pathname]);

  // Lock body scroll while the drawer covers the page.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [mobileOpen]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <NotificationProvider>
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Desktop rail */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden lg:block no-print',
          collapsed ? 'w-[72px]' : 'w-[264px]'
        )}
      >
        <AdminSidebar isCollapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden no-print',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={cn(
            'absolute inset-0 bg-black/50 transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 w-[264px] shadow-xl transition-transform duration-300 ease-in-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <AdminSidebar isCollapsed={false} onToggle={() => {}} onClose={() => setMobileOpen(false)} />
        </div>
      </div>

      {/* Content column */}
      <div className={cn('transition-all duration-300 print-reset-layout', collapsed ? 'lg:ml-[72px]' : 'lg:ml-[264px]')}>
        <div className="no-print sticky top-0 z-30"><AdminTopbar onOpenMenu={() => setMobileOpen(true)} /></div>
        <main className="w-full p-4 sm:p-6 print-reset-layout">{children}</main>
      </div>
    </div>
    </NotificationProvider>
  );
}
