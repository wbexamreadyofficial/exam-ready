'use client';

import React from 'react';

// Main content
import { ProfileCompletionBanner } from '@/components/dashboard/ProfileCompletionBanner';
import GreetingBanner from '@/components/dashboard/GreetingBanner';
import StatTiles from '@/components/dashboard/StatTiles';
import PlanBanner from '@/components/dashboard/PlanBanner';
import ContinuePreparation from '@/components/dashboard/ContinuePreparation';
import ScoreTrendChart from '@/components/dashboard/ScoreTrendChart';
import SubjectDonutChart from '@/components/dashboard/SubjectDonutChart';
import PreparationStats from '@/components/dashboard/PreparationStats';
import RecommendedTopics from '@/components/dashboard/RecommendedTopics';
import UpgradeCTA from '@/components/dashboard/UpgradeCTA';

// Right sidebar (shown inline on smaller screens)
import PerformanceOverview from '@/components/dashboard/PerformanceOverview';
import StreakTracker from '@/components/dashboard/StreakTracker';
import DailyGoal from '@/components/dashboard/DailyGoal';
import LeaderboardWidget from '@/components/dashboard/LeaderboardWidget';
import TopExams from '@/components/dashboard/TopExams';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Profile completion nudge */}
      <ProfileCompletionBanner />

      {/* 1. Greeting */}
      <GreetingBanner />

      {/* 2. Stat Tiles */}
      <StatTiles />

      {/* 3. Plan/Usage Banner */}
      <PlanBanner />

      {/* 4. Continue Preparation */}
      <ContinuePreparation />

      {/* 5. Your Preparation Journey */}
      <div className="space-y-6">
        <h2 className="display-card text-lg font-semibold text-[var(--color-ink-900)]">
          Your Preparation Journey
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScoreTrendChart />
          <SubjectDonutChart />
        </div>
        <PreparationStats />
      </div>

      {/* 6. Recommended For You */}
      <RecommendedTopics />

      {/* 7. Upgrade CTA */}
      <UpgradeCTA />

      {/* Right sidebar content stacked on non-xl screens */}
      <div className="xl:hidden space-y-6 pt-2">
        <h2 className="display-card text-lg font-semibold text-[var(--color-ink-900)]">
          Quick Overview
        </h2>
        <PerformanceOverview />
        <StreakTracker />
        <DailyGoal />
        <LeaderboardWidget />
        <TopExams />
      </div>
    </div>
  );
}
