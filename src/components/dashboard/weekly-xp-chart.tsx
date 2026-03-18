'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format, subDays } from 'date-fns'
import { TrendingUp } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
    <div className="rounded-lg border border-[#1e2030] bg-[#1a1c24] px-3 py-2 shadow-lg">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="text-sm font-semibold text-blue-400">{payload[0].value} XP</p>
    </div>
  )
}

export default function WeeklyXpChart() {
  const activities = useDemoStore((s) => s.activities)

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

  return (
    <div className="rounded-xl border border-[#1e2030] bg-[#12141a] p-5">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          Weekly XP
        </h3>
      </div>

      {!hasData ? (
        <div className="mt-6 flex flex-col items-center justify-center py-4 text-center">
          <TrendingUp className="h-8 w-8 text-zinc-600" />
          <p className="mt-2 text-sm text-zinc-500">No XP data this week.</p>
        </div>
      ) : (
        <div className="mt-3 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 11 }}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }}
                activeDot={{ fill: '#60a5fa', r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
