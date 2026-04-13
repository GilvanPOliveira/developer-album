<template>
  <section class="py-8 md:py-10">
    <UiContainer>
      <div class="mx-auto w-full max-w-6xl space-y-5">
        <UiPageIntro
          badge="Projetos do GitHub"
          title="Meus projetos"
          description="Todos os repositórios do GitHub vinculado ao seu perfil aparecem aqui automaticamente."
          tone="cyan"
        />

        <div
          v-if="loadStatus === 'loading'"
          class="rounded-[1.75rem] border border-slate-800 bg-slate-900/75 p-7 text-center"
        >
          <p class="text-lg font-semibold text-white">
            Carregando repositórios
          </p>
          <p class="mt-3 text-sm leading-7 text-slate-400">
            Aguarde enquanto buscamos os dados do GitHub vinculado.
          </p>
        </div>

        <div
          v-else-if="error"
          class="rounded-[1.75rem] border border-rose-500/20 bg-rose-500/10 p-6"
        >
          <p class="text-lg font-semibold text-rose-200">
            Não foi possível carregar os projetos
          </p>
          <p class="mt-3 text-sm leading-7 text-rose-100/80">
            {{ error }}
          </p>
        </div>

        <div
          v-else-if="!githubLogin"
          class="rounded-[1.75rem] border border-dashed border-slate-700 bg-slate-900/40 p-7 text-center"
        >
          <p class="text-lg font-semibold text-white">
            Nenhum GitHub vinculado
          </p>
          <p class="mt-3 text-sm leading-7 text-slate-400">
            Vá para as configurações e vincule sua conta do GitHub para exibir automaticamente seus repositórios.
          </p>

          <RouterLink
            :to="{ path: '/app/', query: { github: 'link' } }"
            class="mt-6 inline-flex rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Vincular GitHub
          </RouterLink>
        </div>

        <template v-else>
          <div class="grid gap-3 rounded-[1.75rem] border border-slate-800 bg-slate-900/75 p-4 lg:grid-cols-[1fr_220px_220px]">
            <div class="space-y-2">
              <label for="repo-search" class="block text-sm font-medium text-slate-200">
                Buscar repositório
              </label>
              <input
                id="repo-search"
                v-model.trim="search"
                type="text"
                placeholder="Ex.: java, vue, api"
                class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              />
            </div>

            <div class="space-y-2">
              <label for="language" class="block text-sm font-medium text-slate-200">
                Linguagem
              </label>
              <select
                id="language"
                v-model="selectedLanguage"
                class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              >
                <option value="">Todas</option>
                <option v-for="language in languages" :key="language" :value="language">
                  {{ language }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label for="sort" class="block text-sm font-medium text-slate-200">
                Ordenar por
              </label>
              <select
                id="sort"
                v-model="sortBy"
                class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              >
                <option value="stars">Stars</option>
                <option value="updated">Atualização</option>
                <option value="name">Nome</option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-xl font-semibold text-white">
              Repositórios do GitHub
            </h2>

            <div class="flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span>{{ filteredRepositories.length }} resultado(s)</span>
              <span v-if="totalPages > 1">Página {{ currentPage }} de {{ totalPages }}</span>
            </div>
          </div>

          <div v-if="filteredRepositories.length === 0" class="rounded-[1.75rem] border border-dashed border-slate-700 bg-slate-900/40 p-7 text-center">
            <p class="text-lg font-semibold text-white">
              Nenhum repositório encontrado
            </p>
            <p class="mt-3 text-sm leading-7 text-slate-400">
              Ajuste a busca ou os filtros para encontrar outro projeto.
            </p>
          </div>

          <div v-else class="space-y-4">
            <div class="grid gap-3.5 lg:grid-cols-2">
              <article
                v-for="repo in paginatedRepositories"
                :key="repo.id"
                class="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-4"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="space-y-2">
                    <h3 class="text-xl font-semibold text-white">
                      {{ repo.name }}
                    </h3>

                    <p class="text-sm text-slate-400">
                      {{ repo.fullName }}
                    </p>
                  </div>

                  <div class="text-right text-xs text-slate-500">
                    <p>Stars {{ repo.stargazersCount }}</p>
                    <p class="mt-1">Forks {{ repo.forksCount }}</p>
                  </div>
                </div>

                <p class="mt-3 text-sm leading-6 text-slate-300">
                  {{ repo.description || 'Sem descrição informada.' }}
                </p>

                <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                  <span
                    v-if="repo.language"
                    class="rounded-full border border-white/10 bg-black/20 px-3 py-1"
                  >
                    {{ repo.language }}
                  </span>

                  <span class="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                    Atualizado em {{ formatDate(repo.updatedAt) }}
                  </span>

                  <span
                    v-if="repo.homepage"
                    class="rounded-full border border-white/10 bg-black/20 px-3 py-1"
                  >
                    Homepage
                  </span>
                </div>

                <div class="mt-4 flex flex-wrap gap-2.5">
                  <a
                    :href="repo.htmlUrl"
                    target="_blank"
                    rel="noreferrer"
                    class="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                  >
                    Ver repositório
                  </a>

                  <a
                    v-if="repo.homepage"
                    :href="repo.homepage"
                    target="_blank"
                    rel="noreferrer"
                    class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800"
                  >
                    Abrir homepage
                  </a>
                </div>
              </article>
            </div>

            <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
              <button
                type="button"
                class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="currentPage === 1"
                @click="goToPreviousPage"
              >
                Anterior
              </button>

              <span class="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-300">
                {{ currentPage }} / {{ totalPages }}
              </span>

              <button
                type="button"
                class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="currentPage === totalPages"
                @click="goToNextPage"
              >
                Próxima
              </button>
            </div>
          </div>
        </template>
      </div>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import UiContainer from '../../components/ui/UiContainer.vue'
import UiPageIntro from '../../components/ui/UiPageIntro.vue'
import { useAuth } from '../../composables/useAuth'
import { useProfile } from '../../composables/useProfile'
import { githubUsersService } from '../../features/github/services/github-users.service'
import type { GithubRepository } from '../../types/domain'

const { userId } = useAuth()
const { profile, loadMyProfile } = useProfile()

const repositories = ref<GithubRepository[]>([])
const loadStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const error = ref<string | null>(null)

const search = ref('')
const selectedLanguage = ref('')
const sortBy = ref<'stars' | 'updated' | 'name'>('stars')
const currentPage = ref(1)
const isCompactLayout = ref(false)

const githubLogin = computed(() => {
  const url = profile.value?.githubUrl?.trim()

  if (!url) {
    return null
  }

  const match = url.match(/github\.com\/([^/]+)/i)
  return match?.[1] ?? null
})

onMounted(async () => {
  syncLayoutMode()
  window.addEventListener('resize', syncLayoutMode)

  if (!userId.value) {
    return
  }

  loadStatus.value = 'loading'
  error.value = null

  try {
    await loadMyProfile()

    if (!githubLogin.value) {
      loadStatus.value = 'success'
      return
    }

    repositories.value = await githubUsersService.getUserRepositories(githubLogin.value)
    loadStatus.value = 'success'
  } catch (err) {
    loadStatus.value = 'error'
    error.value = err instanceof Error ? err.message : 'Erro ao carregar repositórios do GitHub.'
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncLayoutMode)
})

const languages = computed(() => {
  return [...new Set(repositories.value.map((repo) => repo.language).filter(Boolean) as string[])].sort()
})

const filteredRepositories = computed(() => {
  const term = search.value.trim().toLowerCase()

  const filtered = repositories.value.filter((repo) => {
    const matchesTerm =
      !term ||
      [repo.name, repo.fullName, repo.description ?? '', repo.language ?? '']
        .join(' ')
        .toLowerCase()
        .includes(term)

    const matchesLanguage = !selectedLanguage.value || repo.language === selectedLanguage.value

    return matchesTerm && matchesLanguage
  })

  return [...filtered].sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    }

    if (sortBy.value === 'updated') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }

    if (b.stargazersCount !== a.stargazersCount) {
      return b.stargazersCount - a.stargazersCount
    }

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
})

const repositoriesPerPage = computed(() => (isCompactLayout.value ? 3 : 4))

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredRepositories.value.length / repositoriesPerPage.value))
})

const paginatedRepositories = computed(() => {
  const start = (currentPage.value - 1) * repositoriesPerPage.value
  return filteredRepositories.value.slice(start, start + repositoriesPerPage.value)
})

watch([search, selectedLanguage, sortBy], () => {
  currentPage.value = 1
})

watch(filteredRepositories, (items) => {
  const nextTotalPages = Math.max(1, Math.ceil(items.length / repositoriesPerPage.value))

  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})

watch(repositoriesPerPage, () => {
  const nextTotalPages = Math.max(1, Math.ceil(filteredRepositories.value.length / repositoriesPerPage.value))

  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

function goToNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

function syncLayoutMode() {
  isCompactLayout.value = window.innerWidth < 1024
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
  }).format(new Date(value))
}
</script>
