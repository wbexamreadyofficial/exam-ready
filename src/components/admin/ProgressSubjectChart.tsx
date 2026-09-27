'use client';

import { PieChart as PieIcon } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { SubjectStat } from '@/lib/api/studentDashboard';

const COLORS = ['#e2691f', '#f4953f', '#c4501a', '#f7b26e', '#97370f', '#fbd0a3'];

function SubjectTooltip({ active, payload }: { active?: boolean; payload?: { name: string; payload: { accuracy: number; attempted: number } }[] }) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-2 text-sm shadow-lg">
      <span className="font-medium">{row.name}: </span>
      <span className="font-bold">{row.payload.accuracy}%</span>
      <span className="ml-1 text-xs text-[var(--color-muted-foreground)]">({row.payload.attempted} answered)</span>
    </div>
  );
}

export function ProgressSubjectChart({ subjects }: { subjects: SubjectStat[] }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base font-bold">Subject Performance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-4">
        {subjects.length === 0 ? (
          <EmptyState
            icon={PieIcon}
            title="No subject data yet"
            description="Accuracy per subject shows up after the first submitted test."
            className="py-6"
          />
        ) : (
          <>
            <div className="relative h-[170px] w-full">
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
                  >
                    {subjects.map((subject, index) => (
                      <Cell key={subject.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<SubjectTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold tabular-nums">{subjects.length}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                  {subjects.length === 1 ? 'Subject' : 'Subjects'}
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-1.5">
              {subjects.map((subject, index) => (
                <div key={subject.name} className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="truncate text-xs text-[var(--color-foreground)]" title={subject.name}>
                      {subject.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold tabular-nums">{subject.accuracy}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
