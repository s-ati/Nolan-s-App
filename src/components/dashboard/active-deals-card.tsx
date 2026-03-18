'use client'

import { useDemoStore } from '@/stores/demo-data'
import { cn } from '@/lib/utils'
import { Briefcase, ArrowRight, DollarSign } from 'lucide-react'
import Link from 'next/link'

const stageColors: Record<string, string> = {
  Lead: 'bg-zinc-700/50 text-zinc-400',
  'Active Client': 'bg-blue-500/10 text-blue-400',
  'Offer Stage': 'bg-amber-500/10 text-amber-400',
  'Under Contract': 'bg-purple-500/10 text-purple-400',
  Closed: 'bg-green-500/10 text-green-400',
  Dead: 'bg-red-500/10 text-red-400',
}

const priorityDots: Record<string, string> = {
  low: 'bg-zinc-500',
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
    <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-5">
      <div className="flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          Active Deals
        </h3>
      </div>

      {activeDeals.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center py-4 text-center">
          <Briefcase className="h-8 w-8 text-zinc-600" />
          <p className="mt-2 text-sm text-zinc-500">No active deals yet.</p>
          <p className="text-xs text-zinc-600">Start building your pipeline!</p>
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-2">
            <DollarSign className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">
              Pipeline: ${totalPipeline.toLocaleString()}
            </span>
          </div>

          <div className="mt-3 space-y-1.5">
            {displayed.map((deal) => (
              <div
                key={deal.id}
                className="flex items-center gap-3 rounded-lg bg-zinc-800/50 px-3 py-2.5"
              >
                <div
                  className={cn('h-2 w-2 rounded-full', priorityDots[deal.priority])}
                  title={`${deal.priority} priority`}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {deal.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs',
                        stageColors[deal.stage] || 'bg-zinc-700/50 text-zinc-400'
                      )}
                    >
                      {deal.stage}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-medium text-zinc-400">
                  ${deal.estimatedCommission.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {activeDeals.length > 5 && (
            <Link
              href="/pipeline"
              className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </>
      )}
    </div>
  )
}
