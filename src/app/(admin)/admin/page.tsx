'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  FileUp, BookOpen, LayoutGrid, Library, FileText, ListChecks, HelpCircle, History, ArrowRight,
  Users, ClipboardCheck, Inbox, UploadCloud, Percent,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/layout/PageHeader';
import { KpiCard, KpiCardSkeleton } from '@/components/admin/KpiCard';
import { Skeleton } from '@/components/ui/skeleton';
import { UploadSteps } from '@/components/admin/UploadSteps';
import { useAdminT } from '@/lib/admin/i18n';
import { adminApi } from '@/lib/api/admin';
import { timeAgo } from '@/lib/userFormat';

const CHART_COLORS = ['hsl(43,96%,46%)', 'hsl(217,91%,60%)', 'hsl(280,65%,60%)', 'hsl(0,84%,60%)'];

const UPLOAD_STATUS_BADGE: Record<string, NonNullable<BadgeProps['variant']>> = {
  committed: 'success',
  ready: 'info',
  resolving: 'warning',
  parsed: 'warning',
  rejected: 'destructive',
  cancelled: 'outline',
};

function shortDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export default function AdminDashboardPage() {
  const { t } = useAdminT();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () =>
      adminApi.getDashboard({
        days: 14,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    staleTime: 60_000,
  });

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

      {isError && (
        <ErrorState message="Could not load dashboard stats." onRetry={() => refetch()} />
      )}

      {isLoading && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <KpiCardSkeleton key={i} />
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="mt-2 h-3.5 w-56" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[240px] w-full rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent uploads */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="mt-2 h-3.5 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[86px] rounded-xl" />
            ))}
          </div>
        </>
      )}

      {data && (
        <>
          {/* KPIs — the numbers an operator checks first thing */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            <KpiCard
              icon={Users}
              label="Total Users"
              value={data.users.total.toLocaleString('en-IN')}
              sub={`+${data.users.newToday} today`}
              tone="bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
            />
            <KpiCard
              icon={ListChecks}
              label="Question Sets"
              value={data.content.questionSets.total.toLocaleString('en-IN')}
              sub={`${data.content.questionSets.published} published`}
              tone="bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400"
            />
            <KpiCard
              icon={HelpCircle}
              label="Question Bank"
              value={data.content.questions.total.toLocaleString('en-IN')}
              sub={`${data.content.questions.pending} pending review`}
              tone="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
            />
            <KpiCard
              icon={ClipboardCheck}
              label="Test Attempts"
              value={data.attempts.total.toLocaleString('en-IN')}
              sub={`${data.attempts.today} today`}
              tone="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
            />
            <KpiCard
              icon={Percent}
              label="Avg. Score"
              value={data.attempts.avgScorePercent !== null ? `${data.attempts.avgScorePercent}%` : '—'}
              sub="Across all attempts"
              tone="bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400"
            />
            <KpiCard
              icon={Inbox}
              label="Contact Inbox"
              value={data.contacts.total.toLocaleString('en-IN')}
              sub={`${data.contacts.open} unread`}
              tone="bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
            />
          </div>

          {/* Charts — trends and composition, so a dip or spike is visible without opening a report */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">New Registrations</CardTitle>
                <CardDescription>Daily sign-ups over the last 14 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={data.registrations}>
                    <defs>
                      <linearGradient id="regFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(43,96%,46%)" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="hsl(43,96%,46%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" tickFormatter={shortDate} fontSize={11} />
                    <YAxis allowDecimals={false} fontSize={11} />
                    <Tooltip labelFormatter={(v) => shortDate(String(v))} />
                    <Area type="monotone" dataKey="count" stroke="hsl(43,96%,46%)" fill="url(#regFill)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Test Attempts</CardTitle>
                <CardDescription>Submitted mock tests &amp; practice sets per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={data.attempts.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" tickFormatter={shortDate} fontSize={11} />
                    <YAxis allowDecimals={false} fontSize={11} />
                    <Tooltip labelFormatter={(v) => shortDate(String(v))} />
                    <Bar dataKey="count" fill="#e2691f" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Users by Role</CardTitle>
                <CardDescription>Where every registered account sits today</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={Object.entries(data.users.byRole).map(([role, v]) => ({ name: role, value: v.total }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {Object.keys(data.users.byRole).map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upload Pipeline</CardTitle>
                <CardDescription>Every PDF import, by where it stands</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {[
                  { label: 'Committed', value: data.uploads.committed, tone: 'bg-emerald-500' },
                  { label: 'In progress', value: data.uploads.inProgress, tone: 'bg-amber-500' },
                  {
                    label: 'Rejected / cancelled',
                    value: data.uploads.total - data.uploads.committed - data.uploads.inProgress,
                    tone: 'bg-rose-500',
                  },
                ].map((row) => {
                  const pct = data.uploads.total > 0 ? Math.round((row.value / data.uploads.total) * 100) : 0;
                  return (
                    <div key={row.label}>
                      <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                        <span>{row.label}</span>
                        <span className="tabular-nums text-[var(--color-muted-foreground)]">{row.value}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
                        <div className={`h-full rounded-full ${row.tone}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                <p className="pt-1 text-xs text-[var(--color-muted-foreground)]">
                  {data.uploads.today} file{data.uploads.today === 1 ? '' : 's'} uploaded today · {data.uploads.total} total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent uploads — what actually happened, without opening the history page */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Uploads</CardTitle>
                <CardDescription>The last 5 PDFs brought into the wizard</CardDescription>
              </div>
              <Link href="/admin/uploads" className="flex items-center gap-1 text-xs font-semibold text-[#e2691f] hover:underline">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              {data.uploads.recent.length === 0 ? (
                <EmptyState icon={UploadCloud} title="No uploads yet" description="Uploaded PDFs will show up here." className="py-8" />
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {data.uploads.recent.map((upload) => (
                    <Link
                      key={upload.id}
                      href={upload.status === 'committed' ? '/admin/uploads' : `/admin/uploads/new?resume=${upload.id}`}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[#e2691f] dark:bg-orange-500/15">
                        <FileText className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-semibold">{upload.fileName}</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">
                          {upload.questionCount} question{upload.questionCount === 1 ? '' : 's'} · {timeAgo(upload.createdAt)}
                        </p>
                      </div>
                      <Badge variant={UPLOAD_STATUS_BADGE[upload.status] ?? 'outline'} className="shrink-0 capitalize">
                        {upload.status}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

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
        </>
      )}

      {/* Upload a question PDF — tucked away at the bottom, collapsed by
          default, so it doesn't compete with the KPIs an operator actually
          opens this page to check. */}
      <CollapsibleSection
        icon={FileUp}
        title="Upload a Question PDF"
        description="Import a new question set from a teacher's PDF file"
      >
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

        <UploadSteps className="mt-6" />
      </CollapsibleSection>
    </div>
  );
}
