'use client';

import React from 'react';
import { testCards } from '@/lib/dashboard/mockData';
import type { TestCardStatus } from '@/lib/dashboard/mockData';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

const statusConfig: Record<TestCardStatus, { label: string; bg: string; text: string }> = {
  'in-progress': { label: 'In Progress', bg: 'bg-[var(--color-bblue-50)] dark:bg-blue-900/20', text: 'text-[var(--color-data-primary)]' },
  'attempt-again': { label: 'Attempt Again', bg: 'bg-[var(--color-borange-50)] dark:bg-orange-900/20', text: 'text-[var(--color-data-premium)]' },
  'recommended': { label: 'Recommended', bg: 'bg-[var(--color-bgreen-50)] dark:bg-green-900/20', text: 'text-[var(--color-data-positive)]' },
  'new': { label: 'New', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
};

function getScoreColor(score: number) {
  if (score >= 80) return 'text-[var(--color-data-positive)]';
  if (score >= 60) return 'text-[var(--color-data-premium)]';
  return 'text-[var(--color-data-negative)]';
}

export default function ContinuePreparation() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="display-card text-lg font-semibold text-[var(--color-ink-900)]">Continue Your Preparation</h2>
        <a href="#" className="text-sm font-medium text-[var(--color-data-primary)] hover:underline flex items-center">
          See All <ChevronRight size={16} />
        </a>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 dashboard-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
        {testCards.map((card) => {
          const config = statusConfig[card.status];
          let ctaText = 'Start';
          if (card.status === 'in-progress') ctaText = 'Resume';
          else if (card.status === 'attempt-again') ctaText = 'Retake';

          return (
            <div 
              key={card.id} 
              className="surface-card p-5 rounded-xl card-hover flex flex-col min-w-[280px] max-w-[300px] shrink-0 border border-[var(--color-border)]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="flex items-center justify-between">
                <div className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-semibold", config.bg, config.text)}>
                  {config.label}
                </div>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{card.category}</Badge>
              </div>
              
              <h3 className="font-semibold text-sm text-[var(--color-ink-900)] mt-3 line-clamp-2 min-h-[40px]">
                {card.title}
              </h3>
              
              <div className="text-xs text-[var(--color-muted-foreground)] mt-1 mb-4">
                {card.questionCount} Questions &middot; {card.duration}
              </div>
              
              <div className="mt-auto pt-4 border-t border-[var(--color-hairline)] space-y-4">
                {card.status === 'in-progress' && card.progress !== undefined && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-medium text-[var(--color-muted-foreground)]">
                      <span>Progress</span>
                      <span>{card.progress}% Complete</span>
                    </div>
                    <Progress value={card.progress} className="h-1.5" />
                  </div>
                )}
                
                {card.status === 'attempt-again' && card.score !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-muted-foreground)] text-xs">Previous Score</span>
                    <span className={cn("font-bold", getScoreColor(card.score))}>{card.score}%</span>
                  </div>
                )}
                
                <Button className="w-full" variant={card.status === 'in-progress' ? 'default' : 'outline'}>
                  {ctaText}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
