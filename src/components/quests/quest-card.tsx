"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  Pause,
  Pencil,
  Trash2,
  Link2,
  Bot,
  GitBranch,
  User,
  AlertTriangle,
  Zap,
} from "lucide-react"
import { format, isBefore, startOfDay } from "date-fns"
import { cn } from "@/lib/utils"
import type { Quest } from "@/stores/demo-data"
import { useDemoStore } from "@/stores/demo-data"

const difficultyConfig = {
  easy: { label: "Easy", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  normal: { label: "Normal", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  hard: { label: "Hard", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  epic: { label: "Epic", color: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
}

const categoryColors: Record<string, string> = {
  Prospecting: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Follow-up": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "CRM Hygiene": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Knowledge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  Marketing: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  "Pipeline Progress": "bg-green-500/15 text-green-400 border-green-500/30",
  Discipline: "bg-orange-500/15 text-orange-400 border-orange-500/30",
}

const sourceIcons = {
  system: { icon: Bot, label: "Auto" },
  pipeline: { icon: GitBranch, label: "Pipeline" },
  manual: { icon: User, label: "Manual" },
}

interface QuestCardProps {
  quest: Quest
  onEdit: (quest: Quest) => void
}

export default function QuestCard({ quest, onEdit }: QuestCardProps) {
  const [completing, setCompleting] = useState(false)
  const completeQuest = useDemoStore((s) => s.completeQuest)
  const updateQuest = useDemoStore((s) => s.updateQuest)
  const deleteQuest = useDemoStore((s) => s.deleteQuest)
  const contacts = useDemoStore((s) => s.contacts)
  const deals = useDemoStore((s) => s.deals)

  const isOverdue =
    quest.dueDate &&
    quest.status === "active" &&
    isBefore(new Date(quest.dueDate), startOfDay(new Date()))

  const linkedContact = quest.linkedContactId
    ? contacts.find((c) => c.id === quest.linkedContactId)
    : null
  const linkedDeal = quest.linkedDealId
    ? deals.find((d) => d.id === quest.linkedDealId)
    : null

  const difficulty = difficultyConfig[quest.difficulty]
  const SourceIcon = sourceIcons[quest.sourceType].icon

  function handleComplete() {
    setCompleting(true)
    setTimeout(() => {
      completeQuest(quest.id)
    }, 600)
  }

  function handleSnooze() {
    updateQuest(quest.id, { status: quest.status === "snoozed" ? "active" : "snoozed" })
  }

  function handleDelete() {
    deleteQuest(quest.id)
  }

  return (
    <AnimatePresence>
      {!completing && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "group bg-[#12141a] border rounded-xl p-4 transition-colors",
            quest.status === "completed"
              ? "border-green-500/20 opacity-70"
              : quest.status === "snoozed"
                ? "border-yellow-500/20 opacity-80"
                : isOverdue
                  ? "border-red-500/30"
                  : "border-[#1e2030] hover:border-[#2a2d45]"
          )}
        >
          <div className="flex items-start gap-3">
            {/* Status indicator */}
            <div className="mt-1 flex-shrink-0">
              {quest.status === "completed" ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                  <Check className="h-3 w-3 text-green-400" />
                </div>
              ) : quest.status === "snoozed" ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500/20">
                  <Pause className="h-3 w-3 text-yellow-400" />
                </div>
              ) : (
                <div className="h-2.5 w-2.5 mt-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3
                  className={cn(
                    "text-sm font-medium",
                    quest.status === "completed"
                      ? "text-zinc-500 line-through"
                      : "text-zinc-100"
                  )}
                >
                  {quest.title}
                </h3>
                <span
                  className={cn(
                    "flex-shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
                    difficulty.color,
                    "border"
                  )}
                >
                  <Zap className="h-3 w-3" />+{quest.xpReward} XP
                </span>
              </div>

              {quest.description && (
                <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
                  {quest.description}
                </p>
              )}

              {/* Badges row */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                    categoryColors[quest.category] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
                  )}
                >
                  {quest.category}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                    difficulty.color
                  )}
                >
                  {difficulty.label}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-md border border-zinc-700/50 bg-zinc-800/50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                  <SourceIcon className="h-2.5 w-2.5" />
                  {sourceIcons[quest.sourceType].label}
                </span>

                {(linkedContact || linkedDeal) && (
                  <span className="inline-flex items-center gap-0.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                    <Link2 className="h-2.5 w-2.5" />
                    {linkedContact?.fullName || linkedDeal?.title}
                  </span>
                )}

                {isOverdue && (
                  <span className="inline-flex items-center gap-0.5 rounded-md border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-400">
                    <AlertTriangle className="h-2.5 w-2.5" />
                    Overdue
                  </span>
                )}

                {quest.dueDate && !isOverdue && quest.status === "active" && (
                  <span className="text-[10px] text-zinc-500">
                    Due {format(new Date(quest.dueDate), "MMM d")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {quest.status !== "completed" && (
            <div className="mt-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleComplete}
                className="inline-flex items-center gap-1 rounded-lg bg-green-600/20 px-2.5 py-1 text-xs font-medium text-green-400 hover:bg-green-600/30 transition-colors"
              >
                <Check className="h-3 w-3" />
                Complete
              </button>
              <button
                onClick={handleSnooze}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  quest.status === "snoozed"
                    ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                    : "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"
                )}
              >
                <Pause className="h-3 w-3" />
                {quest.status === "snoozed" ? "Resume" : "Snooze"}
              </button>
              <button
                onClick={() => onEdit(quest)}
                className="inline-flex items-center gap-1 rounded-lg bg-[#1e2030] px-2.5 py-1 text-xs font-medium text-zinc-400 hover:bg-[#252840] transition-colors"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1 rounded-lg bg-[#1e2030] px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </motion.div>
      )}

      {completing && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.05, y: -20 }}
          transition={{ duration: 0.6 }}
          className="bg-[#12141a] border border-green-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-center gap-2 text-green-400">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.4 }}
            >
              <Check className="h-5 w-5" />
            </motion.div>
            <span className="text-sm font-semibold">+{quest.xpReward} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
