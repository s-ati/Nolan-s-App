'use client'

import { useDemoStore } from '@/stores/demo-data'
import { useAppStore } from '@/stores/app-store'
import { format, differenceInDays, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import { UserCheck, Phone, CheckCircle } from 'lucide-react'

const priorityColors: Record<string, string> = {
  low: 'bg-zinc-700/40 text-zinc-400',
  medium: 'bg-blue-500/10 text-blue-400',
  high: 'bg-amber-500/10 text-amber-400',
  urgent: 'bg-red-500/10 text-red-400',
}

export default function DueFollowupsCard() {
  const contacts = useDemoStore((s) => s.contacts)
  const openQuickAction = useAppStore((s) => s.openQuickAction)

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const dueContacts = contacts
    .filter((c) => c.nextFollowUpDate && c.nextFollowUpDate <= todayStr)
    .sort((a, b) => (a.nextFollowUpDate! > b.nextFollowUpDate! ? 1 : -1))

  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#12141a] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
            <UserCheck className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">Due Follow-ups</h3>
        </div>
        {dueContacts.length > 0 && (
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
            {dueContacts.length}
          </span>
        )}
      </div>

      {dueContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <CheckCircle className="h-8 w-8 text-emerald-500/40" />
          <p className="mt-2.5 text-sm text-zinc-500">All caught up!</p>
          <p className="text-xs text-zinc-600">No follow-ups overdue</p>
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
              daysOverdue === 0
                ? 'Due today'
                : `${daysOverdue}d overdue`

            return (
              <div
                key={contact.id}
                className="flex items-center gap-3 rounded-lg bg-zinc-800/30 px-3 py-2.5 transition-colors hover:bg-zinc-800/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-200">
                    {contact.fullName}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-[11px] font-semibold',
                        isOverdue ? 'text-red-400' : 'text-amber-400'
                      )}
                    >
                      {dueLabel}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                        priorityColors[contact.priority]
                      )}
                    >
                      {contact.priority}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    openQuickAction('log-call', { contactId: contact.id })
                  }
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 transition-colors hover:bg-blue-500/20"
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
