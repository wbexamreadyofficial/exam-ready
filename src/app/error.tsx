'use client';
import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  useEffect(() => { console.error('[WB Exam Ready Error]', error); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center"><div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20"><AlertCircle className="h-10 w-10 text-red-500" /></div></div>
        <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
        <p className="text-[var(--color-muted-foreground)] mb-6">An unexpected error occurred. Our team has been notified.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" />Try Again</Button>
          <Button asChild><Link href="/"><Home className="mr-2 h-4 w-4" />Go Home</Link></Button>
        </div>
      </div>
    </div>
  );
}
