import { getSupabaseClient } from '../../../lib/supabase/client'
import type { StackCategory, StackItem, StacksService } from './stacks.service'

type SupabaseStackRow = {
  id: string
  name: string
  slug: string
  category: string | null
}

export const supabaseStacksService: StacksService = {
  async listStacks(): Promise<StackItem[]> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('stacks')
      .select('id, name, slug, category')
      .order('name', { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    return ((data as SupabaseStackRow[] | null) ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      category: (row.category as StackCategory) ?? 'other',
    }))
  },
}
