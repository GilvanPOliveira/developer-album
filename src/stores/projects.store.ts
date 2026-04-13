import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  projectsService,
  type ProjectItem,
  type SaveProjectInput,
} from '../features/projects/services/projects.service'
import {
  projectsStacksService,
  type ProjectStackItem,
  type SaveProjectStacksInput,
} from '../features/projects/services/projects-stacks.service'
import { useProfileStore } from './profile.store'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<ProjectItem[]>([])
  const projectStacksMap = ref<Record<string, ProjectStackItem[]>>({})
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  const profileStore = useProfileStore()

  async function loadMyProjects(): Promise<ProjectItem[]> {
    if (!profileStore.profileId) {
      projects.value = []
      projectStacksMap.value = {}
      return []
    }

    isLoading.value = true
    error.value = null

    try {
      const items = await projectsService.listMyProjects(profileStore.profileId)
      projects.value = items

      const stacksEntries = await Promise.all(
        items.map(async (project) => [project.id, await projectsStacksService.listProjectStacks(project.id)] as const),
      )

      projectStacksMap.value = Object.fromEntries(stacksEntries)
      return items
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao carregar projetos.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createProject(input: SaveProjectInput): Promise<ProjectItem> {
    if (!profileStore.profileId) {
      throw new Error('Perfil não carregado.')
    }

    isSaving.value = true
    error.value = null

    try {
      const created = await projectsService.createProject(profileStore.profileId, input)
      projects.value = [created, ...projects.value]
      projectStacksMap.value[created.id] = []
      return created
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao criar projeto.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function updateProject(projectId: string, input: SaveProjectInput): Promise<ProjectItem> {
    if (!profileStore.profileId) {
      throw new Error('Perfil não carregado.')
    }

    isSaving.value = true
    error.value = null

    try {
      const updated = await projectsService.updateProject(projectId, profileStore.profileId, input)
      projects.value = projects.value.map((item) => (item.id === updated.id ? updated : item))
      return updated
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao atualizar projeto.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function deleteProject(projectId: string): Promise<void> {
    if (!profileStore.profileId) {
      throw new Error('Perfil não carregado.')
    }

    isSaving.value = true
    error.value = null

    try {
      await projectsService.deleteProject(projectId, profileStore.profileId)
      projects.value = projects.value.filter((item) => item.id !== projectId)

      const nextMap = { ...projectStacksMap.value }
      delete nextMap[projectId]
      projectStacksMap.value = nextMap
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao excluir projeto.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function loadProjectStacks(projectId: string): Promise<ProjectStackItem[]> {
    isLoading.value = true
    error.value = null

    try {
      const items = await projectsStacksService.listProjectStacks(projectId)
      projectStacksMap.value = {
        ...projectStacksMap.value,
        [projectId]: items,
      }
      return items
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao carregar stacks do projeto.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function saveProjectStacks(projectId: string, items: SaveProjectStacksInput): Promise<ProjectStackItem[]> {
    isSaving.value = true
    error.value = null

    try {
      const saved = await projectsStacksService.saveProjectStacks(projectId, items)
      projectStacksMap.value = {
        ...projectStacksMap.value,
        [projectId]: saved,
      }
      return saved
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao salvar stacks do projeto.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  function clearState(): void {
    projects.value = []
    projectStacksMap.value = {}
    error.value = null
  }

  return {
    projects,
    projectStacksMap,
    isLoading,
    isSaving,
    error,
    loadMyProjects,
    createProject,
    updateProject,
    deleteProject,
    loadProjectStacks,
    saveProjectStacks,
    clearState,
  }
})
