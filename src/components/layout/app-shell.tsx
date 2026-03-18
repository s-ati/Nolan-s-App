"use client"

import { useAppStore } from "@/stores/app-store"
import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { MobileNav } from "./mobile-nav"

export function AppShell({ children }: { children: React.ReactNode }) {
  const collapsed = useAppStore((s) => s.sidebarCollapsed)

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0b0f]">
      {/* Sidebar (desktop only) */}
      <Sidebar />

      {/* Main area */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-200",
          "lg:ml-60",
          collapsed && "lg:ml-16"
        )}
      >
        <Topbar />

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>

      {/* Mobile nav (mobile only) */}
      <MobileNav />
    </div>
  )
}
