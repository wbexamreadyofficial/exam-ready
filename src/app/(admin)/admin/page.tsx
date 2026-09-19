'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Users, FileText, HelpCircle, TrendingUp, UserCheck, FolderKanban, Award, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { adminApi } from '@/lib/api/admin';
import { ELEVATED_CARD } from '@/lib/constants';
import { PageHeader } from '@/components/layout/PageHeader';

/** Exams, questions, attempts and revenue have no backend endpoints yet. */
const mockStats = {
  totalExams: 340,
  publishedExams: 310,
  totalQuestions: 12500,
  totalAttempts: 89400,
  totalRevenue: 245000,
  attemptsToday: 1240,
};

const mockActivityData = [
  { date: 'Aug 1', attempts: 340 }, { date: 'Aug 2', attempts: 410 },
  { date: 'Aug 3', attempts: 290 }, { date: 'Aug 4', attempts: 520 },
  { date: 'Aug 5', attempts: 630 }, { date: 'Aug 6', attempts: 480 },
  { date: 'Aug 7', attempts: 580 },
];

const TREND_RANGES = [7, 14, 30];

function StatCard({
  icon: Icon,
  title,
  value,
  sub,
  color,
  href,
  loading,
}: {
  icon: React.ElementType;
  title: string;
  value?: number | string;
  sub?: string;
  color: string;
  href?: string;
  loading?: boolean;
}) {
  const card = (
    <Card className={`${ELEVATED_CARD} ${href ? 'transition-transform hover:-translate-y-0.5' : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-sm text-[var(--color-muted-foreground)] mb-1">{title}</p>
            {loading ? (
              <>
                <Skeleton className="h-8 w-24" />
                <Skeleton className="mt-1.5 h-3 w-20" />
              </>
            ) : (
              <>
                <p className="text-2xl font-black">{typeof value === 'number' ? value.toLocaleString('en-IN') : (value ?? '—')}</p>
                {sub && <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{sub}</p>}
              </>
            )}
          </div>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return href ? (
    <Link href={href} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta)]">
      {card}
    </Link>
  ) : (
    card
  );
}

export default function AdminDashboardPage() {
  const [trendDays, setTrendDays] = useState(7);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data: dash, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard', trendDays, timeZone],
    queryFn: () => adminApi.getDashboard({ days: trendDays, timeZone }),
    placeholderData: (previous) => previous,
  });

  const loading = isLoading && !isError;
  const students = dash?.users.byRole.student;

  const registrationData = (dash?.registrations ?? []).map((row) => ({
    date: format(parseISO(row.date), 'd MMM'),
    users: row.count,
  }));
  const registrationTotal = registrationData.reduce((sum, row) => sum + row.users, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="System statistics, user activity, and performance" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          title="Total Users"
          value={dash?.users.total}
          sub={dash ? `${dash.users.newToday} new today` : undefined}
          loading={loading}
          href="/admin/users"
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          icon={UserCheck}
          title="Active Aspirants"
          value={students?.active}
          sub={students ? `${students.total.toLocaleString('en-IN')} total students` : undefined}
          loading={loading}
          href="/admin/users"
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard icon={FileText} title="Total Exams" value={mockStats.totalExams} sub={`${mockStats.publishedExams} active`} color="bg-[var(--color-primary)]/10 text-[var(--color-primary)]" />
        <StatCard icon={HelpCircle} title="Question Bank" value={mockStats.totalQuestions} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
        <StatCard icon={Activity} title="Total Attempts" value={mockStats.totalAttempts} sub={`${mockStats.attemptsToday} today`} color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" />
        <StatCard icon={TrendingUp} title="Platform Revenue" value={`₹${mockStats.totalRevenue.toLocaleString('en-IN')}`} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
        <StatCard
          icon={FolderKanban}
          title="Exam Categories"
          value={dash?.categories.total}
          sub={dash ? `${dash.categories.active} active` : undefined}
          loading={loading}
          href="/admin/categories"
          color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        />
        <StatCard icon={Award} title="Live Mock Tests" value={mockStats.publishedExams} color="bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className={ELEVATED_CARD}>
          <CardHeader className="flex-row items-start justify-between space-y-0 gap-3">
            <div className="space-y-1.5">
              <CardTitle className="text-base">User Registrations</CardTitle>
              <CardDescription>
                {dash ? `${registrationTotal.toLocaleString('en-IN')} new sign-ups in the last ${trendDays} days` : 'Daily candidate onboarding trend'}
              </CardDescription>
            </div>
            <Select value={String(trendDays)} onValueChange={(value) => setTrendDays(Number(value))}>
              <SelectTrigger className="h-8 w-32 text-xs" aria-label="Date range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TREND_RANGES.map((days) => (
                  <SelectItem key={days} value={String(days)}>
                    Last {days} days
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[220px] w-full" />
            ) : isError ? (
              <div className="flex h-[220px] items-center justify-center text-sm text-[var(--color-muted-foreground)]">
                Could not load registration data.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip formatter={(value) => [value, 'New users']} />
                  <Area type="monotone" dataKey="users" stroke="hsl(43,96%,46%)" fill="hsl(43,96%,46%,0.2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className={ELEVATED_CARD}>
          <CardHeader>
            <CardTitle className="text-base">Exam Submissions</CardTitle>
            <CardDescription>Daily mock test attempts by candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mockActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="attempts" fill="hsl(43,96%,46%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
