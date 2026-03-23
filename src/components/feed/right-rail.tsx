"use client"

import { Users, TrendingUp, BookOpen, ArrowRight } from "lucide-react"

const SUGGESTED_CONNECTIONS = [
  { name: "Alex Rivera", title: "Listing Specialist", brokerage: "Century 21" },
  { name: "Samantha Cole", title: "Buyer's Agent", brokerage: "Coldwell Banker" },
  { name: "Derek Park", title: "Team Lead", brokerage: "Berkshire Hathaway" },
]

const TRENDING_RESOURCES = [
  { title: "Mastering Objection Handling", tag: "Scripts" },
  { title: "Q1 Market Outlook 2025", tag: "Market" },
  { title: "Top Prospecting Strategies", tag: "Growth" },
]

function RailSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0e1118] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{title}</span>
      </div>
      {children}
    </div>
  )
}

export function FeedRightRail() {
  return (
    <div className="space-y-3">
      {/* Suggested Connections */}
      <RailSection icon={Users} title="Suggested Connections">
        <div className="space-y-2.5">
          {SUGGESTED_CONNECTIONS.map((person) => (
            <div key={person.name} className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-600/10 ring-1 ring-white/[0.07] text-[11px] font-bold text-white">
                {person.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-zinc-300 leading-tight truncate">{person.name}</p>
                <p className="text-[10px] text-zinc-600 truncate">{person.title} · {person.brokerage}</p>
              </div>
              <button className="text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                Connect
              </button>
            </div>
          ))}
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/[0.06] py-1.5 text-[11px] text-zinc-600 hover:text-zinc-400 hover:border-white/[0.09] transition-all">
          View all
          <ArrowRight className="w-3 h-3" />
        </button>
      </RailSection>

      {/* Trending Resources */}
      <RailSection icon={TrendingUp} title="Trending Resources">
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
      </RailSection>

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
