"use client"

import { useState, useEffect, useCallback } from "react"
import { Settings2, Bell, Trophy, Clock, Volume2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface Preferences {
  xpFeedbackNotifications: boolean
  achievementPopups: boolean
  defaultPlannerStartTime: string
  soundEffects: boolean
}

const DEFAULT_PREFERENCES: Preferences = {
  xpFeedbackNotifications: true,
  achievementPopups: true,
  defaultPlannerStartTime: "09:00",
  soundEffects: false,
}

const STORAGE_KEY = "leveled-preferences"

function loadPreferences(): Preferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) }
  } catch {
    // ignore
  }
  return DEFAULT_PREFERENCES
}

function savePreferences(prefs: Preferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // ignore
  }
}

export function AppPreferences() {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setPrefs(loadPreferences())
    setMounted(true)
  }, [])

  const update = useCallback(
    (key: keyof Preferences, value: boolean | string) => {
      setPrefs((prev) => {
        const next = { ...prev, [key]: value }
        savePreferences(next)
        return next
      })
    },
    []
  )

  if (!mounted) return null

  return (
    <div className="bg-[#12141a] border border-[#1e2030] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
          <Settings2 className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Preferences</h2>
          <p className="text-xs text-zinc-500">
            Customize your experience
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* XP Feedback Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4 text-zinc-500" />
            <div>
              <p className="text-sm text-zinc-200">XP Feedback Notifications</p>
              <p className="text-xs text-zinc-500">
                Show XP earned after each action
              </p>
            </div>
          </div>
          <Switch
            checked={prefs.xpFeedbackNotifications}
            onCheckedChange={(checked) =>
              update("xpFeedbackNotifications", checked)
            }
            className="data-[state=unchecked]:bg-[#1e2030] data-[state=checked]:bg-blue-600"
          />
        </div>

        {/* Achievement Popup Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-4 w-4 text-zinc-500" />
            <div>
              <p className="text-sm text-zinc-200">
                Achievement Popup Notifications
              </p>
              <p className="text-xs text-zinc-500">
                Show a popup when you unlock achievements
              </p>
            </div>
          </div>
          <Switch
            checked={prefs.achievementPopups}
            onCheckedChange={(checked) =>
              update("achievementPopups", checked)
            }
            className="data-[state=unchecked]:bg-[#1e2030] data-[state=checked]:bg-blue-600"
          />
        </div>

        {/* Default Planner Start Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-zinc-500" />
            <div>
              <p className="text-sm text-zinc-200">
                Default Planner Start Time
              </p>
              <p className="text-xs text-zinc-500">
                When your daily planner blocks begin
              </p>
            </div>
          </div>
          <input
            type="time"
            value={prefs.defaultPlannerStartTime}
            onChange={(e) =>
              update("defaultPlannerStartTime", e.target.value)
            }
            className="bg-[#1a1c28] border border-[#1e2030] text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors"
          />
        </div>

        {/* Sound Effects */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="h-4 w-4 text-zinc-500" />
            <div>
              <p className="text-sm text-zinc-200">Sound Effects</p>
              <p className="text-xs text-zinc-500">
                Play sounds for XP gains and level ups
              </p>
            </div>
          </div>
          <Switch
            checked={prefs.soundEffects}
            onCheckedChange={(checked) => update("soundEffects", checked)}
            className="data-[state=unchecked]:bg-[#1e2030] data-[state=checked]:bg-blue-600"
          />
        </div>
      </div>
    </div>
  )
}
