'use client'

import { useMemo } from 'react'
import { useDemoStore } from '@/stores/demo-data'
import { format, addDays } from 'date-fns'
import { cn } from '@/lib/utils'
import { Map, Zap, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const PERIOD_CONFIG = {
  weekly: { label: 'Weekly', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  monthly: { label: 'Monthly', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  pipeline: { label: 'Pipeline', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
}

const DIFFICULTY_XP_COLOR: Record<string, string> = {
  easy: 'text-emerald-400',
  normal: 'text-blue-400',
  hard: 'text-amber-400',
  epic: 'text-purple-400',
}

export default function QuestProgressCard() {
  const quests = useDemoStore((s) => s.quests)

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const weekEnd = format(addDays(new Date(), 7), 'yyyy-MM-dd')

  const groups = useMemo(() => {
    const weekly = quests.filter((q) => q.period === 'weekly' && q.status !== 'expired')
    const monthly = quests.filter((q) => q.period === 'monthly' && q.status !== 'expired')
    const pipeline = quests.filter((q) => q.period === 'pipeline' && q.status === 'active')

    return { weekly, monthly, pipeline }
  }, [quests])

  const totalActive = quests.filter((q) => q.status === 'active').length
  const totalXpAvailable = quests
    .filter((q) => q.status === 'active')
    .reduce((sum, q) => sum + q.xpReward, 0)

  // Show at most 2 per group, prioritise overdue/urgent
  const topQuests = useMemo(() => {
    const active = quests
      .filter((q) => q.status === 'active')
      .sort((a, b) => {
        // Overdue first
        const aOverdue = a.dueDate && a.dueDate < todayStr ? 0 : 1
        const bOverdue = b.dueDate && b.dueDate < todayStr ? 0 : 1
        if (aOverdue !== bOverdue) return aOverdue - bOverdue
        // Then by XP reward descending
        return b.xpReward - a.xpReward
      })
    return active.slice(0, 5)
  }, [quests, todayStr])

  if (totalActive === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10">
              <Map className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Active Quests</h3>
              <p className="text-[11px] text-zinc-600">Weekly &amp; monthly goals</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Map className="h-8 w-8 text-zinc-700 mb-3" />
          <p className="text-[13px] font-medium text-zinc-500">No active quests</p>
          <Link href="/quests" className="mt-2 text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
            Add a quest →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10">
            <Map className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Active Quests</h3>
            <p className="text-[11px] text-zinc-600">{totalActive} active · {totalXpAvailable.toLocaleString()} XP available</p>
          </div>
        </div>
        <Link
          href="/quests"
          className="flex items-center gap-1 text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          View all
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Period summary pills */}
      <div className="flex gap-2 mb-4">
        {(['weekly', 'monthly', 'pipeline'] as const).map((period) => {
          const group = groups[period]
          if (group.length === 0) return null
          const cfg = PERIOD_CONFIG[period]
          const done = group.filter((q) => q.status === 'completed').length

          return (
            <div key={period} className={cn('flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5', cfg.bg, cfg.border)}>
              <span className={cn('text-[10px] font-semibold', cfg.color)}>{cfg.label}</span>
              <span className="text-[10px] text-zinc-500">{done}/{group.length}</span>
            </div>
          )
        })}
      </div>

      {/* Quest list */}
      <div className="space-y-2">
        {topQuests.map((quest) => {
          const isOverdue = quest.dueDate && quest.dueDate < todayStr
          const cfg = PERIOD_CONFIG[quest.period as keyof typeof PERIOD_CONFIG]
          const xpColor = DIFFICULTY_XP_COLOR[quest.difficulty] ?? 'text-blue-400'

          return (
            <div
              key={quest.id}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all',
                isOverdue ? 'bg-red-500/[0.04] border-red-500/20' : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.035]'
              )}
            >
              {/* Status dot */}
              <div className={cn(
                'h-2 w-2 shrink-0 rounded-full',
                isOverdue ? 'bg-red-400' : 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]'
              )} />

              {/* Title */}
              <p className="flex-1 min-w-0 text-[12px] font-medium text-zinc-200 truncate">
                {quest.title}
              </p>

              {/* Metadata */}
              <div className="flex items-center gap-2 shrink-0">
                {isOverdue && (
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                )}
                {cfg && (
                  <span className={cn('text-[9px] font-medium', cfg.color)}>{cfg.label}</span>
                )}
                <div className="flex items-center gap-0.5">
                  <Zap className="h-2.5 w-2.5 text-blue-400/60" />
                  <span className={cn('text-[10px] font-bold', xpColor)}>{quest.xpReward}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Completed quests tally */}
      {(() => {
        const completedRecently = quests.filter(
          (q) => q.status === 'completed' && q.completedAt && q.completedAt.startsWith(todayStr)
        )
        if (completedRecently.length === 0) return null
        return (
          <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/15 px-3 py-2">
            <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
            <p className="text-[11px] text-emerald-400">
              <span className="font-bold">{completedRecently.length}</span> quest{completedRecently.length > 1 ? 's' : ''} completed today
            </p>
          </div>
        )
      })()}
    </div>
  )
}
