'use client'

import { useState } from 'react'
import { useDemoStore } from '@/stores/demo-data'
import { HABIT_ACTIONS } from '@/lib/game/xp-engine'
import {
  Phone, CheckCircle2, UserPlus, MessageSquare,
  Users, Home, XCircle, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  phone: Phone,
  'check-circle-2': CheckCircle2,
  'user-plus': UserPlus,
  'message-square': MessageSquare,
  users: Users,
  home: Home,
  'x-circle': XCircle,
}

const COLOR_MAP: Record<string, { icon: string; bg: string; hover: string; ring: string; glow: string }> = {
  blue:    { icon: 'text-blue-400',    bg: 'bg-blue-500/10',    hover: 'hover:bg-blue-500/20',    ring: 'ring-blue-500/30',    glow: 'shadow-blue-500/20' },
  amber:   { icon: 'text-amber-400',   bg: 'bg-amber-500/10',   hover: 'hover:bg-amber-500/20',   ring: 'ring-amber-500/30',   glow: 'shadow-amber-500/20' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', hover: 'hover:bg-emerald-500/20', ring: 'ring-emerald-500/30', glow: 'shadow-emerald-500/20' },
  purple:  { icon: 'text-purple-400',  bg: 'bg-purple-500/10',  hover: 'hover:bg-purple-500/20',  ring: 'ring-purple-500/30',  glow: 'shadow-purple-500/20' },
  cyan:    { icon: 'text-cyan-400',    bg: 'bg-cyan-500/10',    hover: 'hover:bg-cyan-500/20',    ring: 'ring-cyan-500/30',    glow: 'shadow-cyan-500/20' },
  indigo:  { icon: 'text-indigo-400',  bg: 'bg-indigo-500/10',  hover: 'hover:bg-indigo-500/20',  ring: 'ring-indigo-500/30',  glow: 'shadow-indigo-500/20' },
  red:     { icon: 'text-red-400',     bg: 'bg-red-500/10',     hover: 'hover:bg-red-500/20',     ring: 'ring-red-500/30',     glow: 'shadow-red-500/20' },
}

// Only the positive habits on the dashboard (negative one is intentional UX friction)
const DISPLAY_HABITS = HABIT_ACTIONS.filter((h) => h.positive)

export default function HabitQuickLog() {
  const logHabit = useDemoStore((s) => s.logHabit)
  const [xpPopups, setXpPopups] = useState<{ id: number; key: string; xp: number }[]>([])
  const [tapCounts, setTapCounts] = useState<Record<string, number>>({})

  function handleTap(habitKey: string, xp: number) {
    logHabit(habitKey)
    const id = Date.now()
    setXpPopups((prev) => [...prev, { id, key: habitKey, xp }])
    setTapCounts((prev) => ({ ...prev, [habitKey]: (prev[habitKey] ?? 0) + 1 }))
    setTimeout(() => setXpPopups((prev) => prev.filter((p) => p.id !== id)), 900)
  }

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10">
            <Zap className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Quick Log</h3>
            <p className="text-[11px] text-zinc-600 mt-0.5">Tap to log an action instantly</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {DISPLAY_HABITS.map((habit) => {
          const Icon = ICON_MAP[habit.icon] || Zap
          const colors = COLOR_MAP[habit.color] ?? COLOR_MAP.blue
          const count = tapCounts[habit.key] ?? 0

          return (
            <div key={habit.key} className="relative">
              {/* XP pop animation */}
              <AnimatePresence>
                {xpPopups
                  .filter((p) => p.key === habit.key)
                  .map((popup) => (
                    <motion.div
                      key={popup.id}
                      className={cn('absolute -top-5 left-1/2 -translate-x-1/2 z-10 text-[11px] font-bold pointer-events-none', colors.icon)}
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -20 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                      +{popup.xp}
                    </motion.div>
                  ))}
              </AnimatePresence>

              <button
                onClick={() => handleTap(habit.key, habit.xp)}
                className={cn(
                  'group relative w-full flex flex-col items-center gap-2 rounded-xl border border-white/[0.04] px-2 py-3.5 transition-all active:scale-95',
                  'hover:border-white/[0.08]',
                  colors.hover
                )}
              >
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg transition-all', colors.bg)}>
                  <Icon className={cn('h-4 w-4', colors.icon)} />
                </div>
                <span className="text-[10px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors leading-tight text-center">
                  {habit.label}
                </span>
                {count > 0 && (
                  <span className={cn('absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] font-bold px-1', colors.bg, colors.icon)}>
                    {count}
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between">
        <p className="text-[10px] text-zinc-700">Logged today</p>
        <p className="text-[10px] font-semibold text-zinc-500">
          {Object.values(tapCounts).reduce((a, b) => a + b, 0)} actions
        </p>
      </div>
    </div>
  )
}
