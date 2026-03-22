"use client"

import { usePathname } from "next/navigation"
import { Menu, Plus, Bell, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/stores/app-store"
import { useDemoStore } from "@/stores/demo-data"
import { calculateXpProgress } from "@/lib/game/xp-engine"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/quests": "Goals",
  "/pipeline": "Pipeline",
  "/planner": "Planner",
  "/stats": "Performance",
  "/achievements": "Achievements",
  "/settings": "Settings",
}

function getPageTitle(pathname: string): string {
  for (const [path, title] of Object.entries(pageTitles)) {
    if (pathname === path || pathname.startsWith(path + "/")) {
      return title
    }
  }
  return "AgentLevel"
}

export function Topbar() {
  const pathname = usePathname()
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen)
  const mobileNavOpen = useAppStore((s) => s.mobileNavOpen)
  const openQuickAction = useAppStore((s) => s.openQuickAction)
  const profile = useDemoStore((s) => s.profile)
  const notifications = useDemoStore((s) => s.notifications)

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const pageTitle = getPageTitle(pathname)

  const { level, progressPercent } = calculateXpProgress(profile.totalXp)

  return (
    <header className="flex items-center justify-between h-[56px] px-4 bg-[#0a0b0f]/90 backdrop-blur-md border-b border-white/[0.06] shrink-0 sticky top-0 z-20">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
          aria-label="Toggle mobile navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        <h1 className="text-[15px] font-semibold text-zinc-100">{pageTitle}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {/* XP level pill – desktop only */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/15 text-[10px] font-bold text-blue-400">
            {level}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-20 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <Zap className="h-3 w-3 text-blue-400" />
          </div>
        </div>

        {/* Quick Action */}
        <button
          onClick={() => openQuickAction()}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
          aria-label="Quick action"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-[16px] px-0.5 rounded-full bg-blue-500 text-white text-[9px] font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-600/10 ring-1 ring-blue-500/20 text-xs font-bold text-white ml-0.5">
          {level}
        </div>
      </div>
    </header>
  )
}
