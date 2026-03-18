"use client"

import { useMemo } from "react"
import { Trophy, Zap } from "lucide-react"
import { useDemoStore } from "@/stores/demo-data"
import { AchievementGrid } from "@/components/achievements/achievement-grid"

export default function AchievementsPage() {
  const achievements = useDemoStore((s) => s.achievements)
  const userAchievements = useDemoStore((s) => s.userAchievements)

  const totalXpEarned = useMemo(() => {
    return userAchievements.reduce((sum, ua) => {
      const ach = achievements.find((a) => a.id === ua.achievementId)
      return sum + (ach?.xpReward ?? 0)
    }, 0)
  }, [achievements, userAchievements])

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
            <Trophy className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Achievements</h1>
            <p className="text-sm text-zinc-500">
              {userAchievements.length}/{achievements.length} unlocked
            </p>
          </div>
        </div>

        {/* Total XP from achievements */}
        <div className="bg-[#12141a] border border-[#1e2030] rounded-xl px-5 py-3 flex items-center gap-3">
          <Zap className="h-5 w-5 text-yellow-400" />
          <div>
            <p className="text-xs text-zinc-500">Achievement XP Earned</p>
            <p className="text-lg font-bold text-zinc-100">
              {totalXpEarned.toLocaleString()} XP
            </p>
          </div>
        </div>
      </div>

      {/* Achievement Grid with filters */}
      <AchievementGrid />
    </div>
  )
}
