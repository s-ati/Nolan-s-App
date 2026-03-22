'use client'

import { useDemoStore } from '@/stores/demo-data'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import {
  Phone,
  MessageSquare,
  Mail,
  Users,
  Home,
  FileText,
  Zap,
  Activity as ActivityIcon,
  StickyNote,
  ArrowRightLeft,
} from 'lucide-react'

const typeIcons: Record<string, React.ElementType> = {
  Call: Phone,
  Text: MessageSquare,
  Email: Mail,
  Meeting: Users,
  Showing: Home,
  'Open House': Home,
  'Contract Update': FileText,
  'Inspection Update': FileText,
  'Note Added': StickyNote,
  'Follow-up Completed': ArrowRightLeft,
  'Deal Stage Changed': ArrowRightLeft,
}

const typeColors: Record<string, string> = {
  Call: 'text-blue-400 bg-blue-500/10',
  Text: 'text-emerald-400 bg-emerald-500/10',
  Email: 'text-purple-400 bg-purple-500/10',
  Meeting: 'text-amber-400 bg-amber-500/10',
  Showing: 'text-cyan-400 bg-cyan-500/10',
  'Open House': 'text-cyan-400 bg-cyan-500/10',
  'Contract Update': 'text-orange-400 bg-orange-500/10',
  'Inspection Update': 'text-orange-400 bg-orange-500/10',
  'Note Added': 'text-zinc-400 bg-zinc-500/10',
  'Follow-up Completed': 'text-emerald-400 bg-emerald-500/10',
  'Deal Stage Changed': 'text-purple-400 bg-purple-500/10',
}

export default function RecentActivityFeed() {
  const activities = useDemoStore((s) => s.activities)
  const recent = activities.slice(0, 8)

  if (recent.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.05] bg-[#12141a] p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
            <ActivityIcon className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">Recent Activity</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ActivityIcon className="h-8 w-8 text-zinc-700" />
          <p className="mt-2.5 text-sm text-zinc-500">No activities logged yet.</p>
          <p className="text-xs text-zinc-600">Log calls, meetings, and emails to earn XP</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#12141a] p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
          <ActivityIcon className="h-3.5 w-3.5 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">Recent Activity</h3>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[13px] top-2 bottom-2 w-px bg-zinc-800/80" />

        <div className="space-y-0.5">
          {recent.map((activity) => {
            const Icon = typeIcons[activity.type] || ActivityIcon
            const colorClass = typeColors[activity.type] || 'text-zinc-400 bg-zinc-500/10'

            return (
              <div
                key={activity.id}
                className="relative flex items-start gap-3 py-2"
              >
                {/* Icon dot */}
                <div
                  className={cn(
                    'relative z-10 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full',
                    colorClass
                  )}
                >
                  <Icon className="h-3 w-3" />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-zinc-300">{activity.title}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-[11px] text-zinc-600">
                      {formatDistanceToNow(parseISO(activity.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {activity.xpAwarded > 0 && (
                      <span className="flex items-center gap-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                        <Zap className="h-2 w-2" />
                        {activity.xpAwarded}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
