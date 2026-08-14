'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, BookOpen, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
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
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/lib/i18n';
import { cn, generateInitials } from '@/lib/utils';
import { siteConfig } from '@/config/site';

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();

  const getNavTitle = (href: string, defaultTitle: string) => {
    switch (href) {
      case '/': return t.nav.home;
      case '/exams': return t.nav.exams;
      case '/quizzes': return t.nav.quizzes;
      case '/subscriptions': return t.nav.passPro;
      case '/about': return t.nav.about;
      case '/contact': return t.nav.contact;
      default: return defaultTitle;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/80 shadow-sm">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-bold group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <BookOpen className="h-5.5 w-5.5 text-white stroke-[2.5]" />
          </div>
          <span className="text-xl md:text-2xl font-black hidden sm:block tracking-tight">
            <span className="text-slate-900 dark:text-white">Exam</span>{' '}
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">Ready</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3" aria-label="Main navigation">
          {siteConfig.nav.map((item) => {
            const isActive = pathname === item.href;
            const isPassPro = item.href === '/subscriptions';

            if (isPassPro) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 hover:shadow-lg hover:scale-[1.03] transition-all flex items-center gap-1 border border-amber-300"
                >
                  {getNavTitle(item.href, item.title)}
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-base font-extrabold transition-all relative flex items-center gap-1.5',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-black bg-blue-500/10 dark:bg-blue-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                )}
              >
                {getNavTitle(item.href, item.title)}
                {item.href === '/exams' && (
                  <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse shadow-sm" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitcher />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 h-10">
                  <Avatar className="h-9 w-9 border-2 border-blue-400">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs font-bold">{generateInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-extrabold max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)] truncate">{user.email}</p>
                  </div>
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
                  className="text-[var(--color-destructive)] focus:text-[var(--color-destructive)]"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="default" className="font-extrabold text-sm text-slate-700 dark:text-slate-200" asChild>
                <Link href="/login">{t.nav.login}</Link>
              </Button>
              <Button size="default" asChild className="font-black text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 shadow-md shadow-amber-500/20 px-5 h-10 border-none">
                <Link href="/register">{t.nav.getStarted}</Link>
              </Button>
            </div>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-background)] p-4 animate-fade-in space-y-2">
          <nav className="flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-4 py-2.5 rounded-lg text-base font-bold transition-colors',
                  pathname === item.href
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold'
                    : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                )}
              >
                {getNavTitle(item.href, item.title)}
              </Link>
            ))}
          </nav>

          {!isAuthenticated && (
            <div className="pt-3 border-t border-[var(--color-border)] flex flex-col gap-2">
              <Button variant="outline" asChild className="w-full font-bold">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  Log in
                </Link>
              </Button>
              <Button asChild className="w-full font-black bg-amber-500 hover:bg-amber-600 text-slate-950">
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
