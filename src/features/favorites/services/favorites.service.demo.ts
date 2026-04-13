import { demoUsers } from '../../../features/demo/demo-data'
import type { FavoriteItem, FavoritesService } from './favorites.service'

type DemoFavoriteRecord = {
  id: string
  ownerProfileId: string
  targetProfileId: string
  createdAt: string
}

const demoFavoritesStore: DemoFavoriteRecord[] = [
  {
    id: 'demo-favorite-1',
    ownerProfileId: 'demo-user-1',
    targetProfileId: 'demo-user-2',
    createdAt: new Date().toISOString(),
  },
]

function mapFavorite(record: DemoFavoriteRecord): FavoriteItem | null {
  const targetProfile = demoUsers.find((item) => item.id === record.targetProfileId)

  if (!targetProfile) {
    return null
  }

  return {
    id: record.id,
    ownerProfileId: record.ownerProfileId,
    targetProfileId: record.targetProfileId,
    username: targetProfile.username,
    fullName: targetProfile.fullName,
    headline: targetProfile.headline,
    avatarUrl: targetProfile.avatarUrl,
    location: targetProfile.location || null,
    createdAt: record.createdAt,
  }
}

export const demoFavoritesService: FavoritesService = {
  async listMyFavorites(ownerProfileId) {
    return demoFavoritesStore
      .filter((item) => item.ownerProfileId === ownerProfileId)
      .map(mapFavorite)
      .filter((item): item is FavoriteItem => Boolean(item))
  },

  async addFavorite(ownerProfileId, targetProfileId) {
    if (ownerProfileId === targetProfileId) {
      throw new Error('Você não pode favoritar o próprio perfil no modo demo.')
    }

    const exists = demoFavoritesStore.find(
      (item) => item.ownerProfileId === ownerProfileId && item.targetProfileId === targetProfileId,
    )

    if (exists) {
      return
    }

    demoFavoritesStore.unshift({
      id: `demo-favorite-${crypto.randomUUID()}`,
      ownerProfileId,
      targetProfileId,
      createdAt: new Date().toISOString(),
    })
  },

  async removeFavorite(ownerProfileId, targetProfileId) {
    const index = demoFavoritesStore.findIndex(
      (item) => item.ownerProfileId === ownerProfileId && item.targetProfileId === targetProfileId,
    )

    if (index >= 0) {
      demoFavoritesStore.splice(index, 1)
    }
  },

  async isFavorite(ownerProfileId, targetProfileId) {
    return demoFavoritesStore.some(
      (item) => item.ownerProfileId === ownerProfileId && item.targetProfileId === targetProfileId,
    )
  },
}
