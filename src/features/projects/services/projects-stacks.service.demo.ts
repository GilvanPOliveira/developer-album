import { demoProjects, demoStacks } from '../../../features/demo/demo-data'
import type {
  ProjectStackItem,
  ProjectsStacksService,
  SaveProjectStacksInput,
} from './projects-stacks.service'

function mapProjectStack(projectId: string, stackSlug: string): ProjectStackItem {
  const stack = demoStacks.find((item) => item.slug === stackSlug)

  if (!stack) {
    throw new Error(`Stack demo não encontrada para o slug: ${stackSlug}`)
  }

  return {
    id: `${projectId}-${stack.id}`,
    projectId,
    stackId: stack.id,
    name: stack.name,
    slug: stack.slug,
    category: stack.category,
  }
}

export const demoProjectsStacksService: ProjectsStacksService = {
  async listProjectStacks(projectId) {
    const project = demoProjects.find((item) => item.id === projectId)

    if (!project) {
      return []
    }

    return project.stackSlugs.map((stackSlug) => mapProjectStack(projectId, stackSlug))
  },

  async saveProjectStacks(projectId, items: SaveProjectStacksInput) {
    const projectIndex = demoProjects.findIndex((item) => item.id === projectId)

    if (projectIndex === -1) {
      throw new Error('Projeto demo não encontrado para salvar stacks.')
    }

    const stackSlugs = items.map((item) => {
      const stack = demoStacks.find((stackItem) => stackItem.id === item.stackId)

      if (!stack) {
        throw new Error(`Stack demo não encontrada para o id: ${item.stackId}`)
      }

      return stack.slug
    })

    demoProjects[projectIndex] = {
      ...demoProjects[projectIndex],
      stackSlugs,
    }

    return stackSlugs.map((stackSlug) => mapProjectStack(projectId, stackSlug))
  },
}
