"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { useDemoStore } from "@/stores/demo-data"
import { User, Check, Camera, X } from "lucide-react"

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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatarUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      ...(avatarPreview !== profile.avatarUrl ? { avatarUrl: avatarPreview } : {}),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10 MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setAvatarPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const initials = profile.displayName?.slice(0, 2).toUpperCase() || "AG"

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#0e1118] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10">
          <User className="h-4 w-4 text-blue-400" />
        </div>
        <div>
          <h2 className="text-[13px] font-semibold text-zinc-100">Profile</h2>
          <p className="text-[11px] text-zinc-500">
            Update your photo, name, and timezone
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* ── Avatar Upload ── */}
        <div className="flex items-center gap-5">
          {/* Avatar preview */}
          <div className="relative shrink-0">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile photo"
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/[0.08]"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/25 to-indigo-600/10 ring-2 ring-white/[0.08] text-lg font-bold text-white">
                {initials}
              </div>
            )}
            {/* Remove button */}
            {avatarPreview && (
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 border border-white/[0.1] text-zinc-400 hover:text-white transition-colors"
                title="Remove photo"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </div>

          {/* Upload controls */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-zinc-300 transition-all hover:bg-white/[0.06] hover:border-white/[0.12]"
            >
              <Camera className="h-3.5 w-3.5" />
              {avatarPreview ? "Change Photo" : "Upload Photo"}
            </label>
            <p className="mt-1.5 text-[11px] text-zinc-600">
              JPG, PNG or GIF · Max 5 MB
            </p>
          </div>
        </div>

        {/* ── Display Name ── */}
        <div className="space-y-1.5">
          <label htmlFor="displayName" className="text-[12px] font-medium text-zinc-400">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            {...register("displayName", {
              required: "Display name is required",
              minLength: { value: 2, message: "Must be at least 2 characters" },
            })}
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-[13px] text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-colors"
            placeholder="Your name"
          />
          {errors.displayName && (
            <p className="text-[11px] text-red-400">{errors.displayName.message}</p>
          )}
        </div>

        {/* ── Timezone ── */}
        <div className="space-y-1.5">
          <label htmlFor="timezone" className="text-[12px] font-medium text-zinc-400">
            Timezone
          </label>
          <select
            id="timezone"
            {...register("timezone")}
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-colors"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value} className="bg-[#0e1118]">
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Save ── */}
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          {saved ? (
            <>
              <Check className="h-3.5 w-3.5" />
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
