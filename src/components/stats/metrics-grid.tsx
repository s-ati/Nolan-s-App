"use client"

import { useMemo } from "react"
import {
  Phone,
  PhoneForwarded,
  Clock,
  AlertTriangle,
  UserPlus,
  Users,
  Briefcase,
  FileSignature,
  Calendar,
  Home,
  Zap,
  Flame,
  CheckCircle2,
  DollarSign,
  Trophy,
  type LucideIcon,
} from "lucide-react"
import {
  isToday,
  isThisWeek,
  isThisMonth,
  parseISO,
  isBefore,
  startOfDay,
} from "date-fns"
import { useDemoStore } from "@/stores/demo-data"

interface Metric {
  label: string
  value: string | number
  icon: LucideIcon
  color: string
}

export function MetricsGrid() {
  const activities = useDemoStore((s) => s.activities)
  const contacts = useDemoStore((s) => s.contacts)
  const deals = useDemoStore((s) => s.deals)
  const streaks = useDemoStore((s) => s.streaks)
  const quests = useDemoStore((s) => s.quests)
  const profile = useDemoStore((s) => s.profile)

  const metrics = useMemo<Metric[]>(() => {
    const todayStart = startOfDay(new Date())

    const callsToday = activities.filter(
      (a) => a.type === "Call" && isToday(parseISO(a.createdAt))
    ).length

    const callsThisWeek = activities.filter(
      (a) =>
        a.type === "Call" &&
        isThisWeek(parseISO(a.createdAt), { weekStartsOn: 1 })
    ).length

    const followUpsDue = contacts.filter(
      (c) =>
        c.nextFollowUpDate &&
        isToday(parseISO(c.nextFollowUpDate))
    ).length

    const overdueFollowUps = contacts.filter(
      (c) =>
        c.nextFollowUpDate &&
        isBefore(parseISO(c.nextFollowUpDate), todayStart)
    ).length

    const activeLeads = contacts.filter(
      (c) => c.status === "Prospect" || c.status === "Warm Lead"
    ).length

    const activeClients = contacts.filter(
      (c) => c.status === "Active Buyer" || c.status === "Active Seller"
    ).length

    const activeDeals = deals.filter(
      (d) => !["Closed", "Dead"].includes(d.stage)
    ).length

    const underContract = deals.filter(
      (d) => d.stage === "Under Contract"
    ).length

    const meetingsThisWeek = activities.filter(
      (a) =>
        a.type === "Meeting" &&
        isThisWeek(parseISO(a.createdAt), { weekStartsOn: 1 })
    ).length

    const showingsThisWeek = activities.filter(
      (a) =>
        a.type === "Showing" &&
        isThisWeek(parseISO(a.createdAt), { weekStartsOn: 1 })
    ).length

    const xpThisWeek = activities
      .filter((a) => isThisWeek(parseISO(a.createdAt), { weekStartsOn: 1 }))
      .reduce((sum, a) => sum + a.xpAwarded, 0)

    const dailyStreak =
      streaks.find((s) => s.streakType === "daily_activity")?.currentCount ?? 0

    const questsCompletedThisWeek = quests.filter(
      (q) =>
        q.status === "completed" &&
        q.completedAt &&
        isThisWeek(parseISO(q.completedAt), { weekStartsOn: 1 })
    ).length

    const pipelineValue = deals
      .filter((d) => !["Closed", "Dead"].includes(d.stage))
      .reduce((sum, d) => sum + d.estimatedCommission, 0)

    const dealsClosedThisMonth = deals.filter(
      (d) =>
        d.stage === "Closed" &&
        isThisMonth(parseISO(d.updatedAt))
    ).length

    return [
      { label: "Calls Today", value: callsToday, icon: Phone, color: "text-blue-400" },
      { label: "Calls This Week", value: callsThisWeek, icon: PhoneForwarded, color: "text-blue-400" },
      { label: "Follow-ups Due", value: followUpsDue, icon: Clock, color: "text-amber-400" },
      { label: "Overdue Follow-ups", value: overdueFollowUps, icon: AlertTriangle, color: "text-red-400" },
      { label: "Active Leads", value: activeLeads, icon: UserPlus, color: "text-cyan-400" },
      { label: "Active Clients", value: activeClients, icon: Users, color: "text-green-400" },
      { label: "Active Deals", value: activeDeals, icon: Briefcase, color: "text-purple-400" },
      { label: "Under Contract", value: underContract, icon: FileSignature, color: "text-emerald-400" },
      { label: "Meetings This Week", value: meetingsThisWeek, icon: Calendar, color: "text-indigo-400" },
      { label: "Showings This Week", value: showingsThisWeek, icon: Home, color: "text-amber-400" },
      { label: "XP This Week", value: xpThisWeek, icon: Zap, color: "text-yellow-400" },
      { label: "Streak Days", value: dailyStreak, icon: Flame, color: "text-orange-400" },
      { label: "Quests Done (Week)", value: questsCompletedThisWeek, icon: CheckCircle2, color: "text-green-400" },
      {
        label: "Pipeline Value",
        value: `$${pipelineValue.toLocaleString()}`,
        icon: DollarSign,
        color: "text-emerald-400",
      },
      { label: "Deals Closed (Month)", value: dealsClosedThisMonth, icon: Trophy, color: "text-yellow-400" },
    ]
  }, [activities, contacts, deals, streaks, quests, profile])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <div
            key={metric.label}
            className="bg-[#12141a] border border-[#1e2030] rounded-xl p-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${metric.color} opacity-60`} />
              <span className="text-xs text-zinc-500 truncate">
                {metric.label}
              </span>
            </div>
            <span className="text-xl font-bold text-zinc-100">
              {metric.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}
