import { create } from 'zustand'

interface QuickActionState {
  isOpen: boolean
  activeModal: string | null
  prefillData: Record<string, unknown> | null
}

interface NotificationState {
  unreadCount: number
  xpToast: { amount: number; activity: string } | null
  achievementToast: { title: string; xpReward: number } | null
}

interface AppState {
  // Quick Action System
  quickAction: QuickActionState
  openQuickAction: (modal?: string, prefill?: Record<string, unknown>) => void
  closeQuickAction: () => void

  // Notifications
  notifications: NotificationState
  setUnreadCount: (count: number) => void
  showXpToast: (amount: number, activity: string) => void
  clearXpToast: () => void
  showAchievementToast: (title: string, xpReward: number) => void
  clearAchievementToast: () => void

  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // Mobile
  mobileNavOpen: boolean
  setMobileNavOpen: (open: boolean) => void

  // Command Palette
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Quick Action
  quickAction: { isOpen: false, activeModal: null, prefillData: null },
  openQuickAction: (modal, prefill) =>
    set({ quickAction: { isOpen: true, activeModal: modal || null, prefillData: prefill || null } }),
  closeQuickAction: () =>
    set({ quickAction: { isOpen: false, activeModal: null, prefillData: null } }),

  // Notifications
  notifications: { unreadCount: 0, xpToast: null, achievementToast: null },
  setUnreadCount: (count) =>
    set((s) => ({ notifications: { ...s.notifications, unreadCount: count } })),
  showXpToast: (amount, activity) =>
    set((s) => ({ notifications: { ...s.notifications, xpToast: { amount, activity } } })),
  clearXpToast: () =>
    set((s) => ({ notifications: { ...s.notifications, xpToast: null } })),
  showAchievementToast: (title, xpReward) =>
    set((s) => ({ notifications: { ...s.notifications, achievementToast: { title, xpReward } } })),
  clearAchievementToast: () =>
    set((s) => ({ notifications: { ...s.notifications, achievementToast: null } })),

  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Mobile
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

  // Command Palette
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}))
