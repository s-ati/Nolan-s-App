"use client"

import { TrendingUp, BookOpen } from "lucide-react"

const TRENDING_RESOURCES = [
  { title: "Mastering Objection Handling", tag: "Scripts" },
  { title: "Q1 Market Outlook 2025", tag: "Market" },
  { title: "Top Prospecting Strategies", tag: "Growth" },
]

export function FeedRightRail() {
  return (
    <div className="space-y-3">
      {/* Trending Resources */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0e1118] p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Trending Resources</span>
        </div>
        <div className="space-y-2">
          {TRENDING_RESOURCES.map((r) => (
            <div key={r.title} className="flex items-start gap-2 group cursor-pointer hover:bg-white/[0.02] -mx-2 px-2 py-1.5 rounded-lg transition-colors">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.04] mt-0.5">
                <BookOpen className="w-3 h-3 text-zinc-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-zinc-400 group-hover:text-zinc-300 leading-tight transition-colors">{r.title}</p>
                <span className="mt-0.5 inline-block text-[10px] text-blue-500/70 bg-blue-500/10 px-1.5 py-0.5 rounded-md font-medium">
                  {r.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Standards */}
      <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-700 mb-2">Community</p>
        <p className="text-[12px] text-zinc-600 leading-relaxed">
          Share insights, wins, and resources. Keep it professional and constructive.
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {["Be helpful", "Stay genuine", "Add value"].map((tag) => (
            <span key={tag} className="text-[10px] text-zinc-700 bg-white/[0.03] border border-white/[0.05] rounded-full px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
