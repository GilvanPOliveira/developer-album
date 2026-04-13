<template>
  <section class="py-8 md:py-10">
    <UiContainer>
      <div class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div class="space-y-6">
          <div class="space-y-3">
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Developer Album
            </p>

            <h1 class="max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Descubra desenvolvedores pelo GitHub e monte seu álbum de figurinhas técnicas.
            </h1>

            <p class="max-w-3xl text-base leading-7 text-slate-300">
              Busque perfis reais, vincule seu GitHub, exiba seus repositórios automaticamente
              e organize sua coleção em uma experiência visual de cards.
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
              to="/login"
              class="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-slate-600 hover:bg-slate-800"
            >
              Entrar
            </RouterLink>

            <RouterLink
              to="/register"
              class="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-slate-600 hover:bg-slate-800"
            >
              Criar conta
            </RouterLink>
          </div>
        </div>

        <div class="flex justify-center">
          <article
            class="relative w-full max-w-sm overflow-hidden rounded-[1.6rem] border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-xl shadow-slate-950/40"
          >
            <div class="pointer-events-none absolute inset-0 bg-cyan-400/10 opacity-40" />

            <div class="relative z-10">
              <div class="flex items-start">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                    PRODUTO
                  </p>

                  <h2 class="mt-2 text-2xl font-bold text-white">
                    GitHub + Cards + Álbum
                  </h2>

                  <p class="mt-1 text-sm text-slate-300">
                    Vincule seu perfil, descubra outros desenvolvedores e organize sua coleção visual.
                  </p>
                </div>
              </div>

              <div class="mt-5 flex flex-wrap gap-2">
                <span class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-slate-100">
                  GitHub real
                </span>
                <span class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-slate-100">
                  Cards
                </span>
                <span class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-slate-100">
                  Álbum
                </span>
              </div>

              <p class="mt-5 text-sm leading-6 text-slate-200">
                A raridade da figurinha é automática e considera seus indicadores reais do GitHub.
              </p>
            </div>
          </article>
        </div>
      </div>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
import UiContainer from '../../components/ui/UiContainer.vue'
</script>
