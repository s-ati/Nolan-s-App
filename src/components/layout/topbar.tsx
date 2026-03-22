"use client"

import { usePathname } from "next/navigation"
import { Menu, Plus, Bell, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/stores/app-store"
import { useDemoStore } from "@/stores/demo-data"
import { calculateXpProgress } from "@/lib/game/xp-engine"
import { format } from "date-fns"

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
  const todayLabel = format(new Date(), "EEE, MMM d")

  return (
    <header className="flex items-center justify-between h-[58px] px-4 lg:px-5 bg-[#080a0e]/95 backdrop-blur-md border-b border-white/[0.05] shrink-0 sticky top-0 z-20">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05] transition-colors"
          aria-label="Toggle mobile navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05] transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-[15px] h-[15px]" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-[14px] font-semibold text-zinc-100 tracking-tight">{pageTitle}</h1>
          <span className="hidden md:block text-zinc-700">·</span>
          <span className="hidden md:block text-[12px] text-zinc-600">{todayLabel}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {/* XP / Level pill – desktop only */}
        <div className="hidden md:flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-1.5">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-blue-400/70" />
            <span className="text-[11px] font-bold text-zinc-300">Lv {level}</span>
          </div>
          <div className="h-3.5 w-px bg-white/[0.08]" />
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-[72px] overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <button
          onClick={() => openQuickAction()}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
          aria-label="Quick action"
        >
          <Plus className="w-[15px] h-[15px]" />
        </button>

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-[15px] h-[15px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[14px] h-[14px] px-0.5 rounded-full bg-blue-500 text-white text-[8px] font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/[0.1] ml-0.5"
          />
        ) : (
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/25 to-indigo-600/10 ring-1 ring-white/[0.08] text-[11px] font-bold text-white ml-0.5">
            {profile.displayName?.slice(0, 2).toUpperCase() || "AG"}
          </div>
        )}
      </div>
    </header>
  )
}
