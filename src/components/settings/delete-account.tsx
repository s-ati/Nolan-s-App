"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TriangleAlert, Trash2, Loader2 } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const CONFIRM_PHRASE = "DELETE"

export function DeleteAccount() {
  const router = useRouter()
  const deleteAccount = useAuthStore((s) => s.deleteAccount)
  const isLoading = useAuthStore((s) => s.isLoading)

  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [deleting, setDeleting] = useState(false)

  const confirmed = confirmText === CONFIRM_PHRASE

  async function handleDelete() {
    if (!confirmed || deleting) return
    setDeleting(true)
    await deleteAccount()
    // deleteAccount clears session; redirect to /auth
    router.replace("/auth")
  }

  function handleOpenChange(next: boolean) {
    if (!next) setConfirmText("")
    setOpen(next)
  }

  return (
    <div className="bg-[#12141a] border border-red-500/20 rounded-xl p-6">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
          <TriangleAlert className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Danger Zone</h2>
          <p className="text-xs text-zinc-500">Irreversible account actions</p>
        </div>
      </div>

      {/* Warning row */}
      <div className="flex items-start justify-between gap-4 rounded-lg border border-red-500/15 bg-red-500/5 px-4 py-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-200">Delete Account</p>
          <p className="mt-0.5 text-xs text-zinc-500 leading-relaxed">
            Deleting your account will permanently remove your profile, settings,
            and all progress stored in Levels. This action cannot be undone.
          </p>
        </div>

        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <button className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 hover:border-red-500/60 transition-colors">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </DialogTrigger>

          <DialogContent className="bg-[#12141a] border-[#1e2030] max-w-[420px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-zinc-100">
                <TriangleAlert className="h-5 w-5 text-red-400" />
                Delete Your Account?
              </DialogTitle>
              <DialogDescription className="text-zinc-400 leading-relaxed">
                This will permanently delete your account and remove all associated
                data including your profile, settings, tasks, quests, habits,
                streaks, pipeline, and stats. This action{" "}
                <span className="font-semibold text-zinc-300">cannot be undone</span>.
              </DialogDescription>
            </DialogHeader>

            {/* Confirmation input */}
            <div className="py-2">
              <p className="mb-2 text-[13px] text-zinc-400">
                Type{" "}
                <span className="font-mono font-bold text-red-400">{CONFIRM_PHRASE}</span>{" "}
                to confirm:
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={CONFIRM_PHRASE}
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-[14px] text-zinc-100 placeholder:text-zinc-700 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 font-mono"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                disabled={deleting}
                className="rounded-lg border border-[#1e2030] bg-[#1a1c28] px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!confirmed || deleting || isLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Yes, Delete My Account
                  </>
                )}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
