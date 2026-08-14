'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

const navItems = [
  { title: 'Home',            href: '/' },
  { title: 'Mock Tests',      href: '/exams' },
  { title: 'Courses',         href: '/quizzes' },
  { title: 'Study Materials', href: '/about' },
  { title: 'Results',         href: '/leaderboard' },
  { title: 'Pricing',         href: '/subscriptions' },
  { title: 'Blog',            href: '/contact' },
  { title: 'Contact',         href: '/contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container flex h-16 sm:h-20 items-center justify-between gap-4">

        {/* Logo */}
        <Logo href="/" size="md" showTagline={true} />

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  'px-2.5 xl:px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeSwitcher />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 h-10">
                  <Avatar className="h-8 w-8 border-2 border-blue-400">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs font-bold">
                      {user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-semibold max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {user.role === 'ADMIN' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4 text-blue-500" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="default"
                className="font-semibold text-sm text-slate-700 dark:text-slate-200 hover:text-blue-600"
                asChild
              >
                <Link href="/login">
                  <User className="h-4 w-4 mr-1" />
                  Login
                </Link>
              </Button>
              <Button
                size="default"
                asChild
                style={{ background: '#0b64f4' }}
                className="font-bold text-sm hover:opacity-90 text-white shadow-md shadow-blue-500/20 px-5 h-9 rounded-full border-none"
              >
                <Link href="/register">Sign Up Free</Link>
              </Button>
            </div>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 animate-fade-in">
          <nav className="flex flex-col gap-1 mb-4">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-4 py-2.5 rounded-lg text-base font-semibold transition-colors',
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600 dark:text-blue-400 dark:bg-blue-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          {!isAuthenticated && (
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" asChild className="w-full font-semibold">
                <Link href="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
              </Button>
              <Button
                asChild
                className="w-full font-bold bg-[#F59E0B] hover:bg-[#D97706] text-white border-none"
              >
                <Link href="/register" onClick={() => setMobileOpen(false)}>Sign Up Free</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
