"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDemoStore } from "@/stores/demo-data"
import type { Quest } from "@/stores/demo-data"

const QUEST_CATEGORIES = [
  "Prospecting",
  "Follow-up",
  "CRM Hygiene",
  "Knowledge",
  "Marketing",
  "Pipeline Progress",
  "Discipline",
] as const

const DIFFICULTIES = ["easy", "normal", "hard", "epic"] as const
const PERIODS = ["daily", "weekly", "monthly", "pipeline"] as const

const questSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(DIFFICULTIES),
  xpReward: z.number().min(1, "XP must be at least 1"),
  period: z.enum(PERIODS),
  dueDate: z.string(),
  linkedContactId: z.string(),
  linkedDealId: z.string(),
})

type QuestFormValues = z.infer<typeof questSchema>

interface EditQuestModalProps {
  open: boolean
  quest: Quest | null
  onClose: () => void
}

export default function EditQuestModal({ open, quest, onClose }: EditQuestModalProps) {
  const updateQuest = useDemoStore((s) => s.updateQuest)
  const contacts = useDemoStore((s) => s.contacts)
  const deals = useDemoStore((s) => s.deals)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(questSchema) as any,
  })

  useEffect(() => {
    if (quest && open) {
      reset({
        title: quest.title,
        description: quest.description,
        category: quest.category,
        difficulty: quest.difficulty,
        xpReward: quest.xpReward,
        period: quest.period,
        dueDate: quest.dueDate || "",
        linkedContactId: quest.linkedContactId || "",
        linkedDealId: quest.linkedDealId || "",
      })
    }
  }, [quest, open, reset])

  function onSubmit(data: QuestFormValues) {
    if (!quest) return
    updateQuest(quest.id, {
      title: data.title,
      description: data.description || "",
      category: data.category,
      difficulty: data.difficulty,
      xpReward: data.xpReward,
      period: data.period,
      dueDate: data.dueDate || null,
      linkedContactId: data.linkedContactId || null,
      linkedDealId: data.linkedDealId || null,
    })
    onClose()
  }

  const inputClass =
    "w-full rounded-lg border border-[#1e2030] bg-[#1a1c28] px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
  const labelClass = "block text-xs font-medium text-zinc-400 mb-1.5"

  return (
    <AnimatePresence>
      {open && quest && (
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
            className="w-full max-w-lg bg-[#161820] border border-[#1e2030] rounded-xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Edit Quest</h2>
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
                  placeholder="e.g., Make 10 prospecting calls"
                  className={inputClass}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  {...register("description")}
                  rows={2}
                  placeholder="Optional details about this quest..."
                  className={inputClass + " resize-none"}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select {...register("category")} className={inputClass}>
                    {QUEST_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Difficulty</label>
                  <select {...register("difficulty")} className={inputClass}>
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>XP Reward</label>
                  <input
                    type="number"
                    {...register("xpReward", { valueAsNumber: true })}
                    className={inputClass}
                    min={1}
                  />
                </div>
                <div>
                  <label className={labelClass}>Period</label>
                  <select {...register("period")} className={inputClass}>
                    {PERIODS.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Due Date</label>
                <input type="date" {...register("dueDate")} className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Link Contact</label>
                  <select {...register("linkedContactId")} className={inputClass}>
                    <option value="">None</option>
                    {contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Link Deal</label>
                  <select {...register("linkedDealId")} className={inputClass}>
                    <option value="">None</option>
                    {deals.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                </div>
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
