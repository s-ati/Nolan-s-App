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
  Activity as ActivityIcon,
  StickyNote,
  ArrowRightLeft,
  Zap,
} from 'lucide-react'

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  Call: { icon: Phone, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  Text: { icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  Email: { icon: Mail, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  Meeting: { icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  Showing: { icon: Home, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  'Open House': { icon: Home, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  'Contract Update': { icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  'Inspection Update': { icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  'Note Added': { icon: StickyNote, color: 'text-zinc-400', bg: 'bg-zinc-500/10' },
  'Follow-up Completed': { icon: ArrowRightLeft, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'Deal Stage Changed': { icon: ArrowRightLeft, color: 'text-purple-400', bg: 'bg-purple-500/10' },
}

export default function RecentActivityFeed() {
  const activities = useDemoStore((s) => s.activities)
  const recent = activities.slice(0, 8)

  if (recent.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10">
            <ActivityIcon className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Recent Activity</h3>
            <p className="text-[11px] text-zinc-600">Your logged interactions</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] mb-3">
            <ActivityIcon className="h-6 w-6 text-zinc-700" />
          </div>
          <p className="text-[13px] font-medium text-zinc-500">No activities logged yet</p>
          <p className="text-[11px] text-zinc-700 mt-0.5">Log calls, meetings, and emails to earn points</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10">
          <ActivityIcon className="h-4 w-4 text-blue-400" />
        </div>
        <div>
          <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Recent Activity</h3>
          <p className="text-[11px] text-zinc-600">Your logged interactions</p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[14px] top-3 bottom-3 w-px bg-white/[0.05]" />

        <div className="space-y-1">
          {recent.map((activity) => {
            const cfg = typeConfig[activity.type] || {
              icon: ActivityIcon,
              color: 'text-zinc-400',
              bg: 'bg-zinc-500/10',
            }
            const Icon = cfg.icon

            return (
              <div
                key={activity.id}
                className="relative flex items-start gap-3 py-2.5 pl-1"
              >
                {/* Icon */}
                <div
                  className={cn(
                    'relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                    cfg.bg
                  )}
                >
                  <Icon className={cn('h-3 w-3', cfg.color)} />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[13px] font-medium text-zinc-300 leading-tight">
                    {activity.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[11px] text-zinc-600">
                      {formatDistanceToNow(parseISO(activity.createdAt), { addSuffix: true })}
                    </span>
                    {activity.xpAwarded > 0 && (
                      <span className="flex items-center gap-0.5 rounded-md border border-blue-500/20 bg-blue-500/[0.08] px-1.5 py-0.5 text-[9px] font-bold text-blue-400">
                        <Zap className="h-1.5 w-1.5" />
                        +{activity.xpAwarded}
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
