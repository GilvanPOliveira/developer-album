import { getAppMode } from '../../../config/app-mode'
import { demoProfilesService } from './profiles.service.demo'
import { supabaseProfilesService } from './profiles.service.supabase'

export type ProfileAvailabilityStatus = 'available' | 'open-to-work' | 'busy' | 'unavailable' | null

export type Profile = {
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
  isPublic: boolean
  availabilityStatus: ProfileAvailabilityStatus
  createdAt: string | null
  updatedAt: string | null
}

export type UpsertProfileInput = {
  username: string
  fullName: string
  headline: string
  bio: string
  avatarUrl: string
  location?: string | null
  websiteUrl?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  portfolioUrl?: string | null
  isPublic: boolean
  availabilityStatus?: ProfileAvailabilityStatus
}

export type ProfilesService = {
  getMyProfile: (userId: string) => Promise<Profile | null>
  getProfileById: (profileId: string) => Promise<Profile | null>
  createProfile: (userId: string, input: UpsertProfileInput) => Promise<Profile>
  updateMyProfile: (userId: string, input: UpsertProfileInput) => Promise<Profile>
}

function getActiveProfilesService(): ProfilesService {
  return getAppMode() === 'demo' ? demoProfilesService : supabaseProfilesService
}

export const profilesService: ProfilesService = {
  getMyProfile(userId) {
    return getActiveProfilesService().getMyProfile(userId)
  },
  getProfileById(profileId) {
    return getActiveProfilesService().getProfileById(profileId)
  },
  createProfile(userId, input) {
    return getActiveProfilesService().createProfile(userId, input)
  },
  updateMyProfile(userId, input) {
    return getActiveProfilesService().updateMyProfile(userId, input)
  },
}

export default profilesService
