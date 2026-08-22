'use client';

import * as React from 'react';
import { streakData } from '@/lib/dashboard/mockData';
import { Flame, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function StreakTracker() {
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  return (
    <Card className="surface-card">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--color-borange-50)] dark:bg-orange-900/20 rounded-xl p-2">
            <Flame className="h-8 w-8 text-[var(--color-data-premium)] drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tabular text-[var(--color-ink-900)]">
              {streakData.count}
            </span>
            <span className="text-xs text-[var(--color-muted-foreground)]">
              Day Streak 🔥
            </span>
          </div>
        </div>

        <div className="flex justify-between mt-4 gap-1">
          {streakData.days.map((day, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-[10px] text-[var(--color-muted-foreground)] mb-1">
                {dayLabels[i]}
              </span>
              <div 
                className={cn(
                  "flex h-[28px] w-[28px] items-center justify-center rounded-full transition-colors",
                  day.status === 'completed' && "bg-[var(--color-data-positive)] text-white",
                  day.status === 'today' && "bg-[var(--color-data-premium)] text-white relative",
                  day.status === 'missed' && "bg-[var(--color-surface-muted)] text-[var(--color-muted-foreground)]"
                )}
              >
                {day.status === 'completed' && <Check className="h-3 w-3" />}
                {day.status === 'today' && (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-data-premium)] opacity-30" />
                    <Flame className="h-3 w-3 relative z-10" />
                  </>
                )}
                {day.status === 'missed' && (
                  <span className="h-1 w-1 rounded-full bg-current opacity-40" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
