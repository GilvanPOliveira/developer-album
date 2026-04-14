import { getAppMode } from '../../../config/app-mode'
import { demoAuthService } from './auth.service.demo'
import { supabaseAuthService } from './auth.service.supabase'

export type AuthUser = {
  id: string
  email: string
}

export type AuthSession = {
  accessToken: string
  refreshToken: string
  expiresAt: number | null
  user: AuthUser
}

export type AuthBootstrapResult = {
  session: AuthSession | null
  user: AuthUser | null
}

export type SignInInput = {
  email: string
  password: string
}

export type SignUpInput = {
  email: string
  password: string
  fullName?: string
}

export type AuthChangeCallback = (payload: AuthBootstrapResult) => void

export type AuthService = {
  bootstrap: () => Promise<AuthBootstrapResult>
  getSession: () => Promise<AuthSession | null>
  getUser: () => Promise<AuthUser | null>
  signIn: (payload: SignInInput) => Promise<AuthBootstrapResult>
  signUp: (payload: SignUpInput) => Promise<AuthBootstrapResult>
  signOut: () => Promise<void>
  sendPasswordResetEmail: (email: string) => Promise<void>
  updatePassword: (currentPassword: string | null, newPassword: string) => Promise<void>
  onAuthStateChange: (callback: AuthChangeCallback) => () => void
}

function getActiveAuthService(): AuthService {
  return getAppMode() === 'demo' ? demoAuthService : supabaseAuthService
}

export const authService: AuthService = {
  bootstrap() {
    return getActiveAuthService().bootstrap()
  },
  getSession() {
    return getActiveAuthService().getSession()
  },
  getUser() {
    return getActiveAuthService().getUser()
  },
  signIn(payload) {
    return getActiveAuthService().signIn(payload)
  },
  signUp(payload) {
    return getActiveAuthService().signUp(payload)
  },
  signOut() {
    return getActiveAuthService().signOut()
  },
  sendPasswordResetEmail(email) {
    return getActiveAuthService().sendPasswordResetEmail(email)
  },
  updatePassword(currentPassword, newPassword) {
    return getActiveAuthService().updatePassword(currentPassword, newPassword)
  },
  onAuthStateChange(callback) {
    return getActiveAuthService().onAuthStateChange(callback)
  },
}

export default authService
