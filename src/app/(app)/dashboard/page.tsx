'use client'

import LevelHeroCard from '@/components/dashboard/level-hero-card'
import KpiCards from '@/components/dashboard/kpi-cards'
import DailyQuestsList from '@/components/dashboard/daily-quests-list'
import DueFollowupsCard from '@/components/dashboard/due-followups-card'
import ActiveDealsCard from '@/components/dashboard/active-deals-card'
import RecentActivityFeed from '@/components/dashboard/recent-activity-feed'
import StreakCard from '@/components/dashboard/streak-card'
import StatsSummaryCard from '@/components/dashboard/stats-summary-card'
import WeeklyXpChart from '@/components/dashboard/weekly-xp-chart'
import QuickActionsCard from '@/components/dashboard/quick-actions-card'
import PlannerPreviewCard from '@/components/dashboard/planner-preview-card'

export default function DashboardPage() {
  return (
    <div className="space-y-5 pb-10">

      {/* ── Hero: Command Center ── */}
      <LevelHeroCard />

      {/* ── KPI Row ── */}
      <KpiCards />

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Column 1: Goals + Due Follow-ups */}
        <div className="space-y-5">
          <DailyQuestsList />
          <DueFollowupsCard />
        </div>

        {/* Column 2: Pipeline */}
        <div className="space-y-5">
          <ActiveDealsCard />
          <QuickActionsCard />
        </div>

        {/* Column 3: Consistency + Skills */}
        <div className="space-y-5">
          <StreakCard />
          <StatsSummaryCard />
        </div>
      </div>

      {/* ── Bottom Row: Charts + Activity ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <WeeklyXpChart />
        <RecentActivityFeed />
      </div>

      {/* ── Planner Preview ── */}
      <PlannerPreviewCard />

    </div>
  )
}
