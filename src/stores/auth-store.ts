import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authService } from "@/lib/auth/service"
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
  /** True once the persisted state has been rehydrated from localStorage */
  hasHydrated: boolean

  // Internal
  setHasHydrated: (value: boolean) => void

  // Actions
  login: (credentials: LoginCredentials) => Promise<AuthResult>
  signup: (credentials: SignupCredentials) => Promise<AuthResult>
  logout: () => Promise<void>
  getCurrentUser: () => AuthUser | null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

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
    }),
    {
      name: "levels-auth",
      // Only persist auth state — not loading/hydration flags
      partialize: (state) => ({
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
