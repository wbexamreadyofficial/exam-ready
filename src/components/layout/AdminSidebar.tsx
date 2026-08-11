'use client';

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
  BookOpenCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

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
        <div className="flex h-16 items-center px-4 border-b border-[var(--color-sidebar-border)]">
          <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 min-w-[2rem] items-center justify-center rounded-lg bg-[var(--color-sidebar-primary)]">
              <BookOpenCheck className="h-4 w-4 text-[var(--color-sidebar-primary-foreground)]" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-sm whitespace-nowrap text-[var(--color-sidebar-foreground)]">
                Exam Ready
              </span>
            )}
          </Link>
        </div>

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

        {/* Collapse toggle */}
        <div className="p-2 border-t border-[var(--color-sidebar-border)]">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              'w-full text-[var(--color-sidebar-foreground)] hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-accent-foreground)]',
              sidebarOpen ? 'justify-start px-3' : 'justify-center'
            )}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform duration-300', !sidebarOpen && 'rotate-180')} />
            {sidebarOpen && <span className="ml-2 text-sm">Collapse</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
