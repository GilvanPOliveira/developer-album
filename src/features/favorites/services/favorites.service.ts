import { getAppMode } from '../../../config/app-mode'
import { demoFavoritesService } from './favorites.service.demo'
import { supabaseFavoritesService } from './favorites.service.supabase'

export type FavoriteItem = {
  id: string
  ownerProfileId: string
  targetProfileId: string
  username: string
  fullName: string
  headline: string
  avatarUrl: string
  location: string | null
  createdAt: string | null
}

export type FavoritesService = {
  listMyFavorites: (ownerProfileId: string) => Promise<FavoriteItem[]>
  addFavorite: (ownerProfileId: string, targetProfileId: string) => Promise<void>
  removeFavorite: (ownerProfileId: string, targetProfileId: string) => Promise<void>
  isFavorite: (ownerProfileId: string, targetProfileId: string) => Promise<boolean>
}

function getActiveFavoritesService(): FavoritesService {
  return getAppMode() === 'demo' ? demoFavoritesService : supabaseFavoritesService
}

export const favoritesService: FavoritesService = {
  listMyFavorites(ownerProfileId) {
    return getActiveFavoritesService().listMyFavorites(ownerProfileId)
  },
  addFavorite(ownerProfileId, targetProfileId) {
    return getActiveFavoritesService().addFavorite(ownerProfileId, targetProfileId)
  },
  removeFavorite(ownerProfileId, targetProfileId) {
    return getActiveFavoritesService().removeFavorite(ownerProfileId, targetProfileId)
  },
  isFavorite(ownerProfileId, targetProfileId) {
    return getActiveFavoritesService().isFavorite(ownerProfileId, targetProfileId)
  },
}

export default favoritesService
