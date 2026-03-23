// Feed store for Levels social feed
// Local-first with Zustand persist — ready to swap to real backend
// Swap: replace actions with API calls and remove persist middleware

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ---- Types ----

export type AttachmentType = 'image' | 'video' | 'link' | 'file'

export interface FeedAttachment {
  id: string
  type: AttachmentType
  url: string          // base64 data URL for images, object URL for video, raw URL for links, empty for files
  name: string
  mimeType?: string
  size?: number        // bytes
  thumbnailUrl?: string
  // Link-specific
  linkTitle?: string
  linkDomain?: string
}

export interface FeedComment {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string | null
  authorTitle?: string
  content: string
  createdAt: string
}

export interface FeedPost {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string | null
  authorTitle?: string
  authorBrokerage?: string
  content: string
  attachments: FeedAttachment[]
  likedBy: string[]      // array of user IDs
  comments: FeedComment[]
  createdAt: string
  updatedAt: string
}

export type FeedFilter = 'all' | 'connections' | 'media' | 'files'

interface FeedState {
  posts: FeedPost[]
  initialized: boolean

  // Actions
  initialize: (seedPosts?: FeedPost[]) => void
  addPost: (data: {
    authorId: string
    authorName: string
    authorAvatar: string | null
    authorTitle?: string
    authorBrokerage?: string
    content: string
    attachments: FeedAttachment[]
  }) => FeedPost
  deletePost: (postId: string) => void
  toggleLike: (postId: string, userId: string) => void
  addComment: (postId: string, data: {
    authorId: string
    authorName: string
    authorAvatar: string | null
    authorTitle?: string
    content: string
  }) => void
  deleteComment: (postId: string, commentId: string) => void
}

// ---- Store ----

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      posts: [],
      initialized: false,

      initialize: () => {
        if (get().initialized) return
        set({ initialized: true })
      },

      addPost: (data) => {
        const now = new Date().toISOString()
        const newPost: FeedPost = {
          id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          ...data,
          likedBy: [],
          comments: [],
          createdAt: now,
          updatedAt: now,
        }
        set((s) => ({ posts: [newPost, ...s.posts] }))
        return newPost
      },

      deletePost: (postId) => {
        set((s) => ({ posts: s.posts.filter((p) => p.id !== postId) }))
      },

      toggleLike: (postId, userId) => {
        set((s) => ({
          posts: s.posts.map((p) => {
            if (p.id !== postId) return p
            const liked = p.likedBy.includes(userId)
            return {
              ...p,
              likedBy: liked
                ? p.likedBy.filter((id) => id !== userId)
                : [...p.likedBy, userId],
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      addComment: (postId, data) => {
        const comment: FeedComment = {
          id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          ...data,
          createdAt: new Date().toISOString(),
        }
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: [...p.comments, comment],
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }))
      },

      deleteComment: (postId, commentId) => {
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: p.comments.filter((c) => c.id !== commentId),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }))
      },
    }),
    {
      name: 'levels-feed',
    }
  )
)
