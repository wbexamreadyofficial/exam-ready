'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/i18n';
import type { NameMatch, Resolution, SubjectResolveInput } from '@/types/questionUpload';
import type { Subject } from '@/lib/api/taxonomy';

interface SubjectsStepProps {
  resolutions: Resolution[];
  matchesByName: { parsedName: string; matches: NameMatch[] }[];
  allSubjects: Subject[];
  busy?: boolean;
  onSubmit: (subjects: SubjectResolveInput[]) => void;
}

/**
 * Step 5 decides every subject at once.
 *
 * A paper can easily name six subjects, and asking about them one screen at a
 * time would turn the wizard into a slog — so each is a row, with its existing
 * match preselected where we have one.
 */
export function SubjectsStep({
  resolutions,
  matchesByName,
  allSubjects,
  busy,
  onSubmit,
}: SubjectsStepProps) {
  const { t } = useAdminT();
  const w = t.wizard;

  const [choices, setChoices] = useState<Record<string, SubjectResolveInput>>(() => {
    const initial: Record<string, SubjectResolveInput> = {};
    for (const resolution of resolutions) {
      const parsedName = resolution.parsedName ?? '';
      const exact = matchesByName.find((m) => m.parsedName === parsedName)?.matches.find((m) => m.exact);

      initial[parsedName] = exact
        ? { parsedName, action: 'use_existing', existingId: exact.id }
        : { parsedName, action: 'create_new', newName: parsedName };
    }
    return initial;
  });

  const update = (parsedName: string, patch: Partial<SubjectResolveInput>) =>
    setChoices((prev) => ({
      ...prev,
      [parsedName]: { ...prev[parsedName], parsedName, ...patch } as SubjectResolveInput,
    }));

  const ready = Object.values(choices).every((choice) =>
    choice.action === 'use_existing' ? Boolean(choice.existingId) : (choice.newName ?? '').trim().length >= 2
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-black tracking-tight">{w.subjectStepTitle}</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{w.subjectStepHelp}</p>
      </div>

      <div className="space-y-2">
        {resolutions.map((resolution) => {
          const parsedName = resolution.parsedName ?? '';
          const matches = matchesByName.find((m) => m.parsedName === parsedName)?.matches ?? [];
          const exact = matches.find((m) => m.exact);
          const choice = choices[parsedName];
          if (!choice) return null;

          return (
            <Card key={parsedName}>
              <CardContent className="p-3 sm:p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-bold">{parsedName}</span>
                  {exact ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bgreen-50)] px-2 py-0.5 text-[10.5px] font-bold text-[var(--color-bgreen-600)] dark:bg-[var(--color-bgreen-500)]/15">
                      <Check className="h-3 w-3" />
                      {w.weHaveThis}
                    </span>
                  ) : (
                    <span className="rounded-full bg-[var(--color-borange-50)] px-2 py-0.5 text-[10.5px] font-bold text-[var(--color-borange-600)] dark:bg-[var(--color-borange-500)]/15">
                      {w.weDoNotHaveThis}
                    </span>
                  )}
                </div>

                <div className="grid gap-2 sm:grid-cols-[auto_1fr]">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        update(parsedName, {
                          action: 'use_existing',
                          existingId: exact?.id ?? matches[0]?.id ?? allSubjects[0]?._id,
                        })
                      }
                      className={cn(
                        'rounded-md border px-2.5 py-1.5 text-[12px] font-semibold transition-colors',
                        choice.action === 'use_existing'
                          ? 'border-[var(--color-primary)] bg-[var(--color-bblue-50)] text-[var(--color-primary)] dark:bg-[var(--color-bblue-700)]/15'
                          : 'border-[var(--color-hairline)] hover:bg-[var(--color-muted)]'
                      )}
                    >
                      {w.chooseExisting}
                    </button>
                    <button
                      type="button"
                      onClick={() => update(parsedName, { action: 'create_new', newName: parsedName })}
                      className={cn(
                        'flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-[12px] font-semibold transition-colors',
                        choice.action === 'create_new'
                          ? 'border-[var(--color-accent)] bg-[var(--color-borange-50)] text-[var(--color-accent)] dark:bg-[var(--color-borange-500)]/15'
                          : 'border-[var(--color-hairline)] hover:bg-[var(--color-muted)]'
                      )}
                    >
                      <Plus className="h-3 w-3" />
                      {w.createNew}
                    </button>
                  </div>

                  {choice.action === 'use_existing' ? (
                    <select
                      value={choice.existingId ?? ''}
                      onChange={(e) => update(parsedName, { existingId: e.target.value })}
                      className="h-9 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-2 text-[13px]"
                    >
                      <option value="">{w.pickPlaceholder}</option>
                      {allSubjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      value={choice.newName ?? ''}
                      onChange={(e) => update(parsedName, { newName: e.target.value })}
                      className="h-9 text-[13px]"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button
        className="w-full font-bold sm:w-auto"
        disabled={!ready || busy}
        onClick={() => onSubmit(Object.values(choices))}
      >
        {busy ? t.common.saving : w.continue}
      </Button>
    </div>
  );
}
