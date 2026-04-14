import { getAppMode } from '../../../config/app-mode'
import { demoProjectsStacksService } from './projects-stacks.service.demo'
import { supabaseProjectsStacksService } from './projects-stacks.service.supabase'

export type ProjectStackItem = {
  id: string
  projectId: string
  stackId: string
  name: string
  slug: string
  category: string
}

export type SaveProjectStacksInput = Array<{
  stackId: string
}>

export type ProjectsStacksService = {
  listProjectStacks: (projectId: string) => Promise<ProjectStackItem[]>
  saveProjectStacks: (projectId: string, items: SaveProjectStacksInput) => Promise<ProjectStackItem[]>
}

function getActiveProjectsStacksService(): ProjectsStacksService {
  return getAppMode() === 'demo' ? demoProjectsStacksService : supabaseProjectsStacksService
}

export const projectsStacksService: ProjectsStacksService = {
  listProjectStacks(projectId) {
    return getActiveProjectsStacksService().listProjectStacks(projectId)
  },
  saveProjectStacks(projectId, items) {
    return getActiveProjectsStacksService().saveProjectStacks(projectId, items)
  },
}

export default projectsStacksService
