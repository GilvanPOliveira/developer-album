import { isDemoMode } from '../../../config/app-mode'
import { demoPublicProfileDetailsService } from './public-profile-details.service.demo'
import { supabasePublicProfileDetailsService } from './public-profile-details.service.supabase'

export type PublicProfileProjectPreview = {
  id: string
  title: string
  slug: string
  description: string
  projectUrl: string | null
  repoUrl: string | null
  isFeatured: boolean
  stackNames: string[]
}

export type PublicProfileDetails = {
  id: string
  username: string
  fullName: string
  headline: string
  bio: string
  avatarUrl: string
  location: string | null
  websiteUrl: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  portfolioUrl: string | null
  primaryStacks: string[]
  projects: PublicProfileProjectPreview[]
}

export type PublicProfileDetailsService = {
  getByUsername: (username: string) => Promise<PublicProfileDetails | null>
}

export const publicProfileDetailsService: PublicProfileDetailsService = isDemoMode
  ? demoPublicProfileDetailsService
  : supabasePublicProfileDetailsService

export default publicProfileDetailsService
