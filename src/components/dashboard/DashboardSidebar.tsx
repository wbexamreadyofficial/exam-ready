'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { sidebarNavGroups } from '@/lib/dashboard/mockData';
import { 
  FileText, Database, History, Bookmark, StickyNote, 
  FunctionSquareIcon, LayoutDashboard, TrendingUp, Medal, 
  User, Settings, HelpCircle, Crown, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const iconMap: Record<string, React.ElementType> = { 
  FileText, Database, History, Bookmark, StickyNote, 
  FunctionSquare: FunctionSquareIcon, LayoutDashboard, TrendingUp, Medal, 
  User, Settings, HelpCircle 
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
      "flex flex-col h-full bg-[var(--color-sidebar-background,var(--color-surface))] text-[var(--color-sidebar-foreground,var(--color-ink-900))] border-r border-[var(--color-hairline)] transition-all duration-300 ease-in-out relative",
      isCollapsed ? "w-[72px]" : "w-[272px]"
    )}>
      {/* Top: Logo */}
      <div className="h-16 flex items-center justify-center border-b border-[var(--color-hairline)] shrink-0">
        <Link href="/" className="flex items-center gap-2 overflow-hidden" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-xl shrink-0">
            ER
          </div>
          {!isCollapsed && <span className="font-display font-bold text-xl whitespace-nowrap">ExamReady</span>}
        </Link>
      </div>

      {/* Toggle button */}
      <button 
        onClick={onToggle}
        className="absolute -right-3 top-20 hidden lg:flex w-6 h-6 rounded-full bg-[var(--color-surface)] border border-[var(--color-hairline)] items-center justify-center z-10 hover:bg-[var(--color-surface-muted)] text-[var(--color-muted-foreground)]"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto py-4 dashboard-scrollbar flex flex-col gap-6">
        <TooltipProvider delayDuration={0}>
          {sidebarNavGroups?.map((group, idx) => (
            <div key={idx} className="px-3">
              {!isCollapsed && (
                <div className="px-3 mb-2 text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  {group.title}
                </div>
              )}
              <div className="flex flex-col gap-1">
                {group.items.map((item, itemIdx) => {
                  const Icon = iconMap[item.icon] || FileText;
                  const isActive = pathname === item.href;
                  
                  const navItem = (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative",
                        isActive 
                          ? "bg-[var(--color-bblue-50)] dark:bg-[var(--color-bblue-700)]/10 text-[var(--color-data-primary)] font-medium border-l-3 border-[var(--color-data-primary)]" 
                          : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink-900)]",
                        isCollapsed ? "justify-center border-l-0 px-0 h-10 w-10 mx-auto" : ""
                      )}
                    >
                      <Icon size={20} className="shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                      {isActive && isCollapsed && (
                        <div className="absolute left-0 w-1 h-5 bg-[var(--color-data-primary)] rounded-r-md" />
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
      <div className="p-4 border-t border-[var(--color-hairline)] shrink-0">
        {isCollapsed ? (
          <div className="w-10 h-10 mx-auto rounded-full bg-[var(--color-borange-50)] dark:bg-[var(--color-borange-500)]/10 flex items-center justify-center relative tooltip-trigger cursor-pointer">
            <Crown size={20} className="text-[var(--color-data-premium)]" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[var(--color-data-premium)] rounded-full border-2 border-[var(--color-surface)]" />
          </div>
        ) : (
          <div className="rounded-xl bg-gradient-to-br from-[var(--color-borange-50)] to-[var(--color-surface)] border border-[var(--color-hairline)] p-4 relative overflow-hidden card-premium">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Crown size={64} />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Crown size={16} className="text-[var(--color-data-premium)]" />
              <span className="font-semibold text-sm">Go Premium</span>
            </div>
            <p className="text-xs text-[var(--color-muted-foreground)] mb-3">Unlock all tests & analytics</p>
            <button className="w-full bg-[var(--color-cta)] text-[var(--color-cta-foreground)] hover:bg-[var(--color-cta-hover)] text-xs font-semibold py-1.5 rounded-md transition-colors shadow-cta">
              Upgrade Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
