import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { githubUsersService } from '../features/github/services/github-users.service'
import type { RequestStatus } from '../types/api'
import type { GithubUser } from '../types/domain'

export const useExploreStore = defineStore('explore', () => {
  const DEFAULT_PER_PAGE = 3
  const results = ref<GithubUser[]>([])
  const search = ref('')
  const loadStatus = ref<RequestStatus>('idle')
  const error = ref<string | null>(null)
  const totalCount = ref(0)
  const incompleteResults = ref(false)
  const hasSearched = ref(false)
  const currentPage = ref(1)
  const perPage = ref(DEFAULT_PER_PAGE)
  const totalPages = ref(0)

  const hasResults = computed(() => results.value.length > 0)

  function clearState() {
    results.value = []
    search.value = ''
    loadStatus.value = 'idle'
    error.value = null
    totalCount.value = 0
    incompleteResults.value = false
    hasSearched.value = false
    currentPage.value = 1
    perPage.value = DEFAULT_PER_PAGE
    totalPages.value = 0
  }

  async function searchGithubUsers(query?: string, page = 1) {
    const nextQuery = (query ?? search.value).trim()

    search.value = nextQuery
    error.value = null
    hasSearched.value = true
    currentPage.value = page

    if (!nextQuery) {
      results.value = []
      totalCount.value = 0
      incompleteResults.value = false
      currentPage.value = 1
      perPage.value = DEFAULT_PER_PAGE
      totalPages.value = 0
      loadStatus.value = 'success'
      return
    }

    loadStatus.value = 'loading'

    try {
      const payload = await githubUsersService.searchUsers(nextQuery, page)

      results.value = payload.items
      totalCount.value = payload.totalCount
      incompleteResults.value = payload.incompleteResults
      currentPage.value = payload.currentPage
      perPage.value = payload.perPage
      totalPages.value = payload.totalPages

      loadStatus.value = 'success'
    } catch (err) {
      results.value = []
      totalCount.value = 0
      incompleteResults.value = false
      currentPage.value = 1
      perPage.value = DEFAULT_PER_PAGE
      totalPages.value = 0
      loadStatus.value = 'error'
      error.value = err instanceof Error ? err.message : 'Erro ao consultar usuários no GitHub.'
      throw err
    }
  }

  return {
    results,
    search,
    loadStatus,
    error,
    totalCount,
    incompleteResults,
    hasSearched,
    hasResults,
    currentPage,
    perPage,
    totalPages,
    clearState,
    searchGithubUsers,
  }
})
