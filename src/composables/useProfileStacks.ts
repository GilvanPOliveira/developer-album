import { storeToRefs } from 'pinia'
import { useProfileStacksStore } from '../stores/profile-stacks.store'

export function useProfileStacks() {
  const profileStacksStore = useProfileStacksStore()

  const {
    availableStacks,
    profileStacks,
    loadStatus,
    saveStatus,
    error,
    successMessage,
    selectedStackIds,
    primaryStackIds,
    orderedSelectedStacks,
  } = storeToRefs(profileStacksStore)

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
    clearFeedback: profileStacksStore.clearFeedback,
    clearState: profileStacksStore.clearState,
    loadAvailableStacks: profileStacksStore.loadAvailableStacks,
    loadProfileStacks: profileStacksStore.loadProfileStacks,
    bootstrap: profileStacksStore.bootstrap,
    saveMyProfileStacks: profileStacksStore.saveMyProfileStacks,
  }
}
