import { create } from "zustand"
import { profileService } from "@/lib/profile/service"
import type { UserProfileData, ProfileUpdatePayload } from "@/lib/profile/types"

interface ProfileState {
  profile: UserProfileData | null
  isSaving: boolean

  // Actions
  loadProfile: (userId: string) => void
  saveProfile: (userId: string, data: ProfileUpdatePayload) => Promise<void>
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isSaving: false,

  loadProfile: (userId) => {
    const profile = profileService.getProfile(userId)
    set({ profile })
  },

  saveProfile: async (userId, data) => {
    set({ isSaving: true })
    await new Promise((r) => setTimeout(r, 350)) // simulate async
    const updated = profileService.upsertProfile(userId, data)
    set({ profile: updated, isSaving: false })
  },

  clearProfile: () => set({ profile: null }),
}))
