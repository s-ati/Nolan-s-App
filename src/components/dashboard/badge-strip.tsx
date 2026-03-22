'use client'

import { useMemo } from 'react'
import { useDemoStore } from '@/stores/demo-data'
import {
  Phone, PhoneOutgoing, Flame, CheckCircle2, UserCheck,
  FileSignature, Trophy, Zap, CalendarCheck, Activity,
  Users, Briefcase, Home, Sparkles, Lock, type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'

const ICON_MAP: Record<string, LucideIcon> = {
  phone: Phone,
  'phone-outgoing': PhoneOutgoing,
  flame: Flame,
  'check-circle': CheckCircle2,
  'user-check': UserCheck,
  'file-signature': FileSignature,
  trophy: Trophy,
  zap: Zap,
  'calendar-check': CalendarCheck,
  activity: Activity,
  users: Users,
  briefcase: Briefcase,
  home: Home,
  sparkles: Sparkles,
}

const CATEGORY_COLORS: Record<string, { icon: string; glow: string; ring: string; bg: string }> = {
  Prospecting:  { icon: 'text-blue-400',   glow: 'shadow-blue-500/40',   ring: 'ring-blue-500/40',   bg: 'bg-blue-500/20' },
  'Follow-up':  { icon: 'text-amber-400',  glow: 'shadow-amber-500/40',  ring: 'ring-amber-500/40',  bg: 'bg-amber-500/20' },
  Discipline:   { icon: 'text-orange-400', glow: 'shadow-orange-500/40', ring: 'ring-orange-500/40', bg: 'bg-orange-500/20' },
  Deals:        { icon: 'text-emerald-400',glow: 'shadow-emerald-500/40',ring: 'ring-emerald-500/40',bg: 'bg-emerald-500/20' },
  Learning:     { icon: 'text-cyan-400',   glow: 'shadow-cyan-500/40',   ring: 'ring-cyan-500/40',   bg: 'bg-cyan-500/20' },
  Consistency:  { icon: 'text-purple-400', glow: 'shadow-purple-500/40', ring: 'ring-purple-500/40', bg: 'bg-purple-500/20' },
  Milestones:   { icon: 'text-yellow-400', glow: 'shadow-yellow-500/40', ring: 'ring-yellow-500/40', bg: 'bg-yellow-500/20' },
}

// Shield SVG path (viewBox 0 0 40 48)
function ShieldBadge({
  icon: iconKey,
  category,
  title,
  earned,
}: {
  icon: string
  category: string
  title: string
  earned: boolean
}) {
  const Icon = ICON_MAP[iconKey] || Trophy
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Milestones

  return (
    <div className="group relative flex flex-col items-center gap-1.5" title={title}>
      {/* Shield shape */}
      <div
        className={[
          'relative flex h-10 w-9 items-center justify-center transition-all duration-300',
          earned
            ? `ring-1 ${colors.ring} shadow-md ${colors.glow} ${colors.bg}`
            : 'bg-white/[0.03] ring-1 ring-white/[0.06]',
        ].join(' ')}
        style={{
          clipPath: 'polygon(50% 0%, 100% 18%, 100% 70%, 50% 100%, 0% 70%, 0% 18%)',
        }}
      >
        {earned ? (
          <Icon className={`h-4 w-4 ${colors.icon}`} />
        ) : (
          <Lock className="h-3 w-3 text-zinc-700" />
        )}
      </div>

      {/* Earned indicator dot */}
      {earned && (
        <div className={`h-1 w-1 rounded-full ${colors.bg.replace('/20', '/80')}`} />
      )}
    </div>
  )
}

export default function BadgeStrip() {
  const achievements = useDemoStore((s) => s.achievements)
  const userAchievements = useDemoStore((s) => s.userAchievements)

  const MAX_SHOWN = 5

  // Get the most recently earned badge IDs
  const earnedIds = useMemo(() => {
    return new Set(userAchievements.map((ua) => ua.achievementId))
  }, [userAchievements])

  // Sort: earned first (by unlock date desc), then locked
  const displayBadges = useMemo(() => {
    const earnedMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua.unlockedAt]))
    const earned = achievements
      .filter((a) => earnedIds.has(a.id))
      .sort((a, b) => {
        const aDate = earnedMap.get(a.id) ?? ''
        const bDate = earnedMap.get(b.id) ?? ''
        return bDate.localeCompare(aDate)
      })
    const locked = achievements.filter((a) => !earnedIds.has(a.id))
    return [...earned, ...locked].slice(0, MAX_SHOWN)
  }, [achievements, userAchievements, earnedIds])

  const earnedCount = userAchievements.length
  const totalCount = achievements.length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium tracking-widest uppercase text-zinc-600">
          Badges
        </span>
        <Link
          href="/achievements"
          className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          {earnedCount}/{totalCount} →
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {displayBadges.map((ach) => (
          <ShieldBadge
            key={ach.id}
            icon={ach.icon}
            category={ach.category}
            title={ach.title}
            earned={earnedIds.has(ach.id)}
          />
        ))}
      </div>
    </div>
  )
}
