'use client';

import { useEffect, useState } from 'react';
import { Check, CircleAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { questionUploadsApi } from '@/lib/api/questionUploads';
import { useAdminT } from '@/lib/admin/i18n';
import { useDebounce } from '@/hooks/useDebounce';
import type { NameCheckResult } from '@/types/questionUpload';
import type { QuestionSet } from '@/lib/api/taxonomy';

interface NameStepProps {
  uploadId: string;
  initialName: string;
  /** Existing question sets under the resolved exam — shown as taken-name hints. */
  existingSets?: QuestionSet[];
  busy?: boolean;
  onSubmit: (name: string) => void;
}

/**
 * Step 7 — the set name, checked against the exam as it is typed.
 *
 * The check runs on a debounce rather than on submit so a clash is visible
 * (with a free alternative offered) before the operator commits to the name.
 */
export function NameStep({ uploadId, initialName, existingSets = [], busy, onSubmit }: NameStepProps) {
  const { t, lang } = useAdminT();
  const w = t.wizard;

  const [name, setName] = useState(initialName);
  const [result, setResult] = useState<NameCheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const debounced = useDebounce(name, 400);

  useEffect(() => {
    const trimmed = debounced.trim();
    if (trimmed.length < 3) {
      setResult(null);
      return;
    }

    let cancelled = false;
    setChecking(true);

    questionUploadsApi
      .checkName(uploadId, trimmed)
      .then((response) => {
        // A slow earlier request must not overwrite a newer answer.
        if (!cancelled) setResult(response);
      })
      .catch(() => {
        if (!cancelled) setResult(null);
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, uploadId]);

  const message = result && !result.available
    ? (lang === 'BN' ? result.messageBn : result.message) ?? ''
    : '';

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-black tracking-tight">{w.nameStepTitle}</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{w.nameStepHelp}</p>
      </div>

      <div>
        <label className="mb-1.5 block text-[12.5px] font-semibold">{w.nameLabel}</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} className="text-[14px]" />

        <div className="mt-2 min-h-[22px] text-[12.5px]">
          {checking && (
            <span className="inline-flex items-center gap-1.5 text-[var(--color-muted-foreground)]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {w.nameChecking}
            </span>
          )}

          {!checking && result?.available && (
            <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-bgreen-600)]">
              <Check className="h-3.5 w-3.5" />
              {w.nameFree}
            </span>
          )}

          {!checking && result && !result.available && (
            <span className="inline-flex flex-wrap items-center gap-2 text-[var(--color-bred-600)]">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <CircleAlert className="h-3.5 w-3.5" />
                {message}
              </span>
              {result.suggestion && (
                <button
                  type="button"
                  onClick={() => setName(result.suggestion!)}
                  className="rounded-md border border-[var(--color-hairline)] px-2 py-0.5 text-[11.5px] font-semibold text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                >
                  {w.useSuggestion} “{result.suggestion}”
                </button>
              )}
            </span>
          )}
        </div>
      </div>

      {existingSets.length > 0 && (
        <div className="rounded-lg border border-[var(--color-hairline)] p-3">
          <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Already in this exam
          </p>
          <ul className="space-y-0.5">
            {existingSets.map((s) => (
              <li key={s._id} className="text-[12.5px] text-[var(--color-foreground)]">
                {s.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        className="w-full font-bold sm:w-auto"
        disabled={busy || checking || !result?.available}
        onClick={() => onSubmit(name.trim())}
      >
        {busy ? t.common.saving : w.confirmName}
      </Button>
    </div>
  );
}
