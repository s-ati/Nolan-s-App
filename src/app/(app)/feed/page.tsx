"use client"

import { useEffect, useState } from "react"
import { useFeedStore, type FeedFilter, type FeedPost } from "@/stores/feed-store"
import { PostComposer } from "@/components/feed/post-composer"
import { PostCard } from "@/components/feed/post-card"
import { FeedFilters } from "@/components/feed/feed-filters"
import { FeedEmptyState } from "@/components/feed/feed-empty-state"
import { FeedRightRail } from "@/components/feed/right-rail"

function filterPosts(posts: FeedPost[], filter: FeedFilter): FeedPost[] {
  switch (filter) {
    case "media":
      return posts.filter((p) =>
        p.attachments.some((a) => a.type === "image" || a.type === "video")
      )
    case "files":
      return posts.filter((p) =>
        p.attachments.some((a) => a.type === "file")
      )
    case "connections":
      // Placeholder: in MVP shows all posts (connections filter for future social graph)
      return posts
    default:
      return posts
  }
}

export default function FeedPage() {
  const posts = useFeedStore((s) => s.posts)
  const initialized = useFeedStore((s) => s.initialized)
  const initialize = useFeedStore((s) => s.initialize)

  const [activeFilter, setActiveFilter] = useState<FeedFilter>("all")

  useEffect(() => {
    initialize()
  }, [initialize])

  const visiblePosts = filterPosts(posts, activeFilter)

  return (
    <div className="space-y-6 pb-16">
      {/* Page header */}
      <div>
        <h1 className="text-[22px] font-bold text-zinc-100 tracking-tight">Feed</h1>
        <p className="mt-1 text-[13px] text-zinc-500">
          See what agents are sharing, learning, and building.
        </p>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
        {/* Left: feed content */}
        <div className="min-w-0 space-y-4">
          {/* Composer */}
          <PostComposer />

          {/* Filters */}
          <FeedFilters active={activeFilter} onChange={setActiveFilter} />

          {/* Posts */}
          {visiblePosts.length === 0 ? (
            <FeedEmptyState filter={activeFilter} />
          ) : (
            <div className="space-y-3">
              {visiblePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Right: support rail */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <FeedRightRail />
          </div>
        </div>
      </div>
    </div>
  )
}
