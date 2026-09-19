'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, FileUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUploadList } from '@/hooks/useQuestionUpload';
import { useAdminT } from '@/lib/admin/i18n';
import type { UploadStatus } from '@/types/questionUpload';

const STATUS_STYLES: Record<UploadStatus, string> = {
  committed: 'bg-[var(--color-bgreen-50)] text-[var(--color-bgreen-600)] dark:bg-[var(--color-bgreen-500)]/15',
  rejected: 'bg-[var(--color-bred-50)] text-[var(--color-bred-600)] dark:bg-[var(--color-bred-500)]/15',
  cancelled: 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]',
  ready: 'bg-[var(--color-bblue-50)] text-[var(--color-primary)] dark:bg-[var(--color-bblue-700)]/20',
  resolving: 'bg-[var(--color-borange-50)] text-[var(--color-borange-600)] dark:bg-[var(--color-borange-500)]/15',
  parsed: 'bg-[var(--color-borange-50)] text-[var(--color-borange-600)] dark:bg-[var(--color-borange-500)]/15',
};

const FILTERS: (UploadStatus | 'all')[] = ['all', 'parsed', 'resolving', 'ready', 'committed', 'rejected'];

export default function UploadsPage() {
  const { t } = useAdminT();
  const [status, setStatus] = useState<UploadStatus | 'all'>('all');

  const { data: uploads = [], isLoading } = useUploadList(status === 'all' ? undefined : { status });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight sm:text-2xl">{t.nav.uploadHistory}</h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            {t.dashboard.uploadCtaDesc}
          </p>
        </div>
        <Button asChild size="sm" className="gap-1.5 font-semibold">
          <Link href="/admin/uploads/new">
            <FileUp className="h-4 w-4" />
            {t.nav.uploadPdf}
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((value) => (
          <button
            key={value}
            onClick={() => setStatus(value)}
            className={cn(
              'rounded-md border px-3 py-1.5 text-[12.5px] font-semibold capitalize transition-colors',
              status === value
                ? 'border-[var(--color-primary)] bg-[var(--color-bblue-50)] text-[var(--color-primary)] dark:bg-[var(--color-bblue-700)]/15'
                : 'border-[var(--color-hairline)] hover:bg-[var(--color-muted)]'
            )}
          >
            {value}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[var(--color-muted-foreground)]">
          <Loader2 className="h-5 w-5 animate-spin" />
          {t.common.loading}
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
                    <Button asChild variant="outline" size="sm" className="shrink-0 text-[12px]">
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
