import { cn } from '@/lib/utils';
import { ELEVATED_CARD } from '@/lib/constants';

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Primary/secondary buttons shown on the right (stack below on mobile). */
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-[var(--color-border)] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between',
        'bg-gradient-to-r from-white via-[#FFF6EC] to-[#FFE4CC]',
        'dark:from-[#0B1220] dark:via-[#1A1410] dark:to-[#3A1D08]',
        ELEVATED_CARD,
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-xl font-black leading-tight tracking-tight text-[var(--color-foreground)]">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 max-w-3xl text-[13px] leading-snug text-[var(--color-muted-foreground)]">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
