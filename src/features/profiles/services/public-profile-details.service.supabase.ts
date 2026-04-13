import { getSupabaseClient } from '../../../lib/supabase/client'
import type { PublicProfileDetails, PublicProfileDetailsService } from './public-profile-details.service'

type SupabaseStackNameRow = {
  name: string | null
}

type SupabaseProfileStackRow = {
  is_primary: boolean | null
  stacks?: SupabaseStackNameRow[] | null
}

type SupabaseProjectStackRow = {
  stacks?: SupabaseStackNameRow[] | null
}

type SupabaseProjectRow = {
  id: string
  title: string | null
  slug: string | null
  description: string | null
  project_url: string | null
  repo_url: string | null
  is_featured: boolean | null
  visibility: string | null
  project_stacks?: SupabaseProjectStackRow[] | null
}

type SupabaseDetailsRow = {
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
  profile_stacks?: SupabaseProfileStackRow[] | null
  projects?: SupabaseProjectRow[] | null
}

export const supabasePublicProfileDetailsService: PublicProfileDetailsService = {
  async getByUsername(username: string): Promise<PublicProfileDetails | null> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
        id,
        username,
        full_name,
        headline,
        bio,
        avatar_url,
        location,
        website_url,
        github_url,
        linkedin_url,
        portfolio_url,
        profile_stacks(is_primary, stacks(name)),
        projects(
          id,
          title,
          slug,
          description,
          project_url,
          repo_url,
          is_featured,
          visibility,
          project_stacks(stacks(name))
        )
      `,
      )
      .eq('is_public', true)
      .eq('username', username)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    if (!data) {
      return null
    }

    const row = data as SupabaseDetailsRow

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
      primaryStacks:
        row.profile_stacks
          ?.filter((item) => item.is_primary)
          .map((item) => item.stacks?.[0]?.name ?? null)
          .filter((value): value is string => Boolean(value)) ?? [],
      projects:
        row.projects
          ?.filter((project) => (project.visibility ?? 'public') === 'public')
          .map((project) => ({
            id: project.id,
            title: project.title ?? '',
            slug: project.slug ?? '',
            description: project.description ?? '',
            projectUrl: project.project_url,
            repoUrl: project.repo_url,
            isFeatured: project.is_featured ?? false,
            stackNames:
              project.project_stacks
                ?.map((item) => item.stacks?.[0]?.name ?? null)
                .filter((value): value is string => Boolean(value)) ?? [],
          })) ?? [],
    }
  },
}
