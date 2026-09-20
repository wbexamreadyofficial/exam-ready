'use client';

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/components/admin/UserAvatar';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import type { Board } from '@/lib/api/studentDashboard';
import { cn } from '@/lib/utils';

function BoardList({ board }: { board: Board }) {
  if (board.entries.length === 0) {
    return <p className="mt-6 pb-2 text-center text-xs text-[var(--color-muted-foreground)]">No scores yet. Finish a test to appear here.</p>;
  }

  return (
    <div className="space-y-0.5 mt-2.5">
      {board.entries.map((entry) => (
        <div
          key={`${entry.rank}-${entry.name}`}
          className={cn(
            'flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg transition-colors',
            entry.isCurrentUser ? 'bg-orange-50 dark:bg-orange-500/10 border border-orange-300/50' : 'hover:bg-[var(--color-surface-muted)]'
          )}
        >
          <div className="w-6 flex justify-center">
            {entry.rank === 1 ? (
              <Trophy className="h-3.5 w-3.5 text-[#e2691f] fill-current" />
            ) : entry.rank === 2 ? (
              <span className="text-sm font-bold text-gray-400 tabular">2</span>
            ) : entry.rank === 3 ? (
              <span className="text-sm font-bold text-amber-700 tabular">3</span>
            ) : (
              <span className="text-sm text-[var(--color-muted-foreground)] tabular">{entry.rank}</span>
            )}
          </div>

          <UserAvatar name={entry.name} src={entry.profilePhoto} className="h-6 w-6" fallbackClassName="text-[9px]" />

          <div className="flex-1 truncate">
            <span className="text-sm font-medium text-[var(--color-ink-800)]">{entry.name}</span>
            {entry.isCurrentUser && <span className="text-xs text-[var(--color-muted-foreground)] ml-1">(You)</span>}
          </div>

          <span className="text-sm font-bold tabular text-[var(--color-ink-900)] ml-auto">{entry.score.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function LeaderboardWidget() {
  const { data, isLoading } = useStudentDashboard();

  return (
    <Card className="surface-card">
      <CardHeader className="p-4 pb-1">
        <CardTitle className="flex items-center gap-2 text-base">
          Leaderboard
          <Trophy className="h-4 w-4 text-[#e2691f]" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isLoading || !data ? (
          <div className="space-y-2 pt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
              <TabsTrigger value="allTime" className="text-xs">All Time</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly">
              <BoardList board={data.leaderboard.weekly} />
            </TabsContent>
            <TabsContent value="monthly">
              <BoardList board={data.leaderboard.monthly} />
            </TabsContent>
            <TabsContent value="allTime">
              <BoardList board={data.leaderboard.allTime} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
