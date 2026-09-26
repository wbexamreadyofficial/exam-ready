import { Badge } from '@/components/ui/badge';
import type { BlogStatus } from '@/types/blog';

export const BLOG_STATUS_META: Record<BlogStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'secondary' }> = {
  DRAFT: { label: 'Draft', variant: 'secondary' },
  PUBLISHED: { label: 'Published', variant: 'success' },
  SCHEDULED: { label: 'Scheduled', variant: 'info' },
  ARCHIVED: { label: 'Archived', variant: 'warning' },
};

export const BLOG_STATUS_OPTIONS = (Object.keys(BLOG_STATUS_META) as BlogStatus[]).map((key) => ({
  value: key,
  label: BLOG_STATUS_META[key].label,
}));

export const ACTIVE_OPTIONS = [
  { value: 'true', label: 'Active only' },
  { value: 'false', label: 'Archived only' },
];

export function BlogStatusBadge({ status }: { status: BlogStatus }) {
  const meta = BLOG_STATUS_META[status];
  return (
    <Badge variant={meta.variant} className="text-[10px]">
      {meta.label}
    </Badge>
  );
}

export const plural = (count: number, one: string, many = `${one}s`) =>
  `${count.toLocaleString()} ${count === 1 ? one : many}`;
