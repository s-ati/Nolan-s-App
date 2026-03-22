'use client'

import { useDemoStore } from '@/stores/demo-data'
import { subDays, format } from 'date-fns'
import { Users, Briefcase, Phone, DollarSign, TrendingUp } from 'lucide-react'

export default function KpiCards() {
  const contacts = useDemoStore((s) => s.contacts)
  const deals = useDemoStore((s) => s.deals)
  const activities = useDemoStore((s) => s.activities)

  const activeLeads = contacts.filter((c) =>
    ['Prospect', 'Warm Lead', 'Active Buyer', 'Active Seller'].includes(c.status)
  ).length

  const activeDeals = deals.filter(
    (d) => d.stage !== 'Closed' && d.stage !== 'Dead'
  ).length

  const weekAgo = subDays(new Date(), 7).toISOString()
  const callsThisWeek = activities.filter(
    (a) => a.type === 'Call' && a.createdAt >= weekAgo
  ).length

  const pipelineValue = deals
    .filter((d) => d.stage !== 'Closed' && d.stage !== 'Dead')
    .reduce((sum, d) => sum + d.estimatedCommission, 0)

  // Prev week for trend comparison
  const twoWeeksAgo = subDays(new Date(), 14).toISOString()
  const callsPrevWeek = activities.filter(
    (a) => a.type === 'Call' && a.createdAt >= twoWeeksAgo && a.createdAt < weekAgo
  ).length
  const callTrend =
    callsPrevWeek === 0
      ? null
      : Math.round(((callsThisWeek - callsPrevWeek) / callsPrevWeek) * 100)

  const kpis = [
    {
      label: 'Active Leads',
      value: activeLeads,
      display: activeLeads.toString(),
      icon: Users,
      color: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      trend: null as number | null,
      sub: 'in your pipeline',
    },
    {
      label: 'Active Deals',
      value: activeDeals,
      display: activeDeals.toString(),
      icon: Briefcase,
      color: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      trend: null as number | null,
      sub: 'open transactions',
    },
    {
      label: 'Calls This Week',
      value: callsThisWeek,
      display: callsThisWeek.toString(),
      icon: Phone,
      color: 'text-amber-400',
      iconBg: 'bg-amber-500/10',
      trend: callTrend,
      sub: 'outbound contacts',
    },
    {
      label: 'Commission Pipeline',
      value: pipelineValue,
      display: pipelineValue >= 1000 ? `$${(pipelineValue / 1000).toFixed(0)}k` : `$${pipelineValue}`,
      icon: DollarSign,
      color: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
      trend: null as number | null,
      sub: 'estimated earnings',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <div
            key={kpi.label}
            className="rounded-xl border border-white/[0.05] bg-[#12141a] p-5 transition-colors hover:border-white/[0.08]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {kpi.label}
              </span>
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${kpi.iconBg}`}>
                <Icon className={`h-3.5 w-3.5 ${kpi.color}`} />
              </div>
            </div>

            <p className={`mt-3 text-2xl font-bold tracking-tight ${kpi.color}`}>
              {kpi.display}
            </p>

            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[11px] text-zinc-600">{kpi.sub}</span>
              {kpi.trend !== null && (
                <div
                  className={`flex items-center gap-0.5 text-[10px] font-semibold ${
                    kpi.trend >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  <TrendingUp className={`h-2.5 w-2.5 ${kpi.trend < 0 ? 'rotate-180' : ''}`} />
                  {kpi.trend > 0 ? '+' : ''}
                  {kpi.trend}%
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
