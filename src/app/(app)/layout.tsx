"use client"

import { useEffect } from "react"
import { useDemoStore } from "@/stores/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { QuickActionModal } from "@/components/shared/quick-action-modal"
import { CommandPalette } from "@/components/shared/command-palette"
import { XpToast } from "@/components/shared/xp-toast"
import { AchievementToast } from "@/components/shared/achievement-toast"

function DataInitializer() {
  const initialize = useDemoStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return null
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DataInitializer />
      <AppShell>{children}</AppShell>
      <QuickActionModal />
      <CommandPalette />
      <XpToast />
      <AchievementToast />
    </>
  )
}
