'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const user = useAuthStore((s) => s.user);

  /* Compact the header once the page has scrolled past the hero's top edge. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b dark:border-slate-800 bg-white/80 dark:bg-slate-950/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 transition-shadow duration-300',
        scrolled ? 'border-slate-200/90 shadow-sm' : 'border-transparent'
      )}
    >
      <div
        className={cn(
          'container flex items-center justify-between gap-4 transition-[height] duration-300',
          scrolled ? 'h-16 sm:h-[64px]' : 'h-16 sm:h-[72px]'
        )}
      >

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
                  'relative px-2.5 xl:px-3.5 py-2 rounded-lg text-[13.5px] font-semibold transition-colors duration-200 whitespace-nowrap',
                  isActive
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-ink-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400'
                )}
              >
                {item.title}
                {/* Active indicator — a precise underline rather than a filled pill */}
                {isActive && (
                  <span className="absolute left-2.5 right-2.5 xl:left-3.5 xl:right-3.5 -bottom-px h-[2.5px] rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
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
                className="font-semibold text-[13.5px] text-ink-700 dark:text-slate-200 hover:text-blue-700 hover:bg-slate-100/70 dark:hover:bg-slate-800 h-10 px-3.5 rounded-lg"
                asChild
              >
                <Link href="/login">
                  <User className="h-4 w-4 mr-1.5" />
                  Login
                </Link>
              </Button>
              <Button
                size="default"
                asChild
                style={{
                  background: '#FF700B',
                  color: 'var(--color-cta-foreground)',
                  boxShadow: 'var(--shadow-cta)',
                }}
                className="btn-premium font-bold text-[13.5px] px-5 h-10 rounded-lg border-none"
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
        <div className="lg:hidden border-t hairline dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pb-5 pt-3 animate-fade-in shadow-lg">
          <nav className="flex flex-col gap-0.5 mb-5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-semibold transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:text-blue-400 dark:bg-blue-500/10'
                      : 'text-ink-700 dark:text-slate-400 hover:text-ink-900 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  )}
                >
                  {item.title}
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                </Link>
              );
            })}
          </nav>
          {!isAuthenticated && (
            <div className="flex flex-col gap-2.5 pt-4 border-t hairline dark:border-slate-800">
              <Button
                variant="outline"
                asChild
                className="w-full font-semibold h-12 rounded-xl border hairline text-ink-800 dark:border-slate-700 dark:text-slate-200"
              >
                <Link href="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
              </Button>
              <Button
                asChild
                style={{ boxShadow: 'var(--shadow-cta)', color: 'var(--color-cta-foreground)' }}
                className="w-full font-bold h-12 rounded-xl bg-[#FF700B] hover:bg-[#E85F00] border-none"
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
