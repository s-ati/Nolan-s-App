"use client"

import { FileText, Link2, Film, ImageIcon, X, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FeedAttachment } from "@/stores/feed-store"

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(mimeType?: string) {
  if (!mimeType) return FileText
  if (mimeType.startsWith("image/")) return ImageIcon
  if (mimeType.startsWith("video/")) return Film
  if (mimeType.includes("pdf")) return FileText
  return FileText
}

interface AttachmentCardProps {
  attachment: FeedAttachment
  onRemove?: () => void // only in composer
  variant?: "composer" | "post"
}

export function AttachmentCard({
  attachment,
  onRemove,
  variant = "post",
}: AttachmentCardProps) {
  const isComposer = variant === "composer"

  if (attachment.type === "image") {
    return (
      <div className="relative group rounded-xl overflow-hidden border border-white/[0.07]">
        <img
          src={attachment.url}
          alt={attachment.name}
          className="w-full max-h-72 object-cover"
        />
        {isComposer && onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    )
  }

  if (attachment.type === "video") {
    return (
      <div className={cn(
        "relative group flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors",
        "bg-white/[0.03] border-white/[0.07]",
        !isComposer && "hover:bg-white/[0.04]"
      )}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20">
          <Film className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-zinc-200">{attachment.name}</p>
          {attachment.size && (
            <p className="text-[11px] text-zinc-600 mt-0.5">{formatBytes(attachment.size)}</p>
          )}
        </div>
        {isComposer && onRemove && (
          <button
            onClick={onRemove}
            className="h-6 w-6 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    )
  }

  if (attachment.type === "link") {
    return (
      <a
        href={!isComposer ? attachment.url : undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors",
          "bg-white/[0.03] border-white/[0.07]",
          !isComposer && "hover:bg-white/[0.05] cursor-pointer group"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
          <Link2 className="w-4 h-4 text-blue-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-zinc-200">
            {attachment.linkTitle || attachment.name}
          </p>
          {attachment.linkDomain && (
            <p className="text-[11px] text-zinc-600 mt-0.5">{attachment.linkDomain}</p>
          )}
        </div>
        {!isComposer && (
          <ExternalLink className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 shrink-0 transition-colors" />
        )}
        {isComposer && onRemove && (
          <button
            onClick={(e) => { e.preventDefault(); onRemove() }}
            className="h-6 w-6 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </a>
    )
  }

  // file
  const Icon = getFileIcon(attachment.mimeType)
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors",
      "bg-white/[0.03] border-white/[0.07]",
      !isComposer && "hover:bg-white/[0.04]"
    )}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
        <Icon className="w-4 h-4 text-amber-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-zinc-200">{attachment.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {attachment.mimeType && (
            <span className="text-[11px] text-zinc-600 uppercase">{attachment.mimeType.split("/")[1]}</span>
          )}
          {attachment.mimeType && attachment.size && <span className="text-zinc-700 text-[10px]">·</span>}
          {attachment.size && (
            <span className="text-[11px] text-zinc-600">{formatBytes(attachment.size)}</span>
          )}
        </div>
      </div>
      {isComposer && onRemove && (
        <button
          onClick={onRemove}
          className="h-6 w-6 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
