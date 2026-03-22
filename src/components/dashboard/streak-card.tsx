'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format, subDays } from 'date-fns'
import { cn } from '@/lib/utils'
import { Flame, Trophy, Zap, Activity } from 'lucide-react'

const streakLabels: Record<string, string> = {
  daily_activity: 'Daily Activity',
  prospecting: 'Prospecting',
  planner: 'Schedule',
  followup: 'Follow-ups',
}

const streakColors: Record<string, { flame: string; badge: string; bg: string }> = {
  daily_activity: { flame: 'text-orange-400', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20', bg: 'bg-orange-500/[0.04] border-orange-500/[0.1]' },
  prospecting:    { flame: 'text-blue-400',   badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',       bg: 'bg-blue-500/[0.04] border-blue-500/[0.1]' },
  planner:        { flame: 'text-purple-400', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', bg: 'bg-purple-500/[0.04] border-purple-500/[0.1]' },
}

function CalendarDots({ activities }: { activities: { createdAt: string }[] }) {
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const days = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const hasActivity = activities.some((a) => a.createdAt.startsWith(dateStr))
    const isToday = dateStr === todayStr
    return { dateStr, hasActivity, isToday, label: format(date, 'EEE')[0] }
  })

  return (
    <div>
      <p className="text-[10px] text-zinc-700 mb-1.5">Last 14 days</p>
      <div className="flex gap-1">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div
              className={cn(
                'w-full rounded-sm transition-all',
                d.hasActivity
                  ? d.isToday
                    ? 'bg-orange-400 h-3'
                    : 'bg-orange-500/50 h-3'
                  : 'bg-white/[0.06] h-3'
              )}
            />
            {i % 2 === 0 && (
              <span className={cn('text-[8px]', d.isToday ? 'text-orange-400' : 'text-zinc-800')}>
                {d.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StreakCard() {
  const streaks = useDemoStore((s) => s.streaks)
  const activities = useDemoStore((s) => s.activities)
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
          <Flame className="h-8 w-8 text-zinc-700 mb-3" />
          <p className="text-[13px] font-medium text-zinc-500">No streaks yet</p>
          <p className="text-[11px] text-zinc-700 mt-0.5">Log activities daily to build momentum</p>
        </div>
      </div>
    )
  }

  const mainStreak = streaks.find((s) => s.streakType === 'daily_activity') ?? streaks[0]
  const secondaryStreaks = streaks.filter((s) => s.id !== mainStreak.id)
  const isMainActive = mainStreak.lastCompletedDate === todayStr

  // Weekly consistency: how many of the last 7 days had activity
  const activeDaysLast7 = Array.from({ length: 7 }, (_, i) => {
    const dateStr = format(subDays(new Date(), i), 'yyyy-MM-dd')
    return activities.some((a) => a.createdAt.startsWith(dateStr))
  }).filter(Boolean).length

  const consistencyPct = Math.round((activeDaysLast7 / 7) * 100)

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10">
            <Flame className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Consistency</h3>
            <p className="text-[11px] text-zinc-600">Daily streak tracking</p>
          </div>
        </div>
        {isMainActive && (
          <div className="flex items-center gap-1 rounded-lg bg-orange-500/10 px-2 py-1 border border-orange-500/20">
            <Flame className="h-2.5 w-2.5 text-orange-400" />
            <span className="text-[10px] font-bold text-orange-400">On fire</span>
          </div>
        )}
      </div>

      {/* Main streak — hero display */}
      <div className={cn(
        'rounded-xl border p-4 mb-4',
        isMainActive ? 'bg-orange-500/[0.06] border-orange-500/20' : 'bg-white/[0.02] border-white/[0.04]'
      )}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-medium text-zinc-500">Daily Activity Streak</p>
          <div className="flex items-center gap-1 text-zinc-600">
            <Trophy className="h-3 w-3" />
            <span className="text-[10px]">Best: {mainStreak.bestCount}d</span>
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div className="flex items-center gap-2">
            <Flame className={cn('h-8 w-8', isMainActive ? 'text-orange-400' : 'text-zinc-700')} />
            <div>
              <span className={cn('text-4xl font-black leading-none', isMainActive ? 'text-white' : 'text-zinc-500')}>
                {mainStreak.currentCount}
              </span>
              <span className={cn('text-sm font-medium ml-1', isMainActive ? 'text-zinc-300' : 'text-zinc-600')}>
                day{mainStreak.currentCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-1">
              <Zap className="h-2.5 w-2.5 text-blue-400" />
              <span className="text-[10px] font-semibold text-zinc-400">{consistencyPct}% this week</span>
            </div>
            {!isMainActive && (
              <p className="text-[9px] text-red-400/70">⚠ Log activity to keep streak</p>
            )}
          </div>
        </div>

        {/* Progress toward best */}
        {mainStreak.bestCount > 1 && (
          <div className="mt-3">
            <div className="flex justify-between text-[9px] text-zinc-700 mb-1">
              <span>vs. best streak</span>
              <span>{mainStreak.currentCount}/{mainStreak.bestCount}</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
              <div
                className={cn('h-full rounded-full transition-all', isMainActive ? 'bg-orange-400/70' : 'bg-zinc-600/50')}
                style={{ width: `${Math.min((mainStreak.currentCount / mainStreak.bestCount) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 14-day calendar */}
      <div className="mb-4">
        <CalendarDots activities={activities} />
      </div>

      {/* Secondary streaks */}
      {secondaryStreaks.length > 0 && (
        <div className="space-y-1.5">
          {secondaryStreaks.map((streak) => {
            const isActive = streak.lastCompletedDate === todayStr
            const label = streakLabels[streak.streakType] || streak.streakType
            const colors = streakColors[streak.streakType] ?? streakColors.daily_activity

            return (
              <div
                key={streak.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 border transition-all',
                  isActive ? colors.bg : 'bg-transparent border-transparent'
                )}
              >
                <Flame className={cn('h-3.5 w-3.5 shrink-0', isActive ? colors.flame : 'text-zinc-700')} />
                <span className={cn('text-[11px] font-medium flex-1', isActive ? 'text-zinc-200' : 'text-zinc-500')}>
                  {label}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={cn('text-[13px] font-bold', isActive ? 'text-white' : 'text-zinc-500')}>
                    {streak.currentCount}
                  </span>
                  <span className="text-[9px] text-zinc-700">/ {streak.bestCount} best</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
