'use client';

import { useState } from 'react';
import { ArrowRight, Calculator, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminT } from '@/lib/admin/i18n';
import { cn } from '@/lib/utils';
import type { PatternDraft, PatternInput } from '@/types/questionUpload';

interface PatternStepProps {
  draft: PatternDraft;
  busy: boolean;
  onSubmit: (input: PatternInput) => void;
}

function Field({
  id,
  label,
  value,
  onChange,
  step,
  min,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  step?: string;
  min?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="number" inputMode="decimal" step={step} min={min} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/**
 * Step 8 — the operator accepts (or corrects) the marking scheme the file
 * proposed. These numbers decide how many questions the set must contain, which
 * is why they are confirmed before anything is created rather than after.
 */
export function PatternStep({ draft, busy, onSubmit }: PatternStepProps) {
  const { t } = useAdminT();
  const w = t.wizard;

  const [duration, setDuration] = useState(String(draft.durationMinutes));
  const [marks, setMarks] = useState(String(draft.marksPerQuestion));
  const [negative, setNegative] = useState(String(draft.negativeMarksPerQuestion));
  const [total, setTotal] = useState(String(draft.totalMarks));
  const [passing, setPassing] = useState(draft.passingMarks === null ? '' : String(draft.passingMarks));

  const numeric = (value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const marksValue = numeric(marks);
  const totalValue = numeric(total);
  // Mirrors the server's rule so the consequence is visible before committing.
  const required = marksValue > 0 ? Math.ceil(totalValue / marksValue) : 0;
  const short = Math.max(0, required - draft.includedQuestions);

  const valid = marksValue > 0 && totalValue > 0 && numeric(duration) > 0 && (!passing || numeric(passing) <= totalValue);

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div>
          <h2 className="text-lg font-black tracking-tight">{w.patternStepTitle}</h2>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{w.patternStepHelp}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="duration" label={w.durationLabel} value={duration} onChange={setDuration} min={1} />
          <Field id="marks" label={w.marksPerQuestionLabel} value={marks} onChange={setMarks} step="0.25" min={0} />
          <Field id="negative" label={w.negativeMarksLabel} value={negative} onChange={setNegative} step="0.25" min={0} />
          <Field id="total" label={w.totalMarksLabel} value={total} onChange={setTotal} step="0.5" min={0} />
          <Field id="passing" label={w.passingMarksLabel} value={passing} onChange={setPassing} step="0.5" min={0} />
        </div>

        <div
          className={cn(
            'flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border p-3 text-[13px]',
            short > 0
              ? 'border-[var(--color-borange-200)] bg-[var(--color-borange-50)] dark:border-[var(--color-borange-500)]/30 dark:bg-[var(--color-borange-500)]/10'
              : 'border-[var(--color-hairline)] bg-[var(--color-muted)]/40'
          )}
        >
          <Calculator className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
          <span>
            {w.requiredQuestionsNote} <b>{required}</b> {w.questionsWord}
            {marksValue > 0 && (
              <span className="text-[var(--color-muted-foreground)]">
                {' '}
                ({totalValue} ÷ {marksValue})
              </span>
            )}
            . {w.youHaveNow} <b>{draft.includedQuestions}</b>.
          </span>
          {short > 0 && (
            <span className="font-semibold text-[var(--color-borange-700)] dark:text-[var(--color-borange-400)]">
              {w.shortOfQuestions} {short}.
            </span>
          )}
        </div>

        <Button
          className="gap-2 font-bold"
          disabled={!valid || busy}
          onClick={() =>
            onSubmit({
              durationMinutes: Math.round(numeric(duration)),
              marksPerQuestion: marksValue,
              negativeMarksPerQuestion: numeric(negative),
              totalMarks: totalValue,
              ...(passing.trim() ? { passingMarks: numeric(passing) } : {}),
            })
          }
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {w.confirmPattern}
        </Button>
      </CardContent>
    </Card>
  );
}
