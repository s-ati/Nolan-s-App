'use client'

import { useDemoStore } from '@/stores/demo-data'
import { subDays } from 'date-fns'
import { Users, Briefcase, Phone, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

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
      value: activeLeads.toString(),
      sub: 'In your pipeline',
      icon: Users,
      color: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      trend: null as number | null,
      borderAccent: 'hover:border-blue-500/20',
    },
    {
      label: 'Active Deals',
      value: activeDeals.toString(),
      sub: 'Open transactions',
      icon: Briefcase,
      color: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      trend: null as number | null,
      borderAccent: 'hover:border-emerald-500/20',
    },
    {
      label: 'Calls This Week',
      value: callsThisWeek.toString(),
      sub: 'Outbound contacts',
      icon: Phone,
      color: 'text-amber-400',
      iconBg: 'bg-amber-500/10',
      trend: callTrend,
      borderAccent: 'hover:border-amber-500/20',
    },
    {
      label: 'Commission Pipeline',
      value:
        pipelineValue >= 1000
          ? `$${(pipelineValue / 1000).toFixed(0)}k`
          : `$${pipelineValue}`,
      sub: 'Estimated earnings',
      icon: DollarSign,
      color: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
      trend: null as number | null,
      borderAccent: 'hover:border-purple-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        const isPositive = kpi.trend !== null && kpi.trend >= 0
        const TrendIcon = isPositive ? TrendingUp : TrendingDown
        return (
          <div
            key={kpi.label}
            className={`rounded-2xl border border-white/[0.05] bg-[#0e1118] p-5 transition-all duration-200 ${kpi.borderAccent} hover:bg-[#101420]`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${kpi.iconBg}`}>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              {kpi.trend !== null && (
                <div
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold ${
                    isPositive
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  <TrendIcon className="h-2.5 w-2.5" />
                  {kpi.trend > 0 ? '+' : ''}
                  {kpi.trend}%
                </div>
              )}
            </div>

            <p className={`text-[26px] font-bold tracking-tight leading-none ${kpi.color}`}>
              {kpi.value}
            </p>

            <div className="mt-2 space-y-0.5">
              <p className="text-[12px] font-medium text-zinc-300">{kpi.label}</p>
              <p className="text-[11px] text-zinc-600">{kpi.sub}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
