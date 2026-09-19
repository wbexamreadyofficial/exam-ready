'use client';

import * as React from 'react';
import { endOfDay, format, startOfDay, startOfMonth, subDays } from 'date-fns';
import { CalendarDays, X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  /** Latest selectable day (defaults to today). */
  maxDate?: Date;
}

const PRESETS: { label: string; range: () => DateRange }[] = [
  { label: 'Today', range: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
  { label: 'Last 7 days', range: () => ({ from: startOfDay(subDays(new Date(), 6)), to: endOfDay(new Date()) }) },
  { label: 'Last 30 days', range: () => ({ from: startOfDay(subDays(new Date(), 29)), to: endOfDay(new Date()) }) },
  { label: 'This month', range: () => ({ from: startOfMonth(new Date()), to: endOfDay(new Date()) }) },
];

function formatRange(range?: DateRange): string | null {
  if (!range?.from) return null;
  if (!range.to) return format(range.from, 'dd MMM yyyy');
  return `${format(range.from, 'dd MMM yyyy')} – ${format(range.to, 'dd MMM yyyy')}`;
}

/** shadcn-style date range picker: popover + two-month range calendar + quick presets. */
export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pick a date range',
  className,
  maxDate = new Date(),
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  // Holds an in-progress selection so a half-picked range doesn't trigger a fetch.
  const [draft, setDraft] = React.useState<DateRange | undefined>(value);

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(value);
    setOpen(next);
  };

  const handleSelect = (range: DateRange | undefined) => {
    setDraft(range);
    if (range?.from && range.to) {
      onChange({ from: startOfDay(range.from), to: endOfDay(range.to) });
      setOpen(false);
    }
  };

  const label = formatRange(value);

  return (
    <div className={cn('relative inline-flex', className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              'h-10 w-full justify-start gap-2 px-3 font-normal',
              !label && 'text-[var(--color-muted-foreground)]',
              label && 'pr-9'
            )}
          >
            <CalendarDays className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
            <span className="truncate">{label ?? placeholder}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <div className="flex flex-col sm:flex-row">
            <div className="flex flex-row flex-wrap gap-1 border-b border-[var(--color-border)] p-3 sm:w-36 sm:flex-col sm:flex-nowrap sm:border-b-0 sm:border-r">
              <p className="hidden px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)] sm:block">
                Quick select
              </p>
              {PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    onChange(preset.range());
                    setOpen(false);
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <Calendar
              mode="range"
              numberOfMonths={2}
              defaultMonth={value?.from ?? subDays(maxDate, 30)}
              selected={draft}
              onSelect={handleSelect}
              disabled={{ after: maxDate }}
            />
          </div>
        </PopoverContent>
      </Popover>

      {label && (
        <button
          type="button"
          aria-label="Clear date range"
          onClick={() => onChange(undefined)}
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-accent)]/15 hover:text-[var(--color-foreground)]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
