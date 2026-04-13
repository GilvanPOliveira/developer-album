<template>
  <section class="py-8 md:py-10">
    <UiContainer>
      <div class="mx-auto max-w-4xl space-y-5">
        <UiPageIntro
          badge="Configurações"
          title="Conta e preferências"
          description="Ajuste a visibilidade do seu perfil, troque sua senha e gerencie sua sessão."
          tone="cyan"
        />

        <div class="grid gap-4">
          <div class="rounded-[1.5rem] border border-slate-800 bg-slate-900/75 p-5">
            <h2 class="text-lg font-semibold text-white">
              Perfil público
            </h2>

            <p class="mt-2 text-sm leading-6 text-slate-400">
              Controle se seu perfil ficará visível publicamente dentro da plataforma.
            </p>

            <div class="mt-4 flex items-center justify-between gap-4 rounded-[1.1rem] border border-slate-800 bg-slate-950 p-3.5">
              <div>
                <p class="text-sm font-semibold text-white">
                  Perfil visível
                </p>
                <p class="mt-1 text-sm text-slate-400">
                  {{ isPublic ? 'Seu perfil está público.' : 'Seu perfil está privado.' }}
                </p>
              </div>

              <label class="inline-flex cursor-pointer items-center gap-3">
                <span class="text-sm text-slate-300">{{ isPublic ? 'Público' : 'Privado' }}</span>
                <input
                  v-model="isPublic"
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-400 focus:ring-cyan-400"
                />
              </label>
            </div>

            <div class="mt-4 flex justify-end">
              <button
                type="button"
                :disabled="isSavingProfile || !profile"
                class="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                @click="handleSaveVisibility"
              >
                {{ isSavingProfile ? 'Salvando...' : 'Salvar visibilidade' }}
              </button>
            </div>
          </div>

          <div class="rounded-[1.5rem] border border-slate-800 bg-slate-900/75 p-5">
            <h2 class="text-lg font-semibold text-white">
              Segurança
            </h2>

            <p class="mt-2 text-sm leading-6 text-slate-400">
              Informe sua senha atual antes de definir uma nova senha para a conta.
            </p>

            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <div class="space-y-2 md:col-span-2">
                <label for="currentPassword" class="block text-sm font-medium text-slate-200">
                  Senha atual
                </label>
                <input
                  id="currentPassword"
                  v-model="currentPassword"
                  type="password"
                  placeholder="Digite sua senha atual"
                  class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                />
              </div>

              <div class="space-y-2 md:col-span-2">
                <label for="password" class="block text-sm font-medium text-slate-200">
                  Nova senha
                </label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="Digite a nova senha"
                  class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                />
              </div>

              <div class="space-y-2 md:col-span-2">
                <label for="passwordConfirmation" class="block text-sm font-medium text-slate-200">
                  Confirmar senha
                </label>
                <input
                  id="passwordConfirmation"
                  v-model="passwordConfirmation"
                  type="password"
                  placeholder="Repita a nova senha"
                  class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                />
              </div>
            </div>

            <div
              v-if="passwordError"
              class="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
            >
              {{ passwordError }}
            </div>

            <div class="mt-4 flex justify-end">
              <button
                type="button"
                :disabled="isLoading"
                class="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                @click="handleUpdatePassword"
              >
                {{ isLoading ? 'Atualizando...' : 'Atualizar senha' }}
              </button>
            </div>
          </div>

          <div class="rounded-[1.5rem] border border-slate-800 bg-slate-900/75 p-5">
            <h2 class="text-lg font-semibold text-white">
              Sessão
            </h2>

            <p class="mt-2 text-sm leading-6 text-slate-400">
              Encerre sua sessão atual quando precisar.
            </p>

            <div class="mt-4 flex justify-end">
              <button
                type="button"
                :disabled="isLoading"
                class="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                @click="handleSignOut"
              >
                {{ isLoading ? 'Saindo...' : 'Sair da conta' }}
              </button>
            </div>
          </div>

          <div
            v-if="profileError || authError"
            class="space-y-3"
          >
            <div
              class="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
            >
              {{ profileError || authError }}
            </div>
          </div>
        </div>
      </div>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import UiContainer from '../../components/ui/UiContainer.vue'
import UiPageIntro from '../../components/ui/UiPageIntro.vue'
import { useAuth } from '../../composables/useAuth'
import { useProfile } from '../../composables/useProfile'

const router = useRouter()
const currentPassword = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const isPublic = ref(true)

const {
  isLoading,
  error: authError,
  clearError: clearAuthError,
  updatePassword,
  signOut,
} = useAuth()

const {
  profile,
  isSavingProfile,
  error: profileError,
  loadMyProfile,
  saveProfile,
  clearError: clearProfileError,
} = useProfile()

const passwordError = computed(() => {
  if (!currentPassword.value && !password.value && !passwordConfirmation.value) {
    return null
  }

  if (!currentPassword.value) {
    return 'Informe sua senha atual.'
  }

  if (password.value.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres.'
  }

  if (password.value !== passwordConfirmation.value) {
    return 'A confirmação da senha não confere.'
  }

  return null
})

onMounted(async () => {
  clearAuthError()
  clearProfileError()

  try {
    await loadMyProfile()

    if (profile.value) {
      isPublic.value = profile.value.isPublic
    }
  } catch {
  }
})

async function handleSaveVisibility() {
  clearProfileError()

  if (!profile.value) {
    return
  }

  try {
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
      isPublic: isPublic.value,
    })
  } catch {
  }
}

async function handleUpdatePassword() {
  clearAuthError()

  if (passwordError.value || !password.value) {
    return
  }

  try {
    await updatePassword(currentPassword.value, password.value)
    currentPassword.value = ''
    password.value = ''
    passwordConfirmation.value = ''
  } catch {
  }
}

async function handleSignOut() {
  clearAuthError()

  try {
    await signOut()
    await router.push('/login')
  } catch {
  }
}
</script>
