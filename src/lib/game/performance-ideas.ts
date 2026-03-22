// Rules-based performance idea generator
// Reads current app state and returns 2–4 coaching prompts ranked by urgency.

import { format, subDays } from 'date-fns'
import { calculateXpProgress } from './xp-engine'

export type IdeaPriority = 'urgent' | 'high' | 'medium' | 'low'

export interface PerformanceIdea {
  id: string
  icon: string          // lucide icon name
  text: string          // coaching prompt copy
  priority: IdeaPriority
  actionKey?: string    // optional quick-action modal key
  actionLabel?: string
}

interface IdeaContext {
  activities:  { type: string; createdAt: string; dealId: string | null }[]
  contacts:    { status: string; nextFollowUpDate: string | null }[]
  deals:       { stage: string; estimatedCommission: number }[]
  streaks:     { streakType: string; currentCount: number; lastCompletedDate: string | null; bestCount: number }[]
  profile:     { totalXp: number }
  dailyTasks:  { completed: boolean; date: string }[]
}

const PRIORITY_ORDER: Record<IdeaPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 }

export function generatePerformanceIdeas(ctx: IdeaContext): PerformanceIdea[] {
  const ideas: PerformanceIdea[] = []
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const weekAgoPrefix = format(subDays(new Date(), 7), 'yyyy-MM-dd')

  // 1. No activity yet today
  const todayActivity = ctx.activities.filter((a) => a.createdAt.startsWith(todayStr))
  if (todayActivity.length === 0) {
    ideas.push({
      id: 'no_activity',
      icon: 'zap',
      text: "No activity logged yet today — log one quick action to start building momentum.",
      priority: 'urgent',
      actionKey: 'log-call',
      actionLabel: 'Log a Call',
    })
  }

  // 2. Overdue follow-ups
  const overdue = ctx.contacts.filter(
    (c) => c.nextFollowUpDate && c.nextFollowUpDate < todayStr
  ).length
  if (overdue > 0) {
    ideas.push({
      id: 'overdue_followups',
      icon: 'clock',
      text: `${overdue} overdue follow-up${overdue > 1 ? 's' : ''} in your pipeline — clear them before they go cold.`,
      priority: 'urgent',
    })
  }

  // 3. Streak at risk (have a streak but haven't logged today)
  const mainStreak = ctx.streaks.find((s) => s.streakType === 'daily_activity')
  if (mainStreak && mainStreak.currentCount >= 2 && mainStreak.lastCompletedDate !== todayStr) {
    ideas.push({
      id: 'streak_at_risk',
      icon: 'flame',
      text: `Your ${mainStreak.currentCount}-day streak is at risk — log any activity today to keep it alive.`,
      priority: 'urgent',
      actionKey: 'log-call',
      actionLabel: 'Log Activity',
    })
  }

  // 4. Warm leads not contacted recently
  const warmLeads = ctx.contacts.filter((c) =>
    ['Warm Lead', 'Active Buyer', 'Active Seller'].includes(c.status)
  ).length
  if (warmLeads >= 2) {
    ideas.push({
      id: 'warm_leads',
      icon: 'users',
      text: `${warmLeads} warm contacts in your CRM — a short follow-up message today could move one toward a deal.`,
      priority: 'high',
      actionKey: 'log-text',
      actionLabel: 'Log Follow-up',
    })
  }

  // 5. Light pipeline
  const activeDeals = ctx.deals.filter((d) => !['Closed', 'Dead'].includes(d.stage)).length
  if (activeDeals < 3) {
    ideas.push({
      id: 'light_pipeline',
      icon: 'briefcase',
      text: `Your pipeline has only ${activeDeals} active deal${activeDeals !== 1 ? 's' : ''} — focus on converting warm leads to grow it.`,
      priority: 'high',
      actionKey: 'add-contact',
      actionLabel: 'Add Lead',
    })
  }

  // 6. Low call volume this week
  const weekCalls = ctx.activities.filter(
    (a) => a.type === 'Call' && a.createdAt >= weekAgoPrefix
  ).length
  if (weekCalls < 5) {
    ideas.push({
      id: 'low_calls',
      icon: 'phone',
      text: `Only ${weekCalls} call${weekCalls !== 1 ? 's' : ''} logged this week — prospecting is the engine of a healthy pipeline.`,
      priority: 'high',
      actionKey: 'log-call',
      actionLabel: 'Log a Call',
    })
  }

  // 7. No deal activity in 3 days
  const threeDaysAgo = format(subDays(new Date(), 3), 'yyyy-MM-dd')
  const recentDealActivity = ctx.activities.filter(
    (a) => a.dealId && a.createdAt >= threeDaysAgo
  ).length
  if (activeDeals > 0 && recentDealActivity === 0) {
    ideas.push({
      id: 'stale_deals',
      icon: 'trending-up',
      text: "No deal activity in 3 days — send 2 client check-ins to keep your transactions moving forward.",
      priority: 'medium',
    })
  }

  // 8. Near level-up
  const { xpToNextLevel } = calculateXpProgress(ctx.profile.totalXp)
  if (xpToNextLevel <= 75) {
    ideas.push({
      id: 'near_level_up',
      icon: 'star',
      text: `Only ${xpToNextLevel} XP to your next level — one solid session and you're there.`,
      priority: 'medium',
      actionKey: 'log-call',
      actionLabel: 'Earn XP Now',
    })
  }

  // 9. Strong streak encouragement
  if (mainStreak && mainStreak.currentCount >= 5 && mainStreak.lastCompletedDate === todayStr) {
    ideas.push({
      id: 'streak_strong',
      icon: 'trophy',
      text: `${mainStreak.currentCount}-day streak — you're building the habits that top producers live by. Keep going.`,
      priority: 'low',
    })
  }

  // 10. All daily tasks done — positive reinforcement
  const todayTasks = ctx.dailyTasks.filter((t) => t.date === todayStr)
  if (todayTasks.length > 0 && todayTasks.every((t) => t.completed)) {
    ideas.push({
      id: 'all_tasks_done',
      icon: 'check-circle-2',
      text: "All daily tasks complete — great output today. Use your extra time to add a new lead or follow up with a cold contact.",
      priority: 'low',
    })
  }

  // 11. Default if nothing urgent/high
  if (ideas.filter((i) => ['urgent', 'high'].includes(i.priority)).length === 0) {
    ideas.push({
      id: 'default',
      icon: 'target',
      text: "You're in a solid position — focus on quality follow-ups and adding at least one new contact today.",
      priority: 'low',
    })
  }

  return ideas
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, 4)
}
