"use client"

import { useState } from "react"
import { format, addDays, subDays, isToday } from "date-fns"
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Plus,
  Copy,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { DailyPlan } from "@/stores/demo-data"

interface PlannerHeaderProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  plan: DailyPlan | null
  onCreatePlan: () => void
  onCopyYesterday: () => void
  onNotesChange: (notes: string) => void
}

export default function PlannerHeader({
  selectedDate,
  onDateChange,
  plan,
  onCreatePlan,
  onCopyYesterday,
  onNotesChange,
}: PlannerHeaderProps) {
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState(plan?.notes || "")

  const dateLabel = isToday(selectedDate)
    ? "Today"
    : format(selectedDate, "EEEE")

  function handleSaveNotes() {
    onNotesChange(notesValue)
    setEditingNotes(false)
  }

  // Sync notes value if plan changes
  const displayNotes = editingNotes ? notesValue : (plan?.notes || "")

  const completionScore = plan
    ? plan.blocks.length > 0
      ? Math.round(
          (plan.blocks.filter((b) => b.status === "completed").length / plan.blocks.length) *
            100
        )
      : 0
    : 0

  return (
    <div className="space-y-4">
      {/* Date navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg bg-[#12141a] border border-[#1e2030] p-1">
            <button
              onClick={() => onDateChange(subDays(selectedDate, 1))}
              className="rounded-md p-1.5 text-zinc-400 hover:bg-[#1e2030] hover:text-zinc-200 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDateChange(new Date())}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                isToday(selectedDate)
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Today
            </button>
            <button
              onClick={() => onDateChange(addDays(selectedDate, 1))}
              className="rounded-md p-1.5 text-zinc-400 hover:bg-[#1e2030] hover:text-zinc-200 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-zinc-500" />
            <div>
              <span className="text-sm font-medium text-zinc-200">{dateLabel}</span>
              <span className="text-sm text-zinc-500 ml-1.5">
                {format(selectedDate, "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!plan && (
            <button
              onClick={onCreatePlan}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Plan
            </button>
          )}
          {plan && (
            <button
              onClick={onCopyYesterday}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1e2030] px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-[#252840] transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Yesterday
            </button>
          )}
        </div>
      </div>

      {/* Plan info row */}
      {plan && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Completion score */}
          <div className="flex items-center gap-2 rounded-lg border border-[#1e2030] bg-[#12141a] px-3 py-2">
            <span className="text-xs text-zinc-500">Completion</span>
            <span
              className={cn(
                "text-sm font-semibold",
                completionScore >= 80
                  ? "text-green-400"
                  : completionScore >= 50
                    ? "text-amber-400"
                    : "text-zinc-400"
              )}
            >
              {completionScore}%
            </span>
          </div>

          {/* Notes */}
          <div className="flex-1 flex items-start gap-2">
            <FileText className="h-4 w-4 text-zinc-500 mt-1.5 flex-shrink-0" />
            {editingNotes ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveNotes()
                    if (e.key === "Escape") setEditingNotes(false)
                  }}
                  className="flex-1 rounded-lg border border-[#1e2030] bg-[#1a1c28] px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Add notes for the day..."
                  autoFocus
                />
                <button
                  onClick={handleSaveNotes}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setNotesValue(plan.notes || "")
                  setEditingNotes(true)
                }}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors text-left"
              >
                {displayNotes || "Click to add notes for this day..."}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
