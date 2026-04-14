import { getAppMode } from '../../../config/app-mode'
import { demoProjectsService } from './projects.service.demo'
import { supabaseProjectsService } from './projects.service.supabase'

export type ProjectVisibility = 'public' | 'private'

export type ProjectItem = {
  id: string
  profileId: string
  title: string
  slug: string
  description: string
  coverImageUrl: string | null
  projectUrl: string | null
  repoUrl: string | null
  isFeatured: boolean
  visibility: ProjectVisibility
  createdAt: string | null
  updatedAt: string | null
}

export type SaveProjectInput = {
  title: string
  slug: string
  description: string
  coverImageUrl?: string | null
  projectUrl?: string | null
  repoUrl?: string | null
  isFeatured: boolean
  visibility: ProjectVisibility
}

export type ProjectsService = {
  listMyProjects: (profileId: string) => Promise<ProjectItem[]>
  listPublicProjectsByProfileId: (profileId: string) => Promise<ProjectItem[]>
  getProjectById: (projectId: string) => Promise<ProjectItem | null>
  createProject: (profileId: string, input: SaveProjectInput) => Promise<ProjectItem>
  updateProject: (projectId: string, profileId: string, input: SaveProjectInput) => Promise<ProjectItem>
  deleteProject: (projectId: string, profileId: string) => Promise<void>
}

function getActiveProjectsService(): ProjectsService {
  return getAppMode() === 'demo' ? demoProjectsService : supabaseProjectsService
}

export const projectsService: ProjectsService = {
  listMyProjects(profileId) {
    return getActiveProjectsService().listMyProjects(profileId)
  },
  listPublicProjectsByProfileId(profileId) {
    return getActiveProjectsService().listPublicProjectsByProfileId(profileId)
  },
  getProjectById(projectId) {
    return getActiveProjectsService().getProjectById(projectId)
  },
  createProject(profileId, input) {
    return getActiveProjectsService().createProject(profileId, input)
  },
  updateProject(projectId, profileId, input) {
    return getActiveProjectsService().updateProject(projectId, profileId, input)
  },
  deleteProject(projectId, profileId) {
    return getActiveProjectsService().deleteProject(projectId, profileId)
  },
}

export default projectsService
