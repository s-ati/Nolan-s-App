'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format, subDays } from 'date-fns'
import { TrendingUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface DayData {
  day: string
  xp: number
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#1a1c24] px-3 py-2 shadow-xl">
      <p className="text-[11px] font-medium text-zinc-500">{label}</p>
      <p className="text-sm font-bold text-blue-400">{payload[0].value} XP</p>
    </div>
  )
}

export default function WeeklyXpChart() {
  const activities = useDemoStore((s) => s.activities)

  const today = format(new Date(), 'EEE')

  const data: DayData[] = []
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayLabel = format(date, 'EEE')
    const xp = activities
      .filter((a) => a.createdAt.startsWith(dateStr))
      .reduce((sum, a) => sum + a.xpAwarded, 0)
    data.push({ day: dayLabel, xp })
  }

  const hasData = data.some((d) => d.xp > 0)
  const totalWeekXp = data.reduce((sum, d) => sum + d.xp, 0)
  const avgDaily = data.length > 0 ? Math.round(totalWeekXp / data.length) : 0

  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#12141a] p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
            <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">Weekly Performance</h3>
        </div>
        {hasData && (
          <div className="text-right">
            <p className="text-xs font-bold text-blue-400">{totalWeekXp.toLocaleString()} XP</p>
            <p className="text-[10px] text-zinc-600">~{avgDaily}/day avg</p>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
          <TrendingUp className="h-8 w-8 text-zinc-700" />
          <p className="mt-2.5 text-sm text-zinc-500">No activity this week.</p>
          <p className="text-xs text-zinc-600">Start logging to see your performance trend</p>
        </div>
      ) : (
        <div className="mt-4 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={24} barGap={4}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#52525b', fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#52525b', fontSize: 10 }}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.day === today ? '#3b82f6' : '#1e2a3a'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
