<template>
  <section class="py-8 md:py-10">
    <UiContainer>
      <div v-if="loadStatus === 'loading'" class="rounded-[1.75rem] border border-slate-800 bg-slate-900/75 p-7 text-center">
        <p class="text-lg font-semibold text-white">
          Carregando perfil público
        </p>
        <p class="mt-3 text-sm leading-7 text-slate-400">
          Aguarde enquanto buscamos os dados do desenvolvedor.
        </p>
      </div>

      <div
        v-else-if="loadStatus === 'error' || !profile"
        class="rounded-[1.75rem] border border-rose-500/20 bg-rose-500/10 p-6"
      >
        <p class="text-lg font-semibold text-rose-200">
          Perfil não encontrado
        </p>
        <p class="mt-3 text-sm leading-7 text-rose-100/80">
          {{ error || 'Não foi possível carregar este perfil público.' }}
        </p>

        <div class="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            class="rounded-2xl bg-rose-200 px-5 py-3 text-sm font-semibold text-rose-950 transition hover:bg-white"
            @click="reloadProfile"
          >
            Tentar novamente
          </button>

          <RouterLink
            to="/explore"
            class="rounded-2xl border border-rose-200/40 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/10"
          >
            Voltar para explorar
          </RouterLink>
        </div>
      </div>

      <div v-else class="space-y-5">
        <UiPageIntro
          badge="Perfil público"
          :title="profile.fullName || profile.username"
          :description="profile.headline || 'Sem headline informada.'"
          tone="cyan"
        >
          <template #actions>
            <div class="flex flex-wrap gap-3 text-sm">
              <span
                v-if="profile.location"
                class="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-slate-200"
              >
                {{ profile.location }}
              </span>

              <button
                v-if="isAuthenticated && currentUserId !== profile.id"
                type="button"
                :disabled="isSaving"
                class="rounded-full px-4 py-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                :class="favoriteIds.has(profile.id)
                  ? 'bg-white text-slate-950 hover:bg-slate-200'
                  : 'border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500 hover:bg-slate-800'"
                @click="handleToggleFavorite(profile.id)"
              >
                {{ favoriteIds.has(profile.id) ? 'Favoritado' : 'Favoritar' }}
              </button>
            </div>
          </template>
        </UiPageIntro>

        <div class="text-base text-slate-300">
          @{{ profile.username }}
        </div>

        <UiInlineAlert :message="favoriteError" tone="error" />

        <div class="grid gap-4 xl:grid-cols-[1.1fr_380px]">
          <div class="space-y-4">
            <div class="rounded-[1.5rem] border border-slate-800 bg-slate-900/75 p-5">
              <h2 class="text-lg font-semibold text-white">
                Sobre
              </h2>

              <p class="mt-3 text-sm leading-7 text-slate-300">
                {{ profile.bio || 'Este desenvolvedor ainda não adicionou uma bio pública.' }}
              </p>
            </div>

            <div class="rounded-[1.5rem] border border-slate-800 bg-slate-900/75 p-5">
              <h2 class="text-lg font-semibold text-white">
                Stacks
              </h2>

              <div v-if="profile.stacks.length > 0" class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="stack in profile.stacks"
                  :key="stack.id"
                  class="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200"
                >
                  {{ stack.name }}
                </span>
              </div>

              <p v-else class="mt-4 text-sm text-slate-400">
                Nenhuma stack pública informada.
              </p>
            </div>
          </div>

          <aside class="space-y-4">
            <article
              class="relative overflow-hidden rounded-[1.6rem] border p-5 shadow-xl shadow-slate-950/40"
              :class="cardClasses"
            >
              <div class="pointer-events-none absolute inset-0 opacity-30" :class="coverClasses" />

              <div class="relative z-10">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.24em]" :class="accentTextClass">
                      {{ rarityLabel }}
                    </p>

                    <h2 class="mt-2 text-2xl font-bold text-white">
                      {{ profile.fullName || profile.username }}
                    </h2>

                    <p class="mt-1 text-sm text-slate-300">
                      {{ profile.headline || 'Sem headline informada' }}
                    </p>
                  </div>

                  <div class="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <img
                      v-if="profile.avatarUrl"
                      :src="profile.avatarUrl"
                      :alt="profile.fullName || profile.username"
                      class="h-full w-full object-cover"
                    >
                  </div>
                </div>

                <div class="mt-5 flex flex-wrap gap-2">
                  <span
                    v-for="stack in profile.stacks.slice(0, 4)"
                    :key="stack.id"
                    class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-slate-100"
                  >
                    {{ stack.name }}
                  </span>

                  <span
                    v-if="profile.stacks.length === 0"
                    class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-slate-300"
                  >
                    Sem stacks
                  </span>
                </div>

                <p class="mt-5 text-sm leading-6 text-slate-200">
                  {{ profile.bio || 'Perfil público disponível para descoberta na plataforma.' }}
                </p>
              </div>
            </article>
          </aside>
        </div>

        <div class="rounded-[1.5rem] border border-slate-800 bg-slate-900/75 p-5">
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-xl font-semibold text-white">
              Projetos públicos
            </h2>

            <span class="text-sm text-slate-400">
              {{ projects.length }} projeto(s)
            </span>
          </div>

          <div v-if="projects.length === 0" class="mt-5 rounded-[1.2rem] border border-dashed border-slate-700 bg-slate-950/40 p-6 text-center">
            <p class="text-lg font-semibold text-white">
              Nenhum projeto público disponível
            </p>
            <p class="mt-3 text-sm leading-7 text-slate-400">
              Este desenvolvedor ainda não publicou projetos no perfil.
            </p>
          </div>

          <div v-else class="mt-5 grid gap-3.5 lg:grid-cols-2">
            <article
              v-for="project in projects"
              :key="project.id"
              class="rounded-[1.4rem] border border-slate-800 bg-slate-950/60 p-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="space-y-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-xl font-semibold text-white">
                      {{ project.title }}
                    </h3>

                    <span
                      v-if="project.isFeatured"
                      class="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200"
                    >
                      Destaque
                    </span>
                  </div>

                  <p class="text-sm text-slate-400">
                    /{{ project.slug }}
                  </p>
                </div>
              </div>

              <p class="mt-3 text-sm leading-6 text-slate-300">
                {{ project.description || 'Sem descrição informada.' }}
              </p>

              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="stack in project.stacks"
                  :key="stack.id"
                  class="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200"
                >
                  {{ stack.name }}
                </span>

                <span
                  v-if="project.stacks.length === 0"
                  class="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-400"
                >
                  Sem stacks
                </span>
              </div>

              <div class="mt-4 flex flex-wrap gap-2.5">
                <a
                  v-if="project.projectUrl"
                  :href="project.projectUrl"
                  target="_blank"
                  rel="noreferrer"
                  class="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Ver projeto
                </a>

                <a
                  v-if="project.repoUrl"
                  :href="project.repoUrl"
                  target="_blank"
                  rel="noreferrer"
                  class="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800"
                >
                  Repositório
                </a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import UiContainer from '../../components/ui/UiContainer.vue'
import UiInlineAlert from '../../components/ui/UiInlineAlert.vue'
import UiPageIntro from '../../components/ui/UiPageIntro.vue'
import { usePublicProfileStore } from '../../stores/public-profile.store'
import { useFavorites } from '../../composables/useFavorites'
import { useAuth } from '../../composables/useAuth'
import { storeToRefs } from 'pinia'

const route = useRoute()
const { userId, isAuthenticated } = useAuth()

const publicProfileStore = usePublicProfileStore()
const { profile, projects, loadStatus, error } = storeToRefs(publicProfileStore)
const { clearState, loadByUsername } = publicProfileStore

const {
  favorites,
  isSaving,
  error: favoriteError,
  loadMyFavorites,
  addFavorite,
  removeFavorite,
  clearState: clearFavoritesState,
} = useFavorites()

const username = computed(() => {
  return typeof route.params.username === 'string' ? route.params.username : ''
})

const currentUserId = computed(() => userId.value)

const favoriteIds = computed(() => {
  return new Set(favorites.value.map((item) => item.targetProfileId))
})

watch(username, async (nextUsername, previousUsername) => {
  if (!nextUsername || nextUsername === previousUsername) {
    return
  }

  try {
    await loadByUsername(nextUsername)

    if (currentUserId.value) {
      await loadMyFavorites()
    }
  } catch {
  }
})

onMounted(async () => {
  clearState()
  clearFavoritesState()

  if (!username.value) {
    return
  }

  try {
    await loadByUsername(username.value)

    if (currentUserId.value) {
      await loadMyFavorites()
    }
  } catch {
  }
})

async function reloadProfile() {
  if (!username.value) {
    return
  }

  try {
    await loadByUsername(username.value)
  } catch {
  }
}

async function handleToggleFavorite(targetProfileId: string) {
  if (!currentUserId.value) {
    return
  }

  try {
    if (favoriteIds.value.has(targetProfileId)) {
      await removeFavorite(targetProfileId)
      return
    }

    await addFavorite(targetProfileId)
  } catch {
  }
}

const rarityLabel = computed(() => 'Common')
const accentTextClass = computed(() => 'text-cyan-300')
const cardClasses = computed(() => 'border-white/10 bg-gradient-to-b from-slate-900 to-slate-950')
const coverClasses = computed(() => 'bg-cyan-400/20')
</script>
