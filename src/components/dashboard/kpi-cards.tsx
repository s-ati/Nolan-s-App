'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format, subDays } from 'date-fns'
import { Users, Briefcase, Phone, DollarSign } from 'lucide-react'

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

  // Calls in the last 7 days
  const weekAgo = subDays(new Date(), 7).toISOString()
  const callsThisWeek = activities.filter(
    (a) => a.type === 'Call' && a.createdAt >= weekAgo
  ).length

  const pipelineValue = deals
    .filter((d) => d.stage !== 'Closed' && d.stage !== 'Dead')
    .reduce((sum, d) => sum + d.estimatedCommission, 0)

  const kpis = [
    {
      label: 'Active Leads',
      value: activeLeads,
      icon: Users,
      format: (v: number) => v.toString(),
    },
    {
      label: 'Active Deals',
      value: activeDeals,
      icon: Briefcase,
      format: (v: number) => v.toString(),
    },
    {
      label: 'Calls This Week',
      value: callsThisWeek,
      icon: Phone,
      format: (v: number) => v.toString(),
    },
    {
      label: 'Pipeline Value',
      value: pipelineValue,
      icon: DollarSign,
      format: (v: number) => `$${v.toLocaleString()}`,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <div
            key={kpi.label}
            className="rounded-xl border border-[#1e2030] bg-[#12141a] p-4"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <Icon className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-xs text-zinc-500">{kpi.label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              {kpi.format(kpi.value)}
            </p>
          </div>
        )
      })}
    </div>
  )
}
