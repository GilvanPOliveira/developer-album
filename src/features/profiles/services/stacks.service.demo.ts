import { demoStacks } from '../../../features/demo/demo-data'
import type { StackItem, StacksService } from './stacks.service'

export const demoStacksService: StacksService = {
  async listStacks(): Promise<StackItem[]> {
    return demoStacks.map((stack) => ({
      id: stack.id,
      name: stack.name,
      slug: stack.slug,
      category: stack.category,
    }))
  },
}
