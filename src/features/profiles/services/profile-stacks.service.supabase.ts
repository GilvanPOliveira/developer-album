import { getSupabaseClient } from '../../../lib/supabase/client'
import type {
  ProfileStackItem,
  ProfileStacksService,
  SaveProfileStacksInput,
} from './profile-stacks.service'

type SupabaseStackRow = {
  id: string
  name: string | null
  slug: string | null
  category: string | null
}

type SupabaseProfileStackRow = {
  id: string
  profile_id: string
  stack_id: string
  is_primary: boolean | null
  order_index: number | null
  stacks?: SupabaseStackRow[] | null
}

async function loadProfileStacks(profileId: string): Promise<ProfileStackItem[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('profile_stacks')
    .select('id, profile_id, stack_id, is_primary, order_index, stacks(id, name, slug, category)')
    .eq('profile_id', profileId)
    .order('order_index', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  const rows = ((data ?? []) as SupabaseProfileStackRow[])

  return rows.map((row) => {
    const stack = row.stacks?.[0] ?? null

    return {
      id: row.id,
      profileId: row.profile_id,
      stackId: row.stack_id,
      name: stack?.name ?? '',
      slug: stack?.slug ?? '',
      category: stack?.category ?? 'other',
      isPrimary: row.is_primary ?? false,
      orderIndex: row.order_index ?? 0,
    }
  })
}

export const supabaseProfileStacksService: ProfileStacksService = {
  async listProfileStacks(profileId: string): Promise<ProfileStackItem[]> {
    return loadProfileStacks(profileId)
  },

  async saveProfileStacks(profileId: string, items: SaveProfileStacksInput): Promise<ProfileStackItem[]> {
    const supabase = getSupabaseClient()

    const { error: deleteError } = await supabase.from('profile_stacks').delete().eq('profile_id', profileId)

    if (deleteError) {
      throw new Error(deleteError.message)
    }

    if (items.length > 0) {
      const payload = items.map((item) => ({
        profile_id: profileId,
        stack_id: item.stackId,
        is_primary: item.isPrimary,
        order_index: item.orderIndex,
      }))

      const { error: insertError } = await supabase.from('profile_stacks').insert(payload)

      if (insertError) {
        throw new Error(insertError.message)
      }
    }

    return loadProfileStacks(profileId)
  },
}
