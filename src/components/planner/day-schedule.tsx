"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Plus, CalendarOff, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DailyPlan, PlanBlock } from "@/stores/demo-data"
import TimeBlock from "./time-block"

const TIPS = [
  "Protect your morning for prospecting -- it sets the tone for the whole day.",
  "Block admin time at the end of the day, not the beginning.",
  "Schedule follow-ups right after showings while details are fresh.",
  "Leave buffer time between blocks -- you will need it.",
  "Review your pipeline at least once per day to stay on top of deals.",
  "Learning compounds -- even 20 minutes a day builds expertise over time.",
]

interface DayScheduleProps {
  plan: DailyPlan | null
  onAddBlock: () => void
  onEditBlock: (block: PlanBlock) => void
}

export default function DaySchedule({ plan, onAddBlock, onEditBlock }: DayScheduleProps) {
  const blocks = useMemo(() => {
    if (!plan) return []
    return [...plan.blocks].sort((a, b) => a.startTime.localeCompare(b.startTime))
  }, [plan])

  const completionStats = useMemo(() => {
    if (!blocks.length) return { completed: 0, total: 0, percent: 0 }
    const completed = blocks.filter((b) => b.status === "completed").length
    const total = blocks.length
    return { completed, total, percent: Math.round((completed / total) * 100) }
  }, [blocks])

  const tip = useMemo(() => TIPS[Math.floor(Math.random() * TIPS.length)], [])

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1e2030] bg-[#12141a]/50 py-20 px-6">
        <CalendarOff className="h-12 w-12 text-zinc-600 mb-4" />
        <h3 className="text-base font-medium text-zinc-400">No plan for this day</h3>
        <p className="mt-1.5 text-sm text-zinc-600 text-center max-w-sm">
          Create a plan to start organizing your day into focused time blocks.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Completion progress */}
      {blocks.length > 0 && (
        <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">
              Day Progress: {completionStats.completed}/{completionStats.total} blocks
            </span>
            <span className="font-medium text-zinc-300">{completionStats.percent}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
              initial={{ width: 0 }}
              animate={{ width: `${completionStats.percent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Time blocks */}
      {blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1e2030] bg-[#12141a]/50 py-12 px-6">
          <CalendarOff className="h-8 w-8 text-zinc-600 mb-3" />
          <h3 className="text-sm font-medium text-zinc-400">
            No blocks planned. Start building your day!
          </h3>
          <button
            onClick={onAddBlock}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add First Block
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {blocks.map((block, i) => {
            const prevBlock = i > 0 ? blocks[i - 1] : null
            const hasGap = prevBlock && prevBlock.endTime < block.startTime

            return (
              <div key={block.id}>
                {hasGap && (
                  <div className="flex items-center gap-2 py-1.5 px-3">
                    <div className="h-px flex-1 bg-[#1e2030]" />
                    <span className="text-[10px] text-zinc-600">
                      {prevBlock.endTime} - {block.startTime} available
                    </span>
                    <div className="h-px flex-1 bg-[#1e2030]" />
                  </div>
                )}
                <TimeBlock
                  block={block}
                  planId={plan.id}
                  onEdit={onEditBlock}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Add block button */}
      {blocks.length > 0 && (
        <button
          onClick={onAddBlock}
          className={cn(
            "w-full rounded-xl border border-dashed border-[#1e2030] bg-[#12141a]/30 py-3",
            "text-sm text-zinc-500 hover:text-zinc-300 hover:border-[#2a2d45] transition-colors",
            "flex items-center justify-center gap-1.5"
          )}
        >
          <Plus className="h-4 w-4" />
          Add Block
        </button>
      )}

      {/* Strategic tip */}
      <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-amber-500/10 p-2">
            <Lightbulb className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-medium text-zinc-300">Strategy Tip</h4>
            <p className="mt-0.5 text-xs text-zinc-500">{tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
