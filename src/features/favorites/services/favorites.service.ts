import { isDemoMode } from '../../../config/app-mode'
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

export const favoritesService: FavoritesService = isDemoMode
  ? demoFavoritesService
  : supabaseFavoritesService

export default favoritesService
