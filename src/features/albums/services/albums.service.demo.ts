import { demoUsers } from '../../../features/demo/demo-data'
import type { GithubUser } from '../../../types/domain'
import type {
  Album,
  AlbumItem,
  AlbumsService,
} from './albums.service'

type DemoAlbumRecord = {
  id: string
  ownerProfileId: string
  name: string
  description: string | null
  isDefault: boolean
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

type DemoPlatformAlbumItemRecord = {
  id: string
  albumId: string
  source: 'platform'
  collectedProfileId: string
  addedAt: string
}

type DemoGithubAlbumItemRecord = {
  id: string
  albumId: string
  source: 'github'
  githubUserId: number
  githubLogin: string
  githubName: string | null
  githubAvatarUrl: string
  githubHtmlUrl: string
  githubBio: string | null
  githubLocation: string | null
  githubCompany: string | null
  githubBlog: string | null
  githubPublicRepos: number
  githubFollowers: number
  githubFollowing: number
  githubTotalStars: number
  githubTwitterUsername: string | null
  addedAt: string
  lastSyncedAt: string | null
}

type DemoAlbumItemRecord = DemoPlatformAlbumItemRecord | DemoGithubAlbumItemRecord

const now = new Date().toISOString()

const demoAlbumsStore: DemoAlbumRecord[] = [
  {
    id: 'demo-album-1',
    ownerProfileId: 'demo-user-1',
    name: 'Meu Álbum',
    description: 'Coleção principal do modo demo.',
    isDefault: true,
    isPublic: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-album-2',
    ownerProfileId: 'demo-user-2',
    name: 'Meu Álbum',
    description: 'Coleção principal do modo demo.',
    isDefault: true,
    isPublic: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-album-3',
    ownerProfileId: 'demo-user-3',
    name: 'Meu Álbum',
    description: 'Coleção principal do modo demo.',
    isDefault: true,
    isPublic: false,
    createdAt: now,
    updatedAt: now,
  },
]

const demoAlbumItemsStore: DemoAlbumItemRecord[] = [
  {
    id: 'demo-album-item-1',
    albumId: 'demo-album-1',
    source: 'platform',
    collectedProfileId: 'demo-user-2',
    addedAt: now,
  },
  {
    id: 'demo-album-item-2',
    albumId: 'demo-album-1',
    source: 'platform',
    collectedProfileId: 'demo-user-3',
    addedAt: now,
  },
]

function mapPlatformAlbumItem(record: DemoPlatformAlbumItemRecord): AlbumItem | null {
  const user = demoUsers.find((item) => item.id === record.collectedProfileId)

  if (!user) {
    return null
  }

  return {
    id: record.id,
    source: 'platform',
    profileId: user.id,
    username: user.username,
    fullName: user.fullName,
    headline: user.headline,
    avatarUrl: user.avatarUrl,
    location: user.location || null,
    addedAt: record.addedAt,
  }
}

function mapGithubAlbumItem(record: DemoGithubAlbumItemRecord): AlbumItem {
  return {
    id: record.id,
    source: 'github',
    profileId: null,
    username: record.githubLogin,
    fullName: record.githubName,
    headline: record.githubBio,
    avatarUrl: record.githubAvatarUrl,
    location: record.githubLocation,
    addedAt: record.addedAt,
    githubUserId: record.githubUserId,
    githubLogin: record.githubLogin,
    githubName: record.githubName,
    githubHtmlUrl: record.githubHtmlUrl,
    githubBio: record.githubBio,
    githubCompany: record.githubCompany,
    githubBlog: record.githubBlog,
    githubPublicRepos: record.githubPublicRepos,
    githubFollowers: record.githubFollowers,
    githubFollowing: record.githubFollowing,
    githubTotalStars: record.githubTotalStars,
    githubTwitterUsername: record.githubTwitterUsername,
    lastSyncedAt: record.lastSyncedAt,
  }
}

function mapAlbumItem(record: DemoAlbumItemRecord): AlbumItem | null {
  if (record.source === 'platform') {
    return mapPlatformAlbumItem(record)
  }

  return mapGithubAlbumItem(record)
}

function mapAlbum(record: DemoAlbumRecord): Album {
  const items = demoAlbumItemsStore
    .filter((item) => item.albumId === record.id)
    .map(mapAlbumItem)
    .filter((item): item is AlbumItem => Boolean(item))

  return {
    id: record.id,
    ownerProfileId: record.ownerProfileId,
    name: record.name,
    description: record.description,
    isDefault: record.isDefault,
    isPublic: record.isPublic,
    items,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }
}

function ensureOwner(albumId: string, ownerProfileId: string): DemoAlbumRecord {
  const album = demoAlbumsStore.find((item) => item.id === albumId)

  if (!album) {
    throw new Error('Álbum demo não encontrado.')
  }

  if (album.ownerProfileId !== ownerProfileId) {
    throw new Error('Você não pode modificar este álbum no modo demo.')
  }

  return album
}

export const demoAlbumsService: AlbumsService = {
  async listMyAlbums(ownerProfileId) {
    return demoAlbumsStore
      .filter((album) => album.ownerProfileId === ownerProfileId)
      .map(mapAlbum)
  },

  async getDefaultAlbum(ownerProfileId) {
    const album = demoAlbumsStore.find(
      (item) => item.ownerProfileId === ownerProfileId && item.isDefault,
    )

    return album ? mapAlbum(album) : null
  },

  async createAlbum(ownerProfileId, input) {
    const createdAt = new Date().toISOString()

    const album: DemoAlbumRecord = {
      id: `demo-album-${crypto.randomUUID()}`,
      ownerProfileId,
      name: input.name,
      description: input.description ?? null,
      isDefault: input.isDefault ?? false,
      isPublic: input.isPublic ?? false,
      createdAt,
      updatedAt: createdAt,
    }

    if (album.isDefault) {
      demoAlbumsStore.forEach((item, index) => {
        if (item.ownerProfileId === ownerProfileId) {
          demoAlbumsStore[index] = {
            ...item,
            isDefault: false,
          }
        }
      })
    }

    demoAlbumsStore.unshift(album)

    return mapAlbum(album)
  },

  async updateAlbum(albumId, ownerProfileId, input) {
    const album = ensureOwner(albumId, ownerProfileId)
    const albumIndex = demoAlbumsStore.findIndex((item) => item.id === album.id)

    demoAlbumsStore[albumIndex] = {
      ...album,
      name: input.name,
      description: input.description ?? null,
      isPublic: input.isPublic ?? album.isPublic,
      updatedAt: new Date().toISOString(),
    }

    return mapAlbum(demoAlbumsStore[albumIndex])
  },

  async deleteAlbum(albumId, ownerProfileId) {
    const album = ensureOwner(albumId, ownerProfileId)

    if (album.isDefault) {
      throw new Error('O álbum padrão não pode ser removido no modo demo.')
    }

    const albumIndex = demoAlbumsStore.findIndex((item) => item.id === album.id)
    demoAlbumsStore.splice(albumIndex, 1)

    for (let index = demoAlbumItemsStore.length - 1; index >= 0; index -= 1) {
      if (demoAlbumItemsStore[index].albumId === albumId) {
        demoAlbumItemsStore.splice(index, 1)
      }
    }
  },

  async addProfileToAlbum(albumId, ownerProfileId, collectedProfileId) {
    const album = ensureOwner(albumId, ownerProfileId)

    if (ownerProfileId === collectedProfileId) {
      throw new Error('Você não pode adicionar o próprio perfil ao álbum no modo demo.')
    }

    const exists = demoAlbumItemsStore.find(
      (item) =>
        item.albumId === album.id &&
        item.source === 'platform' &&
        item.collectedProfileId === collectedProfileId,
    )

    if (exists) {
      return
    }

    demoAlbumItemsStore.unshift({
      id: `demo-album-item-${crypto.randomUUID()}`,
      albumId,
      source: 'platform',
      collectedProfileId,
      addedAt: new Date().toISOString(),
    })
  },

  async removeProfileFromAlbum(albumId, ownerProfileId, collectedProfileId) {
    ensureOwner(albumId, ownerProfileId)

    const index = demoAlbumItemsStore.findIndex(
      (item) =>
        item.albumId === albumId &&
        item.source === 'platform' &&
        item.collectedProfileId === collectedProfileId,
    )

    if (index >= 0) {
      demoAlbumItemsStore.splice(index, 1)
    }
  },

  async isProfileInAlbum(albumId, collectedProfileId) {
    return demoAlbumItemsStore.some(
      (item) =>
        item.albumId === albumId &&
        item.source === 'platform' &&
        item.collectedProfileId === collectedProfileId,
    )
  },

  async addGithubUserToAlbum(albumId, ownerProfileId, githubUser: GithubUser) {
    ensureOwner(albumId, ownerProfileId)

    const exists = demoAlbumItemsStore.find(
      (item) =>
        item.albumId === albumId &&
        item.source === 'github' &&
        item.githubUserId === githubUser.id,
    )

    if (exists) {
      return
    }

    demoAlbumItemsStore.unshift({
      id: `demo-github-album-item-${crypto.randomUUID()}`,
      albumId,
      source: 'github',
      githubUserId: githubUser.id,
      githubLogin: githubUser.login,
      githubName: githubUser.name,
      githubAvatarUrl: githubUser.avatarUrl,
      githubHtmlUrl: githubUser.htmlUrl,
      githubBio: githubUser.bio,
      githubLocation: githubUser.location,
      githubCompany: githubUser.company,
      githubBlog: githubUser.blog,
      githubPublicRepos: githubUser.publicRepos,
      githubFollowers: githubUser.followers,
      githubFollowing: githubUser.following,
      githubTotalStars: githubUser.totalStars,
      githubTwitterUsername: githubUser.twitterUsername,
      addedAt: new Date().toISOString(),
      lastSyncedAt: new Date().toISOString(),
    })
  },

  async removeGithubUserFromAlbum(albumId, ownerProfileId, githubUserId) {
    ensureOwner(albumId, ownerProfileId)

    const index = demoAlbumItemsStore.findIndex(
      (item) =>
        item.albumId === albumId &&
        item.source === 'github' &&
        item.githubUserId === githubUserId,
    )

    if (index >= 0) {
      demoAlbumItemsStore.splice(index, 1)
    }
  },

  async isGithubUserInAlbum(albumId, githubUserId) {
    return demoAlbumItemsStore.some(
      (item) =>
        item.albumId === albumId &&
        item.source === 'github' &&
        item.githubUserId === githubUserId,
    )
  },
}
