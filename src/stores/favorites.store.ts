import { ref } from 'vue'
import { defineStore } from 'pinia'
import { favoritesService, type FavoriteItem } from '../features/favorites/services/favorites.service'
import { useProfileStore } from './profile.store'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<FavoriteItem[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  const profileStore = useProfileStore()

  async function loadMyFavorites(): Promise<FavoriteItem[]> {
    if (!profileStore.profileId) {
      favorites.value = []
      return []
    }

    isLoading.value = true
    error.value = null

    try {
      const items = await favoritesService.listMyFavorites(profileStore.profileId)
      favorites.value = items
      return items
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao carregar favoritos.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function addFavorite(targetProfileId: string): Promise<void> {
    if (!profileStore.profileId) {
      throw new Error('Perfil não carregado.')
    }

    isSaving.value = true
    error.value = null

    try {
      await favoritesService.addFavorite(profileStore.profileId, targetProfileId)
      await loadMyFavorites()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao favoritar perfil.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function removeFavorite(targetProfileId: string): Promise<void> {
    if (!profileStore.profileId) {
      throw new Error('Perfil não carregado.')
    }

    isSaving.value = true
    error.value = null

    try {
      await favoritesService.removeFavorite(profileStore.profileId, targetProfileId)
      await loadMyFavorites()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao remover favorito.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function isFavorite(targetProfileId: string): Promise<boolean> {
    if (!profileStore.profileId) {
      return false
    }

    return favoritesService.isFavorite(profileStore.profileId, targetProfileId)
  }

  function clearState(): void {
    favorites.value = []
    error.value = null
  }

  return {
    favorites,
    isLoading,
    isSaving,
    error,
    loadMyFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearState,
  }
})
