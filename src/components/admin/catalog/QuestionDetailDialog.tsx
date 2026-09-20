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
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden rounded-2xl border-orange-200/60 p-0 shadow-2xl shadow-orange-900/20 sm:max-w-2xl dark:border-orange-400/20">
        {/* Fixed header */}
        <DialogHeader className="shrink-0 space-y-1.5 border-b border-orange-200/60 bg-gradient-to-br from-orange-50 via-white to-orange-50/40 px-6 pb-4 pt-6 pr-12 text-left dark:border-orange-400/15 dark:from-orange-500/10 dark:via-transparent dark:to-transparent">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#c95817] dark:text-orange-300">
            <span className="h-px w-5 bg-orange-400/70" />
            Question
          </p>
          <DialogTitle className="text-xl leading-tight">
            Question {question?.questionNumber ? `#${question.questionNumber}` : ''}
          </DialogTitle>
          <DialogDescription>Where this question lives, and everything students will see.</DialogDescription>
        </DialogHeader>

        {/* Scrollable middle */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5" data-lenis-prevent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#e2691f]" />
            </div>
          ) : isError || !question ? (
            <ErrorState message="Could not load this question." onRetry={() => refetch()} className="py-8" />
          ) : (
            <div className="space-y-5">
              <div className="space-y-2 rounded-xl border border-orange-200/70 bg-gradient-to-br from-orange-50/70 to-white p-3.5 shadow-sm dark:border-orange-400/20 dark:from-orange-500/10 dark:to-transparent">
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
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#c95817] dark:text-orange-300">Question</p>
                <Bilingual text={question.questionText} className="text-[15px] font-medium leading-relaxed" />
              </div>

              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#c95817] dark:text-orange-300">
                  Answer choices
                </p>
                <ul className="space-y-2">
                  {question.options.map((option, index) => {
                    const correct = question.correctOptionIndex === index;
                    return (
                      <li
                        key={index}
                        className={cn(
                          'flex items-start gap-3 rounded-xl border p-3 text-sm transition-shadow',
                          correct
                            ? 'border-green-500/60 bg-gradient-to-br from-green-50 to-white shadow-sm shadow-green-600/10 dark:from-green-900/20 dark:to-transparent'
                            : 'border-[var(--color-border)] hover:border-orange-200 hover:shadow-sm'
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                            correct
                              ? 'bg-green-600 text-white'
                              : 'bg-orange-100 text-[#b9450d] dark:bg-orange-500/20 dark:text-orange-300'
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
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#c95817] dark:text-orange-300">
                    Explanation
                  </p>
                  <Bilingual text={question.explanation} className="text-sm leading-relaxed" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fixed footer */}
        {question && !isLoading && !isError && (
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-orange-200/60 bg-gradient-to-r from-white via-orange-50/40 to-orange-50/70 px-6 py-3.5 dark:border-orange-400/15 dark:from-transparent dark:via-transparent dark:to-orange-500/10">
            <div className="space-y-1">
              <QuestionStatusBadge status={question.status} />
              <p className="text-xs text-[var(--color-muted-foreground)]">{QUESTION_STATUS[question.status].hint}</p>
              {question.status === 'rejected' && question.rejectionReason && (
                <p className="text-xs text-red-500">Reason: {question.rejectionReason}</p>
              )}
            </div>
            {onEdit && (
              <Button
                className="gap-2 border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-semibold text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25 transition-all hover:-translate-y-px hover:bg-transparent hover:brightness-110 hover:shadow-lg hover:shadow-orange-600/40"
                onClick={() => onEdit(question._id)}
              >
                <Pencil className="h-4 w-4" /> Edit question
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
