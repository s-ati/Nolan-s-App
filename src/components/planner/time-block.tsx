"use client"

import {
  Play,
  Check,
  SkipForward,
  Pencil,
  Trash2,
  FileText,
  Link2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { PlanBlock } from "@/stores/demo-data"
import { useDemoStore } from "@/stores/demo-data"

const statusConfig = {
  planned: { label: "Planned", dot: "bg-zinc-400", border: "border-l-zinc-500" },
  in_progress: { label: "In Progress", dot: "bg-blue-400", border: "border-l-blue-500" },
  completed: { label: "Completed", dot: "bg-green-400", border: "border-l-green-500" },
  skipped: { label: "Skipped", dot: "bg-red-400", border: "border-l-red-500" },
}

const blockCategoryColors: Record<string, string> = {
  Prospecting: "border-l-blue-500",
  "Follow-ups": "border-l-amber-500",
  "Client Meetings": "border-l-purple-500",
  Showings: "border-l-cyan-500",
  Marketing: "border-l-pink-500",
  Admin: "border-l-zinc-500",
  Learning: "border-l-emerald-500",
  "Pipeline Review": "border-l-green-500",
}

const blockCategoryBadges: Record<string, string> = {
  Prospecting: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Follow-ups": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "Client Meetings": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Showings: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  Marketing: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  Admin: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  Learning: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Pipeline Review": "bg-green-500/15 text-green-400 border-green-500/30",
}

interface TimeBlockProps {
  block: PlanBlock
  planId: string
  onEdit: (block: PlanBlock) => void
}

export default function TimeBlock({ block, planId, onEdit }: TimeBlockProps) {
  const updatePlanBlock = useDemoStore((s) => s.updatePlanBlock)
  const deletePlanBlock = useDemoStore((s) => s.deletePlanBlock)
  const quests = useDemoStore((s) => s.quests)

  const status = statusConfig[block.status]
  const linkedQuest = block.linkedQuestId
    ? quests.find((q) => q.id === block.linkedQuestId)
    : null
  const borderColor = blockCategoryColors[block.category] || "border-l-zinc-500"
  const badgeColor =
    blockCategoryBadges[block.category] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"

  function handleStart() {
    updatePlanBlock(planId, block.id, { status: "in_progress" })
  }

  function handleComplete() {
    updatePlanBlock(planId, block.id, { status: "completed" })
  }

  function handleSkip() {
    updatePlanBlock(planId, block.id, { status: "skipped" })
  }

  function handleDelete() {
    deletePlanBlock(planId, block.id)
  }

  return (
    <div
      className={cn(
        "group bg-[#12141a] border border-[#1e2030] rounded-xl p-4 border-l-4 transition-colors",
        borderColor,
        block.status === "completed" && "opacity-70",
        block.status === "skipped" && "opacity-50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Time range */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-medium text-zinc-400">
              {block.startTime} - {block.endTime}
            </span>
            <div className="flex items-center gap-1">
              <div className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
              <span className="text-[10px] text-zinc-500">{status.label}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            className={cn(
              "text-sm font-medium",
              block.status === "completed"
                ? "text-zinc-500 line-through"
                : block.status === "skipped"
                  ? "text-zinc-600 line-through"
                  : "text-zinc-100"
            )}
          >
            {block.title}
          </h3>

          {/* Badges */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                badgeColor
              )}
            >
              {block.category}
            </span>
            {linkedQuest && (
              <span className="inline-flex items-center gap-0.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                <Link2 className="h-2.5 w-2.5" />
                {linkedQuest.title}
              </span>
            )}
          </div>

          {/* Notes */}
          {block.notes && (
            <div className="mt-2 flex items-start gap-1 text-xs text-zinc-500">
              <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{block.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {block.status !== "completed" && block.status !== "skipped" && (
        <div className="mt-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {block.status === "planned" && (
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600/20 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-600/30 transition-colors"
            >
              <Play className="h-3 w-3" />
              Start
            </button>
          )}
          <button
            onClick={handleComplete}
            className="inline-flex items-center gap-1 rounded-lg bg-green-600/20 px-2.5 py-1 text-xs font-medium text-green-400 hover:bg-green-600/30 transition-colors"
          >
            <Check className="h-3 w-3" />
            Complete
          </button>
          <button
            onClick={handleSkip}
            className="inline-flex items-center gap-1 rounded-lg bg-red-600/20 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-600/30 transition-colors"
          >
            <SkipForward className="h-3 w-3" />
            Skip
          </button>
          <button
            onClick={() => onEdit(block)}
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
    </div>
  )
}
