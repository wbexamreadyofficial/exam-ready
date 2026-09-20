'use client';

import React from 'react';
import { FileText, BarChart3, Trophy, Globe, Target } from 'lucide-react';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const arrow = (delta: number) => `${delta >= 0 ? '▲' : '▼'} ${Math.abs(delta)}%`;

export default function StatTiles() {
  const { data, isLoading } = useStudentDashboard();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" aria-busy="true">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="surface-card p-4 rounded-xl flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-14" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const { stats } = data;
  const started = stats.testsAttempted > 0;
  const running = data.continue.filter((card) => card.status === 'in-progress').length;

  const tiles = [
    {
      label: 'Tests Attempted',
      value: String(stats.testsAttempted),
      note:
        running > 0
          ? `${running} in progress`
          : stats.testsThisWeek > 0
            ? `+${stats.testsThisWeek} this week`
            : started
              ? 'None this week'
              : 'Take a test',
      positive: running > 0 || stats.testsThisWeek > 0 || !started,
      icon: FileText,
    },
    {
      label: 'Average Score',
      value: started ? `${stats.averageScore}%` : '—',
      note: stats.averageScoreChange === null ? '' : arrow(stats.averageScoreChange),
      positive: (stats.averageScoreChange ?? 0) >= 0,
      icon: BarChart3,
    },
    { label: 'Best Score', value: started ? `${stats.bestScore}%` : '—', note: '', positive: true, icon: Trophy },
    {
      label: 'Global Rank',
      value: stats.globalRank ? `#${stats.globalRank}` : '—',
      note: stats.globalRank ? `of ${stats.rankedStudents}` : '',
      positive: true,
      icon: Globe,
    },
    { label: 'Accuracy', value: started ? `${stats.accuracy}%` : '—', note: '', positive: true, icon: Target },
  ];

  const styles = [
    ['bg-orange-50 dark:bg-orange-500/15', 'text-[#e2691f]'],
    ['bg-orange-50 dark:bg-orange-500/15', 'text-[#e2691f]'],
    ['bg-amber-50 dark:bg-amber-500/15', 'text-amber-600 dark:text-amber-400'],
    ['bg-purple-50 dark:bg-purple-900/20', 'text-purple-600 dark:text-purple-400'],
    ['bg-green-50 dark:bg-green-900/20', 'text-[var(--color-data-positive)]'],
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {tiles.map((tile, index) => {
        const Icon = tile.icon;
        const [bg, color] = styles[index];
        return (
          <div
            key={tile.label}
            className="surface-card p-3 rounded-xl animate-slide-up-fade card-hover flex items-center gap-2.5"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className={cn('icon-tile w-9 h-9 rounded-lg flex items-center justify-center shrink-0', bg, color)}>
              <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg xl:text-xl font-bold tabular text-[var(--color-ink-900)] leading-none whitespace-nowrap">{tile.value}</div>
              <div className="text-[11px] text-[var(--color-muted-foreground)] mt-0.5">{tile.label}</div>
              {tile.note && (
                <div
                  className={cn(
                    'text-[11px] font-medium mt-0.5 whitespace-nowrap',
                    tile.positive ? 'text-[var(--color-data-positive)]' : 'text-[var(--color-data-negative)]'
                  )}
                >
                  {tile.note}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
