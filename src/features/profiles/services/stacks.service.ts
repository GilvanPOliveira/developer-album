import { isDemoMode } from '../../../config/app-mode'
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

export const stacksService: StacksService = isDemoMode ? demoStacksService : supabaseStacksService

export default stacksService
