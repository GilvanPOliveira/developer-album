import { computed, ref } from 'vue'
import {
  publicProfilesService,
  type PublicProfileListItem,
  type PublicProfilesQuery,
} from '../features/profiles/services/public-profiles.service'

export function usePublicProfiles() {
  const items = ref<PublicProfileListItem[]>([])
  const page = ref(1)
  const perPage = ref(12)
  const total = ref(0)
  const totalPages = ref(1)
  const search = ref('')
  const selectedStack = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasResults = computed(() => items.value.length > 0)

  async function load(query: PublicProfilesQuery = {}) {
    isLoading.value = true
    error.value = null

    try {
      const result = await publicProfilesService.listPublicProfiles({
        search: query.search ?? search.value,
        stack: query.stack ?? selectedStack.value,
        page: query.page ?? page.value,
        perPage: query.perPage ?? perPage.value,
      })

      items.value = result.items
      page.value = result.page
      perPage.value = result.perPage
      total.value = result.total
      totalPages.value = result.totalPages

      if (query.search !== undefined) {
        search.value = query.search
      }

      if (query.stack !== undefined) {
        selectedStack.value = query.stack
      }

      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao carregar perfis públicos.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function nextPage() {
    if (page.value >= totalPages.value) {
      return
    }

    return load({ page: page.value + 1 })
  }

  async function prevPage() {
    if (page.value <= 1) {
      return
    }

    return load({ page: page.value - 1 })
  }

  return {
    items,
    page,
    perPage,
    total,
    totalPages,
    search,
    selectedStack,
    isLoading,
    error,
    hasResults,
    load,
    nextPage,
    prevPage,
  }
}
