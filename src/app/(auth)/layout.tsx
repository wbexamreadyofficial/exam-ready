'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  /*
    The Sign Up and Login pages own their full-bleed 45/55 compositions, so
    they opt out of this shell's centred `max-w-md` column. Every other auth
    route (forgot-password, reset-password, verify-email) keeps the original
    layout below, unchanged.
  */
  if (pathname === '/register' || pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-col bg-[hsl(222,84%,5%)] text-white p-8">
        <Link href="/" className="flex items-center gap-2 mb-auto">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)]">
            <BookOpen className="h-5 w-5 text-[hsl(222,84%,5%)]" />
          </div>
          <span className="text-lg font-bold">Exam Ready</span>
        </Link>

        <div className="my-auto">
          <blockquote className="space-y-4">
            <h1 className="text-3xl font-bold leading-tight">
              Your journey to{' '}
              <span className="text-[var(--color-primary)]">success</span>
              <br />
              starts here.
            </h1>
            <p className="text-white/70 text-lg">
              Join thousands of students preparing for WB Constable, WB SI, WB Food Inspector, WB Health, PSC Clerkship, PSC Miscellaneous, and Primary Teacher TET.
            </p>
          </blockquote>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { label: 'Students', value: '50,000+' },
              { label: 'Questions', value: '10,000+' },
              { label: 'Exams', value: '500+' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-bold text-[var(--color-primary)]">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-sm">
          &copy; {new Date().getFullYear()} Exam Ready. All rights reserved.
        </p>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4 lg:p-6">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]">
              <BookOpen className="h-4 w-4 text-[var(--color-primary-foreground)]" />
            </div>
            <span className="font-bold">Exam Ready</span>
          </Link>
          <div className="ml-auto">
            <ThemeSwitcher />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
