<template>
  <section class="py-12">
    <UiContainer>
      <div class="mx-auto w-full max-w-md">
        <div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <div class="space-y-3">
            <span class="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
              Novo acesso
            </span>

            <h1 class="text-3xl font-bold tracking-tight text-white">
              Criar conta
            </h1>

            <p class="text-sm leading-7 text-slate-400">
              Crie sua conta para montar seu perfil, publicar sua figurinha e explorar desenvolvedores.
            </p>
          </div>

          <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">
            <div class="space-y-2">
              <label for="fullName" class="block text-sm font-medium text-slate-200">
                Nome completo
              </label>
              <input
                id="fullName"
                v-model.trim="form.fullName"
                type="text"
                autocomplete="name"
                placeholder="Seu nome"
                class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              >
            </div>

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
                autocomplete="new-password"
                placeholder="Crie uma senha"
                class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              >
            </div>

            <div class="space-y-2">
              <label for="passwordConfirmation" class="block text-sm font-medium text-slate-200">
                Confirmar senha
              </label>
              <input
                id="passwordConfirmation"
                v-model="form.passwordConfirmation"
                type="password"
                autocomplete="new-password"
                placeholder="Repita a senha"
                class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              >
            </div>

            <UiInlineAlert :message="validationError" tone="warning" :reserve-space="true" />
            <UiInlineAlert :message="error" tone="error" :reserve-space="true" />

            <button
              type="submit"
              :disabled="isLoading"
              class="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ isLoading ? 'Criando conta...' : 'Criar conta' }}
            </button>
          </form>

          <div class="mt-6 flex flex-col gap-3 text-sm">
            <RouterLink
              to="/login"
              class="text-cyan-300 transition hover:text-cyan-200"
            >
              Já tem conta? Entrar
            </RouterLink>
          </div>
        </div>
      </div>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import UiContainer from '../../components/ui/UiContainer.vue'
import UiInlineAlert from '../../components/ui/UiInlineAlert.vue'
import { useAuth } from '../../composables/useAuth'

type RegisterForm = {
  fullName: string
  email: string
  password: string
  passwordConfirmation: string
}

const router = useRouter()

const {
  signUp,
  isLoading,
  error,
  clearError,
} = useAuth()

const form = reactive<RegisterForm>({
  fullName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})

const validationError = computed(() => {
  if (!form.fullName || !form.email || !form.password || !form.passwordConfirmation) {
    return 'Preencha nome, e-mail, senha e confirmação.'
  }

  if (form.password.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres.'
  }

  if (form.password !== form.passwordConfirmation) {
    return 'A confirmação da senha não confere.'
  }

  return null
})

async function handleSubmit() {
  clearError()

  if (validationError.value) {
    return
  }

  try {
    await signUp({
      fullName: form.fullName,
      email: form.email,
      password: form.password,
    })

    await router.push('/app')
  } catch {
  }
}
</script>
