'use client'

import { useDemoStore } from '@/stores/demo-data'
import { calculateXpProgress } from '@/lib/game/xp-engine'
import { motion } from 'framer-motion'
import { Zap, TrendingUp } from 'lucide-react'

export default function LevelHeroCard() {
  const profile = useDemoStore((s) => s.profile)
  const { level, progressPercent, xpToNextLevel, currentLevelXp, nextLevelXp } =
    calculateXpProgress(profile.totalXp)

  return (
    <div className="relative overflow-hidden rounded-xl border border-blue-500/20 bg-[#12141a] p-6 shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)]">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative flex items-center gap-6">
        {/* Level badge */}
        <div className="flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-blue-600/10">
            <span className="text-4xl font-bold text-white">{level}</span>
          </div>
          <span className="mt-1.5 text-xs font-medium uppercase tracking-wider text-blue-400">
            Level
          </span>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">{profile.rankTitle}</h2>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-400">
            <Zap className="h-3.5 w-3.5 text-blue-400" />
            <span>
              {profile.totalXp.toLocaleString()} XP total
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>{profile.totalXp - currentLevelXp} / {nextLevelXp - currentLevelXp} XP</span>
              <span>{xpToNextLevel} XP to next level</span>
            </div>
            <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
