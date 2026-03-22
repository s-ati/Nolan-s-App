'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, Target, Zap, Phone, Users, Briefcase, UserPlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { DAILY_ALL_BONUS_XP } from '@/lib/game/xp-engine'

const ICON_MAP: Record<string, LucideIcon> = {
  phone: Phone,
  'check-circle-2': CheckCircle2,
  'user-plus': UserPlus,
  users: Users,
  briefcase: Briefcase,
  zap: Zap,
  target: Target,
}

const CATEGORY_COLORS: Record<string, string> = {
  Prospecting: 'text-blue-400',
  'Follow-up': 'text-amber-400',
  'Pipeline Progress': 'text-purple-400',
  Discipline: 'text-emerald-400',
  'CRM Hygiene': 'text-cyan-400',
}

export default function DailyQuestsList() {
  const dailyTasks    = useDemoStore((s) => s.dailyTasks)
  const completeDailyTask = useDemoStore((s) => s.completeDailyTask)

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const todayTasks = dailyTasks.filter((t) => t.date === todayStr)

  const completedCount = todayTasks.filter((t) => t.completed).length
  const totalCount = todayTasks.length
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const allDone = totalCount > 0 && completedCount === totalCount

  const CardHeader = () => (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10">
          <Target className="h-4 w-4 text-purple-400" />
        </div>
        <div>
          <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Daily Tasks</h3>
          {totalCount > 0 && (
            <p className="text-[11px] text-zinc-600">{completedCount} of {totalCount} complete</p>
          )}
        </div>
      </div>
      {totalCount > 0 && (
        <span className={cn('text-[11px] font-bold tabular-nums', allDone ? 'text-emerald-400' : 'text-zinc-500')}>
          {Math.round(progressPct)}%
        </span>
      )}
    </div>
  )

  if (todayTasks.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
        <CardHeader />
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] mb-3">
            <Target className="h-6 w-6 text-zinc-700" />
          </div>
          <p className="text-[13px] font-medium text-zinc-500">No tasks for today</p>
          <p className="text-[11px] text-zinc-700 mt-0.5">Refresh the page to generate daily tasks</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      <CardHeader />

      {/* Overall progress bar */}
      <div className="mb-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className={cn('h-full rounded-full transition-all duration-500', allDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-600 to-purple-400')}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* All-done bonus hint */}
      {!allDone && (
        <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-yellow-500/[0.06] border border-yellow-500/10 px-3 py-2">
          <Zap className="h-3 w-3 text-yellow-500/70 shrink-0" />
          <p className="text-[10px] text-yellow-500/70">
            Complete all tasks → <span className="font-bold">+{DAILY_ALL_BONUS_XP} bonus XP</span>
          </p>
        </div>
      )}

      {allDone && (
        <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20 px-3 py-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <p className="text-[11px] font-semibold text-emerald-400">All tasks done — +{DAILY_ALL_BONUS_XP} XP earned!</p>
        </div>
      )}

      <div className="space-y-2">
        {todayTasks.map((task) => {
          const isCompleted = task.completed
          const taskPct = task.targetCount > 1
            ? Math.min((task.currentCount / task.targetCount) * 100, 100)
            : isCompleted ? 100 : 0
          const Icon = ICON_MAP[task.icon] ?? Target
          const catColor = CATEGORY_COLORS[task.category] ?? 'text-zinc-500'

          return (
            <div
              key={task.id}
              className={cn(
                'group rounded-xl px-3 py-3 transition-all',
                isCompleted ? 'opacity-60' : 'bg-white/[0.02] hover:bg-white/[0.04]'
              )}
            >
              <div className="flex items-start gap-3">
                {/* Complete button */}
                <button
                  onClick={() => !isCompleted && completeDailyTask(task.id)}
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
                  <div className="flex items-center gap-2 justify-between">
                    <p className={cn('text-[13px] font-medium leading-tight', isCompleted ? 'text-zinc-600 line-through' : 'text-zinc-200')}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Progress count for multi-step tasks */}
                      {task.targetCount > 1 && (
                        <span className={cn('text-[10px] font-semibold tabular-nums', isCompleted ? 'text-emerald-400' : 'text-zinc-500')}>
                          {task.currentCount}/{task.targetCount}
                        </span>
                      )}
                      <Zap className="h-2.5 w-2.5 text-blue-400/60" />
                      <span className="text-[10px] font-semibold text-blue-400/70">{task.xpReward}</span>
                    </div>
                  </div>

                  {/* Category */}
                  <p className={cn('text-[10px] font-medium mt-0.5', catColor)}>
                    {task.category}
                  </p>

                  {/* Per-task progress bar (only for count > 1 tasks) */}
                  {task.targetCount > 1 && !isCompleted && (
                    <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-purple-500/60 transition-all duration-300"
                        style={{ width: `${taskPct}%` }}
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
