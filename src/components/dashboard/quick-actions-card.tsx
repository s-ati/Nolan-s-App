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
  Target,
} from 'lucide-react'

const actions = [
  { key: 'log-call', label: 'Log Call', icon: Phone },
  { key: 'log-text', label: 'Log Text', icon: MessageSquare },
  { key: 'log-email', label: 'Log Email', icon: Mail },
  { key: 'log-meeting', label: 'Meeting', icon: Users },
  { key: 'log-showing', label: 'Showing', icon: Home },
  { key: 'add-contact', label: 'Add Lead', icon: UserPlus },
  { key: 'add-deal', label: 'Add Deal', icon: Briefcase },
  { key: 'add-quest', label: 'Add Goal', icon: Target },
]

export default function QuickActionsCard() {
  const openQuickAction = useAppStore((s) => s.openQuickAction)

  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#12141a] p-5">
      <h3 className="text-sm font-semibold text-zinc-200 mb-4">Quick Actions</h3>

      <div className="grid grid-cols-4 gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.key}
              onClick={() => openQuickAction(action.key)}
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.04] bg-zinc-800/30 px-2 py-3 transition-all hover:border-blue-500/20 hover:bg-blue-500/[0.06]"
            >
              <Icon className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-blue-400" />
              <span className="text-[10px] font-medium text-zinc-500 transition-colors group-hover:text-blue-400">
                {action.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
