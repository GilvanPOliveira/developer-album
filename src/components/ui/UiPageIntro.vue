<template>
  <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
    <div class="space-y-2">
      <span
        class="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium"
        :class="badgeClass"
      >
        {{ badge }}
      </span>

      <h1 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {{ title }}
      </h1>

      <p class="max-w-3xl text-sm leading-6 text-slate-300 sm:text-[15px]">
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.actions" class="flex shrink-0 flex-wrap gap-2.5">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber'

const props = withDefaults(
  defineProps<{
    badge: string
    title: string
    description: string
    tone?: Tone
  }>(),
  {
    tone: 'cyan',
  },
)

const badgeClass = computed(() => {
  const map: Record<Tone, string> = {
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    violet: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
    rose: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  }

  return map[props.tone]
})
</script>
