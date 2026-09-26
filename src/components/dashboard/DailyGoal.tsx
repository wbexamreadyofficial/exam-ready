'use client';

import * as React from 'react';
import { Gift, PartyPopper } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';

export default function DailyGoal() {
  const { data, isLoading } = useStudentDashboard();

  if (isLoading || !data) {
    return (
      <Card className="surface-card">
        <CardContent className="p-4 space-y-2.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  const { completed, target } = data.dailyGoal;
  const done = completed >= target;
  const percentage = Math.min(100, (completed / target) * 100);

  return (
    <Card className="surface-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-[var(--color-ink-900)]">Daily Goal</span>
          {done && <span className="text-xs font-semibold text-[var(--color-data-positive)]">Goal reached</span>}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <div className="bg-[var(--color-bgreen-50)] dark:bg-green-900/20 rounded-lg p-2 text-[var(--color-data-positive)]">
            {done ? <PartyPopper className="h-7 w-7" /> : <Gift className="h-7 w-7" />}
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tabular leading-none text-[var(--color-ink-900)]">
              {completed}/{target}
            </span>
            <span className="text-xs text-[var(--color-muted-foreground)]">{done ? 'tests done today' : `test${target === 1 ? '' : 's'} today`}</span>
          </div>
        </div>

        <Progress value={percentage} className="mt-2.5 h-1.5 [&>div]:bg-[var(--color-data-positive)]" />
      </CardContent>
    </Card>
  );
}
