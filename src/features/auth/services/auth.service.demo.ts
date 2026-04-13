import { demoUsers, findDemoUserByEmail } from '../../../features/demo/demo-data'
import {
  buildDemoSession,
  clearDemoSession,
  getDemoSession,
  getDemoSessionUser,
  setDemoSession,
  subscribeDemoSession,
} from '../../../features/demo/demo-session'
import type {
  AuthChangeCallback,
  AuthService,
  AuthSession,
  AuthUser,
  SignInInput,
  SignUpInput,
} from './auth.service'

function mapDemoSession(): AuthSession | null {
  const session = getDemoSession()

  if (!session) {
    return null
  }

  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    expiresAt: session.expiresAt,
    user: {
      id: session.user.id,
      email: session.user.email,
    },
  }
}

function mapDemoUser(): AuthUser | null {
  const user = getDemoSessionUser()

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
  }
}

export const demoAuthService: AuthService = {
  async bootstrap() {
    return {
      session: mapDemoSession(),
      user: mapDemoUser(),
    }
  },

  async getSession() {
    return mapDemoSession()
  },

  async getUser() {
    return mapDemoUser()
  },

  async signIn(payload: SignInInput) {
    const email = payload.email.trim().toLowerCase()
    const password = payload.password

    const user = findDemoUserByEmail(email)

    if (!user || user.password !== password) {
      throw new Error('Email ou senha inválidos no modo demo.')
    }

    const session = setDemoSession(buildDemoSession(user))

    return {
      session: {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt,
        user: {
          id: user.id,
          email: user.email,
        },
      },
      user: {
        id: user.id,
        email: user.email,
      },
    }
  },

  async signUp(payload: SignUpInput) {
    const email = payload.email.trim().toLowerCase()

    const existingUser = findDemoUserByEmail(email)

    if (existingUser) {
      throw new Error('Este email já existe no modo demo.')
    }

    const generatedId = `demo-user-${crypto.randomUUID()}`
    const fullName = payload.fullName?.trim() || 'Usuário Demo'
    const usernameBase = fullName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 20)

    const createdUser = {
      id: generatedId,
      email,
      password: payload.password,
      fullName,
      username: usernameBase || `demo${Date.now()}`,
      avatarUrl: 'https://i.pravatar.cc/300',
      headline: 'Novo perfil demo',
      bio: 'Conta criada localmente no modo demo.',
      location: 'Brasil',
      githubUrl: '',
      linkedinUrl: '',
      websiteUrl: '',
      isPublic: true,
    }

    demoUsers.unshift(createdUser)

    const session = setDemoSession(buildDemoSession(createdUser))

    return {
      session: {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt,
        user: {
          id: createdUser.id,
          email: createdUser.email,
        },
      },
      user: {
        id: createdUser.id,
        email: createdUser.email,
      },
    }
  },

  async signOut() {
    clearDemoSession()
  },

  async sendPasswordResetEmail() {
    return
  },

  async updatePassword(currentPassword, newPassword) {
    const sessionUser = getDemoSessionUser()

    if (!sessionUser) {
      throw new Error('Usuário não autenticado no modo demo.')
    }

    const targetUser = demoUsers.find((user) => user.id === sessionUser.id)

    if (!targetUser) {
      throw new Error('Usuário demo não encontrado.')
    }

    if (currentPassword && targetUser.password !== currentPassword) {
      throw new Error('Senha atual incorreta.')
    }

    targetUser.password = newPassword
  },

  onAuthStateChange(callback: AuthChangeCallback) {
    return subscribeDemoSession(() => {
      callback({
        session: mapDemoSession(),
        user: mapDemoUser(),
      })
    })
  },
}
