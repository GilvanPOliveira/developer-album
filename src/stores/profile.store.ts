import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  profilesService,
  type Profile,
  type UpsertProfileInput,
} from '../features/profiles/services/profiles.service'
import {
  profileStacksService,
  type ProfileStackItem,
  type SaveProfileStacksInput,
} from '../features/profiles/services/profile-stacks.service'
import { stacksService, type StackItem } from '../features/profiles/services/stacks.service'
import { useAuthStore } from './auth.store'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile | null>(null)
  const profileStacks = ref<ProfileStackItem[]>([])
  const stacksCatalog = ref<StackItem[]>([])

  const isLoadingProfile = ref(false)
  const isSavingProfile = ref(false)
  const isLoadingStacks = ref(false)
  const error = ref<string | null>(null)

  const authStore = useAuthStore()

  const hasProfile = computed(() => Boolean(profile.value))
  const profileId = computed(() => profile.value?.id ?? null)

  async function loadMyProfile(): Promise<Profile | null> {
    if (!authStore.userId) {
      profile.value = null
      profileStacks.value = []
      return null
    }

    isLoadingProfile.value = true
    error.value = null

    try {
      const loadedProfile = await profilesService.getMyProfile(authStore.userId)
      profile.value = loadedProfile

      if (loadedProfile) {
        profileStacks.value = await profileStacksService.listProfileStacks(loadedProfile.id)
      } else {
        profileStacks.value = []
      }

      return loadedProfile
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao carregar perfil.'
      throw err
    } finally {
      isLoadingProfile.value = false
    }
  }

  async function loadStacksCatalog(): Promise<StackItem[]> {
    isLoadingStacks.value = true
    error.value = null

    try {
      const items = await stacksService.listStacks()
      stacksCatalog.value = items
      return items
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao carregar stacks.'
      throw err
    } finally {
      isLoadingStacks.value = false
    }
  }

  async function createMyProfile(input: UpsertProfileInput): Promise<Profile> {
    if (!authStore.userId) {
      throw new Error('Usuário não autenticado.')
    }

    isSavingProfile.value = true
    error.value = null

    try {
      const saved = await profilesService.createProfile(authStore.userId, input)
      profile.value = saved
      profileStacks.value = await profileStacksService.listProfileStacks(saved.id)
      return saved
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao criar perfil.'
      throw err
    } finally {
      isSavingProfile.value = false
    }
  }

  async function updateMyProfile(input: UpsertProfileInput): Promise<Profile> {
    if (!authStore.userId) {
      throw new Error('Usuário não autenticado.')
    }

    isSavingProfile.value = true
    error.value = null

    try {
      const saved = await profilesService.updateMyProfile(authStore.userId, input)
      profile.value = saved
      return saved
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao atualizar perfil.'
      throw err
    } finally {
      isSavingProfile.value = false
    }
  }

  async function saveMyProfileStacks(items: SaveProfileStacksInput): Promise<ProfileStackItem[]> {
    if (!profile.value?.id) {
      throw new Error('Perfil não carregado.')
    }

    isSavingProfile.value = true
    error.value = null

    try {
      const saved = await profileStacksService.saveProfileStacks(profile.value.id, items)
      profileStacks.value = saved
      return saved
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao salvar stacks do perfil.'
      throw err
    } finally {
      isSavingProfile.value = false
    }
  }

  function clearProfileState(): void {
    profile.value = null
    profileStacks.value = []
    error.value = null
  }

  function clearError(): void {
    error.value = null
  }

  return {
    profile,
    profileStacks,
    stacksCatalog,
    isLoadingProfile,
    isSavingProfile,
    isLoadingStacks,
    error,
    hasProfile,
    profileId,
    loadMyProfile,
    loadStacksCatalog,
    createMyProfile,
    updateMyProfile,
    saveMyProfileStacks,
    clearProfileState,
    clearError,
  }
})
