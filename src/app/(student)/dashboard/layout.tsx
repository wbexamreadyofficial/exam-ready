'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PerformanceOverview from '@/components/dashboard/PerformanceOverview';
import StreakTracker from '@/components/dashboard/StreakTracker';
import DailyGoal from '@/components/dashboard/DailyGoal';
import LeaderboardWidget from '@/components/dashboard/LeaderboardWidget';
import TopExams from '@/components/dashboard/TopExams';

function RightSidebar() {
  return (
    <div className="space-y-6 pt-6">
      <PerformanceOverview />
      <StreakTracker />
      <DailyGoal />
      <LeaderboardWidget />
      <TopExams />
    </div>
  );
}

export default function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout rightSidebar={<RightSidebar />}>
      {children}
    </DashboardLayout>
  );
}
