'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  HelpCircle,
  BookOpen,
  BarChart3,
  CreditCard,
  TrendingUp,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { LogoIcon } from '@/components/ui/Logo';
import { LogoutConfirmDialog } from '@/components/auth/LogoutConfirmDialog';

const navItems = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { title: 'Users', href: '/admin/users', icon: Users },
  { title: 'Exams', href: '/admin/exams', icon: FileText },
  { title: 'Questions', href: '/admin/questions', icon: HelpCircle },
  { title: 'Subjects', href: '/admin/subjects', icon: BookOpen },
  { title: 'Results', href: '/admin/results', icon: BarChart3 },
  { title: 'Payments', href: '/admin/payments', icon: CreditCard },
  { title: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
  { title: 'Content', href: '/admin/content', icon: FolderOpen },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { logout } = useAuth();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-30 h-full bg-[var(--color-sidebar-background)] text-[var(--color-sidebar-foreground)] border-r border-[var(--color-sidebar-border)] transition-all duration-300 ease-in-out flex flex-col',
          sidebarOpen ? 'w-60' : 'w-16'
        )}
        aria-label="Admin sidebar"
      >
        {/* Logo area */}
        <div className="flex h-16 items-center justify-between gap-1.5 px-4 border-b border-[var(--color-sidebar-border)]">
          <Link href="/admin" className="flex items-center gap-2 overflow-hidden min-w-0">
            <LogoIcon className="h-8 w-8 shrink-0" />
            {sidebarOpen && (
              <span className="font-black tracking-tight text-lg whitespace-nowrap">
                <span className="bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#0088FF] bg-clip-text text-transparent">Exam</span>
                <span className="bg-gradient-to-r from-[#F97316] to-[#EA580C] bg-clip-text text-transparent">Ready</span>
              </span>
            )}
          </Link>

          {sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
              className="h-7 w-7 shrink-0 text-[var(--color-sidebar-foreground)] hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-accent-foreground)]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!sidebarOpen && (
          <div className="flex justify-center py-2 border-b border-[var(--color-sidebar-border)]">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              className="h-7 w-7 text-[var(--color-sidebar-foreground)] hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-accent-foreground)]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Nav items */}
        <ScrollArea className="flex-1 py-4">
          <nav className="flex flex-col gap-1 px-2" aria-label="Admin navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              const linkEl = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-[var(--color-sidebar-primary)] text-[var(--color-sidebar-primary-foreground)]'
                      : 'text-[var(--color-sidebar-foreground)] hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-accent-foreground)]'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {sidebarOpen && <span>{item.title}</span>}
                </Link>
              );

              if (!sidebarOpen) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                );
              }

              return linkEl;
            })}
          </nav>
        </ScrollArea>

        {/* Logout */}
        <div className="p-2 border-t border-[var(--color-sidebar-border)]">
          {sidebarOpen ? (
            <Button
              variant="ghost"
              onClick={() => setLogoutDialogOpen(true)}
              className="w-full justify-start px-3 text-red-500 hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2 text-sm">Log out</span>
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLogoutDialogOpen(true)}
                  aria-label="Log out"
                  className="w-full text-red-500 hover:bg-red-500/10 hover:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>

      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={() => logout()}
      />
    </TooltipProvider>
  );
}
