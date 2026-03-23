/**
 * User Profile Types
 *
 * Professional profile data collected during onboarding.
 * Kept separate from AuthUser so each can be updated independently.
 *
 * When connecting to a real backend, map these fields to your user/profile table.
 */

export interface UserProfileData {
  userId: string

  // ── Required (completed during onboarding) ────────────────────────────────
  brokerage: string
  roleTitle: string
  marketArea: string
  yearsOfExperience: string
  primaryFocus: string[]
  mainBusinessGoal: string

  // ── Optional ──────────────────────────────────────────────────────────────
  phoneNumber?: string
  teamName?: string
  licenseNumber?: string
  productionGoal?: string

  // ── Metadata ──────────────────────────────────────────────────────────────
  onboardingComplete: boolean
  createdAt: string
  updatedAt: string
}

export interface ProfileUpdatePayload {
  brokerage?: string
  roleTitle?: string
  marketArea?: string
  yearsOfExperience?: string
  primaryFocus?: string[]
  mainBusinessGoal?: string
  phoneNumber?: string
  teamName?: string
  licenseNumber?: string
  productionGoal?: string
  onboardingComplete?: boolean
}
