<template>
  <section class="py-8 md:py-10">
    <UiContainer>
      <div class="mx-auto w-full max-w-7xl space-y-5">
        <div class="grid gap-4 xl:grid-cols-2">
          <article class="dashboard-card">
            <div class="flip-card" :class="{ 'flip-card--flipped': isProfileCardBack }">
              <div class="flip-face">
                <div v-if="isLoadingProfile" class="text-white">Carregando perfil...</div>

                <template v-else>
                  <div class="card-face-content">
                    <div class="card-header">
                      <div class="card-header__main">
                        <div class="profile-avatar-wrap shrink-0">
                          <img
                            v-if="stableAvatarUrl"
                            :src="stableAvatarUrl"
                            :alt="stableDisplayName"
                            class="profile-avatar"
                          />
                          <div v-else class="profile-avatar-fallback">
                            {{ stableInitial }}
                          </div>
                        </div>

                        <div class="card-header__text">
                          <h2 class="profile-title">
                            {{ stableDisplayName }}
                          </h2>

                          <div class="mt-2 flex flex-wrap items-center gap-2">
                            <span
                              class="rounded-full px-3 py-1 text-[11px] font-semibold"
                              :class="
                                profile?.isPublic
                                  ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
                                  : 'border border-slate-700 bg-slate-950 text-slate-300'
                              "
                            >
                              {{ profile?.isPublic ? 'Perfil público' : 'Perfil privado' }}
                            </span>

                            <span
                              v-if="availabilityLabel"
                              class="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-200"
                            >
                              {{ availabilityLabel }}
                            </span>
                          </div>

                          <p class="mt-2 text-sm text-slate-400 profile-username">
                            {{ stableUsername }}
                          </p>

                          <p class="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">
                            {{ stableHeadline }}
                          </p>
                        </div>
                      </div>

                      <button type="button" class="top-action" @click="isProfileCardBack = true">
                        Verso
                      </button>
                    </div>

                    <div class="info-grid">
                      <div class="info-box">
                        <p class="info-box__label">Perfil público</p>
                        <a
                          v-if="publicProfileUrl"
                          :href="publicProfileUrl"
                          target="_blank"
                          rel="noreferrer"
                          class="info-box__link"
                        >
                          {{ publicProfileUrl }}
                        </a>
                        <p v-else class="info-box__value">
                          Defina um username para gerar seu link público.
                        </p>
                      </div>

                      <div class="info-box">
                        <p class="info-box__label">GitHub vinculado</p>
                        <a
                          v-if="profile?.githubUrl"
                          :href="profile.githubUrl"
                          target="_blank"
                          rel="noreferrer"
                          class="info-box__link"
                        >
                          {{ profile.githubUrl }}
                        </a>
                        <p v-else class="info-box__value">GitHub não vinculado</p>
                      </div>

                      <div class="info-box">
                        <p class="info-box__label">Localização</p>
                        <p class="info-box__value">
                          {{ githubUser?.location || profile?.location || 'Não informada' }}
                        </p>
                      </div>

                      <div class="info-box">
                        <p class="info-box__label">Empresa</p>
                        <p class="info-box__value">
                          {{ githubUser?.company || 'Não informada' }}
                        </p>
                      </div>
                    </div>

                    <div class="stats-grid">
                      <div class="stat-box">
                        <p class="stat-box__label">Repos</p>
                        <p class="stat-box__value">{{ githubRepos.length }}</p>
                      </div>

                      <div class="stat-box">
                        <p class="stat-box__label">Stars</p>
                        <p class="stat-box__value">{{ totalGithubStars }}</p>
                      </div>

                      <div class="stat-box">
                        <p class="stat-box__label">Seguidores</p>
                        <p class="stat-box__value">{{ githubUser?.followers ?? 0 }}</p>
                      </div>

                      <div class="stat-box">
                        <p class="stat-box__label">Seguindo</p>
                        <p class="stat-box__value">{{ githubUser?.following ?? 0 }}</p>
                      </div>
                    </div>

                    <div class="info-grid">
                      <div class="info-box">
                        <p class="info-box__label">Blog / Site</p>
                        <a
                          v-if="primaryWebsiteUrl"
                          :href="primaryWebsiteUrl"
                          target="_blank"
                          rel="noreferrer"
                          class="info-box__link"
                        >
                          {{ primaryWebsiteUrl }}
                        </a>
                        <p v-else class="info-box__value">Não informado</p>
                      </div>

                      <div class="info-box">
                        <p class="info-box__label">Twitter / X</p>
                        <a
                          v-if="twitterProfileUrl"
                          :href="twitterProfileUrl"
                          target="_blank"
                          rel="noreferrer"
                          class="info-box__link"
                        >
                          {{ twitterProfileUrl }}
                        </a>
                        <p v-else class="info-box__value">Não informado</p>
                      </div>
                    </div>

                    <div class="stack-section">
                      <p class="stack-section__label">Stacks principais</p>

                      <div v-if="primaryStacks.length > 0" class="mt-2 flex flex-wrap gap-2">
                        <span
                          v-for="stack in primaryStacks"
                          :key="stack.id"
                          class="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200"
                        >
                          {{ stack.name }}
                        </span>
                      </div>

                      <p v-else class="mt-2 text-sm text-slate-400">
                        Nenhuma stack principal definida ainda.
                      </p>
                    </div>

                    <div class="mt-auto flex flex-wrap gap-3 pt-1">
                      <a
                        v-if="githubUser?.htmlUrl"
                        :href="githubUser.htmlUrl"
                        target="_blank"
                        rel="noreferrer"
                        class="action-btn action-btn--secondary"
                      >
                        Ver GitHub
                      </a>

                      <button
                        v-if="profile"
                        type="button"
                        :disabled="isSavingProfile"
                        class="action-btn"
                        :class="profile?.isPublic ? 'action-btn--danger' : 'action-btn--primary'"
                        @click="toggleProfileVisibility"
                      >
                        {{ profile?.isPublic ? 'Tornar perfil privado' : 'Tornar perfil público' }}
                      </button>
                    </div>

                    <div
                      v-if="githubError"
                      class="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
                    >
                      {{ githubError }}
                    </div>
                  </div>
                </template>
              </div>

              <div class="flip-face flip-face--back">
                <div class="card-face-content">
                  <div class="card-header card-header--back">
                    <div class="card-header__text min-w-0">
                      <h3 class="mt-3 text-xl font-bold text-white">
                        Buscar e vincular perfil GitHub
                      </h3>
                    </div>

                    <button type="button" class="top-action" @click="isProfileCardBack = false">
                      Voltar
                    </button>
                  </div>

                  <form
                    class="mt-4 grid gap-4 md:grid-cols-[1fr_auto]"
                    @submit.prevent="handleGithubSearch"
                  >
                    <div class="space-y-2">
                      <input
                        id="github-search"
                        v-model.trim="githubSearch"
                        type="text"
                        placeholder="Ex.: torvalds, octocat, frontend"
                        class="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400"
                      />
                    </div>

                    <div class="flex items-end gap-2">
                      <button
                        type="submit"
                        :disabled="githubSearchLoading"
                        class="rounded-2xl bg-violet-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {{ githubSearchLoading ? 'Buscando...' : 'Vincular GitHub' }}
                      </button>
                    </div>
                  </form>

                  <div
                    v-if="githubSearchError"
                    class="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
                  >
                    {{ githubSearchError }}
                  </div>

                  <div
                    v-if="githubLinkSuccess"
                    class="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
                  >
                    {{ githubLinkSuccess }}
                  </div>

                  <div
                    v-if="paginatedGithubSearchResults.length > 0"
                    class="mt-4 flex flex-1 flex-col"
                  >
                    <div class="space-y-3">
                      <article
                        v-for="user in paginatedGithubSearchResults"
                        :key="user.id"
                        class="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"
                      >
                        <div class="flex gap-4">
                          <img
                            :src="user.avatarUrl"
                            :alt="user.login"
                            class="h-14 w-14 rounded-2xl object-cover shrink-0"
                          />

                          <div class="min-w-0 flex-1">
                            <p class="truncate font-bold text-white">
                              {{ user.name || user.login }}
                            </p>
                            <p class="text-sm text-slate-400">@{{ user.login }}</p>
                            <p class="mt-2 line-clamp-2 text-sm text-slate-300">
                              {{ user.bio || 'Sem bio pública informada no GitHub.' }}
                            </p>
                          </div>
                        </div>

                        <div class="mt-4">
                          <button
                            type="button"
                            :disabled="isSavingProfile"
                            class="action-btn action-btn--violet"
                            @click="linkGithubProfile(user)"
                          >
                            {{ isSavingProfile ? 'Salvando...' : 'Vincular GitHub' }}
                          </button>
                        </div>
                      </article>
                    </div>

                    <div
                      v-if="githubSearchTotalPages > 1"
                      class="mt-auto flex w-full flex-col items-stretch justify-center gap-3 pt-5 sm:flex-row sm:items-center"
                    >
                      <button
                        type="button"
                        :disabled="githubSearchPage === 1 || githubSearchLoading"
                        class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 disabled:opacity-40"
                        @click="prevGithubPage"
                      >
                        Anterior
                      </button>

                      <span class="text-sm text-slate-400">
                        Página {{ githubSearchPage }} de {{ githubSearchTotalPages }}
                      </span>

                      <button
                        type="button"
                        :disabled="
                          githubSearchPage === githubSearchTotalPages || githubSearchLoading
                        "
                        class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 disabled:opacity-40"
                        @click="nextGithubPage"
                      >
                        Próxima
                      </button>
                    </div>
                  </div>

                  <div
                    v-else
                    class="mt-auto rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center text-sm text-slate-400"
                  >
                    Pesquise um perfil GitHub para vincular ao seu Developer Album.
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article class="dashboard-card">
            <div class="card-face-content card-face-content--repos">
              <div class="flex items-center justify-between gap-4">
                <h2 class="text-lg font-semibold text-white">Repositórios em destaque</h2>

                <span class="text-sm text-slate-400">
                  {{ featuredRepositories.length }} encontrado(s)
                </span>
              </div>

              <div v-if="paginatedRepositories.length > 0" class="repo-results mt-5">
                <div class="repo-results__list space-y-3">
                  <article
                    v-for="repo in paginatedRepositories"
                    :key="repo.id"
                    class="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="truncate text-base font-semibold text-white">
                          {{ repo.name }}
                        </p>
                        <p class="mt-1 truncate text-xs text-slate-500">
                          {{ repo.fullName }}
                        </p>
                      </div>

                      <span
                        class="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200"
                      >
                        Stars {{ repo.stargazersCount }}
                      </span>
                    </div>

                    <p class="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">
                      {{ repo.description || 'Sem descrição informada.' }}
                    </p>

                    <div class="repo-meta-actions mt-4">
                      <div class="repo-meta-actions__meta">
                        <span
                          v-if="repo.language"
                          class="rounded-full border border-white/10 bg-black/20 px-3 py-1"
                        >
                          {{ repo.language }}
                        </span>

                        <span class="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                          {{ formatDate(repo.updatedAt) }}
                        </span>
                      </div>

                      <div class="repo-meta-actions__links">
                        <a
                          :href="repo.htmlUrl"
                          target="_blank"
                          rel="noreferrer"
                          class="action-btn action-btn--secondary"
                        >
                          Ver no GitHub
                        </a>

                        <a
                          v-if="repo.homepage"
                          :href="repo.homepage"
                          target="_blank"
                          rel="noreferrer"
                          class="action-btn action-btn--primary"
                        >
                          Ver deploy
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              </div>

              <div
                v-else
                class="repo-empty-state mt-5 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center text-sm text-slate-400"
              >
                Vincule seu GitHub no card ao lado para exibir automaticamente seus projetos aqui.
              </div>

              <div
                v-if="featuredRepositories.length > repositoryPageSize"
                class="repo-pagination mt-4 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
              >
                <button
                  type="button"
                  :disabled="repositoryPage === 1"
                  class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 disabled:opacity-40"
                  @click="prevRepositoryPage"
                >
                  Anterior
                </button>

                <span class="text-sm text-slate-400">
                  Página {{ repositoryPage }} de {{ repositoryTotalPages }}
                </span>

                <button
                  type="button"
                  :disabled="repositoryPage === repositoryTotalPages"
                  class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 disabled:opacity-40"
                  @click="nextRepositoryPage"
                >
                  Próxima
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import UiContainer from '../../components/ui/UiContainer.vue'
import { useAuth } from '../../composables/useAuth'
import { useProfile } from '../../composables/useProfile'
import { useProfileStacks } from '../../composables/useProfileStacks'
import { githubUsersService } from '../../features/github/services/github-users.service'
import type { GithubRepository, GithubUser } from '../../types/domain'

const { userId } = useAuth()
const route = useRoute()

const {
  profile,
  isLoadingProfile,
  isSavingProfile,
  loadMyProfile,
  saveProfile,
  clearError: clearProfileError,
} = useProfile()

const { orderedSelectedStacks, bootstrap: bootstrapStacks } = useProfileStacks()

const isProfileCardBack = ref(false)

const githubUser = ref<GithubUser | null>(null)
const githubRepos = ref<GithubRepository[]>([])
const githubError = ref<string | null>(null)

const githubSearch = ref('')
const githubSearchResults = ref<GithubUser[]>([])
const githubSearchPage = ref(1)
const githubSearchTotalPages = ref(1)
const githubSearchLoading = ref(false)
const githubSearchError = ref<string | null>(null)
const githubLinkSuccess = ref<string | null>(null)

const repositoryPage = ref(1)
const repositoryPageSize = 2

function syncProfileCardFromRoute() {
  isProfileCardBack.value = route.query.github === 'link'
}

const githubLogin = computed(() => {
  const url = profile.value?.githubUrl?.trim()

  if (!url) {
    return null
  }

  const match = url.match(/github\.com\/([^/]+)/i)
  return match?.[1] ?? null
})

const publicProfileUrl = computed(() => {
  if (!profile.value?.username) {
    return null
  }

  return `${window.location.origin}/dev/${profile.value.username}`
})

const primaryStacks = computed(() => {
  return orderedSelectedStacks.value.filter((item) => item.isPrimary)
})

const totalGithubStars = computed(() => {
  return githubRepos.value.reduce((sum, repo) => sum + repo.stargazersCount, 0)
})

const featuredRepositories = computed(() => {
  return [...githubRepos.value].sort((a, b) => {
    if (b.stargazersCount !== a.stargazersCount) {
      return b.stargazersCount - a.stargazersCount
    }

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
})

const repositoryTotalPages = computed(() => {
  return Math.max(1, Math.ceil(featuredRepositories.value.length / repositoryPageSize))
})

const paginatedRepositories = computed(() => {
  const start = (repositoryPage.value - 1) * repositoryPageSize
  return featuredRepositories.value.slice(start, start + repositoryPageSize)
})

const paginatedGithubSearchResults = computed(() => {
  return githubSearchResults.value
})

const stableAvatarUrl = computed(() => {
  return githubUser.value?.avatarUrl || profile.value?.avatarUrl || null
})

const stableDisplayName = computed(() => {
  return githubUser.value?.name || profile.value?.fullName || profile.value?.username || 'Perfil'
})

const stableUsername = computed(() => {
  if (githubUser.value?.login) {
    return `@${githubUser.value.login}`
  }

  if (profile.value?.username) {
    return `@${profile.value.username}`
  }

  return 'Username ainda não definido'
})

const stableHeadline = computed(() => {
  return (
    githubUser.value?.bio ||
    profile.value?.headline ||
    'Defina uma headline para fortalecer sua apresentação pública.'
  )
})

const stableInitial = computed(() => {
  const label = stableDisplayName.value
  return label.trim().charAt(0).toUpperCase()
})

const availabilityLabel = computed(() => {
  const status = profile.value?.availabilityStatus

  const labels: Record<string, string> = {
    open_to_work: 'Open to work',
    freelance: 'Freelance',
    unavailable: 'Indisponível',
    available: 'Disponível',
  }

  if (!status) {
    return null
  }

  return labels[String(status)] ?? String(status)
})

const primaryWebsiteUrl = computed(() => {
  return githubUser.value?.blog || profile.value?.portfolioUrl || profile.value?.websiteUrl || null
})

const twitterProfileUrl = computed(() => {
  if (!githubUser.value?.twitterUsername) {
    return null
  }

  return `https://x.com/${githubUser.value.twitterUsername}`
})

onMounted(async () => {
  syncProfileCardFromRoute()

  if (!userId.value) {
    return
  }

  try {
    await loadMyProfile()

    if (profile.value?.id) {
      await bootstrapStacks(profile.value.id)
    }

    await loadGithubSnapshot()
  } catch {}
})

watch(githubLogin, async () => {
  await loadGithubSnapshot()
})

watch(
  () => route.query.github,
  () => {
    syncProfileCardFromRoute()
  }
)

watch(featuredRepositories, () => {
  if (repositoryPage.value > repositoryTotalPages.value) {
    repositoryPage.value = repositoryTotalPages.value
  }
})

async function loadGithubSnapshot() {
  githubUser.value = null
  githubRepos.value = []
  githubError.value = null
  repositoryPage.value = 1

  if (!githubLogin.value) {
    return
  }

  try {
    const [user, repos] = await Promise.all([
      githubUsersService.getUserByLogin(githubLogin.value),
      githubUsersService.getUserRepositories(githubLogin.value),
    ])

    githubUser.value = user
    githubRepos.value = repos
  } catch (err) {
    githubError.value =
      err instanceof Error ? err.message : 'Não foi possível carregar os dados do GitHub.'
  }
}

async function handleGithubSearch() {
  await searchGithubProfiles(1)
}

async function searchGithubProfiles(page = 1) {
  githubSearchError.value = null
  githubLinkSuccess.value = null
  githubSearchLoading.value = true

  try {
    const result = await githubUsersService.searchUsers(githubSearch.value, page)
    githubSearchResults.value = result.items
    githubSearchPage.value = result.currentPage
    githubSearchTotalPages.value = result.totalPages
  } catch (err) {
    githubSearchError.value =
      err instanceof Error ? err.message : 'Não foi possível buscar perfis no GitHub.'
  } finally {
    githubSearchLoading.value = false
  }
}

async function nextGithubPage() {
  if (githubSearchPage.value >= githubSearchTotalPages.value) {
    return
  }

  await searchGithubProfiles(githubSearchPage.value + 1)
}

async function prevGithubPage() {
  if (githubSearchPage.value <= 1) {
    return
  }

  await searchGithubProfiles(githubSearchPage.value - 1)
}

async function linkGithubProfile(user: GithubUser) {
  githubSearchError.value = null
  githubLinkSuccess.value = null
  clearProfileError()

  try {
    await saveProfile({
      fullName: profile.value?.fullName || user.name || user.login,
      username: profile.value?.username || user.login.toLowerCase(),
      headline: profile.value?.headline || user.bio || '',
      bio: profile.value?.bio || user.bio || '',
      avatarUrl: profile.value?.avatarUrl || user.avatarUrl || '',
      location: profile.value?.location || user.location || null,
      websiteUrl: profile.value?.websiteUrl || user.blog || null,
      githubUrl: user.htmlUrl,
      linkedinUrl: profile.value?.linkedinUrl || null,
      portfolioUrl: profile.value?.portfolioUrl || null,
      availabilityStatus: profile.value?.availabilityStatus,
      isPublic: profile.value?.isPublic ?? true,
    })

    githubLinkSuccess.value = `${user.login} vinculado com sucesso.`
    githubSearch.value = user.login
    await loadMyProfile()
    await loadGithubSnapshot()
    isProfileCardBack.value = false
  } catch (err) {
    githubSearchError.value =
      err instanceof Error ? err.message : 'Não foi possível vincular o GitHub.'
  }
}

async function toggleProfileVisibility() {
  clearProfileError()
  githubSearchError.value = null
  githubLinkSuccess.value = null

  if (!profile.value) {
    return
  }

  try {
    const nextIsPublic = !profile.value.isPublic

    await saveProfile({
      fullName: profile.value.fullName ?? '',
      username: profile.value.username ?? '',
      headline: profile.value.headline ?? '',
      bio: profile.value.bio ?? '',
      avatarUrl: profile.value.avatarUrl ?? '',
      location: profile.value.location,
      websiteUrl: profile.value.websiteUrl,
      githubUrl: profile.value.githubUrl,
      linkedinUrl: profile.value.linkedinUrl,
      portfolioUrl: profile.value.portfolioUrl,
      availabilityStatus: profile.value.availabilityStatus,
      isPublic: nextIsPublic,
    })

    await loadMyProfile()
    githubLinkSuccess.value = nextIsPublic
      ? 'Perfil agora está público.'
      : 'Perfil agora está privado.'
  } catch (err) {
    githubSearchError.value =
      err instanceof Error ? err.message : 'Não foi possível alterar a visibilidade do perfil.'
  }
}

function prevRepositoryPage() {
  if (repositoryPage.value <= 1) {
    return
  }

  repositoryPage.value -= 1
}

function nextRepositoryPage() {
  if (repositoryPage.value >= repositoryTotalPages.value) {
    return
  }

  repositoryPage.value += 1
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
  }).format(new Date(value))
}
</script>

<style scoped>
.dashboard-card {
  height: 620px;
  border-radius: 1.6rem;
  border: 1px solid rgb(30 41 59 / 1);
  background: linear-gradient(180deg, rgba(8, 15, 36, 0.95), rgba(4, 10, 26, 0.98));
  padding: 1rem;
  box-shadow: 0 18px 34px rgba(2, 6, 23, 0.24);
}

.flip-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.65s ease;
}

.flip-card--flipped {
  transform: rotateY(180deg);
}

.flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  overflow: hidden;
  pointer-events: none;
}

.flip-face--back {
  transform: rotateY(180deg);
}

.flip-card:not(.flip-card--flipped) .flip-face:not(.flip-face--back) {
  pointer-events: auto;
}

.flip-card.flip-card--flipped .flip-face--back {
  pointer-events: auto;
}

.card-face-content {
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  gap: 0.8rem;
  box-sizing: border-box;
  padding: 0.2rem 0.35rem 0.35rem 0.2rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.34) transparent;
  scrollbar-gutter: stable;
}

.card-face-content::-webkit-scrollbar {
  width: 6px;
}

.card-face-content::-webkit-scrollbar-track {
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.12);
}

.card-face-content::-webkit-scrollbar-thumb {
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(148, 163, 184, 0.28), rgba(100, 116, 139, 0.5));
}

.card-face-content--repos {
  overflow: hidden;
  padding-right: 0.2rem;
  scrollbar-width: none;
}

.card-face-content--repos::-webkit-scrollbar {
  width: 0;
}

.repo-results {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

.repo-results__list {
  height: 100%;
  overflow-y: auto;
  padding-right: 0.15rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.34) transparent;
}

.repo-results__list::-webkit-scrollbar {
  width: 6px;
}

.repo-results__list::-webkit-scrollbar-track {
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.12);
}

.repo-results__list::-webkit-scrollbar-thumb {
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(148, 163, 184, 0.28), rgba(100, 116, 139, 0.5));
}

.repo-empty-state {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.repo-pagination {
  margin-top: auto;
  padding-top: 1rem;
}

.repo-meta-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.repo-meta-actions__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.repo-meta-actions__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.card-header__main {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.card-header__text {
  min-width: 0;
  flex: 1;
}

.card-header--back {
  align-items: flex-start;
}

.profile-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1.45rem;
  line-height: 1;
  font-weight: 700;
  color: white;
}

.profile-username {
  word-break: break-word;
}

.profile-avatar-wrap {
  width: 96px;
  height: 96px;
  overflow: hidden;
  border-radius: 1.4rem;
  border: 1px solid rgb(51 65 85 / 1);
  background: rgb(15 23 42 / 1);
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar-fallback {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.info-grid {
  display: grid;
  gap: 0.6rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.stats-grid {
  display: grid;
  gap: 0.55rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.info-box {
  min-width: 0;
  border-radius: 0.85rem;
  border: 1px solid rgb(30 41 59 / 1);
  background: rgba(2, 6, 23, 0.78);
  padding: 0.75rem;
}

.info-box__label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgb(100 116 139 / 1);
}

.info-box__value {
  margin-top: 0.45rem;
  font-size: 0.85rem;
  color: white;
  word-break: break-word;
}

.info-box__link {
  display: inline-block;
  margin-top: 0.45rem;
  font-size: 0.85rem;
  color: rgb(125 211 252 / 1);
  word-break: break-word;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.stat-box {
  min-width: 0;
  border-radius: 0.85rem;
  border: 1px solid rgb(30 41 59 / 1);
  background: rgba(2, 6, 23, 0.78);
  padding: 0.65rem 0.45rem;
  text-align: center;
}

.stat-box__label {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgb(100 116 139 / 1);
}

.stat-box__value {
  margin-top: 0.28rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
}

.stack-section {
  border-top: 1px solid rgba(51, 65, 85, 0.55);
  padding-top: 0.75rem;
}

.stack-section__label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgb(100 116 139 / 1);
}

.top-action {
  flex-shrink: 0;
  align-self: flex-start;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.82);
  color: white;
  padding: 0.36rem 0.72rem;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  white-space: nowrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.72rem;
  padding: 0.58rem 0.82rem;
  font-size: 0.78rem;
  font-weight: 700;
  transition: 0.2s ease;
}

.action-btn--primary {
  background: rgb(34 211 238 / 1);
  color: rgb(15 23 42 / 1);
}

.action-btn--secondary {
  border: 1px solid rgb(51 65 85 / 1);
  background: rgb(15 23 42 / 1);
  color: white;
}

.action-btn--violet {
  background: rgb(167 139 250 / 1);
  color: rgb(15 23 42 / 1);
}

.action-btn--danger {
  border: 1px solid rgba(244, 63, 94, 0.22);
  background: rgba(244, 63, 94, 0.1);
  color: rgb(254, 205, 211);
}

@media (max-width: 1279px) {
  .dashboard-card {
    height: 620px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .profile-avatar-wrap {
    width: 96px;
    height: 96px;
  }
}

@media (max-width: 640px) {
  .dashboard-card {
    height: 560px;
    padding: 0.85rem;
    border-radius: 1.2rem;
  }

  .card-face-content {
    gap: 0.75rem;
    padding: 0 0.28rem 0.3rem 0;
  }

  .card-header {
    gap: 0.6rem;
  }

  .card-header__main {
    gap: 0.75rem;
  }

  .profile-title {
    font-size: 1.1rem;
    line-height: 1.1;
    white-space: normal;
  }

  .profile-avatar-wrap {
    width: 72px;
    height: 72px;
    border-radius: 1rem;
  }

  .info-grid {
    gap: 0.55rem;
  }

  .stats-grid {
    gap: 0.55rem;
  }

  .info-box {
    padding: 0.72rem;
    border-radius: 0.85rem;
  }

  .info-box__label {
    font-size: 0.56rem;
    letter-spacing: 0.14em;
  }

  .info-box__value,
  .info-box__link {
    font-size: 0.76rem;
    line-height: 1.35;
  }

  .stat-box {
    padding: 0.65rem 0.4rem;
    border-radius: 0.85rem;
  }

  .stat-box__label {
    font-size: 0.52rem;
  }

  .stat-box__value {
    margin-top: 0.28rem;
    font-size: 1.05rem;
  }

  .stack-section {
    padding-top: 0.6rem;
  }

  .stack-section__label {
    font-size: 0.6rem;
  }

  .top-action {
    padding: 0.36rem 0.7rem;
    font-size: 0.58rem;
  }

  .action-btn {
    width: 100%;
    min-height: 38px;
    padding: 0.68rem 0.8rem;
    font-size: 0.74rem;
  }

  .repo-meta-actions {
    align-items: flex-start;
    flex-direction: column;
  }

  .repo-meta-actions__meta,
  .repo-meta-actions__links {
    width: 100%;
  }
}

@media (max-width: 420px) {
  .dashboard-card {
    height: 530px;
    padding: 0.85rem;
    border-radius: 1.25rem;
  }

  .card-header {
    gap: 0.5rem;
  }

  .card-header__main {
    gap: 0.6rem;
  }

  .profile-avatar-wrap {
    width: 60px;
    height: 60px;
    border-radius: 0.9rem;
  }

  .profile-title {
    font-size: 1rem;
  }

  .card-face-content {
    gap: 0.65rem;
  }

  .info-grid,
  .stats-grid {
    gap: 0.5rem;
  }

  .info-box {
    padding: 0.65rem;
  }

  .stat-box {
    padding: 0.58rem 0.35rem;
  }

  .stat-box__value {
    font-size: 0.95rem;
  }

  .top-action {
    padding: 0.34rem 0.62rem;
    font-size: 0.54rem;
  }

  .card-face-content > .mt-auto.flex.w-full {
    align-items: stretch;
  }

  .card-face-content > .mt-auto.flex.w-full button {
    width: 100%;
  }
}

@media (max-width: 375px) {
  .dashboard-card {
    height: 510px;
    padding: 0.75rem;
  }

  .profile-avatar-wrap {
    width: 56px;
    height: 56px;
  }

  .profile-title {
    font-size: 0.95rem;
  }

  .info-box__label {
    font-size: 0.52rem;
  }

  .info-box__value,
  .info-box__link {
    font-size: 0.72rem;
  }

  .stat-box__label {
    font-size: 0.5rem;
  }

  .stat-box__value {
    font-size: 0.9rem;
  }

  .action-btn {
    min-height: 36px;
    padding: 0.62rem 0.75rem;
    font-size: 0.7rem;
  }
}

@media (max-width: 400px) {
  .card-face-content--repos {
    padding-right: 0.28rem;
  }

  .repo-results__list::-webkit-scrollbar,
  .card-face-content--repos::-webkit-scrollbar {
    width: 6px;
  }
}
</style>
