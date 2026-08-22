'use client';

import React from 'react';
import { recommendedTopics } from '@/lib/dashboard/mockData';
import { Calculator, GitBranch, BookOpen, Newspaper, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = { Calculator, GitBranch, BookOpen, Newspaper };

export default function RecommendedTopics() {
  return (
    <div className="space-y-4">
      <h2 className="display-card text-lg font-semibold text-[var(--color-ink-900)]">Recommended For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendedTopics.map((topic, index) => {
          const Icon = iconMap[topic.icon] || BookOpen;
          
          let bgClass = '';
          if (index % 4 === 0) bgClass = 'bg-[var(--color-bblue-50)] text-[var(--color-bblue-600)] dark:bg-blue-900/20 dark:text-blue-400';
          else if (index % 4 === 1) bgClass = 'bg-[var(--color-bgreen-50)] text-[var(--color-bgreen-600)] dark:bg-green-900/20 dark:text-green-400';
          else if (index % 4 === 2) bgClass = 'bg-[var(--color-borange-50)] text-[var(--color-borange-600)] dark:bg-orange-900/20 dark:text-orange-400';
          else bgClass = 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
          
          return (
            <div 
              key={topic.id} 
              className="surface-card p-5 rounded-xl card-hover group cursor-pointer border border-[var(--color-border)]"
            >
              <div className={cn("icon-tile w-11 h-11 rounded-xl flex items-center justify-center", bgClass)}>
                <Icon size={20} />
              </div>
              
              <h3 className="font-semibold text-sm text-[var(--color-ink-900)] mt-3">
                {topic.name}
              </h3>
              
              <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                {topic.testCount} Practice Tests
              </p>
              
              <div className="text-xs font-semibold text-[var(--color-data-primary)] mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Practice Now <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
