"use client"

import { cn } from "@/lib/utils"
import type { FeedFilter } from "@/stores/feed-store"

const FILTERS: { value: FeedFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "connections", label: "Connections" },
  { value: "media", label: "Media" },
  { value: "files", label: "Files" },
]

interface FeedFiltersProps {
  active: FeedFilter
  onChange: (filter: FeedFilter) => void
}

export function FeedFilters({ active, onChange }: FeedFiltersProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl border border-white/[0.06] bg-white/[0.02] w-fit">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={cn(
            "relative rounded-lg px-3.5 py-1.5 text-[12px] font-medium transition-all duration-150",
            active === f.value
              ? "bg-white/[0.08] text-zinc-100 shadow-sm"
              : "text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.03]"
          )}
        >
          {active === f.value && (
            <span className="absolute inset-0 rounded-lg ring-1 ring-white/[0.08]" />
          )}
          {f.label}
        </button>
      ))}
    </div>
  )
}
