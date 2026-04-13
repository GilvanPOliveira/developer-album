<template>
  <slot v-if="!isBootstrapping" />

  <div
    v-else
    class="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-slate-100"
  >
    <div
      class="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8 text-center shadow-2xl shadow-slate-950/40"
    >
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
        Developer Album
      </p>

      <h1 class="mt-4 text-2xl font-bold tracking-tight text-white">
        Carregando sessão
      </h1>

      <p class="mt-3 text-sm leading-7 text-slate-400">
        Aguarde enquanto preparamos o acesso ao projeto.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useProfile } from '../../composables/useProfile'

const { bootstrap, isBootstrapping, userId } = useAuth()
const { loadMyProfile, clearProfileState } = useProfile()

const currentUserId = computed(() => userId.value)

async function syncProfile(nextUserId: string | null) {
  if (!nextUserId) {
    clearProfileState()
    return
  }

  try {
    await loadMyProfile()
  } catch {
  }
}

watch(currentUserId, async (nextUserId, previousUserId) => {
  if (nextUserId === previousUserId) {
    return
  }

  await syncProfile(nextUserId)
})

onMounted(async () => {
  await bootstrap()
  await syncProfile(currentUserId.value)
})
</script>
