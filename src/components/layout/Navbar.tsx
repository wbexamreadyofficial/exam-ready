'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, GraduationCap, ClipboardCheck, Users, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from './ThemeSwitcher';
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

/** Self-serve signup roles — matches the backend's web signup role enum.
 *  "Admin" is deliberately not one of these (never self-serve, see the
 *  disabled menu item below); it's still shown so visitors see it exists. */
const SIGNUP_ROLES = [
  { value: 'student', label: 'Student', icon: GraduationCap },
  { value: 'examiner', label: 'Examiner', icon: ClipboardCheck },
  { value: 'partner', label: 'Partner', icon: Users },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        'relative z-40 w-full border-b dark:border-slate-800/80 bg-white/75 dark:bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/65 transition-all duration-300',
        scrolled ? 'border-slate-200/80 shadow-[0_1px_0_0_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.25)]' : 'border-transparent'
      )}
    >
      <div
        className={cn(
          'container flex items-center justify-between gap-4 transition-[height] duration-300',
          scrolled ? 'h-14' : 'h-16'
        )}
      >

        {/* Logo */}
        <Logo href="/" size="sm" showTagline={false} />

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-0.5 rounded-full border hairline dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  'relative px-3 xl:px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 whitespace-nowrap',
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm'
                    : 'text-ink-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-white/70 dark:hover:bg-slate-800/60'
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ThemeSwitcher />

          <div className="hidden md:flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="default"
              className="font-semibold text-[13px] text-ink-700 dark:text-slate-200 hover:text-blue-700 hover:bg-slate-100/70 dark:hover:bg-slate-800 h-9 px-3.5 rounded-full"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="default"
                  style={{
                    background: 'linear-gradient(135deg, #FF8A2B 0%, #FF700B 55%, #F05F00 100%)',
                    color: 'var(--color-cta-foreground)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 6px 16px -6px rgba(255,112,11,0.55)',
                  }}
                  className="btn-premium font-bold text-[13px] px-4 h-9 rounded-full border-none gap-1"
                >
                  Sign Up Free
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Sign up as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {SIGNUP_ROLES.map((role) => {
                  const Icon = role.icon;
                  return (
                    <DropdownMenuItem key={role.value} asChild className="cursor-pointer">
                      <Link href={`/register?role=${role.value}`} className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-ink-500 dark:text-slate-400" />
                        {role.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  <span className="flex-1">Admin</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-500 dark:text-slate-400">Invite only</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden h-9 w-9"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="xl:hidden border-t hairline dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pb-5 pt-3 animate-fade-in shadow-lg">
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
          <div className="flex flex-col gap-2.5 pt-4 border-t hairline dark:border-slate-800">
            <Button
              variant="outline"
              asChild
              className="w-full font-semibold h-12 rounded-xl border hairline text-ink-800 dark:border-slate-700 dark:text-slate-200"
            >
              <Link href="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
            </Button>
            <div className="space-y-1.5">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-ink-500 dark:text-slate-500">
                Sign up as
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {SIGNUP_ROLES.map((role) => {
                  const Icon = role.icon;
                  return (
                    <Link
                      key={role.value}
                      href={`/register?role=${role.value}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex flex-col items-center gap-1 rounded-xl border hairline dark:border-slate-700 py-3 text-ink-700 dark:text-slate-200 hover:border-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[12px] font-semibold">{role.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
