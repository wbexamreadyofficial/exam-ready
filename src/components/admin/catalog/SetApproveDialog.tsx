'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, Info, Loader2, Rocket } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { catalogApi, type QuestionSetRow } from '@/lib/api/catalog';
import { getErrorMessage } from '@/lib/api/errors';
import { cn } from '@/lib/utils';

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : null;

function Tally({ label, value, tone }: { label: string; value: number; tone?: 'good' | 'warn' | 'brand' }) {
  return (
    <div className="rounded-xl border border-orange-200/60 bg-white/70 px-3 py-3 text-center dark:border-orange-400/15 dark:bg-white/5">
      <p
        className={cn(
          'text-2xl font-black leading-none tabular-nums',
          tone === 'good' && 'text-green-600 dark:text-green-400',
          tone === 'brand' && 'text-[#e2691f]',
          tone === 'warn' && value > 0 && 'text-amber-600 dark:text-amber-400'
        )}
      >
        {value.toLocaleString()}
      </p>
      <p className="mt-1.5 text-[11px] font-semibold text-[var(--color-muted-foreground)]">{label}</p>
    </div>
  );
}

const SOURCE_TEXT = {
  PDF_UPLOAD: 'Imported from an uploaded question paper',
  MANUAL: 'Added by hand in the admin panel',
  SYSTEM_GENERATED: 'Created automatically by the system',
} as const;

/**
 * Approve a whole question set in one go: every ready question is approved and the set
 * is published, so students can take it. Questions that are not ready are left pending.
 */
export function SetApproveDialog({ set, onClose }: { set: QuestionSetRow; onClose: () => void }) {
  const queryClient = useQueryClient();

  const { data: info, isLoading, isError, refetch } = useQuery({
    queryKey: ['catalog', 'approval-info', set._id],
    queryFn: () => catalogApi.questionSetApprovalInfo(set._id),
  });

  const mutation = useMutation({
    mutationFn: () => catalogApi.approveSet(set._id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] });
      if (result.skipped > 0) {
        toast.warning(`Approved ${result.approved} and published the set. ${result.skipped} still need a correct answer.`);
      } else {
        toast.success(`Approved ${result.approved} question${result.approved === 1 ? '' : 's'} — the set is now live for students.`);
      }
      onClose();
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not approve this set')),
  });

  const counts = info?.questions;
  const nothingToApprove = counts ? counts.approvable === 0 && counts.approved === 0 : false;
  const alreadyLive = info?.status === 'published' && counts?.approvable === 0;

  return (
    <Dialog open onOpenChange={(open) => !open && !mutation.isPending && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden rounded-2xl border-orange-200/60 p-0 shadow-2xl shadow-orange-900/20 sm:max-w-xl dark:border-orange-400/20">
        <DialogHeader className="shrink-0 space-y-1.5 border-b border-orange-200/60 bg-gradient-to-br from-orange-50 via-white to-orange-50/40 px-6 pb-4 pt-6 pr-12 text-left dark:border-orange-400/15 dark:from-orange-500/10 dark:via-transparent dark:to-transparent">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#c95817] dark:text-orange-300">
            <span className="h-px w-5 bg-orange-400/70" />
            Approve question set
          </p>
          <DialogTitle className="text-xl leading-tight">{set.title.en}</DialogTitle>
          <DialogDescription>Approve every ready question and make this set available to students.</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5" data-lenis-prevent>
          {isLoading ? (
            <div className="space-y-4" aria-busy="true">
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} className="h-[68px] rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : isError || !info || !counts ? (
            <ErrorState message="Could not load this set." onRetry={() => refetch()} className="py-8" />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Tally label="Questions" value={counts.total} />
                <Tally label="Approved" value={counts.approved} tone="good" />
                <Tally label="Ready to approve" value={counts.approvable} tone="brand" />
                <Tally label="Need attention" value={counts.blocked + counts.rejected} tone="warn" />
              </div>

              <div className="space-y-1.5 rounded-xl border border-orange-200/70 bg-gradient-to-br from-orange-50/70 to-white p-3.5 text-sm dark:border-orange-400/20 dark:from-orange-500/10 dark:to-transparent">
                <p className="text-[var(--color-muted-foreground)]">
                  {[info.category, info.exam].filter(Boolean).join(' › ') || '—'}
                </p>
                <p className="text-xs text-[var(--color-muted-foreground)]">{SOURCE_TEXT[info.source]}</p>
                {info.upload?.fileName && <p className="text-xs text-[var(--color-muted-foreground)]">File: {info.upload.fileName}</p>}
                {(info.addedBy || info.authorName) && (
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {info.addedBy && <>Added by {info.addedBy}</>}
                    {info.authorName && <> · Author {info.authorName}</>}
                    {formatDate(info.addedAt) && <> · {formatDate(info.addedAt)}</>}
                  </p>
                )}
              </div>

              {nothingToApprove ? (
                <div className="flex gap-2.5 rounded-xl border border-amber-300/70 bg-amber-50 p-3.5 text-sm text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>None of the pending questions can be approved yet. Each needs question text and a chosen correct answer — edit them first.</p>
                </div>
              ) : alreadyLive ? (
                <div className="flex gap-2.5 rounded-xl border border-green-300/70 bg-green-50 p-3.5 text-sm text-green-800 dark:border-green-400/30 dark:bg-green-500/10 dark:text-green-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>This set is already live and every ready question is approved.</p>
                </div>
              ) : (
                <div className="flex gap-2.5 rounded-xl border border-orange-200/70 bg-orange-50/60 p-3.5 text-sm dark:border-orange-400/20 dark:bg-orange-500/5">
                  <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-[#e2691f]" />
                  <p>
                    <strong>{counts.approvable}</strong> question{counts.approvable === 1 ? '' : 's'} will be approved and the set will be{' '}
                    <strong>published</strong> — students will see it under its exam.
                  </p>
                </div>
              )}

              {counts.blocked > 0 && !nothingToApprove && (
                <div className="flex gap-2.5 text-xs text-[var(--color-muted-foreground)]">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <p>
                    {counts.blocked} question{counts.blocked === 1 ? ' has' : 's have'} no correct answer or text and will stay pending.
                    {counts.rejected > 0 && ` ${counts.rejected} rejected question${counts.rejected === 1 ? ' is' : 's are'} left as rejected.`}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t border-orange-200/60 bg-gradient-to-r from-white via-orange-50/40 to-orange-50/70 px-6 py-3.5 dark:border-orange-400/15 dark:from-transparent dark:via-transparent dark:to-orange-500/10">
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            className="gap-2 border-0 bg-gradient-to-br from-green-500 to-green-700 font-semibold text-white shadow-md shadow-green-600/30 ring-1 ring-inset ring-white/25 transition-all hover:-translate-y-px hover:bg-transparent hover:brightness-110 disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
            disabled={mutation.isPending || isLoading || isError || nothingToApprove || alreadyLive}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Approve &amp; publish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
