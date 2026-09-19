'use client';

import { ChevronRight, FileText, HelpCircle, LayoutGrid, ListChecks, Tag, type LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { ELEVATED_CARD } from '@/lib/constants';
import { cn } from '@/lib/utils';

type Level = 'category' | 'exam' | 'set' | 'question';

const STEPS: { key: Level; label: string; example: string; icon: LucideIcon }[] = [
  { key: 'category', label: 'Category', example: 'e.g. WB Constable', icon: LayoutGrid },
  { key: 'exam', label: 'Exam', example: 'e.g. Preliminary 2026', icon: FileText },
  { key: 'set', label: 'Question set', example: 'one full practice test', icon: ListChecks },
  { key: 'question', label: 'Question', example: 'one multiple-choice question', icon: HelpCircle },
];

/** A one-line picture of how the five sections connect, with the current page highlighted. */
export function HierarchyGuide({ current }: { current: Level | 'subject' }) {
  return (
    <Card className={cn(ELEVATED_CARD, 'relative overflow-hidden border-orange-200/60 bg-gradient-to-br from-orange-50/80 via-white to-white dark:border-orange-400/20 dark:from-orange-500/10 dark:via-transparent dark:to-transparent')}>
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-orange-400/10 blur-3xl" />
      <CardContent className="relative space-y-3 p-4 sm:p-5">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700 dark:text-orange-300">
          <span className="h-px w-6 bg-orange-500/60" />
          How everything connects
        </p>
        <ol className="flex flex-wrap items-stretch gap-x-1.5 gap-y-2">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCurrent = current === step.key;
            return (
              <li key={step.key} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="h-4 w-4 shrink-0 text-orange-400/80" />}
                <div
                  className={cn(
                    'flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-all duration-300',
                    isCurrent
                      ? 'border-transparent bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25'
                      : 'border-orange-200/70 bg-white/80 shadow-sm hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md dark:border-white/10 dark:bg-white/5'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      isCurrent ? 'bg-white/20 text-white' : 'bg-orange-500/10 text-orange-600 dark:text-orange-300'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{step.label}</p>
                    <p className={cn('text-[11px] leading-tight', isCurrent ? 'text-orange-50/90' : 'text-[var(--color-muted-foreground)]')}>
                      {step.example}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
          {current === 'subject' && (
            <li className="flex items-center gap-1.5">
              <span className="mx-1 h-6 w-px bg-orange-200/70" />
              <div className="flex items-center gap-2.5 rounded-xl border-transparent bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] px-3 py-2 text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                  <Tag className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">Subject</p>
                  <p className="text-[11px] leading-tight text-orange-50/90">a label on each question</p>
                </div>
              </div>
            </li>
          )}
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
