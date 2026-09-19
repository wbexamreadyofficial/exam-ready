'use client';

import { ChevronRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { ELEVATED_CARD } from '@/lib/constants';
import { cn } from '@/lib/utils';

type Level = 'category' | 'exam' | 'set' | 'question';

const STEPS: { key: Level; label: string; example: string }[] = [
  { key: 'category', label: 'Category', example: 'e.g. WB Constable' },
  { key: 'exam', label: 'Exam', example: 'e.g. Preliminary 2026' },
  { key: 'set', label: 'Question set', example: 'one full practice test' },
  { key: 'question', label: 'Question', example: 'one multiple-choice question' },
];

/** A one-line picture of how the five sections connect, with the current page highlighted. */
export function HierarchyGuide({ current }: { current: Level | 'subject' }) {
  return (
    <Card className={ELEVATED_CARD}>
      <CardContent className="space-y-2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">How everything connects</p>
        <ol className="flex flex-wrap items-stretch gap-x-1 gap-y-2">
          {STEPS.map((step, index) => (
            <li key={step.key} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />}
              <div
                className={cn(
                  'rounded-lg border px-3 py-1.5',
                  current === step.key
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                    : 'border-[var(--color-border)]'
                )}
              >
                <p className={cn('text-sm font-semibold', current === step.key && 'text-[var(--color-primary)]')}>{step.label}</p>
                <p className="text-[11px] text-[var(--color-muted-foreground)]">{step.example}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-xs text-[var(--color-muted-foreground)]">
          {current === 'subject'
            ? 'A subject (like Mathematics) is a label on each question. One subject can appear in many exams and question sets.'
            : 'Each level contains the next one. Every question also carries a subject label (like Mathematics).'}
        </p>
      </CardContent>
    </Card>
  );
}
