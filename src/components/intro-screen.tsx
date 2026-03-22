"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Building2, ArrowRight } from "lucide-react"

const INTRO_KEY = "levels-has-seen-intro"

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
  }
}

export default function IntroScreen() {
  const router = useRouter()

  function markSeenAndGo(path: string) {
    localStorage.setItem(INTRO_KEY, "true")
    router.push(path)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#080a0e] px-6 text-center">
      {/* Subtle dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial blue glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[700px] w-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Card glow ring behind content */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[420px] w-[420px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex max-w-md flex-col items-center gap-7">
        {/* Logo badge */}
        <motion.div
          {...fadeUp(0.05)}
          className="flex items-center gap-2.5 rounded-xl bg-white/[0.04] px-4 py-2 ring-1 ring-white/[0.08]"
        >
          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-lg bg-blue-500/20 ring-1 ring-blue-500/25">
            <Building2 className="h-3 w-3 text-blue-400" />
          </div>
          <span className="text-[13px] font-semibold tracking-wide text-zinc-300">
            Levels
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div {...fadeUp(0.15)} className="space-y-3">
          <h1 className="text-[72px] font-bold leading-none tracking-tight text-white md:text-[88px]">
            Levels
          </h1>
          <p className="text-[18px] font-medium text-zinc-400">
            Turn daily actions into real momentum.
          </p>
        </motion.div>

        {/* Supporting text */}
        <motion.p
          {...fadeUp(0.25)}
          className="max-w-[360px] text-[15px] leading-relaxed text-zinc-500"
        >
          Track your work, stay consistent, and grow faster with a system designed for daily performance.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.35)}
          className="flex w-full max-w-[280px] flex-col items-center gap-3.5"
        >
          <button
            onClick={() => markSeenAndGo("/auth?tab=signup")}
            className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-[15px] font-semibold text-white shadow-[0_0_0_1px_rgba(59,130,246,0.3)] transition-all duration-150 hover:bg-blue-500 hover:shadow-[0_0_28px_rgba(59,130,246,0.35)]"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => markSeenAndGo("/auth?tab=login")}
            className="text-[13px] text-zinc-600 transition-colors hover:text-zinc-400"
          >
            Already have an account?{" "}
            <span className="font-medium text-zinc-500 hover:text-zinc-300">
              Log In
            </span>
          </button>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080a0e] to-transparent" />
    </div>
  )
}
