"use client"

import { useState, useRef, useCallback } from "react"
import { ImageIcon, Film, Link2, Paperclip, Send, X, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFeedStore, type FeedAttachment } from "@/stores/feed-store"
import { useAuthStore } from "@/stores/auth-store"
import { useDemoStore } from "@/stores/demo-data"
import { AttachmentCard } from "./attachment-card"

function generateId() {
  return `attach-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

interface LinkModalProps {
  onAdd: (url: string, title?: string) => void
  onClose: () => void
}

function LinkModal({ onAdd, onClose }: LinkModalProps) {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const isValid = url.startsWith("http://") || url.startsWith("https://")

  return (
    <div className="rounded-xl border border-white/[0.09] bg-[#0e1118] p-4 space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-zinc-300">Attach a link</p>
        <button onClick={onClose} className="h-6 w-6 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05] transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <input
        autoFocus
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[13px] text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
      />
      <input
        type="text"
        placeholder="Display title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[13px] text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
      />
      <button
        disabled={!isValid}
        onClick={() => { if (isValid) { onAdd(url, title || undefined); onClose() } }}
        className={cn(
          "w-full rounded-lg py-2 text-[13px] font-medium transition-all",
          isValid
            ? "bg-blue-600 hover:bg-blue-500 text-white"
            : "bg-white/[0.04] text-zinc-600 cursor-not-allowed"
        )}
      >
        Attach Link
      </button>
    </div>
  )
}

export function PostComposer() {
  const addPost = useFeedStore((s) => s.addPost)
  const currentUser = useAuthStore((s) => s.getCurrentUser())
  const profile = useDemoStore((s) => s.profile)

  const [expanded, setExpanded] = useState(false)
  const [content, setContent] = useState("")
  const [attachments, setAttachments] = useState<FeedAttachment[]>([])
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [posted, setPosted] = useState(false)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const authorName = currentUser?.fullName || profile.displayName || "You"
  const authorAvatar = profile.avatarUrl
  const authorInitials = authorName.slice(0, 2).toUpperCase()

  const hasContent = content.trim().length > 0 || attachments.length > 0

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  function handleImageFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        setAttachments((prev) => [
          ...prev,
          {
            id: generateId(),
            type: "image",
            url,
            name: file.name,
            mimeType: file.type,
            size: file.size,
          },
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  function handleVideoFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach((file) => {
      setAttachments((prev) => [
        ...prev,
        {
          id: generateId(),
          type: "video",
          url: "",
          name: file.name,
          mimeType: file.type,
          size: file.size,
        },
      ])
    })
  }

  function handleGenericFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach((file) => {
      setAttachments((prev) => [
        ...prev,
        {
          id: generateId(),
          type: "file",
          url: "",
          name: file.name,
          mimeType: file.type,
          size: file.size,
        },
      ])
    })
  }

  function handleAddLink(url: string, title?: string) {
    setAttachments((prev) => [
      ...prev,
      {
        id: generateId(),
        type: "link",
        url,
        name: title || url,
        linkTitle: title,
        linkDomain: extractDomain(url),
      },
    ])
  }

  async function handlePost() {
    if (!hasContent || isPosting) return
    setIsPosting(true)
    await new Promise((r) => setTimeout(r, 380)) // subtle feel

    addPost({
      authorId: currentUser?.id || "local-user",
      authorName,
      authorAvatar,
      authorTitle: profile.rankTitle || undefined,
      authorBrokerage: undefined,
      content: content.trim(),
      attachments,
    })

    setContent("")
    setAttachments([])
    setIsPosting(false)
    setPosted(true)
    setExpanded(false)
    setTimeout(() => setPosted(false), 2200)
  }

  const imageAttachments = attachments.filter((a) => a.type === "image")
  const otherAttachments = attachments.filter((a) => a.type !== "image")

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200",
        expanded
          ? "bg-[#0e1118] border-white/[0.09] shadow-xl shadow-black/30"
          : "bg-[#0e1118] border-white/[0.06] hover:border-white/[0.09]"
      )}
    >
      {/* Composer header */}
      <div className="flex items-start gap-3 p-4">
        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/25 to-indigo-600/10 ring-1 ring-white/[0.08] text-[13px] font-bold text-white">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="h-full w-full rounded-xl object-cover" />
          ) : (
            authorInitials
          )}
        </div>

        {/* Input area */}
        <div className="flex-1 min-w-0">
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[14px] text-zinc-600 hover:text-zinc-500 hover:bg-white/[0.05] hover:border-white/[0.08] transition-all"
            >
              What do you want to share today?
            </button>
          ) : (
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setExpanded(false)
              }}
              placeholder="What do you want to share today?"
              rows={3}
              className="w-full resize-none bg-transparent text-[14px] text-zinc-200 placeholder:text-zinc-600 outline-none leading-relaxed"
            />
          )}
        </div>
      </div>

      {/* Expanded: attachments + actions */}
      {expanded && (
        <>
          {/* Image grid */}
          {imageAttachments.length > 0 && (
            <div className={cn("px-4 pb-3 gap-2", imageAttachments.length === 1 ? "block" : "grid grid-cols-2")}>
              {imageAttachments.map((a) => (
                <AttachmentCard key={a.id} attachment={a} variant="composer" onRemove={() => removeAttachment(a.id)} />
              ))}
            </div>
          )}

          {/* Other attachments */}
          {otherAttachments.length > 0 && (
            <div className="px-4 pb-3 space-y-2">
              {otherAttachments.map((a) => (
                <AttachmentCard key={a.id} attachment={a} variant="composer" onRemove={() => removeAttachment(a.id)} />
              ))}
            </div>
          )}

          {/* Link modal */}
          {showLinkModal && (
            <div className="px-4 pb-3">
              <LinkModal onAdd={handleAddLink} onClose={() => setShowLinkModal(false)} />
            </div>
          )}

          {/* Action row */}
          <div className="flex items-center justify-between px-4 pb-4 pt-1 border-t border-white/[0.05]">
            <div className="flex items-center gap-0.5">
              <ActionButton
                icon={ImageIcon}
                label="Photo"
                onClick={() => imageInputRef.current?.click()}
                color="blue"
              />
              <ActionButton
                icon={Film}
                label="Video"
                onClick={() => videoInputRef.current?.click()}
                color="indigo"
              />
              <ActionButton
                icon={Link2}
                label="Link"
                onClick={() => setShowLinkModal((v) => !v)}
                color="blue"
                active={showLinkModal}
              />
              <ActionButton
                icon={Paperclip}
                label="File"
                onClick={() => fileInputRef.current?.click()}
                color="amber"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setExpanded(false); setContent(""); setAttachments([]) }}
                className="text-[12px] text-zinc-600 hover:text-zinc-400 transition-colors px-2 py-1"
              >
                Cancel
              </button>
              <button
                disabled={!hasContent || isPosting}
                onClick={handlePost}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold transition-all",
                  hasContent && !isPosting
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30"
                    : "bg-white/[0.05] text-zinc-600 cursor-not-allowed"
                )}
              >
                {isPosting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Post
              </button>
            </div>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleImageFiles(e.target.files)}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(e) => handleVideoFiles(e.target.files)}
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleGenericFiles(e.target.files)}
          />
        </>
      )}

      {/* Success flash */}
      {posted && (
        <div className="flex items-center gap-2 px-5 pb-4 text-[13px] text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Posted to feed
        </div>
      )}
    </div>
  )
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  color,
  active,
}: {
  icon: React.ElementType
  label: string
  onClick: () => void
  color: "blue" | "indigo" | "amber"
  active?: boolean
}) {
  const colorMap = {
    blue: active ? "text-blue-400 bg-blue-500/10" : "text-zinc-600 hover:text-blue-400 hover:bg-blue-500/08",
    indigo: "text-zinc-600 hover:text-indigo-400 hover:bg-indigo-500/08",
    amber: "text-zinc-600 hover:text-amber-400 hover:bg-amber-500/08",
  }
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-all",
        colorMap[color]
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
