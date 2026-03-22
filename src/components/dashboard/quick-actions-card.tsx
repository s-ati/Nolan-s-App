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
  { key: 'log-call', label: 'Log Call', icon: Phone, color: 'text-blue-400', bg: 'bg-blue-500/10 group-hover:bg-blue-500/20' },
  { key: 'log-text', label: 'Log Text', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10 group-hover:bg-emerald-500/20' },
  { key: 'log-email', label: 'Log Email', icon: Mail, color: 'text-purple-400', bg: 'bg-purple-500/10 group-hover:bg-purple-500/20' },
  { key: 'log-meeting', label: 'Meeting', icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10 group-hover:bg-amber-500/20' },
  { key: 'log-showing', label: 'Showing', icon: Home, color: 'text-cyan-400', bg: 'bg-cyan-500/10 group-hover:bg-cyan-500/20' },
  { key: 'add-contact', label: 'Add Lead', icon: UserPlus, color: 'text-blue-400', bg: 'bg-blue-500/10 group-hover:bg-blue-500/20' },
  { key: 'add-deal', label: 'Add Deal', icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10 group-hover:bg-emerald-500/20' },
  { key: 'add-quest', label: 'Add Goal', icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10 group-hover:bg-purple-500/20' },
]

export default function QuickActionsCard() {
  const openQuickAction = useAppStore((s) => s.openQuickAction)

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      <div className="mb-5">
        <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Quick Actions</h3>
        <p className="text-[11px] text-zinc-600 mt-0.5">Log activities and manage leads</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.key}
              onClick={() => openQuickAction(action.key)}
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-2 py-3.5 transition-all hover:border-white/[0.08] hover:bg-white/[0.05]"
            >
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${action.bg}`}>
                <Icon className={`h-3.5 w-3.5 ${action.color}`} />
              </div>
              <span className="text-[10px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors leading-tight text-center">
                {action.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
