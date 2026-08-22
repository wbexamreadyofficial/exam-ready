'use client';

import * as React from 'react';
import { dailyGoal } from '@/lib/dashboard/mockData';
import { Gift, Pencil } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

export default function DailyGoal() {
  const percentage = (dailyGoal.completed / dailyGoal.target) * 100;

  return (
    <Card className="surface-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-[var(--color-ink-900)]">
            Daily Goal
          </span>
          <button className="text-xs text-[var(--color-data-primary)] hover:underline cursor-pointer inline-flex items-center gap-1 transition-colors">
            <Pencil className="h-2.5 w-2.5" />
            Edit
          </button>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div className="bg-[var(--color-bgreen-50)] dark:bg-green-900/20 rounded-xl p-2.5 text-[var(--color-data-positive)]">
            <Gift className="h-10 w-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tabular text-[var(--color-ink-900)]">
              {dailyGoal.completed}/{dailyGoal.target}
            </span>
            <span className="text-xs text-[var(--color-muted-foreground)]">
              {dailyGoal.label}
            </span>
          </div>
        </div>

        <Progress 
          value={percentage} 
          className="mt-3 h-2 [&>div]:bg-[var(--color-data-positive)]" 
        />
      </CardContent>
    </Card>
  );
}
