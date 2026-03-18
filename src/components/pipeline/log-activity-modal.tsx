"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Zap } from 'lucide-react'
import { useDemoStore } from '@/stores/demo-data'
import { ACTIVITY_XP } from '@/lib/game/xp-engine'
import { cn } from '@/lib/utils'

const ACTIVITY_TYPES = [
  'Call', 'Text', 'Email', 'Meeting', 'Showing', 'Open House',
  'Inspection Update', 'Contract Update', 'Note Added',
  'Follow-up Completed',
] as const

const activitySchema = z.object({
  type: z.string().min(1, 'Activity type is required'),
  title: z.string().min(1, 'Title is required'),
  contactId: z.string(),
  dealId: z.string(),
  notes: z.string(),
})

type ActivityFormValues = z.infer<typeof activitySchema>

interface LogActivityModalProps {
  open: boolean
  onClose: () => void
  prefillContactId?: string | null
  prefillDealId?: string | null
  prefillType?: string | null
}

export function LogActivityModal({
  open,
  onClose,
  prefillContactId,
  prefillDealId,
  prefillType,
}: LogActivityModalProps) {
  const logActivity = useDemoStore((s) => s.logActivity)
  const contacts = useDemoStore((s) => s.contacts)
  const deals = useDemoStore((s) => s.deals)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: prefillType || 'Call',
      title: '',
      contactId: prefillContactId || '',
      dealId: prefillDealId || '',
      notes: '',
    },
  })

  const watchedType = watch('type')
  const xpPreview = ACTIVITY_XP[watchedType] || 10

  // Auto-suggest title when type changes
  function handleTypeChange(newType: string) {
    setValue('type', newType)
    const contactId = watch('contactId')
    const contact = contacts.find((c) => c.id === contactId)
    if (contact) {
      setValue('title', `${newType} with ${contact.fullName}`)
    } else {
      setValue('title', newType)
    }
  }

  function onSubmit(data: ActivityFormValues) {
    logActivity({
      type: data.type,
      title: data.title,
      contactId: data.contactId || null,
      dealId: data.dealId || null,
      notes: data.notes || '',
    })
    reset()
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg mx-4 bg-[#161820] border border-[#1e2030] rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2030]">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-zinc-100">Log Activity</h2>
            <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
              <Zap className="h-3 w-3" />+{xpPreview} XP
            </span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Activity Type</label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTypeChange(t)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    watchedType === t
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#1e2030] text-zinc-400 hover:text-zinc-200 hover:bg-[#262838]'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <input type="hidden" {...register('type')} />
            {errors.type && (
              <p className="mt-1 text-xs text-red-400">{errors.type.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Title *</label>
            <input
              {...register('title')}
              className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
              placeholder="Activity title..."
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
            )}
          </div>

          {/* Contact & Deal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Contact</label>
              <select
                {...register('contactId')}
                className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">None</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>{c.fullName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Deal</label>
              <select
                {...register('dealId')}
                className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">None</option>
                {deals.map((d) => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Notes</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none resize-none"
              placeholder="What happened?"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#1e2030] text-sm font-medium text-zinc-300 hover:bg-[#262838] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-500 transition-colors',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
            >
              Log Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
