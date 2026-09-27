import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Compact button that opens a related list; its count tells the admin what to expect before clicking. */
export function RelationButton({
  icon: Icon,
  label,
  count,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <Button variant="outline" size="sm" className="group h-8 gap-1.5 px-2.5 text-xs" onClick={onClick} title={`Show ${label.toLowerCase()}`}>
      <Icon className="h-3.5 w-3.5 text-[#e2691f] transition-colors group-hover:text-white" />
      {label}
      <span className="rounded bg-[var(--color-muted)] px-1.5 py-px text-[10px] font-bold text-[var(--color-foreground)] transition-colors group-hover:bg-white/25 group-hover:text-white">
        {count.toLocaleString()}
      </span>
    </Button>
  );
}
