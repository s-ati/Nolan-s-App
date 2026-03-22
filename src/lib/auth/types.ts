export interface AuthUser {
  id: string
  email: string
  username: string
  fullName: string
  createdAt: string
}

export interface AuthSession {
  user: AuthUser
  /** Mock token — replace with real JWT/session token when swapping to real auth */
  token: string
  expiresAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  fullName: string
  username: string
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  error?: string
  session?: AuthSession
}
