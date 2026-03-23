"use client"

import { Rss } from "lucide-react"

interface FeedEmptyStateProps {
  onCompose?: () => void
  filter?: string
}

export function FeedEmptyState({ filter }: FeedEmptyStateProps) {
  const isFiltered = filter && filter !== "all"

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Icon glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl scale-150" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/15 to-indigo-600/10 ring-1 ring-white/[0.08]">
          <Rss className="h-7 w-7 text-blue-400" />
        </div>
      </div>

      {isFiltered ? (
        <>
          <h3 className="text-[15px] font-semibold text-zinc-300 mb-1.5">
            No {filter} posts yet
          </h3>
          <p className="text-[13px] text-zinc-600 max-w-xs leading-relaxed">
            Posts with {filter === "media" ? "photos or videos" : "attached files"} will appear here.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-[15px] font-semibold text-zinc-300 mb-1.5">
            Your feed starts here
          </h3>
          <p className="text-[13px] text-zinc-600 max-w-xs leading-relaxed">
            Share a win, a lesson, or a resource with other agents. Be the first to post.
          </p>
        </>
      )}

      {/* Subtle grid decoration */}
      <div className="mt-8 flex items-center gap-2 opacity-40">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full bg-white/[0.08]"
            style={{ width: `${[24, 16, 32, 20, 14][i]}px` }}
          />
        ))}
      </div>
    </div>
  )
}
