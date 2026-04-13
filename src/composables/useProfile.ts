import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '../stores/profile.store'
import type { SaveProfileStacksInput } from '../features/profiles/services/profile-stacks.service'
import type { UpsertProfileInput } from '../features/profiles/services/profiles.service'

export function useProfile() {
  const profileStore = useProfileStore()
  const {
    profile,
    profileStacks,
    stacksCatalog,
    isLoadingProfile,
    isSavingProfile,
    isLoadingStacks,
    error,
    hasProfile,
    profileId,
  } = storeToRefs(profileStore)

  const primaryStacks = computed(() => profileStacks.value.filter((item) => item.isPrimary))

  async function saveProfile(input: UpsertProfileInput) {
    if (profile.value) {
      return profileStore.updateMyProfile(input)
    }

    return profileStore.createMyProfile(input)
  }

  async function saveStacks(items: SaveProfileStacksInput) {
    return profileStore.saveMyProfileStacks(items)
  }

  return {
    profile,
    profileId,
    profileStacks,
    primaryStacks,
    stacksCatalog,
    isLoadingProfile,
    isSavingProfile,
    isLoadingStacks,
    error,
    hasProfile,
    loadMyProfile: profileStore.loadMyProfile,
    loadStacksCatalog: profileStore.loadStacksCatalog,
    saveProfile,
    saveStacks,
    clearProfileState: profileStore.clearProfileState,
    clearError: profileStore.clearError,
  }
}
