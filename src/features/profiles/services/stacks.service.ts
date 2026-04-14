import { getAppMode } from '../../../config/app-mode'
import { demoStacksService } from './stacks.service.demo'
import { supabaseStacksService } from './stacks.service.supabase'

export type StackCategory =
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'database'
  | 'devops'
  | 'design'
  | 'tooling'
  | 'other'

export type StackItem = {
  id: string
  name: string
  slug: string
  category: StackCategory
}

export type StacksService = {
  listStacks: () => Promise<StackItem[]>
}

function getActiveStacksService(): StacksService {
  return getAppMode() === 'demo' ? demoStacksService : supabaseStacksService
}

export const stacksService: StacksService = {
  listStacks() {
    return getActiveStacksService().listStacks()
  },
}

export default stacksService
