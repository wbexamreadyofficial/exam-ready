'use client';

import React from 'react';
import { preparationStats } from '@/lib/dashboard/mockData';
import { Clock, ClipboardList, Layers, Target, Award } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = { Clock, ClipboardList, Layers, Target, Award };

export default function PreparationStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {preparationStats.map((stat, index) => {
        const Icon = iconMap[stat.icon] || Award;
        
        return (
          <div 
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-hairline)]"
          >
            <div className="text-[var(--color-data-primary)]">
              <Icon size={16} />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--color-ink-900)] tabular leading-tight">
                {stat.value}
              </div>
              <div className="text-xs text-[var(--color-muted-foreground)] leading-tight">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
