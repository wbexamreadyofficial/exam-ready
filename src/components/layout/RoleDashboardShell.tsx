'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuth } from '@/hooks/useAuth';
import { LogoutConfirmDialog } from '@/components/auth/LogoutConfirmDialog';

interface RoleDashboardShellProps {
  roleLabel: string;
  roleBadgeColor: string;
  children: React.ReactNode;
}

/**
 * A lighter dashboard chrome (topbar + centered content) for roles that
 * don't need the student dashboard's exam-focused sidebar or the admin
 * panel's full nav tree — just a clean, branded home base.
 */
export function RoleDashboardShell({ roleLabel, roleBadgeColor, children }: RoleDashboardShellProps) {
  const { user, logout } = useAuth();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFBFD] dark:bg-slate-950">
      <header className="sticky top-0 z-40 border-b hairline dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/">
            <Logo size="sm" showTagline={false} href="" />
          </Link>

          <div className="flex items-center gap-3">
            <span
              className="hidden sm:inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ring-1"
              style={{ background: `${roleBadgeColor}14`, color: roleBadgeColor, boxShadow: `inset 0 0 0 1px ${roleBadgeColor}30` }}
            >
              {roleLabel}
            </span>
            <ThemeSwitcher />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Log out"
              onClick={() => setLogoutDialogOpen(true)}
              className="text-ink-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </Button>
          </div>
        </div>
      </header>

      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={() => logout()}
      />

      <main className="container py-8 sm:py-10">
        <div className="mb-8">
          <h1 className="display-section text-[1.625rem] sm:text-[1.875rem] dark:text-white">
            Welcome{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}
          </h1>
          <p className="lede text-[14.5px] mt-1.5 dark:text-slate-400">
            {user?.mobileNumber ? `+91 ${user.mobileNumber}` : user?.email}
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}
