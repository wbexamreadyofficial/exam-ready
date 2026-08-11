import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { EXAM_CATEGORIES } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]">
                <BookOpen className="h-4 w-4 text-[var(--color-primary-foreground)]" />
              </div>
              <span className="font-extrabold text-base">Exam Ready</span>
            </Link>
            <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed max-w-[220px]">
              Prepare. Practice. Perform. Your trusted competitive examination preparation platform.
            </p>
          </div>

          {/* Exam Categories */}
          <div>
            <h3 className="text-sm font-bold mb-3">Exam Categories</h3>
            <ul className="space-y-2">
              {EXAM_CATEGORIES.map((exam) => (
                <li key={exam}>
                  <Link href="/exams" className="text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors">
                    {exam}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-bold mb-3">Platform</h3>
            <ul className="space-y-2">
              {[
                { title: 'About', href: '/about' },
                { title: 'Contact', href: '/contact' },
                { title: 'Quizzes', href: '/quizzes' },
                { title: 'Leaderboard', href: '/leaderboard' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-bold mb-3">Account</h3>
            <ul className="space-y-2">
              {[
                { title: 'Login', href: '/login' },
                { title: 'Register', href: '/register' },
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Results', href: '/results' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-muted-foreground)]">
            &copy; {new Date().getFullYear()} Exam Ready. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Prepare. Practice. Perform.
          </p>
        </div>
      </div>
    </footer>
  );
}
