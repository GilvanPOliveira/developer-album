import { demoUsers } from '../../../features/demo/demo-data'
import type {
  PublicProfileListItem,
  PublicProfilesQuery,
  PublicProfilesResult,
  PublicProfilesService,
} from './public-profiles.service'

function getStacksForUser(userId: string): string[] {
  if (userId === 'demo-user-1') return ['Vue', 'TypeScript', 'Supabase']
  if (userId === 'demo-user-2') return ['Vue', 'TypeScript', 'Tailwind CSS']
  if (userId === 'demo-user-3') return ['Python', 'FastAPI', 'PostgreSQL']
  return []
}

function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage
  return items.slice(start, start + perPage)
}

export const demoPublicProfilesService: PublicProfilesService = {
  async listPublicProfiles(query: PublicProfilesQuery = {}): Promise<PublicProfilesResult> {
    const page = query.page && query.page > 0 ? query.page : 1
    const perPage = query.perPage && query.perPage > 0 ? query.perPage : 12
    const search = query.search?.trim().toLowerCase() ?? ''
    const stack = query.stack?.trim().toLowerCase() ?? ''

    let items: PublicProfileListItem[] = demoUsers
      .filter((user) => user.isPublic)
      .map((user) => ({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        headline: user.headline,
        avatarUrl: user.avatarUrl,
        location: user.location || null,
        primaryStacks: getStacksForUser(user.id),
      }))

    if (search) {
      items = items.filter((item) => {
        const haystack = `${item.fullName} ${item.username} ${item.headline}`.toLowerCase()
        return haystack.includes(search)
      })
    }

    if (stack) {
      items = items.filter((item) =>
        item.primaryStacks.some((itemStack) => itemStack.trim().toLowerCase() === stack),
      )
    }

    const total = items.length
    const totalPages = Math.max(1, Math.ceil(total / perPage))

    return {
      items: paginate(items, page, perPage),
      page,
      perPage,
      total,
      totalPages,
    }
  },
}
