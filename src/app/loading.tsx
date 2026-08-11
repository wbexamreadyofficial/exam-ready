import { Spinner } from '@/components/ui/spinner';
export default function Loading() {
  return (<div className="flex min-h-screen items-center justify-center"><div className="flex flex-col items-center gap-4"><Spinner size="xl" /><p className="text-sm text-[var(--color-muted-foreground)]">Loading WB Exam Ready...</p></div></div>);
}
