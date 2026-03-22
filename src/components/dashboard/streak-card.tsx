'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Flame, Trophy } from 'lucide-react'

const streakLabels: Record<string, string> = {
  daily_activity: 'Daily Activity',
  prospecting: 'Prospecting',
  planner: 'Schedule',
  followup: 'Follow-ups',
}

export default function StreakCard() {
  const streaks = useDemoStore((s) => s.streaks)
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  if (streaks.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.05] bg-[#12141a] p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10">
            <Flame className="h-3.5 w-3.5 text-orange-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">Consistency</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Flame className="h-8 w-8 text-zinc-700" />
          <p className="mt-2.5 text-sm text-zinc-500">No streaks yet.</p>
          <p className="text-xs text-zinc-600">Log activities daily to build momentum</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#12141a] p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10">
          <Flame className="h-3.5 w-3.5 text-orange-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">Consistency</h3>
      </div>

      <div className="space-y-2">
        {streaks.map((streak) => {
          const isActive = streak.lastCompletedDate === todayStr
          const label = streakLabels[streak.streakType] || streak.streakType

          return (
            <div
              key={streak.id}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                isActive
                  ? 'bg-orange-500/[0.06] border border-orange-500/[0.12]'
                  : 'bg-zinc-800/30'
              )}
            >
              <Flame
                className={cn(
                  'h-4 w-4 shrink-0',
                  isActive ? 'text-orange-400' : 'text-zinc-700'
                )}
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-200">{label}</p>
                {isActive && (
                  <span className="text-[10px] font-medium text-orange-400/70">
                    Active today
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-base font-bold text-white">{streak.currentCount}</p>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-wide">streak</p>
                </div>
                <div className="flex items-center gap-0.5 text-right">
                  <Trophy className="h-3 w-3 text-zinc-600" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-500">{streak.bestCount}</p>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-wide">best</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
