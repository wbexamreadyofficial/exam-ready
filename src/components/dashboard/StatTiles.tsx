'use client';

import React from 'react';
import { dashboardStats } from '@/lib/dashboard/mockData';
import { FileText, BarChart3, Trophy, Globe, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = { FileText, BarChart3, Trophy, Globe, Target };

export default function StatTiles() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {dashboardStats.map((stat, index) => {
        const Icon = iconMap[stat.icon] || FileText;
        
        let bgClass = '';
        let iconColorClass = '';
        
        if (index === 0 || index === 1) {
          bgClass = 'bg-[var(--color-bblue-50)] dark:bg-orange-900/20';
          iconColorClass = 'text-[var(--color-data-primary)]';
        } else if (index === 2) {
          bgClass = 'bg-[var(--color-borange-50)] dark:bg-orange-900/20';
          iconColorClass = 'text-[var(--color-data-premium)]';
        } else if (index === 3) {
          bgClass = 'bg-purple-50 dark:bg-purple-900/20';
          iconColorClass = 'text-purple-600 dark:text-purple-400';
        } else {
          bgClass = 'bg-[var(--color-bgreen-50)] dark:bg-green-900/20';
          iconColorClass = 'text-[var(--color-data-positive)]';
        }

        return (
          <div 
            key={stat.label} 
            className="surface-card p-4 rounded-xl animate-slide-up-fade card-hover flex items-center gap-4"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className={cn("icon-tile w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bgClass, iconColorClass)}>
              <Icon size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold tabular text-[var(--color-ink-900)] leading-none">{stat.value}</div>
              <div className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{stat.label}</div>
              {stat.change && (
                <div className="text-xs font-medium text-[var(--color-data-positive)] mt-1 whitespace-nowrap">
                  {stat.change}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
