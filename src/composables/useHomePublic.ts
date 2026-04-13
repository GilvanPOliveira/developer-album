import { ref } from 'vue'
import { homePublicService, type HomePublicData } from '../features/profiles/services/home-public.service'

export function useHomePublic() {
  const data = ref<HomePublicData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function load(): Promise<HomePublicData> {
    isLoading.value = true
    error.value = null

    try {
      const result = await homePublicService.getHomePublicData()
      data.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao carregar dados públicos da home.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    data,
    isLoading,
    error,
    load,
  }
}
