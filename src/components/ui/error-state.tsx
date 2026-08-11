import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
interface ErrorStateProps { title?: string; message?: string; onRetry?: () => void; className?: string; }
export function ErrorState({ title='Something went wrong', message='An unexpected error occurred. Please try again.', onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20"><AlertCircle className="h-8 w-8 text-red-500" /></div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[var(--color-muted-foreground)] max-w-sm">{message}</p>
      {onRetry && (<Button onClick={onRetry} variant="outline" className="mt-4 gap-2"><RefreshCw className="h-4 w-4" />Try Again</Button>)}
    </div>
  );
}
