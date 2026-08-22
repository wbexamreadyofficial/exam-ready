'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Search, Bell, Flame, Menu, Sparkles, User as UserIcon, Settings, LogOut } from 'lucide-react';
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

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 sm:px-6 bg-[var(--color-surface)] border-b border-[var(--color-hairline)] shrink-0">
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
          className="hidden sm:flex bg-[var(--color-cta)] text-[var(--color-cta-foreground)] hover:bg-[var(--color-cta-hover)] btn-premium gap-1.5 h-8"
        >
          <Sparkles size={14} />
          <span>Upgrade</span>
        </Button>

        <div className="inline-flex items-center gap-1.5 bg-[var(--color-borange-50)] dark:bg-[var(--color-borange-500)]/10 rounded-full px-3 py-1 text-xs font-semibold text-[var(--color-data-premium)]">
          <Flame size={14} className="fill-current" />
          <span>7</span>
          <span className="hidden sm:inline">Day Streak</span>
        </div>

        <div className="relative">
          <button className="p-2 text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface-muted)] rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="bg-[var(--color-data-negative)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center absolute -top-1 -right-1 border-2 border-[var(--color-surface)]">
              3
            </span>
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none ml-1">
              <Avatar className="h-8 w-8 border border-[var(--color-hairline)]">
                <AvatarFallback className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold">AS</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:block">Anindya</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
              <UserIcon size={16} className="text-[var(--color-muted-foreground)]" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
              <Settings size={16} className="text-[var(--color-muted-foreground)]" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-[var(--color-data-negative)] focus:text-[var(--color-data-negative)] focus:bg-[var(--color-data-negative)]/10">
              <LogOut size={16} />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
