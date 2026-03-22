'use client'

import { useDemoStore } from '@/stores/demo-data'
import { useAppStore } from '@/stores/app-store'
import { format, differenceInDays, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import { UserCheck, Phone, CheckCircle, Clock } from 'lucide-react'

const priorityConfig: Record<string, { label: string; cls: string }> = {
  low: { label: 'Low', cls: 'bg-zinc-700/40 text-zinc-500' },
  medium: { label: 'Medium', cls: 'bg-blue-500/10 text-blue-400' },
  high: { label: 'High', cls: 'bg-amber-500/10 text-amber-400' },
  urgent: { label: 'Urgent', cls: 'bg-red-500/10 text-red-400' },
}

export default function DueFollowupsCard() {
  const contacts = useDemoStore((s) => s.contacts)
  const openQuickAction = useAppStore((s) => s.openQuickAction)

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const dueContacts = contacts
    .filter((c) => c.nextFollowUpDate && c.nextFollowUpDate <= todayStr)
    .sort((a, b) => (a.nextFollowUpDate! > b.nextFollowUpDate! ? 1 : -1))

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10">
            <UserCheck className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Due Follow-ups</h3>
            <p className="text-[11px] text-zinc-600">Contacts awaiting outreach</p>
          </div>
        </div>
        {dueContacts.length > 0 && (
          <div className="flex h-6 min-w-[24px] items-center justify-center rounded-lg bg-amber-500/10 px-2">
            <span className="text-[11px] font-bold text-amber-400">{dueContacts.length}</span>
          </div>
        )}
      </div>

      {dueContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/[0.06] mb-3">
            <CheckCircle className="h-6 w-6 text-emerald-500/60" />
          </div>
          <p className="text-[13px] font-medium text-zinc-500">All caught up</p>
          <p className="text-[11px] text-zinc-700 mt-0.5">No follow-ups overdue</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {dueContacts.map((contact) => {
            const daysOverdue = differenceInDays(
              new Date(),
              parseISO(contact.nextFollowUpDate!)
            )
            const isOverdue = daysOverdue > 0
            const dueLabel =
              daysOverdue === 0 ? 'Due today' : `${daysOverdue}d overdue`
            const priority = priorityConfig[contact.priority]

            return (
              <div
                key={contact.id}
                className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-3 py-3 transition-all hover:bg-white/[0.04]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-800/60 text-[11px] font-bold text-zinc-400">
                  {contact.fullName.slice(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-zinc-200 leading-tight truncate">
                    {contact.fullName}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Clock className="h-2.5 w-2.5 text-zinc-600 shrink-0" />
                    <span
                      className={cn(
                        'text-[10px] font-semibold',
                        isOverdue ? 'text-red-400' : 'text-amber-400'
                      )}
                    >
                      {dueLabel}
                    </span>
                    {priority && (
                      <>
                        <span className="text-zinc-700">·</span>
                        <span className={cn('rounded-md px-1.5 py-0.5 text-[9px] font-semibold', priority.cls)}>
                          {priority.label}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => openQuickAction('log-call', { contactId: contact.id })}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-all hover:bg-blue-500/20 hover:text-blue-300"
                  title="Log a call"
                >
                  <Phone className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
