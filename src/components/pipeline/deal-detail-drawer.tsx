"use client"

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import {
  X,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  DollarSign,
  CalendarClock,
  Activity as ActivityIcon,
} from 'lucide-react'
import { useDemoStore, type Deal } from '@/stores/demo-data'
import { ActivityTimeline } from './activity-timeline'
import { cn } from '@/lib/utils'

const STAGES: Deal['stage'][] = [
  'Lead', 'Active Client', 'Offer Stage', 'Under Contract', 'Closed', 'Dead',
]

const PRIORITIES: Deal['priority'][] = ['low', 'medium', 'high', 'urgent']

const STAGE_COLORS: Record<Deal['stage'], string> = {
  Lead: 'bg-zinc-500/20 text-zinc-300',
  'Active Client': 'bg-blue-500/20 text-blue-300',
  'Offer Stage': 'bg-amber-500/20 text-amber-300',
  'Under Contract': 'bg-purple-500/20 text-purple-300',
  Closed: 'bg-green-500/20 text-green-300',
  Dead: 'bg-red-500/20 text-red-300',
}

const PRIORITY_COLORS: Record<Deal['priority'], string> = {
  low: 'bg-zinc-500/20 text-zinc-400',
  medium: 'bg-blue-500/20 text-blue-400',
  high: 'bg-amber-500/20 text-amber-400',
  urgent: 'bg-red-500/20 text-red-400',
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
}

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

interface DealDetailDrawerProps {
  dealId: string | null
  onClose: () => void
  onLogActivity: (contactId: string | null, dealId: string) => void
}

export function DealDetailDrawer({ dealId, onClose, onLogActivity }: DealDetailDrawerProps) {
  const deals = useDemoStore((s) => s.deals)
  const contacts = useDemoStore((s) => s.contacts)
  const activities = useDemoStore((s) => s.activities)
  const updateDeal = useDemoStore((s) => s.updateDeal)
  const deleteDeal = useDemoStore((s) => s.deleteDeal)

  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const deal = deals.find((d) => d.id === dealId)
  const contact = deal?.contactId ? contacts.find((c) => c.id === deal.contactId) : null

  const dealActivities = useMemo(
    () => activities.filter((a) => a.dealId === dealId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    [activities, dealId]
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    values: deal
      ? {
          title: deal.title,
          contactId: deal.contactId || '',
          propertyAddress: deal.propertyAddress,
          stage: deal.stage,
          estimatedCommission: deal.estimatedCommission,
          estimatedCloseDate: deal.estimatedCloseDate || '',
          priority: deal.priority,
          notes: deal.notes,
        }
      : undefined,
  })

  function onSubmit(data: DealFormValues) {
    if (!dealId) return
    updateDeal(dealId, {
      title: data.title,
      contactId: data.contactId || null,
      propertyAddress: data.propertyAddress || '',
      stage: data.stage,
      estimatedCommission: data.estimatedCommission,
      estimatedCloseDate: data.estimatedCloseDate || null,
      priority: data.priority,
      notes: data.notes || '',
    })
    setEditing(false)
  }

  function handleDelete() {
    if (!dealId) return
    deleteDeal(dealId)
    onClose()
  }

  function moveStage(direction: 'prev' | 'next') {
    if (!deal) return
    const idx = STAGES.indexOf(deal.stage)
    const newIdx = direction === 'next' ? idx + 1 : idx - 1
    if (newIdx >= 0 && newIdx < STAGES.length) {
      updateDeal(deal.id, { stage: STAGES[newIdx] })
    }
  }

  if (!dealId) return null

  const currentStageIdx = deal ? STAGES.indexOf(deal.stage) : -1

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#161820] border-l border-[#1e2030] shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#161820] border-b border-[#1e2030]">
          <h2 className="text-lg font-semibold text-zinc-100 truncate">
            {deal?.title || 'Deal'}
          </h2>
          <div className="flex items-center gap-2">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1e2030] transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1e2030] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!deal ? (
          <div className="p-6 text-center text-zinc-500">Deal not found</div>
        ) : editing ? (
          /* Edit Form */
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Title *</label>
              <input
                {...register('title')}
                className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
              {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Contact</label>
              <select {...register('contactId')} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
                <option value="">No contact</option>
                {contacts.map((c) => <option key={c.id} value={c.id}>{c.fullName}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Property Address</label>
              <input {...register('propertyAddress')} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Stage</label>
                <select {...register('stage')} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
                  {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Priority</label>
                <select {...register('priority')} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Est. Commission ($)</label>
                <input type="number" step="100" {...register('estimatedCommission', { valueAsNumber: true })} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Est. Close Date</label>
                <input type="date" {...register('estimatedCloseDate')} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Notes</label>
              <textarea {...register('notes')} rows={3} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none resize-none" />
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="h-4 w-4 inline mr-1" />Delete
              </button>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setEditing(false); reset() }} className="px-4 py-2 rounded-lg bg-[#1e2030] text-sm font-medium text-zinc-300 hover:bg-[#262838] transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
                  Save
                </button>
              </div>
            </div>

            {confirmDelete && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
                <p className="text-sm text-red-300 mb-3">Are you sure you want to delete this deal? This cannot be undone.</p>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 rounded-lg bg-[#1e2030] text-sm text-zinc-300 hover:bg-[#262838]">Cancel</button>
                  <button type="button" onClick={handleDelete} className="px-3 py-1.5 rounded-lg bg-red-600 text-sm text-white hover:bg-red-500">Delete</button>
                </div>
              </div>
            )}
          </form>
        ) : (
          /* View Mode */
          <div className="p-6 space-y-6">
            {/* Stage & Priority */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', STAGE_COLORS[deal.stage])}>
                {deal.stage}
              </span>
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase', PRIORITY_COLORS[deal.priority])}>
                {deal.priority}
              </span>
            </div>

            {/* Stage Quick Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => moveStage('prev')}
                disabled={currentStageIdx <= 0}
                className={cn(
                  'flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  currentStageIdx <= 0
                    ? 'bg-[#1e2030] text-zinc-600 cursor-not-allowed'
                    : 'bg-[#1e2030] text-zinc-300 hover:bg-[#262838]'
                )}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                {currentStageIdx > 0 ? STAGES[currentStageIdx - 1] : 'Prev'}
              </button>
              <div className="flex-1 text-center text-xs font-medium text-zinc-500">
                Stage {currentStageIdx + 1} of {STAGES.length}
              </div>
              <button
                onClick={() => moveStage('next')}
                disabled={currentStageIdx >= STAGES.length - 1}
                className={cn(
                  'flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  currentStageIdx >= STAGES.length - 1
                    ? 'bg-[#1e2030] text-zinc-600 cursor-not-allowed'
                    : 'bg-[#1e2030] text-zinc-300 hover:bg-[#262838]'
                )}
              >
                {currentStageIdx < STAGES.length - 1 ? STAGES[currentStageIdx + 1] : 'Next'}
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Deal Info */}
            <div className="space-y-3">
              {contact && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-zinc-500 shrink-0" />
                  <span className="text-zinc-300">{contact.fullName}</span>
                </div>
              )}
              {deal.propertyAddress && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-zinc-500 shrink-0" />
                  <span className="text-zinc-300">{deal.propertyAddress}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <DollarSign className="h-4 w-4 text-zinc-500 shrink-0" />
                <span className="text-zinc-300 font-medium">{formatCurrency(deal.estimatedCommission)}</span>
              </div>
              {deal.estimatedCloseDate && (
                <div className="flex items-center gap-3 text-sm">
                  <CalendarClock className="h-4 w-4 text-zinc-500 shrink-0" />
                  <span className="text-zinc-300">
                    Close: {format(new Date(deal.estimatedCloseDate), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </div>

            {/* Notes */}
            {deal.notes && (
              <div className="rounded-xl bg-[#12141a] border border-[#1e2030] p-4">
                <p className="text-xs font-medium text-zinc-500 mb-1">Notes</p>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{deal.notes}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onLogActivity(deal.contactId, deal.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#1e2030] px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-[#262838] transition-colors"
                >
                  <ActivityIcon className="h-3.5 w-3.5" /> Log Activity
                </button>
              </div>
            </div>

            {/* Contact Info */}
            {contact && (
              <div className="rounded-xl bg-[#12141a] border border-[#1e2030] p-4">
                <p className="text-xs font-medium text-zinc-500 mb-2">Contact</p>
                <p className="text-sm font-medium text-zinc-200">{contact.fullName}</p>
                {contact.phone && <p className="text-xs text-zinc-400 mt-1">{contact.phone}</p>}
                {contact.email && <p className="text-xs text-zinc-400">{contact.email}</p>}
              </div>
            )}

            {/* Activity Timeline */}
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2">Activity ({dealActivities.length})</p>
              <ActivityTimeline activities={dealActivities} maxItems={10} />
            </div>

            {/* Delete */}
            <div className="pt-2 border-t border-[#1e2030]">
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> Delete Deal
                </button>
              ) : (
                <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
                  <p className="text-sm text-red-300 mb-3">Are you sure? This cannot be undone.</p>
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 rounded-lg bg-[#1e2030] text-sm text-zinc-300 hover:bg-[#262838]">Cancel</button>
                    <button onClick={handleDelete} className="px-3 py-1.5 rounded-lg bg-red-600 text-sm text-white hover:bg-red-500">Delete</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
