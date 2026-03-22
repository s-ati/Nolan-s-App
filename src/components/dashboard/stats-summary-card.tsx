'use client'

import { useDemoStore } from '@/stores/demo-data'
import { calculateStatProgress } from '@/lib/game/xp-engine'
import { cn } from '@/lib/utils'
import { BarChart3 } from 'lucide-react'

const statConfig: Record<string, { bar: string; bg: string; text: string }> = {
  'Lead Generation': {
    bar: 'bg-blue-500',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
  },
  Networking: {
    bar: 'bg-emerald-500',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
  },
  Marketing: {
    bar: 'bg-purple-500',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
  },
  Negotiation: {
    bar: 'bg-amber-500',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
  },
  Knowledge: {
    bar: 'bg-cyan-500',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
  },
  Discipline: {
    bar: 'bg-rose-500',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
  },
}

export default function StatsSummaryCard() {
  const statProgress = useDemoStore((s) => s.statProgress)

  if (statProgress.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10">
            <BarChart3 className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Performance Index</h3>
            <p className="text-[11px] text-zinc-600">Agent skill progression</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] mb-3">
            <BarChart3 className="h-6 w-6 text-zinc-700" />
          </div>
          <p className="text-[13px] font-medium text-zinc-500">No skills tracked yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10">
            <BarChart3 className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Performance Index</h3>
            <p className="text-[11px] text-zinc-600">Agent skill progression</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {statProgress.map((stat) => {
          const progress = calculateStatProgress(stat.statValue)
          const cfg = statConfig[stat.statName] || {
            bar: 'bg-blue-500',
            bg: 'bg-blue-500/10',
            text: 'text-blue-400',
          }

          return (
            <div key={stat.statName}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-medium text-zinc-400">{stat.statName}</span>
                <div className="flex items-center gap-1.5">
                  <div className={cn('rounded-md px-1.5 py-0.5', cfg.bg)}>
                    <span className={cn('text-[10px] font-bold', cfg.text)}>Lv {stat.level}</span>
                  </div>
                </div>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', cfg.bar)}
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
