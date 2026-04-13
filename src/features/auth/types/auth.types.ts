import type { Session, User } from '@supabase/supabase-js'

export type AuthUser = User

export type AuthSession = Session

export type SignInPayload = {
  email: string
  password: string
}

export type SignUpPayload = {
  fullName: string
  email: string
  password: string
}

export type ResetPasswordPayload = {
  email: string
}

export type UpdatePasswordPayload = {
  password: string
}
