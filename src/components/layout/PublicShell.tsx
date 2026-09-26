'use client';

import { useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/home/AnnouncementBar';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuthStore } from '@/store/authStore';

/** Public pages the student sidebar links to; a signed-in student sees them inside the dashboard shell. */
const SIDEBAR_PAGES = /^\/(quizzes|leaderboard)(\/|$)/;

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const role = useAuthStore((s) => s.user?.role);

  // The signed-in user only exists on the client; wait for mount so server and client markup match.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (mounted && role === 'student' && SIDEBAR_PAGES.test(pathname)) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return (
    <div className="flex min-h-screen flex-col relative">
      <div className="sticky top-0 z-50" data-public-header>
        <AnnouncementBar />
        <Navbar />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
