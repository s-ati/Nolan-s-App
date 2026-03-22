'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CalendarDays, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

const statusConfig: Record<string, { label: string; cls: string }> = {
  planned: { label: 'Planned', cls: 'bg-blue-500/10 text-blue-400' },
  in_progress: { label: 'In Progress', cls: 'bg-amber-500/10 text-amber-400' },
  completed: { label: 'Done', cls: 'bg-emerald-500/10 text-emerald-400' },
  skipped: { label: 'Skipped', cls: 'bg-zinc-700/40 text-zinc-500' },
}

const categoryColors: Record<string, string> = {
  Prospecting: 'text-blue-400',
  'Follow-ups': 'text-amber-400',
  Showings: 'text-cyan-400',
  'Pipeline Review': 'text-purple-400',
  Learning: 'text-emerald-400',
  Admin: 'text-zinc-500',
}

export default function PlannerPreviewCard() {
  const dailyPlans = useDemoStore((s) => s.dailyPlans)
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const todayPlan = dailyPlans.find((p) => p.planDate === todayStr)
  const blocks = todayPlan?.blocks.slice(0, 5) || []

  const completedBlocks = blocks.filter((b) => b.status === 'completed').length

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10">
            <CalendarDays className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Today&apos;s Schedule</h3>
            <p className="text-[11px] text-zinc-600">
              {blocks.length > 0
                ? `${completedBlocks}/${blocks.length} time blocks`
                : 'No blocks planned'}
            </p>
          </div>
        </div>
        <Link
          href="/planner"
          className="flex items-center gap-1 text-[11px] font-medium text-zinc-600 hover:text-blue-400 transition-colors"
        >
          Open Planner <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] mb-3">
            <CalendarDays className="h-6 w-6 text-zinc-700" />
          </div>
          <p className="text-[13px] font-medium text-zinc-500">No schedule for today</p>
          <Link
            href="/planner"
            className="mt-2 text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Create a daily plan →
          </Link>
        </div>
      ) : (
        <div className="space-y-1.5">
          {blocks.map((block) => {
            const status = statusConfig[block.status]
            return (
              <div
                key={block.id}
                className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-3 py-3 hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-1.5 shrink-0 w-[90px]">
                  <Clock className="h-3 w-3 text-zinc-600" />
                  <span className="text-[11px] text-zinc-600 tabular-nums">
                    {block.startTime}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-zinc-200 leading-tight">
                    {block.title}
                  </p>
                  <span
                    className={cn(
                      'text-[10px] font-medium',
                      categoryColors[block.category] || 'text-zinc-500'
                    )}
                  >
                    {block.category}
                  </span>
                </div>

                {status && (
                  <span className={cn('rounded-lg px-2 py-0.5 text-[10px] font-semibold shrink-0', status.cls)}>
                    {status.label}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
