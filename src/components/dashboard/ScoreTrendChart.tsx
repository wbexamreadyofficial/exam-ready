'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LineChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import type { TrendRange } from '@/lib/api/studentDashboard';
import { cn } from '@/lib/utils';

const RANGES: { id: TrendRange; label: string }[] = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '3m', label: '3 Months' },
  { id: 'all', label: 'All' },
];

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; payload: { tests: number } }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-lg shadow-lg p-3">
      <p className="text-xs text-[var(--color-muted-foreground)] mb-1">{label}</p>
      <p className="text-sm font-bold text-[var(--color-ink-900)]">Score: {payload[0].value}%</p>
      <p className="text-[11px] text-[var(--color-muted-foreground)]">
        {payload[0].payload.tests} test{payload[0].payload.tests === 1 ? '' : 's'}
      </p>
    </div>
  );
}

export default function ScoreTrendChart() {
  const [activeRange, setActiveRange] = useState<TrendRange>('30d');
  const { data, isLoading } = useStudentDashboard();

  const points = data?.trend[activeRange] ?? [];
  const lastPoint = points[points.length - 1];

  return (
    <Card className="surface-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1">
        <CardTitle className="display-card text-base font-semibold text-[var(--color-ink-900)]">Score Trend</CardTitle>
        <div className="flex gap-1 bg-[var(--color-surface-muted)] rounded-lg p-1">
          {RANGES.map((range) => (
            <button
              key={range.id}
              onClick={() => setActiveRange(range.id)}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200',
                activeRange === range.id
                  ? 'bg-gradient-to-br from-[#f4953f] to-[#c4501a] text-white shadow-sm'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-ink-900)]'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {isLoading ? (
          <Skeleton className="h-[210px] w-full rounded-xl" />
        ) : points.length === 0 ? (
          <div className="flex h-[210px] flex-col items-center justify-center gap-3 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#e2691f] dark:bg-orange-500/15">
              <LineChart className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-semibold">No scores in this period</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Finish a mock test and your progress will chart here.</p>
            </div>
            <Link href="/student/mock-tests" className="text-xs font-semibold text-[#c95817] hover:underline dark:text-orange-300">
              Take a mock test
            </Link>
          </div>
        ) : (
          <div className="h-[210px] w-full" key={activeRange}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={points} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e2691f" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#e2691f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-ink-500)' }} axisLine={false} tickLine={false} minTickGap={20} />
                <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11, fill: 'var(--color-ink-500)' }} axisLine={false} tickLine={false} width={30} />
                <RechartsTooltip content={<TrendTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#e2691f"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  activeDot={{ r: 5, strokeWidth: 2, fill: 'var(--color-surface)', stroke: '#e2691f' }}
                />
                {lastPoint && <ReferenceDot x={lastPoint.date} y={lastPoint.score} r={4} fill="#e2691f" stroke="none" />}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
