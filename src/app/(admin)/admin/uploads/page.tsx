'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';
import { useUploadList } from '@/hooks/useQuestionUpload';
import { useAdminT } from '@/lib/admin/i18n';
import type { UploadStatus } from '@/types/questionUpload';

const STATUS_STYLES: Record<UploadStatus, string> = {
  committed: 'bg-[var(--color-bgreen-50)] text-[var(--color-bgreen-600)] dark:bg-[var(--color-bgreen-500)]/15',
  rejected: 'bg-[var(--color-bred-50)] text-[var(--color-bred-600)] dark:bg-[var(--color-bred-500)]/15',
  cancelled: 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]',
  ready: 'bg-orange-100 text-[#b9450d] dark:bg-orange-500/20 dark:text-orange-300',
  resolving: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  parsed: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
};

const FILTERS: (UploadStatus | 'all')[] = ['all', 'parsed', 'resolving', 'ready', 'committed', 'rejected'];

export default function UploadsPage() {
  const { t } = useAdminT();
  const [status, setStatus] = useState<UploadStatus | 'all'>('all');

  const { data: uploads = [], isLoading } = useUploadList(status === 'all' ? undefined : { status });

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.nav.uploadHistory}
        description={t.dashboard.uploadCtaDesc}
        actions={
          <Button
            asChild
            size="sm"
            className="gap-1.5 border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] font-semibold text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25 transition-all hover:-translate-y-px hover:bg-transparent hover:brightness-110 hover:shadow-lg hover:shadow-orange-600/40"
          >
            <Link href="/admin/uploads/new">
              <FileUp className="h-4 w-4" />
              {t.nav.uploadPdf}
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((value) => (
          <button
            key={value}
            onClick={() => setStatus(value)}
            className={cn(
              'rounded-md border px-3 py-1.5 text-[12.5px] font-semibold capitalize transition-colors',
              status === value
                ? 'border-orange-400 bg-orange-50 text-[#c95817] shadow-sm dark:bg-orange-500/15 dark:text-orange-300'
                : 'border-[var(--color-hairline)] hover:border-orange-300 hover:bg-orange-50/60 dark:hover:bg-orange-500/10'
            )}
          >
            {value}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2" aria-busy="true" aria-label={t.common.loading}>
          {Array.from({ length: 8 }, (_, i) => (
            <Card key={i}>
              <CardContent className="flex flex-wrap items-center gap-3 p-3.5">
                <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-1/3 max-w-72" />
                  <Skeleton className="h-3 w-1/4 max-w-52" />
                </div>
                <Skeleton className="h-5 w-20 shrink-0 rounded-full" />
                <Skeleton className="h-8 w-14 shrink-0 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : uploads.length === 0 ? (
        <Card>
          <CardContent className="px-6 py-14 text-center text-sm text-[var(--color-muted-foreground)]">
            {t.common.noResults}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {uploads.map((upload) => {
            // Rejected and committed uploads are finished; the rest can be resumed.
            const resumable = !['committed', 'rejected', 'cancelled'].includes(upload.status);

            return (
              <Card key={upload._id}>
                <CardContent className="flex flex-wrap items-center gap-3 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-muted)]">
                    <FileText className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold">
                      {upload.setName || upload.file.name}
                    </p>
                    <p className="truncate text-[11.5px] text-[var(--color-muted-foreground)]">
                      {upload.uploaderName} · {new Date(upload.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide',
                      STATUS_STYLES[upload.status]
                    )}
                  >
                    {upload.status}
                  </span>

                  {resumable && (
                    <Button asChild variant="outline" size="sm" className="shrink-0 text-[12px] hover:border-orange-300 hover:bg-orange-50 hover:text-[#c95817]">
                      <Link href={`/admin/uploads/new?resume=${upload._id}`}>{t.common.edit}</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
