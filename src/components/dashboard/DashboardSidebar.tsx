'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { sidebarNavGroups } from '@/lib/dashboard/mockData';
import { 
  FileText, Database, History, Bookmark, StickyNote, 
  FunctionSquareIcon, LayoutDashboard, TrendingUp, Medal, 
  User, HelpCircle, Crown, ChevronLeft, ChevronRight, ListChecks, LayoutGrid
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LogoIcon } from '@/components/ui/Logo';

const iconMap: Record<string, React.ElementType> = { 
  FileText, Database, History, Bookmark, StickyNote, 
  FunctionSquare: FunctionSquareIcon, LayoutDashboard, TrendingUp, Medal, 
  User, HelpCircle, ListChecks, LayoutGrid
};

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onClose?: () => void;
}

export default function DashboardSidebar({ isCollapsed, onToggle, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "flex flex-col h-full min-h-0 bg-[var(--color-sidebar-background,var(--color-surface))] text-[var(--color-sidebar-foreground,var(--color-ink-900))] border-r border-[var(--color-hairline)] transition-all duration-300 ease-in-out relative",
      isCollapsed ? "w-[72px]" : "w-[272px]"
    )}>
      {/* Top: Logo + collapse toggle — kept inside the header row (not an
          absolutely-positioned circle straddling the border) so it's never
          clipped by an ancestor's overflow or the viewport edge. */}
      <div className="h-14 flex items-center justify-between gap-1.5 border-b border-[var(--color-hairline)] shrink-0 px-3">
        <Link href="/" className="flex items-center gap-2 overflow-hidden min-w-0" onClick={onClose}>
          <LogoIcon className="h-8 w-8 shrink-0" />
          {!isCollapsed && (
            <span className="font-black tracking-tight text-lg whitespace-nowrap">
              <span className="bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#0088FF] bg-clip-text text-transparent">Exam</span>
              <span className="bg-gradient-to-r from-[#F97316] to-[#EA580C] bg-clip-text text-transparent">Ready</span>
            </span>
          )}
        </Link>

        {!isCollapsed && (
          <button
            onClick={onToggle}
            aria-label="Collapse sidebar"
            className="hidden lg:flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--color-hairline)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink-900)] transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {isCollapsed && (
        <button
          onClick={onToggle}
          aria-label="Expand sidebar"
          className="hidden lg:flex mx-auto mt-2 h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--color-hairline)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink-900)] transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      )}

      {/* Nav groups */}
      <div data-lenis-prevent className="flex-1 overflow-y-auto py-3 dashboard-scrollbar flex flex-col gap-4">
        <TooltipProvider delayDuration={0}>
          {sidebarNavGroups?.map((group, idx) => (
            <div key={idx} className="px-3">
              {!isCollapsed && group.title && (
                <div className="px-3 mb-1.5 text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  {group.title}
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item, itemIdx) => {
                  const Icon = iconMap[item.icon] || FileText;
                  const isActive = pathname === item.href;
                  
                  const navItem = (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors relative text-[13.5px]",
                        isActive
                          ? "bg-gradient-to-r from-orange-100/90 to-orange-50/20 dark:from-orange-500/20 dark:to-orange-500/0 text-[#d4581a] dark:text-[#ff9147] font-semibold"
                          : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink-900)]",
                        isCollapsed ? "justify-center border-l-0 px-0 h-9 w-9 mx-auto" : ""
                      )}
                    >
                      <Icon size={18} className="shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                      {isActive && (
                        <span
                          aria-hidden
                          className={cn(
                            "absolute left-0 w-1 rounded-r-full bg-gradient-to-b from-[#ffb26b] via-[#f4802f] to-[#d4501a] shadow-[0_0_10px_rgba(244,128,47,0.7)]",
                            isCollapsed ? "h-5" : "top-1.5 bottom-1.5"
                          )}
                        />
                      )}
                    </Link>
                  );

                  if (isCollapsed) {
                    return (
                      <Tooltip key={itemIdx}>
                        <TooltipTrigger asChild>
                          {navItem}
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  
                  return navItem;
                })}
              </div>
            </div>
          ))}
        </TooltipProvider>
      </div>

      {/* Bottom: Promo */}
      <div className="p-3 border-t border-[var(--color-hairline)] shrink-0">
        {isCollapsed ? (
          <div className="w-9 h-9 mx-auto rounded-full bg-[var(--color-borange-50)] dark:bg-[var(--color-borange-500)]/10 flex items-center justify-center relative tooltip-trigger cursor-pointer">
            <Crown size={18} className="text-[var(--color-data-premium)]" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[var(--color-data-premium)] rounded-full border-2 border-[var(--color-surface)]" />
          </div>
        ) : (
          <div className="rounded-xl bg-gradient-to-br from-[var(--color-borange-50)] to-[var(--color-surface)] border border-[var(--color-hairline)] p-3 relative overflow-hidden card-premium">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Crown size={56} />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Crown size={15} className="text-[var(--color-data-premium)]" />
              <span className="font-semibold text-[13px]">Go Premium</span>
            </div>
            <p className="text-[11.5px] text-[var(--color-muted-foreground)] mb-2.5">Unlock all tests & analytics</p>
            <button className="w-full bg-[var(--color-cta)] text-[var(--color-cta-foreground)] hover:bg-[var(--color-cta-hover)] text-xs font-semibold py-1.5 rounded-md transition-colors shadow-cta">
              Upgrade Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
