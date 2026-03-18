'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, Scroll, Zap } from 'lucide-react'

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-500/10 text-green-400',
  normal: 'bg-blue-500/10 text-blue-400',
  hard: 'bg-amber-500/10 text-amber-400',
  epic: 'bg-purple-500/10 text-purple-400',
}

const categoryColors: Record<string, string> = {
  Prospecting: 'bg-blue-500/10 text-blue-400',
  'Follow-up': 'bg-amber-500/10 text-amber-400',
  'Pipeline Progress': 'bg-purple-500/10 text-purple-400',
  'CRM Hygiene': 'bg-green-500/10 text-green-400',
  Knowledge: 'bg-cyan-500/10 text-cyan-400',
}

export default function DailyQuestsList() {
  const quests = useDemoStore((s) => s.quests)
  const completeQuest = useDemoStore((s) => s.completeQuest)

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const dailyQuests = quests.filter(
    (q) => q.period === 'daily' && q.dueDate === todayStr
  )

  if (dailyQuests.length === 0) {
    return (
      <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-5">
        <div className="flex items-center gap-2">
          <Scroll className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
            Daily Quests
          </h3>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center py-4 text-center">
          <Scroll className="h-8 w-8 text-zinc-600" />
          <p className="mt-2 text-sm text-zinc-500">No daily quests for today.</p>
          <p className="text-xs text-zinc-600">Check back tomorrow!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-5">
      <div className="flex items-center gap-2">
        <Scroll className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          Daily Quests
        </h3>
      </div>

      <div className="mt-3 space-y-1.5">
        {dailyQuests.map((quest) => {
          const isCompleted = quest.status === 'completed'
          return (
            <div
              key={quest.id}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                isCompleted ? 'bg-zinc-800/30' : 'bg-zinc-800/50 hover:bg-zinc-800/70'
              )}
            >
              <button
                onClick={() => !isCompleted && completeQuest(quest.id)}
                disabled={isCompleted}
                className="flex-shrink-0"
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                ) : (
                  <Circle className="h-5 w-5 text-zinc-500 hover:text-blue-400" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'text-sm font-medium',
                    isCompleted
                      ? 'text-zinc-500 line-through'
                      : 'text-white'
                  )}
                >
                  {quest.title}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs',
                      categoryColors[quest.category] || 'bg-zinc-700/50 text-zinc-400'
                    )}
                  >
                    {quest.category}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs',
                      difficultyColors[quest.difficulty]
                    )}
                  >
                    {quest.difficulty}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <Zap className="h-3 w-3 text-blue-400" />
                <span>{quest.xpReward}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
