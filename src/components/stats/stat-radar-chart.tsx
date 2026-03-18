"use client"

import { useMemo } from "react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts"
import { useDemoStore } from "@/stores/demo-data"

const STAT_SHORT_LABELS: Record<string, string> = {
  "Lead Generation": "Lead Gen",
  "Networking": "Networking",
  "Marketing": "Marketing",
  "Negotiation": "Negotiation",
  "Knowledge": "Knowledge",
  "Discipline": "Discipline",
}

export function StatRadarChart() {
  const statProgress = useDemoStore((s) => s.statProgress)

  const data = useMemo(() => {
    const statOrder = [
      "Lead Generation",
      "Networking",
      "Marketing",
      "Negotiation",
      "Knowledge",
      "Discipline",
    ]
    return statOrder.map((name) => {
      const stat = statProgress.find((s) => s.statName === name)
      return {
        stat: STAT_SHORT_LABELS[name] || name,
        value: stat?.statValue ?? 0,
        fullMark: 300,
      }
    })
  }, [statProgress])

  return (
    <div className="w-full h-[320px] sm:h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#1e2030" />
          <PolarAngleAxis
            dataKey="stat"
            tick={{ fill: "#71717a", fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 300]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Stats"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
