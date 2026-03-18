"use client"

import { useDemoStore } from "@/stores/demo-data"
import { Flame, TrendingUp } from "lucide-react"
import { StatRadarChart } from "@/components/stats/stat-radar-chart"
import { StatProgressCard } from "@/components/stats/stat-progress-card"
import { MetricsGrid } from "@/components/stats/metrics-grid"
import { WeeklyActivityChart } from "@/components/stats/weekly-activity-chart"
import { ActivityDistributionChart } from "@/components/stats/activity-distribution-chart"
import { format, parseISO } from "date-fns"

const STREAK_LABELS: Record<string, string> = {
  daily_activity: "Daily Activity",
  prospecting: "Prospecting",
  planner: "Planner",
}

const STREAK_COLORS: Record<string, string> = {
  daily_activity: "text-orange-400",
  prospecting: "text-blue-400",
  planner: "text-purple-400",
}

export default function StatsPage() {
  const statProgress = useDemoStore((s) => s.statProgress)
  const streaks = useDemoStore((s) => s.streaks)
  const profile = useDemoStore((s) => s.profile)

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Stats</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Level {profile.currentLevel} {profile.rankTitle} &middot;{" "}
            {profile.totalXp.toLocaleString()} XP
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <TrendingUp className="h-4 w-4" />
          <span>Performance Overview</span>
        </div>
      </div>

      {/* Hero: Radar Chart */}
      <div className="bg-[#12141a] border border-[#1e2030] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-zinc-100 mb-2 text-center">
          Agent Stat Profile
        </h2>
        <StatRadarChart />
      </div>

      {/* Stat Progress Cards - 2x3 grid */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-100 mb-4">
          Stat Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statProgress.map((stat) => (
            <StatProgressCard
              key={stat.statName}
              statName={stat.statName}
              statValue={stat.statValue}
              level={stat.level}
            />
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-100 mb-4">
          Key Metrics
        </h2>
        <MetricsGrid />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeeklyActivityChart />
        <ActivityDistributionChart />
      </div>

      {/* Streak Summary */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-100 mb-4">Streaks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {streaks.map((streak) => (
            <div
              key={streak.id}
              className="bg-[#12141a] border border-[#1e2030] rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <Flame
                  className={`h-5 w-5 ${
                    STREAK_COLORS[streak.streakType] || "text-orange-400"
                  }`}
                />
                <span className="text-sm font-medium text-zinc-100">
                  {STREAK_LABELS[streak.streakType] || streak.streakType}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-zinc-100">
                    {streak.currentCount}
                  </p>
                  <p className="text-xs text-zinc-500">Current streak</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-zinc-300">
                    {streak.bestCount}
                  </p>
                  <p className="text-xs text-zinc-500">Best</p>
                </div>
              </div>
              {streak.lastCompletedDate && (
                <p className="text-xs text-zinc-600 mt-3">
                  Last:{" "}
                  {format(
                    parseISO(streak.lastCompletedDate),
                    "MMM d, yyyy"
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
