"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { useDemoStore, type Deal } from '@/stores/demo-data'
import { cn } from '@/lib/utils'

const STAGES: Deal['stage'][] = [
  'Lead', 'Active Client', 'Offer Stage', 'Under Contract', 'Closed', 'Dead',
]

const PRIORITIES: Deal['priority'][] = ['low', 'medium', 'high', 'urgent']

const dealSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  contactId: z.string(),
  propertyAddress: z.string(),
  stage: z.enum(['Lead', 'Active Client', 'Offer Stage', 'Under Contract', 'Closed', 'Dead']),
  estimatedCommission: z.number().min(0),
  estimatedCloseDate: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  notes: z.string(),
})

type DealFormValues = z.infer<typeof dealSchema>

interface AddDealModalProps {
  open: boolean
  onClose: () => void
}

export function AddDealModal({ open, onClose }: AddDealModalProps) {
  const addDeal = useDemoStore((s) => s.addDeal)
  const contacts = useDemoStore((s) => s.contacts)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: '',
      contactId: '',
      propertyAddress: '',
      stage: 'Lead',
      estimatedCommission: 0,
      estimatedCloseDate: '',
      priority: 'medium',
      notes: '',
    },
  })

  function onSubmit(data: DealFormValues) {
    addDeal({
      title: data.title,
      contactId: data.contactId || null,
      propertyAddress: data.propertyAddress || '',
      stage: data.stage,
      estimatedCommission: data.estimatedCommission,
      estimatedCloseDate: data.estimatedCloseDate || null,
      priority: data.priority,
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
          <h2 className="text-lg font-semibold text-zinc-100">Add Deal</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Title *</label>
            <input
              {...register('title')}
              className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
              placeholder="Smith - 123 Main St Purchase"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Contact</label>
            <select
              {...register('contactId')}
              className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">No contact linked</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>{c.fullName}</option>
              ))}
            </select>
          </div>

          {/* Property Address */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Property Address</label>
            <input
              {...register('propertyAddress')}
              className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
              placeholder="123 Main Street"
            />
          </div>

          {/* Stage & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Stage</label>
              <select
                {...register('stage')}
                className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Priority</label>
              <select
                {...register('priority')}
                className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Commission & Close Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Est. Commission ($)</label>
              <input
                type="number"
                step="100"
                {...register('estimatedCommission', { valueAsNumber: true })}
                className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                placeholder="10000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Est. Close Date</label>
              <input
                type="date"
                {...register('estimatedCloseDate')}
                className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Notes</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Any additional notes..."
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
              Add Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
