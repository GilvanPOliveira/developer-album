import { isDemoMode } from '../../../config/app-mode'
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

export const profileStacksService: ProfileStacksService = isDemoMode
  ? demoProfileStacksService
  : supabaseProfileStacksService

export default profileStacksService
