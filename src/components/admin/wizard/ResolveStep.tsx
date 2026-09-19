'use client';

import { useMemo, useState } from 'react';
import { Check, CircleAlert, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/i18n';
import type { NameMatch, Resolution, ResolveInput } from '@/types/questionUpload';

interface ResolveStepProps {
  title: string;
  /** What the file called this thing. Undefined when the file does not say. */
  resolution: Resolution;
  /** Records we already hold whose names look like `resolution.parsedName`. */
  matches: NameMatch[];
  /** Everything of this kind, for when the file names nothing useful. */
  allOptions: NameMatch[];
  busy?: boolean;
  onSubmit: (input: ResolveInput) => void;
}

/**
 * Steps 4, 5 and 6 all ask the same question — "we found this name; do you
 * want the record we already have, or a new one?" — so they share this
 * component rather than three near-identical screens.
 *
 * An exact match is preselected, because in the common case the operator only
 * has to press Continue.
 */
export function ResolveStep({
  title,
  resolution,
  matches,
  allOptions,
  busy,
  onSubmit,
}: ResolveStepProps) {
  const { t } = useAdminT();
  const w = t.wizard;

  const exact = useMemo(() => matches.find((m) => m.exact), [matches]);
  const parsedName = resolution.parsedName?.trim();

  const [mode, setMode] = useState<'use_existing' | 'create_new'>(
    exact || matches.length > 0 || !parsedName ? 'use_existing' : 'create_new'
  );
  const [selectedId, setSelectedId] = useState<string>(exact?.id ?? '');
  const [newName, setNewName] = useState(parsedName ?? '');
  const [search, setSearch] = useState('');

  // Near-matches first: those are what the file actually pointed at.
  const listed = useMemo(() => {
    const seen = new Set(matches.map((m) => m.id));
    const rest = allOptions.filter((o) => !seen.has(o.id));
    const all = [...matches, ...rest];
    const needle = search.trim().toLowerCase();
    return needle ? all.filter((o) => o.name.toLowerCase().includes(needle)) : all;
  }, [matches, allOptions, search]);

  const canContinue =
    mode === 'use_existing' ? Boolean(selectedId) : newName.trim().length >= 2;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-black tracking-tight">{title}</h2>
        {parsedName ? (
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            {w.foundInFile}:{' '}
            <span className="font-semibold text-[var(--color-foreground)]">{parsedName}</span>
          </p>
        ) : (
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{w.nothingInFile}</p>
        )}
      </div>

      {/* What we know about it, so the choice below is not a blind one. */}
      {parsedName && (
        <div
          className={cn(
            'flex items-start gap-2 rounded-lg border p-3 text-[13px]',
            exact
              ? 'border-[var(--color-bgreen-100)] bg-[var(--color-bgreen-50)] dark:border-[var(--color-bgreen-500)]/25 dark:bg-[var(--color-bgreen-500)]/10'
              : 'border-[var(--color-borange-100)] bg-[var(--color-borange-50)] dark:border-[var(--color-borange-500)]/25 dark:bg-[var(--color-borange-500)]/10'
          )}
        >
          {exact ? (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-bgreen-600)]" />
          ) : (
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-borange-600)]" />
          )}
          <span>{exact ? w.weHaveThis : w.weDoNotHaveThis}</span>
        </div>
      )}

      {/* Two ways forward */}
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMode('use_existing')}
          className={cn(
            'rounded-lg border p-3 text-left text-[13.5px] font-semibold transition-colors',
            mode === 'use_existing'
              ? 'border-[var(--color-primary)] bg-[var(--color-bblue-50)] text-[var(--color-primary)] dark:bg-[var(--color-bblue-700)]/15'
              : 'border-[var(--color-hairline)] hover:bg-[var(--color-muted)]'
          )}
        >
          {w.chooseExisting}
        </button>
        <button
          type="button"
          onClick={() => setMode('create_new')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border p-3 text-left text-[13.5px] font-semibold transition-colors',
            mode === 'create_new'
              ? 'border-[var(--color-accent)] bg-[var(--color-borange-50)] text-[var(--color-accent)] dark:bg-[var(--color-borange-500)]/15'
              : 'border-[var(--color-hairline)] hover:bg-[var(--color-muted)]'
          )}
        >
          <Plus className="h-4 w-4" />
          {w.createNew}
        </button>
      </div>

      {mode === 'use_existing' ? (
        <Card>
          <CardContent className="p-3">
            {matches.length > 0 && !exact && (
              <p className="mb-2 text-[12.5px] font-semibold text-[var(--color-muted-foreground)]">
                {w.didYouMean}
              </p>
            )}

            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.common.search}
                className="h-9 pl-8 text-[13px]"
              />
            </div>

            <div className="max-h-64 space-y-1 overflow-y-auto">
              {listed.length === 0 && (
                <p className="px-2 py-6 text-center text-[13px] text-[var(--color-muted-foreground)]">
                  {t.common.noResults}
                </p>
              )}
              {listed.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedId(option.id)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-[13.5px] transition-colors',
                    selectedId === option.id
                      ? 'bg-[var(--color-bblue-50)] font-semibold text-[var(--color-primary)] dark:bg-[var(--color-bblue-700)]/20'
                      : 'hover:bg-[var(--color-muted)]'
                  )}
                >
                  <span className="truncate">{option.name}</span>
                  {option.exact && (
                    <span className="shrink-0 rounded-full bg-[var(--color-bgreen-100)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-bgreen-600)] dark:bg-[var(--color-bgreen-500)]/20">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <label className="mb-1.5 block text-[12.5px] font-semibold">{w.newNameLabel}</label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={parsedName}
              className="text-[13.5px]"
            />
          </CardContent>
        </Card>
      )}

      <Button
        className="w-full font-bold sm:w-auto"
        disabled={!canContinue || busy}
        onClick={() =>
          onSubmit(
            mode === 'use_existing'
              ? { action: 'use_existing', existingId: selectedId }
              : { action: 'create_new', newName: newName.trim() }
          )
        }
      >
        {busy ? t.common.saving : w.continue}
      </Button>
    </div>
  );
}
