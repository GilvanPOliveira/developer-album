<template>
  <section class="py-8 md:py-10">
    <UiContainer>
      <div class="mx-auto w-full max-w-6xl space-y-5">
        <UiPageIntro
          badge="Explorar no GitHub"
          title="Buscar desenvolvedores"
          description="Pesquise usuários reais do GitHub por nome ou login."
          tone="violet"
        />

        <form
          class="grid gap-3 rounded-[1.5rem] border border-slate-800 bg-slate-900/75 p-4 lg:grid-cols-[1fr_auto]"
          @submit.prevent="handleSearch"
        >
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-200">
              Buscar no GitHub
            </label>

            <input
              v-model.trim="search"
              type="text"
              placeholder="Ex.: torvalds, frontend, backend"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
            />
          </div>

          <div class="flex items-end gap-3">
            <button
              type="submit"
              :disabled="loadStatus === 'loading'"
              class="rounded-2xl bg-violet-400 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
            >
              {{ loadStatus === 'loading' ? 'Buscando...' : 'Buscar' }}
            </button>

            <button
              type="button"
              class="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200"
              @click="handleClear"
            >
              Limpar
            </button>
          </div>
        </form>

        <div
          v-if="albumError"
          class="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
        >
          {{ albumError }}
        </div>

        <div
          v-if="albumSuccess"
          class="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
        >
          {{ albumSuccess }}
        </div>

        <div v-if="loadStatus === 'loading'" class="text-center text-white">
          Carregando...
        </div>

        <div
          v-else-if="hasSearched"
          class="flex flex-col gap-2 text-sm text-slate-400 md:flex-row md:items-center md:justify-between"
        >
          <span>{{ totalCount }} resultado(s) encontrado(s)</span>
          <div class="flex flex-wrap items-center gap-3">
            <span v-if="incompleteResults">Resultados parciais do GitHub</span>
            <span v-if="totalPages > 1">Página {{ currentPage }} de {{ totalPages }}</span>
          </div>
        </div>

        <div v-if="results.length > 0" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="user in results"
            :key="user.id"
            class="rounded-[1.4rem] border border-slate-800 bg-slate-900/85 p-4"
          >
            <div class="flex gap-4">
              <img
                :src="user.avatarUrl"
                :alt="user.login"
                class="h-16 w-16 rounded-xl object-cover"
              />

              <div class="min-w-0 flex-1">
                <p class="truncate font-bold text-white">
                  {{ user.name || user.login }}
                </p>
                <p class="text-sm text-slate-400">
                  @{{ user.login }}
                </p>
                <p v-if="displaySubline(user)" class="mt-1 truncate text-xs text-slate-500">
                  {{ displaySubline(user) }}
                </p>
              </div>
            </div>

            <p class="mt-3 min-h-[52px] text-sm leading-6 text-slate-300">
              {{ user.bio || 'Sem bio pública informada no GitHub.' }}
            </p>

            <div class="mt-3 grid grid-cols-3 gap-2">
              <div class="stat-box">
                <span class="stat-label">Repos</span>
                <strong class="stat-value">{{ user.publicRepos }}</strong>
              </div>
              <div class="stat-box">
                <span class="stat-label">Followers</span>
                <strong class="stat-value">{{ user.followers }}</strong>
              </div>
              <div class="stat-box">
                <span class="stat-label">Following</span>
                <strong class="stat-value">{{ user.following }}</strong>
              </div>
            </div>

            <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
              <span v-if="user.location" class="tag" :title="user.location">
                {{ user.location }}
              </span>
              <span v-if="user.company" class="tag" :title="user.company">
                {{ user.company }}
              </span>
              <span v-if="user.blog" class="tag" :title="user.blog">
                Site
              </span>
              <span v-if="user.twitterUsername" class="tag" :title="`@${user.twitterUsername}`">
                @{{ user.twitterUsername }}
              </span>
            </div>

            <div class="mt-4 flex flex-wrap gap-2.5">
              <a
                :href="user.htmlUrl"
                target="_blank"
                rel="noreferrer"
                class="btn-primary"
              >
                Ver GitHub
              </a>

              <button
                v-if="isAuthenticated"
                type="button"
                :disabled="isSaving || githubInAlbumIds.has(user.id)"
                class="btn-secondary disabled:opacity-60"
                @click="handleAddToAlbum(user)"
              >
                {{ githubInAlbumIds.has(user.id) ? 'No álbum' : 'Adicionar ao álbum' }}
              </button>

              <RouterLink
                v-else
                to="/login"
                class="btn-secondary"
              >
                Entrar
              </RouterLink>
            </div>
          </article>
        </div>

        <div
          v-if="hasSearched && totalPages > 1"
          class="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row"
        >
          <button
            type="button"
            :disabled="currentPage === 1 || loadStatus === 'loading'"
            class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 disabled:opacity-40"
            @click="prevPage"
          >
            Anterior
          </button>

          <span class="text-sm text-slate-400">
            Página {{ currentPage }} de {{ totalPages }}
          </span>

          <button
            type="button"
            :disabled="currentPage === totalPages || loadStatus === 'loading'"
            class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 disabled:opacity-40"
            @click="nextPage"
          >
            Próxima
          </button>
        </div>

        <div
          v-if="hasSearched && results.length === 0 && loadStatus === 'success'"
          class="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center"
        >
          <p class="text-lg font-semibold text-white">
            Nenhum resultado encontrado
          </p>
          <p class="mt-3 text-sm leading-7 text-slate-400">
            Tente outro termo de busca no GitHub.
          </p>
        </div>

        <div
          v-if="error && loadStatus === 'error'"
          class="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
        >
          {{ error }}
        </div>
      </div>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import UiContainer from '../../components/ui/UiContainer.vue'
import UiPageIntro from '../../components/ui/UiPageIntro.vue'
import { useExplore } from '../../composables/useExplore'
import { useAuth } from '../../composables/useAuth'
import { useAlbums } from '../../composables/useAlbums'
import type { GithubUser } from '../../types/domain'

const {
  results,
  search,
  loadStatus,
  error,
  totalCount,
  incompleteResults,
  hasSearched,
  currentPage,
  totalPages,
  clearState,
  searchGithubUsers,
} = useExplore()

const { isAuthenticated } = useAuth()

const {
  albums,
  isSaving,
  loadMyAlbums,
  addGithubUserToDefaultAlbum,
} = useAlbums()

const albumError = ref<string | null>(null)
const albumSuccess = ref<string | null>(null)

const githubInAlbumIds = computed(() => {
  const ids = new Set<number>()

  for (const album of albums.value) {
    for (const item of album.items) {
      if (item.source === 'github' && typeof item.githubUserId === 'number') {
        ids.add(item.githubUserId)
      }
    }
  }

  return ids
})

onMounted(async () => {
  if (!isAuthenticated.value) {
    return
  }

  try {
    await loadMyAlbums()
  } catch {
  }
})

async function handleSearch() {
  albumError.value = null
  albumSuccess.value = null
  await searchGithubUsers(search.value, 1)
}

function handleClear() {
  albumError.value = null
  albumSuccess.value = null
  clearState()
}

async function nextPage() {
  if (currentPage.value >= totalPages.value) {
    return
  }

  await searchGithubUsers(search.value, currentPage.value + 1)
}

async function prevPage() {
  if (currentPage.value <= 1) {
    return
  }

  await searchGithubUsers(search.value, currentPage.value - 1)
}

async function handleAddToAlbum(user: GithubUser) {
  albumError.value = null
  albumSuccess.value = null

  try {
    await addGithubUserToDefaultAlbum(user)
    albumSuccess.value = `${user.login} foi adicionado ao seu álbum.`
  } catch (err) {
    albumError.value = err instanceof Error ? err.message : 'Não foi possível adicionar ao álbum.'
  }
}

function displaySubline(user: GithubUser) {
  return [user.company, user.location].filter(Boolean).join(' • ')
}
</script>

<style scoped>
.tag {
  @apply rounded-full border border-white/10 bg-black/20 px-3 py-1;
}

.btn-primary {
  @apply rounded-xl bg-violet-400 px-4 py-2 font-semibold text-black;
}

.btn-secondary {
  @apply rounded-xl border border-slate-700 px-4 py-2 font-semibold text-white;
}

.stat-box {
  @apply rounded-2xl border border-white/10 bg-black/20 px-3 py-2;
}

.stat-label {
  @apply block text-[11px] uppercase tracking-[0.14em] text-slate-500;
}

.stat-value {
  @apply mt-1 block text-sm font-semibold text-white;
}
</style>
