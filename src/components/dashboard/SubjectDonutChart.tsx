'use client';

import React from 'react';
import { PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';

const COLORS = ['#e2691f', '#f4953f', '#c4501a', '#f7b26e', '#97370f', '#fbd0a3'];

function SubjectTooltip({ active, payload }: { active?: boolean; payload?: { name: string; payload: { accuracy: number; attempted: number } }[] }) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-lg shadow-lg p-2 text-sm">
      <span className="font-medium text-[var(--color-ink-900)]">{row.name}: </span>
      <span className="font-bold">{row.payload.accuracy}%</span>
      <span className="ml-1 text-xs text-[var(--color-muted-foreground)]">({row.payload.attempted} answered)</span>
    </div>
  );
}

export default function SubjectDonutChart() {
  const { data, isLoading } = useStudentDashboard();
  const subjects = data?.subjects ?? [];

  return (
    <Card className="surface-card h-full flex flex-col">
      <CardHeader className="p-4 pb-1">
        <CardTitle className="display-card text-base font-semibold text-[var(--color-ink-900)]">Subject Performance</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 p-4 pt-0">
        {isLoading ? (
          <>
            <Skeleton className="h-[150px] w-[150px] rounded-full" />
            <div className="w-full md:w-1/2 space-y-3">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </>
        ) : subjects.length === 0 ? (
          <div className="flex min-h-[170px] flex-col items-center justify-center gap-3 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#e2691f] dark:bg-orange-500/15">
              <PieIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-semibold">No subject data yet</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Your accuracy in each subject shows up after your first test.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="relative w-full md:w-1/2 h-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjects}
                    innerRadius={46}
                    outerRadius={66}
                    paddingAngle={3}
                    dataKey="attempted"
                    nameKey="name"
                    stroke="none"
                    animationBegin={0}
                    animationDuration={1200}
                  >
                    {subjects.map((subject, index) => (
                      <Cell key={subject.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<SubjectTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold tabular text-[var(--color-ink-900)]">{subjects.length}</span>
                <span className="text-[10px] text-[var(--color-muted-foreground)] uppercase font-semibold tracking-wider">
                  {subjects.length === 1 ? 'Subject' : 'Subjects'}
                </span>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-1.5">
              {subjects.map((subject, index) => (
                <div key={subject.name} className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs text-[var(--color-ink-700)] truncate" title={subject.name}>
                      {subject.name}
                    </span>
                  </div>
                  <span className="font-semibold text-[var(--color-ink-900)] text-xs tabular">{subject.accuracy}%</span>
                </div>
              ))}
              <p className="text-[10px] text-[var(--color-muted-foreground)]">Accuracy per subject; slice size is questions answered.</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
