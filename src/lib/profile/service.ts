/**
 * Profile Service — Mock Implementation
 *
 * Stores professional profile data in localStorage, keyed by userId.
 * Each user has their own entry so multiple accounts can coexist on one device.
 *
 * To swap to a real backend:
 *   1. Implement IProfileService against your API/ORM
 *   2. Replace the `profileService` export below
 *   3. Remove localStorage usage
 */

import type { UserProfileData, ProfileUpdatePayload } from "./types"

// ─── Storage key (mock only) ──────────────────────────────────────────────────

const PROFILES_KEY = "levels-user-profiles"

type ProfileStore = Record<string, UserProfileData>

function getStore(): ProfileStore {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) ?? "{}")
  } catch {
    return {}
  }
}

function saveStore(store: ProfileStore): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PROFILES_KEY, JSON.stringify(store))
}

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IProfileService {
  getProfile(userId: string): UserProfileData | null
  upsertProfile(userId: string, data: ProfileUpdatePayload): UserProfileData
  isOnboardingComplete(userId: string): boolean
  deleteProfile(userId: string): void
}

// ─── Mock implementation ──────────────────────────────────────────────────────

export const profileService: IProfileService = {
  getProfile(userId) {
    return getStore()[userId] ?? null
  },

  upsertProfile(userId, data) {
    const store = getStore()
    const existing = store[userId]
    const now = new Date().toISOString()

    const updated: UserProfileData = {
      userId,
      brokerage: data.brokerage ?? existing?.brokerage ?? "",
      roleTitle: data.roleTitle ?? existing?.roleTitle ?? "",
      marketArea: data.marketArea ?? existing?.marketArea ?? "",
      yearsOfExperience: data.yearsOfExperience ?? existing?.yearsOfExperience ?? "",
      primaryFocus: data.primaryFocus ?? existing?.primaryFocus ?? [],
      mainBusinessGoal: data.mainBusinessGoal ?? existing?.mainBusinessGoal ?? "",
      phoneNumber: data.phoneNumber ?? existing?.phoneNumber,
      teamName: data.teamName ?? existing?.teamName,
      licenseNumber: data.licenseNumber ?? existing?.licenseNumber,
      productionGoal: data.productionGoal ?? existing?.productionGoal,
      onboardingComplete: data.onboardingComplete ?? existing?.onboardingComplete ?? false,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    }

    saveStore({ ...store, [userId]: updated })
    return updated
  },

  isOnboardingComplete(userId) {
    return getStore()[userId]?.onboardingComplete === true
  },

  deleteProfile(userId) {
    const store = getStore()
    delete store[userId]
    saveStore(store)
  },
}
