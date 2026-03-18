'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  planned: 'bg-blue-500/10 text-blue-400',
  in_progress: 'bg-amber-500/10 text-amber-400',
  completed: 'bg-green-500/10 text-green-400',
  skipped: 'bg-zinc-700/50 text-zinc-400',
}

const statusLabels: Record<string, string> = {
  planned: 'Planned',
  in_progress: 'In Progress',
  completed: 'Done',
  skipped: 'Skipped',
}

const categoryColors: Record<string, string> = {
  Prospecting: 'text-blue-400',
  'Follow-ups': 'text-amber-400',
  Showings: 'text-cyan-400',
  'Pipeline Review': 'text-purple-400',
  Learning: 'text-green-400',
  Admin: 'text-zinc-400',
}

export default function PlannerPreviewCard() {
  const dailyPlans = useDemoStore((s) => s.dailyPlans)
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const todayPlan = dailyPlans.find((p) => p.planDate === todayStr)
  const blocks = todayPlan?.blocks.slice(0, 5) || []

  return (
    <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-5">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          Today&apos;s Plan
        </h3>
      </div>

      {blocks.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center py-4 text-center">
          <Calendar className="h-8 w-8 text-zinc-600" />
          <p className="mt-2 text-sm text-zinc-500">No plan set for today.</p>
          <Link
            href="/planner"
            className="mt-1 text-xs text-blue-400 hover:text-blue-300"
          >
            Create a plan
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-3 space-y-1.5">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="flex items-center gap-3 rounded-lg bg-zinc-800/50 px-3 py-2"
              >
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <Clock className="h-3 w-3" />
                  <span className="w-[80px]">
                    {block.startTime} - {block.endTime}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {block.title}
                  </p>
                  <span
                    className={cn(
                      'text-xs',
                      categoryColors[block.category] || 'text-zinc-400'
                    )}
                  >
                    {block.category}
                  </span>
                </div>

                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs',
                    statusColors[block.status]
                  )}
                >
                  {statusLabels[block.status]}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/planner"
            className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
          >
            View full planner <ArrowRight className="h-3 w-3" />
          </Link>
        </>
      )}
    </div>
  )
}
