'use client'

import { useDemoStore } from '@/stores/demo-data'
import { calculateStatProgress } from '@/lib/game/xp-engine'
import { cn } from '@/lib/utils'
import { BarChart3 } from 'lucide-react'

const statColors: Record<string, string> = {
  'Lead Generation': 'bg-blue-500',
  Networking: 'bg-emerald-500',
  Marketing: 'bg-purple-500',
  Negotiation: 'bg-amber-500',
  Knowledge: 'bg-cyan-500',
  Discipline: 'bg-rose-500',
}

const statAccentColors: Record<string, string> = {
  'Lead Generation': 'text-blue-400',
  Networking: 'text-emerald-400',
  Marketing: 'text-purple-400',
  Negotiation: 'text-amber-400',
  Knowledge: 'text-cyan-400',
  Discipline: 'text-rose-400',
}

const statBgColors: Record<string, string> = {
  'Lead Generation': 'bg-blue-500/15',
  Networking: 'bg-emerald-500/15',
  Marketing: 'bg-purple-500/15',
  Negotiation: 'bg-amber-500/15',
  Knowledge: 'bg-cyan-500/15',
  Discipline: 'bg-rose-500/15',
}

export default function StatsSummaryCard() {
  const statProgress = useDemoStore((s) => s.statProgress)

  if (statProgress.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.05] bg-[#12141a] p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
            <BarChart3 className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">Agent Skills</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <BarChart3 className="h-8 w-8 text-zinc-700" />
          <p className="mt-2.5 text-sm text-zinc-500">No skills tracked yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#12141a] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
            <BarChart3 className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">Agent Skills</h3>
        </div>
        <span className="text-[11px] text-zinc-600">career progress</span>
      </div>

      <div className="space-y-3">
        {statProgress.map((stat) => {
          const progress = calculateStatProgress(stat.statValue)
          const barColor = statColors[stat.statName] || 'bg-blue-500'
          const bgColor = statBgColors[stat.statName] || 'bg-blue-500/15'
          const accentColor = statAccentColors[stat.statName] || 'text-blue-400'

          return (
            <div key={stat.statName}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-zinc-400">{stat.statName}</span>
                <span className={cn('text-[11px] font-semibold', accentColor)}>
                  Lv {stat.level}
                </span>
              </div>
              <div className={cn('h-1.5 overflow-hidden rounded-full', bgColor)}>
                <div
                  className={cn('h-full rounded-full transition-all duration-700', barColor)}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
