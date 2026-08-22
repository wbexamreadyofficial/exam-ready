'use client';

import * as React from 'react';
import { performanceOverview } from '@/lib/dashboard/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PerformanceOverview() {
  const overallScore = performanceOverview.overallScore;
  const data = [
    { name: 'Score', value: overallScore },
    { name: 'Remaining', value: 100 - overallScore }
  ];

  return (
    <Card className="surface-card">
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
                animationBegin={0}
                animationDuration={1200}
              >
                <Cell fill="var(--color-data-primary)" />
                <Cell fill="var(--color-hairline)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold tabular text-[var(--color-ink-900)]">
              {overallScore}%
            </span>
            <span className="text-xs text-[var(--color-muted-foreground)]">
              Overall
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          {performanceOverview.breakdown.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-sm text-[var(--color-ink-700)]">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
              <span className="font-semibold text-[var(--color-ink-900)] tabular">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
