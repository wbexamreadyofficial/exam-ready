'use client';

import React from 'react';
import { Clock, ClipboardList, Layers, Target, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';

const studyTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return minutes > 0 ? `${minutes}m` : seconds > 0 ? '<1m' : '0m';
};

export default function PreparationStats() {
  const { data, isLoading } = useStudentDashboard();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" aria-busy="true">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-[46px] rounded-xl" />
        ))}
      </div>
    );
  }

  const p = data.preparation;
  const started = p.testsTaken > 0;
  const stats = [
    { label: 'Total Study Time', value: studyTime(p.studySeconds), icon: Clock },
    { label: 'Tests Taken', value: String(p.testsTaken), icon: ClipboardList },
    { label: 'Topics Practiced', value: String(p.topicsPracticed), icon: Layers },
    { label: 'Accuracy', value: started ? `${p.accuracy}%` : '—', icon: Target },
    { label: 'Best Score', value: started ? `${p.bestScore}%` : '—', icon: Award },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--color-surface)] border border-orange-200/60 shadow-elevated dark:border-orange-400/20">
            <div className="text-[#e2691f]">
              <Icon size={16} />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--color-ink-900)] tabular leading-tight">{stat.value}</div>
              <div className="text-xs text-[var(--color-muted-foreground)] leading-tight">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
