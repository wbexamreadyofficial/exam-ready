import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ELEVATED_CARD } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  /** Tailwind classes for the icon tile, e.g. "bg-blue-100 text-blue-600". */
  tone: string;
}

export function KpiCard({ icon: Icon, label, value, sub, tone }: KpiCardProps) {
  return (
    <Card className={ELEVATED_CARD}>
      <CardContent className="flex items-center gap-4 p-5">
        <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', tone)}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {label}
          </p>
          <p className="truncate text-2xl font-black leading-tight tabular-nums">{value}</p>
          {sub && <p className="truncate text-xs text-[var(--color-muted-foreground)]">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiCardSkeleton() {
  return <Skeleton className={cn('h-[92px] rounded-xl', ELEVATED_CARD)} />;
}
