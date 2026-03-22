"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Target,
  Users,
  CalendarDays,
  BarChart3,
  Trophy,
  Settings,
  Building2,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/stores/app-store"
import { useDemoStore } from "@/stores/demo-data"
import { useAuthStore } from "@/stores/auth-store"

const workspaceNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Goals", icon: Target, href: "/quests" },
  { label: "Pipeline", icon: Users, href: "/pipeline" },
  { label: "Planner", icon: CalendarDays, href: "/planner" },
]

const analyticsNav = [
  { label: "Performance", icon: BarChart3, href: "/stats" },
  { label: "Achievements", icon: Trophy, href: "/achievements" },
]

const bottomNavItems = [
  { label: "Settings", icon: Settings, href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const profile = useDemoStore((s) => s.profile)
  const logout = useAuthStore((s) => s.logout)

  async function handleLogout() {
    await logout()
    router.push("/auth")
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/")
  }

  function NavItem({ item }: { item: { label: string; icon: React.ElementType; href: string } }) {
    const active = isActive(item.href)
    const Icon = item.icon
    return (
      <li>
        <Link
          href={item.href}
          title={collapsed ? item.label : undefined}
          className={cn(
            "relative flex items-center rounded-xl text-[13px] font-medium transition-all duration-150",
            collapsed ? "h-10 w-10 justify-center" : "gap-3 px-3 py-2.5",
            active
              ? "bg-white/[0.07] text-white"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
          )}
        >
          {/* Left accent bar for active state */}
          {active && !collapsed && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-blue-400" />
          )}
          <Icon
            className={cn(
              "h-[17px] w-[17px] shrink-0",
              active ? "text-blue-400" : "text-zinc-500"
            )}
          />
          {!collapsed && (
            <span className="truncate">{item.label}</span>
          )}
          {active && !collapsed && (
            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400/60" />
          )}
        </Link>
      </li>
    )
  }

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen border-r transition-all duration-200 fixed top-0 left-0 z-30",
        "bg-[#080a0e] border-white/[0.05]",
        collapsed ? "w-[64px]" : "w-[248px]"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-[58px] shrink-0 border-b border-white/[0.05]",
          collapsed ? "justify-center px-0" : "gap-2.5 px-5"
        )}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 ring-1 ring-blue-500/25">
          <Building2 className="h-3.5 w-3.5 text-blue-400" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-[15px] font-bold tracking-tight text-white">
              Levels
            </span>
          </div>
        )}
      </div>

      {/* Agent profile */}
      {!collapsed ? (
        <div className="px-4 py-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="h-9 w-9 shrink-0 rounded-xl object-cover ring-1 ring-white/[0.1]"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/25 to-indigo-600/10 ring-1 ring-white/[0.08] text-sm font-bold text-white">
                {profile.displayName?.slice(0, 2).toUpperCase() || "AG"}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-zinc-100 leading-tight">
                {profile.displayName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-semibold text-blue-400/80 leading-none">
                  {profile.rankTitle}
                </span>
                <span className="text-zinc-700">·</span>
                <span className="text-[10px] text-zinc-600 leading-none">
                  Lv {profile.currentLevel}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-3.5 border-b border-white/[0.05]">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/[0.1]"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/25 to-indigo-600/10 ring-1 ring-white/[0.08] text-sm font-bold text-white">
              {profile.displayName?.slice(0, 2).toUpperCase() || "AG"}
            </div>
          )}
        </div>
      )}

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {/* Workspace section */}
        {!collapsed && (
          <p className="section-label px-5 mb-1.5">Workspace</p>
        )}
        <ul className={cn("space-y-0.5 mb-4", collapsed ? "px-2" : "px-3")}>
          {workspaceNav.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </ul>

        {/* Analytics section */}
        {!collapsed && (
          <p className="section-label px-5 mb-1.5">Analytics</p>
        )}
        <ul className={cn("space-y-0.5", collapsed ? "px-2" : "px-3")}>
          {analyticsNav.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </ul>
      </nav>

      {/* Bottom nav */}
      <div
        className={cn(
          "shrink-0 border-t border-white/[0.05] py-3",
          collapsed ? "px-2" : "px-3"
        )}
      >
        {bottomNavItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "relative flex items-center rounded-xl text-[13px] font-medium transition-all duration-150",
                collapsed ? "h-10 w-10 justify-center" : "gap-3 px-3 py-2.5",
                active
                  ? "bg-white/[0.07] text-white"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
              )}
            >
              <Icon
                className={cn(
                  "h-[17px] w-[17px] shrink-0",
                  active ? "text-blue-400" : "text-zinc-500"
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}

        {/* Log Out */}
        <button
          onClick={handleLogout}
          title={collapsed ? "Log Out" : undefined}
          className={cn(
            "mt-0.5 flex w-full items-center rounded-xl text-[13px] font-medium transition-all duration-150 text-zinc-600 hover:text-red-400 hover:bg-red-500/[0.06]",
            collapsed ? "h-10 w-10 justify-center" : "gap-3 px-3 py-2.5"
          )}
        >
          <LogOut className="h-[17px] w-[17px] shrink-0" />
          {!collapsed && <span className="truncate">Log Out</span>}
        </button>
      </div>
    </aside>
  )
}
