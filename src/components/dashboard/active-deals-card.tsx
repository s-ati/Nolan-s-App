'use client'

import { useDemoStore } from '@/stores/demo-data'
import { cn } from '@/lib/utils'
import { Briefcase, ArrowRight, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const stageColors: Record<string, string> = {
  Lead: 'bg-zinc-700/40 text-zinc-400',
  'Active Client': 'bg-blue-500/10 text-blue-400',
  'Offer Stage': 'bg-amber-500/10 text-amber-400',
  'Under Contract': 'bg-purple-500/10 text-purple-400',
  Closed: 'bg-emerald-500/10 text-emerald-400',
  Dead: 'bg-red-500/10 text-red-400',
}

const priorityDots: Record<string, string> = {
  low: 'bg-zinc-600',
  medium: 'bg-blue-400',
  high: 'bg-amber-400',
  urgent: 'bg-red-400',
}

export default function ActiveDealsCard() {
  const deals = useDemoStore((s) => s.deals)

  const activeDeals = deals.filter(
    (d) => d.stage !== 'Closed' && d.stage !== 'Dead'
  )

  const totalPipeline = activeDeals.reduce(
    (sum, d) => sum + d.estimatedCommission,
    0
  )

  const displayed = activeDeals.slice(0, 5)

  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#12141a] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
            <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">Pipeline Overview</h3>
        </div>
        <Link
          href="/pipeline"
          className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-blue-400 transition-colors"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {activeDeals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Briefcase className="h-8 w-8 text-zinc-700" />
          <p className="mt-2.5 text-sm text-zinc-500">No active deals yet.</p>
          <p className="text-xs text-zinc-600">Add your first deal to get started</p>
        </div>
      ) : (
        <>
          {/* Pipeline total */}
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-500/[0.12] bg-emerald-500/[0.06] px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Total Commission Pipeline</p>
              <p className="text-lg font-bold text-emerald-400">
                ${totalPipeline.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="ml-auto h-4 w-4 text-emerald-400/40" />
          </div>

          <div className="space-y-1.5">
            {displayed.map((deal) => (
              <div
                key={deal.id}
                className="flex items-center gap-3 rounded-lg bg-zinc-800/30 px-3 py-2.5 transition-colors hover:bg-zinc-800/50"
              >
                <div
                  className={cn('h-2 w-2 rounded-full shrink-0', priorityDots[deal.priority])}
                  title={`${deal.priority} priority`}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-200">
                    {deal.title}
                  </p>
                  <div className="mt-0.5">
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                        stageColors[deal.stage] || 'bg-zinc-700/40 text-zinc-400'
                      )}
                    >
                      {deal.stage}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-zinc-400 shrink-0">
                  ${deal.estimatedCommission.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
