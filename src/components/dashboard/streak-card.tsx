'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Flame, Trophy } from 'lucide-react'

const streakLabels: Record<string, string> = {
  daily_activity: 'Daily Activity',
  prospecting: 'Prospecting',
  planner: 'Planner',
  followup: 'Follow-ups',
}

export default function StreakCard() {
  const streaks = useDemoStore((s) => s.streaks)
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  if (streaks.length === 0) {
    return (
      <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-5">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
            Streaks
          </h3>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center py-4 text-center">
          <Flame className="h-8 w-8 text-zinc-600" />
          <p className="mt-2 text-sm text-zinc-500">No streaks started yet.</p>
          <p className="text-xs text-zinc-600">Log activities daily to build streaks!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-5">
      <div className="flex items-center gap-2">
        <Flame className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          Streaks
        </h3>
      </div>

      <div className="mt-3 space-y-2">
        {streaks.map((streak) => {
          const isActive = streak.lastCompletedDate === todayStr
          const label = streakLabels[streak.streakType] || streak.streakType

          return (
            <div
              key={streak.id}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5',
                isActive ? 'bg-orange-500/5 border border-orange-500/10' : 'bg-zinc-800/50'
              )}
            >
              <Flame
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive ? 'text-orange-400' : 'text-zinc-600'
                )}
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{label}</p>
                {isActive && (
                  <span className="text-xs text-orange-400/70">Active today</span>
                )}
              </div>

              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="text-lg font-bold text-white">{streak.currentCount}</p>
                  <p className="text-[10px] text-zinc-500">current</p>
                </div>
                <div className="flex items-center gap-0.5">
                  <Trophy className="h-3 w-3 text-zinc-500" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-400">{streak.bestCount}</p>
                    <p className="text-[10px] text-zinc-500">best</p>
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
