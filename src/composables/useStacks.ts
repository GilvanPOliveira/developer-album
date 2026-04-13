import { computed, ref } from 'vue'
import { stacksService, type StackItem } from '../features/profiles/services/stacks.service'

export function useStacks() {
  const items = ref<StackItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const groupedByCategory = computed(() => {
    return items.value.reduce<Record<string, StackItem[]>>((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }

      acc[item.category].push(item)
      return acc
    }, {})
  })

  async function load(): Promise<StackItem[]> {
    isLoading.value = true
    error.value = null

    try {
      const result = await stacksService.listStacks()
      items.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao carregar catálogo de stacks.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    items,
    groupedByCategory,
    isLoading,
    error,
    load,
  }
}
