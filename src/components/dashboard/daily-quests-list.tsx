'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, Target, Zap } from 'lucide-react'

const difficultyColors: Record<string, string> = {
  easy: 'bg-emerald-500/10 text-emerald-400',
  normal: 'bg-blue-500/10 text-blue-400',
  hard: 'bg-amber-500/10 text-amber-400',
  epic: 'bg-purple-500/10 text-purple-400',
}

const categoryColors: Record<string, string> = {
  Prospecting: 'bg-blue-500/10 text-blue-400',
  'Follow-up': 'bg-amber-500/10 text-amber-400',
  'Pipeline Progress': 'bg-purple-500/10 text-purple-400',
  'CRM Hygiene': 'bg-emerald-500/10 text-emerald-400',
  Knowledge: 'bg-cyan-500/10 text-cyan-400',
}

export default function DailyQuestsList() {
  const quests = useDemoStore((s) => s.quests)
  const completeQuest = useDemoStore((s) => s.completeQuest)

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const dailyQuests = quests.filter(
    (q) => q.period === 'daily' && q.dueDate === todayStr
  )

  const completedCount = dailyQuests.filter((q) => q.status === 'completed').length
  const totalCount = dailyQuests.length

  if (dailyQuests.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.05] bg-[#12141a] p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10">
            <Target className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">Today&apos;s Goals</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Target className="h-8 w-8 text-zinc-700" />
          <p className="mt-2.5 text-sm text-zinc-500">No goals set for today.</p>
          <p className="text-xs text-zinc-600">Check back tomorrow!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#12141a] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10">
            <Target className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">Today&apos;s Goals</h3>
        </div>
        <span className="text-xs font-medium text-zinc-500">
          <span className="text-zinc-300">{completedCount}</span>/{totalCount} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
          style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
        />
      </div>

      <div className="space-y-1.5">
        {dailyQuests.map((quest) => {
          const isCompleted = quest.status === 'completed'
          return (
            <div
              key={quest.id}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all',
                isCompleted
                  ? 'bg-zinc-800/20 opacity-60'
                  : 'bg-zinc-800/40 hover:bg-zinc-800/60'
              )}
            >
              <button
                onClick={() => !isCompleted && completeQuest(quest.id)}
                disabled={isCompleted}
                className="flex-shrink-0"
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-[18px] w-[18px] text-emerald-400" />
                ) : (
                  <Circle className="h-[18px] w-[18px] text-zinc-600 hover:text-purple-400 transition-colors" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'text-sm font-medium',
                    isCompleted ? 'text-zinc-600 line-through' : 'text-zinc-200'
                  )}
                >
                  {quest.title}
                </p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                      categoryColors[quest.category] || 'bg-zinc-700/50 text-zinc-400'
                    )}
                  >
                    {quest.category}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                      difficultyColors[quest.difficulty]
                    )}
                  >
                    {quest.difficulty}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-0.5 text-[11px] text-zinc-500 shrink-0">
                <Zap className="h-2.5 w-2.5 text-blue-400" />
                <span className="text-blue-400/70">{quest.xpReward}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
