import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { appModeState } from '../config/app-mode'
import { authService, type AuthUser, type SignInInput, type SignUpInput } from '../features/auth/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isBootstrapped = ref(false)
  const isBootstrapping = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let unsubscribeAuthListener: (() => void) | null = null
  let bootstrapToken = 0

  const isAuthenticated = computed(() => Boolean(user.value))
  const userId = computed(() => user.value?.id ?? null)
  const userEmail = computed(() => user.value?.email ?? null)

  function clearAuthListener(): void {
    unsubscribeAuthListener?.()
    unsubscribeAuthListener = null
  }

  function setupAuthListener(): void {
    clearAuthListener()
    unsubscribeAuthListener = authService.onAuthStateChange((payload) => {
      user.value = payload.user
    })
  }

  async function bootstrap(): Promise<void> {
    if (isBootstrapping.value) {
      return
    }

    const currentToken = ++bootstrapToken

    isBootstrapping.value = true
    error.value = null

    try {
      const result = await authService.bootstrap()

      if (currentToken !== bootstrapToken) {
        return
      }

      user.value = result.user
      setupAuthListener()
    } catch (err) {
      if (currentToken !== bootstrapToken) {
        return
      }

      error.value = err instanceof Error ? err.message : 'Falha ao inicializar autenticação.'
      user.value = null
    } finally {
      if (currentToken === bootstrapToken) {
        isBootstrapping.value = false
        isBootstrapped.value = true
      }
    }
  }

  async function signIn(payload: SignInInput): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const result = await authService.signIn(payload)
      user.value = result.user
      setupAuthListener()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao entrar.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function signUp(payload: SignUpInput): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const result = await authService.signUp(payload)
      user.value = result.user
      setupAuthListener()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao criar conta.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function signOut(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await authService.signOut()
      user.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao sair.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function sendPasswordResetEmail(email: string): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await authService.sendPasswordResetEmail(email)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao enviar email de redefinição.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updatePassword(currentPassword: string | null, newPassword: string): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await authService.updatePassword(currentPassword, newPassword)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao atualizar senha.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError(): void {
    error.value = null
  }

  watch(appModeState, () => {
    bootstrapToken += 1
    clearAuthListener()
    user.value = null
    error.value = null
    isBootstrapped.value = false
    isBootstrapping.value = false
    void bootstrap()
  })

  return {
    user,
    isBootstrapped,
    isBootstrapping,
    isLoading,
    error,
    isAuthenticated,
    userId,
    userEmail,
    bootstrap,
    signIn,
    signUp,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    clearError,
  }
})
