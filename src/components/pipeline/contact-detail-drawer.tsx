"use client"

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, isBefore, startOfDay } from 'date-fns'
import {
  X,
  Pencil,
  Trash2,
  Phone,
  Mail,
  MessageSquare,
  CalendarClock,
  Tag,
  MapPin,
} from 'lucide-react'
import { useDemoStore, type Contact } from '@/stores/demo-data'
import { ActivityTimeline } from './activity-timeline'
import { cn } from '@/lib/utils'

const STATUSES: Contact['status'][] = [
  'Prospect', 'Warm Lead', 'Active Buyer', 'Active Seller',
  'Nurture', 'Under Contract', 'Closed', 'Lost',
]

const PRIORITIES: Contact['priority'][] = ['low', 'medium', 'high', 'urgent']

const STATUS_COLORS: Record<Contact['status'], string> = {
  Prospect: 'bg-zinc-500/20 text-zinc-300',
  'Warm Lead': 'bg-amber-500/20 text-amber-300',
  'Active Buyer': 'bg-blue-500/20 text-blue-300',
  'Active Seller': 'bg-cyan-500/20 text-cyan-300',
  Nurture: 'bg-purple-500/20 text-purple-300',
  'Under Contract': 'bg-indigo-500/20 text-indigo-300',
  Closed: 'bg-green-500/20 text-green-300',
  Lost: 'bg-red-500/20 text-red-300',
}

const PRIORITY_COLORS: Record<Contact['priority'], string> = {
  low: 'bg-zinc-500/20 text-zinc-400',
  medium: 'bg-blue-500/20 text-blue-400',
  high: 'bg-amber-500/20 text-amber-400',
  urgent: 'bg-red-500/20 text-red-400',
}

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

interface ContactDetailDrawerProps {
  contactId: string | null
  onClose: () => void
  onLogActivity: (contactId: string, type?: string) => void
}

export function ContactDetailDrawer({ contactId, onClose, onLogActivity }: ContactDetailDrawerProps) {
  const contacts = useDemoStore((s) => s.contacts)
  const deals = useDemoStore((s) => s.deals)
  const activities = useDemoStore((s) => s.activities)
  const updateContact = useDemoStore((s) => s.updateContact)
  const deleteContact = useDemoStore((s) => s.deleteContact)

  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const contact = contacts.find((c) => c.id === contactId)

  const contactDeals = useMemo(
    () => deals.filter((d) => d.contactId === contactId),
    [deals, contactId]
  )

  const contactActivities = useMemo(
    () => activities.filter((a) => a.contactId === contactId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    [activities, contactId]
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    values: contact
      ? {
          fullName: contact.fullName,
          phone: contact.phone,
          email: contact.email,
          leadSource: contact.leadSource,
          status: contact.status,
          nextFollowUpDate: contact.nextFollowUpDate || '',
          priority: contact.priority,
          notes: contact.notes,
          tags: contact.tags.join(', '),
        }
      : undefined,
  })

  function onSubmit(data: ContactFormValues) {
    if (!contactId) return
    updateContact(contactId, {
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
    setEditing(false)
  }

  function handleDelete() {
    if (!contactId) return
    deleteContact(contactId)
    onClose()
  }

  if (!contactId) return null

  const isOverdue =
    contact?.nextFollowUpDate &&
    isBefore(new Date(contact.nextFollowUpDate), startOfDay(new Date()))

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#161820] border-l border-[#1e2030] shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#161820] border-b border-[#1e2030]">
          <h2 className="text-lg font-semibold text-zinc-100 truncate">
            {contact?.fullName || 'Contact'}
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

        {!contact ? (
          <div className="p-6 text-center text-zinc-500">Contact not found</div>
        ) : editing ? (
          /* Edit Form */
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name *</label>
              <input
                {...register('fullName')}
                className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Phone</label>
                <input {...register('phone')} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                <input {...register('email')} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Lead Source</label>
              <input {...register('leadSource')} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Status</label>
                <select {...register('status')} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Priority</label>
                <select {...register('priority')} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Next Follow-Up</label>
              <input type="date" {...register('nextFollowUpDate')} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Notes</label>
              <textarea {...register('notes')} rows={3} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Tags</label>
              <input {...register('tags')} className="w-full rounded-lg bg-[#1a1c28] border border-[#1e2030] px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none" placeholder="Comma-separated tags" />
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => { setConfirmDelete(true) }}
                className="px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="h-4 w-4 inline mr-1" />Delete
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setEditing(false); reset() }}
                  className="px-4 py-2 rounded-lg bg-[#1e2030] text-sm font-medium text-zinc-300 hover:bg-[#262838] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Delete Confirmation */}
            {confirmDelete && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
                <p className="text-sm text-red-300 mb-3">Are you sure you want to delete this contact? This cannot be undone.</p>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 rounded-lg bg-[#1e2030] text-sm text-zinc-300 hover:bg-[#262838]">
                    Cancel
                  </button>
                  <button type="button" onClick={handleDelete} className="px-3 py-1.5 rounded-lg bg-red-600 text-sm text-white hover:bg-red-500">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </form>
        ) : (
          /* View Mode */
          <div className="p-6 space-y-6">
            {/* Status & Priority */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_COLORS[contact.status])}>
                {contact.status}
              </span>
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase', PRIORITY_COLORS[contact.priority])}>
                {contact.priority}
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              {contact.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-zinc-500 shrink-0" />
                  <span className="text-zinc-300">{contact.phone}</span>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-zinc-500 shrink-0" />
                  <span className="text-zinc-300">{contact.email}</span>
                </div>
              )}
              {contact.leadSource && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-zinc-500 shrink-0" />
                  <span className="text-zinc-400">Source: {contact.leadSource}</span>
                </div>
              )}
              {contact.nextFollowUpDate && (
                <div className="flex items-center gap-3 text-sm">
                  <CalendarClock className="h-4 w-4 text-zinc-500 shrink-0" />
                  <span className={cn(isOverdue ? 'text-red-400 font-medium' : 'text-zinc-300')}>
                    Follow-up: {format(new Date(contact.nextFollowUpDate), 'MMM d, yyyy')}
                    {isOverdue && ' (overdue)'}
                  </span>
                </div>
              )}
              {contact.tags.length > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <Tag className="h-4 w-4 text-zinc-500 shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.map((tag) => (
                      <span key={tag} className="rounded bg-[#1e2030] px-2 py-0.5 text-xs text-zinc-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {contact.notes && (
              <div className="rounded-xl bg-[#12141a] border border-[#1e2030] p-4">
                <p className="text-xs font-medium text-zinc-500 mb-1">Notes</p>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{contact.notes}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onLogActivity(contact.id, 'Call')}
                  className="flex items-center gap-1.5 rounded-lg bg-[#1e2030] px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-[#262838] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" /> Log Call
                </button>
                <button
                  onClick={() => onLogActivity(contact.id, 'Email')}
                  className="flex items-center gap-1.5 rounded-lg bg-[#1e2030] px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-[#262838] transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" /> Log Email
                </button>
                <button
                  onClick={() => onLogActivity(contact.id, 'Text')}
                  className="flex items-center gap-1.5 rounded-lg bg-[#1e2030] px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-[#262838] transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Log Text
                </button>
                <button
                  onClick={() => {
                    const today = format(new Date(), 'yyyy-MM-dd')
                    updateContact(contact.id, { nextFollowUpDate: today })
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-[#1e2030] px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-[#262838] transition-colors"
                >
                  <CalendarClock className="h-3.5 w-3.5" /> Set Follow-up
                </button>
              </div>
            </div>

            {/* Associated Deals */}
            {contactDeals.length > 0 && (
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-2">Deals ({contactDeals.length})</p>
                <div className="space-y-2">
                  {contactDeals.map((deal) => (
                    <div key={deal.id} className="rounded-lg bg-[#12141a] border border-[#1e2030] p-3">
                      <p className="text-sm font-medium text-zinc-200">{deal.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500">{deal.stage}</span>
                        <span className="text-xs text-zinc-600">|</span>
                        <span className="text-xs text-zinc-400 font-medium">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(deal.estimatedCommission)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Timeline */}
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2">Activity ({contactActivities.length})</p>
              <ActivityTimeline activities={contactActivities} maxItems={10} />
            </div>

            {/* Delete */}
            <div className="pt-2 border-t border-[#1e2030]">
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> Delete Contact
                </button>
              ) : (
                <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
                  <p className="text-sm text-red-300 mb-3">Are you sure? This cannot be undone.</p>
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 rounded-lg bg-[#1e2030] text-sm text-zinc-300 hover:bg-[#262838]">
                      Cancel
                    </button>
                    <button onClick={handleDelete} className="px-3 py-1.5 rounded-lg bg-red-600 text-sm text-white hover:bg-red-500">
                      Delete
                    </button>
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
