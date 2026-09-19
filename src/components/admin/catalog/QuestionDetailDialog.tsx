'use client';

import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Loader2, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ErrorState } from '@/components/ui/error-state';
import { catalogApi, type BilingualText } from '@/lib/api/catalog';
import { cn } from '@/lib/utils';
import { Chain } from './tables';
import { QUESTION_STATUS, QuestionStatusBadge } from './ui';

const LETTERS = ['A', 'B', 'C', 'D'];

function Bilingual({ text, className }: { text?: BilingualText; className?: string }) {
  if (!text?.en && !text?.bn) return <span className="text-[var(--color-muted-foreground)]">—</span>;
  return (
    <div className={className}>
      {text.en && <p>{text.en}</p>}
      {text.bn && <p className={cn(text.en && 'mt-0.5 text-[var(--color-muted-foreground)]')}>{text.bn}</p>}
    </div>
  );
}

interface QuestionDetailDialogProps {
  questionId: string | null;
  onClose: () => void;
  onEdit?: (questionId: string) => void;
}

/** Read-only view of one question — loaded from its own endpoint so lists never carry answers or explanations. */
export function QuestionDetailDialog({ questionId, onClose, onEdit }: QuestionDetailDialogProps) {
  const { data: question, isLoading, isError, refetch } = useQuery({
    queryKey: ['catalog', 'question', questionId],
    queryFn: () => catalogApi.question(questionId as string),
    enabled: Boolean(questionId),
  });

  return (
    <Dialog open={Boolean(questionId)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Question {question?.questionNumber ? `#${question.questionNumber}` : ''}</DialogTitle>
          <DialogDescription>Where this question lives, and everything students will see.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--color-muted-foreground)]" />
          </div>
        ) : isError || !question ? (
          <ErrorState message="Could not load this question." onRetry={() => refetch()} className="py-8" />
        ) : (
          <div className="space-y-5">
            <div className="space-y-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-3">
              <Chain parts={[question.category?.name, question.exam?.title, question.questionSet?.title.en]} />
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
                <span>
                  Subject: <strong className="text-[var(--color-foreground)]">{question.subject?.name ?? '—'}</strong>
                </span>
                {question.topic && <span>· Topic: {question.topic}</span>}
                {question.chapter && <span>· Chapter: {question.chapter}</span>}
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">Question</p>
              <Bilingual text={question.questionText} className="text-sm font-medium" />
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                Answer choices
              </p>
              <ul className="space-y-2">
                {question.options.map((option, index) => {
                  const correct = question.correctOptionIndex === index;
                  return (
                    <li
                      key={index}
                      className={cn(
                        'flex items-start gap-3 rounded-lg border p-3 text-sm',
                        correct
                          ? 'border-green-500/60 bg-green-50 dark:bg-green-900/20'
                          : 'border-[var(--color-border)]'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                          correct ? 'bg-green-600 text-white' : 'bg-[var(--color-muted)]'
                        )}
                      >
                        {LETTERS[index]}
                      </span>
                      <Bilingual text={option} className="min-w-0 flex-1" />
                      {correct && (
                        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400">
                          <CheckCircle2 className="h-4 w-4" /> Correct answer
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              {question.correctOptionIndex === undefined && (
                <p className="mt-2 text-xs text-amber-600">The correct answer has not been chosen yet.</p>
              )}
            </div>

            {(question.explanation?.en || question.explanation?.bn) && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                  Explanation
                </p>
                <Bilingual text={question.explanation} className="text-sm" />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
              <div className="space-y-1">
                <QuestionStatusBadge status={question.status} />
                <p className="text-xs text-[var(--color-muted-foreground)]">{QUESTION_STATUS[question.status].hint}</p>
                {question.status === 'rejected' && question.rejectionReason && (
                  <p className="text-xs text-red-500">Reason: {question.rejectionReason}</p>
                )}
              </div>
              {onEdit && (
                <Button variant="outline" className="gap-2" onClick={() => onEdit(question._id)}>
                  <Pencil className="h-4 w-4" /> Edit question
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
