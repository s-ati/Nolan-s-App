'use client'

import { useMemo, useState } from 'react'
import { useDemoStore } from '@/stores/demo-data'
import { useAppStore } from '@/stores/app-store'
import { HABIT_ACTIONS } from '@/lib/game/xp-engine'
import {
  Phone, CheckCircle2, UserPlus, MessageSquare,
  Users, Home, XCircle, Zap, TrendingDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  phone: Phone,
  'check-circle-2': CheckCircle2,
  'user-plus': UserPlus,
  'message-square': MessageSquare,
  users: Users,
  home: Home,
  'x-circle': XCircle,
}

const COLOR_MAP: Record<string, { icon: string; bg: string; hover: string; border: string; activeBg: string; activeBorder: string }> = {
  blue:    { icon: 'text-blue-400',    bg: 'bg-blue-500/10',    hover: 'hover:bg-blue-500/15',    border: 'border-blue-500/20',    activeBg: 'bg-blue-500/20',    activeBorder: 'border-blue-400/40' },
  amber:   { icon: 'text-amber-400',   bg: 'bg-amber-500/10',   hover: 'hover:bg-amber-500/15',   border: 'border-amber-500/20',   activeBg: 'bg-amber-500/20',   activeBorder: 'border-amber-400/40' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', hover: 'hover:bg-emerald-500/15', border: 'border-emerald-500/20', activeBg: 'bg-emerald-500/20', activeBorder: 'border-emerald-400/40' },
  purple:  { icon: 'text-purple-400',  bg: 'bg-purple-500/10',  hover: 'hover:bg-purple-500/15',  border: 'border-purple-500/20',  activeBg: 'bg-purple-500/20',  activeBorder: 'border-purple-400/40' },
  cyan:    { icon: 'text-cyan-400',    bg: 'bg-cyan-500/10',    hover: 'hover:bg-cyan-500/15',    border: 'border-cyan-500/20',    activeBg: 'bg-cyan-500/20',    activeBorder: 'border-cyan-400/40' },
  indigo:  { icon: 'text-indigo-400',  bg: 'bg-indigo-500/10',  hover: 'hover:bg-indigo-500/15',  border: 'border-indigo-500/20',  activeBg: 'bg-indigo-500/20',  activeBorder: 'border-indigo-400/40' },
  red:     { icon: 'text-red-400',     bg: 'bg-red-500/10',     hover: 'hover:bg-red-500/15',     border: 'border-red-500/20',     activeBg: 'bg-red-500/20',     activeBorder: 'border-red-400/40' },
}

const POSITIVE_HABITS = HABIT_ACTIONS.filter((h) => h.positive)
const NEGATIVE_HABITS = HABIT_ACTIONS.filter((h) => !h.positive)

export default function HabitQuickLog() {
  const logHabit = useDemoStore((s) => s.logHabit)
  const habitLogs = useDemoStore((s) => s.habitLogs)
  const showXpToast = useAppStore((s) => s.showXpToast)

  // XP pop animations — local transient state only
  const [xpPopups, setXpPopups] = useState<{ id: number; key: string; xp: number }[]>([])

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  // Derive today's counts from persisted store — survives refresh
  const todayCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    habitLogs.forEach((log) => {
      if (log.createdAt.startsWith(todayStr)) {
        counts[log.habitKey] = (counts[log.habitKey] ?? 0) + 1
      }
    })
    return counts
  }, [habitLogs, todayStr])

  const todayXpFromHabits = useMemo(() => {
    return habitLogs
      .filter((l) => l.createdAt.startsWith(todayStr) && l.positive)
      .reduce((sum, l) => sum + l.xpAwarded, 0)
  }, [habitLogs, todayStr])

  const totalActionsToday = useMemo(() => {
    return habitLogs.filter((l) => l.createdAt.startsWith(todayStr)).length
  }, [habitLogs, todayStr])

  function handleTap(habitKey: string, xp: number, label: string) {
    logHabit(habitKey)
    const id = Date.now()
    setXpPopups((prev) => [...prev, { id, key: habitKey, xp }])
    setTimeout(() => setXpPopups((prev) => prev.filter((p) => p.id !== id)), 900)
    if (xp > 0) showXpToast(xp, label)
    else if (xp < 0) showXpToast(xp, label)
  }

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10">
            <Zap className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Quick Log</h3>
            <p className="text-[11px] text-zinc-600 mt-0.5">Tap any action to earn XP instantly</p>
          </div>
        </div>
        {todayXpFromHabits > 0 && (
          <div className="flex items-center gap-1 rounded-lg bg-blue-500/10 px-2.5 py-1 border border-blue-500/20">
            <Zap className="h-3 w-3 text-blue-400" />
            <span className="text-[11px] font-bold text-blue-400">+{todayXpFromHabits} today</span>
          </div>
        )}
      </div>

      {/* Positive actions grid */}
      <div className="grid grid-cols-3 gap-2">
        {POSITIVE_HABITS.map((habit) => {
          const Icon = ICON_MAP[habit.icon] || Zap
          const colors = COLOR_MAP[habit.color] ?? COLOR_MAP.blue
          const count = todayCounts[habit.key] ?? 0
          const hasActivity = count > 0

          return (
            <div key={habit.key} className="relative">
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
                onClick={() => handleTap(habit.key, habit.xp, habit.label)}
                className={cn(
                  'group relative w-full flex flex-col items-center gap-2 rounded-xl border px-2 py-3.5 transition-all active:scale-95',
                  hasActivity
                    ? cn(colors.activeBg, colors.activeBorder)
                    : cn('border-white/[0.04]', colors.hover, 'hover:border-white/[0.08]')
                )}
              >
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg transition-all', colors.bg)}>
                  <Icon className={cn('h-4 w-4', colors.icon)} />
                </div>
                <span className={cn('text-[10px] font-medium leading-tight text-center transition-colors', hasActivity ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-300')}>
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

      {/* Separator + negative habit */}
      <div className="mt-3 pt-3 border-t border-white/[0.04]">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {NEGATIVE_HABITS.map((habit) => {
              const Icon = ICON_MAP[habit.icon] || XCircle
              const count = todayCounts[habit.key] ?? 0

              return (
                <div key={habit.key} className="relative">
                  <AnimatePresence>
                    {xpPopups
                      .filter((p) => p.key === habit.key)
                      .map((popup) => (
                        <motion.div
                          key={popup.id}
                          className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 text-[11px] font-bold pointer-events-none text-red-400"
                          initial={{ opacity: 1, y: 0 }}
                          animate={{ opacity: 0, y: -20 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                          {popup.xp}
                        </motion.div>
                      ))}
                  </AnimatePresence>
                  <button
                    onClick={() => handleTap(habit.key, habit.xp, habit.label)}
                    className="group flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.05] px-3 py-1.5 transition-all hover:bg-red-500/10 active:scale-95"
                  >
                    <TrendingDown className="h-3 w-3 text-red-400/70" />
                    <span className="text-[10px] font-medium text-red-400/70 group-hover:text-red-400 transition-colors">
                      {habit.label}
                    </span>
                    {count > 0 && (
                      <span className="flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500/20 text-[8px] font-bold text-red-400 px-1">
                        {count}
                      </span>
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="text-right">
            <p className="text-[10px] text-zinc-700">Actions today</p>
            <p className="text-[12px] font-semibold text-zinc-400">{totalActionsToday}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
