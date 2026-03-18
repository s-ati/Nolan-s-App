"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { format, subDays, isSameDay, parseISO } from "date-fns"
import { useDemoStore } from "@/stores/demo-data"

interface TooltipPayloadItem {
  value: number
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#12141a] border border-[#1e2030] rounded-lg px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-zinc-100">{label}</p>
      <p className="text-xs text-zinc-400">{payload[0].value} activities</p>
    </div>
  )
}

export function WeeklyActivityChart() {
  const activities = useDemoStore((s) => s.activities)

  const data = useMemo(() => {
    const today = new Date()
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i)
      return {
        date,
        label: format(date, "EEE"),
        fullLabel: format(date, "EEE, MMM d"),
        count: 0,
      }
    })

    for (const activity of activities) {
      const actDate = parseISO(activity.createdAt)
      for (const day of days) {
        if (isSameDay(actDate, day.date)) {
          day.count++
          break
        }
      }
    }

    return days.map((d) => ({
      name: d.label,
      fullName: d.fullLabel,
      activities: d.count,
    }))
  }, [activities])

  return (
    <div className="bg-[#12141a] border border-[#1e2030] rounded-xl p-6">
      <h3 className="text-sm font-semibold text-zinc-100 mb-4">
        Weekly Activity
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2030" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={{ stroke: "#1e2030" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(59,130,246,0.05)" }}
            />
            <Bar
              dataKey="activities"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
