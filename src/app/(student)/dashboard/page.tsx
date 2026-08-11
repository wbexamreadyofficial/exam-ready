'use client';

import { useQuery } from '@tanstack/react-query';
import { BookOpen, Target, TrendingUp, Star, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { usersApi } from '@/lib/api/users';
import { resultsApi } from '@/lib/api/results';
import { leaderboardApi } from '@/lib/api/leaderboard';
import { formatPercentage, formatRelativeTime, generateInitials, getRankSuffix } from '@/lib/utils';

const mockProgressData = [
  { date: 'Jan', score: 45 }, { date: 'Feb', score: 52 }, { date: 'Mar', score: 58 },
  { date: 'Apr', score: 61 }, { date: 'May', score: 68 }, { date: 'Jun', score: 75 },
  { date: 'Jul', score: 71 }, { date: 'Aug', score: 82 },
];

const mockSubjectData = [
  { subject: 'English', score: 80 }, { subject: 'Math', score: 65 }, { subject: 'GK', score: 90 },
  { subject: 'Reasoning', score: 72 }, { subject: 'Bengali', score: 85 },
];

const upcomingExams = [
  { id: '1', title: 'WB Food Inspector Full Mock', date: '2026-08-15', category: 'WB Food Inspector' },
  { id: '2', title: 'PSC Clerkship Practice Set', date: '2026-08-18', category: 'PSC Clerkship' },
];

function StatCard({ icon: Icon, title, value, sub, color }: { icon: React.ElementType; title: string; value: string | number; sub?: string; color: string }) {
  return (
    <Card className="card-hover">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-1">{title}</p>
            <p className="text-2xl font-black">{value}</p>
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

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => usersApi.getStats(),
  });

  const { data: resultsData, isLoading: resultsLoading } = useQuery({
    queryKey: ['my-results', { page: 1, limit: 5 }],
    queryFn: () => resultsApi.getMyResults({ page: 1, limit: 5 }),
  });

  const { data: rankData } = useQuery({
    queryKey: ['my-rank'],
    queryFn: () => leaderboardApi.getMyRank(),
  });

  return (
    <div className="py-8">
      <div className="container max-w-7xl">
        {/* Welcome */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-background)]">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-lg">{user ? generateInitials(user.name) : 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)]">Welcome back,</p>
              <h1 className="text-2xl font-bold">{user?.name ?? 'Candidate'}</h1>
              {rankData && <p className="text-xs text-[var(--color-muted-foreground)]">Global rank: <span className="font-semibold text-[var(--color-primary)]">{getRankSuffix(rankData.rank)}</span> of {rankData.totalParticipants.toLocaleString()}</p>}
            </div>
          </div>
          <Button asChild className="hidden sm:flex gap-2 font-bold">
            <Link href="/exams">Start New Exam <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
          ) : (
            <>
              <StatCard icon={BookOpen} title="Exams Attempted" value={stats?.totalExams ?? 12} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
              <StatCard icon={Target} title="Average Score" value={`${formatPercentage(stats?.averageScore ?? 74.5)}`} sub="across all exams" color="bg-[var(--color-primary)]/10 text-[var(--color-primary)]" />
              <StatCard icon={TrendingUp} title="Accuracy" value={`${formatPercentage(stats?.accuracy ?? 82.0)}`} sub="correct answers" color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
              <StatCard icon={Star} title="Best Score" value={`${formatPercentage(stats?.bestScore ?? 92.0)}`} sub="personal best" color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Progress Chart */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Score Progress</CardTitle><CardDescription>Your performance trends over recent test attempts</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={mockProgressData}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(43,96%,46%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(43,96%,46%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
                    <Area type="monotone" dataKey="score" stroke="hsl(43,96%,46%)" strokeWidth={2} fill="url(#scoreGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Results */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Recent Exams</CardTitle><CardDescription>Your latest mock test attempts</CardDescription></div>
                <Button variant="ghost" size="sm" asChild><Link href="/results">View all</Link></Button>
              </CardHeader>
              <CardContent>
                {resultsLoading ? (
                  <div className="space-y-3">{Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-14 rounded-lg" />)}</div>
                ) : (
                  <div className="space-y-2">
                    {[
                      { id: 'res1', title: 'WB Constable Full Practice Mock #1', date: new Date().toISOString(), percentage: 78.5 },
                      { id: 'res2', title: 'PSC Clerkship Speed Test', date: new Date(Date.now() - 86400000 * 2).toISOString(), percentage: 84.0 },
                      { id: 'res3', title: 'WB Food Inspector Practice Paper', date: new Date(Date.now() - 86400000 * 5).toISOString(), percentage: 62.0 },
                    ].map((result) => (
                      <div key={result.id} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-[var(--color-muted)]/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium">{result.title}</p>
                          <p className="text-xs text-[var(--color-muted-foreground)]">{formatRelativeTime(result.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{formatPercentage(result.percentage)}</p>
                          <Badge variant={result.percentage >= 60 ? 'success' : 'destructive'} className="text-[10px]">
                            {result.percentage >= 60 ? 'Passed' : 'Failed'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Subject Performance Radar */}
            <Card>
              <CardHeader><CardTitle>Subject Performance</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={mockSubjectData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <Radar dataKey="score" stroke="hsl(43,96%,46%)" fill="hsl(43,96%,46%)" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-3">
                  {mockSubjectData.map((s) => (
                    <div key={s.subject} className="flex items-center gap-2">
                      <span className="text-xs text-[var(--color-muted-foreground)] w-20">{s.subject}</span>
                      <Progress value={s.score} className="flex-1 h-1.5" />
                      <span className="text-xs font-medium w-8 text-right">{s.score}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming */}
            <Card>
              <CardHeader><CardTitle>Upcoming Exams</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)]">
                    <div className="flex h-9 w-9 min-w-[2.25rem] items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                      <Calendar className="h-4 w-4 text-[var(--color-primary)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{exam.title}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">{exam.date}</p>
                      <Badge variant="secondary" className="text-[10px] mt-1">{exam.category}</Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2" asChild size="sm">
                  <Link href="/exams"><BookOpen className="h-4 w-4" />Browse All Exams</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
