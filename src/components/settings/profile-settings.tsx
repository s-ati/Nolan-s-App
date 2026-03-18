"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDemoStore } from "@/stores/demo-data"
import { User, Check } from "lucide-react"

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "America/Chicago", label: "Central (CT)" },
  { value: "America/Denver", label: "Mountain (MT)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "America/Phoenix", label: "Arizona (MST)" },
  { value: "America/Anchorage", label: "Alaska (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii (HST)" },
]

interface ProfileFormData {
  displayName: string
  timezone: string
}

export function ProfileSettings() {
  const profile = useDemoStore((s) => s.profile)
  const updateProfile = useDemoStore((s) => s.updateProfile)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      displayName: profile.displayName,
      timezone: profile.timezone,
    },
  })

  const onSubmit = (data: ProfileFormData) => {
    updateProfile({
      displayName: data.displayName,
      timezone: data.timezone,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-[#12141a] border border-[#1e2030] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
          <User className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Profile</h2>
          <p className="text-xs text-zinc-500">
            Update your display name and timezone
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Display Name */}
        <div className="space-y-2">
          <label
            htmlFor="displayName"
            className="text-sm font-medium text-zinc-300"
          >
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            {...register("displayName", {
              required: "Display name is required",
              minLength: {
                value: 2,
                message: "Must be at least 2 characters",
              },
            })}
            className="w-full bg-[#1a1c28] border border-[#1e2030] text-white rounded-lg px-3 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors"
            placeholder="Your name"
          />
          {errors.displayName && (
            <p className="text-xs text-red-400">{errors.displayName.message}</p>
          )}
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <label
            htmlFor="timezone"
            className="text-sm font-medium text-zinc-300"
          >
            Timezone
          </label>
          <select
            id="timezone"
            {...register("timezone")}
            className="w-full bg-[#1a1c28] border border-[#1e2030] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Save */}
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  )
}
