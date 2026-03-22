'use client'

import { useDemoStore } from '@/stores/demo-data'
import { cn } from '@/lib/utils'
import { Briefcase, ArrowRight, DollarSign } from 'lucide-react'
import Link from 'next/link'

const stageConfig: Record<string, { label: string; cls: string; dot: string }> = {
  Lead: {
    label: 'Lead',
    cls: 'bg-zinc-700/40 text-zinc-400',
    dot: 'bg-zinc-600',
  },
  'Active Client': {
    label: 'Active Client',
    cls: 'bg-blue-500/10 text-blue-400',
    dot: 'bg-blue-400',
  },
  'Offer Stage': {
    label: 'Offer Stage',
    cls: 'bg-amber-500/10 text-amber-400',
    dot: 'bg-amber-400',
  },
  'Under Contract': {
    label: 'Under Contract',
    cls: 'bg-purple-500/10 text-purple-400',
    dot: 'bg-purple-400',
  },
  Closed: {
    label: 'Closed',
    cls: 'bg-emerald-500/10 text-emerald-400',
    dot: 'bg-emerald-400',
  },
  Dead: {
    label: 'Dead',
    cls: 'bg-red-500/10 text-red-400',
    dot: 'bg-red-500',
  },
}

const priorityDot: Record<string, string> = {
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

  // Stage distribution for mini funnel
  const stageOrder = ['Lead', 'Active Client', 'Offer Stage', 'Under Contract']
  const stageCounts = stageOrder.map((stage) => ({
    stage,
    count: activeDeals.filter((d) => d.stage === stage).length,
  }))
  const maxCount = Math.max(...stageCounts.map((s) => s.count), 1)

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10">
            <Briefcase className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Pipeline Overview</h3>
            <p className="text-[11px] text-zinc-600">{activeDeals.length} active transactions</p>
          </div>
        </div>
        <Link
          href="/pipeline"
          className="flex items-center gap-1 text-[11px] font-medium text-zinc-600 hover:text-blue-400 transition-colors"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {activeDeals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] mb-3">
            <Briefcase className="h-6 w-6 text-zinc-700" />
          </div>
          <p className="text-[13px] font-medium text-zinc-500">No active deals yet</p>
          <p className="text-[11px] text-zinc-700 mt-0.5">Add your first deal to get started</p>
        </div>
      ) : (
        <>
          {/* Commission total */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/[0.1] bg-emerald-500/[0.04] px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10">
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Total Commission Pipeline</p>
              <p className="text-[18px] font-bold text-emerald-400 leading-tight">
                ${totalPipeline.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Stage funnel mini-viz */}
          {activeDeals.length > 1 && (
            <div className="mb-4 grid grid-cols-4 gap-1">
              {stageCounts.map(({ stage, count }) => {
                const cfg = stageConfig[stage]
                return (
                  <div key={stage} className="flex flex-col items-center gap-1">
                    <div className="w-full rounded-sm bg-white/[0.04] overflow-hidden" style={{ height: 24 }}>
                      <div
                        className={cn('h-full rounded-sm transition-all', cfg?.dot ? `bg-current` : 'bg-zinc-600')}
                        style={{
                          width: `${(count / maxCount) * 100}%`,
                          backgroundColor:
                            stage === 'Lead' ? 'rgba(113,113,122,0.4)' :
                            stage === 'Active Client' ? 'rgba(59,130,246,0.35)' :
                            stage === 'Offer Stage' ? 'rgba(245,158,11,0.35)' :
                            'rgba(139,92,246,0.35)',
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-zinc-600 leading-none text-center">{count}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Deal list */}
          <div className="space-y-1.5">
            {displayed.map((deal) => {
              const stage = stageConfig[deal.stage]
              return (
                <div
                  key={deal.id}
                  className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-3 py-2.5 transition-all hover:bg-white/[0.04]"
                >
                  <div
                    className={cn('h-2 w-2 rounded-full shrink-0', priorityDot[deal.priority])}
                    title={`${deal.priority} priority`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-zinc-200 leading-tight">
                      {deal.title}
                    </p>
                    {stage && (
                      <span className={cn('mt-0.5 inline-block rounded-md px-1.5 py-0.5 text-[9px] font-semibold', stage.cls)}>
                        {stage.label}
                      </span>
                    )}
                  </div>

                  <span className="text-[12px] font-semibold text-zinc-400 shrink-0 tabular-nums">
                    ${deal.estimatedCommission.toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
