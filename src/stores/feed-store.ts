// Feed store for Levels social feed
// Local-first with Zustand persist — ready to swap to real backend
// Swap: replace actions with API calls and remove persist middleware

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format, subHours, subDays, subMinutes } from 'date-fns'

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

// ---- Seed data ----

function makeSeedPosts(): FeedPost[] {
  const now = new Date()
  return [
    {
      id: 'seed-1',
      authorId: 'seed-user-1',
      authorName: 'Jordan Mercer',
      authorAvatar: null,
      authorTitle: 'Senior Agent',
      authorBrokerage: 'Keller Williams Realty',
      content:
        'Just closed my 3rd deal this month! The pipeline system has been a game changer for staying on top of every lead. Consistency beats everything. 🏆',
      attachments: [],
      likedBy: ['seed-user-2', 'seed-user-3'],
      comments: [
        {
          id: 'comment-1',
          authorId: 'seed-user-2',
          authorName: 'Priya Nair',
          authorAvatar: null,
          authorTitle: "Buyer's Specialist",
          content: "Huge congrats Jordan! What was your closing strategy?",
          createdAt: format(subHours(now, 3), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        },
      ],
      createdAt: format(subHours(now, 5), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      updatedAt: format(subHours(now, 5), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    },
    {
      id: 'seed-2',
      authorId: 'seed-user-2',
      authorName: 'Priya Nair',
      authorAvatar: null,
      authorTitle: "Buyer's Specialist",
      authorBrokerage: 'Compass',
      content:
        "Hot take: The agents winning right now are the ones treating their follow-up process like a system, not a feeling. CRMs exist for a reason. How many of you have a real follow-up cadence locked in?",
      attachments: [],
      likedBy: ['seed-user-1', 'seed-user-3', 'seed-user-4'],
      comments: [],
      createdAt: format(subHours(now, 12), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      updatedAt: format(subHours(now, 12), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    },
    {
      id: 'seed-3',
      authorId: 'seed-user-3',
      authorName: 'Marcus Webb',
      authorAvatar: null,
      authorTitle: 'Team Lead',
      authorBrokerage: 'RE/MAX Elite',
      content:
        'Sharing a resource I put together on objection handling for price reductions. Took me years to refine these scripts. Drop a comment if you want the full PDF.',
      attachments: [
        {
          id: 'attach-1',
          type: 'file',
          url: '',
          name: 'Price-Reduction-Scripts-2024.pdf',
          mimeType: 'application/pdf',
          size: 248320,
        },
      ],
      likedBy: ['seed-user-1', 'seed-user-2'],
      comments: [
        {
          id: 'comment-2',
          authorId: 'seed-user-1',
          authorName: 'Jordan Mercer',
          authorAvatar: null,
          authorTitle: 'Senior Agent',
          content: 'This is gold, Marcus. Would love the full version.',
          createdAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        },
      ],
      createdAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      updatedAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    },
    {
      id: 'seed-4',
      authorId: 'seed-user-4',
      authorName: 'Taylor Brooks',
      authorAvatar: null,
      authorTitle: 'Listing Specialist',
      authorBrokerage: 'eXp Realty',
      content:
        "Market update: Inventory in my area is finally loosening up. Seeing 15–20% more active listings vs. this time last year. Good news for buyers who've been sitting on the sidelines. \n\nAnyone else noticing similar trends in their markets?",
      attachments: [
        {
          id: 'attach-2',
          type: 'link',
          url: 'https://www.nar.realtor/research-and-statistics',
          name: 'NAR Housing Statistics',
          linkTitle: 'NAR Research & Statistics',
          linkDomain: 'nar.realtor',
        },
      ],
      likedBy: ['seed-user-2'],
      comments: [],
      createdAt: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      updatedAt: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    },
  ]
}

// ---- Store ----

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      posts: [],
      initialized: false,

      initialize: () => {
        if (get().initialized) return
        set({ posts: makeSeedPosts(), initialized: true })
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
