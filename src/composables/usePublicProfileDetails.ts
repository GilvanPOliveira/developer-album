import { computed, ref } from 'vue'
import {
  publicProfileDetailsService,
  type PublicProfileDetails,
} from '../features/profiles/services/public-profile-details.service'

export function usePublicProfileDetails() {
  const profile = ref<PublicProfileDetails | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const projects = computed(() => profile.value?.projects ?? [])
  const primaryStacks = computed(() => profile.value?.primaryStacks ?? [])

  async function loadByUsername(username: string): Promise<PublicProfileDetails | null> {
    isLoading.value = true
    error.value = null

    try {
      const result = await publicProfileDetailsService.getByUsername(username)
      profile.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao carregar detalhes do perfil.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clear() {
    profile.value = null
    error.value = null
  }

  return {
    profile,
    projects,
    primaryStacks,
    isLoading,
    error,
    loadByUsername,
    clear,
  }
}
