"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"

/**
 * AuthGuard — wraps all protected (app) routes.
 *
 * Renders nothing until the auth store has rehydrated from localStorage,
 * then either renders children (authenticated) or redirects to /auth.
 *
 * To swap to server-side auth: replace this component's logic with a
 * server-side session check (e.g. Supabase `getUser()`, NextAuth `getSession()`).
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const hasHydrated = useAuthStore((s) => s.hasHydrated)

  useEffect(() => {
    if (!hasHydrated) return
    if (!isAuthenticated) {
      router.replace("/auth")
    }
  }, [isAuthenticated, hasHydrated, router])

  // Don't render protected content until hydrated + authenticated
  if (!hasHydrated || !isAuthenticated) return null

  return <>{children}</>
}
