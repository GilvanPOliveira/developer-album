import { isDemoMode } from '../../../config/app-mode'
import { demoHomePublicService } from './home-public.service.demo'
import { supabaseHomePublicService } from './home-public.service.supabase'
import type { Profile } from './profiles.service'

export type HomePublicDeveloperCard = {
  id: string
  username: string
  fullName: string
  headline: string
  avatarUrl: string
  location: string | null
  primaryStacks: string[]
  isPublic: boolean
}

export type HomePublicData = {
  featuredProfiles: HomePublicDeveloperCard[]
  recentProfiles: HomePublicDeveloperCard[]
  stacks: string[]
}

export type HomePublicService = {
  getHomePublicData: () => Promise<HomePublicData>
}

export function mapProfileToHomeCard(profile: Profile, primaryStacks: string[] = []): HomePublicDeveloperCard {
  return {
    id: profile.id,
    username: profile.username,
    fullName: profile.fullName,
    headline: profile.headline,
    avatarUrl: profile.avatarUrl,
    location: profile.location,
    primaryStacks,
    isPublic: profile.isPublic,
  }
}

export const homePublicService: HomePublicService = isDemoMode
  ? demoHomePublicService
  : supabaseHomePublicService

export default homePublicService
