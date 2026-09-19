'use client';

import Link from 'next/link';
import {
  FileUp, BookOpen, LayoutGrid, Library, FileText, ListChecks, HelpCircle, History, ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/PageHeader';
import { UploadSteps } from '@/components/admin/UploadSteps';
import { useAdminT } from '@/lib/admin/i18n';

export default function AdminDashboardPage() {
  const { t } = useAdminT();

  const sections = [
    { labelKey: 'categories', href: '/admin/categories', icon: LayoutGrid },
    { labelKey: 'subjects', href: '/admin/subjects', icon: Library },
    { labelKey: 'exams', href: '/admin/exams', icon: FileText },
    { labelKey: 'questionSets', href: '/admin/question-sets', icon: ListChecks },
    { labelKey: 'questions', href: '/admin/questions', icon: HelpCircle },
    { labelKey: 'uploadHistory', href: '/admin/uploads', icon: History },
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader title={t.dashboard.title} description={t.dashboard.subtitle} />

      {/* Primary actions — the two things an operator is most likely here to do */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Link href="/admin/uploads/new" className="group">
          <Card className="h-full border-orange-300/60 bg-gradient-to-br from-orange-50 via-white to-[var(--color-card)] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/15 dark:border-orange-400/25 dark:from-orange-500/15 dark:via-transparent dark:to-transparent">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f4953f] via-[#e2691f] to-[#c4501a] text-white shadow-md shadow-orange-600/30 ring-1 ring-inset ring-white/25">
                <FileUp className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="flex items-center gap-1.5 text-[15px] font-bold">
                  {t.dashboard.uploadCta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </h2>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-muted-foreground)]">
                  {t.dashboard.uploadCtaDesc}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/upload-guide" className="group">
          <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-orange-300/60 hover:shadow-md">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-borange-50)] text-[var(--color-accent)] dark:bg-[var(--color-borange-500)]/15">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="flex items-center gap-1.5 text-[15px] font-bold">
                  {t.dashboard.guideCta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </h2>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-muted-foreground)]">
                  {t.dashboard.guideCtaDesc}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* What the upload actually involves, so a first-time operator is not
          guessing before they open the wizard. */}
      <UploadSteps />

      {/* Section shortcuts */}
      <section>
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
          {t.dashboard.quickActions}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.href} href={s.href}>
                <Card className="h-full transition-colors hover:border-orange-300/70 hover:bg-orange-50/60 dark:hover:bg-orange-500/10">
                  <CardContent className="flex flex-col items-start gap-2 p-4">
                    <Icon className="h-5 w-5 text-[#e2691f]" />
                    <span className="text-[13px] font-semibold leading-snug">{t.nav[s.labelKey]}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
