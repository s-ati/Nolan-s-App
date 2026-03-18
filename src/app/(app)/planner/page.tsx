"use client"

import { useState, useMemo, useCallback } from "react"
import { format, subDays } from "date-fns"
import { Calendar } from "lucide-react"
import { useDemoStore } from "@/stores/demo-data"
import type { PlanBlock } from "@/stores/demo-data"
import PlannerHeader from "@/components/planner/planner-header"
import DaySchedule from "@/components/planner/day-schedule"
import AddBlockModal from "@/components/planner/add-block-modal"
import EditBlockModal from "@/components/planner/edit-block-modal"

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [addBlockOpen, setAddBlockOpen] = useState(false)
  const [editBlock, setEditBlock] = useState<PlanBlock | null>(null)

  const dailyPlans = useDemoStore((s) => s.dailyPlans)
  const addDailyPlan = useDemoStore((s) => s.addDailyPlan)
  const updateDailyPlan = useDemoStore((s) => s.updateDailyPlan)
  const addPlanBlock = useDemoStore((s) => s.addPlanBlock)

  const dateStr = format(selectedDate, "yyyy-MM-dd")

  const currentPlan = useMemo(
    () => dailyPlans.find((p) => p.planDate === dateStr) || null,
    [dailyPlans, dateStr]
  )

  const handleCreatePlan = useCallback(() => {
    addDailyPlan({
      planDate: dateStr,
      notes: "",
      completionScore: 0,
    })
  }, [addDailyPlan, dateStr])

  const handleCopyYesterday = useCallback(() => {
    const yesterdayStr = format(subDays(selectedDate, 1), "yyyy-MM-dd")
    const yesterdayPlan = dailyPlans.find((p) => p.planDate === yesterdayStr)

    if (!yesterdayPlan || yesterdayPlan.blocks.length === 0) return

    if (!currentPlan) return

    yesterdayPlan.blocks.forEach((block) => {
      addPlanBlock(currentPlan.id, {
        title: block.title,
        category: block.category,
        startTime: block.startTime,
        endTime: block.endTime,
        status: "planned",
        notes: block.notes,
        linkedQuestId: block.linkedQuestId,
      })
    })
  }, [selectedDate, dailyPlans, currentPlan, addPlanBlock])

  const handleNotesChange = useCallback(
    (notes: string) => {
      if (!currentPlan) return
      updateDailyPlan(currentPlan.id, { notes })
    },
    [currentPlan, updateDailyPlan]
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <Calendar className="h-5 w-5 text-blue-400" />
          <h1 className="text-2xl font-bold text-zinc-100">Planner</h1>
        </div>
        <p className="text-sm text-zinc-500">
          Plan your day with focused time blocks to maximize productivity
        </p>
      </div>

      {/* Planner header with date nav */}
      <PlannerHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        plan={currentPlan}
        onCreatePlan={handleCreatePlan}
        onCopyYesterday={handleCopyYesterday}
        onNotesChange={handleNotesChange}
      />

      {/* Day schedule */}
      <DaySchedule
        plan={currentPlan}
        onAddBlock={() => setAddBlockOpen(true)}
        onEditBlock={(block) => setEditBlock(block)}
      />

      {/* Modals */}
      {currentPlan && (
        <>
          <AddBlockModal
            open={addBlockOpen}
            planId={currentPlan.id}
            onClose={() => setAddBlockOpen(false)}
          />
          <EditBlockModal
            open={!!editBlock}
            block={editBlock}
            planId={currentPlan.id}
            onClose={() => setEditBlock(null)}
          />
        </>
      )}
    </div>
  )
}
