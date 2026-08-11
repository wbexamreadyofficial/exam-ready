'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, FileText, HelpCircle, TrendingUp, UserCheck, BookOpen, Award, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { adminApi } from '@/lib/api/admin';

const mockActivityData = [
  { date: 'Aug 1', users: 120, attempts: 340 }, { date: 'Aug 2', users: 145, attempts: 410 },
  { date: 'Aug 3', users: 98, attempts: 290 }, { date: 'Aug 4', users: 178, attempts: 520 },
  { date: 'Aug 5', users: 210, attempts: 630 }, { date: 'Aug 6', users: 165, attempts: 480 },
  { date: 'Aug 7', users: 190, attempts: 580 },
];

function StatCard({ icon: Icon, title, value, sub, color }: { icon: React.ElementType; title: string; value?: number | string; sub?: string; color: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-1">{title}</p>
            <p className="text-2xl font-black">{value?.toLocaleString() ?? '...'}</p>
            {sub && <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{sub}</p>}
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data: apiStats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats(),
  });

  const stats = apiStats ?? {
    totalUsers: 14250,
    activeUsers: 9800,
    totalExams: 340,
    publishedExams: 310,
    totalQuestions: 12500,
    totalAttempts: 89400,
    totalRevenue: 245000,
    newUsersToday: 142,
    attemptsToday: 1240,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black">Admin Dashboard</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">System statistics, user activity, and performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />) : (
          <>
            <StatCard icon={Users} title="Total Users" value={stats.totalUsers} sub={`${stats.newUsersToday} new today`} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
            <StatCard icon={UserCheck} title="Active Aspirants" value={stats.activeUsers} color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
            <StatCard icon={FileText} title="Total Exams" value={stats.totalExams} sub={`${stats.publishedExams} active`} color="bg-[var(--color-primary)]/10 text-[var(--color-primary)]" />
            <StatCard icon={HelpCircle} title="Question Bank" value={stats.totalQuestions} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
            <StatCard icon={Activity} title="Total Attempts" value={stats.totalAttempts} sub={`${stats.attemptsToday} today`} color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" />
            <StatCard icon={TrendingUp} title="Platform Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
            <StatCard icon={BookOpen} title="Subject Modules" value="14" color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" />
            <StatCard icon={Award} title="Live Mock Tests" value={stats.publishedExams} color="bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Registrations</CardTitle>
            <CardDescription>Daily candidate onboarding trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={mockActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="hsl(43,96%,46%)" fill="hsl(43,96%,46%,0.2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
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
