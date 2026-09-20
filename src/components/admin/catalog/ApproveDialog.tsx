'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, FileUp, Loader2, PencilLine, User } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ErrorState } from '@/components/ui/error-state';
import { catalogApi, type QuestionRow, type QuestionSetApprovalInfo } from '@/lib/api/catalog';
import { getErrorMessage } from '@/lib/api/errors';
import { cn } from '@/lib/utils';

type Choice = 'one' | 'all';

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

const SOURCE_TEXT: Record<QuestionSetApprovalInfo['source'], string> = {
  PDF_UPLOAD: 'Imported from an uploaded question paper',
  MANUAL: 'Added by hand in the admin panel',
  SYSTEM_GENERATED: 'Created automatically by the system',
};

function Fact({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="shrink-0 text-[var(--color-muted-foreground)]">{label}</span>
      <span className="min-w-0 font-medium">{value}</span>
    </div>
  );
}

function Tally({ label, value, tone }: { label: string; value: number; tone?: 'good' | 'warn' }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-center">
      <p
        className={cn(
          'text-lg font-bold leading-none',
          tone === 'good' && 'text-green-600 dark:text-green-400',
          tone === 'warn' && value > 0 && 'text-amber-600 dark:text-amber-400'
        )}
      >
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-[11px] text-[var(--color-muted-foreground)]">{label}</p>
    </div>
  );
}

function ChoiceCard({
  active,
  disabled,
  title,
  description,
  onSelect,
}: {
  active: boolean;
  disabled?: boolean;
  title: string;
  description: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors',
        active ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'border-[var(--color-border)]',
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-[var(--color-muted)]'
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2',
          active ? 'border-[var(--color-primary)]' : 'border-[var(--color-muted-foreground)]'
        )}
      >
        {active && <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-[var(--color-muted-foreground)]">{description}</span>
      </span>
    </button>
  );
}

interface ApproveDialogProps {
  question: QuestionRow;
  onClose: () => void;
}

/**
 * Asks whether to approve just this question or every question in its set, and
 * shows where the set came from so the decision is an informed one.
 */
export function ApproveDialog({ question, onClose }: ApproveDialogProps) {
  const queryClient = useQueryClient();
  const setId = question.questionSet?._id ?? null;
  const [choice, setChoice] = useState<Choice>('one');

  const { data: info, isLoading, isError, refetch } = useQuery({
    queryKey: ['catalog', 'approval-info', setId],
    queryFn: () => catalogApi.questionSetApprovalInfo(setId as string),
    enabled: Boolean(setId),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (choice === 'one') {
        await catalogApi.updateQuestion(question._id, { status: 'approved' });
        return { approved: 1, skipped: 0 };
      }
      return catalogApi.approveQuestionSet(setId as string);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] });
      if (result.skipped > 0) {
        toast.warning(`Approved ${result.approved}. ${result.skipped} still need a correct answer or text.`);
      } else {
        toast.success(`Approved ${result.approved} question${result.approved === 1 ? '' : 's'}.`);
      }
      onClose();
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not approve')),
  });

  const approvable = info?.questions.approvable ?? 0;
  const canApproveOne = question.hasAnswer;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Approve question{question.questionNumber ? ` #${question.questionNumber}` : ''}</DialogTitle>
          <DialogDescription>
            Approved questions can be used in tests students take. Choose how much to approve.
          </DialogDescription>
        </DialogHeader>

        {!setId ? (
          <p className="rounded-lg border border-[var(--color-border)] p-3 text-sm text-[var(--color-muted-foreground)]">
            This question does not belong to a question set, so only it can be approved.
          </p>
        ) : isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--color-muted-foreground)]" />
          </div>
        ) : isError || !info ? (
          <ErrorState message="Could not load the question set details." onRetry={() => refetch()} className="py-6" />
        ) : (
          <div className="space-y-4">
            <section className="space-y-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">Question set</p>
                <p className="text-sm font-semibold">{info.title.en}</p>
                {info.category && info.exam && (
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {info.category} › {info.exam}
                  </p>
                )}
              </div>

              <div className="space-y-1 border-t border-[var(--color-border)] pt-2">
                <div className="flex gap-2 text-sm">
                  {info.source === 'PDF_UPLOAD' ? (
                    <FileUp className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
                  ) : (
                    <PencilLine className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
                  )}
                  <span className="min-w-0">{SOURCE_TEXT[info.source]}</span>
                </div>
                <Fact label="Added by" value={info.addedBy ?? info.upload?.uploaderName ?? null} />
                <Fact label="Added on" value={formatDate(info.addedAt)} />
                <Fact label="Written by" value={info.authorName} />
                <Fact label="From file" value={info.upload?.fileName ?? null} />
                <Fact label="Uploaded by" value={info.upload?.uploadedBy ?? info.upload?.uploaderName ?? null} />
              </div>
            </section>

            <div className="grid grid-cols-4 gap-2">
              <Tally label="Total" value={info.questions.total} />
              <Tally label="Approved" value={info.questions.approved} tone="good" />
              <Tally label="Waiting" value={info.questions.pending} />
              <Tally label="Not ready" value={info.questions.blocked} tone="warn" />
            </div>

            <div className="space-y-2">
              <ChoiceCard
                active={choice === 'one'}
                disabled={!canApproveOne}
                onSelect={() => setChoice('one')}
                title="Approve only this question"
                description={
                  canApproveOne
                    ? 'Just the one you opened. Nothing else changes.'
                    : 'Not possible yet — this question has no correct answer chosen.'
                }
              />
              <ChoiceCard
                active={choice === 'all'}
                disabled={approvable === 0}
                onSelect={() => setChoice('all')}
                title={`Approve all questions in this set (${approvable.toLocaleString()})`}
                description={
                  approvable === 0
                    ? 'Nothing left to approve in this set.'
                    : `Every waiting question in this set becomes approved.${
                        info.questions.blocked > 0
                          ? ` ${info.questions.blocked} will be skipped — they still need a correct answer or text.`
                          : ''
                      }`
                }
              />
            </div>

            {choice === 'all' && info.questions.blocked > 0 && (
              <p className="flex gap-2 rounded-lg border border-amber-500/40 bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  {info.questions.blocked} question(s) will stay as they are until someone fills in the missing answer or
                  text.
                </span>
              </p>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="cta"
            className="gap-2"
            disabled={mutation.isPending || (choice === 'one' ? !canApproveOne : approvable === 0)}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {choice === 'one' ? 'Approve this question' : `Approve ${approvable.toLocaleString()} questions`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
