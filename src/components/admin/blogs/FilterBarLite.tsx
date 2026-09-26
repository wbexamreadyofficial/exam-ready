'use client';

import type { ReactNode } from 'react';
import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ALL } from './useBlogListState';

export function SearchBox({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={cn('relative min-w-0 flex-1 sm:max-w-sm', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9"
        aria-label={placeholder}
      />
    </div>
  );
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
  disabled,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  allLabel: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1 sm:w-52', className)}>
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">{label}</span>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function FilterBarLite({
  hasFilters,
  onClear,
  children,
  className,
}: {
  hasFilters: boolean;
  onClear: () => void;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end', className)}>
      {children}
      {hasFilters && (
        <Button variant="ghost" size="sm" className="gap-1.5 sm:self-end" onClick={onClear}>
          <X className="h-4 w-4" /> Clear
        </Button>
      )}
    </div>
  );
}
