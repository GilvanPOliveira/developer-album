<template>
  <section class="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
    <div class="w-full max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900/70 p-10 text-center shadow-2xl shadow-slate-950/40">
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
        404
      </p>

      <h1 class="mt-4 text-4xl font-bold tracking-tight text-white">
        Página não encontrada
      </h1>

      <p class="mt-4 text-base leading-7 text-slate-400">
        A rota que você tentou acessar não existe dentro do Developer Album.
      </p>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <RouterLink
          to="/"
          class="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Voltar para a home
        </RouterLink>

        <RouterLink
          to="/explore"
          class="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-600 hover:bg-slate-800"
        >
          Ir para explorar
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
