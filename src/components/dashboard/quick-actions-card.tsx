'use client'

import { useAppStore } from '@/stores/app-store'
import {
  Phone,
  MessageSquare,
  Mail,
  Users,
  Home,
  UserPlus,
  Briefcase,
  Scroll,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const actions = [
  { key: 'log-call', label: 'Log Call', icon: Phone },
  { key: 'log-text', label: 'Log Text', icon: MessageSquare },
  { key: 'log-email', label: 'Log Email', icon: Mail },
  { key: 'log-meeting', label: 'Log Meeting', icon: Users },
  { key: 'log-showing', label: 'Log Showing', icon: Home },
  { key: 'add-contact', label: 'Add Contact', icon: UserPlus },
  { key: 'add-deal', label: 'Add Deal', icon: Briefcase },
  { key: 'add-quest', label: 'Add Quest', icon: Scroll },
]

export default function QuickActionsCard() {
  const openQuickAction = useAppStore((s) => s.openQuickAction)

  return (
    <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-5">
      <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
        Quick Actions
      </h3>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.key}
              onClick={() => openQuickAction(action.key)}
              className="flex flex-col items-center gap-1.5 rounded-lg bg-zinc-800/50 px-2 py-3 transition-colors hover:bg-zinc-800 hover:text-blue-400 group"
            >
              <Icon className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-blue-400" />
              <span className="text-[11px] font-medium text-zinc-400 transition-colors group-hover:text-blue-400">
                {action.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
