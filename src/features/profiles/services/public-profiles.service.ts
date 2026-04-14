import { getAppMode } from '../../../config/app-mode'
import { demoPublicProfilesService } from './public-profiles.service.demo'
import { supabasePublicProfilesService } from './public-profiles.service.supabase'

export type PublicProfilesQuery = {
  search?: string
  stack?: string | null
  page?: number
  perPage?: number
}

export type PublicProfileListItem = {
  id: string
  username: string
  fullName: string
  headline: string
  avatarUrl: string
  location: string | null
  primaryStacks: string[]
}

export type PublicProfilesResult = {
  items: PublicProfileListItem[]
  page: number
  perPage: number
  total: number
  totalPages: number
}

export type PublicProfilesService = {
  listPublicProfiles: (query?: PublicProfilesQuery) => Promise<PublicProfilesResult>
}

function getActivePublicProfilesService(): PublicProfilesService {
  return getAppMode() === 'demo' ? demoPublicProfilesService : supabasePublicProfilesService
}

export const publicProfilesService: PublicProfilesService = {
  listPublicProfiles(query) {
    return getActivePublicProfilesService().listPublicProfiles(query)
  },
}

export default publicProfilesService
