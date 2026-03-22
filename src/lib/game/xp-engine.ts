// XP and Level calculation engine for Leveled

export const XP_PER_LEVEL = 500

export const ACTIVITY_XP: Record<string, number> = {
  'Call': 15,
  'Text': 10,
  'Email': 12,
  'Meeting': 30,
  'Showing': 35,
  'Open House': 50,
  'Inspection Update': 35,
  'Contract Update': 40,
  'Note Added': 5,
  'Follow-up Completed': 20,
  'Deal Stage Changed': 25,
}

export const RANK_TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 31, title: 'Top Producer' },
  { minLevel: 21, title: 'Elite Operator' },
  { minLevel: 16, title: 'Contract Climber' },
  { minLevel: 11, title: 'Deal Hunter' },
  { minLevel: 9, title: 'Momentum Agent' },
  { minLevel: 7, title: 'Active Closer' },
  { minLevel: 5, title: 'Pipeline Builder' },
  { minLevel: 3, title: 'Rising Agent' },
  { minLevel: 1, title: 'Rookie Agent' },
]

export function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1
}

export function calculateXpForLevel(level: number): number {
  return (level - 1) * XP_PER_LEVEL
}

export function calculateXpProgress(totalXp: number): {
  level: number
  currentLevelXp: number
  nextLevelXp: number
  progressPercent: number
  xpToNextLevel: number
} {
  const level = calculateLevel(totalXp)
  const currentLevelXp = calculateXpForLevel(level)
  const nextLevelXp = calculateXpForLevel(level + 1)
  const xpInCurrentLevel = totalXp - currentLevelXp
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp
  const progressPercent = (xpInCurrentLevel / xpNeededForNextLevel) * 100

  return {
    level,
    currentLevelXp,
    nextLevelXp,
    progressPercent: Math.min(progressPercent, 100),
    xpToNextLevel: xpNeededForNextLevel - xpInCurrentLevel,
  }
}

export function getRankTitle(level: number): string {
  for (const rank of RANK_TITLES) {
    if (level >= rank.minLevel) {
      return rank.title
    }
  }
  return 'Rookie Agent'
}

export function getXpForActivity(activityType: string): number {
  return ACTIVITY_XP[activityType] || 10
}

// Stat effects: which stats are improved by each activity type
export const ACTIVITY_STAT_EFFECTS: Record<string, Record<string, number>> = {
  'Call': { 'Lead Generation': 3, 'Networking': 2 },
  'Text': { 'Lead Generation': 2, 'Networking': 1 },
  'Email': { 'Lead Generation': 2, 'Marketing': 1 },
  'Meeting': { 'Networking': 3, 'Negotiation': 2 },
  'Showing': { 'Networking': 2, 'Negotiation': 3 },
  'Open House': { 'Marketing': 3, 'Networking': 2, 'Lead Generation': 2 },
  'Inspection Update': { 'Negotiation': 3 },
  'Contract Update': { 'Negotiation': 4 },
  'Note Added': { 'Discipline': 1 },
  'Follow-up Completed': { 'Discipline': 2, 'Networking': 1 },
  'Deal Stage Changed': { 'Negotiation': 2 },
}

export function getStatEffects(activityType: string): Record<string, number> {
  return ACTIVITY_STAT_EFFECTS[activityType] || {}
}

export function calculateStatLevel(statValue: number): number {
  return Math.floor(statValue / 100) + 1
}

export function calculateStatProgress(statValue: number): number {
  return (statValue % 100)
}

// Quest difficulty XP multipliers
export const DIFFICULTY_XP: Record<string, number> = {
  'easy': 25,
  'normal': 50,
  'hard': 100,
  'epic': 200,
}

// Bonus XP for completing all daily tasks in one day
export const DAILY_ALL_BONUS_XP = 100

// Habit action definitions — instant one-tap logging
export interface HabitAction {
  key: string
  label: string
  icon: string
  xp: number           // positive = reward, negative = penalty
  positive: boolean
  activityType: string | null  // maps to Activity.type for full stat tracking
  color: string        // tailwind color base (e.g. 'blue', 'amber')
}

export const HABIT_ACTIONS: HabitAction[] = [
  { key: 'call',       label: 'Call Made',        icon: 'phone',           xp: 15,  positive: true,  activityType: 'Call',                color: 'blue' },
  { key: 'follow_up',  label: 'Follow-up Sent',   icon: 'check-circle-2',  xp: 20,  positive: true,  activityType: 'Follow-up Completed', color: 'amber' },
  { key: 'new_lead',   label: 'New Lead Added',    icon: 'user-plus',       xp: 25,  positive: true,  activityType: null,                  color: 'emerald' },
  { key: 'text',       label: 'Text Sent',         icon: 'message-square',  xp: 10,  positive: true,  activityType: 'Text',                color: 'purple' },
  { key: 'meeting',    label: 'Meeting Logged',    icon: 'users',           xp: 30,  positive: true,  activityType: 'Meeting',             color: 'cyan' },
  { key: 'showing',    label: 'Showing Done',      icon: 'home',            xp: 35,  positive: true,  activityType: 'Showing',             color: 'indigo' },
  { key: 'missed',     label: 'Missed Follow-up',  icon: 'x-circle',        xp: -10, positive: false, activityType: null,                  color: 'red' },
]
