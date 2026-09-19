'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

export interface AutocompleteProps<T> {
  /** Namespaces the react-query cache; must be unique per data source. */
  queryKey: string;
  /** Called with the debounced text ('' when nothing is typed) to load suggestions. */
  fetchOptions: (query: string) => Promise<T[]>;
  getOptionKey: (option: T) => string;
  renderOption: (option: T, context: { query: string; active: boolean }) => React.ReactNode;
  /** Free text currently typed (kept by the parent so it can also drive a plain text search). */
  inputValue: string;
  onInputChange: (value: string) => void;
  /** The option the user picked. While set, the field shows it instead of the text input. */
  selected: T | null;
  renderSelected: (option: T) => React.ReactNode;
  onSelect: (option: T | null) => void;
  placeholder?: string;
  ariaLabel?: string;
  debounceMs?: number;
  /** Heading shown above the list; receives the debounced query. */
  heading?: (query: string) => string;
  emptyLabel?: string;
  className?: string;
}

/**
 * Generic search-as-you-type field. Opens a suggestion list on focus/click
 * (even with no text), refetches as you type, supports keyboard navigation, and
 * turns into a clearable "selected" chip once an option is chosen.
 */
export function Autocomplete<T>({
  queryKey,
  fetchOptions,
  getOptionKey,
  renderOption,
  inputValue,
  onInputChange,
  selected,
  renderSelected,
  onSelect,
  placeholder = 'Search…',
  ariaLabel,
  debounceMs = 250,
  heading = (query) => (query ? 'Suggestions' : 'Suggestions'),
  emptyLabel = 'No results found',
  className,
}: AutocompleteProps<T>) {
  const listId = React.useId();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const debounced = useDebounce(inputValue, debounceMs).trim();

  const { data, isFetching, isError } = useQuery({
    queryKey: ['autocomplete', queryKey, debounced],
    queryFn: () => fetchOptions(debounced),
    enabled: open && !selected,
    placeholderData: (previous) => previous,
    staleTime: 15_000,
  });

  const options = data ?? [];
  const active = activeIndex < options.length ? activeIndex : -1;
  const searching = isFetching || inputValue.trim() !== debounced;
  const optionId = (index: number) => `${listId}-option-${index}`;

  // Close when clicking anywhere outside the field.
  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  // Keep the keyboard-highlighted option in view.
  React.useEffect(() => {
    if (open && active >= 0) {
      document.getElementById(`${listId}-option-${active}`)?.scrollIntoView({ block: 'nearest' });
    }
  }, [active, open, listId]);

  const choose = (option: T) => {
    onSelect(option);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(options.length === 0 ? -1 : Math.min(active + 1, options.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(Math.max(active - 1, 0));
    } else if (event.key === 'Enter') {
      const option = options[active];
      if (open && option !== undefined) {
        event.preventDefault();
        choose(option);
      }
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const fieldClasses =
    'flex h-10 w-full items-center rounded-md border border-[var(--color-input)] bg-[var(--color-background)] text-sm transition-colors';

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {selected ? (
        <div className={cn(fieldClasses, 'gap-2 px-2')}>
          <div className="min-w-0 flex-1">{renderSelected(selected)}</div>
          <button
            type="button"
            aria-label="Clear selection"
            onClick={() => onSelect(null)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-accent)]/15 hover:text-[var(--color-foreground)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
          <input
            type="text"
            role="combobox"
            aria-label={ariaLabel ?? placeholder}
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
            autoComplete="off"
            placeholder={placeholder}
            value={inputValue}
            onChange={(event) => {
              onInputChange(event.target.value);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className={cn(
              fieldClasses,
              'px-3 pl-9 pr-9 placeholder:text-[var(--color-muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 ring-offset-[var(--color-background)]'
            )}
          />
          {searching && open ? (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[var(--color-muted-foreground)]" />
          ) : inputValue ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                onInputChange('');
                setActiveIndex(-1);
              }}
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-accent)]/15 hover:text-[var(--color-foreground)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      )}

      {open && !selected && (
        <div className="absolute z-50 mt-1 w-full min-w-72 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-popover)] text-[var(--color-popover-foreground)] shadow-lg">
          <p className="border-b border-[var(--color-border)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {heading(debounced)}
          </p>
          <ul
            id={listId}
            role="listbox"
            // Lenis (global smooth scroll) otherwise swallows the wheel and scrolls the page instead.
            data-lenis-prevent
            className="max-h-72 overflow-y-auto overscroll-contain p-1"
          >
            {options.map((option, index) => (
              <li
                key={getOptionKey(option)}
                id={optionId(index)}
                role="option"
                aria-selected={index === active}
                // mousedown (not click) so the input doesn't lose focus and close the list first.
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(option);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  'cursor-pointer rounded-sm px-2 py-1.5',
                  index === active && 'bg-[var(--color-accent)]/15'
                )}
              >
                {renderOption(option, { query: debounced, active: index === active })}
              </li>
            ))}
            {options.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-[var(--color-muted-foreground)]">
                {isError ? 'Could not load suggestions' : searching ? 'Searching…' : emptyLabel}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
