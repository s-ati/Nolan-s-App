'use client'

import LevelHeroCard from '@/components/dashboard/level-hero-card'
import TodayScoreCard from '@/components/dashboard/today-score-card'
import DailyQuestsList from '@/components/dashboard/daily-quests-list'
import DueFollowupsCard from '@/components/dashboard/due-followups-card'
import ActiveDealsCard from '@/components/dashboard/active-deals-card'
import RecentActivityFeed from '@/components/dashboard/recent-activity-feed'
import StreakCard from '@/components/dashboard/streak-card'
import StatsSummaryCard from '@/components/dashboard/stats-summary-card'
import WeeklyXpChart from '@/components/dashboard/weekly-xp-chart'
import QuickActionsCard from '@/components/dashboard/quick-actions-card'
import PlannerPreviewCard from '@/components/dashboard/planner-preview-card'
import KpiCards from '@/components/dashboard/kpi-cards'

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* Hero Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LevelHeroCard />
        </div>
        <div className="flex flex-col gap-4">
          <TodayScoreCard />
          <StreakCard />
        </div>
      </div>

      {/* KPI Row */}
      <KpiCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <DailyQuestsList />
          <DueFollowupsCard />
          <PlannerPreviewCard />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <ActiveDealsCard />
          <RecentActivityFeed />
          <QuickActionsCard />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeeklyXpChart />
        <StatsSummaryCard />
      </div>
    </div>
  )
}
