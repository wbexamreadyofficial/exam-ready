'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileUp, History, BookOpen, LayoutGrid,
  Library, FileText, ListChecks, HelpCircle, Bell, Users,
  ChevronLeft, ChevronRight, ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoIcon } from '@/components/ui/Logo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { adminNavGroups, activeNavHref } from '@/lib/admin/nav';
import { useAdminT } from '@/lib/admin/i18n';
import { useUnreadCount } from '@/hooks/useNotifications';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, FileUp, History, BookOpen, LayoutGrid,
  Library, FileText, ListChecks, HelpCircle, Bell, Users,
};

interface AdminSidebarProps {
  /** Desktop rail state. Ignored on mobile, where the sidebar is a full drawer. */
  isCollapsed: boolean;
  onToggle: () => void;
  /** Closes the mobile drawer after a navigation. */
  onClose?: () => void;
}

export function AdminSidebar({ isCollapsed, onToggle, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { t } = useAdminT();
  const active = activeNavHref(pathname);
  const { data: unreadCount = 0 } = useUnreadCount();

  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col border-r border-[var(--color-hairline)]',
        'bg-[var(--color-sidebar-background,var(--color-card))] transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[72px]' : 'w-[264px]'
      )}
    >
      {/* Header — logo + desktop collapse toggle */}
      <div className="flex h-14 shrink-0 items-center justify-between gap-1.5 border-b border-[var(--color-hairline)] px-3">
        <Link href="/admin" onClick={onClose} className="flex min-w-0 items-center gap-2 overflow-hidden">
          <LogoIcon className="h-8 w-8 shrink-0" />
          {!isCollapsed && (
            <span className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-[15px] font-black tracking-tight">
                <span className="bg-gradient-to-r from-[#0052FF] to-[#0088FF] bg-clip-text text-transparent">Exam</span>
                <span className="bg-gradient-to-r from-[#F97316] to-[#EA580C] bg-clip-text text-transparent">Ready</span>
              </span>
              <span className="mt-1 truncate text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                {t.brand}
              </span>
            </span>
          )}
        </Link>

        {!isCollapsed && (
          <button
            onClick={onToggle}
            aria-label="Collapse sidebar"
            className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--color-hairline)] text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] lg:flex"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {isCollapsed && (
        <button
          onClick={onToggle}
          aria-label="Expand sidebar"
          className="mx-auto mt-2 hidden h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--color-hairline)] text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] lg:flex"
        >
          <ChevronRight size={14} />
        </button>
      )}

      {/* Nav */}
      <nav data-lenis-prevent className="flex flex-1 flex-col gap-5 overflow-y-auto py-4">
        <TooltipProvider delayDuration={0}>
          {adminNavGroups.map((group) => (
            <div key={group.titleKey} className="px-3">
              {!isCollapsed && (
                <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                  {t.nav[group.titleKey]}
                </div>
              )}

              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const Icon = iconMap[item.icon] ?? FileText;
                  const isActive = active === item.href;

                  const link = (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'relative flex items-center gap-3 rounded-md px-3 py-2 text-[13.5px] transition-colors',
                        isActive
                          ? 'bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-semibold text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/20'
                          : item.highlight
                            ? 'font-semibold text-[var(--color-accent)] hover:bg-[var(--color-borange-50)] dark:hover:bg-[var(--color-borange-500)]/10'
                            : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]',
                        isCollapsed && 'mx-auto h-9 w-9 justify-center px-0'
                      )}
                    >
                      <Icon size={18} className="shrink-0" />
                      {!isCollapsed && <span className="truncate">{t.nav[item.labelKey]}</span>}
                      {item.href === '/admin/notifications' && unreadCount > 0 && (
                        <span className={cn(
                          'ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-cta)] px-1.5 text-[10px] font-bold leading-none text-white',
                          isCollapsed && 'absolute right-1 top-1 h-2.5 min-w-0 w-2.5 px-0 text-[0px]'
                        )}>
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                      {isActive && isCollapsed && (
                        <span className="absolute left-0 h-5 w-1 rounded-r-md bg-[var(--color-primary)]" />
                      )}
                    </Link>
                  );

                  if (!isCollapsed) return <React.Fragment key={item.href}>{link}</React.Fragment>;

                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{t.nav[item.labelKey]}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
        </TooltipProvider>
      </nav>

      {/* Footer — escape hatch back to the public site */}
      <div className="shrink-0 border-t border-[var(--color-hairline)] p-3">
        <Link
          href="/"
          onClick={onClose}
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-[13px] text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]',
            isCollapsed && 'mx-auto h-9 w-9 justify-center px-0'
          )}
        >
          <ArrowLeft size={16} className="shrink-0" />
          {!isCollapsed && <span className="truncate">{t.backToSite}</span>}
        </Link>
      </div>
    </div>
  );
}
