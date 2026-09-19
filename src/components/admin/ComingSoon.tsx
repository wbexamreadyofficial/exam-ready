'use client';

import Link from 'next/link';
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAdminT } from '@/lib/admin/i18n';

interface ComingSoonProps {
  title: string;
  /** One line on what this section will do, so the page still says something. */
  note?: string;
}

/**
 * Stand-in for admin sections that are routed but not built yet. Keeps every
 * sidebar link resolving to a real page instead of a 404 while the panel is
 * under construction.
 */
export function ComingSoon({ title, note }: ComingSoonProps) {
  const { t } = useAdminT();

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black tracking-tight sm:text-2xl">{title}</h1>

      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
            <Construction className="h-6 w-6" />
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[var(--color-muted-foreground)]">
            {note ?? t.common.noResults}
          </p>
          <Button asChild variant="outline" size="sm" className="mt-1 gap-1.5">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
              {t.nav.dashboard}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
