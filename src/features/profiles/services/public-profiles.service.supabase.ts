import { getSupabaseClient } from '../../../lib/supabase/client'
import type {
  PublicProfileListItem,
  PublicProfilesQuery,
  PublicProfilesResult,
  PublicProfilesService,
} from './public-profiles.service'

type SupabaseStackRow = {
  name: string | null
}

type SupabaseProfileStackRow = {
  is_primary: boolean | null
  stacks?: SupabaseStackRow[] | null
}

type SupabasePublicProfileRow = {
  id: string
  username: string
  full_name: string | null
  headline: string | null
  avatar_url: string | null
  location: string | null
  profile_stacks?: SupabaseProfileStackRow[] | null
}

function mapRow(row: SupabasePublicProfileRow): PublicProfileListItem {
  const primaryStacks =
    row.profile_stacks
      ?.filter((item) => item.is_primary)
      .map((item) => item.stacks?.[0]?.name ?? null)
      .filter((value): value is string => Boolean(value)) ?? []

  return {
    id: row.id,
    username: row.username,
    fullName: row.full_name ?? '',
    headline: row.headline ?? '',
    avatarUrl: row.avatar_url ?? '',
    location: row.location,
    primaryStacks,
  }
}

export const supabasePublicProfilesService: PublicProfilesService = {
  async listPublicProfiles(query: PublicProfilesQuery = {}): Promise<PublicProfilesResult> {
    const supabase = getSupabaseClient()

    const page = query.page && query.page > 0 ? query.page : 1
    const perPage = query.perPage && query.perPage > 0 ? query.perPage : 12
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let request = supabase
      .from('profiles')
      .select(
        'id, username, full_name, headline, avatar_url, location, profile_stacks(is_primary, stacks(name))',
        { count: 'exact' },
      )
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .range(from, to)

    if (query.search?.trim()) {
      const term = query.search.trim()
      request = request.or(`username.ilike.%${term}%,full_name.ilike.%${term}%,headline.ilike.%${term}%`)
    }

    const { data, error, count } = await request

    if (error) {
      throw new Error(error.message)
    }

    let items = ((data ?? []) as SupabasePublicProfileRow[]).map(mapRow)

    if (query.stack?.trim()) {
      const stack = query.stack.trim().toLowerCase()
      items = items.filter((item) => item.primaryStacks.some((itemStack) => itemStack.toLowerCase() === stack))
    }

    const total = count ?? items.length
    const totalPages = Math.max(1, Math.ceil(total / perPage))

    return {
      items,
      page,
      perPage,
      total,
      totalPages,
    }
  },
}
