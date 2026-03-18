"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"
import {
  Lock,
  Phone,
  PhoneOutgoing,
  Flame,
  CheckCircle2,
  UserCheck,
  FileSignature,
  Trophy,
  Zap,
  CalendarCheck,
  Activity,
  Users,
  Briefcase,
  Home,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Achievement } from "@/stores/demo-data"

const ICON_MAP: Record<string, LucideIcon> = {
  phone: Phone,
  "phone-outgoing": PhoneOutgoing,
  flame: Flame,
  "check-circle": CheckCircle2,
  "user-check": UserCheck,
  "file-signature": FileSignature,
  trophy: Trophy,
  zap: Zap,
  "calendar-check": CalendarCheck,
  activity: Activity,
  users: Users,
  briefcase: Briefcase,
  home: Home,
  sparkles: Sparkles,
}

const CATEGORY_COLORS: Record<string, string> = {
  Prospecting: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "Follow-up": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Discipline: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  Deals: "bg-green-500/15 text-green-400 border-green-500/20",
  Learning: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  Consistency: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Milestones: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
}

interface AchievementCardProps {
  achievement: Achievement
  isUnlocked: boolean
  unlockedAt?: string
  progressValue?: number
}

export function AchievementCard({
  achievement,
  isUnlocked,
  unlockedAt,
  progressValue,
}: AchievementCardProps) {
  const Icon = ICON_MAP[achievement.icon] || Trophy
  const categoryStyle =
    CATEGORY_COLORS[achievement.category] || CATEGORY_COLORS.Milestones

  const progressTarget = useMemo(() => {
    const count = achievement.ruleConfig?.count
    return typeof count === "number" ? count : null
  }, [achievement.ruleConfig])

  const progressPercent = useMemo(() => {
    if (!progressTarget || !progressValue) return 0
    return Math.min((progressValue / progressTarget) * 100, 100)
  }, [progressTarget, progressValue])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative bg-[#12141a] border rounded-xl p-5 transition-all duration-300",
        isUnlocked
          ? "border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
          : "border-[#1e2030] opacity-60 grayscale"
      )}
    >
      {/* Lock overlay for locked achievements */}
      {!isUnlocked && (
        <div className="absolute top-3 right-3">
          <Lock className="h-4 w-4 text-zinc-600" />
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
            isUnlocked ? "bg-blue-500/15" : "bg-zinc-800"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              isUnlocked ? "text-blue-400" : "text-zinc-600"
            )}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-zinc-100 truncate">
            {achievement.title}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
            {achievement.description}
          </p>

          {/* Category + XP row */}
          <div className="flex items-center gap-2 mt-2.5">
            <span
              className={cn(
                "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium",
                categoryStyle
              )}
            >
              {achievement.category}
            </span>
            <span className="text-[10px] font-medium text-yellow-500/80 flex items-center gap-0.5">
              <Zap className="h-3 w-3" />+{achievement.xpReward} XP
            </span>
          </div>

          {/* Progress bar (for trackable achievements) */}
          {!isUnlocked && progressTarget && progressValue !== undefined && (
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Progress</span>
                <span>
                  {progressValue}/{progressTarget}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1e2030]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Unlocked date */}
          {isUnlocked && unlockedAt && (
            <p className="text-[10px] text-zinc-600 mt-2">
              Earned {format(parseISO(unlockedAt), "MMM d, yyyy")}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
