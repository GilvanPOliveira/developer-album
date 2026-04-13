import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth.store'

export function useAuth() {
  const authStore = useAuthStore()
  const { user, isAuthenticated, isBootstrapped, isBootstrapping, isLoading, error, userId, userEmail } =
    storeToRefs(authStore)

  onMounted(() => {
    if (!isBootstrapped.value && !isBootstrapping.value) {
      authStore.bootstrap()
    }
  })

  const isReady = computed(() => isBootstrapped.value && !isBootstrapping.value)

  return {
    user,
    userId,
    userEmail,
    isAuthenticated,
    isBootstrapped,
    isBootstrapping,
    isReady,
    isLoading,
    error,
    bootstrap: authStore.bootstrap,
    signIn: authStore.signIn,
    signUp: authStore.signUp,
    signOut: authStore.signOut,
    sendPasswordResetEmail: authStore.sendPasswordResetEmail,
    updatePassword: authStore.updatePassword,
    clearError: authStore.clearError,
  }
}
