<template>
  <div
    class="w-full overflow-hidden rounded-2xl border px-4 py-3 text-sm leading-6 transition-all"
    :class="[toneClass, visibilityClass]"
    :aria-hidden="!show && reserveSpace"
    :role="show ? 'alert' : undefined"
  >
    <p class="break-words whitespace-pre-line">
      {{ content }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  message?: string | null
  tone?: 'error' | 'warning' | 'success' | 'info'
  reserveSpace?: boolean
  fallback?: string
}>(), {
  message: null,
  tone: 'error',
  reserveSpace: false,
  fallback: ' ',
})

const show = computed(() => Boolean(props.message))
const content = computed(() => props.message || props.fallback)

const toneClass = computed(() => {
  const tones = {
    error: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
    warning: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
    success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
    info: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-200',
  }

  return tones[props.tone]
})

const visibilityClass = computed(() => {
  if (show.value) {
    return 'min-h-[52px] opacity-100'
  }

  return props.reserveSpace ? 'pointer-events-none min-h-[52px] opacity-0' : 'hidden'
})
</script>
