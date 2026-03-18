'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format } from 'date-fns'
import { Trophy, Zap } from 'lucide-react'

export default function TodayScoreCard() {
  const quests = useDemoStore((s) => s.quests)
  const activities = useDemoStore((s) => s.activities)

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const dailyQuests = quests.filter(
    (q) => q.period === 'daily' && q.dueDate === todayStr
  )
  const completedDaily = dailyQuests.filter((q) => q.status === 'completed')

  const todayXp = activities
    .filter((a) => a.createdAt.startsWith(todayStr))
    .reduce((sum, a) => sum + a.xpAwarded, 0)

  const total = dailyQuests.length
  const done = completedDaily.length
  const percent = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-5">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          Today&apos;s Score
        </h3>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-white">
            {done}
            <span className="text-lg text-zinc-500">/{total}</span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">quests completed</p>
        </div>

        {/* Circular progress */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-zinc-800"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${(percent / 100) * 175.93} 175.93`}
              strokeLinecap="round"
              className="text-blue-400"
            />
          </svg>
          <span className="absolute text-sm font-semibold text-white">
            {percent}%
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-1.5">
        <Zap className="h-3.5 w-3.5 text-blue-400" />
        <span className="text-xs font-medium text-blue-400">
          {todayXp} XP earned today
        </span>
      </div>
    </div>
  )
}
