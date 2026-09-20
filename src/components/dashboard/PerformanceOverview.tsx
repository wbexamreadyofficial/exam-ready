'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';

export default function PerformanceOverview() {
  const { data, isLoading } = useStudentDashboard();

  if (isLoading || !data) {
    return (
      <Card className="surface-card">
        <CardHeader className="p-4 pb-1">
          <CardTitle className="text-base">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          <Skeleton className="mx-auto h-[110px] w-[110px] rounded-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  const { overallScore, correct, wrong, attempted } = data.performance;
  const started = attempted > 0;
  const ring = [
    { name: 'Score', value: started ? Math.max(overallScore, 0.5) : 0 },
    { name: 'Remaining', value: started ? 100 - overallScore : 100 },
  ];

  const rows = [
    { label: 'Correct', value: correct, color: 'var(--color-data-positive)' },
    { label: 'Attempted', value: attempted, color: '#e2691f' },
    { label: 'Incorrect', value: wrong, color: 'var(--color-data-negative)' },
  ];

  return (
    <Card className="surface-card">
      <CardHeader className="p-4 pb-1">
        <CardTitle className="text-base">Performance Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="relative h-[135px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={ring} cx="50%" cy="50%" innerRadius={42} outerRadius={58} startAngle={90} endAngle={-270} dataKey="value" stroke="none" animationBegin={0} animationDuration={1200}>
                <Cell fill="#e2691f" />
                <Cell fill="var(--color-hairline)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold tabular text-[var(--color-ink-900)]">{started ? `${overallScore}%` : '—'}</span>
            <span className="text-xs text-[var(--color-muted-foreground)]">Overall</span>
          </div>
        </div>

        <div className="mt-2 space-y-1.5">
          {rows.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-sm text-[var(--color-ink-700)]">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
              <span className="font-semibold text-[var(--color-ink-900)] tabular">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
