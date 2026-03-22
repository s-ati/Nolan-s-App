"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Target,
  Users,
  CalendarDays,
  BarChart3,
  Trophy,
  Settings,
  Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/stores/app-store"
import { useDemoStore } from "@/stores/demo-data"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Goals", icon: Target, href: "/quests" },
  { label: "Pipeline", icon: Users, href: "/pipeline" },
  { label: "Planner", icon: CalendarDays, href: "/planner" },
  { label: "Stats", icon: BarChart3, href: "/stats" },
  { label: "Achievements", icon: Trophy, href: "/achievements" },
]

const bottomNavItems = [
  { label: "Settings", icon: Settings, href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const profile = useDemoStore((s) => s.profile)

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen border-r border-white/[0.06] transition-all duration-200 fixed top-0 left-0 z-30",
        "bg-[#0a0b0f]",
        collapsed ? "w-[64px]" : "w-[232px]"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-[56px] shrink-0 border-b border-white/[0.06]",
          collapsed ? "justify-center px-0" : "gap-2.5 px-5"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 ring-1 ring-blue-500/30">
          <Building2 className="h-4 w-4 text-blue-400" />
        </div>
        {!collapsed && (
          <span className="text-[15px] font-bold tracking-tight text-white">
            AgentLevel
          </span>
        )}
      </div>

      {/* Agent profile */}
      {!collapsed ? (
        <div className="px-4 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/10 ring-1 ring-blue-500/20 text-sm font-bold text-white">
              {profile.currentLevel}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-100">
                {profile.displayName}
              </p>
              <p className="truncate text-[11px] text-blue-400/80">
                {profile.rankTitle}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-3.5 border-b border-white/[0.06]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/10 ring-1 ring-blue-500/20 text-sm font-bold text-white">
            {profile.currentLevel}
          </div>
        </div>
      )}

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className={cn("space-y-0.5", collapsed ? "px-2" : "px-3")}>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-all duration-150",
                    collapsed
                      ? "h-10 w-10 justify-center"
                      : "gap-3 px-3 py-2.5",
                    isActive
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05]"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-[18px] w-[18px] shrink-0",
                      isActive ? "text-blue-400" : "text-zinc-500"
                    )}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {isActive && !collapsed && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom nav */}
      <div
        className={cn(
          "shrink-0 border-t border-white/[0.06] py-3",
          collapsed ? "px-2" : "px-3"
        )}
      >
        {bottomNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-all duration-150",
                collapsed
                  ? "h-10 w-10 justify-center"
                  : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05]"
              )}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  isActive ? "text-blue-400" : "text-zinc-500"
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
