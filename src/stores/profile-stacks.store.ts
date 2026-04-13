import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { stacksService, type StackItem } from '../features/profiles/services/stacks.service'
import {
  profileStacksService,
  type ProfileStackItem,
  type SaveProfileStacksInput,
} from '../features/profiles/services/profile-stacks.service'
import type { RequestStatus } from '../types/api'

export const useProfileStacksStore = defineStore('profile-stacks', () => {
  const availableStacks = ref<StackItem[]>([])
  const profileStacks = ref<ProfileStackItem[]>([])
  const loadStatus = ref<RequestStatus>('idle')
  const saveStatus = ref<RequestStatus>('idle')
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  const selectedStackIds = computed(() => profileStacks.value.map((item) => item.stackId))
  const primaryStackIds = computed(() =>
    profileStacks.value.filter((item) => item.isPrimary).map((item) => item.stackId),
  )
  const orderedSelectedStacks = computed(() =>
    [...profileStacks.value].sort((a, b) => a.orderIndex - b.orderIndex),
  )

  function clearFeedback() {
    error.value = null
    successMessage.value = null
  }

  function clearState() {
    availableStacks.value = []
    profileStacks.value = []
    loadStatus.value = 'idle'
    saveStatus.value = 'idle'
    clearFeedback()
  }

  async function loadAvailableStacks() {
    clearFeedback()

    try {
      const stacks = await stacksService.listStacks()
      availableStacks.value = stacks
      return stacks
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar stacks.'
      throw err
    }
  }

  async function loadProfileStacks(profileId: string) {
    clearFeedback()
    loadStatus.value = 'loading'

    try {
      const items = await profileStacksService.listProfileStacks(profileId)
      profileStacks.value = items
      loadStatus.value = 'success'
      return items
    } catch (err) {
      loadStatus.value = 'error'
      error.value = err instanceof Error ? err.message : 'Erro ao carregar stacks do perfil.'
      throw err
    }
  }

  async function bootstrap(profileId: string) {
    loadStatus.value = 'loading'
    clearFeedback()

    try {
      await Promise.all([
        loadAvailableStacks(),
        loadProfileStacks(profileId),
      ])

      loadStatus.value = 'success'
    } catch (err) {
      loadStatus.value = 'error'
      error.value = err instanceof Error ? err.message : 'Erro ao carregar stacks.'
      throw err
    }
  }

  async function saveMyProfileStacks(profileId: string, selections: SaveProfileStacksInput) {
    clearFeedback()
    saveStatus.value = 'loading'

    try {
      const items = await profileStacksService.saveProfileStacks(profileId, selections)
      profileStacks.value = items
      saveStatus.value = 'success'
      successMessage.value = 'Stacks atualizadas com sucesso.'
      return items
    } catch (err) {
      saveStatus.value = 'error'
      error.value = err instanceof Error ? err.message : 'Erro ao salvar stacks.'
      throw err
    }
  }

  return {
    availableStacks,
    profileStacks,
    loadStatus,
    saveStatus,
    error,
    successMessage,
    selectedStackIds,
    primaryStackIds,
    orderedSelectedStacks,
    clearFeedback,
    clearState,
    loadAvailableStacks,
    loadProfileStacks,
    bootstrap,
    saveMyProfileStacks,
  }
})
