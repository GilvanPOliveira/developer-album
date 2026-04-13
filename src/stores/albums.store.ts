import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  albumsService,
  type Album,
  type CreateAlbumInput,
  type UpdateAlbumInput,
} from '../features/albums/services/albums.service'
import type { GithubUser } from '../types/domain'
import { useProfileStore } from './profile.store'

export const useAlbumsStore = defineStore('albums', () => {
  const albums = ref<Album[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  const profileStore = useProfileStore()

  const defaultAlbum = computed(() => albums.value.find((album) => album.isDefault) ?? null)

  function upsertAlbumInState(album: Album): void {
    const existingIndex = albums.value.findIndex((item) => item.id === album.id)

    if (existingIndex >= 0) {
      const next = [...albums.value]
      next[existingIndex] = album
      albums.value = next
      return
    }

    albums.value = [album, ...albums.value]
  }

  async function loadMyAlbums(): Promise<Album[]> {
    if (!profileStore.profileId) {
      albums.value = []
      return []
    }

    isLoading.value = true
    error.value = null

    try {
      const items = await albumsService.listMyAlbums(profileStore.profileId)
      albums.value = items
      return items
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao carregar álbuns.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function loadDefaultAlbum(): Promise<Album | null> {
    if (!profileStore.profileId) {
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const album = await albumsService.getDefaultAlbum(profileStore.profileId)

      if (!album) {
        return null
      }

      upsertAlbumInState(album)

      return album
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao carregar álbum padrão.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createAlbum(input: CreateAlbumInput): Promise<Album> {
    if (!profileStore.profileId) {
      throw new Error('Perfil não carregado.')
    }

    isSaving.value = true
    error.value = null

    try {
      const album = await albumsService.createAlbum(profileStore.profileId, input)
      upsertAlbumInState(album)
      return album
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao criar álbum.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function updateAlbum(albumId: string, input: UpdateAlbumInput): Promise<Album> {
    if (!profileStore.profileId) {
      throw new Error('Perfil não carregado.')
    }

    isSaving.value = true
    error.value = null

    try {
      const album = await albumsService.updateAlbum(albumId, profileStore.profileId, input)
      upsertAlbumInState(album)
      return album
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao atualizar álbum.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function deleteAlbum(albumId: string): Promise<void> {
    if (!profileStore.profileId) {
      throw new Error('Perfil não carregado.')
    }

    isSaving.value = true
    error.value = null

    try {
      await albumsService.deleteAlbum(albumId, profileStore.profileId)
      albums.value = albums.value.filter((album) => album.id !== albumId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao excluir álbum.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function addProfileToAlbum(albumId: string, collectedProfileId: string): Promise<void> {
    if (!profileStore.profileId) {
      throw new Error('Perfil não carregado.')
    }

    isSaving.value = true
    error.value = null

    try {
      await albumsService.addProfileToAlbum(albumId, profileStore.profileId, collectedProfileId)
      await loadDefaultAlbum()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao adicionar perfil ao álbum.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function removeProfileFromAlbum(albumId: string, collectedProfileId: string): Promise<void> {
    if (!profileStore.profileId) {
      throw new Error('Perfil não carregado.')
    }

    isSaving.value = true
    error.value = null

    try {
      await albumsService.removeProfileFromAlbum(albumId, profileStore.profileId, collectedProfileId)
      await loadDefaultAlbum()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao remover perfil do álbum.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function ensureDefaultAlbum(): Promise<Album> {
    if (defaultAlbum.value) {
      return defaultAlbum.value
    }

    const loaded = await loadDefaultAlbum()

    if (loaded) {
      return loaded
    }

    const created = await createAlbum({
      name: 'Meu Álbum',
      description: 'Coleção principal do Developer Album.',
      isDefault: true,
      isPublic: false,
    })

    return albums.value.find((album) => album.id === created.id) ?? created
  }

  async function isProfileInDefaultAlbum(collectedProfileId: string): Promise<boolean> {
    const album = await ensureDefaultAlbum()
    return albumsService.isProfileInAlbum(album.id, collectedProfileId)
  }

  async function addGithubUserToDefaultAlbum(githubUser: GithubUser): Promise<void> {
    if (!profileStore.profileId) {
      throw new Error('Perfil não carregado.')
    }

    if (!albumsService.addGithubUserToAlbum) {
      throw new Error('Adicionar usuário GitHub ao álbum não está disponível nesta configuração.')
    }

    const album = await ensureDefaultAlbum()

    isSaving.value = true
    error.value = null

    try {
      await albumsService.addGithubUserToAlbum(album.id, profileStore.profileId, githubUser)
      await loadDefaultAlbum()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao adicionar usuário GitHub ao álbum.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function removeGithubUserFromDefaultAlbum(githubUserId: number): Promise<void> {
    if (!profileStore.profileId) {
      throw new Error('Perfil não carregado.')
    }

    if (!albumsService.removeGithubUserFromAlbum) {
      throw new Error('Remover usuário GitHub do álbum não está disponível nesta configuração.')
    }

    const album = await ensureDefaultAlbum()

    isSaving.value = true
    error.value = null

    try {
      await albumsService.removeGithubUserFromAlbum(album.id, profileStore.profileId, githubUserId)
      await loadDefaultAlbum()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao remover usuário GitHub do álbum.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function isGithubUserInDefaultAlbum(githubUserId: number): Promise<boolean> {
    if (!albumsService.isGithubUserInAlbum) {
      return false
    }

    const album = await ensureDefaultAlbum()
    return albumsService.isGithubUserInAlbum(album.id, githubUserId)
  }

  function clearState(): void {
    albums.value = []
    error.value = null
  }

  return {
    albums,
    defaultAlbum,
    isLoading,
    isSaving,
    error,
    loadMyAlbums,
    loadDefaultAlbum,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addProfileToAlbum,
    removeProfileFromAlbum,
    isProfileInDefaultAlbum,
    addGithubUserToDefaultAlbum,
    removeGithubUserFromDefaultAlbum,
    isGithubUserInDefaultAlbum,
    clearState,
  }
})
