'use client';

import Link from 'next/link';
import { Menu, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { AdminLangToggle } from './AdminLangToggle';
import { useAdminT } from '@/lib/admin/i18n';

interface AdminTopbarProps {
  onOpenMenu: () => void;
}

export function AdminTopbar({ onOpenMenu }: AdminTopbarProps) {
  const { t } = useAdminT();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-[var(--color-hairline)] bg-[var(--color-card)]/95 px-3 backdrop-blur sm:px-5">
      {/* Mobile: opens the sidebar drawer. Hidden once the rail is visible. */}
      <button
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--color-hairline)] text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] lg:hidden"
      >
        <Menu size={18} />
      </button>

      <div className="min-w-0 flex-1">
        <span className="truncate text-sm font-bold sm:text-[15px]">{t.brand}</span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button asChild size="sm" className="hidden gap-1.5 font-semibold sm:inline-flex">
          <Link href="/admin/uploads/new">
            <FileUp className="h-4 w-4" />
            <span className="hidden md:inline">{t.nav.uploadPdf}</span>
            <span className="md:hidden">PDF</span>
          </Link>
        </Button>

        <AdminLangToggle />
        <ThemeSwitcher />
      </div>
    </header>
  );
}
