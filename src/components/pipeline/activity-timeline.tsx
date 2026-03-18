"use client"

import { formatDistanceToNow } from 'date-fns'
import {
  Phone,
  MessageSquare,
  Mail,
  Users,
  Home,
  Building2,
  ClipboardCheck,
  FileText,
  StickyNote,
  CheckCircle2,
  ArrowRightLeft,
  Zap,
} from 'lucide-react'
import type { Activity } from '@/stores/demo-data'
import { cn } from '@/lib/utils'

const TYPE_ICONS: Record<string, React.ElementType> = {
  Call: Phone,
  Text: MessageSquare,
  Email: Mail,
  Meeting: Users,
  Showing: Home,
  'Open House': Building2,
  'Inspection Update': ClipboardCheck,
  'Contract Update': FileText,
  'Note Added': StickyNote,
  'Follow-up Completed': CheckCircle2,
  'Deal Stage Changed': ArrowRightLeft,
}

const TYPE_COLORS: Record<string, string> = {
  Call: 'text-green-400 bg-green-400/10',
  Text: 'text-blue-400 bg-blue-400/10',
  Email: 'text-purple-400 bg-purple-400/10',
  Meeting: 'text-amber-400 bg-amber-400/10',
  Showing: 'text-cyan-400 bg-cyan-400/10',
  'Open House': 'text-orange-400 bg-orange-400/10',
  'Inspection Update': 'text-teal-400 bg-teal-400/10',
  'Contract Update': 'text-indigo-400 bg-indigo-400/10',
  'Note Added': 'text-zinc-400 bg-zinc-400/10',
  'Follow-up Completed': 'text-emerald-400 bg-emerald-400/10',
  'Deal Stage Changed': 'text-rose-400 bg-rose-400/10',
}

interface ActivityTimelineProps {
  activities: Activity[]
  maxItems?: number
}

export function ActivityTimeline({ activities, maxItems }: ActivityTimelineProps) {
  const items = maxItems ? activities.slice(0, maxItems) : activities

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
        <StickyNote className="h-8 w-8 mb-2" />
        <p className="text-sm">No activities yet</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-[#1e2030]" />

      <div className="space-y-1">
        {items.map((activity) => {
          const Icon = TYPE_ICONS[activity.type] || StickyNote
          const colorClass = TYPE_COLORS[activity.type] || 'text-zinc-400 bg-zinc-400/10'

          return (
            <div key={activity.id} className="relative flex items-start gap-3 py-3 pl-1">
              {/* Icon dot */}
              <div
                className={cn(
                  'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  colorClass
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {activity.title}
                  </p>
                  {activity.xpAwarded > 0 && (
                    <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-amber-400">
                      <Zap className="h-3 w-3" />+{activity.xpAwarded} XP
                    </span>
                  )}
                </div>
                {activity.notes && (
                  <p className="mt-0.5 text-xs text-zinc-500 line-clamp-2">
                    {activity.notes}
                  </p>
                )}
                <p className="mt-1 text-xs text-zinc-600">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
