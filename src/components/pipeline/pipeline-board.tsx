"use client"

import { format, isBefore, startOfDay } from 'date-fns'
import { Phone } from 'lucide-react'
import { useDemoStore, type Contact } from '@/stores/demo-data'
import { cn } from '@/lib/utils'

const PRIORITY_COLORS: Record<Contact['priority'], string> = {
  low: 'bg-zinc-500/20 text-zinc-400',
  medium: 'bg-blue-500/20 text-blue-400',
  high: 'bg-amber-500/20 text-amber-400',
  urgent: 'bg-red-500/20 text-red-400',
}

interface Column {
  title: string
  statuses: Contact['status'][]
}

const COLUMNS: Column[] = [
  { title: 'New Leads', statuses: ['Prospect', 'Warm Lead'] },
  { title: 'Active Conversations', statuses: ['Active Buyer', 'Active Seller'] },
  { title: 'Active Clients', statuses: ['Nurture'] },
  { title: 'Under Contract / Closing', statuses: ['Under Contract'] },
]

interface PipelineBoardProps {
  onSelectContact: (id: string) => void
}

export function PipelineBoard({ onSelectContact }: PipelineBoardProps) {
  const contacts = useDemoStore((s) => s.contacts)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const columnContacts = contacts.filter((c) =>
          col.statuses.includes(c.status)
        )

        return (
          <div key={col.title} className="flex flex-col min-h-0">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-zinc-300">{col.title}</h3>
              <span className="flex items-center justify-center h-5 min-w-[20px] rounded-full bg-[#1e2030] px-1.5 text-xs font-medium text-zinc-400">
                {columnContacts.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-320px)] pr-1 pb-2">
              {columnContacts.length === 0 ? (
                <div className="flex items-center justify-center h-24 rounded-xl border border-dashed border-[#1e2030] text-xs text-zinc-600">
                  No contacts
                </div>
              ) : (
                columnContacts.map((contact) => {
                  const isOverdue =
                    contact.nextFollowUpDate &&
                    isBefore(new Date(contact.nextFollowUpDate), startOfDay(new Date()))

                  return (
                    <button
                      key={contact.id}
                      onClick={() => onSelectContact(contact.id)}
                      className="w-full text-left bg-[#12141a] border border-[#1e2030] rounded-xl p-3.5 hover:border-[#2a2d40] transition-colors group"
                    >
                      {/* Name & Priority */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                          {contact.fullName}
                        </span>
                        <span
                          className={cn(
                            'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                            PRIORITY_COLORS[contact.priority]
                          )}
                        >
                          {contact.priority}
                        </span>
                      </div>

                      {/* Follow-Up Date */}
                      {contact.nextFollowUpDate && (
                        <p
                          className={cn(
                            'text-xs mb-1.5',
                            isOverdue ? 'text-red-400 font-medium' : 'text-zinc-500'
                          )}
                        >
                          {isOverdue ? 'Overdue: ' : 'Follow-up: '}
                          {format(new Date(contact.nextFollowUpDate), 'MMM d')}
                        </p>
                      )}

                      {/* Phone */}
                      {contact.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <Phone className="h-3 w-3" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
