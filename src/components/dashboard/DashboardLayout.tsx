'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

export default function DashboardLayout({ children, rightSidebar }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleMobile = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <div className="orange-theme fixed inset-0 z-50 flex overflow-hidden bg-[var(--color-surface-subtle)] text-[var(--color-ink-900)] font-sans">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={closeMobile} 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity" 
        />
      )}
      
      {/* Sidebar — fixed on desktop, drawer on mobile */}
      <aside className={cn(
        "fixed z-50 h-screen flex-shrink-0 transition-transform duration-300 ease-in-out bg-[var(--color-surface)]",
        "lg:relative lg:z-auto lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        sidebarCollapsed ? "w-[68px]" : "w-[224px]"
      )}>
        <DashboardSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={toggleSidebar} 
          onClose={closeMobile} 
        />
      </aside>
      
      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 min-h-0 overflow-hidden">
        <DashboardHeader onMenuClick={toggleMobile} />

        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          {/* Center content — scrollable. `data-lenis-prevent` opts this
              container out of the global Lenis smooth-scroll (see
              SmoothScrollProvider) so its native overflow scroll actually
              receives wheel/touch events instead of Lenis swallowing them
              while looking for document-level scroll to drive. */}
          <main data-lenis-prevent className="flex-1 overflow-y-auto p-4 sm:p-6 dashboard-scrollbar bg-[var(--color-surface-subtle)]">
            {/* Pages with a right sidebar (e.g. the analytics dashboard) keep
                a centered 7xl column since that sidebar already uses the
                remaining width. Pages without one (e.g. profile) would
                otherwise get large, wasted left/right gutters on wide
                screens from this centering alone — so they just fill the
                available width instead. */}
            <div className={cn('mx-auto w-full', rightSidebar && 'max-w-7xl')}>
              {children}
            </div>
          </main>

          {/* Right sidebar — visible on xl */}
          {rightSidebar && (
            <aside data-lenis-prevent className="hidden xl:block w-[340px] flex-shrink-0 overflow-y-auto p-6 pt-0 border-l border-[var(--color-hairline)] dashboard-scrollbar bg-[var(--color-surface)]">
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
