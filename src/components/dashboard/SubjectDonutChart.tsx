'use client';

import React from 'react';
import { subjectPerformance } from '@/lib/dashboard/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SubjectDonutChart() {
  const averageScore = Math.round(
    subjectPerformance.reduce((acc, curr) => acc + curr.value, 0) / subjectPerformance.length
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-lg shadow-lg p-2 text-sm">
          <span className="font-medium text-[var(--color-ink-900)]">{payload[0].name}: </span>
          <span className="font-bold">{payload[0].value}%</span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="surface-card border-none shadow-sm h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="display-card text-lg font-semibold text-[var(--color-ink-900)]">
          Subject Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 pt-0">
        <div className="relative w-full md:w-1/2 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={subjectPerformance}
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                animationBegin={0}
                animationDuration={1200}
              >
                {subjectPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold tabular text-[var(--color-ink-900)]">4</span>
            <span className="text-[10px] text-[var(--color-muted-foreground)] uppercase font-semibold tracking-wider">Subjects</span>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          {subjectPerformance.map((subject, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: subject.color }}
                />
                <span className="text-sm text-[var(--color-ink-700)] truncate max-w-[100px]" title={subject.name}>
                  {subject.name}
                </span>
              </div>
              <span className="font-semibold text-[var(--color-ink-900)] text-sm tabular">
                {subject.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
