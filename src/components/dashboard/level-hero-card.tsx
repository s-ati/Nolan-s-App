'use client'

import { useDemoStore } from '@/stores/demo-data'
import { useAppStore } from '@/stores/app-store'
import { calculateXpProgress } from '@/lib/game/xp-engine'
import { motion } from 'framer-motion'
import {
  Users,
  Briefcase,
  DollarSign,
  Target,
  Plus,
  Phone,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'
import { format, subDays } from 'date-fns'

export default function LevelHeroCard() {
  const profile = useDemoStore((s) => s.profile)
  const contacts = useDemoStore((s) => s.contacts)
  const deals = useDemoStore((s) => s.deals)
  const activities = useDemoStore((s) => s.activities)
  const quests = useDemoStore((s) => s.quests)
  const openQuickAction = useAppStore((s) => s.openQuickAction)

  const { level, progressPercent, xpToNextLevel } = calculateXpProgress(profile.totalXp)

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

  // 7-day activity sparkline
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const xp = activities
      .filter((a) => a.createdAt.startsWith(dateStr))
      .reduce((sum, a) => sum + a.xpAwarded, 0)
    return { day: format(date, 'EEE'), xp, isToday: dateStr === todayStr }
  })
  const maxXp = Math.max(...weekData.map((d) => d.xp), 1)

  const kpis = [
    {
      label: 'Active Leads',
      value: activeLeads.toString(),
      icon: Users,
      color: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      ring: 'ring-blue-500/20',
    },
    {
      label: 'Open Deals',
      value: activeDeals.toString(),
      icon: Briefcase,
      color: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      ring: 'ring-emerald-500/20',
    },
    {
      label: 'Commission Pipeline',
      value:
        pipelineValue >= 1000
          ? `$${(pipelineValue / 1000).toFixed(0)}k`
          : `$${pipelineValue}`,
      icon: DollarSign,
      color: 'text-amber-400',
      iconBg: 'bg-amber-500/10',
      ring: 'ring-amber-500/20',
    },
    {
      label: "Today's Goals",
      value: `${completedToday}/${totalToday}`,
      icon: Target,
      color: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
      ring: 'ring-purple-500/20',
    },
  ]

  const greetingHour = new Date().getHours()
  const greeting =
    greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.05] bg-[#0e1118] shadow-xl shadow-black/30">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-600/[0.06] blur-3xl" />
        <div className="absolute -bottom-10 left-1/3 h-48 w-64 rounded-full bg-indigo-600/[0.04] blur-3xl" />
        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-blue-950/20 to-transparent" />
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="relative grid grid-cols-1 gap-0 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.04]">

        {/* ── Column 1: Agent Identity ── */}
        <div className="flex flex-col justify-start gap-6 p-6">
          <div>
            <p className="text-[11px] font-medium text-zinc-600 tracking-wide">
              {greeting}, {profile.displayName?.split(' ')[0]}
            </p>
            <h2 className="mt-2 text-[22px] font-bold tracking-tight text-white leading-tight">
              Command Center
            </h2>
            <p className="mt-1 text-[13px] text-zinc-500">
              {format(new Date(), 'EEEE, MMMM d')} · Your pipeline at a glance
            </p>
          </div>

          {/* Agent level + XP */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/[0.1]"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-transparent">
                    <span className="text-xl font-extrabold text-white">{level}</span>
                  </div>
                )}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-blue-500/30 bg-[#0e1118] px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-blue-400">
                  Agent Lv {level}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-zinc-100 truncate">
                  {profile.rankTitle}
                </p>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  {profile.totalXp.toLocaleString()} XP · {xpToNextLevel.toLocaleString()} to next
                </p>
              </div>
            </div>

            {/* XP progress bar */}
            <div>
              <div className="flex items-center justify-between text-[10px] text-zinc-700 mb-1.5">
                <span>Career Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Column 2: KPI Stats ── */}
        <div className="p-6">
          <p className="section-label mb-4">Key Metrics</p>
          <div className="grid grid-cols-2 gap-3">
            {kpis.map((kpi) => {
              const Icon = kpi.icon
              return (
                <div
                  key={kpi.label}
                  className="flex flex-col rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all hover:bg-white/[0.035] hover:border-white/[0.07]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${kpi.iconBg}`}>
                      <Icon className={`h-3.5 w-3.5 ${kpi.color}`} />
                    </div>
                    <ArrowUpRight className="h-3 w-3 text-zinc-700" />
                  </div>
                  <p className={`text-2xl font-bold tracking-tight ${kpi.color}`}>
                    {kpi.value}
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-600 leading-tight">
                    {kpi.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Column 3: Today's Performance + CTAs ── */}
        <div className="flex flex-col justify-between gap-5 p-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="section-label">Today&apos;s Performance</p>
              <TrendingUp className="h-3.5 w-3.5 text-zinc-700" />
            </div>

            {/* Performance ring + stats */}
            <div className="flex items-center gap-5">
              <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center">
                <svg className="h-[72px] w-[72px] -rotate-90" viewBox="0 0 72 72">
                  <circle
                    cx="36" cy="36" r="30"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="4.5"
                  />
                  <circle
                    cx="36" cy="36" r="30"
                    fill="none"
                    stroke="url(#perf-gradient)"
                    strokeWidth="4.5"
                    strokeDasharray={`${(todayPercent / 100) * 188.5} 188.5`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="perf-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-center">
                  <span className="text-[17px] font-bold text-white leading-none">{todayPercent}%</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <p className="text-[13px] font-semibold text-zinc-100">
                    {completedToday}/{totalToday} goals
                  </p>
                  <p className="text-[11px] text-zinc-600">completed today</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/[0.08] px-2.5 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  <span className="text-[11px] font-semibold text-blue-400">
                    +{todayXp} pts today
                  </span>
                </div>
              </div>
            </div>

            {/* 7-day sparkline */}
            <div className="mt-5">
              <p className="mb-2 text-[10px] text-zinc-700">7-day activity</p>
              <div className="flex items-end gap-1 h-8">
                {weekData.map((d, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                    <div
                      className={`w-full rounded-sm transition-all ${d.isToday ? 'bg-blue-500/60' : 'bg-white/[0.07]'}`}
                      style={{ height: `${Math.max((d.xp / maxXp) * 32, d.xp > 0 ? 4 : 2)}px` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1.5 flex justify-between">
                {weekData.map((d, i) => (
                  <span
                    key={i}
                    className={`flex-1 text-center text-[9px] ${d.isToday ? 'text-blue-400' : 'text-zinc-700'}`}
                  >
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
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-blue-500/15 transition-all hover:bg-blue-600 active:scale-[0.98]"
            >
              <Phone className="h-3.5 w-3.5" />
              Log Activity
            </button>
            <button
              onClick={() => openQuickAction('add-contact')}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-[13px] font-medium text-zinc-300 transition-all hover:bg-white/[0.06] hover:border-white/[0.1] active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
