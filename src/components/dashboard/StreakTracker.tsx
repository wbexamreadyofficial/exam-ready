'use client';

import * as React from 'react';
import { Flame, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import { cn } from '@/lib/utils';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function StreakTracker() {
  const { data, isLoading } = useStudentDashboard();

  if (isLoading || !data) {
    return (
      <Card className="surface-card">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  const { count, days } = data.streak;

  return (
    <Card className="surface-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 dark:bg-orange-500/15 rounded-lg p-1.5">
            <Flame className="h-6 w-6 text-[#e2691f] drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tabular leading-none text-[var(--color-ink-900)]">{count}</span>
            <span className="text-xs text-[var(--color-muted-foreground)]">
              {count === 0 ? 'Start your streak today' : count === 1 ? 'Day Streak 🔥' : 'Day Streak 🔥'}
            </span>
          </div>
        </div>

        <div className="flex justify-between mt-3 gap-1">
          {days.map((day, i) => (
            <div key={day.day} className="flex flex-col items-center" title={day.day}>
              <span className="text-[10px] text-[var(--color-muted-foreground)] mb-1">{DAY_LABELS[i]}</span>
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full transition-colors',
                  day.status === 'completed' && 'bg-[var(--color-data-positive)] text-white',
                  day.status === 'today' && 'bg-[#e2691f] text-white relative',
                  (day.status === 'missed' || day.status === 'upcoming') && 'bg-[var(--color-surface-muted)] text-[var(--color-muted-foreground)]'
                )}
              >
                {day.status === 'completed' && <Check className="h-3 w-3" />}
                {day.status === 'today' && (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e2691f] opacity-30" />
                    <Flame className="h-3 w-3 relative z-10" />
                  </>
                )}
                {day.status === 'missed' && <span className="h-1 w-1 rounded-full bg-current opacity-40" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
