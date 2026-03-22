'use client'

import LevelHeroCard from '@/components/dashboard/level-hero-card'
import DailyQuestsList from '@/components/dashboard/daily-quests-list'
import DueFollowupsCard from '@/components/dashboard/due-followups-card'
import ActiveDealsCard from '@/components/dashboard/active-deals-card'
import RecentActivityFeed from '@/components/dashboard/recent-activity-feed'
import StreakCard from '@/components/dashboard/streak-card'
import StatsSummaryCard from '@/components/dashboard/stats-summary-card'
import WeeklyXpChart from '@/components/dashboard/weekly-xp-chart'
import HabitQuickLog from '@/components/dashboard/habit-quick-log'
import PerformanceIdeasCard from '@/components/dashboard/performance-ideas-card'
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

      {/* ── Today's Coaching ── */}
      <PerformanceIdeasCard />

      {/* ── Today's Mission ── */}
      <SectionLabel label="Today's Mission" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DailyQuestsList />
        <HabitQuickLog />
      </div>

      {/* ── Pipeline Focus ── */}
      <SectionLabel label="Pipeline Focus" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DueFollowupsCard />
        <ActiveDealsCard />
        <StreakCard />
      </div>

      {/* ── Performance & Activity ── */}
      <SectionLabel label="Performance & Activity" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <WeeklyXpChart />
        <RecentActivityFeed />
      </div>

      {/* ── Skills & Schedule ── */}
      <SectionLabel label="Skills & Schedule" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <StatsSummaryCard />
        <PlannerPreviewCard />
      </div>

    </div>
  )
}
