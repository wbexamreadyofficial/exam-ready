'use client';

import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { value: 'EN', label: 'EN' },
  { value: 'BN', label: 'বাং' },
] as const;

/**
 * Segmented BN/EN switch for the admin panel.
 *
 * Writes to the same store as the public `LanguageSwitcher`, but offers only
 * the two languages the admin copy is written in. If the app language is
 * currently Hindi (set from the public site), neither pill reads as selected
 * and the admin copy falls back to English — picking either one resolves it.
 */
export function AdminLangToggle() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  return (
    <div
      role="group"
      aria-label="Panel language"
      className="flex h-9 items-center gap-0.5 rounded-md border border-[var(--color-hairline)] p-0.5"
    >
      {OPTIONS.map((opt) => {
        const isActive = language === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setLanguage(opt.value)}
            aria-pressed={isActive}
            className={cn(
              'h-7 rounded px-2.5 text-xs font-semibold transition-colors',
              isActive
                ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
