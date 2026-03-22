"use client"

import { usePathname } from "next/navigation"
import { Menu, Plus, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/stores/app-store"
import { useDemoStore } from "@/stores/demo-data"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/quests": "Quests",
  "/pipeline": "Pipeline",
  "/planner": "Planner",
  "/stats": "Stats",
  "/achievements": "Achievements",
  "/settings": "Settings",
}

function getPageTitle(pathname: string): string {
  for (const [path, title] of Object.entries(pageTitles)) {
    if (pathname === path || pathname.startsWith(path + "/")) {
      return title
    }
  }
  return "Leveled"
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

  return (
    <header className="flex items-center justify-between h-14 px-4 bg-[#0e1015]/80 backdrop-blur-sm border-b border-[#1e2030] shrink-0 sticky top-0 z-20">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
          aria-label="Toggle mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center w-9 h-9 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-semibold text-zinc-100">{pageTitle}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Quick Action */}
        <button
          onClick={() => openQuickAction()}
          className="flex items-center justify-center w-9 h-9 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
          aria-label="Quick action"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* User avatar / level */}
        <div className="flex items-center gap-2 ml-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold ring-1 ring-blue-500/30">
            {profile.currentLevel}
          </div>
        </div>
      </div>
    </header>
  )
}
