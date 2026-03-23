"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Target,
  Users,
  CalendarDays,
  MoreHorizontal,
  BarChart3,
  Trophy,
  Settings,
  Rss,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const mainItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Goals", icon: Target, href: "/quests" },
  { label: "Pipeline", icon: Users, href: "/pipeline" },
  { label: "Planner", icon: CalendarDays, href: "/planner" },
]

const moreItems = [
  { label: "Feed", icon: Rss, href: "/feed" },
  { label: "Performance", icon: BarChart3, href: "/stats" },
  { label: "Achievements", icon: Trophy, href: "/achievements" },
  { label: "Settings", icon: Settings, href: "/settings" },
]

export function MobileNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  const isMoreActive = moreItems.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  )

  return (
    <>
      {/* More menu overlay */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute bottom-[72px] left-0 right-0 mx-4 mb-2 rounded-2xl bg-[#0e1118] border border-white/[0.07] p-2 shadow-2xl">
            <div className="flex items-center justify-between px-3 py-2 mb-1">
              <span className="text-[13px] font-semibold text-zinc-300">More</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {moreItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Bottom navigation bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#080a0e]/95 backdrop-blur-md border-t border-white/[0.05]">
        <div className="flex items-center justify-around h-[60px] px-2">
          {mainItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-16 py-1 rounded-xl transition-colors",
                  isActive ? "text-blue-400" : "text-zinc-600 hover:text-zinc-400"
                )}
              >
                <item.icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                <span className="text-[9px] font-medium leading-none">{item.label}</span>
                {isActive && (
                  <div className="h-0.5 w-3 rounded-full bg-blue-400 -mt-0.5" />
                )}
              </Link>
            )
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-16 py-1 rounded-xl transition-colors",
              isMoreActive || moreOpen
                ? "text-blue-400"
                : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            <MoreHorizontal style={{ width: 18, height: 18 }} />
            <span className="text-[9px] font-medium leading-none">More</span>
            {(isMoreActive || moreOpen) && (
              <div className="h-0.5 w-3 rounded-full bg-blue-400 -mt-0.5" />
            )}
          </button>
        </div>
      </nav>
    </>
  )
}
