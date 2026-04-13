import { getSupabaseClient } from '../../../lib/supabase/client'
import type { HomePublicData, HomePublicService } from './home-public.service'

type SupabaseStackRow = {
  name: string | null
}

type SupabaseProfileStackRow = {
  is_primary: boolean | null
  stacks?: SupabaseStackRow[] | null
}

type PublicProfileRow = {
  id: string
  username: string
  full_name: string | null
  headline: string | null
  avatar_url: string | null
  location: string | null
  is_public: boolean | null
  profile_stacks?: SupabaseProfileStackRow[] | null
}

function mapCard(row: PublicProfileRow) {
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
    isPublic: row.is_public ?? true,
  }
}

export const supabaseHomePublicService: HomePublicService = {
  async getHomePublicData(): Promise<HomePublicData> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('profiles')
      .select(
        'id, username, full_name, headline, avatar_url, location, is_public, profile_stacks(is_primary, stacks(name))',
      )
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .limit(12)

    if (error) {
      throw new Error(error.message)
    }

    const rows = ((data ?? []) as PublicProfileRow[])
    const cards = rows.map(mapCard)

    const stacks = Array.from(
      new Set(cards.flatMap((card) => card.primaryStacks).filter((stack) => stack.trim().length > 0)),
    )

    return {
      featuredProfiles: cards.slice(0, 6),
      recentProfiles: cards,
      stacks,
    }
  },
}
