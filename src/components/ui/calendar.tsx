'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { buttonVariants } from './button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/** shadcn-style Calendar for react-day-picker v9, themed with the app's tokens. */
function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'relative flex flex-col gap-6 sm:flex-row',
        month: 'space-y-3',
        month_caption: 'flex h-8 items-center justify-center',
        caption_label: 'text-sm font-semibold',
        nav: 'absolute inset-x-0 top-0 z-10 flex items-center justify-between',
        button_previous: cn(buttonVariants({ variant: 'outline' }), 'h-8 w-8 p-0'),
        button_next: cn(buttonVariants({ variant: 'outline' }), 'h-8 w-8 p-0'),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'w-9 text-[0.75rem] font-medium text-[var(--color-muted-foreground)]',
        week: 'mt-1 flex w-full',
        day: 'relative h-9 w-9 p-0 text-center text-sm',
        day_button: cn(
          'h-9 w-9 rounded-md font-normal transition-colors',
          'hover:bg-[var(--color-accent)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]'
        ),
        range_start:
          'rounded-l-md bg-[var(--color-primary)]/15 [&>button]:bg-[var(--color-primary)] [&>button]:font-semibold [&>button]:text-white [&>button]:hover:bg-[var(--color-primary)]',
        range_end:
          'rounded-r-md bg-[var(--color-primary)]/15 [&>button]:bg-[var(--color-primary)] [&>button]:font-semibold [&>button]:text-white [&>button]:hover:bg-[var(--color-primary)]',
        range_middle: 'rounded-none bg-[var(--color-primary)]/15 [&>button]:hover:bg-transparent',
        selected: '',
        today: '[&>button]:font-bold [&>button]:text-[var(--color-cta)]',
        outside: 'opacity-40',
        disabled: 'opacity-30',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
