import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { homePublicService } from '../features/profiles/services/home-public.service'
import type { RequestStatus } from '../types/api'
import type { HomePublicData } from '../features/profiles/services/home-public.service'

export const useHomePublicStore = defineStore('home-public', () => {
  const payload = ref<HomePublicData | null>(null)
  const loadStatus = ref<RequestStatus>('idle')
  const error = ref<string | null>(null)

  const featuredProfiles = computed(() => payload.value?.featuredProfiles ?? [])
  const recentProfiles = computed(() => payload.value?.recentProfiles ?? [])
  const stacks = computed(() => payload.value?.stacks ?? [])

  function clearState() {
    payload.value = null
    loadStatus.value = 'idle'
    error.value = null
  }

  async function loadHomePublicPayload() {
    error.value = null
    loadStatus.value = 'loading'

    try {
      const data = await homePublicService.getHomePublicData()
      payload.value = data
      loadStatus.value = 'success'
    } catch (err) {
      payload.value = null
      loadStatus.value = 'error'
      error.value = err instanceof Error ? err.message : 'Erro ao carregar a home pública.'
      throw err
    }
  }

  return {
    payload,
    featuredProfiles,
    recentProfiles,
    stacks,
    loadStatus,
    error,
    clearState,
    loadHomePublicPayload,
  }
})
