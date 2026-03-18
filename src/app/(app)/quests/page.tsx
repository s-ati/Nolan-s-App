"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Plus, Zap, Target, CheckCircle2, Filter } from "lucide-react"
import { useDemoStore } from "@/stores/demo-data"
import type { Quest } from "@/stores/demo-data"
import QuestList from "@/components/quests/quest-list"
import AddQuestModal from "@/components/quests/add-quest-modal"
import EditQuestModal from "@/components/quests/edit-quest-modal"
import { cn } from "@/lib/utils"

const TABS = [
  { key: "daily" as const, label: "Daily" },
  { key: "weekly" as const, label: "Weekly" },
  { key: "monthly" as const, label: "Monthly" },
  { key: "pipeline" as const, label: "Pipeline" },
]

const QUEST_CATEGORIES = [
  "all",
  "Prospecting",
  "Follow-up",
  "CRM Hygiene",
  "Knowledge",
  "Marketing",
  "Pipeline Progress",
  "Discipline",
]

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly" | "pipeline">("daily")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [addOpen, setAddOpen] = useState(false)
  const [editQuest, setEditQuest] = useState<Quest | null>(null)

  const quests = useDemoStore((s) => s.quests)
  const todayStr = format(new Date(), "yyyy-MM-dd")

  const stats = useMemo(() => {
    const active = quests.filter((q) => q.status === "active")
    const completedToday = quests.filter(
      (q) => q.status === "completed" && q.completedAt && q.completedAt.startsWith(todayStr)
    )
    const xpAvailable = active.reduce((sum, q) => sum + q.xpReward, 0)
    return {
      activeCount: active.length,
      completedTodayCount: completedToday.length,
      xpAvailable,
    }
  }, [quests, todayStr])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Quests</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Complete quests to earn XP and level up
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Quest
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Target className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-medium">Active Quests</span>
          </div>
          <p className="mt-1.5 text-2xl font-bold text-white">{stats.activeCount}</p>
        </div>
        <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-medium">XP Available</span>
          </div>
          <p className="mt-1.5 text-2xl font-bold text-white">{stats.xpAvailable}</p>
        </div>
        <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <span className="text-xs font-medium">Done Today</span>
          </div>
          <p className="mt-1.5 text-2xl font-bold text-white">{stats.completedTodayCount}</p>
        </div>
      </div>

      {/* Tab bar + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex rounded-lg bg-[#12141a] border border-[#1e2030] p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-zinc-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-[#1e2030] bg-[#1a1c28] px-3 py-1.5 text-xs text-zinc-300 focus:border-blue-500 focus:outline-none"
          >
            {QUEST_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quest list */}
      <QuestList
        period={activeTab}
        categoryFilter={categoryFilter}
        onEdit={(quest) => setEditQuest(quest)}
      />

      {/* Modals */}
      <AddQuestModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditQuestModal
        open={!!editQuest}
        quest={editQuest}
        onClose={() => setEditQuest(null)}
      />
    </div>
  )
}
