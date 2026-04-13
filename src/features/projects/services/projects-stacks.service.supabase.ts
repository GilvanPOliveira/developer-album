import { getSupabaseClient } from '../../../lib/supabase/client'
import type {
  ProjectStackItem,
  ProjectsStacksService,
  SaveProjectStacksInput,
} from './projects-stacks.service'

type SupabaseStackRow = {
  id: string
  name: string | null
  slug: string | null
  category: string | null
}

type SupabaseProjectStackRow = {
  id: string
  project_id: string
  stack_id: string
  stacks?: SupabaseStackRow[] | null
}

async function loadProjectStacks(projectId: string): Promise<ProjectStackItem[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('project_stacks')
    .select('id, project_id, stack_id, stacks(id, name, slug, category)')
    .eq('project_id', projectId)

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as SupabaseProjectStackRow[]

  return rows.map((row) => {
    const stack = row.stacks?.[0] ?? null

    return {
      id: row.id,
      projectId: row.project_id,
      stackId: row.stack_id,
      name: stack?.name ?? '',
      slug: stack?.slug ?? '',
      category: stack?.category ?? 'other',
    }
  })
}

export const supabaseProjectsStacksService: ProjectsStacksService = {
  async listProjectStacks(projectId) {
    return loadProjectStacks(projectId)
  },

  async saveProjectStacks(projectId, items: SaveProjectStacksInput) {
    const supabase = getSupabaseClient()

    const { error: deleteError } = await supabase
      .from('project_stacks')
      .delete()
      .eq('project_id', projectId)

    if (deleteError) {
      throw new Error(deleteError.message)
    }

    if (items.length > 0) {
      const payload = items.map((item) => ({
        project_id: projectId,
        stack_id: item.stackId,
      }))

      const { error: insertError } = await supabase.from('project_stacks').insert(payload)

      if (insertError) {
        throw new Error(insertError.message)
      }
    }

    return loadProjectStacks(projectId)
  },
}
