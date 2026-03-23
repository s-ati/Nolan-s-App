"use client"

import { useState } from "react"
import { Heart, MessageCircle, MoreHorizontal, Send, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { useFeedStore, type FeedPost } from "@/stores/feed-store"
import { useAuthStore } from "@/stores/auth-store"
import { useDemoStore } from "@/stores/demo-data"
import { AttachmentCard } from "./attachment-card"

interface PostCardProps {
  post: FeedPost
}

export function PostCard({ post }: PostCardProps) {
  const toggleLike = useFeedStore((s) => s.toggleLike)
  const addComment = useFeedStore((s) => s.addComment)
  const deletePost = useFeedStore((s) => s.deletePost)
  const currentUser = useAuthStore((s) => s.getCurrentUser())
  const profile = useDemoStore((s) => s.profile)

  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  const userId = currentUser?.id || "local-user"
  const isOwn = post.authorId === userId
  const isLiked = post.likedBy.includes(userId)
  const likeCount = post.likedBy.length
  const commentCount = post.comments.length
  const initials = post.authorName.slice(0, 2).toUpperCase()

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

  function handleLike() {
    toggleLike(post.id, userId)
  }

  function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim()) return
    const authorName = currentUser?.fullName || profile.displayName || "You"
    addComment(post.id, {
      authorId: userId,
      authorName,
      authorAvatar: profile.avatarUrl,
      authorTitle: profile.rankTitle || undefined,
      content: commentText.trim(),
    })
    setCommentText("")
  }

  const imageAttachments = post.attachments.filter((a) => a.type === "image")
  const otherAttachments = post.attachments.filter((a) => a.type !== "image")

  return (
    <article className="rounded-2xl border border-white/[0.06] bg-[#0e1118] transition-all duration-150 hover:border-white/[0.09]">
      {/* Post header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {post.authorAvatar ? (
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/[0.08]"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/10 ring-1 ring-white/[0.08] text-[13px] font-bold text-white">
              {initials}
            </div>
          )}

          {/* Author info */}
          <div>
            <p className="text-[13px] font-semibold text-zinc-100 leading-tight">{post.authorName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {post.authorTitle && (
                <span className="text-[11px] text-zinc-500">{post.authorTitle}</span>
              )}
              {post.authorTitle && post.authorBrokerage && (
                <span className="text-zinc-700 text-[10px]">·</span>
              )}
              {post.authorBrokerage && (
                <span className="text-[11px] text-zinc-600">{post.authorBrokerage}</span>
              )}
              {(post.authorTitle || post.authorBrokerage) && (
                <span className="text-zinc-700 text-[10px]">·</span>
              )}
              <span className="text-[11px] text-zinc-600">{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Post menu (own posts) */}
        {isOwn && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05] transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 min-w-[140px] rounded-xl border border-white/[0.07] bg-[#131620] shadow-xl p-1">
                  <button
                    onClick={() => { deletePost(post.id); setMenuOpen(false) }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] text-red-400 hover:bg-red-500/[0.08] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete post
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Post content */}
      {post.content && (
        <div className="px-5 pb-4">
          <p className="text-[14px] text-zinc-300 leading-relaxed whitespace-pre-line">{post.content}</p>
        </div>
      )}

      {/* Image attachments */}
      {imageAttachments.length > 0 && (
        <div className={cn("px-5 pb-4 gap-2", imageAttachments.length === 1 ? "block" : "grid grid-cols-2")}>
          {imageAttachments.map((a) => (
            <AttachmentCard key={a.id} attachment={a} variant="post" />
          ))}
        </div>
      )}

      {/* Other attachments */}
      {otherAttachments.length > 0 && (
        <div className="px-5 pb-4 space-y-2">
          {otherAttachments.map((a) => (
            <AttachmentCard key={a.id} attachment={a} variant="post" />
          ))}
        </div>
      )}

      {/* Post footer */}
      <div className="flex items-center gap-1 px-5 py-3 border-t border-white/[0.04]">
        {/* Like */}
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-all",
            isLiked
              ? "text-rose-400 bg-rose-500/[0.08] hover:bg-rose-500/[0.12]"
              : "text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04]"
          )}
        >
          <Heart
            className={cn("w-3.5 h-3.5 transition-all", isLiked && "fill-rose-400")}
          />
          <span>{likeCount > 0 ? likeCount : ""}</span>
          <span className="hidden sm:inline">Like</span>
        </button>

        {/* Comment */}
        <button
          onClick={() => setShowComments((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-all",
            showComments
              ? "text-blue-400 bg-blue-500/[0.08]"
              : "text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04]"
          )}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{commentCount > 0 ? commentCount : ""}</span>
          <span className="hidden sm:inline">Comment</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-white/[0.04] px-5 pt-4 pb-5 space-y-4">
          {/* Existing comments */}
          {post.comments.length > 0 && (
            <div className="space-y-3">
              {post.comments.map((comment) => {
                const commentInitials = comment.authorName.slice(0, 2).toUpperCase()
                const isOwnComment = comment.authorId === userId
                return (
                  <div key={comment.id} className="flex items-start gap-2.5 group">
                    {comment.authorAvatar ? (
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="h-7 w-7 rounded-lg object-cover ring-1 ring-white/[0.06] shrink-0 mt-0.5"
                      />
                    ) : (
                      <div className="h-7 w-7 shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-600/10 ring-1 ring-white/[0.06] text-[10px] font-bold text-white mt-0.5">
                        {commentInitials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2">
                        <p className="text-[12px] font-semibold text-zinc-300 mb-0.5">{comment.authorName}</p>
                        <p className="text-[13px] text-zinc-400 leading-relaxed">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-[10px] text-zinc-700">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Add comment */}
          <form onSubmit={handleSubmitComment} className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-600/10 ring-1 ring-white/[0.06] text-[10px] font-bold text-white mt-0.5">
              {(currentUser?.fullName || profile.displayName || "YO").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 focus-within:border-blue-500/30 focus-within:bg-white/[0.04] transition-all">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment…"
                className="flex-1 bg-transparent text-[13px] text-zinc-300 placeholder:text-zinc-600 outline-none"
              />
              {commentText.trim() && (
                <button
                  type="submit"
                  className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  <Send className="w-3 h-3" />
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </article>
  )
}
