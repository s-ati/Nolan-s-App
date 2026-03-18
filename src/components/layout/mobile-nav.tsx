"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Swords,
  Users,
  CalendarDays,
  MoreHorizontal,
  BarChart3,
  Trophy,
  Settings,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const mainItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Quests", icon: Swords, href: "/quests" },
  { label: "Pipeline", icon: Users, href: "/pipeline" },
  { label: "Planner", icon: CalendarDays, href: "/planner" },
]

const moreItems = [
  { label: "Stats", icon: BarChart3, href: "/stats" },
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
            className="absolute inset-0 bg-black/60"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute bottom-16 left-0 right-0 mx-4 mb-2 rounded-xl bg-[#12141a] border border-[#1e2030] p-2 shadow-xl">
            <div className="flex items-center justify-between px-3 py-2 mb-1">
              <span className="text-sm font-medium text-zinc-300">More</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-4 h-4" />
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
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Bottom navigation bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0e1015] border-t border-[#1e2030] safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {mainItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-lg transition-colors",
                  isActive ? "text-blue-400" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-blue-400" />
                  )}
                </div>
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </Link>
            )
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-lg transition-colors",
              isMoreActive || moreOpen
                ? "text-blue-400"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <div className="relative">
              <MoreHorizontal className="w-5 h-5" />
              {isMoreActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-blue-400" />
              )}
            </div>
            <span className="text-[10px] font-medium mt-1">More</span>
          </button>
        </div>
      </nav>
    </>
  )
}
