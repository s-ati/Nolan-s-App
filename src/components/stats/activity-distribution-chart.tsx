"use client"

import { useMemo } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { useDemoStore } from "@/stores/demo-data"

const TYPE_COLORS: Record<string, string> = {
  Call: "#3b82f6",
  Text: "#8b5cf6",
  Email: "#06b6d4",
  Meeting: "#10b981",
  Showing: "#f59e0b",
  "Open House": "#ef4444",
  "Contract Update": "#ec4899",
  "Note Added": "#6366f1",
  "Follow-up Completed": "#14b8a6",
  "Deal Stage Changed": "#f97316",
  "Inspection Update": "#a855f7",
}

const FALLBACK_COLOR = "#71717a"

interface TooltipPayloadItem {
  name: string
  value: number
  payload: { name: string; value: number; fill: string }
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-[#12141a] border border-[#1e2030] rounded-lg px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-zinc-100">{item.name}</p>
      <p className="text-xs text-zinc-400">{item.value} activities</p>
    </div>
  )
}

export function ActivityDistributionChart() {
  const activities = useDemoStore((s) => s.activities)

  const data = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const a of activities) {
      counts[a.type] = (counts[a.type] || 0) + 1
    }
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [activities])

  if (data.length === 0) {
    return (
      <div className="bg-[#12141a] border border-[#1e2030] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-zinc-100 mb-4">
          Activity Distribution
        </h3>
        <div className="h-[240px] flex items-center justify-center text-zinc-500 text-sm">
          No activities yet
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#12141a] border border-[#1e2030] rounded-xl p-6">
      <h3 className="text-sm font-semibold text-zinc-100 mb-4">
        Activity Distribution
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={TYPE_COLORS[entry.name] || FALLBACK_COLOR}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className="text-xs text-zinc-400">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
