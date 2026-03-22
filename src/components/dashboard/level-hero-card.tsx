'use client'

import { useDemoStore } from '@/stores/demo-data'
import { useAppStore } from '@/stores/app-store'
import { calculateXpProgress } from '@/lib/game/xp-engine'
import { motion } from 'framer-motion'
import {
  Zap,
  Users,
  Briefcase,
  DollarSign,
  Target,
  Plus,
  Phone,
  TrendingUp,
} from 'lucide-react'
import { format, subDays } from 'date-fns'

export default function LevelHeroCard() {
  const profile = useDemoStore((s) => s.profile)
  const contacts = useDemoStore((s) => s.contacts)
  const deals = useDemoStore((s) => s.deals)
  const activities = useDemoStore((s) => s.activities)
  const quests = useDemoStore((s) => s.quests)
  const openQuickAction = useAppStore((s) => s.openQuickAction)

  const { level, progressPercent, xpToNextLevel, currentLevelXp, nextLevelXp } =
    calculateXpProgress(profile.totalXp)

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const activeLeads = contacts.filter((c) =>
    ['Prospect', 'Warm Lead', 'Active Buyer', 'Active Seller'].includes(c.status)
  ).length

  const activeDeals = deals.filter(
    (d) => d.stage !== 'Closed' && d.stage !== 'Dead'
  ).length

  const pipelineValue = deals
    .filter((d) => d.stage !== 'Closed' && d.stage !== 'Dead')
    .reduce((sum, d) => sum + d.estimatedCommission, 0)

  const dailyQuests = quests.filter(
    (q) => q.period === 'daily' && q.dueDate === todayStr
  )
  const completedToday = dailyQuests.filter((q) => q.status === 'completed').length
  const totalToday = dailyQuests.length
  const todayPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0

  const todayXp = activities
    .filter((a) => a.createdAt.startsWith(todayStr))
    .reduce((sum, a) => sum + a.xpAwarded, 0)

  // Weekly activity data for sparkline
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const xp = activities
      .filter((a) => a.createdAt.startsWith(dateStr))
      .reduce((sum, a) => sum + a.xpAwarded, 0)
    return { day: format(date, 'EEE'), xp }
  })

  const maxXp = Math.max(...weekData.map((d) => d.xp), 1)

  const kpis = [
    {
      label: 'Active Leads',
      value: activeLeads.toString(),
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Active Deals',
      value: activeDeals.toString(),
      icon: Briefcase,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Commission Pipeline',
      value: pipelineValue >= 1000 ? `$${(pipelineValue / 1000).toFixed(0)}k` : `$${pipelineValue}`,
      icon: DollarSign,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: "Today's Goals",
      value: `${completedToday}/${totalToday}`,
      icon: Target,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#13151f] via-[#12141a] to-[#0d0f16] p-6 shadow-2xl">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.07),transparent_55%)]" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-600/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-emerald-600/[0.03] blur-3xl" />

      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ── Left Column: Agent Identity ── */}
        <div className="flex flex-col justify-between gap-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
              Command Center
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Track pipeline, activity, and performance
            </p>
          </div>

          {/* Agent level + XP */}
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/20 to-blue-600/5">
              <span className="text-2xl font-extrabold text-white">{level}</span>
              <span className="absolute -bottom-1.5 -right-1.5 flex items-center gap-0.5 rounded-full border border-blue-500/30 bg-[#12141a] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-400">
                LVL
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {profile.displayName}
              </p>
              <p className="text-xs text-blue-400">{profile.rankTitle}</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] text-zinc-600 mb-1">
                  <span className="flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5 text-blue-400" />
                    {profile.totalXp.toLocaleString()} XP
                  </span>
                  <span>{xpToNextLevel} to next</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800/80">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Middle Column: KPI Stats ── */}
        <div className="grid grid-cols-2 gap-3">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <div
                key={kpi.label}
                className="flex flex-col rounded-xl border border-white/[0.05] bg-white/[0.025] p-4 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-medium text-zinc-500">{kpi.label}</span>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-md ${kpi.bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${kpi.color}`} />
                  </div>
                </div>
                <p className={`mt-3 text-2xl font-bold tracking-tight ${kpi.color}`}>
                  {kpi.value}
                </p>
              </div>
            )
          })}
        </div>

        {/* ── Right Column: Performance + CTAs ── */}
        <div className="flex flex-col justify-between gap-5">
          {/* Today's performance */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Today&apos;s Performance
              </p>
              <TrendingUp className="h-3.5 w-3.5 text-zinc-600" />
            </div>
            <div className="flex items-center gap-4">
              {/* Progress ring */}
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40" cy="40" r="34"
                    fill="none" stroke="currentColor"
                    strokeWidth="5"
                    className="text-zinc-800"
                  />
                  <circle
                    cx="40" cy="40" r="34"
                    fill="none" stroke="currentColor"
                    strokeWidth="5"
                    strokeDasharray={`${(todayPercent / 100) * 213.63} 213.63`}
                    strokeLinecap="round"
                    className="text-emerald-400 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-lg font-bold text-white">{todayPercent}%</span>
                </div>
              </div>
              {/* Stats beside ring */}
              <div className="space-y-1.5">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {completedToday}/{totalToday}
                  </p>
                  <p className="text-xs text-zinc-500">goals completed</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1">
                  <Zap className="h-3 w-3 text-blue-400" />
                  <span className="text-xs font-medium text-blue-400">
                    {todayXp} XP
                  </span>
                </div>
              </div>
            </div>

            {/* Mini weekly sparkline */}
            <div className="mt-4">
              <p className="mb-2 text-[10px] text-zinc-600">7-day activity</p>
              <div className="flex items-end gap-1 h-8">
                {weekData.map((d, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                    <div
                      className="w-full rounded-sm bg-blue-500/30 transition-all"
                      style={{ height: `${Math.max((d.xp / maxXp) * 32, d.xp > 0 ? 4 : 2)}px` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1 flex justify-between">
                {weekData.map((d, i) => (
                  <span key={i} className="flex-1 text-center text-[9px] text-zinc-600">
                    {d.day[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => openQuickAction('log-call')}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 hover:shadow-blue-500/30 active:scale-95"
            >
              <Phone className="h-4 w-4" />
              Log Activity
            </button>
            <button
              onClick={() => openQuickAction('add-contact')}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-200 transition-all hover:bg-white/[0.08] active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Add Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
