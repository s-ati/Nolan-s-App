'use client'

import { useDemoStore } from '@/stores/demo-data'
import { useAppStore } from '@/stores/app-store'
import { format, differenceInDays, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import { UserCheck, Phone, CheckCircle } from 'lucide-react'

const priorityColors: Record<string, string> = {
  low: 'bg-zinc-700/50 text-zinc-400',
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
    <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-5">
      <div className="flex items-center gap-2">
        <UserCheck className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          Due Follow-ups
        </h3>
        {dueContacts.length > 0 && (
          <span className="ml-auto rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
            {dueContacts.length}
          </span>
        )}
      </div>

      {dueContacts.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center py-4 text-center">
          <CheckCircle className="h-8 w-8 text-green-500/50" />
          <p className="mt-2 text-sm text-zinc-500">No follow-ups due. Great job!</p>
        </div>
      ) : (
        <div className="mt-3 space-y-1.5">
          {dueContacts.map((contact) => {
            const daysOverdue = differenceInDays(
              new Date(),
              parseISO(contact.nextFollowUpDate!)
            )
            const isOverdue = daysOverdue > 0
            const dueLabel =
              daysOverdue === 0
                ? 'Due today'
                : `${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`

            return (
              <div
                key={contact.id}
                className="flex items-center gap-3 rounded-lg bg-zinc-800/50 px-3 py-2.5 transition-colors hover:bg-zinc-800/70"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">
                    {contact.fullName}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={cn(
                        'text-xs font-medium',
                        isOverdue ? 'text-red-400' : 'text-amber-400'
                      )}
                    >
                      {dueLabel}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs',
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
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 transition-colors hover:bg-blue-500/20"
                  title="Log a call"
                >
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
