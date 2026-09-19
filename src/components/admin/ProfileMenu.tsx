'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, LogOut, UserRound } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useAdminT } from '@/lib/admin/i18n';
import { useAdminProfile } from '@/hooks/useAdminProfile';
import { UserAvatar } from './UserAvatar';
import { ConfirmDialog } from './ConfirmDialog';

/** Avatar dropdown in the admin header: profile page and (confirmed) logout through the API. */
export function ProfileMenu() {
  const { t } = useAdminT();
  const { user, logout } = useAuth();
  const { photoUrl } = useAdminProfile();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  if (!user) return null;

  const name = user.fullName || 'Admin';

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={t.profile}
            className="group flex h-10 items-center gap-2 rounded-full border border-[var(--color-hairline)] bg-[var(--color-card)] py-1 pl-1 pr-2.5 shadow-sm transition-all hover:border-orange-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50 data-[state=open]:border-orange-300"
          >
            <UserAvatar name={name} src={photoUrl} className="h-8 w-8" fallbackClassName="text-xs" />
            <span className="hidden max-w-[120px] truncate text-[13px] font-semibold md:block">{name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[var(--color-muted-foreground)] transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={10} className="w-64 rounded-xl p-1.5 shadow-xl">
          <DropdownMenuLabel className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-orange-50 to-white p-3 dark:from-orange-500/10 dark:to-transparent">
            <UserAvatar name={name} src={photoUrl} className="h-10 w-10" fallbackClassName="text-sm" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-semibold normal-case">{name}</span>
              <span className="block truncate text-xs font-normal capitalize text-[var(--color-muted-foreground)]">
                {user.role}
                {user.mobileNumber ? ` · +91 ${user.mobileNumber}` : ''}
              </span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] focus:bg-orange-50 focus:text-[#c95817] dark:focus:bg-orange-500/10">
            <Link href="/admin/profile">
              <UserRound className="h-4 w-4" />
              {t.profile}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setConfirmOpen(true)}
            className="cursor-pointer gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            {t.logout}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => !loggingOut && setConfirmOpen(open)}
        title={t.logoutTitle}
        description={t.logoutDescription}
        confirmLabel={loggingOut ? t.loggingOut : t.logout}
        destructive
        pending={loggingOut}
        onConfirm={handleLogout}
      />
    </>
  );
}
