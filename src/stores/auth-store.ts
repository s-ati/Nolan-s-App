import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authService } from "@/lib/auth/service"
import { profileService } from "@/lib/profile/service"
import type {
  AuthUser,
  AuthSession,
  LoginCredentials,
  SignupCredentials,
  AuthResult,
} from "@/lib/auth/types"

interface AuthState {
  session: AuthSession | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (credentials: LoginCredentials) => Promise<AuthResult>
  signup: (credentials: SignupCredentials) => Promise<AuthResult>
  logout: () => Promise<void>
  getCurrentUser: () => AuthUser | null
  /**
   * Hard-delete this account and all associated local data, then log out.
   * Real backend: also call your DELETE /users/:id endpoint here.
   */
  deleteAccount: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true })
        const result = await authService.login(credentials)
        if (result.success && result.session) {
          set({ session: result.session, isAuthenticated: true })
        }
        set({ isLoading: false })
        return result
      },

      signup: async (credentials) => {
        set({ isLoading: true })
        const result = await authService.signup(credentials)
        if (result.success && result.session) {
          set({ session: result.session, isAuthenticated: true })
        }
        set({ isLoading: false })
        return result
      },

      logout: async () => {
        await authService.logout()
        set({ session: null, isAuthenticated: false })
      },

      getCurrentUser: () => get().session?.user ?? null,

      deleteAccount: async () => {
        const user = get().getCurrentUser()
        if (!user) return

        set({ isLoading: true })

        // 1. Remove account record from mock auth store
        await authService.deleteAccount(user.id)

        // 2. Remove professional profile data for this user
        profileService.deleteProfile(user.id)

        // 3. Clear all user-specific app data from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("demo-store")
          localStorage.removeItem("leveled-preferences")
        }

        // 4. Log out (clears session via the persist store)
        await authService.logout()
        set({ session: null, isAuthenticated: false, isLoading: false })
      },
    }),
    {
      name: "levels-auth",
      partialize: (state) => ({
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
