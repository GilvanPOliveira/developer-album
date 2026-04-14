import { getAppMode } from '../../../config/app-mode'
import type { GithubUser } from '../../../types/domain'
import { demoAlbumsService } from './albums.service.demo'
import { supabaseAlbumsService } from './albums.service.supabase'

export type AlbumItemSource = 'platform' | 'github'

export type AlbumItem = {
  id: string
  source: AlbumItemSource
  profileId: string | null
  username: string | null
  fullName: string | null
  headline: string | null
  avatarUrl: string | null
  location: string | null
  addedAt: string | null

  githubUserId?: number | null
  githubLogin?: string | null
  githubName?: string | null
  githubHtmlUrl?: string | null
  githubBio?: string | null
  githubCompany?: string | null
  githubBlog?: string | null
  githubPublicRepos?: number
  githubFollowers?: number
  githubFollowing?: number
  githubTotalStars?: number
  githubTwitterUsername?: string | null
  lastSyncedAt?: string | null
}

export type Album = {
  id: string
  ownerProfileId: string
  name: string
  description: string | null
  isDefault: boolean
  isPublic: boolean
  items: AlbumItem[]
  createdAt: string | null
  updatedAt: string | null
}

export type CreateAlbumInput = {
  name: string
  description?: string | null
  isDefault?: boolean
  isPublic?: boolean
}

export type UpdateAlbumInput = {
  name: string
  description?: string | null
  isPublic?: boolean
}

export type AlbumsService = {
  listMyAlbums: (ownerProfileId: string) => Promise<Album[]>
  getDefaultAlbum: (ownerProfileId: string) => Promise<Album | null>
  createAlbum: (ownerProfileId: string, input: CreateAlbumInput) => Promise<Album>
  updateAlbum: (albumId: string, ownerProfileId: string, input: UpdateAlbumInput) => Promise<Album>
  deleteAlbum: (albumId: string, ownerProfileId: string) => Promise<void>
  addProfileToAlbum: (albumId: string, ownerProfileId: string, collectedProfileId: string) => Promise<void>
  removeProfileFromAlbum: (albumId: string, ownerProfileId: string, collectedProfileId: string) => Promise<void>
  isProfileInAlbum: (albumId: string, collectedProfileId: string) => Promise<boolean>

  addGithubUserToAlbum?: (albumId: string, ownerProfileId: string, githubUser: GithubUser) => Promise<void>
  removeGithubUserFromAlbum?: (albumId: string, ownerProfileId: string, githubUserId: number) => Promise<void>
  isGithubUserInAlbum?: (albumId: string, githubUserId: number) => Promise<boolean>
}

function getActiveAlbumsService(): AlbumsService {
  return getAppMode() === 'demo' ? demoAlbumsService : supabaseAlbumsService
}

export const albumsService: AlbumsService = {
  listMyAlbums(ownerProfileId) {
    return getActiveAlbumsService().listMyAlbums(ownerProfileId)
  },
  getDefaultAlbum(ownerProfileId) {
    return getActiveAlbumsService().getDefaultAlbum(ownerProfileId)
  },
  createAlbum(ownerProfileId, input) {
    return getActiveAlbumsService().createAlbum(ownerProfileId, input)
  },
  updateAlbum(albumId, ownerProfileId, input) {
    return getActiveAlbumsService().updateAlbum(albumId, ownerProfileId, input)
  },
  deleteAlbum(albumId, ownerProfileId) {
    return getActiveAlbumsService().deleteAlbum(albumId, ownerProfileId)
  },
  addProfileToAlbum(albumId, ownerProfileId, collectedProfileId) {
    return getActiveAlbumsService().addProfileToAlbum(albumId, ownerProfileId, collectedProfileId)
  },
  removeProfileFromAlbum(albumId, ownerProfileId, collectedProfileId) {
    return getActiveAlbumsService().removeProfileFromAlbum(albumId, ownerProfileId, collectedProfileId)
  },
  isProfileInAlbum(albumId, collectedProfileId) {
    return getActiveAlbumsService().isProfileInAlbum(albumId, collectedProfileId)
  },
  addGithubUserToAlbum(albumId, ownerProfileId, githubUser) {
    return getActiveAlbumsService().addGithubUserToAlbum!(albumId, ownerProfileId, githubUser)
  },
  removeGithubUserFromAlbum(albumId, ownerProfileId, githubUserId) {
    return getActiveAlbumsService().removeGithubUserFromAlbum!(albumId, ownerProfileId, githubUserId)
  },
  isGithubUserInAlbum(albumId, githubUserId) {
    return getActiveAlbumsService().isGithubUserInAlbum!(albumId, githubUserId)
  },
}

export default albumsService
