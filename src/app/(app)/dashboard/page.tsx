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

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="section-label">{label}</span>
      <div className="flex-1 h-px bg-white/[0.04]" />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-12">

      {/* ── Command Center Hero ── */}
      <LevelHeroCard />

      {/* ── KPI Row ── */}
      <KpiCards />

      {/* ── Today's Focus ── */}
      <SectionLabel label="Today's Focus" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Column 1: Goals + Follow-ups */}
        <div className="space-y-5">
          <DailyQuestsList />
          <DueFollowupsCard />
        </div>

        {/* Column 2: Pipeline + Actions */}
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

      {/* ── Performance & Activity ── */}
      <SectionLabel label="Performance & Activity" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <WeeklyXpChart />
        <RecentActivityFeed />
      </div>

      {/* ── Daily Schedule ── */}
      <SectionLabel label="Daily Schedule" />

      <PlannerPreviewCard />

    </div>
  )
}
