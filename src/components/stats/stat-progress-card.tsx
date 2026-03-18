"use client"

import {
  Target,
  Users,
  Megaphone,
  Scale,
  BookOpen,
  Shield,
  type LucideIcon,
} from "lucide-react"
import { calculateStatProgress } from "@/lib/game/xp-engine"
import { cn } from "@/lib/utils"

const STAT_ICONS: Record<string, LucideIcon> = {
  "Lead Generation": Target,
  "Networking": Users,
  "Marketing": Megaphone,
  "Negotiation": Scale,
  "Knowledge": BookOpen,
  "Discipline": Shield,
}

interface StatProgressCardProps {
  statName: string
  statValue: number
  level: number
}

export function StatProgressCard({
  statName,
  statValue,
  level,
}: StatProgressCardProps) {
  const Icon = STAT_ICONS[statName] || Target
  const progress = calculateStatProgress(statValue)

  return (
    <div className="bg-[#12141a] border border-[#1e2030] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
            <Icon className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-100">{statName}</p>
            <p className="text-xs text-zinc-500">{statValue} total points</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-zinc-500">Lvl</span>
          <span className="text-lg font-bold text-blue-400">{level}</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Progress to Lvl {level + 1}</span>
          <span>{progress}/100</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#1e2030]">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              "bg-gradient-to-r from-blue-600 to-blue-400"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
