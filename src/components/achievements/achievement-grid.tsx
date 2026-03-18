"use client"

import { useState, useMemo } from "react"
import { useDemoStore } from "@/stores/demo-data"
import { AchievementCard } from "./achievement-card"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  "All",
  "Prospecting",
  "Follow-up",
  "Discipline",
  "Deals",
  "Learning",
  "Consistency",
  "Milestones",
]

const CATEGORY_TAB_COLORS: Record<string, string> = {
  All: "data-[active=true]:bg-zinc-700 data-[active=true]:text-zinc-100",
  Prospecting: "data-[active=true]:bg-blue-500/20 data-[active=true]:text-blue-400",
  "Follow-up": "data-[active=true]:bg-amber-500/20 data-[active=true]:text-amber-400",
  Discipline: "data-[active=true]:bg-orange-500/20 data-[active=true]:text-orange-400",
  Deals: "data-[active=true]:bg-green-500/20 data-[active=true]:text-green-400",
  Learning: "data-[active=true]:bg-cyan-500/20 data-[active=true]:text-cyan-400",
  Consistency: "data-[active=true]:bg-purple-500/20 data-[active=true]:text-purple-400",
  Milestones: "data-[active=true]:bg-yellow-500/20 data-[active=true]:text-yellow-400",
}

export function AchievementGrid() {
  const [activeCategory, setActiveCategory] = useState("All")
  const achievements = useDemoStore((s) => s.achievements)
  const userAchievements = useDemoStore((s) => s.userAchievements)
  const activities = useDemoStore((s) => s.activities)
  const streaks = useDemoStore((s) => s.streaks)
  const deals = useDemoStore((s) => s.deals)
  const profile = useDemoStore((s) => s.profile)

  const unlockedMap = useMemo(() => {
    const map = new Map<
      string,
      { unlockedAt: string; progressValue: number }
    >()
    for (const ua of userAchievements) {
      map.set(ua.achievementId, {
        unlockedAt: ua.unlockedAt,
        progressValue: ua.progressValue,
      })
    }
    return map
  }, [userAchievements])

  // Compute progress for locked achievements
  const progressMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const ach of achievements) {
      if (unlockedMap.has(ach.id)) continue
      const config = ach.ruleConfig
      let progress = 0
      switch (ach.ruleType) {
        case "activity_count":
          progress = activities.filter(
            (a) => a.type === config.activity_type
          ).length
          break
        case "total_xp":
          progress = profile.totalXp
          break
        case "total_activities":
          progress = activities.length
          break
        case "streak": {
          const streak = streaks.find(
            (s) => s.streakType === config.streak_type
          )
          progress = streak?.bestCount ?? 0
          break
        }
        case "deal_stage":
          progress = deals.filter((d) => d.stage === config.stage).length
          break
        case "active_deals":
          progress = deals.filter(
            (d) => !["Closed", "Dead"].includes(d.stage)
          ).length
          break
      }
      map.set(ach.id, progress)
    }
    return map
  }, [achievements, unlockedMap, activities, profile, streaks, deals])

  const filtered = useMemo(() => {
    const list =
      activeCategory === "All"
        ? achievements
        : achievements.filter((a) => a.category === activeCategory)

    // Unlocked first, then locked
    return [...list].sort((a, b) => {
      const aUnlocked = unlockedMap.has(a.id) ? 0 : 1
      const bUnlocked = unlockedMap.has(b.id) ? 0 : 1
      return aUnlocked - bUnlocked
    })
  }, [achievements, activeCategory, unlockedMap])

  const unlockedCount = userAchievements.length
  const totalCount = achievements.length

  return (
    <div className="space-y-6">
      {/* Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          <span className="text-zinc-100 font-semibold">{unlockedCount}</span>
          <span className="text-zinc-500">/{totalCount}</span> unlocked
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            data-active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50",
              CATEGORY_TAB_COLORS[cat]
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((achievement) => {
          const unlocked = unlockedMap.get(achievement.id)
          return (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={!!unlocked}
              unlockedAt={unlocked?.unlockedAt}
              progressValue={
                unlocked
                  ? unlocked.progressValue
                  : progressMap.get(achievement.id)
              }
            />
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-zinc-500 text-sm">
          No achievements in this category yet.
        </div>
      )}
    </div>
  )
}
