"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { useDemoStore, type Contact } from '@/stores/demo-data'
import { cn } from '@/lib/utils'

const STATUSES: Contact['status'][] = [
  'Prospect', 'Warm Lead', 'Active Buyer', 'Active Seller',
  'Nurture', 'Under Contract', 'Closed', 'Lost',
]

const PRIORITIES: Contact['priority'][] = ['low', 'medium', 'high', 'urgent']

const contactSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string(),
  email: z.string(),
  leadSource: z.string(),
  status: z.enum(['Prospect', 'Warm Lead', 'Active Buyer', 'Active Seller', 'Nurture', 'Under Contract', 'Closed', 'Lost']),
  nextFollowUpDate: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  notes: z.string(),
  tags: z.string(),
})

type ContactFormValues = z.infer<typeof contactSchema>

interface AddContactModalProps {
  open: boolean
  onClose: () => void
}

export function AddContactModal({ open, onClose }: AddContactModalProps) {
  const addContact = useDemoStore((s) => s.addContact)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      leadSource: '',
      status: 'Prospect',
      nextFollowUpDate: '',
      priority: 'medium',
      notes: '',
      tags: '',
    },
  })

  function onSubmit(data: ContactFormValues) {
    addContact({
      fullName: data.fullName,
      phone: data.phone || '',
      email: data.email || '',
      leadSource: data.leadSource || '',
      status: data.status,
      nextFollowUpDate: data.nextFollowUpDate || null,
      priority: data.priority,
      notes: data.notes || '',
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
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
          <h2 className="text-lg font-semibold text-zinc-100">Add Contact</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name *</label>
            <input
              {...register('fullName')}
              className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
              placeholder="John Smith"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>
            )}
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Phone</label>
              <input
                {...register('phone')}
                className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
              <input
                {...register('email')}
                className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                placeholder="john@email.com"
              />
            </div>
          </div>

          {/* Lead Source */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Lead Source</label>
            <input
              {...register('leadSource')}
              className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
              placeholder="Referral, Open House, Website..."
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                {STATUSES.map((s) => (
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

          {/* Next Follow-Up Date */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Next Follow-Up Date</label>
            <input
              type="date"
              {...register('nextFollowUpDate')}
              className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
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

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Tags</label>
            <input
              {...register('tags')}
              className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
              placeholder="buyer, first-time, pre-approved (comma-separated)"
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
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
