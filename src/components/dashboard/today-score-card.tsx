'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format } from 'date-fns'
import { Trophy, Zap, CheckCircle2 } from 'lucide-react'

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
    <div className="rounded-xl border border-white/[0.05] bg-[#12141a] p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
          <Trophy className="h-3.5 w-3.5 text-amber-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">Today&apos;s Score</h3>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold text-white">
            {done}
            <span className="text-xl font-normal text-zinc-600">/{total}</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">goals completed</p>

          <div className="mt-3 flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 w-fit">
            <Zap className="h-3 w-3 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400">
              {todayXp} XP earned
            </span>
          </div>
        </div>

        {/* Circular progress */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32" cy="32" r="27"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-zinc-800"
            />
            <circle
              cx="32" cy="32" r="27"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${(percent / 100) * 169.65} 169.65`}
              strokeLinecap="round"
              className="text-amber-400 transition-all duration-1000"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-base font-bold text-white">{percent}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
