'use client';

import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

/** Pages that bring their own dashboard shell (with their own right-hand panel). */
const OWN_SHELL = /^\/student\/(dashboard|profile)(\/|$)/;
/** The live test screens stay outside the sidebar so nothing competes with the exam. */
const LIVE_TEST = /^\/student\/(exam\/[^/]+|quiz\/[^/]+)\/?$/;

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';

  if (OWN_SHELL.test(pathname)) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
  }

  if (LIVE_TEST.test(pathname)) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col">
          <div className="sticky top-0 z-50">
            <Navbar />
          </div>
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
