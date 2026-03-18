'use client'

import { useState } from 'react'
import { useDemoStore } from '@/stores/demo-data'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { Bell, Check, Trophy, Swords, AlertTriangle, User, X } from 'lucide-react'

const typeIcons: Record<string, React.ElementType> = {
  quest: Swords,
  achievement: Trophy,
  followup: User,
  overdue: AlertTriangle,
}

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useDemoStore()

  if (!open) return null

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-[#161820] border border-[#1e2030] rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2030]">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-zinc-400" />
            <span className="text-sm font-medium text-white">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllNotificationsRead} className="text-[10px] text-blue-400 hover:text-blue-300">
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="text-zinc-500 hover:text-white">
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 && (
            <p className="px-4 py-8 text-sm text-zinc-500 text-center">No notifications</p>
          )}
          {notifications.map((n) => {
            const Icon = typeIcons[n.type] || Bell
            return (
              <button
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={cn(
                  'w-full flex items-start gap-3 px-4 py-3 text-left border-b border-[#1e2030] last:border-0 hover:bg-white/5 transition-colors',
                  !n.isRead && 'bg-blue-500/5'
                )}
              >
                <div className={cn(
                  'mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                  n.type === 'achievement' ? 'bg-amber-500/10' : n.type === 'overdue' ? 'bg-red-500/10' : 'bg-blue-500/10'
                )}>
                  <Icon size={14} className={
                    n.type === 'achievement' ? 'text-amber-400' : n.type === 'overdue' ? 'text-red-400' : 'text-blue-400'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', n.isRead ? 'text-zinc-400' : 'text-white')}>{n.title}</p>
                  {n.body && <p className="text-xs text-zinc-500 mt-0.5">{n.body}</p>}
                  <p className="text-[10px] text-zinc-600 mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!n.isRead && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
