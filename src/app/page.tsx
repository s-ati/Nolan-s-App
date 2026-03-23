"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import IntroScreen from "@/components/intro-screen"

const INTRO_KEY = "levels-has-seen-intro"

export default function RootPage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [showIntro, setShowIntro] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard")
      return
    }

    const hasSeenIntro = localStorage.getItem(INTRO_KEY) === "true"
    if (hasSeenIntro) {
      router.replace("/auth")
      return
    }

    setShowIntro(true)
  }, [isAuthenticated, router])

  if (!showIntro) return null

  return <IntroScreen />
}
