<template>
  <section class="py-12">
    <UiContainer>
      <div class="mx-auto w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/40">
        <div class="space-y-2 text-center">
          <h1 class="text-3xl font-bold tracking-tight text-white">
            Redefinir senha
          </h1>
          <p class="text-sm leading-7 text-slate-400">
            Envie um link de recuperação ou defina uma nova senha quando vier do fluxo de e-mail.
          </p>
        </div>

        <form v-if="!isRecoveryMode" class="mt-8 space-y-5" @submit.prevent="handleRequestReset">
          <div class="space-y-2">
            <label for="reset-email" class="block text-sm font-medium text-slate-200">
              E-mail
            </label>
            <input
              id="reset-email"
              v-model.trim="resetForm.email"
              type="email"
              autocomplete="email"
              placeholder="voce@exemplo.com"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
            >
          </div>

          <UiInlineAlert :message="error" tone="error" :reserve-space="true" />

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ isLoading ? 'Enviando...' : 'Enviar link de recuperação' }}
          </button>
        </form>

        <form v-else class="mt-8 space-y-5" @submit.prevent="handleUpdatePassword">
          <div class="space-y-2">
            <label for="new-password" class="block text-sm font-medium text-slate-200">
              Nova senha
            </label>
            <input
              id="new-password"
              v-model="updateForm.password"
              type="password"
              autocomplete="new-password"
              placeholder="Digite sua nova senha"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
            >
          </div>

          <UiInlineAlert :message="error" tone="error" :reserve-space="true" />

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ isLoading ? 'Atualizando...' : 'Atualizar senha' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-slate-400">
          <RouterLink to="/login" class="transition hover:text-white">
            Voltar para login
          </RouterLink>
        </div>
      </div>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UiContainer from '../../components/ui/UiContainer.vue'
import UiInlineAlert from '../../components/ui/UiInlineAlert.vue'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const router = useRouter()

const { sendPasswordResetEmail, updatePassword, clearError, error, isLoading } = useAuth()

const resetForm = reactive({
  email: '',
})

const updateForm = reactive({
  password: '',
})

const isRecoveryMode = computed(() => {
  const hasCode = typeof route.query.code === 'string'
  const hasAccessToken = typeof route.hash === 'string' && route.hash.includes('access_token')
  return hasCode || hasAccessToken
})

onMounted(() => {
  clearError()
})

async function handleRequestReset() {
  clearError()

  if (!resetForm.email) {
    return
  }

  try {
    await sendPasswordResetEmail(resetForm.email)
  } catch {
  }
}

async function handleUpdatePassword() {
  clearError()

  if (!updateForm.password) {
    return
  }

  try {
    await updatePassword(null, updateForm.password)
    updateForm.password = ''
    await router.push('/login')
  } catch {
  }
}
</script>
