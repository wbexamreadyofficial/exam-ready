'use client';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { leaderboardApi, type LeaderboardPeriod } from '@/lib/api/leaderboard';
import { formatPercentage, generateInitials } from '@/lib/utils';

const medalColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];

const MOCK_LEADERBOARD = [
  { rank: 1, userId: 'u1', name: 'Sourav Ganguly', score: 188, accuracy: 94.0, attempts: 45, district: 'Kolkata' },
  { rank: 2, userId: 'u2', name: 'Ananya Roy', score: 182, accuracy: 91.0, attempts: 42, district: 'Howrah' },
  { rank: 3, userId: 'u3', name: 'Subhashish Das', score: 176, accuracy: 88.0, attempts: 39, district: 'North 24 Parganas' },
  { rank: 4, userId: 'u4', name: 'Priya Banerjee', score: 170, accuracy: 85.0, attempts: 36, district: 'Hooghly' },
  { rank: 5, userId: 'u5', name: 'Debabrata Mukherjee', score: 168, accuracy: 84.0, attempts: 38, district: 'Burdwan' },
  { rank: 6, userId: 'u6', name: 'Sneha Mitra', score: 162, accuracy: 81.0, attempts: 31, district: 'Nadia' },
  { rank: 7, userId: 'u7', name: 'Rohan Sen', score: 158, accuracy: 79.0, attempts: 29, district: 'Murshidabad' },
  { rank: 8, userId: 'u8', name: 'Tanmoy Ghosh', score: 155, accuracy: 77.5, attempts: 27, district: 'Siliguri' },
];

function LeaderboardTable({ period }: { period: LeaderboardPeriod }) {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => leaderboardApi.getLeaderboard(period, { limit: 50 }),
  });

  const list = data?.data && data.data.length > 0 ? data.data : MOCK_LEADERBOARD;

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>;

  return (
    <div className="space-y-2.5">
      {list.map((entry) => (
        <div
          key={entry.userId}
          className={`flex items-center gap-3 p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] hover:shadow-sm transition-all ${
            entry.rank <= 3 ? 'ring-1 ring-[var(--color-primary)]/40 bg-[var(--color-primary)]/5' : ''
          }`}
        >
          <div className="w-10 flex items-center justify-center">
            {entry.rank <= 3 ? (
              <Medal className={`h-5 w-5 ${medalColors[entry.rank - 1]}`} />
            ) : (
              <span className="text-sm font-bold text-[var(--color-muted-foreground)]">#{entry.rank}</span>
            )}
          </div>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs font-semibold">{generateInitials(entry.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{entry.name}</p>
            {entry.district && <p className="text-xs text-[var(--color-muted-foreground)]">{entry.district}</p>}
          </div>
          <div className="text-right">
            <p className="font-black text-base">{entry.score} pts</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">{formatPercentage(entry.accuracy)} acc.</p>
          </div>
          <Badge variant="secondary" className="hidden sm:block text-xs font-medium">
            {entry.attempts} tests
          </Badge>
        </div>
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="container max-w-3xl py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <Trophy className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black">State Leaderboard</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">Top scoring aspirants across West Bengal</p>
        </div>
      </div>

      <Tabs defaultValue="global">
        <TabsList className="mb-6">
          <TabsTrigger value="global">All Time</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
        </TabsList>
        <TabsContent value="global"><LeaderboardTable period="global" /></TabsContent>
        <TabsContent value="weekly"><LeaderboardTable period="weekly" /></TabsContent>
        <TabsContent value="monthly"><LeaderboardTable period="monthly" /></TabsContent>
      </Tabs>
    </div>
  );
}
