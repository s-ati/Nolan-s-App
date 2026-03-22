// Demo/seed data store for Leveled
// This provides a fully functional local experience without requiring Supabase
// Uses Zustand with persistence to localStorage

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format, subDays, addDays } from 'date-fns'
import { calculateLevel, getRankTitle, getXpForActivity, getStatEffects, calculateStatLevel } from '@/lib/game/xp-engine'

// ---- Types ----
export interface UserProfile {
  id: string
  displayName: string
  avatarUrl: string | null
  totalXp: number
  currentLevel: number
  rankTitle: string
  timezone: string
}

export interface Contact {
  id: string
  fullName: string
  phone: string
  email: string
  leadSource: string
  status: 'Prospect' | 'Warm Lead' | 'Active Buyer' | 'Active Seller' | 'Nurture' | 'Under Contract' | 'Closed' | 'Lost'
  nextFollowUpDate: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  notes: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Deal {
  id: string
  contactId: string | null
  title: string
  propertyAddress: string
  stage: 'Lead' | 'Active Client' | 'Offer Stage' | 'Under Contract' | 'Closed' | 'Dead'
  estimatedCommission: number
  estimatedCloseDate: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  notes: string
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  contactId: string | null
  dealId: string | null
  type: string
  title: string
  notes: string
  xpAwarded: number
  statEffects: Record<string, number>
  createdAt: string
}

export interface Quest {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'normal' | 'hard' | 'epic'
  xpReward: number
  sourceType: 'manual' | 'system' | 'pipeline'
  linkedContactId: string | null
  linkedDealId: string | null
  dueDate: string | null
  status: 'active' | 'completed' | 'snoozed' | 'expired'
  period: 'daily' | 'weekly' | 'monthly' | 'pipeline'
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Achievement {
  id: string
  key: string
  title: string
  description: string
  category: string
  xpReward: number
  icon: string
  ruleType: string
  ruleConfig: Record<string, unknown>
}

export interface UserAchievement {
  id: string
  achievementId: string
  unlockedAt: string
  progressValue: number
}

export interface Streak {
  id: string
  streakType: string
  currentCount: number
  bestCount: number
  lastCompletedDate: string | null
}

export interface DailyPlan {
  id: string
  planDate: string
  notes: string
  completionScore: number
  blocks: PlanBlock[]
}

export interface PlanBlock {
  id: string
  title: string
  category: string
  startTime: string
  endTime: string
  status: 'planned' | 'in_progress' | 'completed' | 'skipped'
  notes: string
  linkedQuestId: string | null
}

export interface StatProgress {
  statName: string
  statValue: number
  level: number
}

export interface Notification {
  id: string
  type: string
  title: string
  body: string
  isRead: boolean
  createdAt: string
}

// ---- Store ----
interface DemoDataState {
  initialized: boolean
  profile: UserProfile
  contacts: Contact[]
  deals: Deal[]
  activities: Activity[]
  quests: Quest[]
  achievements: Achievement[]
  userAchievements: UserAchievement[]
  streaks: Streak[]
  dailyPlans: DailyPlan[]
  statProgress: StatProgress[]
  notifications: Notification[]

  // Actions
  initialize: () => void
  resetData: () => void

  // Profile
  updateProfile: (updates: Partial<UserProfile>) => void
  addXp: (amount: number) => void

  // Contacts
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Contact
  updateContact: (id: string, updates: Partial<Contact>) => void
  deleteContact: (id: string) => void

  // Deals
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Deal
  updateDeal: (id: string, updates: Partial<Deal>) => void
  deleteDeal: (id: string) => void

  // Activities
  logActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'xpAwarded' | 'statEffects'>) => Activity

  // Quests
  addQuest: (quest: Omit<Quest, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>) => Quest
  updateQuest: (id: string, updates: Partial<Quest>) => void
  completeQuest: (id: string) => void
  deleteQuest: (id: string) => void

  // Plans
  addDailyPlan: (plan: Omit<DailyPlan, 'id' | 'blocks'> & { blocks?: PlanBlock[] }) => DailyPlan
  updateDailyPlan: (id: string, updates: Partial<DailyPlan>) => void
  addPlanBlock: (planId: string, block: Omit<PlanBlock, 'id'>) => PlanBlock
  updatePlanBlock: (planId: string, blockId: string, updates: Partial<PlanBlock>) => void
  deletePlanBlock: (planId: string, blockId: string) => void

  // Stats
  updateStatProgress: (statName: string, increment: number) => void

  // Achievements
  checkAchievements: () => void

  // Streaks
  updateStreak: (streakType: string) => void

  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
}

function uid(): string {
  return crypto.randomUUID()
}

function now(): string {
  return new Date().toISOString()
}

function today(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

// Seed achievements
const SEED_ACHIEVEMENTS: Achievement[] = [
  { id: uid(), key: 'first_call', title: 'First Logged Call', description: 'Log your first call', category: 'Prospecting', xpReward: 50, icon: 'phone', ruleType: 'activity_count', ruleConfig: { activity_type: 'Call', count: 1 } },
  { id: uid(), key: 'ten_calls_day', title: '10 Calls in One Day', description: 'Make 10 calls in a single day', category: 'Prospecting', xpReward: 150, icon: 'phone-outgoing', ruleType: 'daily_activity_count', ruleConfig: { activity_type: 'Call', count: 10 } },
  { id: uid(), key: 'seven_day_prospect', title: '7-Day Prospecting Streak', description: 'Prospect for 7 consecutive days', category: 'Consistency', xpReward: 200, icon: 'flame', ruleType: 'streak', ruleConfig: { streak_type: 'prospecting', count: 7 } },
  { id: uid(), key: 'thirty_followups', title: '30 Follow-ups Completed', description: 'Complete 30 follow-ups total', category: 'Follow-up', xpReward: 200, icon: 'check-circle', ruleType: 'activity_count', ruleConfig: { activity_type: 'Follow-up Completed', count: 30 } },
  { id: uid(), key: 'first_active_client', title: 'First Active Client', description: 'Move a deal to Active Client stage', category: 'Deals', xpReward: 150, icon: 'user-check', ruleType: 'deal_stage', ruleConfig: { stage: 'Active Client', count: 1 } },
  { id: uid(), key: 'first_under_contract', title: 'First Under Contract', description: 'Get your first deal under contract', category: 'Deals', xpReward: 300, icon: 'file-signature', ruleType: 'deal_stage', ruleConfig: { stage: 'Under Contract', count: 1 } },
  { id: uid(), key: 'first_closed_deal', title: 'First Closed Deal', description: 'Close your first deal', category: 'Deals', xpReward: 500, icon: 'trophy', ruleType: 'deal_stage', ruleConfig: { stage: 'Closed', count: 1 } },
  { id: uid(), key: 'xp_1000', title: '1,000 XP Earned', description: 'Earn 1,000 total XP', category: 'Milestones', xpReward: 100, icon: 'zap', ruleType: 'total_xp', ruleConfig: { count: 1000 } },
  { id: uid(), key: 'xp_5000', title: '5,000 XP Earned', description: 'Earn 5,000 total XP', category: 'Milestones', xpReward: 250, icon: 'zap', ruleType: 'total_xp', ruleConfig: { count: 5000 } },
  { id: uid(), key: 'planner_streak_5', title: '5-Day Planner Streak', description: 'Complete your planner for 5 consecutive days', category: 'Discipline', xpReward: 200, icon: 'calendar-check', ruleType: 'streak', ruleConfig: { streak_type: 'planner', count: 5 } },
  { id: uid(), key: 'hundred_activities', title: '100 Activities Logged', description: 'Log 100 total activities', category: 'Milestones', xpReward: 250, icon: 'activity', ruleType: 'total_activities', ruleConfig: { count: 100 } },
  { id: uid(), key: 'first_meeting', title: 'First Meeting Logged', description: 'Log your first meeting', category: 'Prospecting', xpReward: 75, icon: 'users', ruleType: 'activity_count', ruleConfig: { activity_type: 'Meeting', count: 1 } },
  { id: uid(), key: 'five_deals', title: '5 Active Deals', description: 'Have 5 active deals at once', category: 'Deals', xpReward: 200, icon: 'briefcase', ruleType: 'active_deals', ruleConfig: { count: 5 } },
  { id: uid(), key: 'first_showing', title: 'First Showing', description: 'Log your first showing', category: 'Prospecting', xpReward: 75, icon: 'home', ruleType: 'activity_count', ruleConfig: { activity_type: 'Showing', count: 1 } },
  { id: uid(), key: 'crm_clean_week', title: 'CRM Clean Week', description: 'Have no overdue follow-ups for a full week', category: 'Discipline', xpReward: 150, icon: 'sparkles', ruleType: 'weekly_crm_clean', ruleConfig: {} },
]

function createSeedData() {
  const todayStr = today()
  const contacts: Contact[] = [
    { id: uid(), fullName: 'Sarah Johnson', phone: '(555) 234-5678', email: 'sarah.j@email.com', leadSource: 'Open House', status: 'Warm Lead', nextFollowUpDate: todayStr, priority: 'high', notes: 'Interested in 3BR homes in Westside', tags: ['buyer', 'first-time'], createdAt: subDays(new Date(), 12).toISOString(), updatedAt: now() },
    { id: uid(), fullName: 'Michael Torres', phone: '(555) 345-6789', email: 'mtorres@email.com', leadSource: 'Referral', status: 'Active Buyer', nextFollowUpDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'), priority: 'high', notes: 'Pre-approved for $450K. Looking in Oak Park area.', tags: ['buyer', 'pre-approved'], createdAt: subDays(new Date(), 20).toISOString(), updatedAt: now() },
    { id: uid(), fullName: 'Lisa Chen', phone: '(555) 456-7890', email: 'lisa.chen@email.com', leadSource: 'Website', status: 'Prospect', nextFollowUpDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'), priority: 'medium', notes: 'Downloaded market report from website', tags: ['seller'], createdAt: subDays(new Date(), 5).toISOString(), updatedAt: now() },
    { id: uid(), fullName: 'David Ramirez', phone: '(555) 567-8901', email: 'dramirez@email.com', leadSource: 'Sphere', status: 'Under Contract', nextFollowUpDate: todayStr, priority: 'urgent', notes: 'Closing scheduled for end of month. Inspection complete.', tags: ['buyer', 'under-contract'], createdAt: subDays(new Date(), 45).toISOString(), updatedAt: now() },
    { id: uid(), fullName: 'Amanda White', phone: '(555) 678-9012', email: 'awhite@email.com', leadSource: 'Cold Call', status: 'Nurture', nextFollowUpDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'), priority: 'low', notes: 'Not ready to sell yet, check back in spring', tags: ['seller', 'nurture'], createdAt: subDays(new Date(), 30).toISOString(), updatedAt: now() },
    { id: uid(), fullName: 'James Park', phone: '(555) 789-0123', email: 'jpark@email.com', leadSource: 'Social Media', status: 'Active Seller', nextFollowUpDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'), priority: 'high', notes: 'Listing at 456 Elm St. Price reduction discussion pending.', tags: ['seller', 'listing'], createdAt: subDays(new Date(), 35).toISOString(), updatedAt: now() },
  ]

  const deals: Deal[] = [
    { id: uid(), contactId: contacts[1].id, title: 'Torres - Oak Park Home Search', propertyAddress: 'TBD Oak Park Area', stage: 'Active Client', estimatedCommission: 13500, estimatedCloseDate: format(addDays(new Date(), 60), 'yyyy-MM-dd'), priority: 'high', notes: 'Showing 3 properties this week', createdAt: subDays(new Date(), 15).toISOString(), updatedAt: now() },
    { id: uid(), contactId: contacts[3].id, title: 'Ramirez - 789 Pine St Purchase', propertyAddress: '789 Pine Street', stage: 'Under Contract', estimatedCommission: 12000, estimatedCloseDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'), priority: 'urgent', notes: 'Inspection passed. Awaiting final walkthrough.', createdAt: subDays(new Date(), 40).toISOString(), updatedAt: now() },
    { id: uid(), contactId: contacts[5].id, title: 'Park - 456 Elm St Listing', propertyAddress: '456 Elm Street', stage: 'Active Client', estimatedCommission: 15000, estimatedCloseDate: format(addDays(new Date(), 45), 'yyyy-MM-dd'), priority: 'high', notes: 'Listed at $499K. 12 showings so far.', createdAt: subDays(new Date(), 28).toISOString(), updatedAt: now() },
    { id: uid(), contactId: contacts[0].id, title: 'Johnson - Westside Home Search', propertyAddress: 'TBD Westside', stage: 'Lead', estimatedCommission: 10000, estimatedCloseDate: null, priority: 'medium', notes: 'Initial consultation done. Need to schedule showings.', createdAt: subDays(new Date(), 8).toISOString(), updatedAt: now() },
  ]

  const activities: Activity[] = [
    { id: uid(), contactId: contacts[0].id, dealId: null, type: 'Call', title: 'Called Sarah Johnson', notes: 'Discussed Westside listings', xpAwarded: 15, statEffects: { 'Lead Generation': 3, 'Networking': 2 }, createdAt: subDays(new Date(), 1).toISOString() },
    { id: uid(), contactId: contacts[1].id, dealId: deals[0].id, type: 'Showing', title: 'Showed 2 properties to Torres', notes: 'Liked the ranch on Oak Ave', xpAwarded: 35, statEffects: { 'Networking': 2, 'Negotiation': 3 }, createdAt: subDays(new Date(), 1).toISOString() },
    { id: uid(), contactId: contacts[3].id, dealId: deals[1].id, type: 'Contract Update', title: 'Ramirez inspection update', notes: 'Inspection passed with minor issues', xpAwarded: 40, statEffects: { 'Negotiation': 4 }, createdAt: subDays(new Date(), 2).toISOString() },
    { id: uid(), contactId: contacts[5].id, dealId: deals[2].id, type: 'Meeting', title: 'Price discussion with Park', notes: 'Agreed to reduce by $10K', xpAwarded: 30, statEffects: { 'Networking': 3, 'Negotiation': 2 }, createdAt: subDays(new Date(), 2).toISOString() },
    { id: uid(), contactId: contacts[2].id, dealId: null, type: 'Email', title: 'Sent market report to Lisa Chen', notes: 'Follow-up on website inquiry', xpAwarded: 12, statEffects: { 'Lead Generation': 2, 'Marketing': 1 }, createdAt: subDays(new Date(), 3).toISOString() },
    { id: uid(), contactId: null, dealId: null, type: 'Call', title: 'Cold called 5 FSBO listings', notes: 'One interested - got contact info', xpAwarded: 15, statEffects: { 'Lead Generation': 3, 'Networking': 2 }, createdAt: subDays(new Date(), 3).toISOString() },
    { id: uid(), contactId: contacts[4].id, dealId: null, type: 'Text', title: 'Texted Amanda White', notes: 'Sent market update', xpAwarded: 10, statEffects: { 'Lead Generation': 2, 'Networking': 1 }, createdAt: subDays(new Date(), 4).toISOString() },
    { id: uid(), contactId: null, dealId: null, type: 'Note Added', title: 'Studied local market stats', notes: 'Q4 market analysis', xpAwarded: 5, statEffects: { 'Knowledge': 3 }, createdAt: subDays(new Date(), 4).toISOString() },
  ]

  const totalXp = 1247
  const level = calculateLevel(totalXp)

  const quests: Quest[] = [
    { id: uid(), title: 'Make 5 prospecting calls', description: 'Reach out to 5 new or existing leads', category: 'Prospecting', difficulty: 'normal', xpReward: 50, sourceType: 'system', linkedContactId: null, linkedDealId: null, dueDate: todayStr, status: 'active', period: 'daily', completedAt: null, createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'Send 5 follow-up texts', description: 'Text 5 contacts who need follow-up', category: 'Follow-up', difficulty: 'easy', xpReward: 25, sourceType: 'system', linkedContactId: null, linkedDealId: null, dueDate: todayStr, status: 'active', period: 'daily', completedAt: null, createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'Follow up with Sarah Johnson', description: 'Follow-up due today', category: 'Follow-up', difficulty: 'normal', xpReward: 50, sourceType: 'pipeline', linkedContactId: contacts[0].id, linkedDealId: null, dueDate: todayStr, status: 'active', period: 'daily', completedAt: null, createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'Update Ramirez deal status', description: 'High priority deal needs attention', category: 'Pipeline Progress', difficulty: 'hard', xpReward: 100, sourceType: 'pipeline', linkedContactId: contacts[3].id, linkedDealId: deals[1].id, dueDate: todayStr, status: 'active', period: 'pipeline', completedAt: null, createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'Add 2 new leads to CRM', description: 'Keep building your database', category: 'CRM Hygiene', difficulty: 'easy', xpReward: 25, sourceType: 'system', linkedContactId: null, linkedDealId: null, dueDate: todayStr, status: 'active', period: 'daily', completedAt: null, createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'Review pipeline for 15 minutes', description: 'Check all active deals and next steps', category: 'Pipeline Progress', difficulty: 'normal', xpReward: 50, sourceType: 'system', linkedContactId: null, linkedDealId: null, dueDate: todayStr, status: 'active', period: 'daily', completedAt: null, createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'Study contracts for 20 minutes', description: 'Improve your contract knowledge', category: 'Knowledge', difficulty: 'normal', xpReward: 50, sourceType: 'system', linkedContactId: null, linkedDealId: null, dueDate: todayStr, status: 'active', period: 'daily', completedAt: null, createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'Log 25 calls this week', description: 'Hit your weekly call target', category: 'Prospecting', difficulty: 'hard', xpReward: 100, sourceType: 'system', linkedContactId: null, linkedDealId: null, dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'), status: 'active', period: 'weekly', completedAt: null, createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'Add 10 new leads this week', description: 'Grow your database', category: 'Prospecting', difficulty: 'hard', xpReward: 100, sourceType: 'system', linkedContactId: null, linkedDealId: null, dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'), status: 'active', period: 'weekly', completedAt: null, createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'Schedule 2 meetings this week', description: 'Get face-to-face time', category: 'Prospecting', difficulty: 'normal', xpReward: 50, sourceType: 'system', linkedContactId: null, linkedDealId: null, dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'), status: 'active', period: 'weekly', completedAt: null, createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'Follow up with James Park (OVERDUE)', description: 'Follow-up was due 2 days ago', category: 'Follow-up', difficulty: 'hard', xpReward: 100, sourceType: 'pipeline', linkedContactId: contacts[5].id, linkedDealId: deals[2].id, dueDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'), status: 'active', period: 'pipeline', completedAt: null, createdAt: now(), updatedAt: now() },
  ]

  const streaks: Streak[] = [
    { id: uid(), streakType: 'daily_activity', currentCount: 4, bestCount: 7, lastCompletedDate: format(subDays(new Date(), 0), 'yyyy-MM-dd') },
    { id: uid(), streakType: 'prospecting', currentCount: 3, bestCount: 5, lastCompletedDate: format(subDays(new Date(), 0), 'yyyy-MM-dd') },
    { id: uid(), streakType: 'planner', currentCount: 2, bestCount: 3, lastCompletedDate: format(subDays(new Date(), 1), 'yyyy-MM-dd') },
  ]

  const statProgress: StatProgress[] = [
    { statName: 'Lead Generation', statValue: 145, level: 2 },
    { statName: 'Networking', statValue: 120, level: 2 },
    { statName: 'Marketing', statValue: 35, level: 1 },
    { statName: 'Negotiation', statValue: 95, level: 1 },
    { statName: 'Knowledge', statValue: 28, level: 1 },
    { statName: 'Discipline', statValue: 62, level: 1 },
  ]

  const dailyPlans: DailyPlan[] = [
    {
      id: uid(),
      planDate: todayStr,
      notes: 'Focus on prospecting and follow-ups today',
      completionScore: 0,
      blocks: [
        { id: uid(), title: 'Morning Prospecting', category: 'Prospecting', startTime: '09:00', endTime: '10:30', status: 'planned', notes: 'Cold calls and FSBO outreach', linkedQuestId: null },
        { id: uid(), title: 'Follow-up Calls', category: 'Follow-ups', startTime: '10:30', endTime: '11:30', status: 'planned', notes: 'Sarah Johnson, David Ramirez', linkedQuestId: null },
        { id: uid(), title: 'Torres Showings', category: 'Showings', startTime: '13:00', endTime: '15:00', status: 'planned', notes: '2 properties in Oak Park', linkedQuestId: null },
        { id: uid(), title: 'Pipeline Review', category: 'Pipeline Review', startTime: '15:30', endTime: '16:00', status: 'planned', notes: 'Review all active deals', linkedQuestId: null },
        { id: uid(), title: 'Contract Study', category: 'Learning', startTime: '16:00', endTime: '16:30', status: 'planned', notes: 'Study purchase agreements', linkedQuestId: null },
        { id: uid(), title: 'Admin & CRM Updates', category: 'Admin', startTime: '16:30', endTime: '17:00', status: 'planned', notes: 'Update notes, log activities', linkedQuestId: null },
      ],
    },
  ]

  return {
    profile: {
      id: uid(),
      displayName: 'Agent',
      avatarUrl: null,
      totalXp,
      currentLevel: level,
      rankTitle: getRankTitle(level),
      timezone: 'America/New_York',
    },
    contacts,
    deals,
    activities,
    quests,
    achievements: SEED_ACHIEVEMENTS,
    userAchievements: [
      { id: uid(), achievementId: SEED_ACHIEVEMENTS[0].id, unlockedAt: subDays(new Date(), 10).toISOString(), progressValue: 1 },
      { id: uid(), achievementId: SEED_ACHIEVEMENTS[11].id, unlockedAt: subDays(new Date(), 5).toISOString(), progressValue: 1 },
      { id: uid(), achievementId: SEED_ACHIEVEMENTS[13].id, unlockedAt: subDays(new Date(), 3).toISOString(), progressValue: 1 },
    ],
    streaks,
    dailyPlans,
    statProgress,
    notifications: [
      { id: uid(), type: 'quest', title: 'Daily quests refreshed', body: 'Your daily quests are ready. Let\'s get after it!', isRead: false, createdAt: now() },
      { id: uid(), type: 'followup', title: 'Follow-up due: Sarah Johnson', body: 'Your follow-up with Sarah Johnson is due today.', isRead: false, createdAt: now() },
      { id: uid(), type: 'overdue', title: 'Overdue: James Park follow-up', body: 'Your follow-up with James Park is 2 days overdue.', isRead: false, createdAt: subDays(new Date(), 1).toISOString() },
    ],
  }
}

export const useDemoStore = create<DemoDataState>()(
  persist(
    (set, get) => ({
      initialized: false,
      profile: createSeedData().profile,
      contacts: [],
      deals: [],
      activities: [],
      quests: [],
      achievements: SEED_ACHIEVEMENTS,
      userAchievements: [],
      streaks: [],
      dailyPlans: [],
      statProgress: [],
      notifications: [],

      initialize: () => {
        if (get().initialized) return
        const seed = createSeedData()
        set({ ...seed, initialized: true })
      },

      resetData: () => {
        const seed = createSeedData()
        set({ ...seed, initialized: true })
      },

      // Profile
      updateProfile: (updates) => set((s) => ({ profile: { ...s.profile, ...updates } })),
      addXp: (amount) => set((s) => {
        const newXp = s.profile.totalXp + amount
        const newLevel = calculateLevel(newXp)
        return {
          profile: {
            ...s.profile,
            totalXp: newXp,
            currentLevel: newLevel,
            rankTitle: getRankTitle(newLevel),
          },
        }
      }),

      // Contacts
      addContact: (contact) => {
        const newContact: Contact = { ...contact, id: uid(), createdAt: now(), updatedAt: now() }
        set((s) => ({ contacts: [newContact, ...s.contacts] }))
        return newContact
      },
      updateContact: (id, updates) => set((s) => ({
        contacts: s.contacts.map((c) => c.id === id ? { ...c, ...updates, updatedAt: now() } : c),
      })),
      deleteContact: (id) => set((s) => ({
        contacts: s.contacts.filter((c) => c.id !== id),
      })),

      // Deals
      addDeal: (deal) => {
        const newDeal: Deal = { ...deal, id: uid(), createdAt: now(), updatedAt: now() }
        set((s) => ({ deals: [newDeal, ...s.deals] }))
        return newDeal
      },
      updateDeal: (id, updates) => {
        const state = get()
        const deal = state.deals.find((d) => d.id === id)
        if (deal && updates.stage && updates.stage !== deal.stage) {
          // Auto-log deal stage change
          const activity: Activity = {
            id: uid(),
            contactId: deal.contactId,
            dealId: id,
            type: 'Deal Stage Changed',
            title: `${deal.title}: ${deal.stage} → ${updates.stage}`,
            notes: '',
            xpAwarded: getXpForActivity('Deal Stage Changed'),
            statEffects: getStatEffects('Deal Stage Changed'),
            createdAt: now(),
          }
          const xp = activity.xpAwarded
          const newXp = state.profile.totalXp + xp
          const newLevel = calculateLevel(newXp)
          set((s) => ({
            deals: s.deals.map((d) => d.id === id ? { ...d, ...updates, updatedAt: now() } : d),
            activities: [activity, ...s.activities],
            profile: { ...s.profile, totalXp: newXp, currentLevel: newLevel, rankTitle: getRankTitle(newLevel) },
          }))
          // Update stats
          Object.entries(activity.statEffects).forEach(([stat, val]) => {
            get().updateStatProgress(stat, val)
          })
        } else {
          set((s) => ({
            deals: s.deals.map((d) => d.id === id ? { ...d, ...updates, updatedAt: now() } : d),
          }))
        }
      },
      deleteDeal: (id) => set((s) => ({
        deals: s.deals.filter((d) => d.id !== id),
      })),

      // Activities
      logActivity: (activityInput) => {
        const xp = getXpForActivity(activityInput.type)
        const statEffects = getStatEffects(activityInput.type)
        const activity: Activity = {
          ...activityInput,
          id: uid(),
          xpAwarded: xp,
          statEffects,
          createdAt: now(),
        }
        const state = get()
        const newXp = state.profile.totalXp + xp
        const newLevel = calculateLevel(newXp)
        set((s) => ({
          activities: [activity, ...s.activities],
          profile: {
            ...s.profile,
            totalXp: newXp,
            currentLevel: newLevel,
            rankTitle: getRankTitle(newLevel),
          },
        }))
        // Update stat progress
        Object.entries(statEffects).forEach(([stat, val]) => {
          get().updateStatProgress(stat, val)
        })
        // Update streaks
        get().updateStreak('daily_activity')
        if (['Call', 'Text', 'Email'].includes(activityInput.type)) {
          get().updateStreak('prospecting')
        }
        // Check achievements
        setTimeout(() => get().checkAchievements(), 100)
        return activity
      },

      // Quests
      addQuest: (quest) => {
        const newQuest: Quest = { ...quest, id: uid(), completedAt: null, createdAt: now(), updatedAt: now() }
        set((s) => ({ quests: [newQuest, ...s.quests] }))
        return newQuest
      },
      updateQuest: (id, updates) => set((s) => ({
        quests: s.quests.map((q) => q.id === id ? { ...q, ...updates, updatedAt: now() } : q),
      })),
      completeQuest: (id) => {
        const state = get()
        const quest = state.quests.find((q) => q.id === id)
        if (!quest || quest.status === 'completed') return
        const xp = quest.xpReward
        const newXp = state.profile.totalXp + xp
        const newLevel = calculateLevel(newXp)
        set((s) => ({
          quests: s.quests.map((q) => q.id === id ? { ...q, status: 'completed' as const, completedAt: now(), updatedAt: now() } : q),
          profile: { ...s.profile, totalXp: newXp, currentLevel: newLevel, rankTitle: getRankTitle(newLevel) },
        }))
        get().updateStreak('daily_activity')
        setTimeout(() => get().checkAchievements(), 100)
      },
      deleteQuest: (id) => set((s) => ({
        quests: s.quests.filter((q) => q.id !== id),
      })),

      // Plans
      addDailyPlan: (plan) => {
        const newPlan: DailyPlan = { ...plan, id: uid(), blocks: plan.blocks || [] }
        set((s) => ({ dailyPlans: [newPlan, ...s.dailyPlans] }))
        return newPlan
      },
      updateDailyPlan: (id, updates) => set((s) => ({
        dailyPlans: s.dailyPlans.map((p) => p.id === id ? { ...p, ...updates } : p),
      })),
      addPlanBlock: (planId, block) => {
        const newBlock: PlanBlock = { ...block, id: uid() }
        set((s) => ({
          dailyPlans: s.dailyPlans.map((p) =>
            p.id === planId ? { ...p, blocks: [...p.blocks, newBlock] } : p
          ),
        }))
        return newBlock
      },
      updatePlanBlock: (planId, blockId, updates) => set((s) => ({
        dailyPlans: s.dailyPlans.map((p) =>
          p.id === planId
            ? { ...p, blocks: p.blocks.map((b) => b.id === blockId ? { ...b, ...updates } : b) }
            : p
        ),
      })),
      deletePlanBlock: (planId, blockId) => set((s) => ({
        dailyPlans: s.dailyPlans.map((p) =>
          p.id === planId ? { ...p, blocks: p.blocks.filter((b) => b.id !== blockId) } : p
        ),
      })),

      // Stats
      updateStatProgress: (statName, increment) => set((s) => ({
        statProgress: s.statProgress.map((sp) =>
          sp.statName === statName
            ? { ...sp, statValue: sp.statValue + increment, level: calculateStatLevel(sp.statValue + increment) }
            : sp
        ),
      })),

      // Achievements
      checkAchievements: () => {
        const state = get()
        const unlockedKeys = state.userAchievements.map((ua) => {
          const ach = state.achievements.find((a) => a.id === ua.achievementId)
          return ach?.key
        })

        for (const achievement of state.achievements) {
          if (unlockedKeys.includes(achievement.key)) continue

          let shouldUnlock = false
          const config = achievement.ruleConfig

          switch (achievement.ruleType) {
            case 'activity_count': {
              const count = state.activities.filter((a) => a.type === config.activity_type).length
              if (count >= (config.count as number)) shouldUnlock = true
              break
            }
            case 'total_xp': {
              if (state.profile.totalXp >= (config.count as number)) shouldUnlock = true
              break
            }
            case 'total_activities': {
              if (state.activities.length >= (config.count as number)) shouldUnlock = true
              break
            }
            case 'streak': {
              const streak = state.streaks.find((s) => s.streakType === config.streak_type)
              if (streak && streak.bestCount >= (config.count as number)) shouldUnlock = true
              break
            }
            case 'deal_stage': {
              const count = state.deals.filter((d) => d.stage === config.stage).length
              if (count >= (config.count as number)) shouldUnlock = true
              break
            }
            case 'active_deals': {
              const count = state.deals.filter((d) => !['Closed', 'Dead'].includes(d.stage)).length
              if (count >= (config.count as number)) shouldUnlock = true
              break
            }
          }

          if (shouldUnlock) {
            set((s) => ({
              userAchievements: [
                ...s.userAchievements,
                { id: uid(), achievementId: achievement.id, unlockedAt: now(), progressValue: 1 },
              ],
              profile: {
                ...s.profile,
                totalXp: s.profile.totalXp + achievement.xpReward,
                currentLevel: calculateLevel(s.profile.totalXp + achievement.xpReward),
                rankTitle: getRankTitle(calculateLevel(s.profile.totalXp + achievement.xpReward)),
              },
              notifications: [
                { id: uid(), type: 'achievement', title: `Achievement Unlocked: ${achievement.title}`, body: `+${achievement.xpReward} XP`, isRead: false, createdAt: now() },
                ...s.notifications,
              ],
            }))
          }
        }
      },

      // Streaks
      updateStreak: (streakType) => {
        const todayStr = today()
        set((s) => ({
          streaks: s.streaks.map((streak) => {
            if (streak.streakType !== streakType) return streak
            if (streak.lastCompletedDate === todayStr) return streak
            const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd')
            const isConsecutive = streak.lastCompletedDate === yesterdayStr
            const newCount = isConsecutive ? streak.currentCount + 1 : 1
            return {
              ...streak,
              currentCount: newCount,
              bestCount: Math.max(streak.bestCount, newCount),
              lastCompletedDate: todayStr,
            }
          }),
        }))
      },

      // Notifications
      addNotification: (notification) => set((s) => ({
        notifications: [{ ...notification, id: uid(), isRead: false, createdAt: now() }, ...s.notifications],
      })),
      markNotificationRead: (id) => set((s) => ({
        notifications: s.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
      })),
      markAllNotificationsRead: () => set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      })),
    }),
    {
      name: 'leveled-data',
      version: 1,
    }
  )
)
