'use client'

import { useDemoStore } from '@/stores/demo-data'
import { format, subDays } from 'date-fns'
import { BarChart2 } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts'

interface DayData {
  day: string
  xp: number
  isToday: boolean
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
    <div className="rounded-xl border border-white/[0.07] bg-[#0e1118] px-3 py-2.5 shadow-xl">
      <p className="text-[11px] font-medium text-zinc-500 mb-1">{label}</p>
      <p className="text-[13px] font-bold text-zinc-100">{payload[0].value.toLocaleString()} pts</p>
    </div>
  )
}

export default function WeeklyActivityChart() {
  const activities = useDemoStore((s) => s.activities)

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const today = format(new Date(), 'EEE')

  const data: DayData[] = []
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayLabel = format(date, 'EEE')
    const xp = activities
      .filter((a) => a.createdAt.startsWith(dateStr))
      .reduce((sum, a) => sum + a.xpAwarded, 0)
    data.push({ day: dayLabel, xp, isToday: dateStr === todayStr })
  }

  const hasData = data.some((d) => d.xp > 0)
  const totalWeekXp = data.reduce((sum, d) => sum + d.xp, 0)
  const activeDays = data.filter((d) => d.xp > 0).length
  const avgDaily = activeDays > 0 ? Math.round(totalWeekXp / activeDays) : 0

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10">
            <BarChart2 className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 leading-tight">Weekly Activity</h3>
            <p className="text-[11px] text-zinc-600">Activity points this week</p>
          </div>
        </div>
        {hasData && (
          <div className="text-right">
            <p className="text-[15px] font-bold text-zinc-100">{totalWeekXp.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-600">~{avgDaily}/active day</p>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] mb-3">
            <BarChart2 className="h-6 w-6 text-zinc-700" />
          </div>
          <p className="text-[13px] font-medium text-zinc-500">No activity this week</p>
          <p className="text-[11px] text-zinc-700 mt-0.5">Start logging to see your performance trend</p>
        </div>
      ) : (
        <>
          {/* Day indicators */}
          <div className="mb-3 flex justify-between px-1">
            {data.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`h-1 w-1 rounded-full ${d.xp > 0 ? 'bg-blue-400' : 'bg-zinc-800'}`}
                />
              </div>
            ))}
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height={176}>
              <BarChart data={data} barSize={22} barGap={4} margin={{ top: 0, right: 0, bottom: 0, left: -16 }}>
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.04)"
                  strokeDasharray="0"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#374151', fontSize: 10 }}
                  width={32}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                />
                <Bar dataKey="xp" radius={[4, 4, 2, 2]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.isToday
                          ? '#3b82f6'
                          : entry.xp > 0
                          ? '#1e3a5f'
                          : '#111520'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
