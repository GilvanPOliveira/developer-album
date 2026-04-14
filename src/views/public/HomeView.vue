<template>
  <section class="py-8 md:py-10">
    <UiContainer>
      <div class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div class="space-y-6">
          <div class="space-y-3">
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Developer Album
            </p>

            <h1
              class="max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Descubra desenvolvedores pelo GitHub e monte seu álbum de figurinhas técnicas.
            </h1>

            <p class="max-w-3xl text-base leading-7 text-slate-300">
              Antes de entrar, escolha como quer usar a plataforma: explorar uma experiência demo
              local ou acessar dados reais com Supabase.
            </p>
          </div>

          <div class="flex flex-wrap gap-2.5">
            <RouterLink
              to="/explore"
              class="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Explorar desenvolvedores
            </RouterLink>

            <RouterLink
              :to="registerRoute"
              class="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-slate-600 hover:bg-slate-800"
            >
              Criar conta com {{ selectedModeLabel }}
            </RouterLink>

            <RouterLink
              :to="loginRoute"
              class="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-slate-600 hover:bg-slate-800"
            >
              Já tenho conta
            </RouterLink>
          </div>
        </div>

        <div class="flex justify-center">
          <article
            class="relative w-full max-w-xl overflow-hidden rounded-[1.8rem] border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-xl shadow-slate-950/40"
          >
            <div class="pointer-events-none absolute inset-0 bg-cyan-400/10 opacity-40" />

            <div class="relative z-10 space-y-5">
              <div class="space-y-3">
                <div>
                  <p
                    class="flex items-center whitespace-nowrap text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300"
                  >
                    ESCOLHA O MODO:
                     <span class="text-white">Demo ou Supabase </span>
                  </p>
                </div>

                <div class="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p class="text-sm font-semibold text-white">
                    Modo selecionado: <span class="text-cyan-300">{{ selectedModeLabel }}</span>
                  </p>

                  <p class="mt-2 text-sm leading-6 text-slate-400">
                    {{ selectedModeDescription }}
                  </p>
                </div>
              </div>

              <div class="grid gap-3">
                <button
                  v-for="mode in modes"
                  :key="mode.mode"
                  type="button"
                  :disabled="!mode.available"
                  class="rounded-2xl border p-4 text-left transition"
                  :class="modeCardClass(mode.mode, mode.available)"
                  @click="selectMode(mode.mode)"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-sm font-semibold text-white">
                        {{ mode.label }}
                      </p>

                      <p class="mt-1 text-sm leading-6 text-slate-300">
                        {{ mode.description }}
                      </p>
                    </div>

                    <span
                      class="rounded-full px-2.5 py-1 text-xs font-semibold"
                      :class="modeBadgeClass(mode.mode)"
                    >
                      {{
                        appModeState === mode.mode
                          ? 'Selecionado'
                          : mode.available
                            ? 'Disponível'
                            : 'Indisponível'
                      }}
                    </span>
                  </div>
                </button>
              </div>

              <UiInlineAlert :message="showSupabaseHint ? supabaseHint : null" tone="warning" />

              <div class="flex flex-wrap gap-2">
                <span
                  class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-slate-100"
                >
                  GitHub real
                </span>
                <span
                  class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-slate-100"
                >
                  Cards
                </span>
                <span
                  class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-slate-100"
                >
                  Álbum
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UiContainer from '../../components/ui/UiContainer.vue';
import UiInlineAlert from '../../components/ui/UiInlineAlert.vue';
import type { AppMode } from '../../config/app-mode';
import {
  appModeState,
  getAppModeLabel,
  getConfiguredAppMode,
  getSupabaseConfigError,
  listAvailableAppModes,
  setAppMode,
} from '../../config/app-mode';

const modes = computed(() => listAvailableAppModes());
const selectedModeLabel = computed(() => getAppModeLabel(appModeState.value));
const selectedModeDescription = computed(() => {
  const activeMode = modes.value.find((mode) => mode.mode === appModeState.value);
  return activeMode?.description ?? 'Escolha como deseja acessar a plataforma.';
});

const loginRoute = computed(() => '/login');
const registerRoute = computed(() => '/register');

const showSupabaseHint = computed(() => {
  return (
    getConfiguredAppMode() !== 'demo' &&
    !modes.value.some((mode) => mode.mode === 'supabase' && mode.available)
  );
});

const supabaseHint = computed(() => getSupabaseConfigError());

function selectMode(mode: AppMode): void {
  setAppMode(mode);
}

function modeCardClass(mode: AppMode, available: boolean): string {
  if (!available) {
    return 'border-slate-800 bg-slate-950/70 opacity-60 cursor-not-allowed';
  }

  if (appModeState.value === mode) {
    return 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-950/30';
  }

  return 'border-slate-700 bg-slate-950/80 hover:border-slate-500 hover:bg-slate-900';
}

function modeBadgeClass(mode: AppMode): string {
  return appModeState.value === mode
    ? 'bg-cyan-400 text-slate-950'
    : 'border border-white/10 bg-white/5 text-slate-200';
}
</script>
