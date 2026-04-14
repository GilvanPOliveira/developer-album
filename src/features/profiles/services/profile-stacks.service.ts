import { getAppMode } from '../../../config/app-mode'
import { demoProfileStacksService } from './profile-stacks.service.demo'
import { supabaseProfileStacksService } from './profile-stacks.service.supabase'

export type ProfileStackItem = {
  id: string
  profileId: string
  stackId: string
  name: string
  slug: string
  category: string
  isPrimary: boolean
  orderIndex: number
}

export type SaveProfileStacksInput = Array<{
  stackId: string
  isPrimary: boolean
  orderIndex: number
}>

export type ProfileStacksService = {
  listProfileStacks: (profileId: string) => Promise<ProfileStackItem[]>
  saveProfileStacks: (profileId: string, items: SaveProfileStacksInput) => Promise<ProfileStackItem[]>
}

function getActiveProfileStacksService(): ProfileStacksService {
  return getAppMode() === 'demo' ? demoProfileStacksService : supabaseProfileStacksService
}

export const profileStacksService: ProfileStacksService = {
  listProfileStacks(profileId) {
    return getActiveProfileStacksService().listProfileStacks(profileId)
  },
  saveProfileStacks(profileId, items) {
    return getActiveProfileStacksService().saveProfileStacks(profileId, items)
  },
}

export default profileStacksService
