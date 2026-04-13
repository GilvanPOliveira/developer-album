import { storeToRefs } from 'pinia'
import { useFavoritesStore } from '../stores/favorites.store'

export function useFavorites() {
  const favoritesStore = useFavoritesStore()
  const { favorites, isLoading, isSaving, error } = storeToRefs(favoritesStore)

  return {
    favorites,
    isLoading,
    isSaving,
    error,
    loadMyFavorites: favoritesStore.loadMyFavorites,
    addFavorite: favoritesStore.addFavorite,
    removeFavorite: favoritesStore.removeFavorite,
    isFavorite: favoritesStore.isFavorite,
    clearState: favoritesStore.clearState,
  }
}
