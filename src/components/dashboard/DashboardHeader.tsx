'use client';

import { NotificationBell } from '@/components/layout/NotificationBell';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, Flame, Menu, Sparkles, User as UserIcon, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/lib/api/users';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { LogoutConfirmDialog } from '@/components/auth/LogoutConfirmDialog';
import type { UserRole } from '@/types/auth';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Admin',
  student: 'Student',
  examiner: 'Examiner',
  partner: 'Partner',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { data: dashboard } = useStudentDashboard();
  const streak = dashboard?.streak.count ?? 0;
  const router = useRouter();
  const { user, logout } = useAuth();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Shares the ['profile'] cache with the profile page — usually already
  // populated, so this is a no-op fetch on most navigations. AuthUser (from
  // the auth store) doesn't carry `profilePhoto`, only the fuller /users/me
  // response does.
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: usersApi.getMe,
    enabled: !!user,
    staleTime: 60_000,
  });

  const displayName = user?.fullName || user?.email || user?.mobileNumber || 'Account';
  const initials = getInitials(user?.fullName || displayName);
  const avatarUrl = profile?.profilePhoto;

  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between px-4 sm:px-6 bg-[var(--color-surface)] border-b border-[var(--color-hairline)] shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface-muted)] rounded-md"
        >
          <Menu size={20} />
        </button>
        
        <div className="relative max-w-md w-full hidden lg:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-[var(--color-muted-foreground)]" />
          </div>
          <input 
            type="text" 
            placeholder="Search tests, topics..." 
            className="w-full bg-[var(--color-surface-muted)] text-sm rounded-lg border border-[var(--color-hairline)] pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 ml-4">
        <Button 
          variant="default" 
          size="sm" 
          className="hidden sm:flex bg-[var(--color-cta)] text-[var(--color-cta-foreground)] hover:bg-[var(--color-cta-hover)] btn-premium gap-1.5 h-7 text-[11px]"
        >
          <Sparkles size={14} />
          <span>Upgrade</span>
        </Button>

        <div className="inline-flex items-center gap-1.5 bg-[var(--color-borange-50)] dark:bg-[var(--color-borange-500)]/10 rounded-full px-3 py-1 text-xs font-semibold text-[var(--color-data-premium)]">
          <Flame size={14} className="fill-current" />
          <span>{streak}</span>
          <span className="hidden sm:inline">Day Streak</span>
        </div>

        <ThemeSwitcher />

        <NotificationBell viewAllHref="/student/notifications" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none ml-1">
              <Avatar className="h-8 w-8 border border-[var(--color-hairline)]">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                <AvatarFallback className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:flex flex-col items-start leading-tight max-w-[120px]">
                <span className="text-sm font-medium truncate w-full">{displayName}</span>
                {user?.role && (
                  <span className="text-[10.5px] font-semibold text-[var(--color-primary)] uppercase tracking-wide">
                    {ROLE_LABEL[user.role]}
                  </span>
                )}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="truncate">{displayName}</span>
              {user?.role && (
                <span className="text-[11px] font-normal text-[var(--color-muted-foreground)] uppercase tracking-wide">
                  {ROLE_LABEL[user.role]} account
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={() => router.push('/student/profile')}>
              <UserIcon size={16} className="text-[var(--color-muted-foreground)]" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2 text-[var(--color-data-negative)] focus:text-[var(--color-data-negative)] focus:bg-[var(--color-data-negative)]/10"
              onClick={() => setLogoutDialogOpen(true)}
            >
              <LogOut size={16} />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={() => logout()}
      />
    </header>
  );
}
