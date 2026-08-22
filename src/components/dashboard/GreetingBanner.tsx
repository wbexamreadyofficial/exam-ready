'use client';

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { BookOpen, GraduationCap, Sparkles } from 'lucide-react';

export default function GreetingBanner() {
  const user = useAuthStore((s) => s.user);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const name = user?.name?.split(' ')[0] ?? 'Candidate';

  return (
    <div className="surface-card overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bblue-50)] via-transparent to-[var(--color-bblue-50)] dark:from-[var(--color-bblue-700)]/10 dark:via-transparent dark:to-[var(--color-bblue-700)]/5 pointer-events-none" />
      <div className="relative flex items-center justify-between p-6">
        {/* Left: text */}
        <div className="min-w-0">
          <h2 className="display-card text-xl sm:text-2xl">
            {greeting}, {name}! 👋
          </h2>
          <p className="lede text-sm mt-1.5 max-w-md">
            You&apos;ve made great progress this week. Keep up the momentum!
          </p>
        </div>

        {/* Right: decorative illustration */}
        <div className="hidden sm:flex items-end gap-2 opacity-80" aria-hidden="true">
          <div className="relative">
            {/* Desk */}
            <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Desk surface */}
              <rect x="10" y="65" width="120" height="6" rx="3" fill="var(--color-bblue-500)" opacity="0.15" />
              {/* Desk legs */}
              <rect x="20" y="71" width="4" height="24" rx="2" fill="var(--color-bblue-500)" opacity="0.1" />
              <rect x="116" y="71" width="4" height="24" rx="2" fill="var(--color-bblue-500)" opacity="0.1" />
              {/* Book stack */}
              <rect x="25" y="50" width="28" height="15" rx="2" fill="var(--color-series-1)" opacity="0.3" />
              <rect x="28" y="45" width="24" height="6" rx="1.5" fill="var(--color-series-3)" opacity="0.3" />
              <rect x="30" y="40" width="20" height="6" rx="1.5" fill="var(--color-series-2)" opacity="0.3" />
              {/* Person head */}
              <circle cx="90" cy="20" r="12" fill="var(--color-bblue-500)" opacity="0.2" />
              {/* Person body */}
              <rect x="80" y="32" width="20" height="33" rx="6" fill="var(--color-bblue-500)" opacity="0.15" />
              {/* Laptop */}
              <rect x="65" y="52" width="30" height="13" rx="2" fill="var(--color-series-1)" opacity="0.25" />
              <rect x="62" y="52" width="36" height="3" rx="1" fill="var(--color-series-1)" opacity="0.2" transform="rotate(-10 62 52)" />
            </svg>
            <div className="absolute top-2 right-2 animate-float">
              <Sparkles className="w-4 h-4 text-[var(--color-data-premium)]" />
            </div>
          </div>
          <div className="flex flex-col gap-1 mb-3">
            <div className="icon-tile bg-[var(--color-bblue-50)] dark:bg-blue-900/20 w-8 h-8">
              <BookOpen className="w-4 h-4 text-[var(--color-data-primary)]" />
            </div>
            <div className="icon-tile bg-[var(--color-bgreen-50)] dark:bg-green-900/20 w-8 h-8">
              <GraduationCap className="w-4 h-4 text-[var(--color-data-positive)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
