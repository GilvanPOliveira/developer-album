import { getSupabaseClient } from '../../../lib/supabase/client'
import type { Profile, ProfilesService, UpsertProfileInput } from './profiles.service'

type SupabaseProfileRow = {
  id: string
  username: string
  full_name: string | null
  headline: string | null
  bio: string | null
  avatar_url: string | null
  location: string | null
  website_url: string | null
  github_url: string | null
  linkedin_url: string | null
  portfolio_url: string | null
  is_public: boolean | null
  availability_status: string | null
  created_at: string | null
  updated_at: string | null
}

function mapProfile(row: SupabaseProfileRow): Profile {
  return {
    id: row.id,
    username: row.username,
    fullName: row.full_name ?? '',
    headline: row.headline ?? '',
    bio: row.bio ?? '',
    avatarUrl: row.avatar_url ?? '',
    location: row.location,
    websiteUrl: row.website_url,
    githubUrl: row.github_url,
    linkedinUrl: row.linkedin_url,
    portfolioUrl: row.portfolio_url,
    isPublic: row.is_public ?? true,
    availabilityStatus: (row.availability_status as Profile['availabilityStatus']) ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapInput(userId: string, input: UpsertProfileInput) {
  return {
    id: userId,
    username: input.username,
    full_name: input.fullName,
    headline: input.headline,
    bio: input.bio,
    avatar_url: input.avatarUrl,
    location: input.location ?? null,
    website_url: input.websiteUrl ?? null,
    github_url: input.githubUrl ?? null,
    linkedin_url: input.linkedinUrl ?? null,
    portfolio_url: input.portfolioUrl ?? null,
    is_public: input.isPublic,
    availability_status: input.availabilityStatus ?? null,
  }
}

export const supabaseProfilesService: ProfilesService = {
  async getMyProfile(userId) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('profiles')
      .select(
        'id, username, full_name, headline, bio, avatar_url, location, website_url, github_url, linkedin_url, portfolio_url, is_public, availability_status, created_at, updated_at',
      )
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    return data ? mapProfile(data as SupabaseProfileRow) : null
  },

  async getProfileById(profileId) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('profiles')
      .select(
        'id, username, full_name, headline, bio, avatar_url, location, website_url, github_url, linkedin_url, portfolio_url, is_public, availability_status, created_at, updated_at',
      )
      .eq('id', profileId)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    return data ? mapProfile(data as SupabaseProfileRow) : null
  },

  async createProfile(userId, input) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('profiles')
      .upsert(mapInput(userId, input), { onConflict: 'id' })
      .select(
        'id, username, full_name, headline, bio, avatar_url, location, website_url, github_url, linkedin_url, portfolio_url, is_public, availability_status, created_at, updated_at',
      )
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return mapProfile(data as SupabaseProfileRow)
  },

  async updateMyProfile(userId, input) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('profiles')
      .update(mapInput(userId, input))
      .eq('id', userId)
      .select(
        'id, username, full_name, headline, bio, avatar_url, location, website_url, github_url, linkedin_url, portfolio_url, is_public, availability_status, created_at, updated_at',
      )
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return mapProfile(data as SupabaseProfileRow)
  },
}
