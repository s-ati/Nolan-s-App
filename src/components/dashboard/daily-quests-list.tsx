'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, Target, Zap } from 'lucide-react'

const difficultyConfig: Record<string, { label: string; cls: string }> = {
  easy: { label: 'Easy', cls: 'bg-emerald-500/10 text-emerald-400' },
  normal: { label: 'Normal', cls: 'bg-blue-500/10 text-blue-400' },
  hard: { label: 'Hard', cls: 'bg-amber-500/10 text-amber-400' },
  epic: { label: 'Epic', cls: 'bg-purple-500/10 text-purple-400' },
}

const categoryColors: Record<string, string> = {
  Prospecting: 'text-blue-400',
  'Follow-up': 'text-amber-400',
  'Pipeline Progress': 'text-purple-400',
  'CRM Hygiene': 'text-emerald-400',
  Knowledge: 'text-cyan-400',
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
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const CardHeader = () => (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10">
          <Target className="h-4 w-4 text-purple-400" />
        </div>
        <div>
          <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Today&apos;s Goals</h3>
          {totalCount > 0 && (
            <p className="text-[11px] text-zinc-600">{completedCount} of {totalCount} complete</p>
          )}
        </div>
      </div>
      {totalCount > 0 && (
        <span className={cn(
          'text-[11px] font-bold tabular-nums',
          progressPct === 100 ? 'text-emerald-400' : 'text-zinc-500'
        )}>
          {Math.round(progressPct)}%
        </span>
      )}
    </div>
  )

  if (dailyQuests.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
        <CardHeader />
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] mb-3">
            <Target className="h-6 w-6 text-zinc-700" />
          </div>
          <p className="text-[13px] font-medium text-zinc-500">No goals set for today</p>
          <p className="text-[11px] text-zinc-700 mt-0.5">Check back tomorrow</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      <CardHeader />

      {/* Progress bar */}
      <div className="mb-5 space-y-1.5">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        {dailyQuests.map((quest) => {
          const isCompleted = quest.status === 'completed'
          const diff = difficultyConfig[quest.difficulty]
          return (
            <div
              key={quest.id}
              className={cn(
                'group flex items-start gap-3 rounded-xl px-3 py-3 transition-all',
                isCompleted
                  ? 'opacity-50'
                  : 'bg-white/[0.02] hover:bg-white/[0.04]'
              )}
            >
              <button
                onClick={() => !isCompleted && completeQuest(quest.id)}
                disabled={isCompleted}
                className="mt-0.5 shrink-0 transition-transform hover:scale-110"
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Circle className="h-4 w-4 text-zinc-600 group-hover:text-purple-400 transition-colors" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'text-[13px] font-medium leading-tight',
                    isCompleted ? 'text-zinc-600 line-through' : 'text-zinc-200'
                  )}
                >
                  {quest.title}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className={cn('text-[10px] font-medium', categoryColors[quest.category] || 'text-zinc-500')}>
                    {quest.category}
                  </span>
                  <span className="text-zinc-700">·</span>
                  {diff && (
                    <span className={cn('rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide', diff.cls)}>
                      {diff.label}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
                <Zap className="h-2.5 w-2.5 text-blue-400/60" />
                <span className="text-[10px] font-semibold text-blue-400/70">{quest.xpReward}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
