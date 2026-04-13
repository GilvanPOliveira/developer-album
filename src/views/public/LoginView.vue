<template>
  <section class="py-12">
    <UiContainer>
      <div class="mx-auto w-full max-w-md">
        <div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <div class="space-y-3">
            <span class="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
              Acesso à plataforma
            </span>

            <h1 class="text-3xl font-bold tracking-tight text-white">
              Entrar
            </h1>

            <p class="text-sm leading-7 text-slate-400">
              Acesse sua conta para editar perfil, figurinha, projetos, favoritos e álbum.
            </p>
          </div>

          <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">
            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium text-slate-200">
                E-mail
              </label>
              <input
                id="email"
                v-model.trim="form.email"
                type="email"
                autocomplete="email"
                placeholder="voce@email.com"
                class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              >
            </div>

            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-slate-200">
                Senha
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="current-password"
                placeholder="Sua senha"
                class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              >
            </div>

            <div
              v-if="validationError"
              class="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
            >
              {{ validationError }}
            </div>

            <div
              v-if="error"
              class="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
            >
              {{ error }}
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ isLoading ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>

          <div class="mt-6 flex flex-col gap-3 text-sm">
            <RouterLink
              to="/reset-password"
              class="text-slate-300 transition hover:text-white"
            >
              Esqueci minha senha
            </RouterLink>

            <RouterLink
              to="/register"
              class="text-cyan-300 transition hover:text-cyan-200"
            >
              Ainda não tem conta? Criar conta
            </RouterLink>
          </div>
        </div>
      </div>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UiContainer from '../../components/ui/UiContainer.vue'
import { useAuth } from '../../composables/useAuth'

type LoginForm = {
  email: string
  password: string
}

const router = useRouter()
const route = useRoute()

const {
  signIn,
  isLoading,
  error,
  clearError,
} = useAuth()

const form = reactive<LoginForm>({
  email: '',
  password: '',
})

const validationError = computed(() => {
  if (!form.email || !form.password) {
    return 'Preencha e-mail e senha.'
  }

  return null
})

async function handleSubmit() {
  clearError()

  if (validationError.value) {
    return
  }

  try {
    await signIn({
      email: form.email,
      password: form.password,
    })

    const redirect =
      typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/app')
        ? route.query.redirect
        : '/app'

    await router.push(redirect)
  } catch {
  }
}
</script>
