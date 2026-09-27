'use client';

import { useState } from 'react';
import { LineChart as LineChartIcon } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';
import type { TrendPoint, TrendRange } from '@/lib/api/studentDashboard';

const RANGES: { id: TrendRange; label: string }[] = [
  { id: '30d', label: '30 Days' },
  { id: '3m', label: '3 Months' },
  { id: 'all', label: 'All time' },
];

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; payload: { tests: number } }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-3 shadow-lg">
      <p className="mb-1 text-xs text-[var(--color-muted-foreground)]">{label}</p>
      <p className="text-sm font-bold">Score: {payload[0].value}%</p>
      <p className="text-[11px] text-[var(--color-muted-foreground)]">
        {payload[0].payload.tests} test{payload[0].payload.tests === 1 ? '' : 's'}
      </p>
    </div>
  );
}

export function ProgressTrendChart({ trend }: { trend: Record<TrendRange, TrendPoint[]> }) {
  const [range, setRange] = useState<TrendRange>('30d');
  const points = trend[range] ?? [];
  const lastPoint = points[points.length - 1];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-base font-bold">Score Trend</CardTitle>
        <div className="flex gap-1 rounded-lg bg-[var(--color-muted)] p-1">
          {RANGES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setRange(option.id)}
              className={cn(
                'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
                range === option.id
                  ? 'bg-[var(--color-cta)] text-white shadow-sm'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {points.length === 0 ? (
          <EmptyState
            icon={LineChartIcon}
            title="No scores in this period"
            description="Nothing submitted yet for this range."
            className="py-10"
          />
        ) : (
          <div className="h-[220px] w-full" key={range}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={points} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="progressTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-cta)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--color-cta)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} minTickGap={20} />
                <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} width={30} />
                <RechartsTooltip content={<TrendTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-cta)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#progressTrendFill)"
                  activeDot={{ r: 5, strokeWidth: 2, fill: 'var(--color-card)', stroke: 'var(--color-cta)' }}
                />
                {lastPoint && <ReferenceDot x={lastPoint.date} y={lastPoint.score} r={4} fill="var(--color-cta)" stroke="none" />}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
