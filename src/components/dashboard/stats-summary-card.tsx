'use client'

import { useDemoStore } from '@/stores/demo-data'
import { calculateStatProgress } from '@/lib/game/xp-engine'
import { cn } from '@/lib/utils'
import { BarChart3 } from 'lucide-react'

const statColors: Record<string, string> = {
  'Lead Generation': 'bg-blue-500',
  Networking: 'bg-green-500',
  Marketing: 'bg-purple-500',
  Negotiation: 'bg-amber-500',
  Knowledge: 'bg-cyan-500',
  Discipline: 'bg-red-500',
}

const statBgColors: Record<string, string> = {
  'Lead Generation': 'bg-blue-500/20',
  Networking: 'bg-green-500/20',
  Marketing: 'bg-purple-500/20',
  Negotiation: 'bg-amber-500/20',
  Knowledge: 'bg-cyan-500/20',
  Discipline: 'bg-red-500/20',
}

export default function StatsSummaryCard() {
  const statProgress = useDemoStore((s) => s.statProgress)

  if (statProgress.length === 0) {
    return (
      <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
            Stats
          </h3>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center py-4 text-center">
          <BarChart3 className="h-8 w-8 text-zinc-600" />
          <p className="mt-2 text-sm text-zinc-500">No stats tracked yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-5">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          Stats
        </h3>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
        {statProgress.map((stat) => {
          const progress = calculateStatProgress(stat.statValue)
          const barColor = statColors[stat.statName] || 'bg-blue-500'
          const bgColor = statBgColors[stat.statName] || 'bg-blue-500/20'

          return (
            <div key={stat.statName}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">{stat.statName}</span>
                <span className="text-xs font-semibold text-white">Lv {stat.level}</span>
              </div>
              <div className={cn('mt-1 h-1.5 overflow-hidden rounded-full', bgColor)}>
                <div
                  className={cn('h-full rounded-full transition-all', barColor)}
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
