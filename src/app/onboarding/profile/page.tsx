"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Building2, Loader2, CheckCircle2, ChevronDown } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { useProfileStore } from "@/stores/profile-store"
import { profileService } from "@/lib/profile/service"

// ─── Schema ───────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  // Required
  brokerage: z.string().min(1, "Brokerage is required"),
  roleTitle: z.string().min(1, "Role / Title is required"),
  marketArea: z.string().min(1, "Market / Service Area is required"),
  yearsOfExperience: z.string().min(1, "Years of Experience is required"),
  primaryFocus: z.array(z.string()).min(1, "Select at least one focus area"),
  mainBusinessGoal: z.string().min(1, "Main Business Goal is required"),
  // Optional
  phoneNumber: z.string().optional(),
  teamName: z.string().optional(),
  licenseNumber: z.string().optional(),
  productionGoal: z.string().optional(),
})

type ProfileValues = z.infer<typeof profileSchema>

// ─── Options ──────────────────────────────────────────────────────────────────

const FOCUS_OPTIONS = [
  "Buyers",
  "Sellers",
  "Leasing",
  "Investments",
  "Luxury",
  "First-Time Buyers",
]

const GOAL_OPTIONS = [
  "Get more listings",
  "Grow pipeline",
  "Improve follow-up",
  "Stay consistent",
  "Close more deals",
]

const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "6–10 years",
  "10+ years",
]

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-[14px] text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-blue-500/20"

const selectCls =
  "w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-[14px] text-zinc-100 outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"

const labelCls =
  "block mb-1.5 text-[12px] font-medium text-zinc-500 uppercase tracking-wide"

const errorCls = "mt-1.5 text-[12px] text-red-400"

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompleteProfilePage() {
  const router = useRouter()
  const getCurrentUser = useAuthStore((s) => s.getCurrentUser)
  const saveProfile = useProfileStore((s) => s.saveProfile)
  const isSaving = useProfileStore((s) => s.isSaving)
  const [mounted, setMounted] = useState(false)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { primaryFocus: [] },
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Guard: if not authenticated, go to /auth
  // Guard: if already onboarded, go to /dashboard
  useEffect(() => {
    if (!mounted) return
    const user = getCurrentUser()
    if (!user) {
      router.replace("/auth")
      return
    }
    if (profileService.isOnboardingComplete(user.id)) {
      router.replace("/dashboard")
    }
  }, [mounted, getCurrentUser, router])

  const selectedFocus = watch("primaryFocus") ?? []

  function toggleFocus(option: string, current: string[], onChange: (v: string[]) => void) {
    if (current.includes(option)) {
      onChange(current.filter((f) => f !== option))
    } else {
      onChange([...current, option])
    }
  }

  async function onSubmit(values: ProfileValues) {
    const user = getCurrentUser()
    if (!user) return

    await saveProfile(user.id, {
      ...values,
      onboardingComplete: true,
    })

    setSaved(true)
    setTimeout(() => {
      router.replace("/dashboard")
    }, 800)
  }

  if (!mounted) return null

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Blue glow */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-24">
        <div
          className="h-[400px] w-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[560px]">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 ring-1 ring-blue-500/25">
            <Building2 className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-blue-400/80">
              Levels
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Complete Your Profile
            </h1>
            <p className="mt-1.5 text-[14px] text-zinc-500">
              Help personalize your Levels experience.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/[0.025] p-8 ring-1 ring-white/[0.07] shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

            {/* ── Required fields ── */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
                Professional Info
                <span className="ml-2 text-red-500">*</span>
                <span className="ml-1 text-zinc-700 normal-case tracking-normal font-normal">required</span>
              </p>

              <div className="space-y-4">
                {/* Brokerage */}
                <div>
                  <label className={labelCls}>Brokerage</label>
                  <input
                    {...register("brokerage")}
                    type="text"
                    placeholder="e.g. Keller Williams, RE/MAX, eXp Realty"
                    className={inputCls}
                  />
                  {errors.brokerage && <p className={errorCls}>{errors.brokerage.message}</p>}
                </div>

                {/* Role / Title & Market — 2-col */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Role / Title</label>
                    <div className="relative">
                      <select {...register("roleTitle")} className={selectCls} defaultValue="">
                        <option value="" disabled className="bg-[#12141a]">Select…</option>
                        <option value="Buyer's Agent" className="bg-[#12141a]">Buyer&apos;s Agent</option>
                        <option value="Listing Agent" className="bg-[#12141a]">Listing Agent</option>
                        <option value="Dual Agent" className="bg-[#12141a]">Dual Agent</option>
                        <option value="Team Lead" className="bg-[#12141a]">Team Lead</option>
                        <option value="Broker" className="bg-[#12141a]">Broker</option>
                        <option value="Property Manager" className="bg-[#12141a]">Property Manager</option>
                        <option value="Commercial Agent" className="bg-[#12141a]">Commercial Agent</option>
                        <option value="Other" className="bg-[#12141a]">Other</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                    </div>
                    {errors.roleTitle && <p className={errorCls}>{errors.roleTitle.message}</p>}
                  </div>

                  <div>
                    <label className={labelCls}>Years of Experience</label>
                    <div className="relative">
                      <select {...register("yearsOfExperience")} className={selectCls} defaultValue="">
                        <option value="" disabled className="bg-[#12141a]">Select…</option>
                        {EXPERIENCE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#12141a]">{opt}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                    </div>
                    {errors.yearsOfExperience && <p className={errorCls}>{errors.yearsOfExperience.message}</p>}
                  </div>
                </div>

                {/* Market / Service Area */}
                <div>
                  <label className={labelCls}>Market / Service Area</label>
                  <input
                    {...register("marketArea")}
                    type="text"
                    placeholder="e.g. Austin, TX · DFW Metroplex · South Florida"
                    className={inputCls}
                  />
                  {errors.marketArea && <p className={errorCls}>{errors.marketArea.message}</p>}
                </div>

                {/* Primary Focus — multi-select toggle */}
                <div>
                  <label className={labelCls}>Primary Focus</label>
                  <Controller
                    name="primaryFocus"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-2">
                        {FOCUS_OPTIONS.map((opt) => {
                          const active = field.value.includes(opt)
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => toggleFocus(opt, field.value, field.onChange)}
                              className={`rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all ${
                                active
                                  ? "border-blue-500/50 bg-blue-500/15 text-blue-300"
                                  : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-white/[0.14] hover:text-zinc-300"
                              }`}
                            >
                              {active && <span className="mr-1">✓</span>}
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  />
                  {errors.primaryFocus && (
                    <p className={errorCls}>{errors.primaryFocus.message as string}</p>
                  )}
                </div>

                {/* Main Business Goal */}
                <div>
                  <label className={labelCls}>Main Business Goal</label>
                  <div className="relative">
                    <select {...register("mainBusinessGoal")} className={selectCls} defaultValue="">
                      <option value="" disabled className="bg-[#12141a]">Select your #1 goal…</option>
                      {GOAL_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#12141a]">{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                  </div>
                  {errors.mainBusinessGoal && <p className={errorCls}>{errors.mainBusinessGoal.message}</p>}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.06]" />

            {/* ── Optional fields ── */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
                Optional Details
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input
                      {...register("phoneNumber")}
                      type="tel"
                      placeholder="(555) 000-0000"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Team Name</label>
                    <input
                      {...register("teamName")}
                      type="text"
                      placeholder="e.g. The Smith Group"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>License Number</label>
                    <input
                      {...register("licenseNumber")}
                      type="text"
                      placeholder="e.g. TX-1234567"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Production Goal</label>
                    <input
                      {...register("productionGoal")}
                      type="text"
                      placeholder="e.g. $5M GCI, 50 closings"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSaving || saved}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_0_0_1px_rgba(59,130,246,0.3)] transition-all hover:bg-blue-500 hover:shadow-[0_0_24px_rgba(59,130,246,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Profile Saved — Taking you in…
                </>
              ) : isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save & Enter Levels"
              )}
            </button>

          </form>
        </div>

        <p className="mt-5 text-center text-[12px] text-zinc-700">
          You can update these details anytime from Settings.
        </p>
      </div>
    </div>
  )
}
