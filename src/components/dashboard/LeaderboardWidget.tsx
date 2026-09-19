'use client';

import * as React from 'react';
import { leaderboardData } from '@/lib/dashboard/mockData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateInitials, cn } from '@/lib/utils';

export default function LeaderboardWidget() {
  const renderList = (entries: typeof leaderboardData.weekly) => (
    <div className="space-y-1.5 mt-4">
      {entries.map((entry) => (
        <div
          key={`${entry.rank}-${entry.name}`}
          className={cn(
            "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors",
            entry.isCurrentUser 
              ? "bg-[var(--color-bblue-50)] dark:bg-orange-900/15 border border-[var(--color-data-primary)]/20" 
              : "hover:bg-[var(--color-surface-muted)]"
          )}
        >
          <div className="w-6 flex justify-center">
            {entry.rank === 1 ? (
              <Trophy className="h-3.5 w-3.5 text-[var(--color-data-premium)] fill-current" />
            ) : entry.rank === 2 ? (
              <span className="text-sm font-bold text-gray-400 tabular">2</span>
            ) : entry.rank === 3 ? (
              <span className="text-sm font-bold text-amber-700 tabular">3</span>
            ) : (
              <span className="text-sm text-[var(--color-muted-foreground)] tabular">{entry.rank}</span>
            )}
          </div>
          
          <Avatar className="h-7 w-7">
            <AvatarFallback 
              className={cn(
                "text-[10px]",
                entry.rank === 1 && "bg-[var(--color-borange-100)] text-[var(--color-borange-700)]",
                entry.rank === 2 && "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
                entry.rank === 3 && "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-500",
              )}
            >
              {generateInitials(entry.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 truncate">
            <span className="text-sm font-medium text-[var(--color-ink-800)]">
              {entry.name}
            </span>
            {entry.isCurrentUser && (
              <span className="text-xs text-[var(--color-muted-foreground)] ml-1">
                (You)
              </span>
            )}
          </div>
          
          <span className="text-sm font-bold tabular text-[var(--color-ink-900)] ml-auto">
            {entry.score.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="surface-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          Leaderboard
          <Trophy className="h-4 w-4 text-[var(--color-data-premium)]" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
            <TabsTrigger value="allTime" className="text-xs">All Time</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly">
            {renderList(leaderboardData.weekly)}
          </TabsContent>
          <TabsContent value="monthly">
            {renderList(leaderboardData.monthly)}
          </TabsContent>
          <TabsContent value="allTime">
            {renderList(leaderboardData.allTime)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
