import { getSupabaseClient } from '../../../lib/supabase/client'
import type { GithubUser } from '../../../types/domain'
import type { Album, AlbumItem, AlbumsService } from './albums.service'

type RelatedProfileRow = {
  id: string
  username: string | null
  full_name: string | null
  headline: string | null
  avatar_url: string | null
  location: string | null
}

type SupabaseAlbumRow = {
  id: string
  owner_profile_id: string
  name: string | null
  description: string | null
  is_default: boolean | null
  is_public: boolean | null
  created_at: string | null
  updated_at: string | null
}

type SupabaseAlbumItemRow = {
  id: string
  album_id: string
  source: 'platform' | 'github' | null
  collected_profile_id: string | null
  github_user_id: number | null
  github_login: string | null
  github_name: string | null
  github_avatar_url: string | null
  github_html_url: string | null
  github_bio: string | null
  github_location: string | null
  github_company: string | null
  github_blog: string | null
  github_public_repos: number | null
  github_followers: number | null
  github_following: number | null
  github_total_stars: number | null
  github_twitter_username: string | null
  added_at: string | null
  last_synced_at: string | null
  profiles?: RelatedProfileRow | RelatedProfileRow[] | null
}

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

function mapAlbumItem(row: SupabaseAlbumItemRow): AlbumItem | null {
  const source = row.source ?? 'platform'

  if (source === 'github') {
    return {
      id: row.id,
      source: 'github',
      profileId: null,
      username: row.github_login,
      fullName: row.github_name,
      headline: row.github_bio,
      avatarUrl: row.github_avatar_url,
      location: row.github_location,
      addedAt: row.added_at,
      githubUserId: row.github_user_id,
      githubLogin: row.github_login,
      githubName: row.github_name,
      githubHtmlUrl: row.github_html_url,
      githubBio: row.github_bio,
      githubCompany: row.github_company,
      githubBlog: row.github_blog,
      githubPublicRepos: row.github_public_repos ?? 0,
      githubFollowers: row.github_followers ?? 0,
      githubFollowing: row.github_following ?? 0,
      githubTotalStars: row.github_total_stars ?? 0,
      githubTwitterUsername: row.github_twitter_username,
      lastSyncedAt: row.last_synced_at,
    }
  }

  const profile = firstRelation(row.profiles)

  if (!profile || !row.collected_profile_id) {
    return null
  }

  return {
    id: row.id,
    source: 'platform',
    profileId: row.collected_profile_id,
    username: profile.username ?? '',
    fullName: profile.full_name ?? '',
    headline: profile.headline ?? '',
    avatarUrl: profile.avatar_url ?? '',
    location: profile.location ?? null,
    addedAt: row.added_at,
  }
}

async function loadAlbumItems(albumId: string): Promise<AlbumItem[]> {
  const itemsMap = await loadAlbumItemsMap([albumId])
  return itemsMap.get(albumId) ?? []
}

async function loadAlbumItemsMap(albumIds: string[]): Promise<Map<string, AlbumItem[]>> {
  if (albumIds.length === 0) {
    return new Map()
  }

  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('album_items')
    .select(`
      id,
      album_id,
      source,
      collected_profile_id,
      github_user_id,
      github_login,
      github_name,
      github_avatar_url,
      github_html_url,
      github_bio,
      github_location,
      github_company,
      github_blog,
      github_public_repos,
      github_followers,
      github_following,
      github_total_stars,
      github_twitter_username,
      added_at,
      last_synced_at,
      profiles:collected_profile_id(id, username, full_name, headline, avatar_url, location)
    `)
    .in('album_id', albumIds)
    .order('added_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  const itemsMap = new Map<string, AlbumItem[]>()

  for (const albumId of albumIds) {
    itemsMap.set(albumId, [])
  }

  for (const row of (data ?? []) as SupabaseAlbumItemRow[]) {
    const item = mapAlbumItem(row)

    if (!item) {
      continue
    }

    const albumItems = itemsMap.get(row.album_id) ?? []
    albumItems.push(item)
    itemsMap.set(row.album_id, albumItems)
  }

  return itemsMap
}

async function mapAlbum(row: SupabaseAlbumRow): Promise<Album> {
  const items = await loadAlbumItems(row.id)

  return {
    id: row.id,
    ownerProfileId: row.owner_profile_id,
    name: row.name ?? '',
    description: row.description,
    isDefault: row.is_default ?? false,
    isPublic: row.is_public ?? false,
    items,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function ensureOwnerAlbum(albumId: string, ownerProfileId: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('albums')
    .select('id')
    .eq('id', albumId)
    .eq('owner_profile_id', ownerProfileId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error('Álbum não encontrado.')
  }

  return data
}

export const supabaseAlbumsService: AlbumsService = {
  async listMyAlbums(ownerProfileId) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('albums')
      .select('id, owner_profile_id, name, description, is_default, is_public, created_at, updated_at')
      .eq('owner_profile_id', ownerProfileId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    const rows = (data as SupabaseAlbumRow[] | null) ?? []
    const itemsMap = await loadAlbumItemsMap(rows.map((row) => row.id))

    return rows.map((row) => ({
      id: row.id,
      ownerProfileId: row.owner_profile_id,
      name: row.name ?? '',
      description: row.description,
      isDefault: row.is_default ?? false,
      isPublic: row.is_public ?? false,
      items: itemsMap.get(row.id) ?? [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  },

  async getDefaultAlbum(ownerProfileId) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('albums')
      .select('id, owner_profile_id, name, description, is_default, is_public, created_at, updated_at')
      .eq('owner_profile_id', ownerProfileId)
      .eq('is_default', true)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    return data ? mapAlbum(data as SupabaseAlbumRow) : null
  },

  async createAlbum(ownerProfileId, input) {
    const supabase = getSupabaseClient()

    if (input.isDefault) {
      const { error: resetDefaultError } = await supabase
        .from('albums')
        .update({ is_default: false })
        .eq('owner_profile_id', ownerProfileId)

      if (resetDefaultError) {
        throw new Error(resetDefaultError.message)
      }
    }

    const { data, error } = await supabase
      .from('albums')
      .insert({
        owner_profile_id: ownerProfileId,
        name: input.name,
        description: input.description ?? null,
        is_default: input.isDefault ?? false,
        is_public: input.isPublic ?? false,
      })
      .select('id, owner_profile_id, name, description, is_default, is_public, created_at, updated_at')
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return mapAlbum(data as SupabaseAlbumRow)
  },

  async updateAlbum(albumId, ownerProfileId, input) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('albums')
      .update({
        name: input.name,
        description: input.description ?? null,
        is_public: input.isPublic,
      })
      .eq('id', albumId)
      .eq('owner_profile_id', ownerProfileId)
      .select('id, owner_profile_id, name, description, is_default, is_public, created_at, updated_at')
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return mapAlbum(data as SupabaseAlbumRow)
  },

  async deleteAlbum(albumId, ownerProfileId) {
    const supabase = getSupabaseClient()

    const { data: album, error: loadError } = await supabase
      .from('albums')
      .select('id, is_default')
      .eq('id', albumId)
      .eq('owner_profile_id', ownerProfileId)
      .maybeSingle()

    if (loadError) {
      throw new Error(loadError.message)
    }

    if (!album) {
      throw new Error('Álbum não encontrado.')
    }

    if (album.is_default) {
      throw new Error('O álbum padrão não pode ser removido.')
    }

    const { error } = await supabase
      .from('albums')
      .delete()
      .eq('id', albumId)
      .eq('owner_profile_id', ownerProfileId)

    if (error) {
      throw new Error(error.message)
    }
  },

  async addProfileToAlbum(albumId, ownerProfileId, collectedProfileId) {
    if (ownerProfileId === collectedProfileId) {
      throw new Error('Você não pode adicionar o próprio perfil ao álbum.')
    }

    await ensureOwnerAlbum(albumId, ownerProfileId)

    const supabase = getSupabaseClient()

    const { data: existing, error: existingError } = await supabase
      .from('album_items')
      .select('id')
      .eq('album_id', albumId)
      .eq('source', 'platform')
      .eq('collected_profile_id', collectedProfileId)
      .maybeSingle()

    if (existingError) {
      throw new Error(existingError.message)
    }

    if (existing) {
      return
    }

    const { error } = await supabase.from('album_items').insert({
      album_id: albumId,
      source: 'platform',
      collected_profile_id: collectedProfileId,
    })

    if (error) {
      throw new Error(error.message)
    }
  },

  async removeProfileFromAlbum(albumId, ownerProfileId, collectedProfileId) {
    await ensureOwnerAlbum(albumId, ownerProfileId)

    const supabase = getSupabaseClient()

    const { error } = await supabase
      .from('album_items')
      .delete()
      .eq('album_id', albumId)
      .eq('source', 'platform')
      .eq('collected_profile_id', collectedProfileId)

    if (error) {
      throw new Error(error.message)
    }
  },

  async isProfileInAlbum(albumId, collectedProfileId) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('album_items')
      .select('id')
      .eq('album_id', albumId)
      .eq('source', 'platform')
      .eq('collected_profile_id', collectedProfileId)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    return Boolean(data)
  },

  async addGithubUserToAlbum(albumId, ownerProfileId, githubUser: GithubUser) {
    await ensureOwnerAlbum(albumId, ownerProfileId)

    const supabase = getSupabaseClient()

    const { data: existing, error: existingError } = await supabase
      .from('album_items')
      .select('id')
      .eq('album_id', albumId)
      .eq('source', 'github')
      .eq('github_user_id', githubUser.id)
      .maybeSingle()

    if (existingError) {
      throw new Error(existingError.message)
    }

    if (existing) {
      return
    }

    const { error } = await supabase.from('album_items').insert({
      album_id: albumId,
      source: 'github',
      github_user_id: githubUser.id,
      github_login: githubUser.login,
      github_name: githubUser.name,
      github_avatar_url: githubUser.avatarUrl,
      github_html_url: githubUser.htmlUrl,
      github_bio: githubUser.bio,
      github_location: githubUser.location,
      github_company: githubUser.company,
      github_blog: githubUser.blog,
      github_public_repos: githubUser.publicRepos,
      github_followers: githubUser.followers,
      github_following: githubUser.following,
      github_total_stars: githubUser.totalStars,
      github_twitter_username: githubUser.twitterUsername,
      last_synced_at: new Date().toISOString(),
    })

    if (error) {
      throw new Error(error.message)
    }
  },

  async removeGithubUserFromAlbum(albumId, ownerProfileId, githubUserId) {
    await ensureOwnerAlbum(albumId, ownerProfileId)

    const supabase = getSupabaseClient()

    const { error } = await supabase
      .from('album_items')
      .delete()
      .eq('album_id', albumId)
      .eq('source', 'github')
      .eq('github_user_id', githubUserId)

    if (error) {
      throw new Error(error.message)
    }
  },

  async isGithubUserInAlbum(albumId, githubUserId) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('album_items')
      .select('id')
      .eq('album_id', albumId)
      .eq('source', 'github')
      .eq('github_user_id', githubUserId)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    return Boolean(data)
  },
}
