'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Bell, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { generateInitials } from '@/lib/utils';
import { LogoutConfirmDialog } from '@/components/auth/LogoutConfirmDialog';

export function AdminTopbar() {
  const { logout } = useAuth();
  const user = useAuthStore((s) => s.user);
  const { sidebarOpen } = useUIStore();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  return (
    <header className="fixed top-0 right-0 z-20 h-16 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur flex items-center px-4 gap-4 transition-all duration-300" style={{ left: sidebarOpen ? '15rem' : '4rem' }}>
      <div className="flex-1" />
      <ThemeSwitcher />
      <Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="h-4 w-4" /></Button>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{generateInitials(user.fullName ?? user.email ?? 'A')}</AvatarFallback></Avatar>
              <span className="hidden sm:block text-sm font-medium">{user.fullName ?? user.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel><div><p className="font-medium">{user.fullName ?? user.email}</p><p className="text-xs text-[var(--color-muted-foreground)] truncate">{user.email}</p></div></DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[var(--color-destructive)] focus:text-[var(--color-destructive)]" onClick={() => setLogoutDialogOpen(true)}><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={() => logout()}
      />
    </header>
  );
}
