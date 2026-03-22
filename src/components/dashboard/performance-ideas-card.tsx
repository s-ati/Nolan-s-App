'use client'

import { useMemo } from 'react'
import { useDemoStore } from '@/stores/demo-data'
import { useAppStore } from '@/stores/app-store'
import { generatePerformanceIdeas, type PerformanceIdea } from '@/lib/game/performance-ideas'
import {
  Zap, Clock, Flame, Users, Briefcase, Phone, TrendingUp,
  CheckCircle2, Trophy, Target, Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  zap: Zap,
  clock: Clock,
  flame: Flame,
  users: Users,
  briefcase: Briefcase,
  phone: Phone,
  'trending-up': TrendingUp,
  'check-circle-2': CheckCircle2,
  trophy: Trophy,
  target: Target,
  star: Star,
}

const PRIORITY_STYLES: Record<string, { bar: string; icon: string; label: string; labelCls: string }> = {
  urgent: { bar: 'bg-red-500',    icon: 'text-red-400',    label: 'Urgent',  labelCls: 'bg-red-500/10 text-red-400' },
  high:   { bar: 'bg-amber-500',  icon: 'text-amber-400',  label: 'High',    labelCls: 'bg-amber-500/10 text-amber-400' },
  medium: { bar: 'bg-blue-500',   icon: 'text-blue-400',   label: 'Focus',   labelCls: 'bg-blue-500/10 text-blue-400' },
  low:    { bar: 'bg-emerald-500',icon: 'text-emerald-400',label: 'Good',    labelCls: 'bg-emerald-500/10 text-emerald-400' },
}

function IdeaRow({ idea, onAction }: { idea: PerformanceIdea; onAction?: (key: string) => void }) {
  const Icon = ICON_MAP[idea.icon] ?? Target
  const style = PRIORITY_STYLES[idea.priority]

  return (
    <div className="flex items-start gap-3 rounded-xl bg-white/[0.02] border border-white/[0.03] px-3.5 py-3 hover:bg-white/[0.035] transition-all">
      {/* Priority bar */}
      <div className={cn('mt-1 w-0.5 h-full min-h-[2rem] rounded-full shrink-0', style.bar)} />

      {/* Icon */}
      <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]')}>
        <Icon className={cn('h-3.5 w-3.5', style.icon)} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] text-zinc-300 leading-snug">{idea.text}</p>
        {idea.actionKey && idea.actionLabel && onAction && (
          <button
            onClick={() => onAction(idea.actionKey!)}
            className="mt-1.5 text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            {idea.actionLabel} →
          </button>
        )}
      </div>

      {/* Priority chip */}
      <span className={cn('shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide', style.labelCls)}>
        {style.label}
      </span>
    </div>
  )
}

export default function PerformanceIdeasCard() {
  const activities  = useDemoStore((s) => s.activities)
  const contacts    = useDemoStore((s) => s.contacts)
  const deals       = useDemoStore((s) => s.deals)
  const streaks     = useDemoStore((s) => s.streaks)
  const profile     = useDemoStore((s) => s.profile)
  const dailyTasks  = useDemoStore((s) => s.dailyTasks)
  const openQuickAction = useAppStore((s) => s.openQuickAction)

  const ideas = useMemo(
    () => generatePerformanceIdeas({ activities, contacts, deals, streaks, profile, dailyTasks }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activities.length, contacts.length, deals.length, streaks, profile.totalXp, dailyTasks]
  )

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10">
            <Target className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Today&apos;s Coaching</h3>
            <p className="text-[11px] text-zinc-600 mt-0.5">Smart suggestions based on your data</p>
          </div>
        </div>
        <span className="text-[10px] font-medium text-zinc-700 uppercase tracking-widest">
          {ideas.length} insights
        </span>
      </div>

      <div className="space-y-2">
        {ideas.map((idea) => (
          <IdeaRow key={idea.id} idea={idea} onAction={(key) => openQuickAction(key)} />
        ))}
      </div>
    </div>
  )
}
