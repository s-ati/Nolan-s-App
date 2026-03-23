"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { profileService } from "@/lib/profile/service"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const getCurrentUser = useAuthStore((s) => s.getCurrentUser)
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (!isAuthenticated) {
      router.replace("/auth")
      return
    }

    // Authenticated — check if onboarding profile is complete
    const user = getCurrentUser()
    if (user && !profileService.isOnboardingComplete(user.id)) {
      router.replace("/onboarding/profile")
      return
    }

    setReady(true)
  }, [mounted, isAuthenticated, getCurrentUser, router])

  if (!mounted || !isAuthenticated || !ready) return null

  return <>{children}</>
}
