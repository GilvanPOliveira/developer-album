import { getSupabaseClient } from '../../../lib/supabase/client'
import type { ProjectItem, ProjectsService, SaveProjectInput } from './projects.service'

type SupabaseProjectRow = {
  id: string
  profile_id: string
  title: string | null
  slug: string | null
  description: string | null
  cover_image_url: string | null
  project_url: string | null
  repo_url: string | null
  is_featured: boolean | null
  visibility: string | null
  created_at: string | null
  updated_at: string | null
}

function mapProject(row: SupabaseProjectRow): ProjectItem {
  return {
    id: row.id,
    profileId: row.profile_id,
    title: row.title ?? '',
    slug: row.slug ?? '',
    description: row.description ?? '',
    coverImageUrl: row.cover_image_url,
    projectUrl: row.project_url,
    repoUrl: row.repo_url,
    isFeatured: row.is_featured ?? false,
    visibility: (row.visibility as ProjectItem['visibility']) ?? 'public',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapInput(profileId: string, input: SaveProjectInput) {
  return {
    profile_id: profileId,
    title: input.title,
    slug: input.slug,
    description: input.description,
    cover_image_url: input.coverImageUrl ?? null,
    project_url: input.projectUrl ?? null,
    repo_url: input.repoUrl ?? null,
    is_featured: input.isFeatured,
    visibility: input.visibility,
  }
}

export const supabaseProjectsService: ProjectsService = {
  async listMyProjects(profileId) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('projects')
      .select(
        'id, profile_id, title, slug, description, cover_image_url, project_url, repo_url, is_featured, visibility, created_at, updated_at',
      )
      .eq('profile_id', profileId)
      .order('updated_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return ((data as SupabaseProjectRow[] | null) ?? []).map(mapProject)
  },

  async listPublicProjectsByProfileId(profileId) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('projects')
      .select(
        'id, profile_id, title, slug, description, cover_image_url, project_url, repo_url, is_featured, visibility, created_at, updated_at',
      )
      .eq('profile_id', profileId)
      .eq('visibility', 'public')
      .order('updated_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return ((data as SupabaseProjectRow[] | null) ?? []).map(mapProject)
  },

  async getProjectById(projectId) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('projects')
      .select(
        'id, profile_id, title, slug, description, cover_image_url, project_url, repo_url, is_featured, visibility, created_at, updated_at',
      )
      .eq('id', projectId)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    return data ? mapProject(data as SupabaseProjectRow) : null
  },

  async createProject(profileId, input) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('projects')
      .insert(mapInput(profileId, input))
      .select(
        'id, profile_id, title, slug, description, cover_image_url, project_url, repo_url, is_featured, visibility, created_at, updated_at',
      )
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return mapProject(data as SupabaseProjectRow)
  },

  async updateProject(projectId, profileId, input) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('projects')
      .update(mapInput(profileId, input))
      .eq('id', projectId)
      .eq('profile_id', profileId)
      .select(
        'id, profile_id, title, slug, description, cover_image_url, project_url, repo_url, is_featured, visibility, created_at, updated_at',
      )
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return mapProject(data as SupabaseProjectRow)
  },

  async deleteProject(projectId, profileId) {
    const supabase = getSupabaseClient()

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('profile_id', profileId)

    if (error) {
      throw new Error(error.message)
    }
  },
}
