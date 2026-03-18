"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDemoStore } from "@/stores/demo-data"
import type { PlanBlock } from "@/stores/demo-data"

const BLOCK_CATEGORIES = [
  "Prospecting",
  "Follow-ups",
  "Client Meetings",
  "Showings",
  "Marketing",
  "Admin",
  "Learning",
  "Pipeline Review",
] as const

const blockSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    notes: z.string(),
    linkedQuestId: z.string(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })

type BlockFormValues = z.infer<typeof blockSchema>

interface EditBlockModalProps {
  open: boolean
  block: PlanBlock | null
  planId: string
  onClose: () => void
}

export default function EditBlockModal({
  open,
  block,
  planId,
  onClose,
}: EditBlockModalProps) {
  const updatePlanBlock = useDemoStore((s) => s.updatePlanBlock)
  const quests = useDemoStore((s) => s.quests)
  const activeQuests = quests.filter((q) => q.status === "active")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlockFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(blockSchema) as any,
  })

  useEffect(() => {
    if (block && open) {
      reset({
        title: block.title,
        category: block.category,
        startTime: block.startTime,
        endTime: block.endTime,
        notes: block.notes,
        linkedQuestId: block.linkedQuestId || "",
      })
    }
  }, [block, open, reset])

  function onSubmit(data: BlockFormValues) {
    if (!block) return
    updatePlanBlock(planId, block.id, {
      title: data.title,
      category: data.category,
      startTime: data.startTime,
      endTime: data.endTime,
      notes: data.notes || "",
      linkedQuestId: data.linkedQuestId || null,
    })
    onClose()
  }

  const inputClass =
    "w-full rounded-lg border border-[#1e2030] bg-[#1a1c28] px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
  const labelClass = "block text-xs font-medium text-zinc-400 mb-1.5"

  return (
    <AnimatePresence>
      {open && block && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-[#161820] border border-[#1e2030] rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Edit Time Block</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-zinc-400 hover:bg-[#1e2030] hover:text-zinc-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className={labelClass}>Title *</label>
                <input
                  {...register("title")}
                  placeholder="e.g., Morning Prospecting"
                  className={inputClass}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Category *</label>
                <select {...register("category")} className={inputClass}>
                  {BLOCK_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Start Time *</label>
                  <input type="time" {...register("startTime")} className={inputClass} />
                  {errors.startTime && (
                    <p className="mt-1 text-xs text-red-400">{errors.startTime.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>End Time *</label>
                  <input type="time" {...register("endTime")} className={inputClass} />
                  {errors.endTime && (
                    <p className="mt-1 text-xs text-red-400">{errors.endTime.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Notes</label>
                <textarea
                  {...register("notes")}
                  rows={2}
                  placeholder="Optional notes..."
                  className={inputClass + " resize-none"}
                />
              </div>

              <div>
                <label className={labelClass}>Link Quest</label>
                <select {...register("linkedQuestId")} className={inputClass}>
                  <option value="">None</option>
                  {activeQuests.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-[#1e2030] px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-[#252840] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
