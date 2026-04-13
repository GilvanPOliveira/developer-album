import { storeToRefs } from 'pinia'
import { useAlbumsStore } from '../stores/albums.store'
import type { CreateAlbumInput, UpdateAlbumInput } from '../features/albums/services/albums.service'
import type { GithubUser } from '../types/domain'

export function useAlbums() {
  const albumsStore = useAlbumsStore()
  const { albums, defaultAlbum, isLoading, isSaving, error } = storeToRefs(albumsStore)

  async function createAlbum(input: CreateAlbumInput) {
    return albumsStore.createAlbum(input)
  }

  async function updateAlbum(albumId: string, input: UpdateAlbumInput) {
    return albumsStore.updateAlbum(albumId, input)
  }

  async function addGithubUserToDefaultAlbum(githubUser: GithubUser) {
    return albumsStore.addGithubUserToDefaultAlbum(githubUser)
  }

  async function removeGithubUserFromDefaultAlbum(githubUserId: number) {
    return albumsStore.removeGithubUserFromDefaultAlbum(githubUserId)
  }

  return {
    albums,
    defaultAlbum,
    isLoading,
    isSaving,
    error,
    loadMyAlbums: albumsStore.loadMyAlbums,
    loadDefaultAlbum: albumsStore.loadDefaultAlbum,
    createAlbum,
    updateAlbum,
    deleteAlbum: albumsStore.deleteAlbum,
    addProfileToAlbum: albumsStore.addProfileToAlbum,
    removeProfileFromAlbum: albumsStore.removeProfileFromAlbum,
    isProfileInDefaultAlbum: albumsStore.isProfileInDefaultAlbum,
    addGithubUserToDefaultAlbum,
    removeGithubUserFromDefaultAlbum,
    isGithubUserInDefaultAlbum: albumsStore.isGithubUserInDefaultAlbum,
    clearState: albumsStore.clearState,
  }
}
