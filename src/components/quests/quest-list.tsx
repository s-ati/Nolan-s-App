"use client"

import { useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Zap, Target, CheckCircle2 } from "lucide-react"
import { useDemoStore } from "@/stores/demo-data"
import type { Quest } from "@/stores/demo-data"
import QuestCard from "./quest-card"

interface QuestListProps {
  period: "daily" | "weekly" | "monthly" | "pipeline"
  categoryFilter?: string
  onEdit: (quest: Quest) => void
}

const periodEmptyMessages: Record<string, { title: string; desc: string }> = {
  daily: {
    title: "No daily quests",
    desc: "Your daily quests will appear here. Add a quest or wait for the system to generate them.",
  },
  weekly: {
    title: "No weekly quests",
    desc: "Weekly quests help you hit bigger targets. Create one to get started.",
  },
  monthly: {
    title: "No monthly quests",
    desc: "Monthly quests are your big-picture goals. Set one to stay on track.",
  },
  pipeline: {
    title: "No pipeline quests",
    desc: "Pipeline quests are auto-generated from your deals and contacts.",
  },
}

export default function QuestList({ period, categoryFilter, onEdit }: QuestListProps) {
  const quests = useDemoStore((s) => s.quests)

  const filtered = useMemo(() => {
    let list = quests.filter((q) => q.period === period)
    if (categoryFilter && categoryFilter !== "all") {
      list = list.filter((q) => q.category === categoryFilter)
    }
    const active = list
      .filter((q) => q.status !== "completed")
      .sort((a, b) => {
        if (a.status === "snoozed" && b.status !== "snoozed") return 1
        if (a.status !== "snoozed" && b.status === "snoozed") return -1
        return 0
      })
    const completed = list.filter((q) => q.status === "completed")
    return [...active, ...completed]
  }, [quests, period, categoryFilter])

  const completedCount = filtered.filter((q) => q.status === "completed").length
  const totalCount = filtered.length
  const xpAvailable = filtered
    .filter((q) => q.status !== "completed")
    .reduce((sum, q) => sum + q.xpReward, 0)
  const xpEarned = filtered
    .filter((q) => q.status === "completed")
    .reduce((sum, q) => sum + q.xpReward, 0)

  const empty = periodEmptyMessages[period]

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1e2030] bg-[#12141a]/50 py-16 px-6">
        <Target className="h-10 w-10 text-zinc-600 mb-3" />
        <h3 className="text-sm font-medium text-zinc-400">{empty.title}</h3>
        <p className="mt-1 text-xs text-zinc-600 text-center max-w-xs">{empty.desc}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Summary bar */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
          <span>
            {completedCount}/{totalCount} completed
          </span>
        </div>
        {xpAvailable > 0 && (
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Zap className="h-3.5 w-3.5 text-blue-400" />
            <span>{xpAvailable} XP available</span>
          </div>
        )}
        {xpEarned > 0 && (
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Zap className="h-3.5 w-3.5 text-green-400" />
            <span>{xpEarned} XP earned</span>
          </div>
        )}
      </div>

      {/* Quest cards */}
      <motion.div layout className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((quest) => (
            <QuestCard key={quest.id} quest={quest} onEdit={onEdit} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
