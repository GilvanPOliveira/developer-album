<template>
  <section class="py-8 md:py-10">
    <UiContainer>
      <div class="mx-auto w-full max-w-7xl space-y-5">
        <UiPageIntro
          badge="Álbum"
          title="Meu álbum"
          description="Colecione perfis da plataforma e usuários GitHub em figurinhas com frente e verso."
          tone="cyan"
        />

        <div
          v-if="isLoading"
          class="rounded-[1.5rem] border border-slate-800 bg-slate-900/75 p-7 text-center"
        >
          <p class="text-lg font-semibold text-white">Carregando álbum</p>
          <p class="mt-3 text-sm leading-7 text-slate-400">
            Aguarde enquanto buscamos seus itens.
          </p>
        </div>

        <div
          v-else-if="error"
          class="rounded-[1.5rem] border border-rose-500/20 bg-rose-500/10 p-6"
        >
          <p class="text-lg font-semibold text-rose-200">Não foi possível carregar o álbum</p>
          <p class="mt-3 text-sm leading-7 text-rose-100/80">
            {{ error }}
          </p>
          <button
            type="button"
            class="mt-6 rounded-2xl bg-rose-200 px-5 py-3 text-sm font-semibold text-rose-950 transition hover:bg-white"
            @click="reloadAlbums"
          >
            Tentar novamente
          </button>
        </div>

        <div
          v-else-if="!defaultAlbum"
          class="rounded-[1.5rem] border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center"
        >
          <p class="text-lg font-semibold text-white">Nenhum álbum padrão encontrado</p>
          <p class="mt-3 text-sm leading-7 text-slate-400">
            Crie ou carregue um álbum padrão para começar.
          </p>
        </div>

        <div
          v-else-if="defaultAlbum.items.length === 0"
          class="rounded-[1.5rem] border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center"
        >
          <p class="text-lg font-semibold text-white">Seu álbum está vazio</p>
          <p class="mt-3 text-sm leading-7 text-slate-400">
            Vá para explorar e adicione perfis da plataforma ou usuários GitHub ao seu álbum.
          </p>
        </div>

        <div v-else class="album-board">
          <article
            v-for="item in defaultAlbum.items"
            :key="item.id"
            class="album-sticker"
          >
            <div class="album-sticker__shell" :class="stickerFrameClass(item)">
              <div class="album-sticker__flip" :class="{ 'album-sticker__flip--back': isFlipped(item.id) }">
                <div class="album-sticker__face album-sticker__face--front">
                  <div class="album-sticker__inner">
                    <div class="album-sticker__top">
                      <span
                        class="album-sticker__badge"
                        :class="'badge-tier'"
                      >
                        {{ stickerTier(item) }}
                      </span>

                      <button
                        type="button"
                        class="album-sticker__toggle"
                        @click="toggleSticker(item)"
                      >
                        Verso
                      </button>
                    </div>

                    <div class="album-sticker__front-scroll">
                      <div class="album-sticker__avatar-wrap">
                        <img
                          v-if="displayAvatar(item)"
                          :src="displayAvatar(item) ?? undefined"
                          :alt="displayName(item)"
                          class="album-sticker__avatar"
                        >

                        <div
                          v-else
                          class="album-sticker__fallback"
                        >
                          {{ displayInitial(item) }}
                        </div>
                      </div>

                      <div class="album-sticker__identity">
                        <span class="album-sticker__serial">#{{ displaySerial(item) }}</span>

                        <p class="album-sticker__name" :title="displayName(item)">
                          {{ displayName(item) }}
                        </p>

                        <p v-if="displayUsername(item)" class="album-sticker__username" :title="`@${displayUsername(item)}`">
                          @{{ displayUsername(item) }}
                        </p>
                      </div>

                      <div class="album-sticker__headline-wrap">
                        <p class="album-sticker__headline" :title="displayHeadline(item)">
                          {{ displayHeadline(item) }}
                        </p>

                        <p class="album-sticker__subline" :title="displaySubline(item)">
                          {{ displaySubline(item) }}
                        </p>
                      </div>

                      <div v-if="item.source === 'github'" class="album-sticker__stats-grid">
                        <div class="stat-box">
                          <span class="stat-box__label">Repos</span>
                          <strong class="stat-box__value">{{ displayRepoTotal(item) }}</strong>
                        </div>
                        <div class="stat-box">
                          <span class="stat-box__label">Stars</span>
                          <strong class="stat-box__value">{{ displayStars(item) }}</strong>
                        </div>
                        <div class="stat-box">
                          <span class="stat-box__label">Followers</span>
                          <strong class="stat-box__value">{{ displayFollowers(item) }}</strong>
                        </div>
                        <div class="stat-box">
                          <span class="stat-box__label">Following</span>
                          <strong class="stat-box__value">{{ displayFollowing(item) }}</strong>
                        </div>
                      </div>

                      <div class="album-sticker__chips">
                        <span v-if="displayCompany(item)" class="chip" :title="displayCompany(item) ?? undefined">
                          {{ displayCompany(item) }}
                        </span>

                        <span v-if="displayLocation(item)" class="chip" :title="displayLocation(item) ?? undefined">
                          {{ displayLocation(item) }}
                        </span>
                      </div>
                    </div>

                    <div class="album-sticker__footer">
                      <button
                        type="button"
                        class="album-sticker__stamp"
                        @click="toggleSticker(item)"
                      >
                        Verso
                      </button>
                    </div>
                  </div>
                </div>

                <div class="album-sticker__face album-sticker__face--back">
                  <div class="album-sticker__inner album-sticker__inner--back">
                    <div class="album-sticker__top">
                      <span class="album-sticker__badge album-sticker__badge--muted">
                        Informações extras
                      </span>

                      <button
                        type="button"
                        class="album-sticker__toggle"
                        @click="toggleSticker(item)"
                      >
                        Frente
                      </button>
                    </div>

                    <div class="album-sticker__back-header">
                      <p class="album-sticker__name" :title="displayName(item)">
                        {{ displayName(item) }}
                      </p>

                      <p v-if="displayUsername(item)" class="album-sticker__username" :title="`@${displayUsername(item)}`">
                        @{{ displayUsername(item) }}
                      </p>
                    </div>

                    <div class="album-sticker__back-scroll">
                      <div v-if="item.source === 'github'" class="album-sticker__repo-panel">
                        <div class="album-sticker__repo-head">
                          <span class="album-sticker__repo-label">Repositório em destaque</span>
                          <span class="album-sticker__repo-counter">
                            {{ repoCounterLabel(item) }}
                          </span>
                        </div>

                        <div v-if="isGithubLoading(item)" class="album-sticker__repo-card album-sticker__repo-card--state">
                          Carregando repositórios...
                        </div>

                        <div
                          v-else-if="githubRepoError(item)"
                          class="album-sticker__repo-card album-sticker__repo-card--state"
                        >
                          {{ githubRepoError(item) }}
                        </div>

                        <div
                          v-else-if="currentRepo(item)"
                          class="album-sticker__repo-card"
                        >
                          <p class="album-sticker__repo-name" :title="currentRepo(item)?.name">
                            {{ currentRepo(item)?.name }}
                          </p>

                          <p class="album-sticker__repo-meta" :title="currentRepo(item)?.fullName">
                            {{ currentRepo(item)?.fullName }}
                          </p>

                          <p class="album-sticker__repo-description" :title="currentRepo(item)?.description ?? ''">
                            {{ currentRepo(item)?.description || 'Sem descrição informada.' }}
                          </p>

                          <div class="album-sticker__repo-chips">
                            <span v-if="currentRepo(item)?.language" class="chip">
                              {{ currentRepo(item)?.language }}
                            </span>
                            <span class="chip">
                              Stars {{ currentRepo(item)?.stargazersCount ?? 0 }}
                            </span>
                            <span class="chip">
                              Forks {{ currentRepo(item)?.forksCount ?? 0 }}
                            </span>
                          </div>
                        </div>

                        <div v-else class="album-sticker__repo-card album-sticker__repo-card--state">
                          Nenhum repositório público encontrado.
                        </div>

                        <div v-if="repoCount(item) > 1" class="album-sticker__repo-nav">
                          <button
                            type="button"
                            class="album-sticker__repo-btn"
                            :disabled="currentRepoIndex(item) === 0"
                            @click="prevRepo(item)"
                          >
                            &lt;
                          </button>

                          <button
                            type="button"
                            class="album-sticker__repo-btn"
                            :disabled="currentRepoIndex(item) >= repoCount(item) - 1"
                            @click="nextRepo(item)"
                          >
                            &gt;
                          </button>
                        </div>
                      </div>

                      <dl class="album-sticker__facts">
                        <div class="fact-row">
                          <dt>Tipo</dt>
                          <dd>{{ item.source === 'github' ? 'Perfil GitHub' : 'Perfil da plataforma' }}</dd>
                        </div>

                        <div class="fact-row">
                          <dt>Raridade</dt>
                          <dd>{{ stickerTier(item) }}</dd>
                        </div>

                        <div class="fact-row" v-if="displayCompany(item)">
                          <dt>Empresa</dt>
                          <dd :title="displayCompany(item) ?? undefined">{{ displayCompany(item) }}</dd>
                        </div>

                        <div class="fact-row" v-if="displayLocation(item)">
                          <dt>Local</dt>
                          <dd :title="displayLocation(item) ?? undefined">{{ displayLocation(item) }}</dd>
                        </div>

                        <div class="fact-row" v-if="displayWebsite(item)">
                          <dt>Site</dt>
                          <dd class="fact-row__wrap" :title="displayWebsite(item) ?? undefined">{{ displayWebsite(item) }}</dd>
                        </div>

                        <div class="fact-row" v-if="displayTwitter(item)">
                          <dt>Twitter</dt>
                          <dd :title="`@${displayTwitter(item)}`">@{{ displayTwitter(item) }}</dd>
                        </div>

                        <div class="fact-row" v-if="item.source === 'github'">
                          <dt>Repos</dt>
                          <dd>{{ displayRepoTotal(item) }}</dd>
                        </div>

                        <div class="fact-row" v-if="item.source === 'github'">
                          <dt>Stars</dt>
                          <dd>{{ displayStars(item) }}</dd>
                        </div>

                        <div class="fact-row" v-if="item.source === 'github'">
                          <dt>Followers</dt>
                          <dd>{{ displayFollowers(item) }}</dd>
                        </div>

                        <div class="fact-row" v-if="item.source === 'github'">
                          <dt>Following</dt>
                          <dd>{{ displayFollowing(item) }}</dd>
                        </div>

                        <div class="fact-row" v-if="item.addedAt">
                          <dt>Adicionado</dt>
                          <dd>{{ formatDate(item.addedAt) }}</dd>
                        </div>

                        <div class="fact-row" v-if="item.source === 'github' && item.lastSyncedAt">
                          <dt>Sync</dt>
                          <dd>{{ formatDate(item.lastSyncedAt) }}</dd>
                        </div>
                      </dl>
                    </div>

                    <div class="album-sticker__actions album-sticker__actions--back">
                      <button
                        type="button"
                        class="action-btn action-btn--primary"
                        @click="toggleSticker(item)"
                      >
                        Frente
                      </button>

                      <RouterLink
                        v-if="item.source === 'platform' && item.username"
                        :to="`/dev/${item.username}`"
                        class="action-btn action-btn--primary"
                      >
                        Ver perfil
                      </RouterLink>

                      <a
                        v-if="item.source === 'github' && githubProfileUrl(item)"
                        :href="githubProfileUrl(item) ?? undefined"
                        target="_blank"
                        rel="noreferrer"
                        class="action-btn action-btn--github"
                      >
                        Ver GitHub
                      </a>

                      <button
                        type="button"
                        :disabled="isSaving"
                        class="action-btn action-btn--danger"
                        @click="handleRemove(item)"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </UiContainer>
  </section>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UiContainer from '../../components/ui/UiContainer.vue'
import UiPageIntro from '../../components/ui/UiPageIntro.vue'
import { useAlbums } from '../../composables/useAlbums'
import { githubUsersService } from '../../features/github/services/github-users.service'
import type { AlbumItem } from '../../features/albums/services/albums.service'
import type { GithubRepository, GithubUser } from '../../types/domain'

const {
  defaultAlbum,
  isLoading,
  isSaving,
  error,
  loadMyAlbums,
  removeProfileFromAlbum,
  removeGithubUserFromDefaultAlbum,
} = useAlbums()

const flippedStickerIds = ref<string[]>([])
const githubProfilesByItemId = ref<Record<string, GithubUser>>({})
const githubReposByItemId = ref<Record<string, GithubRepository[]>>({})
const githubRepoPageByItemId = ref<Record<string, number>>({})
const githubLoadingByItemId = ref<Record<string, boolean>>({})
const githubRepoErrorByItemId = ref<Record<string, string | null>>({})

onMounted(async () => {
  await reloadAlbums()
})

async function reloadAlbums() {
  try {
    await loadMyAlbums()
    await preloadGithubDetails()
  } catch {
  }
}

async function preloadGithubDetails() {
  const items = defaultAlbum.value?.items.filter(
    (item) => item.source === 'github' && Boolean(item.githubLogin),
  )

  if (!items?.length) {
    return
  }

  await Promise.allSettled(items.map((item) => ensureGithubDetails(item)))
}

async function handleRemove(item: AlbumItem) {
  if (!defaultAlbum.value) {
    return
  }

  try {
    if (item.source === 'github' && typeof item.githubUserId === 'number') {
      await removeGithubUserFromDefaultAlbum(item.githubUserId)
      return
    }

    if (item.source === 'platform' && item.profileId) {
      await removeProfileFromAlbum(defaultAlbum.value.id, item.profileId)
    }
  } catch {
  }
}

function isFlipped(stickerId: string) {
  return flippedStickerIds.value.includes(stickerId)
}

async function toggleSticker(item: AlbumItem) {
  if (isFlipped(item.id)) {
    flippedStickerIds.value = flippedStickerIds.value.filter((id) => id !== item.id)
    return
  }

  flippedStickerIds.value = [...flippedStickerIds.value, item.id]

  if (item.source === 'github') {
    await ensureGithubDetails(item)
  }
}

async function ensureGithubDetails(item: AlbumItem) {
  if (item.source !== 'github' || !item.githubLogin) {
    return
  }

  if (githubProfilesByItemId.value[item.id] || githubLoadingByItemId.value[item.id]) {
    return
  }

  githubLoadingByItemId.value = {
    ...githubLoadingByItemId.value,
    [item.id]: true,
  }

  githubRepoErrorByItemId.value = {
    ...githubRepoErrorByItemId.value,
    [item.id]: null,
  }

  try {
    const [profile, repos] = await Promise.all([
      githubUsersService.getUserByLogin(item.githubLogin),
      githubUsersService.getUserRepositories(item.githubLogin),
    ])

    githubProfilesByItemId.value = {
      ...githubProfilesByItemId.value,
      [item.id]: profile,
    }

    githubReposByItemId.value = {
      ...githubReposByItemId.value,
      [item.id]: repos,
    }

    githubRepoPageByItemId.value = {
      ...githubRepoPageByItemId.value,
      [item.id]: 0,
    }
  } catch (err) {
    githubRepoErrorByItemId.value = {
      ...githubRepoErrorByItemId.value,
      [item.id]: err instanceof Error ? err.message : 'Não foi possível carregar os dados do GitHub.',
    }
  } finally {
    githubLoadingByItemId.value = {
      ...githubLoadingByItemId.value,
      [item.id]: false,
    }
  }
}

function githubProfile(item: AlbumItem): GithubUser | null {
  return githubProfilesByItemId.value[item.id] ?? null
}

function githubRepos(item: AlbumItem): GithubRepository[] {
  return githubReposByItemId.value[item.id] ?? []
}

function currentRepoIndex(item: AlbumItem): number {
  return githubRepoPageByItemId.value[item.id] ?? 0
}

function repoCount(item: AlbumItem): number {
  return githubRepos(item).length
}

function currentRepo(item: AlbumItem): GithubRepository | null {
  return githubRepos(item)[currentRepoIndex(item)] ?? null
}

function repoCounterLabel(item: AlbumItem) {
  const total = repoCount(item)

  if (total === 0) {
    return '0 / 0'
  }

  return `${currentRepoIndex(item) + 1} / ${total}`
}

function nextRepo(item: AlbumItem) {
  const currentIndex = currentRepoIndex(item)
  const total = repoCount(item)

  if (currentIndex >= total - 1) {
    return
  }

  githubRepoPageByItemId.value = {
    ...githubRepoPageByItemId.value,
    [item.id]: currentIndex + 1,
  }
}

function prevRepo(item: AlbumItem) {
  const currentIndex = currentRepoIndex(item)

  if (currentIndex <= 0) {
    return
  }

  githubRepoPageByItemId.value = {
    ...githubRepoPageByItemId.value,
    [item.id]: currentIndex - 1,
  }
}

function isGithubLoading(item: AlbumItem): boolean {
  return Boolean(githubLoadingByItemId.value[item.id])
}

function githubRepoError(item: AlbumItem): string | null {
  return githubRepoErrorByItemId.value[item.id] ?? null
}

function githubProfileUrl(item: AlbumItem) {
  const profile = githubProfile(item)
  return profile?.htmlUrl || item.githubHtmlUrl || null
}

function displayAvatar(item: AlbumItem) {
  const profile = githubProfile(item)
  return profile?.avatarUrl || item.avatarUrl || null
}

function displayName(item: AlbumItem) {
  const profile = githubProfile(item)

  if (item.source === 'github') {
    return profile?.name || item.githubName || profile?.login || item.githubLogin || 'GitHub User'
  }

  return item.fullName || item.username || 'Perfil'
}

function displayUsername(item: AlbumItem) {
  const profile = githubProfile(item)

  if (item.source === 'github') {
    return profile?.login || item.githubLogin || null
  }

  return item.username
}

function displayInitial(item: AlbumItem) {
  const value = displayName(item).trim()
  return value.charAt(0).toUpperCase()
}

function displaySerial(item: AlbumItem) {
  if (item.source === 'github') {
    return String(item.githubUserId ?? item.id).slice(-4)
  }

  return item.id.slice(-4).toUpperCase()
}

function displayHeadline(item: AlbumItem) {
  const profile = githubProfile(item)

  if (item.source === 'github') {
    return profile?.bio || item.githubBio || 'Perfil do GitHub coletado para sua coleção.'
  }

  return item.headline || 'Perfil da plataforma disponível na sua coleção.'
}

function displaySubline(item: AlbumItem) {
  const parts = [displayCompany(item), displayLocation(item)].filter(Boolean)
  return parts.length > 0 ? parts.join(' • ') : 'Figurinha adicionada ao seu álbum principal.'
}

function displayLocation(item: AlbumItem) {
  const profile = githubProfile(item)
  return profile?.location || item.location || null
}

function displayCompany(item: AlbumItem) {
  const profile = githubProfile(item)
  return profile?.company || item.githubCompany || null
}

function displayWebsite(item: AlbumItem) {
  const profile = githubProfile(item)
  return profile?.blog || item.githubBlog || null
}

function displayTwitter(item: AlbumItem) {
  const profile = githubProfile(item)
  return profile?.twitterUsername || item.githubTwitterUsername || null
}

function displayRepoTotal(item: AlbumItem) {
  const profile = githubProfile(item)
  return profile?.publicRepos ?? item.githubPublicRepos ?? repoCount(item) ?? 0
}

function displayFollowers(item: AlbumItem) {
  const profile = githubProfile(item)
  return profile?.followers ?? item.githubFollowers ?? 0
}

function displayFollowing(item: AlbumItem) {
  const profile = githubProfile(item)
  return profile?.following ?? item.githubFollowing ?? 0
}

function displayStars(item: AlbumItem) {
  const profile = githubProfile(item)
  return profile?.totalStars ?? item.githubTotalStars ?? 0
}

function stickerTier(item: AlbumItem) {
  if (item.source === 'github') {
    const stars = displayStars(item)
    const followers = displayFollowers(item)

    if (stars >= 5000 || followers >= 10000) return 'Lendária'
    if (stars >= 1000 || followers >= 3000) return 'Épica'
    if (stars >= 100 || followers >= 500) return 'Rara'
    return 'Comum'
  }

  return 'Plataforma'
}

function stickerFrameClass(item: AlbumItem) {
  if (item.source === 'github') {
    const stars = displayStars(item)
    const followers = displayFollowers(item)

    if (stars >= 5000 || followers >= 10000) return 'frame-legendary'
    if (stars >= 1000 || followers >= 3000) return 'frame-epic'
    if (stars >= 100 || followers >= 500) return 'frame-rare'
    return 'frame-github'
  }

  return 'frame-platform'
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}
</script>
<style scoped>
.album-board {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  border-radius: 1.8rem;
  border: 1px solid rgba(51, 65, 85, 0.65);
  padding: 1rem;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.82), rgba(2, 6, 23, 0.82)),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: auto, 18px 18px, 18px 18px;
}

.album-sticker {
  width: 100%;
  max-width: 100%;
  margin-inline: auto;
  perspective: 1400px;
}

.album-sticker__shell {
  height: 430px;
  border-radius: 1.5rem;
  padding: 2px;
  box-shadow: 0 18px 36px rgba(2, 6, 23, 0.34);
}

.frame-platform {
  background: linear-gradient(180deg, rgba(34, 211, 238, 0.95), rgba(14, 116, 144, 0.8));
}

.frame-github {
  background: linear-gradient(180deg, rgba(168, 85, 247, 0.95), rgba(88, 28, 135, 0.82));
}

.frame-rare {
  background: linear-gradient(180deg, rgba(34, 211, 238, 0.95), rgba(14, 116, 144, 0.8));
}

.frame-epic {
  background: linear-gradient(180deg, rgba(168, 85, 247, 0.95), rgba(88, 28, 135, 0.82));
}

.frame-legendary {
  background: linear-gradient(180deg, rgba(251, 191, 36, 0.98), rgba(146, 64, 14, 0.86));
}

.album-sticker__flip {
  position: relative;
  height: 426px;
  transform-style: preserve-3d;
  transition: transform 0.75s ease;
}

.album-sticker__flip--back {
  transform: rotateY(180deg);
}

.album-sticker__face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 1.35rem;
  overflow: hidden;
}

.album-sticker__face--back {
  transform: rotateY(180deg);
}

.album-sticker__inner {
  display: flex;
  height: 426px;
  min-height: 0;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 1.35rem;
  padding: 0.9rem;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 28%),
    linear-gradient(180deg, rgba(7, 13, 31, 0.98), rgba(2, 6, 23, 1));
}

.album-sticker__inner--back {
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.05), transparent 30%),
    linear-gradient(180deg, rgba(10, 16, 32, 0.98), rgba(3, 7, 18, 1));
}

.album-sticker__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
}

.album-sticker__badge {
  border-radius: 999px;
  padding: 0.34rem 0.72rem;
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.badge-platform {
  border: 1px solid rgba(34, 211, 238, 0.3);
  background: rgba(8, 145, 178, 0.18);
  color: rgb(165, 243, 252);
}

.badge-github {
  border: 1px solid rgba(168, 85, 247, 0.3);
  background: rgba(107, 33, 168, 0.18);
  color: rgb(233, 213, 255);
}

.badge-tier {
  border: 1px solid rgba(250, 204, 21, 0.24);
  background: rgba(250, 204, 21, 0.12);
  color: rgb(254, 240, 138);
}

.album-sticker__badge--muted {
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.82);
  color: rgb(226, 232, 240);
}

.album-sticker__toggle {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.88);
  color: white;
  border-radius: 999px;
  padding: 0.38rem 0.72rem;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.album-sticker__avatar-wrap {
  display: flex;
  justify-content: center;
  margin-top: 0.7rem;
}

.album-sticker__avatar,
.album-sticker__fallback {
  width: 126px;
  height: 126px;
  border-radius: 1.1rem;
  border: 2px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.82), rgba(2, 6, 23, 0.95));
}

.album-sticker__avatar {
  object-fit: cover;
  object-position: center;
}

.album-sticker__fallback {
  display: grid;
  place-items: center;
  font-size: 2.5rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.72);
}

.album-sticker__identity {
  margin-top: 0.7rem;
  min-width: 0;
  text-align: center;
}

.album-sticker__serial {
  display: inline-flex;
  margin-bottom: 0.35rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.9);
  padding: 0.22rem 0.55rem;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: rgb(148, 163, 184);
}

.album-sticker__name,
.album-sticker__username,
.album-sticker__headline,
.album-sticker__subline,
.album-sticker__repo-name,
.album-sticker__repo-meta,
.fact-row dd {
  min-width: 0;
}

.album-sticker__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.98rem;
  font-weight: 800;
  color: white;
}

.album-sticker__username {
  margin-top: 0.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.76rem;
  color: rgb(148, 163, 184);
}

.album-sticker__headline-wrap {
  margin-top: 0.65rem;
  display: grid;
  gap: 0.32rem;
}

.album-sticker__front-scroll,
.album-sticker__back-scroll {
  position: relative;
  min-height: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.34) transparent;
  scrollbar-gutter: stable;
  overscroll-behavior: contain;
}

.album-sticker__front-scroll {
  margin-top: 0.05rem;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0.08rem 0.32rem 0.4rem 0;
}

.album-sticker__headline {
  min-height: 44px;
  text-align: center;
  font-size: 0.77rem;
  line-height: 1.4;
  color: rgb(226, 232, 240);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.album-sticker__subline {
  min-height: 18px;
  text-align: center;
  font-size: 0.68rem;
  line-height: 1.35;
  color: rgb(148, 163, 184);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.album-sticker__stats-grid {
  margin-top: 0.72rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.42rem;
}

.stat-box {
  min-width: 0;
  border-radius: 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(2, 6, 23, 0.72);
  padding: 0.48rem 0.58rem;
}

.stat-box__label {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(100, 116, 139);
}

.stat-box__value {
  display: block;
  margin-top: 0.14rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
  line-height: 1.15;
  color: white;
}

.album-sticker__chips {
  margin-top: 0.7rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem;
}

.chip {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(2, 6, 23, 0.78);
  padding: 0.28rem 0.58rem;
  font-size: 0.62rem;
  font-weight: 700;
  color: rgb(226, 232, 240);
}

.chip--tier {
  border-color: rgba(250, 204, 21, 0.24);
  background: rgba(250, 204, 21, 0.12);
  color: rgb(254, 240, 138);
}

.album-sticker__footer {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding-top: 0.8rem;
}

.album-sticker__stamp {
  cursor: pointer;
  border-radius: 999px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  background: transparent;
  padding: 0.34rem 0.78rem;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgb(148, 163, 184);
}

.album-sticker__stamp:hover {
  border-color: rgba(255, 255, 255, 0.24);
  color: rgb(226, 232, 240);
}

.album-sticker__back-header {
  margin-top: 0.75rem;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid rgba(51, 65, 85, 0.65);
}

.album-sticker__back-scroll {
  margin-top: 0.7rem;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  overflow-y: auto;
  padding: 0.08rem 0.32rem 0.5rem 0;
}

.album-sticker__front-scroll::-webkit-scrollbar,
.album-sticker__back-scroll::-webkit-scrollbar {
  width: 6px;
}

.album-sticker__front-scroll::-webkit-scrollbar-thumb,
.album-sticker__back-scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: linear-gradient(180deg, rgba(148, 163, 184, 0.28), rgba(100, 116, 139, 0.5));
}

.album-sticker__front-scroll::-webkit-scrollbar-track,
.album-sticker__back-scroll::-webkit-scrollbar-track {
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.12);
}

.album-sticker__repo-panel {
  display: grid;
  gap: 0.45rem;
}

.album-sticker__repo-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.album-sticker__repo-label,
.album-sticker__repo-counter {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgb(148, 163, 184);
}

.album-sticker__repo-card {
  border-radius: 0.95rem;
  border: 1px solid rgba(51, 65, 85, 0.8);
  background: rgba(2, 6, 23, 0.72);
  padding: 0.65rem;
}

.album-sticker__repo-card--state {
  min-height: 88px;
  display: grid;
  place-items: center;
  text-align: center;
  font-size: 0.72rem;
  color: rgb(148, 163, 184);
}

.album-sticker__repo-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.8rem;
  font-weight: 800;
  color: white;
}

.album-sticker__repo-meta {
  margin-top: 0.18rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.64rem;
  color: rgb(148, 163, 184);
}

.album-sticker__repo-description {
  margin-top: 0.42rem;
  min-height: 34px;
  font-size: 0.71rem;
  line-height: 1.35;
  color: rgb(226, 232, 240);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.album-sticker__repo-chips {
  margin-top: 0.42rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.album-sticker__repo-nav {
  display: flex;
  justify-content: flex-end;
  gap: 0.35rem;
}

.album-sticker__repo-btn {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.88);
  color: white;
  font-size: 0.84rem;
  font-weight: 800;
}

.album-sticker__repo-btn:disabled {
  opacity: 0.35;
}

.album-sticker__facts {
  display: grid;
  gap: 0.42rem;
}

.fact-row {
  display: grid;
  grid-template-columns: 60px minmax(0, 1fr);
  gap: 0.55rem;
  align-items: start;
}

.fact-row dt {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(100, 116, 139);
}

.fact-row dd {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.69rem;
  line-height: 1.35;
  color: rgb(226, 232, 240);
}

.fact-row__wrap {
  word-break: break-word;
  white-space: normal;
}

.album-sticker__actions {
  flex-shrink: 0;
  margin-top: 0.7rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
}

.album-sticker__actions--back {
  justify-content: stretch;
}

.action-btn {
  display: inline-flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  min-width: 0;
  border-radius: 0.8rem;
  padding: 0.5rem 0.76rem;
  font-size: 0.72rem;
  font-weight: 800;
  transition: 0.2s ease;
}

.action-btn--primary {
  background: rgb(34, 211, 238);
  color: rgb(15, 23, 42);
}

.action-btn--github {
  background: rgb(167, 139, 250);
  color: rgb(15, 23, 42);
}

.action-btn--danger {
  border: 1px solid rgba(244, 63, 94, 0.22);
  background: rgba(244, 63, 94, 0.1);
  color: rgb(254, 205, 211);
}

@media (max-width: 1279px) {
  .album-board {
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  }
}

@media (max-width: 640px) {
  .album-board {
    gap: 0.85rem;
    padding: 0.75rem;
    border-radius: 1.45rem;
  }

  .album-sticker__shell {
    height: 396px;
  }

  .album-sticker__flip,
  .album-sticker__inner {
    height: 392px;
  }

  .album-sticker__inner {
    padding: 0.78rem;
  }

  .album-sticker__avatar,
  .album-sticker__fallback {
    width: 112px;
    height: 112px;
  }

  .album-sticker__headline {
    min-height: 40px;
  }

  .album-sticker__stats-grid {
    gap: 0.34rem;
  }

  .stat-box {
    padding: 0.42rem 0.5rem;
  }
}

@media (max-width: 420px) {
  .album-board {
    grid-template-columns: 1fr;
  }

  .album-sticker {
    max-width: 290px;
  }

  .album-sticker__shell {
    height: 382px;
  }

  .album-sticker__flip,
  .album-sticker__inner {
    height: 378px;
  }

  .album-sticker__repo-card--state {
    min-height: 82px;
  }
}
</style>
