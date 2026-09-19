'use client';

import {
  FileEdit, Upload, ShieldCheck, LayoutGrid, Library,
  FileText, Type, ListChecks, CheckCircle2, Info,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/i18n';

const ICONS = [FileEdit, Upload, ShieldCheck, LayoutGrid, Library, FileText, Type, ListChecks, CheckCircle2];

interface UploadStepsProps {
  /** `full` renders the numbered timeline; `compact` is the dashboard summary. */
  variant?: 'full' | 'compact';
  className?: string;
}

export function UploadSteps({ variant = 'full', className }: UploadStepsProps) {
  const { t } = useAdminT();
  const s = t.steps;

  const steps = [
    { title: s.s1Title, body: s.s1Body },
    { title: s.s2Title, body: s.s2Body },
    { title: s.s3Title, body: s.s3Body },
    { title: s.s4Title, body: s.s4Body },
    { title: s.s5Title, body: s.s5Body },
    { title: s.s6Title, body: s.s6Body },
    { title: s.s7Title, body: s.s7Body },
    { title: s.s8Title, body: s.s8Body },
    { title: s.s9Title, body: s.s9Body },
  ];

  if (variant === 'compact') {
    return (
      <Card className={cn("print-box", className)}>
        <CardContent className="p-4 sm:p-5">
          <h2 className="text-[15px] font-bold">{s.shortTitle}</h2>
          <ol className="mt-3 space-y-2">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-muted)] text-[10px] font-black text-[var(--color-muted-foreground)]">
                  {i + 1}
                </span>
                <span className="text-[13px] leading-snug">{step.title}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className={className}>
      <h2 className="text-base font-bold sm:text-lg">{s.title}</h2>
      <p className="mb-4 mt-1 text-sm text-[var(--color-muted-foreground)]">{s.subtitle}</p>

      <ol className="relative">
        {steps.map((step, i) => {
          const Icon = ICONS[i] ?? FileText;
          const isLast = i === steps.length - 1;

          return (
            <li key={i} className="relative flex gap-3 pb-4 sm:gap-4 last:pb-0">
              {/* Connector — stops at the last node so the line never dangles. */}
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-[17px] top-10 h-[calc(100%-1.75rem)] w-px bg-[var(--color-hairline)] sm:left-[19px]"
                />
              )}

              <div
                className={cn(
                  'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 sm:h-10 sm:w-10',
                  isLast
                    ? 'border-[var(--color-bgreen-500)] bg-[var(--color-bgreen-50)] text-[var(--color-bgreen-600)] dark:bg-[var(--color-bgreen-500)]/15'
                    : 'border-[var(--color-primary)]/30 bg-[var(--color-bblue-50)] text-[var(--color-primary)] dark:bg-[var(--color-bblue-700)]/20'
                )}
              >
                <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <h3 className="flex flex-wrap items-baseline gap-x-2 text-[14px] font-bold leading-snug">
                  <span className="text-[11px] font-black text-[var(--color-muted-foreground)]">
                    {t.common.step} {i + 1}
                  </span>
                  <span>{step.title}</span>
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-muted-foreground)]">
                  {step.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <Card className="print-box mt-4 border-[var(--color-bgreen-100)] bg-[var(--color-bgreen-50)] dark:border-[var(--color-bgreen-500)]/25 dark:bg-[var(--color-bgreen-500)]/10">
        <CardContent className="flex gap-3 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-bgreen-600)]" />
          <div className="min-w-0">
            <h3 className="text-[13.5px] font-bold">{s.noteTitle}</h3>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--color-muted-foreground)]">
              {s.noteBody}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
