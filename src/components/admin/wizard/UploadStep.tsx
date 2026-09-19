'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { BookOpen, FileText, Info, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/i18n';

const MAX_MB = 20;
const ACCEPT = '.docx,.pdf,.txt';

interface UploadStepProps {
  busy?: boolean;
  progress: number;
  defaultName?: string;
  onSubmit: (file: File, uploaderName: string) => void;
}

export function UploadStep({ busy, progress, defaultName = '', onSubmit }: UploadStepProps) {
  const { t } = useAdminT();
  const w = t.wizard;

  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState(defaultName);
  const [dragging, setDragging] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const accept = (candidate: File | undefined) => {
    if (!candidate) return;
    if (candidate.size > MAX_MB * 1024 * 1024) {
      setSizeError(`Max ${MAX_MB} MB`);
      return;
    }
    setSizeError(null);
    setFile(candidate);
  };

  return (
    <div className="w-full space-y-5">
      <div>
        <h2 className="text-lg font-black tracking-tight">{w.title}</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{w.subtitle}</p>
      </div>

      {/* Bengali cannot survive a PDF round-trip, so this is stated up front
          rather than discovered after the parse. */}
      <div className="flex gap-2.5 rounded-xl border border-orange-200/80 bg-gradient-to-br from-orange-50 to-white p-4 shadow-sm dark:border-orange-400/25 dark:from-orange-500/10 dark:to-transparent">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#e2691f]" />
        <div className="min-w-0 text-[12.5px] leading-relaxed">
          <p>{w.docxNotice}</p>
          <Link
            href="/admin/upload-guide"
            className="mt-1 inline-flex items-center gap-1 font-semibold text-[#c95817] hover:underline dark:text-orange-300"
          >
            <BookOpen className="h-3.5 w-3.5" />
            {w.viewGuide}
          </Link>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[12.5px] font-semibold">{w.uploaderName}</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={w.uploaderNamePlaceholder}
          className="text-[13.5px]"
        />
      </div>

      {file ? (
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[#e2691f] dark:bg-orange-500/15">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold">{file.name}</p>
              <p className="text-[11.5px] text-[var(--color-muted-foreground)]">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {busy && progress > 0 && progress < 100 && (
                <Progress value={progress} className="mt-1.5 h-1" />
              )}
            </div>
            {!busy && (
              <button
                onClick={() => setFile(null)}
                aria-label={w.removeFile}
                className="shrink-0 rounded-md p-1.5 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            accept(e.dataTransfer.files[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'cursor-pointer rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-all duration-300 sm:py-24',
            dragging
              ? 'scale-[1.005] border-[#e2691f] bg-orange-100/70 shadow-lg shadow-orange-500/15 dark:bg-orange-500/15'
              : 'border-orange-300/70 bg-gradient-to-br from-orange-50/70 via-white to-white hover:border-[#e2691f] hover:shadow-md hover:shadow-orange-500/10 dark:border-orange-400/30 dark:from-orange-500/10 dark:via-transparent dark:to-transparent'
          )}
        >
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-lg shadow-orange-600/30 ring-1 ring-inset ring-white/25">
            <Upload className="h-7 w-7" />
          </span>
          <p className="text-base font-bold">{w.dropTitle}</p>
          <p className="mt-1 text-[13.5px] text-[var(--color-muted-foreground)]">{w.dropHint}</p>
          <p className="mt-3 text-[12px] text-[var(--color-muted-foreground)]">{w.dropFormats}</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => accept(e.target.files?.[0])}
          />
        </div>
      )}

      {sizeError && <p className="text-[12.5px] text-[var(--color-bred-600)]">{sizeError}</p>}

      <Button
        className="w-full gap-2 font-bold sm:w-auto border-0 bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25 transition-all hover:-translate-y-px hover:bg-transparent hover:brightness-110 hover:shadow-lg hover:shadow-orange-600/40 disabled:opacity-50 disabled:shadow-none"
        disabled={!file || name.trim().length < 2 || busy}
        onClick={() => file && onSubmit(file, name.trim())}
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {busy ? w.reading : w.startUpload}
      </Button>
    </div>
  );
}
