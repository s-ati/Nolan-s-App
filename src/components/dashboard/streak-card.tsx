'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Flame, Trophy, Activity } from 'lucide-react'

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
      <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10">
            <Activity className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Consistency</h3>
            <p className="text-[11px] text-zinc-600">Daily habit tracking</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] mb-3">
            <Flame className="h-6 w-6 text-zinc-700" />
          </div>
          <p className="text-[13px] font-medium text-zinc-500">No streaks yet</p>
          <p className="text-[11px] text-zinc-700 mt-0.5">Log activities daily to build momentum</p>
        </div>
      </div>
    )
  }

  const totalActive = streaks.filter((s) => s.lastCompletedDate === todayStr).length

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10">
            <Activity className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Consistency</h3>
            <p className="text-[11px] text-zinc-600">Daily habit tracking</p>
          </div>
        </div>
        {totalActive > 0 && (
          <div className="flex items-center gap-1 rounded-lg bg-orange-500/10 px-2 py-1">
            <Flame className="h-2.5 w-2.5 text-orange-400" />
            <span className="text-[10px] font-bold text-orange-400">{totalActive} active</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {streaks.map((streak) => {
          const isActive = streak.lastCompletedDate === todayStr
          const label = streakLabels[streak.streakType] || streak.streakType
          const pctOfBest = streak.bestCount > 0
            ? Math.min((streak.currentCount / streak.bestCount) * 100, 100)
            : 0

          return (
            <div
              key={streak.id}
              className={cn(
                'rounded-xl px-3 py-3 transition-all',
                isActive
                  ? 'bg-orange-500/[0.05] border border-orange-500/[0.1]'
                  : 'bg-white/[0.02] border border-transparent'
              )}
            >
              <div className="flex items-center gap-3">
                <Flame
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isActive ? 'text-orange-400' : 'text-zinc-700'
                  )}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className={cn('text-[12px] font-medium', isActive ? 'text-zinc-200' : 'text-zinc-400')}>
                      {label}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <span className={cn('text-[13px] font-bold', isActive ? 'text-white' : 'text-zinc-500')}>
                          {streak.currentCount}
                        </span>
                        <span className="text-[9px] text-zinc-700 ml-0.5">day{streak.currentCount !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-zinc-600">
                        <Trophy className="h-2.5 w-2.5" />
                        <span className="text-[10px] font-medium">{streak.bestCount}</span>
                      </div>
                    </div>
                  </div>
                  {streak.bestCount > 0 && (
                    <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          isActive ? 'bg-orange-400/60' : 'bg-zinc-600/40'
                        )}
                        style={{ width: `${pctOfBest}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
