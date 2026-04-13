import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { publicProfileDetailsService } from '../features/profiles/services/public-profile-details.service'
import type { RequestStatus } from '../types/api'
import type { PublicDeveloperProfileDetails } from '../types/domain'

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeStack(name: string, index: number) {
  return {
    id: `stack-${index}-${slugify(name)}`,
    name,
    slug: slugify(name),
    category: 'other' as string | null,
    iconName: null,
    colorToken: null,
    createdAt: new Date(0).toISOString(),
  }
}

export const usePublicProfileStore = defineStore('public-profile', () => {
  const details = ref<PublicDeveloperProfileDetails | null>(null)
  const loadStatus = ref<RequestStatus>('idle')
  const error = ref<string | null>(null)

  const profile = computed(() => details.value?.profile ?? null)
  const projects = computed(() => details.value?.projects ?? [])

  function clearState() {
    details.value = null
    loadStatus.value = 'idle'
    error.value = null
  }

  async function loadByUsername(username: string) {
    error.value = null
    loadStatus.value = 'loading'

    try {
      const payload = await publicProfileDetailsService.getByUsername(username)

      if (!payload) {
        details.value = null
        loadStatus.value = 'success'
        return
      }

      details.value = {
        profile: {
          id: payload.id,
          username: payload.username,
          fullName: payload.fullName,
          headline: payload.headline,
          bio: payload.bio,
          avatarUrl: payload.avatarUrl,
          location: payload.location,
          websiteUrl: payload.websiteUrl,
          githubUrl: payload.githubUrl,
          linkedinUrl: payload.linkedinUrl,
          portfolioUrl: payload.portfolioUrl,
          availabilityStatus: 'unavailable',
          developerCard: null,
          stacks: payload.primaryStacks.map(normalizeStack),
        },
        projects: payload.projects.map((project, index) => ({
          id: project.id,
          profileId: payload.id,
          title: project.title,
          slug: project.slug,
          description: project.description,
          coverImageUrl: null,
          projectUrl: project.projectUrl,
          repoUrl: project.repoUrl,
          isFeatured: project.isFeatured,
          visibility: 'public',
          orderIndex: index,
          createdAt: new Date(0).toISOString(),
          updatedAt: new Date(0).toISOString(),
          source: 'manual',
          githubRepoId: null,
          githubOwnerLogin: null,
          githubRepoFullName: null,
          githubRepoHtmlUrl: null,
          githubDescription: null,
          githubHomepage: null,
          githubStars: 0,
          githubStarsCount: 0,
          githubForks: 0,
          githubForksCount: 0,
          githubLanguage: null,
          githubArchived: false,
          githubDefaultBranch: null,
          githubPushedAt: null,
          lastSyncedAt: null,
          stacks: project.stackNames.map(normalizeStack),
        })),
      }

      loadStatus.value = 'success'
    } catch (err) {
      details.value = null
      loadStatus.value = 'error'
      error.value = err instanceof Error ? err.message : 'Erro ao carregar perfil público.'
      throw err
    }
  }

  return {
    details,
    profile,
    projects,
    loadStatus,
    error,
    clearState,
    loadByUsername,
  }
})
