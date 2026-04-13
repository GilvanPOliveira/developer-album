import { demoProjects } from '../../../features/demo/demo-data'
import type { ProjectItem, ProjectsService } from './projects.service'

function mapDemoProject(project: (typeof demoProjects)[number]): ProjectItem {
  const now = new Date().toISOString()

  return {
    id: project.id,
    profileId: project.profileId,
    title: project.title,
    slug: project.slug,
    description: project.description,
    coverImageUrl: null,
    projectUrl: project.projectUrl || null,
    repoUrl: project.repoUrl || null,
    isFeatured: project.isFeatured,
    visibility: project.visibility,
    createdAt: now,
    updatedAt: now,
  }
}

function findProjectIndex(projectId: string): number {
  return demoProjects.findIndex((project) => project.id === projectId)
}

function ensureUniqueSlug(profileId: string, slug: string, ignoreProjectId?: string): void {
  const normalizedSlug = slug.trim().toLowerCase()

  const existing = demoProjects.find(
    (project) =>
      project.profileId === profileId &&
      project.id !== ignoreProjectId &&
      project.slug.trim().toLowerCase() === normalizedSlug,
  )

  if (existing) {
    throw new Error('Já existe um projeto com este slug para este perfil no modo demo.')
  }
}

export const demoProjectsService: ProjectsService = {
  async listMyProjects(profileId) {
    return demoProjects
      .filter((project) => project.profileId === profileId)
      .map(mapDemoProject)
  },

  async listPublicProjectsByProfileId(profileId) {
    return demoProjects
      .filter((project) => project.profileId === profileId && project.visibility === 'public')
      .map(mapDemoProject)
  },

  async getProjectById(projectId) {
    const project = demoProjects.find((item) => item.id === projectId)
    return project ? mapDemoProject(project) : null
  },

  async createProject(profileId, input) {
    ensureUniqueSlug(profileId, input.slug)

    const createdProject = {
      id: `demo-project-${crypto.randomUUID()}`,
      profileId,
      title: input.title,
      slug: input.slug,
      description: input.description,
      projectUrl: input.projectUrl ?? '',
      repoUrl: input.repoUrl ?? '',
      isFeatured: input.isFeatured,
      visibility: input.visibility,
      stackSlugs: [],
    }

    demoProjects.unshift(createdProject)

    return mapDemoProject(createdProject)
  },

  async updateProject(projectId, profileId, input) {
    const projectIndex = findProjectIndex(projectId)

    if (projectIndex === -1) {
      throw new Error('Projeto demo não encontrado.')
    }

    const existingProject = demoProjects[projectIndex]

    if (existingProject.profileId !== profileId) {
      throw new Error('Você não pode editar este projeto no modo demo.')
    }

    ensureUniqueSlug(profileId, input.slug, projectId)

    demoProjects[projectIndex] = {
      ...existingProject,
      title: input.title,
      slug: input.slug,
      description: input.description,
      projectUrl: input.projectUrl ?? '',
      repoUrl: input.repoUrl ?? '',
      isFeatured: input.isFeatured,
      visibility: input.visibility,
    }

    return mapDemoProject(demoProjects[projectIndex])
  },

  async deleteProject(projectId, profileId) {
    const projectIndex = findProjectIndex(projectId)

    if (projectIndex === -1) {
      throw new Error('Projeto demo não encontrado.')
    }

    const existingProject = demoProjects[projectIndex]

    if (existingProject.profileId !== profileId) {
      throw new Error('Você não pode excluir este projeto no modo demo.')
    }

    demoProjects.splice(projectIndex, 1)
  },
}
