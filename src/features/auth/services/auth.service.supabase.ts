import { getSupabaseClient } from '../../../lib/supabase/client'
import type {
  AuthChangeCallback,
  AuthService,
  AuthSession,
  AuthUser,
  SignInInput,
  SignUpInput,
} from './auth.service'

function toAuthUser(user: { id: string; email?: string | null } | null | undefined): AuthUser | null {
  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email ?? '',
  }
}

function toAuthSession(session: {
  access_token: string
  refresh_token: string
  expires_at?: number | null
  user: { id: string; email?: string | null }
} | null): AuthSession | null {
  if (!session) {
    return null
  }

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at ?? null,
    user: {
      id: session.user.id,
      email: session.user.email ?? '',
    },
  }
}

async function requireNoError<T extends { error: { message: string } | null }>(result: T): Promise<T> {
  if (result.error) {
    throw new Error(result.error.message)
  }

  return result
}

export const supabaseAuthService: AuthService = {
  async bootstrap() {
    const supabase = getSupabaseClient()
    const result = await requireNoError(await supabase.auth.getSession())

    return {
      session: toAuthSession(result.data.session),
      user: toAuthUser(result.data.session?.user),
    }
  },

  async getSession() {
    const supabase = getSupabaseClient()
    const result = await requireNoError(await supabase.auth.getSession())

    return toAuthSession(result.data.session)
  },

  async getUser() {
    const supabase = getSupabaseClient()
    const result = await requireNoError(await supabase.auth.getUser())

    return toAuthUser(result.data.user)
  },

  async signIn(payload: SignInInput) {
    const supabase = getSupabaseClient()
    const result = await requireNoError(
      await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      }),
    )

    return {
      session: toAuthSession(result.data.session),
      user: toAuthUser(result.data.user),
    }
  },

  async signUp(payload: SignUpInput) {
    const supabase = getSupabaseClient()
    const result = await requireNoError(
      await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            full_name: payload.fullName ?? '',
          },
        },
      }),
    )

    return {
      session: toAuthSession(result.data.session),
      user: toAuthUser(result.data.user),
    }
  },

  async signOut() {
    const supabase = getSupabaseClient()
    await requireNoError(await supabase.auth.signOut())
  },

  async sendPasswordResetEmail(email: string) {
    const supabase = getSupabaseClient()
    await requireNoError(
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      }),
    )
  },

  async updatePassword(currentPassword: string | null, newPassword: string) {
    const supabase = getSupabaseClient()

    if (currentPassword) {
      const sessionResult = await requireNoError(await supabase.auth.getSession())
      const email = sessionResult.data.session?.user.email

      if (!email) {
        throw new Error('Usuário não autenticado.')
      }

      await requireNoError(
        await supabase.auth.signInWithPassword({
          email,
          password: currentPassword,
        }),
      )
    }

    await requireNoError(
      await supabase.auth.updateUser({
        password: newPassword,
      }),
    )
  },

  onAuthStateChange(callback: AuthChangeCallback) {
    const supabase = getSupabaseClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      callback({
        session: toAuthSession(session),
        user: toAuthUser(session?.user),
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  },
}
