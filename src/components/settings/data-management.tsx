"use client"

import { useState } from "react"
import {
  Database,
  RotateCcw,
  Download,
  Upload,
  Bot,
  AlertTriangle,
} from "lucide-react"
import { useDemoStore } from "@/stores/demo-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function DataManagement() {
  const resetData = useDemoStore((s) => s.resetData)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)

  const handleReset = () => {
    resetData()
    setResetComplete(true)
    setTimeout(() => {
      setResetComplete(false)
      setDialogOpen(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Data Management */}
      <div className="bg-[#12141a] border border-[#1e2030] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
            <Database className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">
              Data Management
            </h2>
            <p className="text-xs text-zinc-500">
              Manage your demo data and imports
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Reset Demo Data */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-200">Reset Demo Data</p>
              <p className="text-xs text-zinc-500">
                Restore all data to its original demo state
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors">
                  <RotateCcw className="h-4 w-4" />
                  Reset Data
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#12141a] border-[#1e2030]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-zinc-100">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    Reset All Data?
                  </DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    This will reset all contacts, deals, activities, quests,
                    streaks, achievements, and your profile back to the default
                    demo data. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <button
                    onClick={() => setDialogOpen(false)}
                    className="rounded-lg border border-[#1e2030] bg-[#1a1c28] px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={resetComplete}
                    className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-500 transition-colors disabled:opacity-60"
                  >
                    {resetComplete ? "Data Reset!" : "Yes, Reset Everything"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Export Data */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-200">Export Data</p>
              <p className="text-xs text-zinc-500">
                Download your data as a file
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    disabled
                    className="inline-flex items-center gap-2 rounded-lg border border-[#1e2030] bg-[#1a1c28] px-3 py-2 text-sm font-medium text-zinc-500 cursor-not-allowed opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="left"
                  className="bg-[#1a1c28] border-[#1e2030] text-zinc-300"
                >
                  Coming soon
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Import Data */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-200">Import Data</p>
              <p className="text-xs text-zinc-500">
                Import data from a file
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    disabled
                    className="inline-flex items-center gap-2 rounded-lg border border-[#1e2030] bg-[#1a1c28] px-3 py-2 text-sm font-medium text-zinc-500 cursor-not-allowed opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    Import
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="left"
                  className="bg-[#1a1c28] border-[#1e2030] text-zinc-300"
                >
                  Coming soon
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* AI Integration Placeholder */}
      <div className="bg-[#12141a] border border-[#1e2030] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
            <Bot className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">
              AI Assistant
            </h2>
            <span className="inline-flex items-center rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              Coming Soon
            </span>
          </div>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Connect your AI assistant for intelligent daily briefings, lead
          scoring, and coaching. Coming soon.
        </p>
      </div>
    </div>
  )
}
