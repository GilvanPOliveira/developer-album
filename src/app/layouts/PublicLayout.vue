<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <header class="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/88 backdrop-blur">
      <UiContainer class="py-3">
        <div class="flex items-center justify-between gap-4">
          <div class="flex min-w-0 items-center gap-3 lg:gap-6">
            <RouterLink to="/" class="shrink-0" @click="closeMobileMenu">
              <UiLogo />
            </RouterLink>
          </div>

          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 transition hover:border-slate-600 hover:bg-slate-800 lg:hidden"
            :aria-expanded="isMobileMenuOpen"
            aria-label="Abrir menu"
            @click="toggleMobileMenu"
          >
            <svg
              v-if="!isMobileMenuOpen"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>

            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>

          <div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between lg:gap-4">
            <div class="flex min-w-0 items-center gap-6">
              <nav class="flex flex-wrap items-center gap-2">
                <template v-if="isAuthenticated">
                  <RouterLink
                    to="/app"
                    class="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
                    active-class="bg-slate-900 text-white"
                  >
                    Dashboard
                  </RouterLink>

                  <RouterLink
                    to="/explore"
                    class="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
                    active-class="bg-slate-900 text-white"
                  >
                    Explorar
                  </RouterLink>

                  <RouterLink
                    to="/app/projects"
                    class="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
                    active-class="bg-slate-900 text-white"
                  >
                    Projetos
                  </RouterLink>

                  <RouterLink
                    to="/app/my-album"
                    class="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
                    active-class="bg-slate-900 text-white"
                  >
                    Álbum
                  </RouterLink>
                </template>

                <template v-else>
                  <RouterLink
                    to="/"
                    class="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
                    active-class="bg-slate-900 text-white"
                  >
                    Home
                  </RouterLink>

                  <RouterLink
                    to="/explore"
                    class="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
                    active-class="bg-slate-900 text-white"
                  >
                    Explorar
                  </RouterLink>
                </template>
              </nav>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <template v-if="isAuthenticated">
                <RouterLink
                  to="/app/settings"
                  class="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:border-slate-600 hover:bg-slate-800"
                >
                  Configurações
                </RouterLink>

                <button
                  type="button"
                  :disabled="isLoading"
                  class="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  @click="handleSignOut"
                >
                  {{ isLoading ? 'Saindo...' : 'Sair' }}
                </button>
              </template>

              <template v-else>
                <RouterLink
                  to="/register"
                  class="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                  active-class="bg-cyan-300 text-slate-950"
                >
                  Criar conta
                </RouterLink>

                <RouterLink
                  to="/login"
                  class="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
                  active-class="bg-slate-900 text-white"
                >
                  Já tenho conta
                </RouterLink>
              </template>
            </div>
          </div>
        </div>

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="isMobileMenuOpen"
            class="mt-4 border-t border-slate-800 pt-4 lg:hidden"
          >
            <div class="grid gap-4">
              <nav class="grid gap-2">
                <template v-if="isAuthenticated">
                  <RouterLink
                    to="/app"
                    class="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900 hover:text-white"
                    active-class="bg-slate-900 text-white"
                    @click="closeMobileMenu"
                  >
                    Dashboard
                  </RouterLink>

                  <RouterLink
                    to="/explore"
                    class="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900 hover:text-white"
                    active-class="bg-slate-900 text-white"
                    @click="closeMobileMenu"
                  >
                    Explorar
                  </RouterLink>

                  <RouterLink
                    to="/app/projects"
                    class="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900 hover:text-white"
                    active-class="bg-slate-900 text-white"
                    @click="closeMobileMenu"
                  >
                    Projetos
                  </RouterLink>

                  <RouterLink
                    to="/app/my-album"
                    class="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900 hover:text-white"
                    active-class="bg-slate-900 text-white"
                    @click="closeMobileMenu"
                  >
                    Álbum
                  </RouterLink>
                </template>

                <template v-else>
                  <RouterLink
                    to="/"
                    class="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900 hover:text-white"
                    active-class="bg-slate-900 text-white"
                    @click="closeMobileMenu"
                  >
                    Home
                  </RouterLink>

                  <RouterLink
                    to="/explore"
                    class="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900 hover:text-white"
                    active-class="bg-slate-900 text-white"
                    @click="closeMobileMenu"
                  >
                    Explorar
                  </RouterLink>
                </template>
              </nav>

              <div class="h-px bg-slate-800" />

              <div class="grid gap-2">
                <template v-if="isAuthenticated">
                  <RouterLink
                    to="/app/settings"
                    class="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-slate-600 hover:bg-slate-800"
                    @click="closeMobileMenu"
                  >
                    Configurações
                  </RouterLink>

                  <button
                    type="button"
                    :disabled="isLoading"
                    class="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    @click="handleSignOut"
                  >
                    {{ isLoading ? 'Saindo...' : 'Sair' }}
                  </button>
                </template>

                <template v-else>
                  <RouterLink
                    to="/register"
                    class="rounded-2xl bg-cyan-400 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                    active-class="bg-cyan-300 text-slate-950"
                    @click="closeMobileMenu"
                  >
                    Criar conta
                  </RouterLink>

                  <RouterLink
                    to="/login"
                    class="rounded-2xl px-4 py-3 text-center text-sm font-medium text-slate-200 transition hover:bg-slate-900 hover:text-white"
                    active-class="bg-slate-900 text-white"
                    @click="closeMobileMenu"
                  >
                    Já tenho conta
                  </RouterLink>
                </template>
              </div>
            </div>
          </div>
        </Transition>
      </UiContainer>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import UiContainer from '../../components/ui/UiContainer.vue'
import UiLogo from '../../components/ui/UiLogo.vue'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { isAuthenticated, signOut, isLoading, clearError } = useAuth()

const isMobileMenuOpen = ref(false)

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function handleResize() {
  if (window.innerWidth >= 1024) {
    closeMobileMenu()
  }
}

async function handleSignOut() {
  clearError()

  try {
    await signOut()
    closeMobileMenu()
    await router.push('/login')
  } catch {
  }
}

watch(
  () => route.fullPath,
  () => {
    closeMobileMenu()
  },
)

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
