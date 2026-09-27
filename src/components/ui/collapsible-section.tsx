'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ELEVATED_CARD } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export function CollapsibleSection({
  icon: Icon,
  title,
  description,
  defaultOpen = false,
  children,
  className,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className={cn(ELEVATED_CARD, className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
        aria-expanded={open}
      >
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#e2691f] dark:bg-orange-500/15">
              <Icon className="h-4.5 w-4.5" />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold">{title}</h2>
            {description && (
              <p className="truncate text-xs text-[var(--color-muted-foreground)]">{description}</p>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            'h-4.5 w-4.5 shrink-0 text-[var(--color-muted-foreground)] transition-transform duration-300',
            open && 'rotate-180'
          )}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[var(--color-border)] p-5 pt-4">{children}</div>
        </div>
      </div>
    </Card>
  );
}
