import { storeToRefs } from 'pinia'
import { useExploreStore } from '../stores/explore.store'

export function useExplore() {
  const exploreStore = useExploreStore()

  const {
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
  } = storeToRefs(exploreStore)

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
    clearState: exploreStore.clearState,
    searchGithubUsers: exploreStore.searchGithubUsers,
  }
}
