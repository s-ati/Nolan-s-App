"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Building2, Loader2 } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { profileService } from "@/lib/profile/service"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be 20 characters or less")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type LoginValues = z.infer<typeof loginSchema>
type SignupValues = z.infer<typeof signupSchema>

// ─── Shared input style ───────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-[14px] text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-blue-500/20 autofill:bg-[#1a1d2e]"

const errorCls = "mt-1.5 text-[12px] text-red-400"

const labelCls = "block mb-1.5 text-[12px] font-medium text-zinc-500 uppercase tracking-wide"

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter()
  const { login, isLoading } = useAuthStore()
  const [showPw, setShowPw] = useState(false)
  const [serverError, setServerError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginValues) {
    setServerError("")
    const result = await login(values)
    if (result.success) {
      router.replace("/dashboard")
    } else {
      setServerError(result.error ?? "Login failed. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label className={labelCls}>Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className={inputCls}
        />
        {errors.email && <p className={errorCls}>{errors.email.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={labelCls} style={{ marginBottom: 0 }}>
            Password
          </label>
          <button
            type="button"
            className="text-[12px] text-zinc-600 transition-colors hover:text-zinc-400"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            {...register("password")}
            type={showPw ? "text" : "password"}
            placeholder="Your password"
            autoComplete="current-password"
            className={`${inputCls} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors hover:text-zinc-400"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className={errorCls}>{errors.password.message}</p>}
      </div>

      {serverError && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
          <p className="text-[13px] text-red-400">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-[14px] font-semibold text-white shadow-[0_0_0_1px_rgba(59,130,246,0.3)] transition-all hover:bg-blue-500 hover:shadow-[0_0_24px_rgba(59,130,246,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Logging in…
          </>
        ) : (
          "Log In"
        )}
      </button>

      <p className="text-center text-[13px] text-zinc-600">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-medium text-zinc-400 transition-colors hover:text-white"
        >
          Sign up
        </button>
      </p>
    </form>
  )
}

// ─── Signup Form ──────────────────────────────────────────────────────────────

function SignupForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter()
  const { signup, isLoading } = useAuthStore()
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) })

  async function onSubmit(values: SignupValues) {
    setServerError("")
    const result = await signup({
      fullName: values.fullName,
      username: values.username,
      email: values.email,
      password: values.password,
    })
    if (result.success) {
      // New accounts must complete their professional profile before accessing the app
      router.replace("/onboarding/profile")
    } else {
      setServerError(result.error ?? "Signup failed. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Full Name</label>
          <input
            {...register("fullName")}
            type="text"
            placeholder="Alex Johnson"
            autoComplete="name"
            className={inputCls}
          />
          {errors.fullName && <p className={errorCls}>{errors.fullName.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Username</label>
          <input
            {...register("username")}
            type="text"
            placeholder="alexj"
            autoComplete="username"
            className={inputCls}
          />
          {errors.username && <p className={errorCls}>{errors.username.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelCls}>Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className={inputCls}
        />
        {errors.email && <p className={errorCls}>{errors.email.message}</p>}
      </div>

      <div>
        <label className={labelCls}>Password</label>
        <div className="relative">
          <input
            {...register("password")}
            type={showPw ? "text" : "password"}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className={`${inputCls} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors hover:text-zinc-400"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className={errorCls}>{errors.password.message}</p>}
      </div>

      <div>
        <label className={labelCls}>Confirm Password</label>
        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat your password"
            autoComplete="new-password"
            className={`${inputCls} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors hover:text-zinc-400"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className={errorCls}>{errors.confirmPassword.message}</p>
        )}
      </div>

      {serverError && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
          <p className="text-[13px] text-red-400">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-[14px] font-semibold text-white shadow-[0_0_0_1px_rgba(59,130,246,0.3)] transition-all hover:bg-blue-500 hover:shadow-[0_0_24px_rgba(59,130,246,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="text-center text-[13px] text-zinc-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-medium text-zinc-400 transition-colors hover:text-white"
        >
          Log in
        </button>
      </p>
    </form>
  )
}

// ─── Auth Screen (inner — uses useSearchParams) ───────────────────────────────

function AuthScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  const initialTab = searchParams.get("tab") === "login" ? "login" : "signup"
  const [tab, setTab] = useState<"login" | "signup">(initialTab)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect already-authenticated users
  useEffect(() => {
    if (!mounted || !isAuthenticated) return
    const user = useAuthStore.getState().getCurrentUser()
    if (user && !profileService.isOnboardingComplete(user.id)) {
      router.replace("/onboarding/profile")
    } else {
      router.replace("/dashboard")
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted || isAuthenticated) return null

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#080a0e] px-4 py-12">
      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[500px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Auth card */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 ring-1 ring-blue-500/25">
            <Building2 className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-center">
            <h1 className="text-[22px] font-bold tracking-tight text-white">
              {tab === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1 text-[13px] text-zinc-500">
              {tab === "login"
                ? "Log in to continue to Levels"
                : "Start tracking your performance today"}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/[0.025] p-7 ring-1 ring-white/[0.07] shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
          {/* Tab toggles */}
          <div className="mb-6 flex rounded-xl bg-white/[0.04] p-1 ring-1 ring-white/[0.06]">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2 text-[13px] font-semibold transition-all duration-150 ${
                  tab === t
                    ? "bg-white/[0.08] text-white shadow-[0_1px_4px_rgba(0,0,0,0.3)]"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <LoginForm onSwitch={() => setTab("signup")} />
          ) : (
            <SignupForm onSwitch={() => setTab("login")} />
          )}
        </div>

        <p className="mt-6 text-center text-[12px] text-zinc-700">
          By continuing you agree to our{" "}
          <span className="text-zinc-600">Terms of Service</span> and{" "}
          <span className="text-zinc-600">Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthScreen />
    </Suspense>
  )
}
