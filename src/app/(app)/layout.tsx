"use client"

import { useEffect } from "react"
import { useDemoStore } from "@/stores/demo-data"
import { useAuthStore } from "@/stores/auth-store"
import { AuthGuard } from "@/components/auth/auth-guard"
import { AppShell } from "@/components/layout/app-shell"
import { QuickActionModal } from "@/components/shared/quick-action-modal"
import { CommandPalette } from "@/components/shared/command-palette"
import { XpToast } from "@/components/shared/xp-toast"
import { AchievementToast } from "@/components/shared/achievement-toast"

function DataInitializer() {
  const initialize = useDemoStore((s) => s.initialize)
  const updateProfile = useDemoStore((s) => s.updateProfile)
  const getCurrentUser = useAuthStore((s) => s.getCurrentUser)

  useEffect(() => {
    initialize()
    // Sync authenticated user's real name into the profile display
    const user = getCurrentUser()
    if (user) {
      updateProfile({ displayName: user.fullName })
    }
  }, [initialize, updateProfile, getCurrentUser])

  return null
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <DataInitializer />
      <AppShell>{children}</AppShell>
      <QuickActionModal />
      <CommandPalette />
      <XpToast />
      <AchievementToast />
    </AuthGuard>
  )
}
