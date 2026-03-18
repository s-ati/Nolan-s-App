"use client"

import { Settings } from "lucide-react"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { AppPreferences } from "@/components/settings/app-preferences"
import { DataManagement } from "@/components/settings/data-management"

export default function SettingsPage() {
  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
          <Settings className="h-5 w-5 text-zinc-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
          <p className="text-sm text-zinc-500">
            Manage your profile, preferences, and data
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <ProfileSettings />
        <AppPreferences />
        <DataManagement />
      </div>
    </div>
  )
}
