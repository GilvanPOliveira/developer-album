import { getSupabaseClient } from '../../../lib/supabase/client'
import type { FavoritesService } from './favorites.service'

type SupabaseFavoriteProfileRow = {
  id: string
  username: string | null
  full_name: string | null
  headline: string | null
  avatar_url: string | null
  location: string | null
}

type SupabaseFavoriteRow = {
  id: string
  owner_profile_id: string
  target_profile_id: string
  created_at: string | null
  profiles?: SupabaseFavoriteProfileRow[] | null
}

export const supabaseFavoritesService: FavoritesService = {
  async listMyFavorites(ownerProfileId) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('favorites')
      .select(
        'id, owner_profile_id, target_profile_id, created_at, profiles:target_profile_id(id, username, full_name, headline, avatar_url, location)',
      )
      .eq('owner_profile_id', ownerProfileId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    const rows = (data ?? []) as SupabaseFavoriteRow[]

    return rows.map((row) => {
      const profile = row.profiles?.[0] ?? null

      return {
        id: row.id,
        ownerProfileId: row.owner_profile_id,
        targetProfileId: row.target_profile_id,
        username: profile?.username ?? '',
        fullName: profile?.full_name ?? '',
        headline: profile?.headline ?? '',
        avatarUrl: profile?.avatar_url ?? '',
        location: profile?.location ?? null,
        createdAt: row.created_at,
      }
    })
  },

  async addFavorite(ownerProfileId, targetProfileId) {
    if (ownerProfileId === targetProfileId) {
      throw new Error('Você não pode favoritar o próprio perfil.')
    }

    const supabase = getSupabaseClient()

    const { error } = await supabase.from('favorites').upsert(
      {
        owner_profile_id: ownerProfileId,
        target_profile_id: targetProfileId,
      },
      {
        onConflict: 'owner_profile_id,target_profile_id',
      },
    )

    if (error) {
      throw new Error(error.message)
    }
  },

  async removeFavorite(ownerProfileId, targetProfileId) {
    const supabase = getSupabaseClient()

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('owner_profile_id', ownerProfileId)
      .eq('target_profile_id', targetProfileId)

    if (error) {
      throw new Error(error.message)
    }
  },

  async isFavorite(ownerProfileId, targetProfileId) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('owner_profile_id', ownerProfileId)
      .eq('target_profile_id', targetProfileId)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    return Boolean(data)
  },
}
