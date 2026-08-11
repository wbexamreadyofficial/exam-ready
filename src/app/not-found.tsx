import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6"><span className="text-8xl font-black text-[var(--color-primary)]">404</span></div>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-[var(--color-muted-foreground)] mb-6">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild><Link href="/exams"><Search className="mr-2 h-4 w-4" />Browse Exams</Link></Button>
          <Button asChild><Link href="/"><Home className="mr-2 h-4 w-4" />Go Home</Link></Button>
        </div>
      </div>
    </div>
  );
}
