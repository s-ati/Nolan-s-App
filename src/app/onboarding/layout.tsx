/**
 * Onboarding Layout
 *
 * Minimal full-screen layout — no sidebar, no top bar.
 * Keeps the same dark background as the rest of the app.
 */
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#080a0e]">
      {children}
    </div>
  )
}
