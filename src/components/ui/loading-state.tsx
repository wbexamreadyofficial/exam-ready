import { Spinner } from './spinner';
import { cn } from '@/lib/utils';
interface LoadingStateProps { message?: string; className?: string; }
export function LoadingState({ message='Loading...', className }: LoadingStateProps) {
  return (<div className={cn('flex flex-col items-center justify-center py-16 gap-4', className)}><Spinner size="lg" /><p className="text-sm text-[var(--color-muted-foreground)]">{message}</p></div>);
}
