'use client';

import React, { useState } from 'react';
import { scoreTrendData } from '@/lib/dashboard/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ScoreTrendChart() {
  const [activeRange, setActiveRange] = useState<'7d' | '30d' | '3m' | 'all'>('30d');
  
  const ranges = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '3m', label: '3 Months' },
    { id: 'all', label: 'All' }
  ];

  const data = scoreTrendData[activeRange] || scoreTrendData['30d'];
  const lastPoint = data[data.length - 1];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-lg shadow-lg p-3">
          <p className="text-xs text-[var(--color-muted-foreground)] mb-1">{label}</p>
          <p className="text-sm font-bold text-[var(--color-ink-900)]">
            Score: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="surface-card border-none shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="display-card text-lg font-semibold text-[var(--color-ink-900)]">Score Trend</CardTitle>
        <div className="flex gap-1 bg-[var(--color-surface-muted)] rounded-lg p-1">
          {ranges.map(range => (
            <button
              key={range.id}
              onClick={() => setActiveRange(range.id as any)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                activeRange === range.id 
                  ? "bg-[var(--color-data-primary)] text-white shadow-sm" 
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-ink-900)]"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[280px] w-full" key={activeRange}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-data-primary)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--color-data-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline)" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: 'var(--color-ink-500)' }} 
                axisLine={false} 
                tickLine={false}
                minTickGap={20}
              />
              <YAxis 
                domain={[0, 100]} 
                ticks={[0, 25, 50, 75, 100]}
                tick={{ fontSize: 11, fill: 'var(--color-ink-500)' }} 
                axisLine={false} 
                tickLine={false} 
                width={30}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="var(--color-data-primary)" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorScore)" 
                activeDot={{ r: 5, strokeWidth: 2, fill: 'var(--color-surface)', stroke: 'var(--color-data-primary)' }}
              />
              {lastPoint && (
                <ReferenceDot
                  x={lastPoint.date}
                  y={lastPoint.score}
                  r={4}
                  fill="var(--color-data-primary)"
                  stroke="none"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
