'use client';

import { useState } from 'react';
import { AlertTriangle, Check, Pencil, RotateCcw, X, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/i18n';
import type { ParsedQuestion, QuestionEditInput, UploadIssue } from '@/types/questionUpload';

/** Issues that stop a publish, as opposed to those that merely warn. */
const BLOCKING = new Set(['MISSING_ANSWER', 'ANSWER_NOT_IN_OPTIONS', 'TOO_FEW_OPTIONS']);

interface QuestionCardProps {
  question: ParsedQuestion;
  /** Issues the API raised for this question, already worded in both languages. */
  issues: UploadIssue[];
  busy?: boolean;
  onEdit: (input: QuestionEditInput) => void;
}

export function QuestionCard({ question, issues, busy, onEdit }: QuestionCardProps) {
  const { t, lang } = useAdminT();
  const w = t.wizard;

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(question.text);
  const [options, setOptions] = useState(question.options);
  const [answerKey, setAnswerKey] = useState(question.answerKey ?? '');
  const [explanation, setExplanation] = useState(question.explanation ?? '');

  const blocking = issues.filter((issue) => BLOCKING.has(issue.code));
  const warnings = issues.filter((issue) => !BLOCKING.has(issue.code));
  const skipped = question.decision === 'skip';

  const state: 'blocking' | 'warning' | 'clean' = blocking.length
    ? 'blocking'
    : warnings.length
      ? 'warning'
      : 'clean';

  const save = () => {
    onEdit({
      text: text.trim(),
      options: options.map((option) => ({ ...option, text: option.text.trim() })),
      answerKey: answerKey || undefined,
      explanation: explanation.trim() || undefined,
    });
    setEditing(false);
  };

  return (
    <Card
      className={cn(
        'transition-opacity',
        skipped && 'opacity-55',
        !skipped && state === 'blocking' && 'border-[var(--color-bred-500)]/50',
        !skipped && state === 'warning' && 'border-[var(--color-borange-500)]/40'
      )}
    >
      <CardContent className="p-3 sm:p-4">
        {/* Header: number, state, actions */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-[var(--color-muted)] px-2 py-0.5 text-[11.5px] font-black">
            Q{question.number}
          </span>

          {skipped ? (
            <span className="rounded-full bg-[var(--color-muted)] px-2 py-0.5 text-[10.5px] font-bold text-[var(--color-muted-foreground)]">
              {w.skipped}
            </span>
          ) : state === 'blocking' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bred-50)] px-2 py-0.5 text-[10.5px] font-bold text-[var(--color-bred-600)] dark:bg-[var(--color-bred-500)]/15">
              <XCircle className="h-3 w-3" />
              {w.blocking}
            </span>
          ) : state === 'warning' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-borange-50)] px-2 py-0.5 text-[10.5px] font-bold text-[var(--color-borange-600)] dark:bg-[var(--color-borange-500)]/15">
              <AlertTriangle className="h-3 w-3" />
              {w.needsReview}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bgreen-50)] px-2 py-0.5 text-[10.5px] font-bold text-[var(--color-bgreen-600)] dark:bg-[var(--color-bgreen-500)]/15">
              <Check className="h-3 w-3" />
              {w.clean}
            </span>
          )}

          {question.subject && (
            <span className="text-[11.5px] text-[var(--color-muted-foreground)]">
              {question.subject}
            </span>
          )}

          <div className="ml-auto flex gap-1">
            {!skipped && !editing && (
              <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-[11.5px]" onClick={() => setEditing(true)}>
                <Pencil className="h-3 w-3" />
                {w.editQuestion}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-[11.5px]"
              disabled={busy}
              onClick={() => onEdit({ decision: skipped ? 'include' : 'skip' })}
            >
              {skipped ? <RotateCcw className="h-3 w-3" /> : <X className="h-3 w-3" />}
              {skipped ? w.includeQuestion : w.skipQuestion}
            </Button>
          </div>
        </div>

        {/* Why it is flagged — the API supplies both languages. */}
        {!skipped && issues.length > 0 && (
          <ul className="mb-2 space-y-0.5">
            {issues.map((issue, i) => (
              <li
                key={i}
                className={cn(
                  'text-[12px]',
                  BLOCKING.has(issue.code)
                    ? 'text-[var(--color-bred-600)]'
                    : 'text-[var(--color-borange-600)]'
                )}
              >
                • {(lang === 'BN' ? issue.messageBn : issue.message) ?? issue.message}
              </li>
            ))}
          </ul>
        )}

        {editing ? (
          <div className="space-y-2.5">
            <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} className="text-[13.5px]" />

            <div className="space-y-1.5">
              {options.map((option, i) => (
                <div key={option.key} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAnswerKey(option.key)}
                    title={w.correctAnswer}
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-[11.5px] font-bold transition-colors',
                      answerKey === option.key
                        ? 'border-[var(--color-bgreen-500)] bg-[var(--color-bgreen-50)] text-[var(--color-bgreen-600)] dark:bg-[var(--color-bgreen-500)]/20'
                        : 'border-[var(--color-hairline)] hover:bg-[var(--color-muted)]'
                    )}
                  >
                    {option.key}
                  </button>
                  <Input
                    value={option.text}
                    onChange={(e) =>
                      setOptions((prev) =>
                        prev.map((o, index) => (index === i ? { ...o, text: e.target.value } : o))
                      )
                    }
                    className="h-8 text-[13px]"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="mb-1 block text-[11.5px] font-semibold text-[var(--color-muted-foreground)]">
                {w.explanationLabel}
              </label>
              <Textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                rows={2}
                className="text-[13px]"
              />
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="font-semibold" disabled={busy} onClick={save}>
                {w.saveQuestion}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                {t.common.cancel}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <p className="text-[13.5px] leading-relaxed">{question.text}</p>
            <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
              {question.options.map((option) => (
                <div
                  key={option.key}
                  className={cn(
                    'flex gap-1.5 text-[12.5px]',
                    option.key === question.answerKey
                      ? 'font-semibold text-[var(--color-bgreen-600)]'
                      : 'text-[var(--color-muted-foreground)]'
                  )}
                >
                  <span className="shrink-0">{option.key})</span>
                  <span className="min-w-0">{option.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
