import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '../stores/projects.store'
import type { SaveProjectInput } from '../features/projects/services/projects.service'
import type { SaveProjectStacksInput } from '../features/projects/services/projects-stacks.service'

export function useProjects() {
  const projectsStore = useProjectsStore()
  const { projects, projectStacksMap, isLoading, isSaving, error } = storeToRefs(projectsStore)

  const featuredProjects = computed(() => projects.value.filter((project) => project.isFeatured))

  function getProjectStacks(projectId: string) {
    return computed(() => projectStacksMap.value[projectId] ?? [])
  }

  async function createProject(input: SaveProjectInput) {
    return projectsStore.createProject(input)
  }

  async function updateProject(projectId: string, input: SaveProjectInput) {
    return projectsStore.updateProject(projectId, input)
  }

  async function saveProjectStacks(projectId: string, items: SaveProjectStacksInput) {
    return projectsStore.saveProjectStacks(projectId, items)
  }

  return {
    projects,
    featuredProjects,
    projectStacksMap,
    isLoading,
    isSaving,
    error,
    getProjectStacks,
    loadMyProjects: projectsStore.loadMyProjects,
    createProject,
    updateProject,
    deleteProject: projectsStore.deleteProject,
    loadProjectStacks: projectsStore.loadProjectStacks,
    saveProjectStacks,
    clearState: projectsStore.clearState,
  }
}
