"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Swords,
  Users,
  CalendarDays,
  BarChart3,
  Trophy,
  Settings,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/stores/app-store"
import { useDemoStore } from "@/stores/demo-data"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Quests", icon: Swords, href: "/quests" },
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
        "hidden lg:flex flex-col h-screen bg-[#0e1015] border-r border-[#1e2030] transition-all duration-200 fixed top-0 left-0 z-30",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 h-14 px-4 border-b border-[#1e2030] shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10">
          <Zap className="w-5 h-5 text-blue-400" />
        </div>
        {!collapsed && (
          <span className="text-base font-bold text-zinc-100 tracking-tight">
            Leveled
          </span>
        )}
      </div>

      {/* Level badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-[#1e2030]">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold ring-1 ring-blue-500/30">
              {profile.currentLevel}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">
                {profile.displayName}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                {profile.rankTitle}
              </p>
            </div>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="flex justify-center py-3 border-b border-[#1e2030]">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold ring-1 ring-blue-500/30">
            {profile.currentLevel}
          </div>
        </div>
      )}

      {/* Main nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-500"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border-l-2 border-transparent"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom nav (Settings) */}
      <div className="py-2 px-2 border-t border-[#1e2030] shrink-0">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-500"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border-l-2 border-transparent"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
