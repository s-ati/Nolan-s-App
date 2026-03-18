import type { Database } from './database'

// ---------------------------------------------------------------------------
// Row types (what you get back from SELECT)
// ---------------------------------------------------------------------------
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Contact = Database['public']['Tables']['contacts']['Row']
export type Deal = Database['public']['Tables']['deals']['Row']
export type Activity = Database['public']['Tables']['activities']['Row']
export type Quest = Database['public']['Tables']['quests']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row']
export type Streak = Database['public']['Tables']['streaks']['Row']
export type DailyPlan = Database['public']['Tables']['daily_plans']['Row']
export type DailyPlanBlock = Database['public']['Tables']['daily_plan_blocks']['Row']
export type StatProgress = Database['public']['Tables']['stat_progress']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

// ---------------------------------------------------------------------------
// Insert types (what you pass to INSERT)
// ---------------------------------------------------------------------------
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type ContactInsert = Database['public']['Tables']['contacts']['Insert']
export type DealInsert = Database['public']['Tables']['deals']['Insert']
export type ActivityInsert = Database['public']['Tables']['activities']['Insert']
export type QuestInsert = Database['public']['Tables']['quests']['Insert']
export type AchievementInsert = Database['public']['Tables']['achievements']['Insert']
export type UserAchievementInsert = Database['public']['Tables']['user_achievements']['Insert']
export type StreakInsert = Database['public']['Tables']['streaks']['Insert']
export type DailyPlanInsert = Database['public']['Tables']['daily_plans']['Insert']
export type DailyPlanBlockInsert = Database['public']['Tables']['daily_plan_blocks']['Insert']
export type StatProgressInsert = Database['public']['Tables']['stat_progress']['Insert']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']

// ---------------------------------------------------------------------------
// Update types (what you pass to UPDATE)
// ---------------------------------------------------------------------------
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']
export type ContactUpdate = Database['public']['Tables']['contacts']['Update']
export type DealUpdate = Database['public']['Tables']['deals']['Update']
export type ActivityUpdate = Database['public']['Tables']['activities']['Update']
export type QuestUpdate = Database['public']['Tables']['quests']['Update']
export type AchievementUpdate = Database['public']['Tables']['achievements']['Update']
export type UserAchievementUpdate = Database['public']['Tables']['user_achievements']['Update']
export type StreakUpdate = Database['public']['Tables']['streaks']['Update']
export type DailyPlanUpdate = Database['public']['Tables']['daily_plans']['Update']
export type DailyPlanBlockUpdate = Database['public']['Tables']['daily_plan_blocks']['Update']
export type StatProgressUpdate = Database['public']['Tables']['stat_progress']['Update']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']

// ---------------------------------------------------------------------------
// Constants – arrays matching the CHECK constraints in the database
// ---------------------------------------------------------------------------
export const CONTACT_STATUSES = [
  'Prospect',
  'Warm Lead',
  'Active Buyer',
  'Active Seller',
  'Nurture',
  'Under Contract',
  'Closed',
  'Lost',
] as const

export type ContactStatus = (typeof CONTACT_STATUSES)[number]

export const DEAL_STAGES = [
  'Lead',
  'Active Client',
  'Offer Stage',
  'Under Contract',
  'Closed',
  'Dead',
] as const

export type DealStage = (typeof DEAL_STAGES)[number]

export const ACTIVITY_TYPES = [
  'Call',
  'Text',
  'Email',
  'Meeting',
  'Showing',
  'Open House',
  'Inspection Update',
  'Contract Update',
  'Note Added',
  'Follow-up Completed',
  'Deal Stage Changed',
] as const

export type ActivityType = (typeof ACTIVITY_TYPES)[number]

export const QUEST_CATEGORIES = [
  'Prospecting',
  'Follow-up',
  'CRM Hygiene',
  'Knowledge',
  'Marketing',
  'Pipeline Progress',
  'Discipline',
] as const

export type QuestCategory = (typeof QUEST_CATEGORIES)[number]

export const QUEST_DIFFICULTIES = [
  'easy',
  'normal',
  'hard',
  'epic',
] as const

export type QuestDifficulty = (typeof QUEST_DIFFICULTIES)[number]

export const QUEST_PERIODS = [
  'daily',
  'weekly',
  'monthly',
  'pipeline',
] as const

export type QuestPeriod = (typeof QUEST_PERIODS)[number]

export const STAT_NAMES = [
  'Lead Generation',
  'Networking',
  'Marketing',
  'Negotiation',
  'Knowledge',
  'Discipline',
] as const

export type StatName = (typeof STAT_NAMES)[number]

export const PIPELINE_BOARD_STAGES = [
  'New Leads',
  'Active Conversations',
  'Active Clients',
  'Under Contract / Closing',
] as const

export type PipelineBoardStage = (typeof PIPELINE_BOARD_STAGES)[number]
