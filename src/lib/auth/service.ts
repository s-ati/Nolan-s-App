/**
 * Auth Service — Mock Implementation
 *
 * This file defines the IAuthService interface plus a mock implementation
 * that stores accounts in localStorage.
 *
 * To swap to a real auth provider (Supabase, Clerk, Firebase, NextAuth, etc.):
 *   1. Create a new object that implements IAuthService
 *   2. Replace the `authService` export below with your new implementation
 *   3. Update the auth store's logout() to also call any provider sign-out
 *   4. Remove the MOCK_ACCOUNTS_KEY localStorage usage
 *
 * NOTE: Passwords are stored in plaintext here because this is a mock.
 * Real auth NEVER stores or transmits plaintext passwords — that is handled
 * server-side by the auth provider.
 */

import type {
  AuthUser,
  AuthSession,
  LoginCredentials,
  SignupCredentials,
  AuthResult,
} from "./types"

// ─── Storage key (mock only) ──────────────────────────────────────────────────

const MOCK_ACCOUNTS_KEY = "levels-mock-accounts"

interface StoredAccount {
  id: string
  email: string
  username: string
  fullName: string
  /** Mock only — real auth never stores plaintext passwords */
  password: string
  createdAt: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function createSession(user: AuthUser): AuthSession {
  return {
    user,
    token: uid() + uid(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }
}

function getAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(MOCK_ACCOUNTS_KEY) ?? "[]")
  } catch {
    return []
  }
}

function saveAccounts(accounts: StoredAccount[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(MOCK_ACCOUNTS_KEY, JSON.stringify(accounts))
}

// ─── Interface ────────────────────────────────────────────────────────────────

/** Swap the `authService` export to replace the entire auth implementation */
export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResult>
  signup(credentials: SignupCredentials): Promise<AuthResult>
  logout(): Promise<void>
  /** Hard-delete the account record. Real backend: call DELETE /users/:id */
  deleteAccount(userId: string): Promise<void>
}

// ─── Mock implementation ──────────────────────────────────────────────────────

export const authService: IAuthService = {
  async login({ email, password }): Promise<AuthResult> {
    await new Promise((r) => setTimeout(r, 400)) // simulate latency

    const accounts = getAccounts()
    const account = accounts.find(
      (a) =>
        a.email.toLowerCase() === email.toLowerCase() &&
        a.password === password
    )

    if (!account) {
      return { success: false, error: "Invalid email or password." }
    }

    const user: AuthUser = {
      id: account.id,
      email: account.email,
      username: account.username,
      fullName: account.fullName,
      createdAt: account.createdAt,
    }

    return { success: true, session: createSession(user) }
  },

  async signup({ fullName, username, email, password }): Promise<AuthResult> {
    await new Promise((r) => setTimeout(r, 400))

    const accounts = getAccounts()

    if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists." }
    }

    if (
      accounts.some((a) => a.username.toLowerCase() === username.toLowerCase())
    ) {
      return { success: false, error: "This username is already taken." }
    }

    const newAccount: StoredAccount = {
      id: uid(),
      email,
      username,
      fullName,
      password, // mock only
      createdAt: new Date().toISOString(),
    }

    saveAccounts([...accounts, newAccount])

    const user: AuthUser = {
      id: newAccount.id,
      email: newAccount.email,
      username: newAccount.username,
      fullName: newAccount.fullName,
      createdAt: newAccount.createdAt,
    }

    return { success: true, session: createSession(user) }
  },

  async logout(): Promise<void> {
    // For real providers: call their signOut() here
    // For mock: session is cleared in the auth store
  },

  async deleteAccount(userId): Promise<void> {
    await new Promise((r) => setTimeout(r, 350))
    const accounts = getAccounts()
    saveAccounts(accounts.filter((a) => a.id !== userId))
  },
}
